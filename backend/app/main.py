from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.country import router as country_router
from app.routers.forecast import router as forecast_router
from app.routers.insights import router as insights_router
from app.routers.map_data import router as map_router
from app.routers.metadata import router as metadata_router
from app.routers.trends import router as trends_router

app = FastAPI(title="AfricWatch API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(metadata_router, prefix="/api/v1", tags=["metadata"])
app.include_router(map_router, prefix="/api/v1", tags=["map"])
app.include_router(trends_router, prefix="/api/v1", tags=["trends"])
app.include_router(country_router, prefix="/api/v1", tags=["country"])
app.include_router(forecast_router, prefix="/api/v1", tags=["forecast"])
app.include_router(insights_router, prefix="/api/v1", tags=["insights"])
