@echo off
REM Simple server launcher for AI Intersections (Windows)
REM This script starts a local development server

echo 🚀 Starting AI Intersections development server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python...
    echo.
    echo 🌐 Server will be available at: http://localhost:8000
    echo 📱 Admin panel at: http://localhost:8000/admin-panel.html
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
) else (
    echo ❌ Python not found. Please install Python to run the development server.
    echo.
    echo Alternative methods:
    echo 1. Use Node.js: npm install -g http-server ^&^& http-server
    echo 2. Use the Node.js server: npm install ^&^& npm start
    echo 3. Use any local web server of your choice
    echo.
    pause
)