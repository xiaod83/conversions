#!/bin/bash

# Simple server launcher for AI Intersections
# This script starts a local development server

echo "🚀 Starting AI Intersections development server..."
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Using Python 3..."
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Using Python..."
    python -m http.server 8000
else
    echo "❌ Python not found. Please install Python to run the development server."
    echo ""
    echo "Alternative methods:"
    echo "1. Use Node.js: npm install -g http-server && http-server"
    echo "2. Use PHP: php -S localhost:8000"
    echo "3. Use any local web server of your choice"
fi