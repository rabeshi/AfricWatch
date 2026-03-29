import { diseaseBundles, mockInsights, mockMapPayload } from "@/lib/constants";
import { CountryProfile, DiseaseSlug, InsightsPayload, MapLayer, MapPayload } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

function normalizeDisease(disease: string): DiseaseSlug {
  return disease === "hpv" ? "hpv" : "malaria";
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
  const normalized = slug.replaceAll("-", " ");
  const fallback = Object.entries(diseaseBundles[safeDisease].profiles).find(([key]) => key === normalized)?.[1];
  if (!fallback) {
    return null;
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
