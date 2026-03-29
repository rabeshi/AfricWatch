# AfricWatch Technical Specification

## Product Architecture

AfricWatch is designed as a modular African disease intelligence platform with a malaria-first MVP and a disease registry that allows later expansion to HPV, cholera, TB, hepatitis B, Ebola, and HIV.

### Core Layers

1. Presentation layer with a Next.js map-first experience
2. FastAPI application layer for normalized disease endpoints
3. WHO GHO OData integration and transformation pipeline
4. Forecasting, hotspot, risk, and recommendation services
5. PostgreSQL, PostGIS, and Redis as persistence and cache targets

## API Endpoint Design

- `GET /health`
- `GET /api/v1/diseases`
- `GET /api/v1/map-data?disease=malaria&year=2024&layer=incidence`
- `GET /api/v1/trends?disease=malaria&country=UGA&indicator=incidence_rate`
- `GET /api/v1/countries/{country_code}`
- `GET /api/v1/forecast?disease=malaria&country=UGA&indicator=cases&horizon=12m`
- `GET /api/v1/insights?disease=malaria`
- `GET /api/v1/methodology`

## WHO GHO Query Strategy

The WHO GHO API supports OData-style access. The backend is structured to support:

1. indicator discovery from `/api`
2. filtered dataset pulls using `$filter`, `$select`, `$top`, and pagination
3. country and year normalization into an observation fact table
4. caching of transformed payloads for fast frontend delivery

### Example Queries

```text
https://ghoapi.azureedge.net/api/Indicator
https://ghoapi.azureedge.net/api/<ENTITY>?$filter=SpatialDim eq 'UGA'
https://ghoapi.azureedge.net/api/<ENTITY>?$select=SpatialDim,TimeDim,NumericValue&$top=500
```

## ML Design

- Baseline forecast: rolling trend extrapolation with upgrade path to Prophet or ARIMA
- Risk score inputs: recent trend, mortality, growth, volatility, neighborhood burden, uncertainty
- Recommendation engine: rule-based in MVP, ML-assisted later

## Database Schema

Core tables:

- `disease_registry`
- `indicator_registry`
- `country_dim`
- `observation_fact`
- `forecast_fact`
- `risk_snapshot`

## Homepage Wireframe

1. Institutional hero
2. Full-width Africa choropleth map
3. KPI strip
4. Trend and forecast section
5. Insights and recommendations
6. Methodology credibility footer
