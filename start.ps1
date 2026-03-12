Write-Host ""
Write-Host "==================================" -ForegroundColor Yellow
Write-Host "Starting RAYR Platform" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Yellow
Write-Host ""

$ROOT = Get-Location

# Start Backend
Write-Host "Starting Backend API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
cd '$ROOT\rayr-api'
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
"

# Start Frontend
Write-Host "Starting Frontend UI..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
cd '$ROOT\rayr-ui'
npm run dev
"

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "RAYR is starting..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173"
Write-Host "API Docs: http://localhost:8000/docs"
Write-Host "==================================" -ForegroundColor Green