# test_retriever.py
# --------------------------------------------------
# Quick test script to verify that FAISS retrieval works.

import os
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings

# Load environment variables from .env file in the project root
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Initialize embedding model with API key
emb = NVIDIAEmbeddings(
    model="nvidia/llama-3.2-nv-embedqa-1b-v2",
    nvidia_api_key=os.getenv("NGC_API_KEY")
)

# Load the local FAISS vectorstore created by ingest_docs.py
# The vectorstore is in the code/vectorstore directory
vectordb = FAISS.load_local(
    os.path.join(os.path.dirname(__file__), "code", "vectorstore"),
    emb,
    allow_dangerous_deserialization=True
)

# Create retriever
retriever = vectordb.as_retriever(search_kwargs={"k": 3})

# Test query
query = "How do I access the DaVinci Resolve scripting API in Python?"
print(f"\nQuery: {query}\n")
print("=" * 80)

results = retriever.invoke(query)

# Display retrieved chunks
for i, doc in enumerate(results, 1):
    print(f"\n--- Result {i} ---\n")
    print(doc.page_content[:500])  # show first 500 chars of each retrieved chunk
    print("\n" + "=" * 80)
