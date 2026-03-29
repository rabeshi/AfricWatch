# AfricWatch

AfricWatch is a malaria-first African disease intelligence platform designed for ministries, researchers, NGOs, and health planners. It combines WHO Global Health Observatory (GHO) disease data, continent-scale geospatial visualization, baseline forecasting, risk scoring, and policy-facing insights in a public, authentication-free platform.

## Product Positioning

- Product name: `AfricWatch`
- Phase 1 disease: `Malaria`
- Region scope: `Africa only`
- Primary source: `WHO GHO OData API` at `https://ghoapi.azureedge.net/api/`
- Delivery model: `platform experience`, not a single dashboard

## Monorepo Structure

```text
AfricWatch/
  frontend/                Next.js + TypeScript + Tailwind + Plotly
  backend/                 FastAPI + forecasting/risk services
  docs/                    Architecture, methodology, roadmap
  docker-compose.yml       Local orchestration blueprint
```

## MVP Capabilities

- Large interactive Africa choropleth map on the homepage
- Headline KPIs for burden, mortality, risk, and rising trends
- Country explorer with historical and forecast analytics
- Forecast center with confidence bands and anomaly alerts
- Backend WHO GHO ingestion scaffold and analytics-ready schema
- Baseline risk scoring and recommendation engine
- Methodology and public API documentation

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
