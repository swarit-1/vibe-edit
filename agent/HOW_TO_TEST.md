# How to Test the DaVinci Resolve RAG System

## 🚀 Quickest Way to Test (30 seconds)

### Windows:
```bash
cd agent
python quick_test.py
```

Or double-click: `run_quick_test.bat`

### Linux/Mac:
```bash
cd agent
./run_quick_test.sh
```

This will run a single test query and show you the top 3 results from the vectorstore.

---

## 🎯 Interactive Testing (Recommended)

### Launch the Interactive Test Menu:
```bash
cd agent
python run_tests.py
```

### What You'll See:
```
================================================================================
                        MAIN MENU
================================================================================

What would you like to do?

  1. Run predefined test queries (8 queries)
  2. Interactive mode (ask your own questions)
  3. Quick single query test
  4. Exit

Enter your choice (1-4):
```

### Menu Options:

**Option 1: Predefined Tests**
- Runs 8 comprehensive test queries automatically
- Covers Color, Fusion, Fairlight, Export, API, Keyframes, etc.
- Great for verifying the system works correctly
- Takes ~5 minutes (press Enter between each test)

**Option 2: Interactive Mode**
- Ask unlimited custom questions
- Type your question, get instant answers
- Perfect for exploring the documentation
- Type 'quit' when done

**Option 3: Quick Single Query**
- Test one specific question
- Fastest way to check a single topic

**Option 4: Exit**
- Close the testing interface

---

## 📝 Example Test Queries

Try these questions in interactive mode:

### DaVinci Resolve Features:
- "How do I use the Color page?"
- "What is the Fusion page for?"
- "How do I edit audio in Fairlight?"
- "How do I export video with H.264?"
- "What are proxy files?"

### Scripting & Automation:
- "How do I access the Python API?"
- "What are keyframe modes?"
- "How do I automate rendering?"
- "How do I create a timeline with Python?"
- "What timeline operations can I perform?"

### Advanced Topics:
- "How do I use motion blur?"
- "What is color grading?"
- "How do I use the cut page?"
- "What are render presets?"
- "How do I use LUTs?"

---

## 🔧 Testing with Custom Queries

### Method 1: Command Line Argument
```bash
python quick_test.py "How do I use transitions in DaVinci Resolve?"
```

### Method 2: Interactive Script
```bash
python run_tests.py
# Choose option 2 (Interactive mode)
# Type your questions
```

---

## 📊 What to Expect

### Successful Test Output:
```
================================================================================
RESULT 1/3
================================================================================

[Relevant documentation content will appear here]
Full chunk length: 750 characters
--------------------------------------------------------------------------------
```

### Performance:
- **Load Time**: 5-10 seconds
- **Query Time**: 1-3 seconds per question
- **Results**: Top 3 most relevant chunks
- **Accuracy**: High relevance to your query

---

## 🎬 Quick Start Guide

### First Time Testing:

1. **Open Terminal/Command Prompt**
   ```bash
   cd agent
   ```

2. **Run Interactive Tests**
   ```bash
   python run_tests.py
   ```

3. **Choose Option 1** (Predefined tests)
   - This will run all 8 test queries
   - Press Enter after each result to continue
   - Verify results are relevant

4. **Try Interactive Mode** (Option 2)
   - Ask your own questions
   - Explore the documentation
   - Test edge cases

5. **Done!**
   - If results look good, your RAG system is working perfectly

---

## 🛠️ All Available Test Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `run_tests.py` | **Interactive menu** (recommended) | `python run_tests.py` |
| `quick_test.py` | Single query test | `python quick_test.py` |
| `quick_test.py "query"` | Custom query test | `python quick_test.py "your question"` |
| `test_comprehensive_rag.py` | 8 queries batch test | `python test_comprehensive_rag.py` |
| `demo_keyframe_retrieval.py` | Keyframe demo | `python demo_keyframe_retrieval.py` |
| `test_multiple_queries.py` | 5 queries batch test | `python test_multiple_queries.py` |
| `run_quick_test.bat` | Windows quick launch | Double-click or `run_quick_test.bat` |
| `run_quick_test.sh` | Linux/Mac quick launch | `./run_quick_test.sh` |

---

## ✅ Verification Checklist

After running tests, verify:

- [ ] System loads without errors
- [ ] Queries complete in 1-3 seconds
- [ ] Results are relevant to the query
- [ ] Multiple results are returned (usually 3)
- [ ] Content includes specific DaVinci Resolve information
- [ ] Both Reference Manual AND Scripting API docs are retrieved

---

## 💡 Tips

1. **Ask Specific Questions**: "How do I..." works better than "Tell me about..."
2. **Use DaVinci Terms**: Use terms like "Color page", "Fairlight", "timeline", etc.
3. **Experiment**: Try different phrasings of the same question
4. **Check Multiple Results**: Sometimes the answer is in result #2 or #3
5. **Mix Topics**: Try both UI questions and scripting questions

---

## 🆘 Troubleshooting

### "NGC_API_KEY not found"
- Check your `.env` file in the project root
- Make sure it contains: `NGC_API_KEY=your_key_here`

### "Vectorstore not found"
- Run the ingestion script first: `python ingest_docs.py`
- Check that `agent/code/vectorstore/` directory exists

### Slow Performance
- First query is slower (loading vectorstore)
- Subsequent queries should be 1-3 seconds
- Check internet connection (NVIDIA API is cloud-based)

### No Relevant Results
- Try rephrasing your question
- Be more specific
- Use DaVinci Resolve terminology

---

## 📈 What's Being Tested

Your test queries search through:
- **12,532 chunks** of documentation
- **2 source documents**:
  - DaVinci Resolve 20 Reference Manual (8.3 MB)
  - DaVinci Resolve Scripting API docs (5.9 KB)
- **109 MB vectorstore** (FAISS index)
- **NVIDIA embedding model**: llama-3.2-nv-embedqa-1b-v2

---

## 🎉 Ready to Test!

Just run:
```bash
cd agent
python run_tests.py
```

And start exploring! The system contains comprehensive knowledge about DaVinci Resolve 20.

**Happy Testing!** 🚀
