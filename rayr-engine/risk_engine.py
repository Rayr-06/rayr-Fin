"""
RAYR Engine – Risk Engine
Master.md: Volatility calculation, correlation matrix, drawdown, stress test
"""
import math


def compute_volatility(daily_returns: list) -> float:
    """Annualized volatility from list of daily returns (as decimals)."""
    if len(daily_returns) < 2:
        return 0.0
    n = len(daily_returns)
    mean = sum(daily_returns) / n
    variance = sum((r - mean) ** 2 for r in daily_returns) / (n - 1)
    return round(math.sqrt(variance) * math.sqrt(252) * 100, 2)


def compute_max_drawdown(portfolio_values: list) -> float:
    """Maximum peak-to-trough drawdown as a percentage."""
    if not portfolio_values:
        return 0.0
    peak = portfolio_values[0]
    max_dd = 0.0
    for v in portfolio_values:
        if v > peak:
            peak = v
        dd = (peak - v) / peak if peak > 0 else 0
        if dd > max_dd:
            max_dd = dd
    return round(-max_dd * 100, 2)


def compute_sharpe_ratio(daily_returns: list, risk_free_annual: float = 0.065) -> float:
    """Sharpe Ratio: (Portfolio Return - Risk Free Rate) / Volatility."""
    if len(daily_returns) < 2:
        return 0.0
    n = len(daily_returns)
    mean = sum(daily_returns) / n
    avg_return = mean * 252
    variance = sum((r - mean) ** 2 for r in daily_returns) / (n - 1)
    volatility = math.sqrt(variance) * math.sqrt(252)
    return round((avg_return - risk_free_annual) / volatility, 2) if volatility > 0 else 0.0


def stress_test_portfolio(portfolio_value: float, holdings: list, scenario: dict) -> dict:
    """
    Apply sector-level drops to the portfolio.
    scenario: {"banking": -0.25, "technology": -0.10, "default": -0.12}
    """
    total_impact = 0.0
    breakdown = []
    for h in holdings:
        sector_key = h.get("sector", "").lower().replace(" ", "_")
        weight = h.get("weight", 0) / 100
        drop = scenario.get(sector_key, scenario.get("default", -0.10))
        impact = portfolio_value * weight * drop
        total_impact += impact
        breakdown.append({
            "holding": h.get("name"),
            "sector": h.get("sector"),
            "weight_pct": h.get("weight"),
            "scenario_drop_pct": round(drop * 100, 1),
            "impact_inr": round(impact),
        })
    return {
        "original_value": portfolio_value,
        "total_impact_inr": round(total_impact),
        "new_value": round(portfolio_value + total_impact),
        "impact_pct": round((total_impact / portfolio_value) * 100, 2) if portfolio_value else 0,
        "breakdown": breakdown,
    }
