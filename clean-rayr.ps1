Write-Host "Cleaning RAYR project..." -ForegroundColor Cyan

$root = "C:\Users\adith\Desktop\akka\rayr-ai"

cd $root

Write-Host "Removing Python virtual environments..."
Get-ChildItem -Path . -Recurse -Directory -Filter ".venv" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Removing node_modules..."
Get-ChildItem -Path . -Recurse -Directory -Filter "node_modules" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Removing Python cache..."
Get-ChildItem -Path . -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Removing dist folders..."
Get-ChildItem -Path . -Recurse -Directory -Filter "dist" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Removing build folders..."
Get-ChildItem -Path . -Recurse -Directory -Filter "build" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Cleanup complete!" -ForegroundColor Green