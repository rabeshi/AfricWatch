from fastapi import APIRouter, Query

from app.models.schemas import ForecastResponse
from app.services.forecast_service import generate_short_term_forecast

router = APIRouter()


@router.get("/forecast", response_model=ForecastResponse)
def forecast(
    disease: str = Query(default="malaria"),
    country: str = Query(default="UGA"),
    indicator: str = Query(default="cases"),
    horizon: str = Query(default="90d"),
    model: str = Query(default="damped_trend"),
) -> ForecastResponse:
    return ForecastResponse(
        disease=disease,
        country=country,
        indicator=indicator,
        horizon=horizon,
        model=model,
        points=generate_short_term_forecast(disease, country, horizon, model),
    )
