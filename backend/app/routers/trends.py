from fastapi import APIRouter, Query

from app.data.seed_data import get_dataset
from app.models.schemas import TrendPoint

router = APIRouter()


@router.get("/trends", response_model=list[TrendPoint])
def trends(
    disease: str = Query(default="malaria"),
    country: str = Query(default="UGA"),
    indicator: str = Query(default="cases"),
) -> list[TrendPoint]:
    history = get_dataset(disease)["history"].get(country.upper(), [2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0])
    return [TrendPoint(year=2018 + idx, value=value) for idx, value in enumerate(history)]
