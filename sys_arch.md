# Agentic Video Editing Assistant — System Architecture & Workflow

## Overview
Nemotron acts as the **reasoning brain**, while DaVinci Resolve serves as the **editing engine**.  
Nemotron never directly manipulates the timeline; instead, it outputs **structured JSON instructions** that the Python **Tool Adapter** executes via DaVinci’s scripting API.

This mirrors how an LLM “uses” libraries like NumPy — Nemotron decides what to call, the adapter actually runs it.

---

## Architecture Diagram

```mermaid
flowchart TD
    A[User Interface<br>(User enters natural-language editing command)] --> B[Intent Ingest & Context Builder<br>Parses input and timeline context → outputs TaskSpec JSON]
    B --> C[Planner (Nemotron)<br>Generates ordered step-by-step Plan]
    C --> D[Action Vocabulary & Tool Adapter<br>Maps actions to DaVinci Resolve or MoviePy APIs]
    D --> E[Executor<br>Runs each step, supports dry-run preview & undo]
    E --> F[Verifier & Critic<br>Checks results, triggers plan repair if needed]
    F --> C
    E --> G[Explainer UI<br>Shows steps with reasoning and manual instructions]
    G --> H[User]
    E --> I[State Store & Audit Log<br>Records prompt, plan, results, previews]
    D -.-> J[(DaVinci Resolve API / MoviePy-FFmpeg)]
    subgraph Safety & Guardrails
        K[Sandboxed API Calls<br>Autosave & Confirmation Gates]
    end
    E --> K
````

---

## Execution Flow

1. **User Input**
   Example: “Make this clip look cinematic and add a slow zoom.”

2. **Nemotron Reasoning**
   Produces a plan in JSON:

   ```json
   {
     "steps": [
       {"action": "apply_LUT", "params": {"clip_id": "C01", "lut_name": "TealAndOrange", "mix": 0.4}},
       {"action": "add_keyframes", "params": {"property": "zoom", "from": 1.0, "to": 1.08, "duration_s": 5.0}}
     ]
   }
   ```

3. **Executor / Tool Adapter**
   The Python adapter translates actions into DaVinci API calls:

   ```python
   def apply_LUT(clip_id, lut_name, mix=0.5):
       clip = project.GetClipById(clip_id)
       clip.ApplyLUT(lut_name)
       clip.SetLUTMix(mix)
   ```

4. **Verifier & Feedback Loop**
   Verifies success, requests plan repair if needed.

5. **Explainer UI**
   Displays each step with reasoning and step-by-step manual guidance.

---

## Design Benefits

* **Tool-Agnostic:** The adapter layer can later support Premiere, After Effects, or Blender.
* **Safe Execution:** Nemotron outputs structured instructions; no arbitrary code execution.
* **Transparent & Auditable:** Every step is logged as JSON and shown to the user.
* **Teachable:** Each action includes rationale, turning automation into a learning tool.

---

## Future Extensions

* **Vision analysis:** Scene and emotion detection.
* **Beat alignment:** Auto-sync cuts to music.
* **Collaborative mode:** Share and replay “edit recipes.”
* **Voice interaction:** “Make it feel like a documentary,” and the agent plans accordingly.
