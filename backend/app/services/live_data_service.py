from __future__ import annotations

from dataclasses import dataclass
from statistics import median
import math
import time
from typing import Any

from app.data.seed_data import get_dataset as get_seed_dataset
from app.services.who_client import WhoGhoClient

CACHE_TTL_SECONDS = 60 * 60 * 6


@dataclass(frozen=True)
class CountryInfo:
    name: str
    region: str


AFRICAN_COUNTRIES: dict[str, CountryInfo] = {
    "DZA": CountryInfo("Algeria", "North Africa"),
    "AGO": CountryInfo("Angola", "Central Africa"),
    "BEN": CountryInfo("Benin", "West Africa"),
    "BWA": CountryInfo("Botswana", "Southern Africa"),
    "BFA": CountryInfo("Burkina Faso", "West Africa"),
    "BDI": CountryInfo("Burundi", "East Africa"),
    "CPV": CountryInfo("Cabo Verde", "West Africa"),
    "CMR": CountryInfo("Cameroon", "Central Africa"),
    "CAF": CountryInfo("Central African Republic", "Central Africa"),
    "TCD": CountryInfo("Chad", "Central Africa"),
    "COM": CountryInfo("Comoros", "East Africa"),
    "COD": CountryInfo("Democratic Republic of the Congo", "Central Africa"),
    "COG": CountryInfo("Republic of the Congo", "Central Africa"),
    "CIV": CountryInfo("Cote d'Ivoire", "West Africa"),
    "DJI": CountryInfo("Djibouti", "East Africa"),
    "EGY": CountryInfo("Egypt", "North Africa"),
    "GNQ": CountryInfo("Equatorial Guinea", "Central Africa"),
    "ERI": CountryInfo("Eritrea", "East Africa"),
    "SWZ": CountryInfo("Eswatini", "Southern Africa"),
    "ETH": CountryInfo("Ethiopia", "East Africa"),
    "GAB": CountryInfo("Gabon", "Central Africa"),
    "GMB": CountryInfo("Gambia", "West Africa"),
    "GHA": CountryInfo("Ghana", "West Africa"),
    "GIN": CountryInfo("Guinea", "West Africa"),
    "GNB": CountryInfo("Guinea-Bissau", "West Africa"),
    "KEN": CountryInfo("Kenya", "East Africa"),
    "LSO": CountryInfo("Lesotho", "Southern Africa"),
    "LBR": CountryInfo("Liberia", "West Africa"),
    "LBY": CountryInfo("Libya", "North Africa"),
    "MDG": CountryInfo("Madagascar", "East Africa"),
    "MWI": CountryInfo("Malawi", "East Africa"),
    "MLI": CountryInfo("Mali", "West Africa"),
    "MRT": CountryInfo("Mauritania", "West Africa"),
    "MUS": CountryInfo("Mauritius", "East Africa"),
    "MAR": CountryInfo("Morocco", "North Africa"),
    "MOZ": CountryInfo("Mozambique", "Southern Africa"),
    "NAM": CountryInfo("Namibia", "Southern Africa"),
    "NER": CountryInfo("Niger", "West Africa"),
    "NGA": CountryInfo("Nigeria", "West Africa"),
    "RWA": CountryInfo("Rwanda", "East Africa"),
    "STP": CountryInfo("Sao Tome and Principe", "Central Africa"),
    "SEN": CountryInfo("Senegal", "West Africa"),
    "SYC": CountryInfo("Seychelles", "East Africa"),
    "SLE": CountryInfo("Sierra Leone", "West Africa"),
    "SOM": CountryInfo("Somalia", "East Africa"),
    "ZAF": CountryInfo("South Africa", "Southern Africa"),
    "SSD": CountryInfo("South Sudan", "East Africa"),
    "SDN": CountryInfo("Sudan", "North Africa"),
    "TZA": CountryInfo("Tanzania", "East Africa"),
    "TGO": CountryInfo("Togo", "West Africa"),
    "TUN": CountryInfo("Tunisia", "North Africa"),
    "UGA": CountryInfo("Uganda", "East Africa"),
    "ZMB": CountryInfo("Zambia", "Southern Africa"),
    "ZWE": CountryInfo("Zimbabwe", "Southern Africa"),
}

