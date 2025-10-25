# Vibe Edit - AI Video Editing Assistant

Transform DaVinci Resolve with natural language commands. Edit videos as naturally as conducting an orchestra.

## 🎯 New Feature: SLOG3 Color Grading

We've added AI-powered SLOG3 to Rec709 color correction! Perfect for Sony camera footage.

**Quick Start:**
```bash
# Setup (one time)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run SLOG3 color correction
python demo_slog3.py your_slog3_footage.mp4
```

📖 **Full setup guide**: See [SETUP.md](SETUP.md) for detailed instructions.

---

## Project Overview

This project consists of two main parts:

### 1. Frontend - Next.js Marketing Site

Beautiful landing page showcasing the product.

**To run:**

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 2. Backend - Python Agent System

AI-powered video editing pipeline that processes footage using natural language commands.

**Features:**
- ✅ SLOG3 to Rec709 color correction
- ✅ Color grading with contrast, saturation, brightness controls
- ✅ Custom LUT application
- ✅ Keyframe zoom effects
- ✅ Audio ducking
- 🚧 NVIDIA Nemotron AI planner (coming soon)
- 🚧 DaVinci Resolve API integration (coming soon)

**To run:**
```bash
# Setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Test with SLOG3 footage
python demo_slog3.py your_video.mp4

# Or use general demo
python agent_demo/run_demo.py \
  --input video.mp4 \
  --goal "cinematic color grade" \
  --segment "00:00:00-00:00:10"
```

---

## Documentation

- 📘 **[SETUP.md](SETUP.md)** - Complete setup guide with troubleshooting
- 📘 **[sys_arch.md](sys_arch.md)** - System architecture and design
- 📘 **[agent_demo/README.md](agent_demo/README.md)** - Agent system details

---

## Architecture

The system uses an **agentic AI pattern**:

```
User Command → Planner → Executor → Video Tools → Output
                  ↑                        ↓
                  └─── Verifier & Feedback ─┘
```

**Key Components:**
- **Planner**: Converts natural language to structured editing steps
- **Executor**: Runs each step through tool adapters
- **Adapters**: FFmpeg (current) or DaVinci Resolve (future)
- **Verifier**: Checks results and triggers repairs if needed

---

## Quick Examples

### SLOG3 Color Correction
```bash
python demo_slog3.py footage.mp4 --segment 00:00:05-00:00:15
```

### General Editing
```bash
python agent_demo/run_demo.py \
  --input video.mp4 \
  --goal "cold cinematic look with slow zoom"
```

### With Custom Parameters
```python
from agent_demo.types import Plan, Step
from agent_demo.executor import Executor

plan = Plan(steps=[
    Step(
        action="slog3_to_rec709",
        params={
            "contrast": 1.2,
            "saturation": 1.1,
            "brightness": 0.05
        }
    )
])

executor = Executor(input_file="video.mp4")
results = executor.execute(plan)
```

---

## Roadmap

### ✅ Phase 1: Foundation (Complete)
- Virtual environment setup
- SLOG3 color grading
- FFmpeg adapter
- Basic agent architecture

### 🚧 Phase 2: AI Integration (In Progress)
- NVIDIA Nemotron planner
- Natural language understanding
- Intelligent parameter selection

### 📋 Phase 3: Professional Tools (Planned)
- DaVinci Resolve API
- Real-time preview
- Advanced color grading
- Multi-track editing

---

## Tech Stack

**Frontend:**
- Next.js 15, React 19, TypeScript
- TailwindCSS v4, Framer Motion
- Radix UI components

**Backend:**
- Python 3.9+
- FFmpeg for video processing
- LangGraph for agent orchestration (future)
- NVIDIA Nemotron for AI planning (future)

---

## Contributing

This is a hackathon project! Feel free to:
- Test the SLOG3 feature with your footage
- Report issues
- Suggest improvements
- Add new editing operations

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [DaVinci Resolve Scripting](https://www.blackmagicdesign.com/developer/product/davinci-resolve)
- [NVIDIA Nemotron](https://developer.nvidia.com/blog/build-a-report-generator-ai-agent-with-nvidia-nemotron-on-openrouter/)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)

---

## License

See [LICENSE](LICENSE) file for details.
