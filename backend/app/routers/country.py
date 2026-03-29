from fastapi import APIRouter, HTTPException, Query

from app.data.seed_data import get_dataset
from app.models.schemas import CountryMetric, CountryProfile, TrendPoint
from app.services.forecast_service import generate_forecast
from app.services.recommendation_service import recommendations_for_country

router = APIRouter()


@router.get("/countries/{country_code}", response_model=CountryProfile)
def country_profile(country_code: str, disease: str = Query(default="malaria")) -> CountryProfile:
    dataset = get_dataset(disease)
    country = next((item for item in dataset["countries"] if item["iso3"] == country_code.upper()), None)
    if country is None:
        raise HTTPException(status_code=404, detail="Country not found")

    history_values = dataset["history"].get(country["iso3"], [2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0])
    history = [TrendPoint(year=2018 + idx, value=value) for idx, value in enumerate(history_values)]

    return CountryProfile(
        country=country["country"],
        iso3=country["iso3"],
        disease=disease,
        summary=f"{country['country']} remains a priority {disease.upper()} surveillance context within {country['region']}.",
        metrics=CountryMetric(**country),
        history=history,
        forecast=generate_forecast(disease, country["iso3"]),
        recommendations=recommendations_for_country(disease, country["iso3"]),
    )
