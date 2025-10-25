"""
ingest_docs.py
--------------
Pipeline to prepare textual knowledge for the DaVinci Resolve RAG Agent.

This script:
- Extracts readable text from PDF manuals (ignoring images)
- Cleans and saves the text as .txt files
- Loads the text into LangChain Documents
- Splits text into overlapping chunks for semantic embedding
- Creates embeddings using NVIDIA EmbedQA
- Stores the embedded vectors in a FAISS vectorstore for retrieval
"""

import os
from dotenv import load_dotenv
import fitz  # PyMuPDF: lightweight PDF reader that extracts selectable text (not images)
from langchain_community.document_loaders import DirectoryLoader, TextLoader  # load .txt files as LangChain Document objects
from langchain.text_splitter import RecursiveCharacterTextSplitter  # splits long text into overlapping chunks
from langchain_community.vectorstores import FAISS  # FAISS: high-speed vector search index for similarity retrieval
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings  # NVIDIA embedding model for text-to-vector conversion

# Load environment variables from .env file in the project root
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))



# --------------------------------------------------------------------------
# Path Configuration
# --------------------------------------------------------------------------
# Input PDFs (DaVinci Resolve manuals)
PDF_DIR = "./data/pdfs"
# Extracted plain-text output directory
TXT_DIR = "./data/resolve"
# Output directory for the FAISS vectorstore
VSTORE_DIR = "./vectorstore"

# Create necessary directories if they do not exist
os.makedirs(TXT_DIR, exist_ok=True)
os.makedirs(VSTORE_DIR, exist_ok=True)



# --------------------------------------------------------------------------
# PDF to Text Extraction
# --------------------------------------------------------------------------
def pdf_to_text(pdf_path, txt_path):
    """
    Extract readable text from a PDF file and save as a cleaned .txt file.

    Parameters
    ----------
    pdf_path : str
        Path to the input PDF file.
    txt_path : str
        Destination path for the output text file.

    Notes
    -----
    - Uses PyMuPDF's built-in text extraction.
    - Ignores blank pages and page number lines.
    """
    with fitz.open(pdf_path) as doc:
        full_text = ""
        for page in doc:
            text = page.get_text("text")  # Extract visible text (not images)
            if text.strip():              # Skip blank pages
                full_text += text + "\n\n"

    # Basic text cleanup: remove empty lines and page headers
    lines = []
    for line in full_text.splitlines():
        if not line.strip():              # Skip empty lines
            continue
        if line.lower().startswith("page "):  # Skip page number headers
            continue
        lines.append(line.strip())

    cleaned_text = "\n".join(lines)

    # Write cleaned text to file
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(cleaned_text)



# --------------------------------------------------------------------------
# Extract and Save Text Files
# --------------------------------------------------------------------------
print("Extracting text from PDF manuals...")
for file in os.listdir(PDF_DIR):
    if file.endswith(".pdf"):
        pdf_path = os.path.join(PDF_DIR, file)
        txt_path = os.path.join(TXT_DIR, file.replace(".pdf", ".txt"))
        pdf_to_text(pdf_path, txt_path)
        print(f"Saved extracted text: {txt_path}")



# --------------------------------------------------------------------------
# Load Text as LangChain Documents
# --------------------------------------------------------------------------
print("\nLoading text documents into memory...")
loader = DirectoryLoader(TXT_DIR, glob="**/*.txt", loader_cls=TextLoader)
docs = loader.load()
print(f"Loaded {len(docs)} text file(s).")



# --------------------------------------------------------------------------
# Split Documents into Chunks
# --------------------------------------------------------------------------
# Chunks are necessary because embedding models have a maximum token length.
# Overlapping regions preserve context across chunk boundaries.
splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=120)
chunks = splitter.split_documents(docs)
print(f"Split text into {len(chunks)} chunks for embedding.")



# --------------------------------------------------------------------------
# Embed Text and Build FAISS Vectorstore
# --------------------------------------------------------------------------
print("\nCreating embeddings and building FAISS vectorstore...")
emb = NVIDIAEmbeddings(
    model="nvidia/llama-3.2-nv-embedqa-1b-v2",
    truncate="END",
    nvidia_api_key=os.getenv("NGC_API_KEY")
)

# Convert text chunks into embeddings and index them with FAISS
vectordb = FAISS.from_documents(chunks, emb)

# Save the completed vectorstore locally for use by the RAG agent
vectordb.save_local(VSTORE_DIR)
print(f"Vectorstore successfully saved at: {VSTORE_DIR}")
