#!/usr/bin/env python
"""
run_tests.py
============
Interactive testing script for the DaVinci Resolve RAG system.

This script allows you to:
1. Run predefined test queries
2. Ask your own custom questions
3. See detailed results from the vectorstore

Usage:
    python run_tests.py
"""

import os
import sys
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))


def print_header(text):
    """Print a formatted header"""
    print("\n" + "=" * 100)
    print(f"  {text}")
    print("=" * 100)


def print_section(text):
    """Print a formatted section"""
    print("\n" + "-" * 100)
    print(f"  {text}")
    print("-" * 100)


def clean_text(text):
    """Clean text for console output"""
    try:
        # Try to encode/decode to handle special characters
        return text.encode('ascii', 'ignore').decode('ascii')
    except:
        return str(text)


def initialize_rag():
    """Initialize the RAG system"""
    print_header("INITIALIZING DAVINCI RESOLVE RAG SYSTEM")

    print("\n[1/3] Loading environment variables...")
    api_key = os.getenv("NGC_API_KEY")
    if not api_key:
        print("ERROR: NGC_API_KEY not found in .env file!")
        print("Please make sure your .env file contains a valid NGC_API_KEY.")
        sys.exit(1)
    print("      NGC API Key found!")

    print("\n[2/3] Initializing NVIDIA Embeddings model...")
    print("      Model: nvidia/llama-3.2-nv-embedqa-1b-v2")
    emb = NVIDIAEmbeddings(
        model="nvidia/llama-3.2-nv-embedqa-1b-v2",
        nvidia_api_key=api_key
    )
    print("      Embeddings model initialized!")

    print("\n[3/3] Loading FAISS vectorstore...")
    vectorstore_path = os.path.join(os.path.dirname(__file__), "code", "vectorstore")
    if not os.path.exists(vectorstore_path):
        print(f"ERROR: Vectorstore not found at {vectorstore_path}")
        print("Please run the ingestion script first: python ingest_docs.py")
        sys.exit(1)

    vectordb = FAISS.load_local(
        vectorstore_path,
        emb,
        allow_dangerous_deserialization=True
    )
    print("      Vectorstore loaded successfully!")
    print(f"      Location: {vectorstore_path}")

    return vectordb


def run_query(retriever, query, show_count=3):
    """Run a single query and display results"""
    print_section(f"QUERY: {query}")

    print(f"\nSearching vectorstore (12,532 chunks)...")
    results = retriever.invoke(query)

    print(f"\nFound {len(results)} results. Showing top {min(show_count, len(results))}:\n")

    for i, doc in enumerate(results[:show_count], 1):
        print(f"\n{'#' * 100}")
        print(f"RESULT {i}/{show_count}")
        print(f"{'#' * 100}\n")

        # Show first 500 chars
        content = doc.page_content[:500]
        if len(doc.page_content) > 500:
            content += "\n\n[... truncated ...]"

        print(clean_text(content))
        print(f"\n{'-' * 100}")
        print(f"Full chunk length: {len(doc.page_content)} characters")
        print(f"{'-' * 100}")


def run_predefined_tests(retriever):
    """Run a set of predefined test queries"""
    print_header("RUNNING PREDEFINED TEST QUERIES")

    test_queries = [
        # Reference Manual queries
        ("Color Page", "How do I use the Color page in DaVinci Resolve?"),
        ("Fusion Page", "What are the Fusion page features?"),
        ("Export Codecs", "How do I export video with different codecs?"),
        ("Fairlight Audio", "What is the Fairlight audio page used for?"),

        # Scripting API queries
        ("Python API", "How do I access the DaVinci Resolve scripting API in Python?"),
        ("Keyframe Modes", "What are keyframe modes in DaVinci Resolve?"),

        # Advanced queries
        ("Automated Rendering", "How do I automate rendering using Python scripts?"),
        ("Timeline Operations", "What timeline operations can I perform with the API?"),
    ]

    print(f"\nTotal test queries: {len(test_queries)}")
    print("\nPress Enter after each query to continue...")

    for idx, (category, query) in enumerate(test_queries, 1):
        print(f"\n\n{'=' * 100}")
        print(f"TEST {idx}/{len(test_queries)}: {category}")
        print(f"{'=' * 100}")

        run_query(retriever, query, show_count=2)

        if idx < len(test_queries):
            input("\n>>> Press Enter to continue to next test...")

    print_header("PREDEFINED TESTS COMPLETE")
    print(f"\nAll {len(test_queries)} test queries completed successfully!")


def run_interactive_mode(retriever):
    """Run in interactive mode where user can ask questions"""
    print_header("INTERACTIVE MODE")
    print("\nYou can now ask your own questions about DaVinci Resolve!")
    print("The system will search through 12,532 chunks of documentation.")
    print("\nTips:")
    print("  - Ask about features (e.g., 'How do I use keyframes?')")
    print("  - Ask about pages (e.g., 'What is the Fairlight page?')")
    print("  - Ask about scripting (e.g., 'How do I automate timeline creation?')")
    print("  - Type 'quit' or 'exit' to stop")

    while True:
        print("\n" + "=" * 100)
        query = input("\nYour question: ").strip()

        if query.lower() in ['quit', 'exit', 'q', '']:
            print("\nExiting interactive mode...")
            break

        run_query(retriever, query, show_count=3)


def main():
    """Main function"""
    print("\n" + "=" * 100)
    print(" " * 25 + "DAVINCI RESOLVE RAG TESTING SCRIPT")
    print(" " * 30 + "by Claude Code Agent")
    print("=" * 100)

    # Initialize RAG system
    vectordb = initialize_rag()
    retriever = vectordb.as_retriever(search_kwargs={"k": 5})

    # Main menu
    while True:
        print_header("MAIN MENU")
        print("\nWhat would you like to do?\n")
        print("  1. Run predefined test queries (8 queries)")
        print("  2. Interactive mode (ask your own questions)")
        print("  3. Quick single query test")
        print("  4. Exit")

        choice = input("\nEnter your choice (1-4): ").strip()

        if choice == '1':
            run_predefined_tests(retriever)
        elif choice == '2':
            run_interactive_mode(retriever)
        elif choice == '3':
            print_section("QUICK SINGLE QUERY TEST")
            query = input("\nEnter your question: ").strip()
            if query:
                run_query(retriever, query, show_count=3)
        elif choice == '4':
            print_header("THANK YOU FOR TESTING!")
            print("\nThe RAG system is ready for use in your vibe-edit application.")
            print("Documentation indexed: DaVinci Resolve 20 Reference Manual + Scripting API")
            print("Total chunks: 12,532")
            print("\nGoodbye!\n")
            break
        else:
            print("\nInvalid choice. Please enter 1, 2, 3, or 4.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nInterrupted by user. Exiting...")
        sys.exit(0)
    except Exception as e:
        print(f"\n\nERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
