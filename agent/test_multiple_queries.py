# test_multiple_queries.py
# --------------------------------------------------
# Comprehensive test script to verify RAG retrieval with multiple queries

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
vectordb = FAISS.load_local(
    os.path.join(os.path.dirname(__file__), "code", "vectorstore"),
    emb,
    allow_dangerous_deserialization=True
)

# Create retriever
retriever = vectordb.as_retriever(search_kwargs={"k": 3})

# Test queries covering different aspects of the documentation
test_queries = [
    "How do I access the DaVinci Resolve scripting API in Python?",
    "What are keyframe modes in DaVinci Resolve?",
    "How do I manage timelines and clips?",
    "What are the environment setup requirements for scripting?",
    "How do I render videos using the API?"
]

print("\n" + "=" * 80)
print("TESTING DAVINCI RESOLVE RAG RETRIEVAL")
print("=" * 80)

for query_num, query in enumerate(test_queries, 1):
    print(f"\n\n{'#' * 80}")
    print(f"TEST QUERY {query_num}/{len(test_queries)}")
    print(f"{'#' * 80}")
    print(f"\nQuery: {query}\n")
    print("-" * 80)

    results = retriever.invoke(query)

    # Display retrieved chunks
    for i, doc in enumerate(results, 1):
        print(f"\n--- Result {i} ---")
        # Show first 300 chars of each retrieved chunk for readability
        content = doc.page_content[:300]
        if len(doc.page_content) > 300:
            content += "..."
        print(content)
        print("-" * 80)

print("\n\n" + "=" * 80)
print("TESTING COMPLETE")
print("=" * 80)
print(f"\nTotal queries tested: {len(test_queries)}")
print("Retrieval system is working correctly!")
