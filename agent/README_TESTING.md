# DaVinci Resolve RAG System - Testing Guide

## Quick Start

### Running the Interactive Test Script

Simply run:

```bash
cd agent
python run_tests.py
```

This will launch an interactive testing interface where you can:
1. **Run predefined tests** - 8 comprehensive test queries covering all features
2. **Interactive mode** - Ask your own custom questions
3. **Quick single query** - Test one specific question
4. **Exit** - Close the testing interface

## What the Test Script Does

The `run_tests.py` script will:
- ✅ Load the RAG system with 12,532 knowledge chunks
- ✅ Connect to NVIDIA's embedding API
- ✅ Let you query the DaVinci Resolve documentation
- ✅ Display relevant results from the vectorstore
- ✅ Handle encoding issues automatically

## Test Options

### Option 1: Predefined Test Queries (Recommended for First Run)

Runs 8 comprehensive test queries:
1. Color Page usage
2. Fusion Page features
3. Export with different codecs
4. Fairlight audio page
5. Python API access
6. Keyframe modes
7. Automated rendering with scripts
8. Timeline API operations

### Option 2: Interactive Mode

Ask any question about DaVinci Resolve! Examples:
- "How do I create a title?"
- "What is motion blur?"
- "How do I use the cut page?"
- "How do I color grade footage?"
- "What are proxy media files?"

### Option 3: Quick Single Query

Test one specific question quickly without going through all tests.

## Example Usage

### Example 1: Running Predefined Tests

```bash
$ python run_tests.py

# Choose option 1 from the menu
# Press Enter after each test to see the next one
```

### Example 2: Interactive Mode

```bash
$ python run_tests.py

# Choose option 2 from the menu
# Type your questions
# Type 'quit' when done

Your question: How do I use keyframes in DaVinci Resolve?
# Results will be displayed...

Your question: What is the Fusion page?
# Results will be displayed...

Your question: quit
```

### Example 3: Quick Test

```bash
$ python run_tests.py

# Choose option 3
# Enter your question
# See results immediately
```

## Other Test Scripts Available

### 1. `test_comprehensive_rag.py`
Runs all 8 predefined tests in batch mode (non-interactive):
```bash
python test_comprehensive_rag.py
```

### 2. `demo_keyframe_retrieval.py`
Focused demonstration of keyframe documentation retrieval:
```bash
python demo_keyframe_retrieval.py
```

### 3. `test_multiple_queries.py`
5-query test suite with detailed output:
```bash
python test_multiple_queries.py
```

### 4. `test_retriever.py`
Basic single query test:
```bash
python test_retriever.py
```

## Expected Results

When the system is working correctly, you should see:
- ✅ Fast response times (1-3 seconds per query)
- ✅ Relevant results for each query
- ✅ Information from both Reference Manual AND Scripting API
- ✅ Detailed content snippets from the documentation

## Troubleshooting

### Error: NGC_API_KEY not found
**Solution**: Make sure your `.env` file in the project root contains:
```
NGC_API_KEY=your_api_key_here
```

### Error: Vectorstore not found
**Solution**: Run the ingestion script first:
```bash
python ingest_docs.py
```

### Error: Unicode encoding issues
**Solution**: The script handles this automatically. If you still see issues, the script will display ASCII-safe versions of the text.

### Error: Module not found
**Solution**: Install required dependencies:
```bash
pip install langchain langchain-community langchain-nvidia-ai-endpoints faiss-cpu python-dotenv
```

## System Requirements

- Python 3.9+
- Internet connection (for NVIDIA API)
- NGC API key in `.env` file
- ~500MB RAM for loading vectorstore

## What's Being Tested

The RAG system is querying:
- **12,532 chunks** of documentation
- **2 source files**:
  1. DaVinci Resolve 20 Reference Manual (8.3 MB text)
  2. DaVinci Resolve Scripting API docs (5.9 KB text)
- **109 MB vectorstore** (FAISS index)

## Performance Metrics

Typical performance:
- **Load time**: 5-10 seconds
- **Query time**: 1-3 seconds
- **Results returned**: Top 3-5 most relevant chunks
- **Accuracy**: 100% (all test queries return relevant results)

## Next Steps

After testing, you can:
1. Integrate the RAG system into your vibe-edit application
2. Add more documentation sources to the vectorstore
3. Customize the chunk size and retrieval parameters
4. Build a chat interface on top of the retrieval system

## Support

For issues or questions:
- Check the comprehensive training summary: `COMPREHENSIVE_TRAINING_SUMMARY.md`
- Review test results: `TESTING_RESULTS.md`
- Check the ingestion script: `ingest_docs.py`

---

**Happy Testing!** 🚀
