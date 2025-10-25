"""
Checks whether each execution step produced a valid video file.

If a step fails or produces an empty/invalid clip, the verifier flags it.
Later, this can feed back into the Planner for automatic repair.
"""

import os
from typing import List
from .types import ExecResult

def verify(results: List[ExecResult], min_duration: float = 0.5):
    ok = True
    issues = []
    for r in results:
        if r.status != "ok":
            ok = False
            issues.append((r.step_id, r.error or "unknown error"))
            continue
        f = r.outputs.get("file")
        if not f or not os.path.exists(f):
            ok = False
            issues.append((r.step_id, "output file missing"))
    return ok, issues
