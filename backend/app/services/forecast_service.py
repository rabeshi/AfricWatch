from __future__ import annotations

from app.data.seed_data import get_dataset
from app.models.schemas import ForecastPoint
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.holtwinters import ExponentialSmoothing


def generate_forecast(disease: str, iso3: str) -> list[ForecastPoint]:
    history = get_dataset(disease)["history"].get(iso3)
    if not history:
        history = [3.0, 3.2, 3.1, 3.4, 3.6, 3.8, 3.9]

    slope = (history[-1] - history[0]) / max(len(history) - 1, 1)
    latest_year = 2024
    base = history[-1]
    forecast = []
    for offset in range(1, 3):
        prediction = round(base + slope * offset, 1)
        forecast.append(
            ForecastPoint(
                year=latest_year + offset,
                value=prediction,
                lower=round(prediction * 0.95, 1),
                upper=round(prediction * 1.05, 1),
            )
        )
    return forecast


def _baseline_forecast(history: list[float], step_count: int) -> list[float]:
    recent_window = history[-3:] if len(history) >= 3 else history
    recent_slope = (recent_window[-1] - recent_window[0]) / max(len(recent_window) - 1, 1)
    baseline = history[-1]
    dampened_slope = recent_slope * 0.35
    return [round(baseline + dampened_slope * step, 2) for step in range(1, step_count + 1)]


def _arima_forecast(history: list[float], step_count: int) -> list[float]:
    model = ARIMA(history, order=(1, 1, 0))
    fitted = model.fit()
    return [round(float(value), 2) for value in fitted.forecast(steps=step_count)]


def _ets_forecast(history: list[float], step_count: int) -> list[float]:
    model = ExponentialSmoothing(history, trend="add", damped_trend=True, seasonal=None)
    fitted = model.fit(optimized=True)
    return [round(float(value), 2) for value in fitted.forecast(step_count)]


def generate_short_term_forecast(disease: str, iso3: str, horizon: str, model_name: str) -> list[ForecastPoint]:
    history = get_dataset(disease)["history"].get(iso3)
    if not history:
        history = [3.0, 3.2, 3.1, 3.4, 3.6, 3.8, 3.9]

    step_count = {"30d": 1, "60d": 2, "90d": 3}.get(horizon, 3)
    normalized_model = (model_name or "damped_trend").lower()

    try:
        if normalized_model == "arima":
            predictions = _arima_forecast(history, step_count)
        elif normalized_model in {"ets", "holt_winters", "exponential_smoothing"}:
            predictions = _ets_forecast(history, step_count)
        else:
            predictions = _baseline_forecast(history, step_count)
    except Exception:
        predictions = _baseline_forecast(history, step_count)

    forecast: list[ForecastPoint] = []
    for step, prediction in enumerate(predictions, start=1):
        day_horizon = step * 30
        forecast.append(
            ForecastPoint(
                year=f"Day {day_horizon}",
                value=prediction,
                lower=round(prediction * 0.96, 2),
                upper=round(prediction * 1.04, 2),
            )
        )
    return forecast
