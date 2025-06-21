#!/bin/bash

echo "Starting Telegram News Bot..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if .env file exists
if [ ! -f "../.env" ]; then
    echo "Error: .env file not found!"
    echo "Please copy env.example to .env and configure your settings"
    exit 1
fi

# Change to backend directory
cd "$(dirname "$0")/.."

echo "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies"
        exit 1
    fi
fi

echo
echo "Starting Telegram Bot..."
echo "Press Ctrl+C to stop the bot"
echo

node telegram/telegramBot.js 