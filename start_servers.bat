@echo off
title FortuneForge Launcher
echo ==================================================
echo           Starting FortuneForge Servers
echo ==================================================
echo.

:: 1. Launch FastAPI Python Backend
echo [1/2] Starting Python FastAPI Backend on port 8000...
start "FortuneForge Backend" cmd /k "cd BackEnd\FortuneForge\backend && .venv\Scripts\activate && python -m uvicorn app.main:app --reload --port 8000 --host 127.0.0.1"

:: 2. Launch Vite React Frontend
echo [2/2] Starting React Vite Frontend...
start "FortuneForge Frontend" cmd /k "cd FrontEnd && npm run dev"

echo.
echo ==================================================
echo Both servers are starting in separate windows!
echo - Backend: http://127.0.0.1:8000
echo - Frontend: http://localhost:5173
echo ==================================================
pause
