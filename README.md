# RAYR – AI Portfolio Intelligence Engine

> *Your portfolio deserves a doctor, not a chart.*

RAYR diagnoses portfolio weaknesses, explains risks in plain English, and guides investors toward better decisions — like having a family doctor for your investments.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://python.org)

---

## Live Demo

**[→ rayr.app/demo](https://yourusername.github.io/rayr)**

---

## What RAYR Does

Most Indian investors stare at their Zerodha or Groww dashboard at 11pm wondering *"Am I doing this right?"*

RAYR answers that question — clearly, honestly, and without jargon.

| Feature | What it tells you |
|---|---|
| **Portfolio Health Score** | A single 0–100 score across 6 dimensions |
| **Exposure Map** | Exactly where your money is — sector, asset class, market cap |
| **Fund Overlap Detector** | Which funds share the same stocks (and what it costs you) |
| **Risk Simulator** | What happens to your ₹ if Nifty crashes 20% |
| **Tax Planner** | When to sell to save on STCG vs LTCG tax |
| **SIP Tracker** | 20-year projection at 3 return scenarios |
| **Goal Tracker** | Are you on track for home / retirement / education? |
| **News For You** | Only news that affects your actual holdings |
| **Optimizer** | Specific actions to improve your score |
| **Dr. RAYR** | Ask anything — plain English AI advisor |

---

## Architecture

RAYR follows a 4-pillar modular architecture (from Master.md):

```
┌─────────────────────────────────────────────────┐
│                 Experience Layer                 │
│         rayr-ui  (Vite + React + Recharts)       │
└──────────────────────┬──────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────┐
│                  Insight Engine                  │
│         rayr-api  (FastAPI + Python)             │
│   /insights  /chat  /news  /optimize             │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│                Analytics Engine                  │
│              rayr-engine  (Python)               │
│  portfolio_analyzer  risk_engine  overlap_       │
│  detector  optimizer  simulation_engine          │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│                   Data Layer                     │
│      mftool (AMFI NAV)  yfinance (NSE/BSE)       │
│      AMFI holdings API  RBI rate feeds           │
└─────────────────────────────────────────────────┘
```

---

## Tech Stack — 100% Free & Open Source

| Layer | Tool | Why |
|---|---|---|
| Frontend | Vite + React 18 | Fast, modern, HMR |
| Charts | Recharts | Beautiful financial charts |
| Backend | FastAPI (Python) | Auto-docs, typed, fast |
| MF Data | mftool | Free AMFI NAV + holdings |
| Market Data | yfinance | Free NSE/BSE prices |
| Analytics | pandas + numpy | Institutional-grade math |
| AI Advisor | Claude API (Anthropic) | Best-in-class LLM |
| Hosting | Railway.app free tier | $0/month to start |
| Database | MongoDB Atlas free | 512MB free tier |

---

## Project Structure

```
rayr/
├── rayr-ui/                  ← Frontend (Vite + React)
│   ├── src/
│   │   ├── App.jsx           ← Full 12-section application
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── rayr-api/                 ← Backend (FastAPI)
│   ├── main.py               ← All API endpoints
│   ├── requirements.txt
│   └── Dockerfile
│
├── rayr-engine/              ← Analytics Engine (Python)
│   ├── portfolio_analyzer.py ← NAV + returns + diversification
│   ├── risk_engine.py        ← Volatility, drawdown, Sharpe, stress test
│   ├── overlap_detector.py   ← Fund overlap via AMFI holdings
│   └── optimizer.py          ← Recommendation engine
│
├── demo/                     ← GitHub Pages landing page
│   └── index.html
│
├── docs/
│   └── ARCHITECTURE.md
│
├── SETUP.ps1                 ← One-click Windows setup
├── start.ps1                 ← One-click dev launch
├── docker-compose.yml
└── README.md
```

---

## Quick Start

### Windows (One Command)
```powershell
# From the project root folder:
.\SETUP.ps1
```

Then start everything:
```powershell
.\start.ps1
```

### Manual Start
```powershell
# Terminal 1 — Backend API
cd rayr-api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
# API running at http://localhost:8000/api/docs

# Terminal 2 — Frontend
cd rayr-ui
npm install
npm run dev
# App running at http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/portfolio/demo` | Demo portfolio data |
| POST | `/api/portfolio/analyze` | Analyze a custom portfolio |
| GET | `/api/analytics/health/{id}` | Health score + breakdown |
| GET | `/api/analytics/exposure/{id}` | Sector + asset exposure map |
| GET | `/api/analytics/overlap/{id}` | Fund overlap detection |
| POST | `/api/analytics/stress-test` | Market scenario simulation |
| GET | `/api/analytics/tax/{id}` | Tax optimization plan |
| GET | `/api/analytics/optimize/{id}` | Portfolio recommendations |
| GET | `/api/analytics/sip/{id}` | SIP projection (20 years) |
| GET | `/api/insights/{id}` | AI-generated insights |
| POST | `/api/insights/chat` | Dr. RAYR chat advisor |
| GET | `/api/news/{id}` | Portfolio-relevant news |

Full interactive docs: **http://localhost:8000/api/docs**

---

## Deploy to GitHub Pages (Demo)

```bash
git remote add origin https://github.com/YOURUSERNAME/rayr.git
git push -u origin main
git subtree push --prefix demo origin gh-pages
```

Your landing page goes live at `https://YOURUSERNAME.github.io/rayr`

---

## Roadmap (Master.md)

- [x] **Phase 1 — Foundation**: Portfolio ingestion, exposure analysis, basic analytics
- [x] **Phase 2 — Risk Intelligence**: Volatility, correlation, diversification score
- [x] **Phase 3 — Scenario Analysis**: Crash simulations, economic event modeling
- [x] **Phase 4 — Optimization**: Improvement suggestions, rebalancing logic
- [ ] **Phase 5 — AI Insight Layer**: Live Claude API integration with portfolio context
- [ ] **Phase 6 — Live Data**: Full mftool + yfinance integration replacing mock data
- [ ] **Phase 7 — Auth + Profiles**: User accounts, portfolio persistence
- [ ] **Phase 8 — Mobile**: React Native app

---

## Data Sources & Transparency

Every metric in RAYR shows its data source and calculation method.

| Data | Source | Cost |
|---|---|---|
| Mutual Fund NAV | AMFI via mftool | Free |
| Stock/ETF Prices | NSE via yfinance | Free |
| Fund Holdings | AMFI monthly disclosure | Free |
| Interest Rates | RBI website | Free |
| Sector Classification | NSE/SEBI | Free |

---

## License

MIT License — free to use, modify, and build on.

---

## About

Built by an Indian investor for Indian investors.
The tool I wished existed when I started investing.

*"Is my portfolio healthy?"* — RAYR answers this. Clearly.

---

*RAYR is not SEBI registered. This is a portfolio analysis tool, not investment advice.*
