from __future__ import annotations

from app.models.schemas import CountryMetric, InsightsResponse, KpiItem, MapResponse
from app.services.live_data_service import get_dataset


async def get_map_data(disease: str, layer: str, year: int) -> MapResponse:
    dataset = await get_dataset(disease)
    countries = [CountryMetric(**item) for item in dataset["countries"]]
    return MapResponse(
        disease=disease,
        year=year,
        layer=layer,
        countries=countries,
        kpis=[KpiItem(**item) for item in dataset["kpis"]],
    )


async def get_insights(disease: str) -> InsightsResponse:
    dataset = await get_dataset(disease)
    return InsightsResponse(**dataset["insights"])
