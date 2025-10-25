# test_retriever.py
# --------------------------------------------------
# Quick test script to verify that FAISS retrieval works.

from langchain_community.vectorstores import FAISS
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings

# Initialize embedding model
emb = NVIDIAEmbeddings(model="nvidia/llama-3.2-nv-embedqa-1b-v2")

# Load the local FAISS vectorstore created by ingest_docs.py
vectordb = FAISS.load_local("./vectorstore", emb)

# Create retriever
retriever = vectordb.as_retriever(search_kwargs={"k": 3})

# Test query
query = "How do I stabilize a shaky clip in DaVinci Resolve?"
results = retriever.invoke(query)

# Display retrieved chunks
for i, doc in enumerate(results, 1):
    print(f"\n--- Result {i} ---\n")
    print(doc.page_content[:500])  # show first 500 chars of each retrieved chunk
