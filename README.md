# AfricWatch

AfricWatch is a Pan-African disease intelligence platform designed for ministries, researchers, NGOs, and health planners. It combines WHO Global Health Observatory (GHO) disease data, continent-scale geospatial visualization, forecast analytics, risk scoring, and policy-facing insights in a public, authentication-free platform.

## Live Deployment

- Frontend: `https://africwatch.vercel.app/`
- Backend: `https://africwatch-api.onrender.com/`
- Backend health check: `https://africwatch-api.onrender.com/health`

## Product Positioning

- Product name: `AfricWatch`
- Phase 1 diseases: `Malaria` and `HPV`
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
- Disease switching between malaria and HPV
- Headline KPIs for burden, mortality, risk, and rising trends
- Country explorer with historical and forecast analytics
- Forecast center with 30/60/90-day horizon selection
- Selectable forecast models: `Damped Trend`, `ARIMA`, and `ETS`
- Backend WHO GHO ingestion scaffold and analytics-ready schema
- Risk scoring and recommendation engine
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

## Deploy To Vercel + Render

### Frontend on Vercel

The frontend is ready for Vercel deployment from the `frontend/` directory.

1. Import the GitHub repo into Vercel.
2. Set the project root directory to `frontend`.
3. Vercel should detect `Next.js` automatically.
4. Add this environment variable in Vercel:

```text
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.onrender.com
```

5. Deploy.

Optional config is included in [frontend/vercel.json](/c:/Users/georg/OneDrive/Documents/Codex%20Projects/AfricWatch/frontend/vercel.json).

### Backend on Render

The backend is ready for Render deployment from the `backend/` directory.

1. Create a new `Web Service` in Render from the same GitHub repo.
2. Set the root directory to `backend`.
3. Use:
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Deploy.

Optional config is included in [render.yaml](/c:/Users/georg/OneDrive/Documents/Codex%20Projects/AfricWatch/render.yaml).

### Deployment Order

1. Deploy the backend first and copy its public URL.
2. Add that URL to Vercel as `NEXT_PUBLIC_API_BASE_URL`.
3. Deploy the frontend.

### Production URLs

```text
Frontend: https://africwatch.vercel.app/
Backend:  https://africwatch-api.onrender.com/
```

### Production Notes

- The frontend can still render with fallback seeded data if the backend is unavailable.
- Live API-driven disease and forecast responses depend on the backend being reachable.
- ARIMA and ETS forecasting require the scientific Python stack in `backend/requirements.txt`, which is already included for deployment.
