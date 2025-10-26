import logging
import os
from pathlib import Path
from dotenv import load_dotenv
from langchain.retrievers import ContextualCompressionRetriever
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.tools.retriever import create_retriever_tool
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_community.vectorstores import FAISS
from langchain_nvidia_ai_endpoints import ChatNVIDIA, NVIDIAEmbeddings, NVIDIARerank
from langgraph.prebuilt import create_react_agent

_LOGGER = logging.getLogger(__name__)

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
kb_retriever = vectordb.as_retriever(search_type="similarity", search_kwargs={"k": 6})
reranker = NVIDIARerank(model=RETRIEVER_RERANK_MODEL)

# combine those to create the final document retriever
RETRIEVER = ContextualCompressionRetriever(
    base_retriever=kb_retriever,
    base_compressor=reranker,
)

# Create the retriever tool for agentic use
RETRIEVER_TOOL = create_retriever_tool(
    retriever=RETRIEVER,
    name="company_llc_it_knowledge_base",
    description=(
        "Search the internal IT knowledge base for Company LLC IT related questions and policies."
    ),
)

# Define the LLM model to be used for this agent
llm = ...
llm = ChatNVIDIA(model="nvidia/nemotron-mini-4b-instruct", temperature=0.7, api_key = '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')

# Define the system prompt for the agent
SYSTEM_PROMPT = (
    "You are an IT help desk support agent.\n"
    "- Use the 'company_llc_it_knowledge_base' tool for questions likely covered by the internal IT knowledge base.\n"
    "- Always write grounded answers. If unsure, say you don't know.\n"
    "- Cite sources inline using [KB] for knowledge base snippets.\n"
    "- If the knowledge base doesn't contain sufficient information, clearly state what information is missing.\n"
    "- Keep answers brief, to the point, and conversational."
)

# Create the ReAct agent
AGENT = ...