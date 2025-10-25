#!/bin/bash
# Quick test launcher for Linux/Mac

echo ""
echo "========================================"
echo "DaVinci Resolve RAG - Quick Test"
echo "========================================"
echo ""

cd "$(dirname "$0")"
python quick_test.py "$@"

echo ""
