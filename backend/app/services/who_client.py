from __future__ import annotations

from typing import Any

import httpx

WHO_GHO_BASE_URL = "https://ghoapi.azureedge.net/api"


class WhoGhoClient:
    def __init__(self, base_url: str = WHO_GHO_BASE_URL) -> None:
        self.base_url = base_url

    async def _get(self, path: str = "", params: dict[str, str] | None = None) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=30.0) as client:
            url = self.base_url if not path else f"{self.base_url}/{path.lstrip('/')}"
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()

    async def list_entities(self) -> dict[str, Any]:
        return await self._get()

    async def fetch_entity(self, entity: str, query: str = "") -> dict[str, Any]:
        params = {"$filter": query} if query else None
        return await self._get(entity, params=params)

    async def search_indicators(self, text: str) -> list[dict[str, Any]]:
        payload = await self._get("Indicator", params={"$filter": f"contains(IndicatorName,'{text}')"})
        return self._extract_value(payload)

    async def fetch_indicator(self, indicator_code: str, filter_query: str | None = None) -> list[dict[str, Any]]:
        params = {"$filter": filter_query} if filter_query else None
        payload = await self._get(indicator_code, params=params)
        return self._extract_value(payload)

    @staticmethod
    def _extract_value(payload: dict[str, Any]) -> list[dict[str, Any]]:
        value = payload.get("value")
        if isinstance(value, list):
            return [item for item in value if isinstance(item, dict)]
        return []
