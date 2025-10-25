# quick_demo.py - Quick demonstration of the comprehensive RAG system

import os
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

emb = NVIDIAEmbeddings(
    model="nvidia/llama-3.2-nv-embedqa-1b-v2",
    nvidia_api_key=os.getenv("NGC_API_KEY")
)

print("Loading RAG system with 12,532 chunks...")
vectordb = FAISS.load_local(
    os.path.join(os.path.dirname(__file__), "code", "vectorstore"),
    emb,
    allow_dangerous_deserialization=True
)

retriever = vectordb.as_retriever(search_kwargs={"k": 1})

# Quick demo query
query = input("\nAsk a question about DaVinci Resolve: ")
print(f"\nSearching 12,532 chunks for: '{query}'\n")

results = retriever.invoke(query)
print("=" * 80)
print("TOP RESULT:")
print("=" * 80)
result_text = results[0].page_content[:600].encode('ascii', 'ignore').decode('ascii')
print(result_text)
if len(results[0].page_content) > 600:
    print("...")
print("=" * 80)
