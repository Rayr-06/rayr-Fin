# ============================================================
# RAYR - Push New App.jsx to GitHub
# Run this from: C:\Users\adith\Desktop\rayr-clean\rayr-Fin
# ============================================================

Write-Host ""
Write-Host "RAYR - Pushing new clean app to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── STEP 1: Check we are in the right folder ──
if (-not (Test-Path "rayr-ui")) {
    Write-Host "ERROR: Run this script from your rayr-Fin folder" -ForegroundColor Red
    Write-Host "cd C:\Users\adith\Desktop\rayr-clean\rayr-Fin" -ForegroundColor Yellow
    exit 1
}

# ── STEP 2: Copy new App.jsx ──
$SOURCE = "$env:USERPROFILE\Downloads\App.jsx"
$DEST   = "rayr-ui\src\App.jsx"

if (Test-Path $SOURCE) {
    Write-Host "Copying new App.jsx from Downloads..." -ForegroundColor Green
    Copy-Item -Force $SOURCE $DEST
    Write-Host "Done." -ForegroundColor Green
} else {
    Write-Host "App.jsx not found in Downloads." -ForegroundColor Yellow
    Write-Host "Make sure you downloaded it, then run again." -ForegroundColor Yellow
    Write-Host "(Or manually copy App.jsx to rayr-ui\src\App.jsx)" -ForegroundColor Yellow
    exit 1
}

# ── STEP 3: Git - add everything and push ──
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan

git add -A
git commit -m "Rebuild: clean App.jsx, real onboarding, dynamic portfolio engine"
git push origin main

Write-Host ""
Write-Host "Done! Pushed to GitHub." -ForegroundColor Green
Write-Host ""
Write-Host "GitHub Actions will now auto-build and deploy." -ForegroundColor Cyan
Write-Host "Live in ~2 minutes at: https://rayr-06.github.io/rayr-Fin" -ForegroundColor Yellow
Write-Host ""
