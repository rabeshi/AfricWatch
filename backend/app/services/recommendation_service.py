from __future__ import annotations

from app.data.seed_data import get_dataset
from app.services.risk_engine import score_country


def recommendations_for_country(disease: str, iso3: str) -> list[str]:
    country = next(item for item in get_dataset(disease)["countries"] if item["iso3"] == iso3)
    risk = score_country(disease, iso3)
    recommendations = []
    if risk["risk_band"] == "high":
        recommendations.append("Prioritize surveillance and intervention planning in the next quarter.")
    if country["trend"] == "rising":
        recommendations.append("Investigate recent upward trend acceleration and localized hotspot drivers.")
    if country["mortalityRate"] >= 30:
        recommendations.append("Pair case surveillance with mortality-focused response monitoring.")
    recommendations.append("Communicate uncertainty where recent historical series are incomplete or volatile.")
    return recommendations
