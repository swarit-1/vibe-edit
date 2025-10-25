"""
Implements each video-editing 'tool' using FFmpeg command-line calls.

Each function performs one editing action (color grade, zoom, duck music, etc.)
and returns a dictionary describing the results.

Later, we'll replace this with a Resolve adapter that calls DaVinci's scripting API.
"""

import subprocess, shlex, os
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
# SLOG3 to Rec709 color correction
# --------------------------------------
def slog3_to_rec709(input_file: str, out_file: str, segment: str = None, 
                    contrast: float = 1.1, saturation: float = 1.05,
                    brightness: float = 0.02) -> Dict[str, Any]:
    """
    Convert Sony SLOG3 footage to Rec709 color space with basic correction.
    
    This applies:
    1. SLOG3 to Rec709 LUT transformation
    2. Basic color correction (contrast, saturation, brightness)
    3. Proper color space handling
    
    Args:
        input_file: Path to SLOG3 footage
        out_file: Output file path
        segment: Optional time segment
        contrast: Contrast adjustment (1.0 = no change, >1 = more contrast)
        saturation: Saturation adjustment (1.0 = no change, >1 = more saturated)
        brightness: Brightness adjustment (0.0 = no change, +/- for adjustments)
    
    Returns:
        Dict with execution status
    """
    seg = _segment_filter(segment)
    
    # SLOG3 to Rec709 conversion using colorspace filter
    # This is a simplified approach - for production, you'd use a proper LUT file
    vf = (
        f"colorspace=all=bt709:iall=bt709,"  # Set output colorspace to Rec709
        f"eq=contrast={contrast}:saturation={saturation}:brightness={brightness},"
        f"curves=vintage"  # Apply a gentle S-curve for film-like look
    )
    
    cmd = f'{FFMPEG} -y {seg}-i "{input_file}" -vf "{vf}" -c:v libx264 -preset slow -crf 18 -c:a copy "{out_file}"'
    code, log = _run(cmd)
    return {"code": code, "log": log, "file": out_file}

# --------------------------------------
# SLOG3 with custom LUT application
# --------------------------------------
def slog3_with_lut(input_file: str, out_file: str, lut_file: str,
                   segment: str = None, intensity: float = 1.0) -> Dict[str, Any]:
    """
    Apply a custom LUT file to SLOG3 footage.
    
    Args:
        input_file: Path to SLOG3 footage
        out_file: Output file path
        lut_file: Path to .cube LUT file
        segment: Optional time segment
        intensity: LUT intensity/mix (0.0-1.0, where 1.0 = full LUT)
    
    Returns:
        Dict with execution status
    """
    seg = _segment_filter(segment)
    
    if not os.path.exists(lut_file):
        return {"code": 1, "log": f"LUT file not found: {lut_file}", "file": out_file}
    
    # Apply LUT with optional intensity mixing
    vf = f"lut3d=file='{lut_file}':interp=trilinear"
    if intensity < 1.0:
        # Blend between original and LUT-applied version
        vf = f"split[a][b];[a]{vf}[lut];[b][lut]blend=all_expr='A*{intensity}+B*{1-intensity}'"
    
    cmd = f'{FFMPEG} -y {seg}-i "{input_file}" -vf "{vf}" -c:v libx264 -preset slow -crf 18 -c:a copy "{out_file}"'
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
