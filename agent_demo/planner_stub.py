"""
This is a rule-based 'fake planner' that simulates Nemotron.
It looks at the user's goal text and decides what sequence of steps to take.
Each step is one action from the tool vocabulary (color, zoom, duck music, etc.).

Later, we'll replace this file with `planner_nemotron.py`, where Nemotron
produces the same Plan structure through function-calling.
"""

from .types import TaskSpec, Plan, Step

def plan_from_prompt(task: TaskSpec) -> Plan:
    goal = task.goal.lower()
    steps = []

    # --- Step 1: Color adjustment (cold cinematic tone) ---
    if "cinematic" in goal or "cold" in goal:
        steps.append(Step(
            action="adjust_color_eq",
            params={"brightness": 0.0, "contrast": 1.15, "saturation": 0.85, "temperature": "cool"},
            explain="Increase contrast and add cool tone for cinematic look",
            verify=["preview_exists"]
        ))

    # --- Step 2: Slow zoom for dramatic effect ---
    if "slow zoom" in goal or "dolly" in goal:
        steps.append(Step(
            action="add_keyframe_zoom",
            params={"from_scale": 1.00, "to_scale": 1.08, "duration_s": 5.0},
            explain="Gradually zoom in over the duration to add tension",
            verify=["preview_exists"]
        ))

    # --- Step 3: Lower background music under dialogue ---
    if "fade music" in goal or "duck" in goal or "dialogue" in goal:
        steps.append(Step(
            action="duck_music",
            params={"music_file": task.targets.get("music"), "duck_db": 10, "attack_ms": 200, "release_ms": 800},
            explain="Lower music volume when dialogue is present",
            verify=["preview_exists"]
        ))

    # --- Step 4: Always export a preview at the end ---
    steps.append(Step(
        action="export_preview",
        params={"quality": "medium"},
        explain="Render a short preview of the edited segment",
        verify=["file_exists"]
    ))

    return Plan(steps=steps)
