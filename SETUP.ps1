# ============================================================

# RAYR - AI Portfolio Intelligence Engine

# SETUP.ps1 — Stable Version

# ============================================================

$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "RAYR - Portfolio Intelligence Engine" -ForegroundColor Yellow
Write-Host "Setting up your full project..." -ForegroundColor Cyan
Write-Host ""

# ------------------------------------------------------------

# 1. Check prerequisites

# ------------------------------------------------------------

Write-Host "[1/7] Checking prerequisites..." -ForegroundColor Cyan

$missing = @()

try { $null = node --version } catch { $missing += "Node.js -> https://nodejs.org" }
try { $null = python --version } catch { $missing += "Python -> https://python.org" }
try { $null = git --version } catch { $missing += "Git -> https://git-scm.com" }

if ($missing.Count -gt 0) {
Write-Host ""
Write-Host "Missing required tools:" -ForegroundColor Red
$missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
exit 1
}

Write-Host "OK - Node.js, Python, Git detected" -ForegroundColor Green

# ------------------------------------------------------------

# 2. Create folder structure

# ------------------------------------------------------------

Write-Host "[2/7] Creating project folders..." -ForegroundColor Cyan

$folders = @(
"rayr-ui\src\components",
"rayr-ui\src\pages",
"rayr-ui\src\data",
"rayr-ui\src\hooks",
"rayr-ui\public",
"rayr-api\routers",
"rayr-api\models",
"rayr-api\services",
"rayr-engine",
"demo",
"docs"
)

foreach ($f in $folders) {
New-Item -ItemType Directory -Force -Path "$ROOT$f" | Out-Null
}

Write-Host "OK - Folder structure created" -ForegroundColor Green

# ------------------------------------------------------------

# 3. Copy App.jsx if available

# ------------------------------------------------------------

Write-Host "[3/7] Copying App.jsx..." -ForegroundColor Cyan

$srcJsx = "$ROOT\rayr-v2.jsx"
$dstFolder = "$ROOT\rayr-ui\src"
$dstJsx = "$dstFolder\App.jsx"

# Ensure destination exists
New-Item -ItemType Directory -Force -Path $dstFolder | Out-Null

if (Test-Path $srcJsx) {
    Copy-Item $srcJsx $dstJsx -Force
    Write-Host "OK - rayr-v2.jsx copied" -ForegroundColor Green
}
else {
    Write-Host "WARN - rayr-v2.jsx not found, creating placeholder App.jsx" -ForegroundColor Yellow

@"
export default function App() {
  return (
    <div style={{padding:40,fontFamily:'Arial'}}>
      <h1>RAYR Portfolio Intelligence</h1>
      <p>Setup successful.</p>
    </div>
  )
}
"@ | Set-Content $dstJsx
}
# ------------------------------------------------------------

# 4. Frontend config

# ------------------------------------------------------------

Write-Host "[4/7] Writing frontend config..." -ForegroundColor Cyan

$pkg = @{
name="rayr-ui"
private=$true
version="1.0.0"
type="module"
scripts=@{
dev="vite --host"
build="vite build"
preview="vite preview"
}
dependencies=@{
react="^18.3.1"
"react-dom"="^18.3.1"
recharts="^2.12.7"
"react-router-dom"="^6.24.1"
axios="^1.7.2"
"lucide-react"="^0.395.0"
}
devDependencies=@{
"@vitejs/plugin-react"="^4.3.1"
vite="^5.3.1"
}
} | ConvertTo-Json -Depth 5

$pkg | Set-Content "$ROOT\rayr-ui\package.json" -Encoding UTF8

Set-Content "$ROOT\rayr-ui\vite.config.js" -Encoding UTF8 -Value @"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
plugins: [react()],
server: {
port: 3000,
proxy: {
'/api': {
target: 'http://localhost:8000',
changeOrigin: true
}
}
}
})
"@

Set-Content "$ROOT\rayr-ui\index.html" -Encoding UTF8 -Value @"

<!DOCTYPE html>

<html>
<head>
<meta charset="UTF-8" />
<title>RAYR</title>
</head>
<body>
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
</body>
</html>
"@

Set-Content "$ROOT\rayr-ui\src\main.jsx" -Encoding UTF8 -Value @"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode> <App />
</React.StrictMode>
)
"@

Write-Host "OK - Frontend config created" -ForegroundColor Green

# ------------------------------------------------------------

# 5. Backend files

# ------------------------------------------------------------

Write-Host "[5/7] Writing backend files..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path "$ROOT\rayr-api" | Out-Null

Set-Content "$ROOT\rayr-api\requirements.txt" -Encoding UTF8 -Value @"
fastapi
uvicorn
pandas
numpy
yfinance
mftool
requests
"@

Set-Content "$ROOT\rayr-api\main.py" -Encoding UTF8 -Value @"
from fastapi import FastAPI

app = FastAPI(title='RAYR API')

@app.get('/')
def root():
return {'status':'running'}

@app.get('/api/ping')
def ping():
return {'status':'ok'}
"@

Write-Host "OK - Backend created" -ForegroundColor Green

# ------------------------------------------------------------

# 6. Install dependencies

# ------------------------------------------------------------

Write-Host "[6/7] Installing dependencies..." -ForegroundColor Cyan

Push-Location "$ROOT\rayr-ui"
Write-Host "Running npm install..."
npm install
Pop-Location

Push-Location "$ROOT\rayr-api"

Write-Host "Creating Python venv..."
python -m venv venv

Write-Host "Installing Python packages..."
.\venv\Scripts\python.exe -m pip install -r requirements.txt

Pop-Location

Write-Host "OK - Dependencies installed" -ForegroundColor Green

# ------------------------------------------------------------

# 7. Initialize git

# ------------------------------------------------------------

Write-Host "[7/7] Initializing Git..." -ForegroundColor Cyan

Push-Location $ROOT

git init
git add .
git commit -m "Initial RAYR setup"

Pop-Location

Write-Host "OK - Git repo ready" -ForegroundColor Green

Write-Host ""
Write-Host "==================================" -ForegroundColor DarkGray
Write-Host "RAYR SETUP COMPLETE" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Run the platform with:"
Write-Host ".\start.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://localhost:3000"
Write-Host "API Docs: http://localhost:8000/docs"
