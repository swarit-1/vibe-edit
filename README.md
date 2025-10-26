# Vibe Edit - AI-Powered DaVinci Resolve Copilot

Control DaVinci Resolve with natural language. Edit videos as naturally as having a conversation.

## 🎯 What is Vibe Edit?

Vibe Edit is an AI assistant that bridges the gap between you and DaVinci Resolve. Instead of clicking through menus and learning complex shortcuts, just tell the AI what you want to do.

**Examples:**
- "Balance the colors on the selected clip"
- "Add a slow zoom effect to this shot"
- "Normalize audio levels across all clips"
- "Export this timeline as ProRes 422"

---

## 🚀 Quick Start

### Prerequisites
- **DaVinci Resolve** (Free or Studio) installed and running
- **Node.js 18+** for the web interface
- **Anthropic API Key** for Claude AI

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```env
ANTHROPIC_API_KEY=sk-ant-api03-...your-key-here...
```

### 3. Start the Web Interface

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Start the DaVinci Resolve Bridge

Open **DaVinci Resolve** → **Workspace** → **Console**, then run:

```python
import sys
sys.path.append('/path/to/vibe-edit')
exec(open('/path/to/vibe-edit/bridge/bridge.py').read())
```

Replace `/path/to/vibe-edit` with the actual path to this project.

You should see:
```
[bridge] listening on 127.0.0.1:8765
```

### 5. Start Editing!

Go to [http://localhost:3000](http://localhost:3000) and start chatting with the AI copilot!

---

## 📖 How It Works

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│  Next.js    │─────▶│  Claude AI   │─────▶│  DaVinci        │
│  Web App    │      │  (Anthropic) │      │  Resolve        │
│  :3000      │      │              │      │  Bridge :8765   │
└─────────────┘      └──────────────┘      └─────────────────┘
```

1. **You** type a natural language command in the web interface
2. **Claude AI** (via Anthropic API) understands your intent and generates the appropriate DaVinci Resolve script
3. **Python Bridge** executes the script inside DaVinci Resolve
4. **Results** are returned to the web interface

---

## 🛠️ Architecture

### Frontend (Next.js)
- **Web Interface**: Beautiful chat UI for interacting with the AI
- **API Routes**: Handles communication with Claude AI
- **Real-time Streaming**: Shows AI responses as they're generated

### Bridge (Python)
- **Socket Server**: Listens on port 8765 for commands from the web app
- **DaVinci Resolve API**: Executes Python scripts inside Resolve's environment
- **Runs Inside Resolve**: The bridge must run within DaVinci Resolve's Python console

### AI Layer (Claude)
- **Natural Language Understanding**: Interprets your editing requests
- **Code Generation**: Creates Python scripts for DaVinci Resolve
- **Tool Calling**: Automatically selects the right Resolve APIs to use

---

## 📁 Project Structure

```
vibe-edit/
├── app/                    # Next.js app directory
│   ├── api/chat/          # Claude AI integration
│   └── page.tsx           # Main chat interface
├── components/            # React components
│   └── chat-shell.tsx    # Main chat component
├── actions/               # Server actions
│   ├── resolve.ts        # Bridge communication
│   └── chat.ts           # Chat handlers
├── bridge/                # DaVinci Resolve bridge
│   └── bridge.py         # Python socket server (runs in Resolve)
├── lib/                   # Utilities
│   └── resolve-tools.ts  # Tool definitions for AI
├── types/                 # TypeScript types
├── public/               # Static assets
└── .env                  # Environment variables (create this)
```

---

## 🎨 Available Commands

The AI can help you with:

### Color Grading
- Adjust contrast, saturation, and brightness
- Apply LUTs
- Color balance corrections
- Reset grades to neutral

### Timeline Editing
- Get timeline information
- Navigate between clips
- Select specific clips
- Get project details

### Python Scripting
- Run custom Python scripts in Resolve
- Access the full DaVinci Resolve API
- Automate repetitive tasks

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key for Claude | ✅ Yes |

### Bridge Configuration

The bridge runs on **127.0.0.1:8765** by default. You can change this in `bridge/bridge.py`:

```python
HOST, PORT = "127.0.0.1", 8765
```

---

## 🐛 Troubleshooting

### "ANTHROPIC_API_KEY is not set"
Make sure you created a `.env` file in the project root with your API key, then restart the Next.js server.

### "Connection refused" or "Bridge not responding"
Make sure the bridge is running inside DaVinci Resolve's console. The bridge must run within Resolve to access the API.

### "fusionscript module not found"
The bridge can only run inside DaVinci Resolve's Python environment, not standalone. Run it from Resolve's Console.

### Web app shows errors
1. Stop the dev server (`Ctrl+C`)
2. Run `npm install`
3. Start again with `npm run dev`

---

## 🚀 Tech Stack

**Frontend:**
- Next.js 16 (Turbopack)
- React 19
- TypeScript
- TailwindCSS v4
- Anthropic AI SDK

**Backend:**
- DaVinci Resolve Python API
- Node.js (for web server)
- Socket-based RPC (for bridge communication)

**AI:**
- Claude 3.7 Sonnet (via Anthropic API)
- Structured tool calling
- Streaming responses

---

## 📚 Learn More

- [DaVinci Resolve Scripting Documentation](https://www.blackmagicdesign.com/developer/product/davinci-resolve)
- [Next.js Documentation](https://nextjs.org/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [DaVinci Resolve Scripting Examples](https://github.com/deric/davinci-resolve-scripts)

---

## 🤝 Contributing

This is a hackathon project! Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Claude](https://claude.ai) by Anthropic
- Powered by [DaVinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve)
- UI components from [Radix UI](https://www.radix-ui.com/)

---

**Made with ❤️ for video editors who want to work smarter, not harder.**
