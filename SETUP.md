# Vibe Edit - Setup Guide

## Quick Start for SLOG3 Color Grading Feature

This guide will help you set up the project and test the new SLOG3 color grading feature in just a few minutes!

---

## Prerequisites

### Required Software

1. **Python 3.9+**
   ```bash
   python3 --version  # Should be 3.9 or higher
   ```

2. **FFmpeg** (for video processing)
   ```bash
   # macOS
   brew install ffmpeg
   
   # Linux (Ubuntu/Debian)
   sudo apt update && sudo apt install ffmpeg
   
   # Verify installation
   ffmpeg -version
   ```

### Optional (for AI features later)

- OpenRouter API key for NVIDIA Nemotron (sign up at https://openrouter.ai)

---

## Installation Steps

### 1. Clone or Navigate to Project

```bash
cd /path/to/vibe-edit
```

### 2. Create Virtual Environment

```bash
# Create venv
python3 -m venv venv

# Activate it
# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

### 3. Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This installs the minimal dependencies needed for the demo. The AI features (NVIDIA Nemotron) are optional for now.

### 4. Verify Installation

```bash
python -c "from agent_demo import ffmpeg_adapter; print('✅ Installation successful!')"
```

---

## Testing the SLOG3 Feature

### Basic Test (No SLOG3 footage needed)

If you don't have SLOG3 footage, you can test with any video:

```bash
# Download a test video
curl -o test.mp4 "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4"

# Run basic color grading (works on any footage)
python run_demo.py \
  --input test.mp4 \
  --goal "cinematic color grade" \
  --segment "00:00:00-00:00:05"
```

### SLOG3 Specific Test

If you have SLOG3 footage from a Sony camera:

```bash
# Run SLOG3 color correction
python demo_slog3.py your_slog3_footage.mp4

# Or with a specific segment
python demo_slog3.py your_slog3_footage.mp4 --segment 00:00:05-00:00:15
```

### What the Demo Does

The `demo_slog3.py` script:

1. **Converts SLOG3 → Rec709**: Transforms Sony's log color space to standard viewing color space
2. **Applies Color Correction**: 
   - Increases contrast slightly (1.15x)
   - Boosts saturation (1.08x)
   - Lifts brightness slightly (+0.03)
3. **Adds Film-like Curve**: Applies a vintage S-curve for cinematic look
4. **Exports High-Quality Preview**: Creates a viewable version

### Output Location

All processed videos are saved to the `outputs/` directory:

```
outputs/
├── step_01_slog3_corrected.mp4  # Color corrected
└── step_02_preview.mp4           # Final preview
```

---

## Advanced Usage

### Using Custom LUTs

If you have a `.cube` LUT file:

```python
from agent_demo.types import Plan, Step
from agent_demo.executor import Executor

plan = Plan(steps=[
    Step(
        action="slog3_with_lut",
        params={
            "lut_file": "path/to/your.cube",
            "intensity": 0.8  # 80% LUT strength
        },
        explain="Apply custom LUT to SLOG3 footage"
    )
])

executor = Executor(input_file="your_video.mp4")
results = executor.execute(plan)
```

### Adjusting Color Parameters

You can fine-tune the color correction:

```python
Step(
    action="slog3_to_rec709",
    params={
        "contrast": 1.2,      # More contrast (1.0 = no change)
        "saturation": 1.1,    # More saturated colors
        "brightness": 0.05    # Slightly brighter
    }
)
```

---

## Frontend (Next.js Website)

The project also includes a marketing website. To run it:

```bash
# Install Node dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Then open http://localhost:3000 in your browser.

---

## Troubleshooting

### FFmpeg Not Found

**Error**: `ffmpeg: command not found`

**Solution**: 
```bash
# macOS
brew install ffmpeg

# Linux
sudo apt install ffmpeg
```

### Import Errors

**Error**: `ModuleNotFoundError: No module named 'agent_demo'`

**Solution**: Make sure you're in the project root and virtual environment is activated:
```bash
cd /path/to/vibe-edit
source venv/bin/activate
python demo_slog3.py your_video.mp4
```

### Video Processing Fails

**Error**: FFmpeg errors during processing

**Solutions**:
1. Check that input video file exists and is readable
2. Verify FFmpeg installation: `ffmpeg -version`
3. Try a shorter segment first: `--segment 00:00:00-00:00:03`
4. Check the `outputs/` directory for error logs

### Permission Issues

**Error**: Permission denied when creating outputs

**Solution**:
```bash
mkdir outputs
chmod 755 outputs
```

---

## What's Next?

### Phase 1: Current (✅ Complete!)
- [x] Virtual environment setup
- [x] SLOG3 to Rec709 conversion
- [x] Basic color correction
- [x] FFmpeg adapter working

### Phase 2: AI Integration (Coming Soon)
- [ ] Replace rule-based planner with NVIDIA Nemotron
- [ ] Intelligent color grading suggestions
- [ ] Natural language commands

### Phase 3: DaVinci Resolve
- [ ] DaVinci Resolve API integration
- [ ] Professional color grading tools
- [ ] Real-time preview in Resolve

---

## Getting Help

1. **Check the documentation**: See `agent_demo/README.md` for more details
2. **Example workflows**: Look at `demo_slog3.py` and `run_demo.py`
3. **Architecture**: See `sys_arch.md` for system design

---

## File Structure Overview

```
vibe-edit/
├── venv/                      # Virtual environment (you create this)
├── requirements.txt           # Python dependencies
├── .env.example              # Example environment variables
├── demo_slog3.py             # SLOG3 color grading demo
├── agent_demo/               # Agent backend code
│   ├── types.py              # Data structures
│   ├── executor.py           # Execution engine
│   ├── ffmpeg_adapter.py     # FFmpeg operations (inc. SLOG3)
│   ├── planner_stub.py       # Rule-based planner
│   ├── verifier.py           # Result verification
│   └── run_demo.py           # Main demo script
├── src/                      # Next.js frontend
└── outputs/                  # Processed videos (auto-created)
```

---

## Quick Command Reference

```bash
# Setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run SLOG3 demo
python demo_slog3.py your_footage.mp4

# Run general demo
python run_demo.py --input video.mp4 --goal "cinematic look"

# Frontend
npm run dev

# Deactivate venv when done
deactivate
```

---

## Success! 🎉

You're all set! Try processing your first SLOG3 clip:

```bash
python demo_slog3.py your_slog3_footage.mp4
```

The corrected footage will be in `outputs/step_01_slog3_corrected.mp4`!
