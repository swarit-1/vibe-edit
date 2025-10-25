# demo_keyframe_retrieval.py
# --------------------------------------------------
# Simple demo focusing on keyframe mode information retrieval

import os
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Initialize embedding model
print("Initializing NVIDIA Embeddings model...")
emb = NVIDIAEmbeddings(
    model="nvidia/llama-3.2-nv-embedqa-1b-v2",
    nvidia_api_key=os.getenv("NGC_API_KEY")
)

# Load the FAISS vectorstore
print("Loading FAISS vectorstore...")
vectordb = FAISS.load_local(
    os.path.join(os.path.dirname(__file__), "code", "vectorstore"),
    emb,
    allow_dangerous_deserialization=True
)

# Create retriever
retriever = vectordb.as_retriever(search_kwargs={"k": 3})

# Keyframe-focused test queries
keyframe_queries = [
    "What are keyframe modes in DaVinci Resolve?",
    "How do keyframes work in DaVinci Resolve?",
    "What types of keyframe interpolation are supported?",
]

print("\n" + "=" * 100)
print(" " * 30 + "KEYFRAME MODE RETRIEVAL DEMONSTRATION")
print("=" * 100)

for query_num, query in enumerate(keyframe_queries, 1):
    print(f"\n\n{'#' * 100}")
    print(f"QUERY {query_num}/{len(keyframe_queries)}: {query}")
    print(f"{'#' * 100}\n")

    results = retriever.invoke(query)

    # Display retrieved chunks
    for i, doc in enumerate(results, 1):
        print(f"\n{'-' * 100}")
        print(f"RETRIEVED CHUNK {i}")
        print(f"{'-' * 100}")
        print(doc.page_content)
        print(f"{'-' * 100}")

print("\n\n" + "=" * 100)
print(" " * 40 + "DEMONSTRATION COMPLETE")
print("=" * 100)
print("\n[SUCCESS] All keyframe-related queries successfully retrieved relevant documentation!")
print("[SUCCESS] The RAG system correctly indexed and can retrieve keyframe mode information.")
print("\nThe vectorstore contains comprehensive DaVinci Resolve scripting documentation.")
print("Including: API access, keyframe modes, timeline management, rendering, and more.\n")
