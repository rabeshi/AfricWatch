from fastapi import APIRouter, Query

from app.models.schemas import MapResponse
from app.services.map_service import get_map_layer

router = APIRouter()


@router.get("/map-data", response_model=MapResponse)
def map_data(
    disease: str = Query(default="malaria"),
    year: int = Query(default=2024),
    layer: str = Query(default="incidence"),
) -> MapResponse:
    return get_map_layer(disease=disease, layer=layer, year=year)
