from __future__ import annotations

from app.data.seed_data import get_dataset
from app.models.schemas import CountryMetric, InsightsResponse, KpiItem, MapResponse


def get_map_data(disease: str, layer: str, year: int) -> MapResponse:
    dataset = get_dataset(disease)
    countries = [CountryMetric(**item) for item in dataset["countries"]]
    return MapResponse(
        disease=disease,
        year=year,
        layer=layer,
        countries=countries,
        kpis=[KpiItem(**item) for item in dataset["kpis"]],
    )


def get_insights(disease: str) -> InsightsResponse:
    return InsightsResponse(**get_dataset(disease)["insights"])
