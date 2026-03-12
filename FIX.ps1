# RAYR FIX.ps1
# Fixes: port 3000 conflict with Open WebUI + Vite version mismatch
# Run from: C:\Users\adith\Desktop\akka\RAYR - AI Portfolio Intelligence\rayr

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$UI = "$ROOT\rayr-ui"

Write-Host ""
Write-Host "RAYR Fix Script" -ForegroundColor Yellow
Write-Host "Fixing port conflict and Vite version..." -ForegroundColor Cyan
Write-Host ""

# ── Fix 1: Write correct vite.config.js ─────────────────────
Write-Host "[1] Fixing vite.config.js (port 5173, not 3000)..." -ForegroundColor Yellow
Set-Content "$UI\vite.config.js" -Encoding UTF8 "import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})"
Write-Host "    Done." -ForegroundColor Green

# ── Fix 2: Write correct package.json (latest vite) ─────────
Write-Host "[2] Fixing package.json (vite latest, all deps)..." -ForegroundColor Yellow
Set-Content "$UI\package.json" -Encoding UTF8 '{
  "name": "rayr-ui",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^2.12.7",
    "react-router-dom": "^6.24.1",
    "axios": "^1.7.2",
    "lucide-react": "^0.395.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "latest"
  }
}'
Write-Host "    Done." -ForegroundColor Green

# ── Fix 3: Write correct main.jsx ───────────────────────────
Write-Host "[3] Fixing main.jsx..." -ForegroundColor Yellow
Set-Content "$UI\src\main.jsx" -Encoding UTF8 "import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(React.StrictMode, null,
    React.createElement(App, null)
  )
)"
Write-Host "    Done." -ForegroundColor Green

# ── Fix 4: Delete node_modules and reinstall fresh ──────────
Write-Host "[4] Reinstalling npm packages fresh..." -ForegroundColor Yellow
Push-Location $UI
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
}
npm install
Pop-Location
Write-Host "    Done." -ForegroundColor Green

# ── Fix 5: Make sure App.jsx is in place ─────────────────────
Write-Host "[5] Checking App.jsx..." -ForegroundColor Yellow
$appJsx = "$UI\src\App.jsx"
if (Test-Path $appJsx) {
    $lines = (Get-Content $appJsx).Count
    Write-Host "    App.jsx found - $lines lines" -ForegroundColor Green
} else {
    Write-Host "    App.jsx MISSING - copying from parent folder..." -ForegroundColor Red
    $src = "$ROOT\..\rayr-v2.jsx"
    if (Test-Path $src) {
        Copy-Item $src $appJsx -Force
        Write-Host "    Copied." -ForegroundColor Green
    } else {
        Write-Host "    rayr-v2.jsx not found in parent. Copy it manually." -ForegroundColor Red
    }
}

# ── All fixed - now start ────────────────────────────────────
Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "  ALL FIXES APPLIED" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Starting frontend now..." -ForegroundColor Cyan
Write-Host ""
Write-Host "  When you see 'VITE ready', open:" -ForegroundColor Yellow
Write-Host "  http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "  (Starting in this window - press Ctrl+C to stop)" -ForegroundColor DarkGray
Write-Host ""

Push-Location $UI
npm run dev
