from __future__ import annotations

def score_country(country: dict[str, float | int | str]) -> dict[str, float | int | str]:
    recent_trend = 90 if country["trend"] == "rising" else 55 if country["trend"] == "stable" else 35
    mortality = min(country["mortalityRate"] * 2, 100)
    growth = min(country["incidenceRate"] / 4, 100)
    volatility = 50 if country["trend"] == "rising" else 30
    neighborhood = min(country["hotspotIntensity"], 100)
    uncertainty_penalty = 12
    score = int(
        0.30 * recent_trend
        + 0.20 * mortality
        + 0.20 * growth
        + 0.15 * volatility
        + 0.10 * neighborhood
        + 0.05 * uncertainty_penalty
    )
    band = "high" if score >= 75 else "moderate" if score >= 50 else "watch"
    return {"risk_score": score, "risk_band": band}
