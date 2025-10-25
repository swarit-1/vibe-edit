## 📘 Running the Document Ingestion Script

The `ingest_docs.py` script extracts text from DaVinci Resolve manuals, converts it into embeddings using NVIDIA’s EmbedQA model, and stores them in a FAISS vector database for retrieval by the RAG agent.

---

### 🧩 1. Install Dependencies

From the project root:

```bash
pip install langchain langchain-community langchain-nvidia-ai-endpoints faiss-cpu pymupdf
```

---

### 🔑 2. Set Up NVIDIA API Key

You need an **NGC (NVIDIA GPU Cloud)** API key to access the hosted models.

1. Go to [https://build.nvidia.com/explore/discover](https://build.nvidia.com/explore/discover)
2. Log in and generate your API key.
3. In your terminal, run:

```bash
export NGC_API_KEY="your_key_here"
```

*(Run this again if you open a new terminal session.)*

---

### 📂 3. Add the Manuals

Place all DaVinci Resolve PDF manuals inside:

```
agent/code/data/pdfs/
```

Example:

```
agent/code/data/pdfs/DaVinci_Resolve_20_Reference_Manual.pdf
```

---

### ▶️ 4. Run the Script

From inside the `agent/code` directory:

```bash
cd agent/code
python ingest_docs.py
```

Expected output:

```
Extracting text from PDF manuals...
Saved extracted text: ./data/resolve/DaVinci_Resolve_20_Reference_Manual.txt
Loaded 1 text file(s).
Split text into 12530 chunks.
Creating embeddings and building FAISS vectorstore...
Vectorstore successfully saved at: ./vectorstore
```

---

### ✅ 5. Verify Output

After successful execution, the following directories should exist:

```
agent/code/data/resolve/     → extracted .txt files
agent/code/vectorstore/      → FAISS vectorstore for retrieval
```

The RAG agent will use this vectorstore to answer DaVinci Resolve–related questions.
