import logging
import os
from pathlib import Path
from dotenv import load_dotenv
from langchain.retrievers import ContextualCompressionRetriever
from langchain.tools.retriever import create_retriever_tool
from langchain_community.vectorstores import FAISS
from langchain_nvidia_ai_endpoints import ChatNVIDIA, NVIDIAEmbeddings, NVIDIARerank
from langchain.prompts import PromptTemplate
from langchain.agents import create_react_agent, AgentExecutor


logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

VSTORE_DIR = "./vectorstore"  # path created by ingest_docs.py
EMBED_MODEL = "nvidia/llama-3.2-nv-embedqa-1b-v2"
RERANK_MODEL = "nvidia/llama-3.2-nv-rerankqa-1b-v2"
LLM_MODEL   = "nvidia/nvidia-nemotron-nano-9b-v2"

# Load your existing FAISS vectorstore
load_dotenv()
api_key = os.getenv("NVIDIA_API_KEY") or os.getenv("NGC_API_KEY") 
if not api_key:
    raise ValueError("No NVIDIA_API_KEY/NGC_API_KEY found in .env")
print(f"Using API key prefix: {api_key[:10]}...")


if not os.path.exists(VSTORE_DIR):
    raise FileNotFoundError(
        f"Vectorstore directory '{VSTORE_DIR}' not found. "
        "Run ingest_docs.py first, or verify the path."
    )

embeddings = NVIDIAEmbeddings(
    model=EMBED_MODEL,
    truncate="END",
    nvidia_api_key=api_key
)

vectordb = FAISS.load_local(
    VSTORE_DIR,
    embeddings,
    allow_dangerous_deserialization=True
)

kb_retriever = vectordb.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 8}
)

# Create a document retriever and reranker
reranker = NVIDIARerank(model=RERANK_MODEL, api_key=api_key)

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
    api_key=api_key,
    temperature=0.3,
    top_p=0.95,
    max_completion_tokens=8192,
    extra_headers={"x-nvidia-include-reasoning": "true"},  # <- enable hidden reasoning
)

# Nudge ReAct formatting
llm_react = llm.bind(stop=["\nObservation:"])

from langchain.callbacks.base import BaseCallbackHandler

class ReasoningCapture(BaseCallbackHandler):
    def __init__(self):
        self.reasons = []

    # For non-streaming calls (what you're using)
    def on_llm_end(self, response, **kwargs):
        # response.generations -> list[list[Generation]]
        for gen_list in response.generations:
            for gen in gen_list:
                msg = getattr(gen, "message", None)
                if msg:
                    meta = getattr(msg, "response_metadata", {}) or {}
                    rc = meta.get("reasoning_content")
                    if rc:
                        self.reasons.append(rc)

REACT_PROMPT = PromptTemplate(
    input_variables=["input", "agent_scratchpad", "tools", "tool_names"],
    template=(
        "You are a professional video editing assistant specialized in DaVinci Resolve.\n"
        "- Use the 'davinci_resolve_manual' tool for technical questions about DaVinci Resolve features or workflows.\n"
        "- Base your answers strictly on retrieved manual content; cite as [Manual].\n"
        "- If unsure or if information is missing, say you don't know.\n"
        "- Keep answers concise, actionable, and user-friendly.\n\n"
        "- Provide 6–8 numbered steps and include any parameter names/values that appear in the manual; remind the user to click Stabilize after changes.\n\n"
        "You have access to the following tools:\n{tools}\n"
        "Use a tool by writing exactly its name from: {tool_names}\n\n"
        "Use the following format:\n"
        "Question: the input question you must answer\n"
        "Thought: you should always think about what to do\n"
        "Action: the action to take, should be one of [{tool_names}]\n"
        "Action Input: the input to the action\n"
        "Observation: the result of the action\n"
        "... (this Thought/Action/Action Input/Observation can repeat N times)\n"
        "Thought: I now know the final answer\n"
        "Final Answer: the final answer to the user\n\n"
        "Question: {input}\n"
        "Thought: {agent_scratchpad}"
    ),
)

# build the ReAct agent (as you already do)
agent = create_react_agent(
    llm=llm_react,
    tools=[RETRIEVER_TOOL],
    prompt=REACT_PROMPT,   # <- the ChatPromptTemplate with {tools}/{tool_names}
)

AGENT = AgentExecutor(
    agent=agent,
    tools=[RETRIEVER_TOOL],
    verbose=True,
    return_intermediate_steps=True,
    handle_parsing_errors=True,
    max_iterations=8,
    early_stopping_method="generate",
)


# 3) Use the callback when you invoke the agent
if __name__ == "__main__":
    question = "How do I create nodes in the fusion page to put text at the center of the frame that says 'working?'"
    print("User:", question)

    rc = ReasoningCapture()
    result = AGENT.invoke({"input": question}, config={"callbacks": [rc]})

    # Debug-only panel (like your simple client)
    if rc.reasons:
        print("\n--- Reasoning (debug only) ---")
        for i, r in enumerate(rc.reasons, 1):
            print(f"\n[{i}] {r}\n")

    print("\n--- Final Answer ---\n", result.get("output", result))

    steps = result.get("intermediate_steps", [])
    if steps:
        print("\n--- Intermediate Steps (tool calls) ---")
        for i, (action, observation) in enumerate(steps, 1):
            print(f"\nStep {i}:")
            print("  Tool:", getattr(action, "tool", "<unknown>"))
            print("  Tool Input:", getattr(action, "tool_input", "<none>"))
            print("  Observation:", str(observation)[:1200].replace("\n", " "))






