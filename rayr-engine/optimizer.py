"""
RAYR Engine – Portfolio Optimizer
Master.md: Optimization Engine – suggestions to improve diversification and risk balance
"""


def compute_ideal_weights(risk_profile: str) -> dict:
    """
    Ideal sector weights by risk profile.
    Based on SEBI risk categorization guidelines.
    """
    profiles = {
        "Conservative": {
            "Debt": 40, "Large Cap": 25, "Gold": 10, "Mid Cap": 10,
            "International": 8, "Small Cap": 4, "Banking": 3,
        },
        "Moderate": {
            "Large Cap": 30, "Mid Cap": 15, "Debt": 15, "Banking": 12,
            "Technology": 10, "International": 8, "Gold": 5, "Small Cap": 5,
        },
        "Aggressive": {
            "Large Cap": 25, "Mid Cap": 20, "Small Cap": 15, "Technology": 15,
            "Banking": 10, "International": 10, "Debt": 5,
        },
    }
    return profiles.get(risk_profile, profiles["Moderate"])


def generate_recommendations(current_weights: dict, risk_profile: str) -> list:
    """
    Compare current vs ideal weights. Generate actionable recommendations.
    Each recommendation includes the reason — Master.md: Explainability.
    """
    ideal = compute_ideal_weights(risk_profile)
    recs = []
    for sector, ideal_w in ideal.items():
        current_w = current_weights.get(sector, 0)
        diff = current_w - ideal_w
        if diff > 5:
            recs.append({
                "sector": sector,
                "type": "REDUCE",
                "current": current_w,
                "target": ideal_w,
                "delta": round(-diff, 1),
                "reason": f"{sector} at {current_w}% exceeds ideal {ideal_w}% for {risk_profile} profile",
                "priority": "High" if abs(diff) > 10 else "Medium",
            })
        elif diff < -5:
            recs.append({
                "sector": sector,
                "type": "INCREASE",
                "current": current_w,
                "target": ideal_w,
                "delta": round(-diff, 1),
                "reason": f"{sector} at {current_w}% is below ideal {ideal_w}% for {risk_profile} profile",
                "priority": "High" if abs(diff) > 10 else "Medium",
            })
    return sorted(recs, key=lambda x: abs(x["delta"]), reverse=True)
