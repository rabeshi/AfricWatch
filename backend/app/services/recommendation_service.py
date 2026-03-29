from __future__ import annotations

from app.services.risk_engine import score_country


def recommendations_for_country(country: dict[str, float | int | str]) -> list[str]:
    risk = score_country(country)
    recommendations = []
    if risk["risk_band"] == "high":
        recommendations.append("Prioritize surveillance and intervention planning in the next quarter.")
    if country["trend"] == "rising":
        recommendations.append("Investigate recent upward trend acceleration and localized hotspot drivers.")
    if country["mortalityRate"] >= 30:
        recommendations.append("Pair case surveillance with mortality-focused response monitoring.")
    recommendations.append("Communicate uncertainty where recent historical series are incomplete or volatile.")
    return recommendations
