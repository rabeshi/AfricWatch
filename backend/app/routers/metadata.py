from fastapi import APIRouter

from app.models.schemas import DiseaseInfo, MethodologyResponse
from app.services.disease_registry import get_diseases

router = APIRouter()


@router.get("/diseases", response_model=list[DiseaseInfo])
def diseases() -> list[DiseaseInfo]:
    return get_diseases()


@router.get("/methodology", response_model=MethodologyResponse)
def methodology() -> MethodologyResponse:
    return MethodologyResponse(
        source="WHO Global Health Observatory OData API",
        notes=[
            "Africa-only analytical filtering",
            "Malaria-first disease registry",
            "Forecast uncertainty should be communicated in every predictive view",
        ],
        forecast_model="Baseline trend-aware extrapolation; designed to upgrade to Prophet or ARIMA",
        risk_formula="0.30*trend + 0.20*mortality + 0.20*growth + 0.15*volatility + 0.10*neighborhood + 0.05*uncertainty",
    )