DISEASE_SEARCH_TERMS = {
    "malaria": "malaria",
    "hpv": "cervical cancer",
}

INDICATOR_RULES = {
    "malaria": {
        "cases": {
            "include_all": ["malaria"],
            "prefer": ["case", "estimated"],
            "exclude": ["death", "mortality", "testing", "treatment", "coverage", "spraying", "net"],
        },
        "incidence": {
            "include_all": ["malaria", "incidence"],
            "prefer": ["incidence"],
            "exclude": ["death", "mortality", "testing", "coverage"],
        },
        "mortality": {
            "include_all": ["malaria"],
            "prefer": ["death"],
            "exclude": ["case", "incidence", "testing", "coverage"],
        },
    },
    "hpv": {
        "cases": {
            "include_all": ["cervical", "cancer"],
            "prefer": ["case"],
            "exclude": ["screening", "coverage", "vaccination", "prevalence"],
        },
        "incidence": {
            "include_all": ["cervical", "cancer"],
            "prefer": ["incidence"],
            "exclude": ["screening", "coverage", "vaccination", "prevalence"],
        },
        "mortality": {
            "include_all": ["cervical", "cancer"],
            "prefer": ["mortality", "death"],
            "exclude": ["screening", "coverage", "vaccination", "prevalence"],
        },
    },
}

_CACHE: dict[str, tuple[float, dict[str, Any]]] = {}


def _extract_numeric_value(row: dict[str, Any]) -> float | None:
    for key in ("NumericValue", "Value"):
        value = row.get(key)
        if value in (None, ""):
            continue
        try:
            return float(value)
        except (TypeError, ValueError):
            continue
    return None


def _extract_year(row: dict[str, Any]) -> int | None:
    time_value = row.get("TimeDimensionValue") or row.get("TimeDimensionBegin")
    if time_value is None:
        return None
    text = str(time_value)
    digits = "".join(char for char in text[:4] if char.isdigit())
    if len(digits) == 4:
        return int(digits)
    return None


def _extract_iso3(row: dict[str, Any]) -> str | None:
    for key in ("SpatialDim", "Country", "Location"):
        value = row.get(key)
        if isinstance(value, str):
            iso3 = value.upper()
            if iso3 in AFRICAN_COUNTRIES:
                return iso3
    return None


def _compact_number(value: float) -> str:
    absolute = abs(value)
    if absolute >= 1_000_000_000:
        return f"{value / 1_000_000_000:.1f}B"
    if absolute >= 1_000_000:
        return f"{value / 1_000_000:.1f}M"
    if absolute >= 1_000:
        return f"{value / 1_000:.1f}K"
    return f"{value:.0f}"


def _pick_indicator(indicators: list[dict[str, Any]], rule: dict[str, list[str]]) -> dict[str, Any] | None:
    best: tuple[int, dict[str, Any] | None] = (-10_000, None)
    for indicator in indicators:
        name = str(indicator.get("IndicatorName", "")).lower()
        if not name:
            continue
        if any(token not in name for token in rule["include_all"]):
            continue
        score = 0
        score += sum(25 for token in rule["prefer"] if token in name)
        score -= sum(40 for token in rule["exclude"] if token in name)
        score -= len(name)
        if score > best[0]:
            best = (score, indicator)
    return best[1]


def _normalize(value: float, minimum: float, maximum: float) -> int:
    if math.isclose(maximum, minimum):
        return 50
    return int(round(((value - minimum) / (maximum - minimum)) * 100))


