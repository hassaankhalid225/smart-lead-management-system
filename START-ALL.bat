@echo off
REM ===========================================================================
REM  Smart Lead Management System - Full Stack Launcher
REM  Starts both Local n8n Server and React + Vite Frontend
REM ===========================================================================

title Smart Lead Management - All Services
cd /d "%~dp0"

echo.
echo ===========================================================================
echo   Starting Smart Lead Management System
echo   1. Starting n8n Automation Engine (http://localhost:5678)
echo   2. Starting React + Vite Web App  (http://localhost:5173)
echo ===========================================================================
echo.

start "Smart Leads - n8n Local" cmd /k "START-N8N.bat"
start "Smart Leads - React Frontend" cmd /k "pnpm run dev"

echo Services launched in separate windows!
echo - React Frontend:  http://localhost:5173
echo - n8n Automation:  http://localhost:5678
echo.
pause

