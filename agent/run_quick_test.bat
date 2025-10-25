@echo off
REM Quick test launcher for Windows
echo.
echo ========================================
echo DaVinci Resolve RAG - Quick Test
echo ========================================
echo.

cd /d "%~dp0"
python quick_test.py %*

echo.
pause
