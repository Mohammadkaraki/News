# 🚀 Start News Platform Servers
# PowerShell script to start both backend and frontend servers

Write-Host "🔧 Starting News Platform Servers..." -ForegroundColor Cyan

# Function to check if port is available
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

# Check if backend .env exists
if (Test-Path "backend\.env") {
    Write-Host "✅ Backend .env file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Creating .env from template..." -ForegroundColor Yellow
    if (Test-Path "backend\env.example") {
        Copy-Item "backend\env.example" "backend\.env"
        Write-Host "✅ .env file created" -ForegroundColor Green
    } else {
        Write-Host "❌ env.example not found in backend directory" -ForegroundColor Red
        exit 1
    }
}

# Check ports
if (Test-Port 5000) {
    Write-Host "⚠️  Port 5000 is already in use. Please stop existing backend server." -ForegroundColor Yellow
}

if (Test-Port 3000) {
    Write-Host "⚠️  Port 3000 is already in use. Please stop existing frontend server." -ForegroundColor Yellow
}

Write-Host "`n🖥️  Starting Backend Server..." -ForegroundColor Cyan

# Start backend server in background
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend
    npm start
}

Write-Host "✅ Backend server starting... (Job ID: $($backendJob.Id))" -ForegroundColor Green

# Wait a moment for backend to initialize
Start-Sleep -Seconds 3

Write-Host "`n🌐 Starting Frontend Server..." -ForegroundColor Cyan

# Start frontend server in background
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev
}

Write-Host "✅ Frontend server starting... (Job ID: $($frontendJob.Id))" -ForegroundColor Green

# Wait for servers to start
Write-Host "`n⏳ Waiting for servers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Test connections
Write-Host "`n🔍 Testing server connections..." -ForegroundColor Cyan

# Test backend
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 5
    if ($backendResponse.StatusCode -eq 200) {
        Write-Host "✅ Backend server is running on http://localhost:5000" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Backend responded with status: $($backendResponse.StatusCode)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Backend server not responding: $($_.Exception.Message)" -ForegroundColor Red
}

# Test frontend
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend server is running on http://localhost:3000" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Frontend responded with status: $($frontendResponse.StatusCode)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Frontend server not responding: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open browser to http://localhost:3000" -ForegroundColor White
Write-Host "2. Navigate to http://localhost:3000/login" -ForegroundColor White
Write-Host "3. Login with: admin@newsapp.com / Admin123!" -ForegroundColor White
Write-Host "4. Go to Admin Dashboard to test article creation" -ForegroundColor White

Write-Host "`n📊 Server Jobs:" -ForegroundColor Cyan
Write-Host "Backend Job ID: $($backendJob.Id)" -ForegroundColor White
Write-Host "Frontend Job ID: $($frontendJob.Id)" -ForegroundColor White

Write-Host "`n🛑 To stop servers, run:" -ForegroundColor Yellow
Write-Host "Stop-Job $($backendJob.Id), $($frontendJob.Id); Remove-Job $($backendJob.Id), $($frontendJob.Id)" -ForegroundColor White

Write-Host "`n📄 Check test-article-creation.md for detailed testing guide" -ForegroundColor Cyan

# Keep script running to monitor servers
Write-Host "`nPress Ctrl+C to stop all servers and exit..." -ForegroundColor Yellow

try {
    while ($true) {
        Start-Sleep -Seconds 5
        
        # Check job status
        $backendStatus = Get-Job -Id $backendJob.Id | Select-Object -ExpandProperty State
        $frontendStatus = Get-Job -Id $frontendJob.Id | Select-Object -ExpandProperty State
        
        if ($backendStatus -eq "Failed") {
            Write-Host "❌ Backend server failed. Check job output:" -ForegroundColor Red
            Receive-Job -Id $backendJob.Id
        }
        
        if ($frontendStatus -eq "Failed") {
            Write-Host "❌ Frontend server failed. Check job output:" -ForegroundColor Red
            Receive-Job -Id $frontendJob.Id
        }
    }
}
finally {
    Write-Host "`n🛑 Stopping servers..." -ForegroundColor Yellow
    Stop-Job $backendJob.Id, $frontendJob.Id -ErrorAction SilentlyContinue
    Remove-Job $backendJob.Id, $frontendJob.Id -ErrorAction SilentlyContinue
    Write-Host "✅ Servers stopped." -ForegroundColor Green
} 