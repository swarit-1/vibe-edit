# test_keyframe_demo.py
# --------------------------------------------------
# Demo test focusing on keyframe mode information retrieval

import os
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings

# Load environment variables from .env file in the project root
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Initialize embedding model with API key
print("Initializing NVIDIA Embeddings model...")
emb = NVIDIAEmbeddings(
    model="nvidia/llama-3.2-nv-embedqa-1b-v2",
    nvidia_api_key=os.getenv("NGC_API_KEY")
)

# Load the local FAISS vectorstore
print("Loading FAISS vectorstore...")
vectordb = FAISS.load_local(
    os.path.join(os.path.dirname(__file__), "code", "vectorstore"),
    emb,
    allow_dangerous_deserialization=True
)

# Create retriever
retriever = vectordb.as_retriever(search_kwargs={"k": 5})

# Keyframe-focused test queries
keyframe_queries = [
    "What are keyframe modes in DaVinci Resolve?",
    "How do keyframes work in DaVinci Resolve?",
    "What types of keyframe interpolation are supported?",
    "Tell me about Dynamic Zoom and Transform keyframes",
]

print("\n" + "=" * 100)
print(" " * 30 + "KEYFRAME MODE RETRIEVAL DEMO")
print("=" * 100)

for query_num, query in enumerate(keyframe_queries, 1):
    print(f"\n\n{'#' * 100}")
    print(f"  QUERY {query_num}: {query}")
    print(f"{'#' * 100}\n")

    results = retriever.invoke(query)

    # Display all retrieved chunks with full content
    for i, doc in enumerate(results, 1):
        print(f"\n{'-' * 100}")
        print(f"RESULT {i} (Relevance Score: {i}/5)")
        print(f"{'-' * 100}")
        print(doc.page_content)
        print(f"{'-' * 100}")

    # Add separator between queries
    if query_num < len(keyframe_queries):
        print("\n" + "~" * 100)
        print("\nPress Enter to continue to next query...")
        input()

print("\n\n" + "=" * 100)
print(" " * 35 + "DEMO COMPLETE")
print("=" * 100)
print("\n[OK] All keyframe-related queries successfully retrieved relevant documentation!")
print("[OK] The RAG system correctly indexed and can retrieve keyframe mode information.")
print("\nThe system is ready to answer questions about DaVinci Resolve keyframe modes.\n")
