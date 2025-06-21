Write-Host "=== Testing News Website API ===" -ForegroundColor Green
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Backend Health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET
    Write-Host "✅ Backend is running!" -ForegroundColor Green
    Write-Host "   Server: $($health.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend not responding. Make sure it's running on port 5000" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Get Categories
Write-Host "2. Testing Categories API..." -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method GET
    if ($categories.success) {
        Write-Host "✅ Categories loaded successfully!" -ForegroundColor Green
        Write-Host "   Found $($categories.data.categories.Count) categories:" -ForegroundColor Gray
        foreach ($cat in $categories.data.categories) {
            Write-Host "   - $($cat.name) (slug: $($cat.slug))" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ Failed to load categories" -ForegroundColor Red
}

Write-Host ""

# Test 3: Get All Articles
Write-Host "3. Testing Articles API..." -ForegroundColor Yellow
try {
    $articles = Invoke-RestMethod -Uri "http://localhost:5000/api/articles" -Method GET
    if ($articles.success) {
        Write-Host "✅ Articles loaded successfully!" -ForegroundColor Green
        Write-Host "   Found $($articles.data.articles.Count) articles" -ForegroundColor Gray
        Write-Host "   Sample articles and their categories:" -ForegroundColor Gray
        foreach ($article in $articles.data.articles | Select-Object -First 3) {
            Write-Host "   - '$($article.title)' → Category: $($article.category.name)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ Failed to load articles" -ForegroundColor Red
}

Write-Host ""

# Test 4: Test Category Filtering
Write-Host "4. Testing Category Filtering..." -ForegroundColor Yellow

# Get the first few categories to test with
try {
    $categoriesResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method GET
    if ($categoriesResponse.success -and $categoriesResponse.data.categories.Count -gt 0) {
        
        foreach ($category in $categoriesResponse.data.categories | Select-Object -First 2) {
            Write-Host "   Testing category: $($category.name) (slug: $($category.slug))" -ForegroundColor Cyan
            
            try {
                $categoryArticles = Invoke-RestMethod -Uri "http://localhost:5000/api/articles?category=$($category.slug)" -Method GET
                
                if ($categoryArticles.success) {
                    $count = $categoryArticles.data.articles.Count
                    Write-Host "   ✅ Found $count articles in '$($category.name)' category" -ForegroundColor Green
                    
                    # Verify all articles belong to this category
                    $wrongCategory = $categoryArticles.data.articles | Where-Object { $_.category.slug -ne $category.slug }
                    if ($wrongCategory.Count -eq 0) {
                        Write-Host "   ✅ All articles correctly assigned to '$($category.name)' category" -ForegroundColor Green
                    } else {
                        Write-Host "   ❌ Found $($wrongCategory.Count) articles with wrong category assignment!" -ForegroundColor Red
                    }
                } else {
                    Write-Host "   ❌ Failed to get articles for category '$($category.name)'" -ForegroundColor Red
                }
            } catch {
                Write-Host "   ❌ Error testing category '$($category.name)': $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
} catch {
    Write-Host "❌ Failed to test category filtering" -ForegroundColor Red
}

Write-Host ""

# Test 5: Frontend Accessibility
Write-Host "5. Testing Frontend..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 10
    if ($frontend.StatusCode -eq 200) {
        Write-Host "✅ Frontend is accessible at http://localhost:3000" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend not responding. Make sure it's running on port 3000" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Summary ===" -ForegroundColor Green
Write-Host ""
Write-Host "✅ If all tests passed, your category fix is working correctly!" -ForegroundColor Green
Write-Host "✅ Articles should now only appear in their assigned category sections" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "2. Check that Business articles only appear in Business section" -ForegroundColor White  
Write-Host "3. Check that Sports articles only appear in Sports section" -ForegroundColor White
Write-Host "4. Create test articles and verify they appear in correct sections" -ForegroundColor White
Write-Host "" 