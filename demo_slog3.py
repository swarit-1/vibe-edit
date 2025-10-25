#!/usr/bin/env python3
"""
Demo script for SLOG3 color grading
This demonstrates the AI-powered SLOG3 to Rec709 conversion feature
"""

import sys
from agent_demo.types import TaskSpec, Plan, Step
from agent_demo.executor import Executor
from agent_demo.verifier import verify

def main():
    if len(sys.argv) < 2:
        print("Usage: python demo_slog3.py <slog3_video_file> [--segment 00:00:00-00:00:10]")
        print("\nExample:")
        print("  python demo_slog3.py footage/slog3_clip.mp4")
        print("  python demo_slog3.py footage/slog3_clip.mp4 --segment 00:00:05-00:00:15")
        sys.exit(1)
    
    input_file = sys.argv[1]
    segment = None
    
    # Parse optional segment argument
    if len(sys.argv) > 2 and sys.argv[2] == "--segment":
        if len(sys.argv) > 3:
            segment = sys.argv[3]
    
    print("=" * 60)
    print("🎨 SLOG3 Color Grading Demo")
    print("=" * 60)
    print(f"\nInput: {input_file}")
    if segment:
        print(f"Segment: {segment}")
    print("\n" + "=" * 60)
    
    # Create a simple plan for SLOG3 color correction
    plan = Plan(steps=[
        Step(
            action="slog3_to_rec709",
            params={
                "contrast": 1.15,      # Slightly increased contrast
                "saturation": 1.08,    # Slightly boosted saturation
                "brightness": 0.03     # Slight brightness lift
            },
            explain="Convert SLOG3 to Rec709 with optimized color correction for natural look",
            verify=["file_exists"]
        ),
        Step(
            action="export_preview",
            params={"quality": "high"},
            explain="Export high-quality preview",
            verify=["file_exists"]
        )
    ])
    
    print("\n📋 Plan:")
    for i, step in enumerate(plan.steps, 1):
        print(f"  Step {i}: {step.action}")
        print(f"    → {step.explain}")
        print(f"    Parameters: {step.params}")
    
    print("\n" + "=" * 60)
    print("🚀 Executing plan...")
    print("=" * 60 + "\n")
    
    # Execute the plan
    executor = Executor(input_file=input_file, segment=segment, out_dir="outputs")
    results = executor.execute(plan)
    
    print("\n" + "=" * 60)
    print("✅ Verification")
    print("=" * 60 + "\n")
    
    # Verify results
    ok, issues = verify(results)
    
    if ok:
        print("✅ All steps completed successfully!")
    else:
        print("❌ Some steps failed:")
        for step_id, error in issues:
            print(f"  - {step_id}: {error}")
    
    print("\n" + "=" * 60)
    print("📁 Output Files")
    print("=" * 60 + "\n")
    
    # Display results
    for result in results:
        status_icon = "✅" if result.status == "ok" else "❌"
        print(f"{status_icon} {result.step_id}: {result.status}")
        if "file" in result.outputs:
            print(f"   File: {result.outputs['file']}")
    
    print("\n" + "=" * 60)
    print("🎬 Done!")
    print("=" * 60)
    print("\nYour color-corrected footage is in the 'outputs/' directory")
    print("Compare the original SLOG3 with the Rec709 conversion!")

if __name__ == "__main__":
    main()
