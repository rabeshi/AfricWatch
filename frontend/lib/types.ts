export type MapLayer = "incidence" | "mortality" | "forecastRisk" | "hotspot";
export type DiseaseSlug = "malaria" | "hpv";

export interface Kpi {
  label: string;
  value: string;
  change: string;
}

export interface CountryMetric {
  country: string;
  iso3: string;
  region: string;
  disease: DiseaseSlug;
  cases: number;
  incidenceRate: number;
  mortalityRate: number;
  forecastRisk: number;
  hotspotIntensity: number;
  trend: "rising" | "stable" | "improving";
}

export interface TrendPoint {
  year: number | string;
  value: number;
}

export interface CountryProfile {
  country: string;
  iso3: string;
  disease: DiseaseSlug;
  summary: string;
  metrics: CountryMetric;
  history: TrendPoint[];
  forecast: Array<TrendPoint & { lower: number; upper: number }>;
  recommendations: string[];
}

export interface InsightsPayload {
  narrative: string;
  elevatedRisk: string[];
  improving: string[];
  recommendations: string[];
}

export interface MapPayload {
  disease: DiseaseSlug;
  year: number;
  layer: MapLayer;
  countries: CountryMetric[];
  kpis: Kpi[];
}

export interface DiseaseBundle {
  map: MapPayload;
  insights: InsightsPayload;
  profiles: Record<string, CountryProfile>;
}
