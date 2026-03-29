import { diseaseBundles, mockInsights, mockMapPayload } from "@/lib/constants";
import { CountryProfile, DiseaseSlug, InsightsPayload, MapLayer, MapPayload } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

function normalizeDisease(disease: string): DiseaseSlug {
  return disease === "hpv" ? "hpv" : "malaria";
}

export function slugifyCountryName(country: string): string {
  return country.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function buildFallbackProfile(country: MapPayload["countries"][number], disease: DiseaseSlug): CountryProfile {
  const incidenceUnit = disease === "malaria" ? "/1,000" : "/100,000";
  return {
    country: country.country,
    iso3: country.iso3,
    disease,
    summary: `${country.country} is being shown from the latest available AfricWatch dataset while richer profile details load.`,
    metrics: country,
    history: [
      { year: 2019, value: Number((country.incidenceRate * 0.88).toFixed(1)) },
      { year: 2020, value: Number((country.incidenceRate * 0.91).toFixed(1)) },
      { year: 2021, value: Number((country.incidenceRate * 0.94).toFixed(1)) },
      { year: 2022, value: Number((country.incidenceRate * 0.97).toFixed(1)) },
      { year: 2023, value: Number(country.incidenceRate.toFixed(1)) }
    ],
    forecast: [
      { year: "Day 30", value: country.incidenceRate, lower: country.incidenceRate * 0.96, upper: country.incidenceRate * 1.04 }
    ],
    recommendations: [
      `Review the latest WHO burden signal for ${country.country}.`,
      `Interpret the current incidence value (${country.incidenceRate}${incidenceUnit}) together with the country risk score.`,
    ]
  };
}

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 3600 }
    });
    if (!response.ok) {
      return fallback;
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getMapData(disease: DiseaseSlug = "malaria", layer: MapLayer = "incidence"): Promise<MapPayload> {
  const safeDisease = normalizeDisease(disease);
  return safeFetch(`/api/v1/map-data?disease=${safeDisease}&year=2024&layer=${layer}`, {
    ...diseaseBundles[safeDisease].map,
    layer
  });
}

export async function getInsights(disease: DiseaseSlug = "malaria"): Promise<InsightsPayload> {
  const safeDisease = normalizeDisease(disease);
  return safeFetch(`/api/v1/insights?disease=${safeDisease}`, diseaseBundles[safeDisease].insights ?? mockInsights);
}

export async function getCountryProfile(slug: string, disease: DiseaseSlug = "malaria"): Promise<CountryProfile | null> {
  const safeDisease = normalizeDisease(disease);
  const normalizedSlug = slugifyCountryName(slug);
  const fallback = Object.entries(diseaseBundles[safeDisease].profiles).find(([key]) => slugifyCountryName(key) === normalizedSlug)?.[1];
  if (!fallback) {
    const mapData = await getMapData(safeDisease);
    const liveCountry = mapData.countries.find((item) => slugifyCountryName(item.country) === normalizedSlug);
    if (!liveCountry) {
      return null;
    }
    return safeFetch(`/api/v1/countries/${liveCountry.iso3}?disease=${safeDisease}`, buildFallbackProfile(liveCountry, safeDisease));
  }
  return safeFetch(`/api/v1/countries/${fallback.iso3}?disease=${safeDisease}`, fallback);
}

export function getDiseaseBundle(disease: DiseaseSlug) {
  return diseaseBundles[normalizeDisease(disease)];
}

export async function getForecast(
  disease: DiseaseSlug = "malaria",
  country = "NGA",
  horizon: "30d" | "60d" | "90d" = "90d",
  model: "damped_trend" | "arima" | "ets" = "damped_trend"
) {
  const safeDisease = normalizeDisease(disease);
  return safeFetch(`/api/v1/forecast?disease=${safeDisease}&country=${country}&indicator=cases&horizon=${horizon}&model=${model}`, {
    disease: safeDisease,
    country,
    indicator: "cases",
    horizon,
    model,
    points: []
  });
}
