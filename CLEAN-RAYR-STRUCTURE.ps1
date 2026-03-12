Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "RAYR STRUCTURE CLEANUP" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

$root = "C:\Users\adith\Desktop\akka\RAYR – AI Portfolio Intelligence"
$project = "$root\rayr"

Write-Host ""
Write-Host "Creating backup..." -ForegroundColor Yellow
Copy-Item $root "$root\backup_before_cleanup" -Recurse -Force
Write-Host "Backup created." -ForegroundColor Green

Write-Host ""
Write-Host "Cleaning root directory..." -ForegroundColor Yellow

Get-ChildItem $root | Where-Object {
    $_.Name -ne "rayr" -and
    $_.Name -ne "backup_before_cleanup"
} | Remove-Item -Recurse -Force

Write-Host "Root cleaned. Only project folder remains." -ForegroundColor Green


Write-Host ""
Write-Host "Cleaning unnecessary scripts inside project..." -ForegroundColor Yellow

$files = @(
"FIX.ps1",
"PATCH.ps1",
"PUSH.ps1",
"PUSH-TO-GITHUB.ps1",
"RESTORE.ps1",
"deploy.yml",
"rayr-v2.jsx",
"App.jsx"
)

foreach ($file in $files) {
    $path = Join-Path $project $file
    if (Test-Path $path) {
        Remove-Item $path -Force
        Write-Host "Removed $file"
    }
}

Write-Host ""
Write-Host "Cleanup complete." -ForegroundColor Green


Write-Host ""
Write-Host "Preparing Git..." -ForegroundColor Yellow
Set-Location $project

git add .
git commit -m "cleanup: simplified project structure"
git push

Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host "RAYR PROJECT CLEANED SUCCESSFULLY" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green