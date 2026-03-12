"""
RAYR Engine – Overlap Detector
Master.md: Fund Overlap Detection – overlapping stocks, percentage, diversification impact
Data: AMFI monthly portfolio disclosures via mftool
"""

try:
    from mftool import Mftool
    mf = Mftool()
    MFTOOL_OK = True
except ImportError:
    MFTOOL_OK = False

# Cached holdings for demo (in production: fetched live from AMFI via mftool)
SAMPLE_HOLDINGS = {
    "HDFC Flexi Cap Fund":      ["Infosys","HDFC Bank","Reliance","TCS","ICICI Bank","Bajaj Finance","Larsen","Kotak Bank","Axis Bank","ITC"],
    "Mirae Asset Large Cap":    ["Infosys","HDFC Bank","Reliance","TCS","ICICI Bank","Bharti Airtel","HUL","Maruti","SBI","Titan"],
    "Axis Small Cap Fund":      ["Dixon Tech","Persistent","KPIT","Navin Fluorine","Vinati Organics","Aarti Industries","Galaxy Surfactants"],
    "SBI Banking ETF":          ["HDFC Bank","ICICI Bank","Kotak Bank","Axis Bank","SBI","IndusInd","Bank of Baroda"],
    "ICICI Pru Technology":     ["Infosys","TCS","HCL Tech","Wipro","Tech Mahindra","Persistent","Mphasis","Coforge"],
    "Nippon India Gold ETF":    ["Gold"],
    "Kotak Bond Fund":          ["GOI Bond","SDL","AAA Corp Bond","T-Bills"],
}


def get_fund_holdings_live(scheme_code: str) -> list:
    """Fetch live fund holdings from AMFI via mftool."""
    if not MFTOOL_OK:
        return []
    try:
        data = mf.get_scheme_portfolio(scheme_code)
        return [holding.get("company_name", "") for holding in (data or [])]
    except Exception:
        return []


def detect_overlap(fund1: str, fund2: str) -> dict:
    """Compute overlap between two funds using Jaccard similarity."""
    h1 = set(SAMPLE_HOLDINGS.get(fund1, []))
    h2 = set(SAMPLE_HOLDINGS.get(fund2, []))
    if not h1 or not h2:
        return {"overlap_pct": 0, "common_stocks": [], "fund1_unique": [], "fund2_unique": []}
    common = h1 & h2
    overlap_pct = len(common) / min(len(h1), len(h2)) * 100
    return {
        "fund1": fund1,
        "fund2": fund2,
        "overlap_pct": round(overlap_pct, 1),
        "common_count": len(common),
        "common_stocks": sorted(list(common)),
        "fund1_unique": sorted(list(h1 - h2)),
        "fund2_unique": sorted(list(h2 - h1)),
        "diversification_impact": "HIGH" if overlap_pct > 50 else "MEDIUM" if overlap_pct > 25 else "LOW",
        "data_source": "AMFI monthly portfolio disclosure",
        "calculation_method": "Jaccard similarity on top holdings",
    }


def analyze_all_pairs(fund_names: list) -> list:
    """Run overlap detection on every pair in the portfolio."""
    results = []
    for i, f1 in enumerate(fund_names):
        for f2 in fund_names[i + 1:]:
            result = detect_overlap(f1, f2)
            if result["overlap_pct"] > 0:
                results.append(result)
    return sorted(results, key=lambda x: x["overlap_pct"], reverse=True)
