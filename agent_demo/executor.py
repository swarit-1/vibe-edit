"""
Executes each Step in the Plan by calling the appropriate adapter function.

The Executor is generic: it doesn’t know whether it’s using FFmpeg or DaVinci —
it just calls functions defined in the adapter.

It also chains outputs: the result of step N becomes the input for step N+1.
"""

import os
from typing import Dict, Callable
from .types import Plan, ExecResult
from adapters import ffmpeg_adapter as fx  # can swap to resolve_adapter later

class Executor:
    def __init__(self, input_file: str, segment: str = None, music: str = None, out_dir: str = "outputs"):
        self.input = input_file
        self.segment = segment
        self.music = music
        os.makedirs(out_dir, exist_ok=True)
        self.out_dir = out_dir
        self.curr_file = input_file  # start with original input
        # Registry maps action names to local handler functions
        self.registry: Dict[str, Callable] = {
            "adjust_color_eq": self._do_adjust_color_eq,
            "add_keyframe_zoom": self._do_add_keyframe_zoom,
            "duck_music": self._do_duck_music,
            "export_preview": self._do_export_preview,
        }

    # Main execution loop
    def execute(self, plan: Plan):
        results = []
        for i, step in enumerate(plan.steps, start=1):
            fn = self.registry.get(step.action)
            if not fn:
                results.append(ExecResult(step_id=f"S{i}", status="error", outputs={}, error=f"Unknown action {step.action}"))
                continue
            # Run the function corresponding to this action
            res = fn(i, step.params)
            results.append(res)
            # Chain outputs: use the new file as next input
            if res.status == "ok" and "file" in res.outputs and os.path.exists(res.outputs["file"]):
                self.curr_file = res.outputs["file"]
        return results

    # Helper to build output filenames
    def _outfile(self, label: str, i: int) -> str:
        return os.path.join(self.out_dir, f"step_{i:02d}_{label}.mp4")

    # Each of the following wraps a function from the FFmpeg adapter

    def _do_adjust_color_eq(self, i: int, p: dict) -> ExecResult:
        out = self._outfile("color", i)
        meta = fx.adjust_color_eq(self.curr_file, out,
                                  brightness=p.get("brightness", 0.0),
                                  contrast=p.get("contrast", 1.0),
                                  saturation=p.get("saturation", 1.0),
                                  temperature=p.get("temperature", "cool"),
                                  segment=self.segment)
        status = "ok" if meta["code"] == 0 else "error"
        return ExecResult(step_id=f"S{i}", status=status, outputs={"file": out, "log": meta["log"]},
                          error=None if status=="ok" else "ffmpeg error")

    def _do_add_keyframe_zoom(self, i: int, p: dict) -> ExecResult:
        out = self._outfile("zoom", i)
        meta = fx.add_keyframe_zoom(self.curr_file, out,
                                    from_scale=p.get("from_scale", 1.0),
                                    to_scale=p.get("to_scale", 1.05),
                                    duration_s=p.get("duration_s", 5.0),
                                    segment=self.segment)
        status = "ok" if meta["code"] == 0 else "error"
        return ExecResult(step_id=f"S{i}", status=status, outputs={"file": out, "log": meta["log"]},
                          error=None if status=="ok" else "ffmpeg error")

    def _do_duck_music(self, i: int, p: dict) -> ExecResult:
        out = self._outfile("duck", i)
        music = p.get("music_file", self.music)
        if not music:
            return ExecResult(step_id=f"S{i}", status="error", outputs={}, error="music_file not provided")
        meta = fx.duck_music(self.curr_file, music, out,
                             duck_db=p.get("duck_db", 10),
                             attack_ms=p.get("attack_ms", 200),
                             release_ms=p.get("release_ms", 800),
                             segment=self.segment)
        status = "ok" if meta["code"] == 0 else "error"
        return ExecResult(step_id=f"S{i}", status=status, outputs={"file": out, "log": meta["log"]},
                          error=None if status=="ok" else "ffmpeg error")

    def _do_export_preview(self, i: int, p: dict) -> ExecResult:
        out = self._outfile("preview", i)
        meta = fx.export_preview(self.curr_file, out,
                                 segment=self.segment, quality=p.get("quality", "medium"))
        status = "ok" if meta["code"] == 0 else "error"
        return ExecResult(step_id=f"S{i}", status=status, outputs={"file": out, "log": meta["log"]},
                          error=None if status=="ok" else "ffmpeg error")
