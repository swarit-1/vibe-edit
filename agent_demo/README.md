# 🎬 Agentic Video Editing Assistant (Demo)

This is a **Nemotron-ready MVP** of an *agentic video editor*.
It turns a natural-language instruction like

> “Make this clip look cinematic and add a slow zoom”
> into a sequence of executable video-editing steps.

The current version uses **FFmpeg** as a backend for quick testing.
Nemotron and DaVinci Resolve integration will plug into the same interfaces later.

---

## 🧩 Project Structure

```
repo/
├── run_demo.py                # main entry point
├── agent/
│   ├── types.py               # data models (TaskSpec, Plan, Step, ExecResult)
│   ├── planner_stub.py        # rule-based planner (mock Nemotron)
│   ├── executor.py            # runs actions via adapter functions
│   └── verifier.py            # checks outputs
└── adapters/
    ├── ffmpeg_adapter.py      # FFmpeg implementations of edit actions
    └── resolve_adapter.py     # placeholder for DaVinci scripting API
```

---

## ⚙️ Requirements

* **Python 3.9+**
* **FFmpeg** installed and available in your PATH

You can test installation by running:

```bash
ffmpeg -version
```

---

## 🚀 How to Run the Demo

1. Place your test media in `assets/` (or any path you prefer):

   ```
   assets/clip.mp4
   assets/music.mp3
   ```

2. Run the demo:

   ```bash
   python run_demo.py \
       --input assets/clip.mp4 \
       --segment 00:00:00-00:00:06 \
       --music assets/music.mp3 \
       --goal "cold cinematic look with slow zoom and fade music under dialogue"
   ```

3. The program will:

   * **Plan** a sequence of editing steps (color, zoom, ducking, preview)
   * **Execute** them via FFmpeg
   * **Verify** that each output file was generated

4. Output clips and logs appear in the `outputs/` folder:

   ```
   outputs/
     step_01_color.mp4
     step_02_zoom.mp4
     step_03_duck.mp4
     step_04_preview.mp4
   ```

---

## 🧠 Next Steps

* Swap `planner_stub.py` → **`planner_nemotron.py`** (Nemotron reasoning via OpenRouter).
* Replace `ffmpeg_adapter.py` → **`resolve_adapter.py`** (DaVinci scripting).
* Add `graph.py` using **LangGraph** for planner–executor–verifier loops.

---

## 🏗️ Quick Command Recap

| Action         | Command                                                            |
| -------------- | ------------------------------------------------------------------ |
| Run demo       | `python run_demo.py --input clip.mp4 --goal "cold cinematic look"` |
| Change segment | `--segment 00:00:10-00:00:20`                                      |
| Skip music     | omit `--music`                                                     |
| Clean outputs  | `rm -rf outputs/*`                                                 |

