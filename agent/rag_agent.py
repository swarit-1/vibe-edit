import logging
import os
from pathlib import Path
from dotenv import load_dotenv
from langchain.retrievers import ContextualCompressionRetriever
from langchain.tools.retriever import create_retriever_tool
from langchain_community.vectorstores import FAISS
from langchain_nvidia_ai_endpoints import ChatNVIDIA, NVIDIAEmbeddings, NVIDIARerank
from langgraph.prebuilt import create_react_agent

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# Data Ingestion Configuration
DATA_DIR = Path(__file__).parent.parent / "data" / "it-knowledge-base"
CHUNK_SIZE = 800
CHUNK_OVERLAP = 120

# Model Configuration
LLM_MODEL = "nvidia/nvidia-nemotron-nano-9b-v2"
LLM_MODEL = "nvidia/nemotron-mini-4b-instruct" # for prototype
RETRIEVER_EMBEDDING_MODEL = "nvidia/llama-3.2-nv-embedqa-1b-v2"
RETRIEVER_RERANK_MODEL = "nvidia/llama-3.2-nv-rerankqa-1b-v2"

# Load your existing FAISS vectorstore
load_dotenv()

VSTORE_DIR = "./vectorstore"  # same folder used in ingest_docs.py
EMBED_MODEL = "nvidia/llama-3.2-nv-embedqa-1b-v2"

embeddings = NVIDIAEmbeddings(
    model=EMBED_MODEL,
    truncate="END",
    nvidia_api_key=os.getenv("NGC_API_KEY")
)

vectordb = FAISS.load_local(
    VSTORE_DIR,
    embeddings,
    allow_dangerous_deserialization=True
)

kb_retriever = vectordb.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 6}
)

# Create a document retriever and reranker
reranker = NVIDIARerank(model=RETRIEVER_RERANK_MODEL)

# combine those to create the final document retriever
RETRIEVER = ContextualCompressionRetriever(
    base_retriever=kb_retriever,
    base_compressor=reranker,
)

# Create the retriever tool for agentic use
RETRIEVER_TOOL = create_retriever_tool(
    retriever=RETRIEVER,
    name="davinci_resolve_manual",
    description=(
    "Search the DaVinci Resolve user manual for video editing instructions, troubleshooting steps, and workflow tips."
    ),
)

# Define the LLM model to be used for this agent
llm = ChatNVIDIA(
    model=LLM_MODEL,
    temperature=0.7,
    top_p=0.95,
    max_tokens=8192,
    api_key=os.getenv("NGC_API_KEY")
)

# Define the system prompt for the agent
SYSTEM_PROMPT = (
    "You are a professional video editing assistant specialized in DaVinci Resolve.\n"
    "- Use the 'davinci_resolve_manual' tool for technical questions about DaVinci Resolve features or workflows.\n"
    "- Base your answers strictly on retrieved manual content.\n"
    "- If unsure or if information is missing, clearly say you don't know.\n"
    "- Keep answers concise, actionable, and user-friendly.\n"
    "- When quoting from the manual, cite sources inline using [Manual]."
)


# Create the ReAct agent
AGENT = create_react_agent(
    model=llm,
    tools=[RETRIEVER_TOOL],
    prompt=SYSTEM_PROMPT
)

if __name__ == "__main__":
    question = "How do I stabilize a shaky clip in DaVinci Resolve?"
    print("User:", question)
    response = AGENT.invoke({"input": question})
    print("Agent:", response["output"])