def _build_trend(history_values: list[float]) -> str:
    if len(history_values) < 2:
        return "stable"
    start = history_values[0]
    end = history_values[-1]
    if math.isclose(start, 0.0):
        delta = end - start
        if delta > 0.25:
            return "rising"
        if delta < -0.25:
            return "improving"
        return "stable"

    pct_change = ((end - start) / abs(start)) * 100
    if pct_change >= 3:
        return "rising"
    if pct_change <= -3:
        return "improving"
    return "stable"


def _recommendations(disease: str, rising_count: int, top_country: str | None) -> list[str]:
    if disease == "malaria":
        return [
            f"Prioritize surveillance and commodity planning in {top_country or 'the highest-risk countries'}.",
            "Use WHO trend changes to focus cross-border monitoring where burden remains elevated.",
            "Review mortality alongside incidence to separate high transmission from high-severity settings.",
        ]
    return [
        f"Focus screening and referral planning in {top_country or 'the highest-risk countries'}.",
        "Use the WHO cervical cancer burden trend to target prevention and treatment capacity planning.",
        f"Monitor countries with worsening burden signals; currently {rising_count} countries show rising trends in the live feed.",
    ]


def _narrative(disease: str, top_country: str | None, rising_count: int) -> str:
    if disease == "malaria":
        return (
            f"Live WHO malaria data show the strongest current burden signal in {top_country or 'the highest-burden settings'}, "
            f"with {rising_count} African countries currently classified as rising in the latest observed series."
        )
    return (
        f"Live WHO cervical cancer indicators are being used as the HPV burden proxy, with {top_country or 'the highest-burden settings'} "
        f"showing the strongest current risk signal and {rising_count} countries trending upward in the latest observed series."
    )


def _build_kpis(countries: list[dict[str, Any]], latest_year: int, disease: str) -> list[dict[str, str]]:
    total_cases = sum(country["cases"] for country in countries)
    incidence_median = median(country["incidenceRate"] for country in countries) if countries else 0
    top_risk = max(countries, key=lambda item: item["forecastRisk"]) if countries else None
    rising_count = sum(1 for country in countries if country["trend"] == "rising")
    incidence_unit = "/ 1,000" if disease == "malaria" else "/ 100,000"
    return [
        {"label": "Total estimated cases", "value": _compact_number(total_cases), "change": f"WHO latest year {latest_year}"},
        {
            "label": "Median incidence rate",
            "value": f"{int(round(incidence_median))} {incidence_unit}",
            "change": "Live WHO country data",
        },
        {
            "label": "Highest forecast risk",
            "value": top_risk["country"] if top_risk else "N/A",
            "change": f"Risk score {top_risk['forecastRisk']}/100" if top_risk else "Unavailable",
        },
        {
            "label": "Countries with rising trends",
            "value": str(rising_count),
            "change": "Based on latest WHO time series",
        },
    ]


