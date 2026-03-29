import { CountryProfile, DiseaseSlug, InsightsPayload, MapLayer, MapPayload } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const MONTHLY_REVALIDATE_SECONDS = 60 * 60 * 24 * 30;

function normalizeDisease(disease: string): DiseaseSlug {
  return disease === "hpv" ? "hpv" : "malaria";
}

export function slugifyCountryName(country: string): string {
  return country.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function emptyMapPayload(disease: DiseaseSlug, layer: MapLayer): MapPayload {
  return {
    disease,
    year: new Date().getUTCFullYear(),
    layer,
    countries: [],
    kpis: [
      { label: "Total estimated cases", value: "Unavailable", change: "WHO feed unavailable" },
      { label: "Median incidence rate", value: "Unavailable", change: "Monthly refresh pending" },
      { label: "Highest forecast risk", value: "Unavailable", change: "No live WHO response" },
      { label: "Countries with rising trends", value: "Unavailable", change: "No verified dataset loaded" }
    ]
  };
}

function emptyInsights(disease: DiseaseSlug): InsightsPayload {
  return {
    narrative:
      disease === "malaria"
        ? "Live WHO malaria data is currently unavailable. AfricWatch is configured to refresh with verified WHO data monthly and will not invent fallback burden values."
        : "Live WHO cervical cancer proxy data for the HPV module is currently unavailable. AfricWatch is configured to refresh with verified WHO data monthly and will not invent fallback burden values.",
    elevatedRisk: [],
    improving: [],
    recommendations: [
      "Wait for the next successful WHO refresh before making burden comparisons.",
      "Treat this module as unavailable rather than inferred from placeholder data."
    ]
  };
}

async function safeFetch<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: MONTHLY_REVALIDATE_SECONDS }
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getMapData(disease: DiseaseSlug = "malaria", layer: MapLayer = "incidence"): Promise<MapPayload> {
  const safeDisease = normalizeDisease(disease);
  return (await safeFetch<MapPayload>(`/api/v1/map-data?disease=${safeDisease}&year=2024&layer=${layer}`)) ?? emptyMapPayload(safeDisease, layer);
}

export async function getInsights(disease: DiseaseSlug = "malaria"): Promise<InsightsPayload> {
  const safeDisease = normalizeDisease(disease);
  return (await safeFetch<InsightsPayload>(`/api/v1/insights?disease=${safeDisease}`)) ?? emptyInsights(safeDisease);
}

export async function getCountryProfile(slug: string, disease: DiseaseSlug = "malaria"): Promise<CountryProfile | null> {
  const safeDisease = normalizeDisease(disease);
  const normalizedSlug = slugifyCountryName(slug);
  const mapData = await getMapData(safeDisease);
  const liveCountry = mapData.countries.find((item) => slugifyCountryName(item.country) === normalizedSlug);
  if (!liveCountry) {
    return null;
  }
  return await safeFetch<CountryProfile>(`/api/v1/countries/${liveCountry.iso3}?disease=${safeDisease}`);
}

export async function getForecast(
  disease: DiseaseSlug = "malaria",
  country = "NGA",
  horizon: "30d" | "60d" | "90d" = "90d",
  model: "damped_trend" | "arima" | "ets" = "damped_trend"
): Promise<{
  disease: DiseaseSlug;
  country: string;
  indicator: string;
  horizon: "30d" | "60d" | "90d";
  model: "damped_trend" | "arima" | "ets";
  points: Array<{ year: number | string; value: number; lower: number; upper: number }>;
}> {
  const safeDisease = normalizeDisease(disease);
  return (
    (await safeFetch<{
      disease: DiseaseSlug;
      country: string;
      indicator: string;
      horizon: "30d" | "60d" | "90d";
      model: "damped_trend" | "arima" | "ets";
      points: Array<{ year: number | string; value: number; lower: number; upper: number }>;
    }>(`/api/v1/forecast?disease=${safeDisease}&country=${country}&indicator=cases&horizon=${horizon}&model=${model}`)) ?? {
    disease: safeDisease,
    country,
    indicator: "cases",
    horizon,
    model,
    points: []
  });
}
