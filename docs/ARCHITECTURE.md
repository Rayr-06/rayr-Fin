# RAYR Architecture Document

## Vision

RAYR is the most intuitive and trustworthy portfolio intelligence tool for investors.
It focuses on diagnosing portfolio weaknesses, explaining risks, and guiding investors toward better decisions.

---

## Four Core Pillars (Master.md)

### Pillar 1 — Data Layer (`rayr-engine/portfolio_analyzer.py`)

Responsible for collecting and normalizing financial data.

| Data Type | Source | Module | Frequency |
|---|---|---|---|
| MF NAV | AMFI via mftool | `get_mf_nav()` | Daily |
| Fund Holdings | AMFI monthly | `overlap_detector.py` | Monthly |
| Stock Prices | NSE via yfinance | `get_live_stock_price()` | Real-time |
| ETF Prices | BSE via yfinance | `get_live_stock_price()` | Real-time |
| Macro Indicators | RBI website | Planned Phase 6 | Weekly |

Every API response includes:
- `data_source` — where the data comes from
- `calculation_method` — how the metric is computed
- `last_updated` — timestamp

### Pillar 2 — Analytics Engine (`rayr-engine/`)

| Module | File | What it computes |
|---|---|---|
| Portfolio Analyzer | `portfolio_analyzer.py` | Returns, sector weights, diversification score (HHI) |
| Risk Engine | `risk_engine.py` | Volatility, Sharpe ratio, max drawdown, stress test |
| Overlap Detector | `overlap_detector.py` | Fund overlap via Jaccard similarity on AMFI holdings |
| Optimizer | `optimizer.py` | Ideal weights by risk profile, gap analysis |
| Simulation Engine | `rayr-api/main.py` | Market scenario impact calculation |

### Pillar 3 — Insight Engine (`rayr-api/main.py`)

Converts analytics into human-readable intelligence.

Example outputs (from Master.md):
- "Your portfolio is highly concentrated in the banking sector."
- "You hold funds with 67% overlapping holdings."
- "Your drawdown risk exceeds typical diversified portfolios."

Endpoints:
- `GET /api/insights/{id}` — 6 AI-generated insights per portfolio
- `POST /api/insights/chat` — Dr. RAYR conversational advisor
- `GET /api/news/{id}` — filtered news relevant to your holdings

### Pillar 4 — Experience Layer (`rayr-ui/`)

12 screens, each answering one primary question:

| Screen | Primary Question |
|---|---|
| Overview | What is my portfolio worth and how is it doing? |
| Health Score | How healthy is my portfolio overall? |
| Exposure Map | Where exactly is my money? |
| Overlap Detector | Am I paying twice for the same stocks? |
| Risk Simulator | What happens if the market crashes? |
| SIP Tracker | Is my monthly investment growing as expected? |
| Goal Tracker | Am I on track for my life goals? |
| Tax Planner | How do I pay less tax this year? |
| News For You | What happened today that affects my money? |
| Optimizer | What specific changes should I make? |
| Dr. RAYR | Ask anything about my portfolio |
| Share | Share my health score |

---

## Core Principles (Master.md)

1. **Trust First** — every metric shows data source + calculation method + last update
2. **Insights over dashboards** — every screen answers one question
3. **Simplicity** — complex math hidden behind clean UI
4. **Visual Clarity** — heatmaps, allocation charts, scenario graphs
5. **Explainability** — every recommendation includes reasoning

---

## API Design

Base URL: `http://localhost:8000`

```
GET  /api/portfolio/demo                  → Demo portfolio
POST /api/portfolio/analyze               → Custom portfolio analysis

GET  /api/analytics/health/{id}          → Health score (0-100)
GET  /api/analytics/exposure/{id}        → Sector + asset map
GET  /api/analytics/overlap/{id}         → Fund overlap detection
POST /api/analytics/stress-test          → Scenario simulation
GET  /api/analytics/tax/{id}             → Tax optimization
GET  /api/analytics/optimize/{id}        → Action recommendations
GET  /api/analytics/sip/{id}             → SIP projection

GET  /api/insights/{id}                  → AI insights
POST /api/insights/chat                  → Dr. RAYR advisor
GET  /api/news/{id}                      → Portfolio news
```

Interactive docs: `http://localhost:8000/api/docs`

---

## Development Roadmap (Master.md)

| Phase | Status | Description |
|---|---|---|
| Phase 1 Foundation | ✅ Done | Portfolio ingestion, exposure analysis, basic analytics |
| Phase 2 Risk Intelligence | ✅ Done | Volatility, correlation, diversification score |
| Phase 3 Scenario Analysis | ✅ Done | Crash simulations, economic event modeling |
| Phase 4 Optimization | ✅ Done | Improvement suggestions, rebalancing logic |
| Phase 5 AI Insight Layer | 🔄 In Progress | Live Claude API with portfolio context |
| Phase 6 Live Data | 📋 Planned | Full mftool + yfinance replacing all mock data |
| Phase 7 Auth | 📋 Planned | User accounts, portfolio persistence |
| Phase 8 Mobile | 📋 Planned | React Native |
