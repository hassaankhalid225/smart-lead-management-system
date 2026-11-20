@echo off
REM ===========================================================================
REM  Smart Lead Management System - Local n8n Server Runner
REM ===========================================================================

title Smart Lead Management - n8n Local Server
cd /d "%~dp0"

set "N8N_PORT=5678"
set "N8N_SECURE_COOKIE=false"
set "GENERIC_TIMEZONE=Asia/Karachi"
set "N8N_DIAGNOSTICS_ENABLED=false"
set "N8N_VERSION_NOTIFICATIONS_ENABLED=false"
set "N8N_TEMPLATES_ENABLED=false"
set "WEBHOOK_URL=http://localhost:5678/"

echo.
echo ===========================================================================
echo   Starting local n8n server on: http://localhost:5678
echo   Webhook endpoint: http://localhost:5678/webhook/smart-lead-intake
echo   Leave this console window running while testing!
echo ===========================================================================
echo.

npx -y n8n start
