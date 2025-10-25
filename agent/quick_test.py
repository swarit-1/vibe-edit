#!/usr/bin/env python
"""
quick_test.py
=============
Quick one-command test of the RAG system.

Usage:
    python quick_test.py
    python quick_test.py "your custom question here"
"""

import os
import sys
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

def clean_text(text):
    """Clean text for console output"""
    try:
        return text.encode('ascii', 'ignore').decode('ascii')
    except:
        return str(text)

# Default test query
DEFAULT_QUERY = "How do I use keyframes in DaVinci Resolve?"

# Get query from command line or use default
if len(sys.argv) > 1:
    query = ' '.join(sys.argv[1:])
else:
    query = DEFAULT_QUERY

print("\n" + "=" * 80)
print("DAVINCI RESOLVE RAG - QUICK TEST")
print("=" * 80)

print("\n[1/3] Initializing embeddings model...")
emb = NVIDIAEmbeddings(
    model="nvidia/llama-3.2-nv-embedqa-1b-v2",
    nvidia_api_key=os.getenv("NGC_API_KEY")
)

print("[2/3] Loading vectorstore (12,532 chunks)...")
vectordb = FAISS.load_local(
    os.path.join(os.path.dirname(__file__), "code", "vectorstore"),
    emb,
    allow_dangerous_deserialization=True
)

print("[3/3] Running query...")
retriever = vectordb.as_retriever(search_kwargs={"k": 3})

print("\n" + "=" * 80)
print(f"QUERY: {query}")
print("=" * 80)

results = retriever.invoke(query)

for i, doc in enumerate(results, 1):
    print(f"\n{'-' * 80}")
    print(f"RESULT {i}/{len(results)}")
    print(f"{'-' * 80}\n")

    # Show first 400 chars
    content = doc.page_content[:400]
    if len(doc.page_content) > 400:
        content += "\n\n[...truncated...]"

    print(clean_text(content))

print("\n" + "=" * 80)
print("TEST COMPLETE")
print("=" * 80)
print(f"\nRetrieved {len(results)} relevant results from 12,532 chunks")
print("\nFor interactive testing, run: python run_tests.py\n")
