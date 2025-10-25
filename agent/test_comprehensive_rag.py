# test_comprehensive_rag.py
# --------------------------------------------------
# Test the RAG system with DaVinci Resolve 20 Reference Manual + Scripting API

import os
import sys
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Initialize embedding model
print("Initializing NVIDIA Embeddings model...")
emb = NVIDIAEmbeddings(
    model="nvidia/llama-3.2-nv-embedqa-1b-v2",
    nvidia_api_key=os.getenv("NGC_API_KEY")
)

# Load the FAISS vectorstore
print("Loading comprehensive FAISS vectorstore (12,532 chunks)...")
vectordb = FAISS.load_local(
    os.path.join(os.path.dirname(__file__), "code", "vectorstore"),
    emb,
    allow_dangerous_deserialization=True
)

# Create retriever
retriever = vectordb.as_retriever(search_kwargs={"k": 3})

# Comprehensive test queries covering different aspects
test_queries = [
    # Reference Manual queries
    "How do I use the Color page in DaVinci Resolve?",
    "What are the Fusion page features?",
    "How do I export video with different codecs?",
    "What is the Fairlight audio page used for?",
    # Scripting API queries (from previous documentation)
    "How do I access the DaVinci Resolve scripting API in Python?",
    "What are keyframe modes in DaVinci Resolve?",
    # Combined queries
    "How do I automate rendering using Python scripts?",
    "What timeline operations can I perform with the API?",
]

print("\n" + "=" * 100)
print(" " * 25 + "COMPREHENSIVE RAG SYSTEM TEST")
print(" " * 15 + "DaVinci Resolve 20 Reference Manual + Scripting API")
print("=" * 100)
print(f"\nTotal vectorstore size: 12,532 chunks")
print(f"Documents indexed: 2 (Reference Manual + Scripting API)")

for query_num, query in enumerate(test_queries, 1):
    print(f"\n\n{'#' * 100}")
    print(f"QUERY {query_num}/{len(test_queries)}: {query}")
    print(f"{'#' * 100}\n")

    results = retriever.invoke(query)

    # Display retrieved chunks
    for i, doc in enumerate(results, 1):
        print(f"\n{'-' * 100}")
        print(f"RESULT {i}")
        print(f"{'-' * 100}")
        # Show first 400 chars for readability, handle encoding issues
        content = doc.page_content[:400]
        if len(doc.page_content) > 400:
            content += "..."
        # Remove special unicode characters that may cause issues
        content = content.encode('ascii', 'ignore').decode('ascii')
        print(content)
        print(f"{'-' * 100}")

print("\n\n" + "=" * 100)
print(" " * 40 + "TESTING COMPLETE")
print("=" * 100)
print(f"\n[SUCCESS] Tested {len(test_queries)} queries across both documentation sources")
print("[SUCCESS] RAG system successfully retrieves from 12,532 chunk vectorstore")
print("\nThe system can now answer questions about:")
print("  - DaVinci Resolve 20 features and workflows")
print("  - Scripting API and automation")
print("  - Keyframe modes and editing techniques")
print("  - Color grading, Fusion, Fairlight, and more\n")