async def _build_live_dataset(disease: str) -> dict[str, Any]:
    client = WhoGhoClient()
    search_term = DISEASE_SEARCH_TERMS.get(disease, "malaria")
    indicators = await client.search_indicators(search_term)
    rules = INDICATOR_RULES[disease]
    codes: dict[str, str] = {}
    for metric_name, rule in rules.items():
        indicator = _pick_indicator(indicators, rule)
        if indicator and indicator.get("IndicatorCode"):
            codes[metric_name] = str(indicator["IndicatorCode"])

    if not {"cases", "incidence", "mortality"}.issubset(codes):
        raise RuntimeError(f"Could not discover WHO indicators for {disease}")

    rows_by_metric: dict[str, list[dict[str, Any]]] = {}
    for metric_name, indicator_code in codes.items():
        rows_by_metric[metric_name] = await client.fetch_indicator(indicator_code)

    latest_by_metric: dict[str, dict[str, tuple[int, float]]] = {metric: {} for metric in rows_by_metric}
    history: dict[str, dict[int, float]] = {}
    latest_year = 0

    for metric_name, rows in rows_by_metric.items():
        for row in rows:
            iso3 = _extract_iso3(row)
            value = _extract_numeric_value(row)
            year = _extract_year(row)
            if iso3 is None or value is None or year is None:
                continue
            latest_year = max(latest_year, year)
            current = latest_by_metric[metric_name].get(iso3)
            if current is None or year >= current[0]:
                latest_by_metric[metric_name][iso3] = (year, value)
            if metric_name == ("incidence" if disease == "hpv" else "cases"):
                history.setdefault(iso3, {})[year] = value

    common_countries = set(latest_by_metric["cases"]) & set(latest_by_metric["incidence"]) & set(latest_by_metric["mortality"])
    if not common_countries:
        raise RuntimeError(f"No common WHO country data available for {disease}")

    raw_countries: list[dict[str, Any]] = []
    case_values = [latest_by_metric["cases"][iso3][1] for iso3 in common_countries]
    incidence_values = [latest_by_metric["incidence"][iso3][1] for iso3 in common_countries]
    mortality_values = [latest_by_metric["mortality"][iso3][1] for iso3 in common_countries]
    min_cases, max_cases = min(case_values), max(case_values)
    min_incidence, max_incidence = min(incidence_values), max(incidence_values)
    min_mortality, max_mortality = min(mortality_values), max(mortality_values)

    for iso3 in common_countries:
        country_info = AFRICAN_COUNTRIES[iso3]
        cases = int(round(latest_by_metric["cases"][iso3][1]))
        incidence = round(latest_by_metric["incidence"][iso3][1], 1)
        mortality = round(latest_by_metric["mortality"][iso3][1], 1)
        history_series = [value for _, value in sorted(history.get(iso3, {}).items())][-7:]
        trend = _build_trend(history_series if history_series else [incidence])
        case_score = _normalize(float(cases), min_cases, max_cases)
        incidence_score = _normalize(incidence, min_incidence, max_incidence)
        mortality_score = _normalize(mortality, min_mortality, max_mortality)
        forecast_risk = int(round(0.2 * case_score + 0.45 * incidence_score + 0.35 * mortality_score))
        hotspot_intensity = int(round(0.45 * case_score + 0.35 * incidence_score + 0.2 * mortality_score))
        raw_countries.append(
            {
                "country": country_info.name,
                "iso3": iso3,
                "region": country_info.region,
                "disease": disease,
                "cases": cases,
                "incidenceRate": incidence,
                "mortalityRate": mortality,
                "forecastRisk": forecast_risk,
                "hotspotIntensity": hotspot_intensity,
                "trend": trend,
            }
        )

    countries = sorted(raw_countries, key=lambda item: item["forecastRisk"], reverse=True)
    top_country = countries[0]["country"] if countries else None
    rising = [country["country"] for country in countries if country["trend"] == "rising"][:5]
    improving = [country["country"] for country in countries if country["trend"] == "improving"][:5]

    return {
        "countries": countries,
        "history": {
            iso3: [value for _, value in sorted(history_points.items())][-7:] for iso3, history_points in history.items()
        },
        "insights": {
            "narrative": _narrative(disease, top_country, len(rising)),
            "elevatedRisk": [country["country"] for country in countries[:5]],
            "improving": improving,
            "recommendations": _recommendations(disease, len(rising), top_country),
        },
        "kpis": _build_kpis(countries, latest_year, disease),
    }


async def get_dataset(disease: str) -> dict[str, Any]:
    normalized_disease = disease if disease in {"malaria", "hpv"} else "malaria"
    cached = _CACHE.get(normalized_disease)
    if cached and time.time() - cached[0] < CACHE_TTL_SECONDS:
        return cached[1]

    try:
        dataset = await _build_live_dataset(normalized_disease)
    except Exception:
        dataset = get_seed_dataset(normalized_disease)

    _CACHE[normalized_disease] = (time.time(), dataset)
    return dataset
