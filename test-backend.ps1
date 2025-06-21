# Backend API Testing Script
Write-Host "🔍 Testing Backend API Endpoints..." -ForegroundColor Cyan

$baseUrl = "http://localhost:5000"

# Test Health Endpoint
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Health Check: SUCCESS" -ForegroundColor Green
    Write-Host "   Server Status: $($health.message)" -ForegroundColor White
    Write-Host "   Environment: $($health.environment)" -ForegroundColor White
} catch {
    Write-Host "❌ Health Check: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Articles Endpoint
Write-Host "`n2. Testing Articles Endpoint..." -ForegroundColor Yellow
try {
    $articles = Invoke-RestMethod -Uri "$baseUrl/api/articles" -Method GET
    Write-Host "✅ Articles API: SUCCESS" -ForegroundColor Green
    if ($articles.data.articles) {
        Write-Host "   Articles Count: $($articles.data.articles.Count)" -ForegroundColor White
    } else {
        Write-Host "   Articles: No data returned" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Articles API: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Categories Endpoint
Write-Host "`n3. Testing Categories Endpoint..." -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "$baseUrl/api/categories" -Method GET
    Write-Host "✅ Categories API: SUCCESS" -ForegroundColor Green
    if ($categories.data.categories) {
        Write-Host "   Categories Count: $($categories.data.categories.Count)" -ForegroundColor White
    } else {
        Write-Host "   Categories: No data returned" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Categories API: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Featured Articles
Write-Host "`n4. Testing Featured Articles..." -ForegroundColor Yellow
try {
    $featured = Invoke-RestMethod -Uri "$baseUrl/api/articles/featured" -Method GET
    Write-Host "✅ Featured Articles: SUCCESS" -ForegroundColor Green
    if ($featured.data.articles) {
        Write-Host "   Featured Count: $($featured.data.articles.Count)" -ForegroundColor White
    } else {
        Write-Host "   Featured Articles: No data returned" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Featured Articles: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Root API Endpoint
Write-Host "`n5. Testing Root API..." -ForegroundColor Yellow
try {
    $root = Invoke-RestMethod -Uri "$baseUrl/" -Method GET
    Write-Host "✅ Root API: SUCCESS" -ForegroundColor Green
    Write-Host "   Message: $($root.message)" -ForegroundColor White
} catch {
    Write-Host "❌ Root API: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📊 Backend Test Summary:" -ForegroundColor Cyan
Write-Host "If all tests show SUCCESS, the backend is working correctly." -ForegroundColor White
Write-Host "If any tests FAIL, that's likely causing the frontend error." -ForegroundColor White

Write-Host "`n🔧 Common Issues:" -ForegroundColor Yellow
Write-Host "- Database connection issues (MongoDB)" -ForegroundColor White
Write-Host "- Missing environment variables" -ForegroundColor White
Write-Host "- CORS configuration problems" -ForegroundColor White
Write-Host "- Empty database (no articles/categories)" -ForegroundColor White 