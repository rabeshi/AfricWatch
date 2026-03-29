from __future__ import annotations

from app.services.data_service import get_map_data


async def get_map_layer(disease: str, layer: str, year: int):
    return await get_map_data(disease=disease, layer=layer, year=year)
