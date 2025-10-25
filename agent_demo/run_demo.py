"""
Main entry point for the demo.
This script glues everything together and lets us test the full pipeline.

It simulates what a Nemotron-driven session will look like:
- User enters a natural-language goal
- Planner builds a plan (rule-based for now)
- Executor runs each step (via FFmpeg)
- Verifier checks outputs
"""

import argparse, os, json
from agent_demo.types import TaskSpec
from agent_demo.planner_stub import plan_from_prompt
from agent_demo.executor import Executor
from agent_demo.verifier import verify

def main():
    # ------------------ Parse CLI inputs ------------------
    ap = argparse.ArgumentParser(description="Agentic Video Editing Assistant (Demo)")
    ap.add_argument("--input", required=True, help="Input video file path")
    ap.add_argument("--segment", default=None, help="Time range, e.g. 00:00:00-00:00:10")
    ap.add_argument("--music", default=None, help="Optional background music file")
    ap.add_argument("--goal", required=True, help="Natural language goal, e.g. 'cold cinematic look with slow zoom'")
    args = ap.parse_args()

    # ------------------ Build a TaskSpec ------------------
    task = TaskSpec(
        goal=args.goal,
        targets={"input": args.input, "segment": args.segment, "music": args.music},
        constraints={"non_destructive": True},
        prefs={"preview_after_each_step": True}
    )

    # ------------------ Stage 1: Plan ------------------
    print(">> Planning...")
    plan = plan_from_prompt(task)
    print(json.dumps({"steps": [s.__dict__ for s in plan.steps]}, indent=2))

    # ------------------ Stage 2: Execute ------------------
    print("\n>> Executing...")
    ex = Executor(input_file=args.input, segment=args.segment, music=args.music)
    results = ex.execute(plan)

    # ------------------ Stage 3: Verify ------------------
    print("\n>> Verifying outputs...")
    ok, issues = verify(results)
    if ok:
        print("✅ All steps verified successfully!")
    else:
        print("❌ Issues detected:")
        for sid, msg in issues:
            print(f"  - {sid}: {msg}")

    # ------------------ Display final outputs ------------------
    print("\nResults Summary:")
    for r in results:
        print(f"{r.step_id}: {r.status} → {r.outputs.get('file', '')}")

    print("\nAll done!")

if __name__ == "__main__":
    main()
