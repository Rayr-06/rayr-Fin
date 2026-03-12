"""
RAYR Engine – Portfolio Analyzer
Master.md: Analytics Engine → Portfolio Analyzer module
Data: yfinance (stocks/ETFs) + mftool (mutual funds)
"""

try:
    import yfinance as yf
    YFINANCE_OK = True
except ImportError:
    YFINANCE_OK = False

try:
    from mftool import Mftool
    mf = Mftool()
    MFTOOL_OK = True
except ImportError:
    MFTOOL_OK = False


def get_live_stock_price(symbol: str) -> dict:
    """
    Fetch live stock/ETF price from NSE via yfinance.
    symbol: NSE ticker e.g. 'RELIANCE', 'HDFCBANK', 'SBIIETF'
    """
    if not YFINANCE_OK:
        return {"symbol": symbol, "price": None, "error": "yfinance not installed"}
    try:
        ticker = yf.Ticker(f"{symbol}.NS")
        hist = ticker.history(period="2d")
        if hist.empty:
            return {"symbol": symbol, "price": None, "error": "No data"}
        price = float(hist["Close"].iloc[-1])
        prev  = float(hist["Close"].iloc[-2]) if len(hist) > 1 else price
        return {
            "symbol": symbol,
            "price": round(price, 2),
            "prev_close": round(prev, 2),
            "change_pct": round(((price - prev) / prev) * 100, 2),
            "source": "NSE via yfinance",
        }
    except Exception as e:
        return {"symbol": symbol, "price": None, "error": str(e)}


def get_mf_nav(scheme_code: str) -> dict:
    """
    Fetch current NAV of a mutual fund via mftool (AMFI data, free).
    scheme_code: AMFI scheme code e.g. '119598' for HDFC Flexi Cap
    """
    if not MFTOOL_OK:
        return {"scheme_code": scheme_code, "nav": None, "error": "mftool not installed"}
    try:
        data = mf.get_scheme_quote(scheme_code)
        return {
            "scheme_code": scheme_code,
            "fund_name": data.get("schemeName", ""),
            "nav": float(data.get("nav", 0)),
            "date": data.get("date", ""),
            "source": "AMFI via mftool",
        }
    except Exception as e:
        return {"scheme_code": scheme_code, "nav": None, "error": str(e)}


def compute_portfolio_returns(holdings: list) -> dict:
    """Compute weighted portfolio returns."""
    total = sum(h.get("value", 0) for h in holdings)
    if total == 0:
        return {"weighted_return_1y": 0, "total_value": 0}
    w_return = sum((h.get("value", 0) / total) * h.get("returns_1y", 0) for h in holdings)
    return {
        "total_value": total,
        "weighted_return_1y": round(w_return, 2),
        "source": "Weighted NAV appreciation from AMFI + NSE",
    }


def compute_sector_weights(holdings: list) -> dict:
    """Sector-wise portfolio weight from holdings."""
    total = sum(h.get("value", 0) for h in holdings)
    sectors = {}
    for h in holdings:
        s = h.get("sector", "Unknown")
        sectors[s] = sectors.get(s, 0) + h.get("value", 0)
    return {k: round((v / total) * 100, 2) for k, v in sectors.items()}


def compute_diversification_score(holdings: list) -> float:
    """
    Herfindahl-Hirschman Index (HHI) based diversification.
    Score 0-100: 100 = perfectly diversified.
    """
    total = sum(h.get("value", 0) for h in holdings)
    if total == 0:
        return 0.0
    weights = [(h.get("value", 0) / total) ** 2 for h in holdings]
    hhi = sum(weights)
    n = len(holdings)
    min_hhi = 1 / n if n > 0 else 1
    score = max(0, 1 - (hhi - min_hhi) / (1 - min_hhi)) * 100
    return round(score, 1)
