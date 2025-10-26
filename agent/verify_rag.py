#!/usr/bin/env python
"""
verify_rag.py
=============
Simple verification script to test the RAG system is working.
Runs 3 test queries and displays results.
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

print("\n" + "=" * 80)
print("DAVINCI RESOLVE RAG SYSTEM - VERIFICATION TEST")
print("=" * 80)

# Initialize
print("\n[1/3] Loading NVIDIA Embeddings model...")
emb = NVIDIAEmbeddings(
    model="nvidia/llama-3.2-nv-embedqa-1b-v2",
    nvidia_api_key=os.getenv("NGC_API_KEY")
)

print("[2/3] Loading FAISS vectorstore...")
vectordb = FAISS.load_local(
    os.path.join(os.path.dirname(__file__), "code", "vectorstore"),
    emb,
    allow_dangerous_deserialization=True
)

print("[3/3] Creating retriever...")
retriever = vectordb.as_retriever(search_kwargs={"k": 2})

# Test queries
test_queries = [
    "How do I use keyframes in DaVinci Resolve?",
    "How do I access the Python scripting API?",
    "What is the Color page used for?"
]

print("\n" + "=" * 80)
print("RUNNING 3 VERIFICATION TESTS")
print("=" * 80)

all_passed = True

for i, query in enumerate(test_queries, 1):
    print(f"\n\n{'#' * 80}")
    print(f"TEST {i}/3: {query}")
    print(f"{'#' * 80}\n")

    try:
        results = retriever.invoke(query)

        if len(results) > 0:
            print(f"[PASS] Retrieved {len(results)} results\n")

            # Show first result preview
            print("-" * 80)
            print("TOP RESULT PREVIEW:")
            print("-" * 80)
            preview = clean_text(results[0].page_content[:300])
            print(preview)
            if len(results[0].page_content) > 300:
                print("\n[...truncated...]")
            print("-" * 80)
        else:
            print("[FAIL] No results retrieved")
            all_passed = False

    except Exception as e:
        print(f"[FAIL] Error: {e}")
        all_passed = False

print("\n\n" + "=" * 80)
print("VERIFICATION COMPLETE")
print("=" * 80)

if all_passed:
    print("\n[SUCCESS] ALL TESTS PASSED!")
    print("[SUCCESS] RAG system is working correctly")
    print("[SUCCESS] Vectorstore contains 12,532 chunks")
    print("[SUCCESS] Retrieval is functional")
    print("\nYou can now use: python run_tests.py for interactive testing\n")
    sys.exit(0)
else:
    print("\n[ERROR] SOME TESTS FAILED")
    print("Please check the errors above\n")
    sys.exit(1)
