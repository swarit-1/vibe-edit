"""
Implements each video-editing 'tool' using FFmpeg command-line calls.

Each function performs one editing action (color grade, zoom, duck music, etc.)
and returns a dictionary describing the results.

Later, you'll replace this with a Resolve adapter that calls DaVinci's scripting API.
"""

import subprocess, shlex
from typing import Dict, Any, Tuple

FFMPEG = "ffmpeg"
FFPROBE = "ffprobe"

# Utility: run a shell command and return (exit_code, output_text)
def _run(cmd: str) -> Tuple[int, str]:
    proc = subprocess.run(shlex.split(cmd), capture_output=True, text=True)
    return proc.returncode, (proc.stdout + "\n" + proc.stderr)

# Utility: convert "00:00:03-00:00:07" → "-ss 00:00:03 -to 00:00:07"
def _segment_filter(segment: str) -> str:
    if not segment: return ""
    start, end = segment.split("-")
    return f"-ss {start} -to {end} "

# --------------------------------------
# Color correction / temperature shift
# --------------------------------------
def adjust_color_eq(input_file: str, out_file: str, brightness: float, contrast: float,
                    saturation: float, temperature: str, segment: str = None) -> Dict[str, Any]:
    seg = _segment_filter(segment)
    temp_filter = "colorbalance=bs=0.05:bh=0.03" if temperature == "cool" else "colorbalance=rs=0.05:rh=0.03"
    vf = f"eq=brightness={brightness}:contrast={contrast}:saturation={saturation},{temp_filter}"
    cmd = f'{FFMPEG} -y {seg}-i "{input_file}" -vf "{vf}" -c:a copy "{out_file}"'
    code, log = _run(cmd)
    return {"code": code, "log": log, "file": out_file}

# --------------------------------------
# Add a smooth zoom-in using zoompan
# --------------------------------------
def add_keyframe_zoom(input_file: str, out_file: str, from_scale: float, to_scale: float,
                      duration_s: float, segment: str = None, fps: int = 30) -> Dict[str, Any]:
    seg = _segment_filter(segment)
    s1, s2 = from_scale, to_scale
    frames = max(1, int(duration_s * fps))
    zp = f"zoompan=z='if(eq(on,1),{s1},{s1}+({s2}-{s1})*(on-1)/{frames})':d=1:fps={fps}"
    cmd = f'{FFMPEG} -y {seg}-i "{input_file}" -vf "{zp},scale=iw:ih" -c:a copy "{out_file}"'
    code, log = _run(cmd)
    return {"code": code, "log": log, "file": out_file}

# --------------------------------------
# Sidechain compression: lower music under dialogue
# --------------------------------------
def duck_music(input_file: str, music_file: str, out_file: str, duck_db: int,
               attack_ms: int, release_ms: int, segment: str = None) -> Dict[str, Any]:
    seg = _segment_filter(segment)
    cmd = (f'{FFMPEG} -y {seg}-i "{input_file}" -i "{music_file}" '
           f'-filter_complex "[1:a][0:a]sidechaincompress=threshold=-20dB:ratio=6:attack={attack_ms}:release={release_ms}:'
           f'makeup=0:mix=1:sclevel=peak:wet=1[outa]" '
           f'-map 0:v -map "[outa]" -c:v copy -c:a aac "{out_file}"')
    code, log = _run(cmd)
    return {"code": code, "log": log, "file": out_file}

# --------------------------------------
# Export a short preview clip
# --------------------------------------
def export_preview(input_file: str, out_file: str, segment: str = None, quality: str = "medium") -> Dict[str, Any]:
    seg = _segment_filter(segment)
    vbit = {"low":"1500k","medium":"4000k","high":"8000k"}.get(quality,"4000k")
    cmd = f'{FFMPEG} -y {seg}-i "{input_file}" -c:v libx264 -b:v {vbit} -preset veryfast -c:a aac "{out_file}"'
    code, log = _run(cmd)
    return {"code": code, "log": log, "file": out_file}
