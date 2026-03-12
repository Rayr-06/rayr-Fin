# ============================================================
#  RAYR – AI Portfolio Intelligence Engine
#  SETUP.ps1 — One-click project setup for Windows
#
#  USAGE:
#  1. Download this file to your RAYR project folder
#  2. Open PowerShell as Administrator
#  3. Run: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#  4. Run: .\SETUP.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "  RAYR Portfolio Intelligence Engine" -ForegroundColor Yellow
Write-Host "  =====================================" -ForegroundColor DarkGray
Write-Host "  Setting up your full project..." -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Check tools ───────────────────────────────────────
Write-Host "  [1/6] Checking prerequisites..." -ForegroundColor Cyan
$missing = @()

try   { $v = (& node --version 2>&1); Write-Host "        Node.js $v" -ForegroundColor DarkGray }
catch { $missing += "Node.js  -> https://nodejs.org" }

try   { $v = (& python --version 2>&1); Write-Host "        $v" -ForegroundColor DarkGray }
catch { $missing += "Python 3.10+  -> https://python.org" }

try   { $v = (& git --version 2>&1); Write-Host "        $v" -ForegroundColor DarkGray }
catch { $missing += "Git  -> https://git-scm.com" }

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "  ERROR: Install these tools first, then re-run SETUP.ps1:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "    - $_" -ForegroundColor Red }
    Write-Host ""
    exit 1
}
Write-Host "  OK - All prerequisites found" -ForegroundColor Green

# ── Step 2: Create folder structure ──────────────────────────
Write-Host "  [2/6] Creating project folders..." -ForegroundColor Cyan

$folders = @(
    "rayr-ui\src\components",
    "rayr-ui\src\data",
    "rayr-ui\src\hooks",
    "rayr-ui\public",
    "rayr-api\routers",
    "rayr-api\services",
    "rayr-api\models",
    "rayr-engine",
    "demo\app",
    "docs"
)

foreach ($f in $folders) {
    $path = Join-Path $ROOT $f
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Force -Path $path | Out-Null
    }
}
Write-Host "  OK - Folder structure created" -ForegroundColor Green

# ── Step 3: Copy App.jsx ──────────────────────────────────────
Write-Host "  [3/6] Setting up frontend..." -ForegroundColor Cyan

$appSrc = Join-Path $ROOT "rayr-v2.jsx"
$appDst = Join-Path $ROOT "rayr-ui\src\App.jsx"

if (Test-Path $appSrc) {
    Copy-Item $appSrc $appDst -Force
    $lines = (Get-Content $appDst).Count
    Write-Host "  OK - App.jsx copied ($lines lines)" -ForegroundColor Green
} else {
    Write-Host "  WARN - rayr-v2.jsx not found. Paste App.jsx content manually into rayr-ui\src\App.jsx" -ForegroundColor Yellow
    New-Item -ItemType File -Force $appDst | Out-Null
}

# Write frontend config files
$pkgJson = '{
  "name": "rayr-ui",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host",
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
    "vite": "^5.3.1"
  }
}'
$pkgJson | Set-Content (Join-Path $ROOT "rayr-ui\package.json") -Encoding UTF8

$viteConfig = "import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: { '/api': { target: 'http://localhost:8000', changeOrigin: true } }
  }
})"
$viteConfig | Set-Content (Join-Path $ROOT "rayr-ui\vite.config.js") -Encoding UTF8

$indexHtml = '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RAYR - Portfolio Intelligence</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>'
$indexHtml | Set-Content (Join-Path $ROOT "rayr-ui\index.html") -Encoding UTF8

$mainJsx = "import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(React.StrictMode, null, React.createElement(App, null))
)"
$mainJsx | Set-Content (Join-Path $ROOT "rayr-ui\src\main.jsx") -Encoding UTF8

$indexCss = "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#06080F;font-family:'Outfit',sans-serif;overflow-x:hidden;color:#E4E8F2}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1E2D45;border-radius:2px}"
$indexCss | Set-Content (Join-Path $ROOT "rayr-ui\src\index.css") -Encoding UTF8

Write-Host "  OK - Frontend config files written" -ForegroundColor Green

# ── Step 4: Backend requirements ─────────────────────────────
Write-Host "  [4/6] Setting up backend..." -ForegroundColor Cyan

$requirements = "fastapi==0.111.0
uvicorn[standard]==0.30.1
pydantic==2.7.4
python-dotenv==1.0.1
httpx==0.27.0
pandas==2.2.2
numpy==1.26.4
mftool==0.2.4
yfinance==0.2.40
requests==2.32.3"
$requirements | Set-Content (Join-Path $ROOT "rayr-api\requirements.txt") -Encoding UTF8

$envExample = "APP_ENV=development
SECRET_KEY=change-this-to-a-random-secret-key
FRONTEND_URL=http://localhost:3000
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/rayr
ANTHROPIC_API_KEY=sk-ant-your-key-here"
$envExample | Set-Content (Join-Path $ROOT "rayr-api\.env.example") -Encoding UTF8

$dockerfile = "FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD [""uvicorn"", ""main:app"", ""--host"", ""0.0.0.0"", ""--port"", ""8000""]"
$dockerfile | Set-Content (Join-Path $ROOT "rayr-api\Dockerfile") -Encoding UTF8

