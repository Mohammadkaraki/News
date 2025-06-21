@echo off
echo Starting Telegram News Bot...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist "../.env" (
    echo Error: .env file not found!
    echo Please copy env.example to .env and configure your settings
    pause
    exit /b 1
)

REM Change to backend directory
cd /d "%~dp0..\"

echo Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting Telegram Bot...
echo Press Ctrl+C to stop the bot
echo.

node telegram/telegramBot.js

pause 