from fastapi import APIRouter, Query

from app.models.schemas import InsightsResponse
from app.services.data_service import get_insights

router = APIRouter()


@router.get("/insights", response_model=InsightsResponse)
def insights(disease: str = Query(default="malaria")) -> InsightsResponse:
    return get_insights(disease)