# Touch __init__ files
"" | Set-Content (Join-Path $ROOT "rayr-api\models\__init__.py")  -Encoding UTF8
"" | Set-Content (Join-Path $ROOT "rayr-api\routers\__init__.py") -Encoding UTF8
"" | Set-Content (Join-Path $ROOT "rayr-api\services\__init__.py")-Encoding UTF8
"" | Set-Content (Join-Path $ROOT "rayr-engine\__init__.py")      -Encoding UTF8

Write-Host "  OK - Backend config files written" -ForegroundColor Green

# ── Step 5: Root files ────────────────────────────────────────

$gitignore = "node_modules/
__pycache__/
*.pyc
.venv/
dist/
.env
*.log
.DS_Store
Thumbs.db
*.egg-info/"
$gitignore | Set-Content (Join-Path $ROOT ".gitignore") -Encoding UTF8

$dockerCompose = 'version: "3.9"
services:
  rayr-api:
    build: ./rayr-api
    ports: ["8000:8000"]
    volumes: [./rayr-api:/app]
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
  rayr-ui:
    build: ./rayr-ui
    ports: ["3000:3000"]
    depends_on: [rayr-api]'
$dockerCompose | Set-Content (Join-Path $ROOT "docker-compose.yml") -Encoding UTF8

# Write start.ps1
$startScript = "# RAYR - Start both servers
`$ROOT = Split-Path -Parent `$MyInvocation.MyCommand.Path
Write-Host 'Starting RAYR API...' -ForegroundColor Yellow
Start-Process powershell -ArgumentList `"-NoExit`", `"-Command cd '`$ROOT\rayr-api'; if(-not(Test-Path .venv)){python -m venv .venv}; .\.venv\Scripts\Activate.ps1; python main.py`"
Start-Sleep -Seconds 3
Write-Host 'Starting RAYR Frontend...' -ForegroundColor Yellow
Start-Process powershell -ArgumentList `"-NoExit`", `"-Command cd '`$ROOT\rayr-ui'; npm run dev`"
Start-Sleep -Seconds 5
Start-Process 'http://localhost:3000'
Write-Host ''
Write-Host 'RAYR is running!' -ForegroundColor Green
Write-Host 'App:      http://localhost:3000' -ForegroundColor Cyan
Write-Host 'API Docs: http://localhost:8000/api/docs' -ForegroundColor Cyan"
$startScript | Set-Content (Join-Path $ROOT "start.ps1") -Encoding UTF8

Write-Host "  OK - Root files written" -ForegroundColor Green

# ── Step 6: Install dependencies ─────────────────────────────
Write-Host "  [5/6] Installing npm packages (1-2 min)..." -ForegroundColor Cyan
Push-Location (Join-Path $ROOT "rayr-ui")
try {
    & npm install 2>&1 | Out-Null
    Write-Host "  OK - npm packages installed" -ForegroundColor Green
} catch {
    Write-Host "  WARN - npm install had issues. Run 'npm install' manually in rayr-ui/" -ForegroundColor Yellow
}
Pop-Location

Write-Host "  [6/6] Setting up Python environment (2-3 min)..." -ForegroundColor Cyan
Push-Location (Join-Path $ROOT "rayr-api")
try {
    & python -m venv .venv 2>&1 | Out-Null
    & ".\.venv\Scripts\python.exe" -m pip install --upgrade pip -q 2>&1 | Out-Null
    & ".\.venv\Scripts\python.exe" -m pip install -r requirements.txt -q 2>&1 | Out-Null
    Write-Host "  OK - Python packages installed (fastapi, uvicorn, yfinance, mftool, pandas)" -ForegroundColor Green
} catch {
    Write-Host "  WARN - pip install had issues. Run 'pip install -r requirements.txt' manually in rayr-api/" -ForegroundColor Yellow
}
Pop-Location

# Git init
Push-Location $ROOT
try {
    & git init -q 2>&1 | Out-Null
    & git add . 2>&1 | Out-Null
    & git commit -m "feat: initial RAYR project — AI Portfolio Intelligence Engine" -q 2>&1 | Out-Null
    Write-Host "  OK - Git repository initialized with first commit" -ForegroundColor Green
} catch {
    Write-Host "  WARN - Git init skipped" -ForegroundColor Yellow
}
Pop-Location

# ── Done ─────────────────────────────────────────────────────
Write-Host ""
Write-Host "  =============================================" -ForegroundColor DarkGray
Write-Host "  RAYR IS READY TO RUN" -ForegroundColor Green
Write-Host "  =============================================" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  START EVERYTHING (one command):" -ForegroundColor Yellow
Write-Host "  .\start.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Then open:" -ForegroundColor Yellow
Write-Host "  App:      http://localhost:3000" -ForegroundColor Cyan
Write-Host "  API Docs: http://localhost:8000/api/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "  PUSH TO GITHUB:" -ForegroundColor Yellow
Write-Host "  git remote add origin https://github.com/YOURUSERNAME/rayr.git" -ForegroundColor Cyan
Write-Host "  git push -u origin main" -ForegroundColor Cyan
Write-Host "  git subtree push --prefix demo origin gh-pages" -ForegroundColor Cyan
Write-Host ""
Write-Host "  =============================================" -ForegroundColor DarkGray
