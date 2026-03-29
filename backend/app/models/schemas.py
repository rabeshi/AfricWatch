from __future__ import annotations

from typing import Literal, Union

from pydantic import BaseModel


class DiseaseInfo(BaseModel):
    slug: str
    name: str
    enabled: bool
    phase: int
    source: str


class KpiItem(BaseModel):
    label: str
    value: str
    change: str


class CountryMetric(BaseModel):
    country: str
    iso3: str
    region: str
    disease: str
    cases: int
    incidenceRate: float
    mortalityRate: float
    forecastRisk: int
    hotspotIntensity: int
    trend: Literal["rising", "stable", "improving"]


class MapResponse(BaseModel):
    disease: str
    year: int
    layer: str
    countries: list[CountryMetric]
    kpis: list[KpiItem]


class TrendPoint(BaseModel):
    year: Union[int, str]
    value: float


class ForecastPoint(TrendPoint):
    lower: float
    upper: float


class CountryProfile(BaseModel):
    country: str
    iso3: str
    disease: str
    summary: str
    metrics: CountryMetric
    history: list[TrendPoint]
    forecast: list[ForecastPoint]
    recommendations: list[str]


class InsightsResponse(BaseModel):
    narrative: str
    elevatedRisk: list[str]
    improving: list[str]
    recommendations: list[str]


class ForecastResponse(BaseModel):
    disease: str
    country: str
    indicator: str
    horizon: str
    model: str
    points: list[ForecastPoint]


class MethodologyResponse(BaseModel):
    source: str
    notes: list[str]
    forecast_model: str
    risk_formula: str
