from __future__ import annotations

from typing import Any

import httpx

WHO_GHO_BASE_URL = "https://ghoapi.azureedge.net/api"


class WhoGhoClient:
    def __init__(self, base_url: str = WHO_GHO_BASE_URL) -> None:
        self.base_url = base_url

    async def list_entities(self) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(self.base_url)
            response.raise_for_status()
            return response.json()

    async def fetch_entity(self, entity: str, query: str = "") -> dict[str, Any]:
        url = f"{self.base_url}/{entity}"
        if query:
            url = f"{url}?{query}"
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            return response.json()
