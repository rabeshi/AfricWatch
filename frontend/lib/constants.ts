import { CountryMetric, CountryProfile, DiseaseBundle, DiseaseSlug, InsightsPayload, MapPayload } from "@/lib/types";

const malariaCountries: CountryMetric[] = [
  { country: "Nigeria", iso3: "NGA", region: "West Africa", disease: "malaria", cases: 67000000, incidenceRate: 302, mortalityRate: 48, forecastRisk: 90, hotspotIntensity: 88, trend: "rising" },
  { country: "Democratic Republic of the Congo", iso3: "COD", region: "Central Africa", disease: "malaria", cases: 38000000, incidenceRate: 289, mortalityRate: 41, forecastRisk: 86, hotspotIntensity: 84, trend: "rising" },
  { country: "Uganda", iso3: "UGA", region: "East Africa", disease: "malaria", cases: 12800000, incidenceRate: 265, mortalityRate: 31, forecastRisk: 80, hotspotIntensity: 77, trend: "rising" },
  { country: "Mozambique", iso3: "MOZ", region: "Southern Africa", disease: "malaria", cases: 11500000, incidenceRate: 271, mortalityRate: 35, forecastRisk: 79, hotspotIntensity: 75, trend: "rising" },
  { country: "Ghana", iso3: "GHA", region: "West Africa", disease: "malaria", cases: 6100000, incidenceRate: 188, mortalityRate: 17, forecastRisk: 61, hotspotIntensity: 59, trend: "stable" },
  { country: "Kenya", iso3: "KEN", region: "East Africa", disease: "malaria", cases: 5200000, incidenceRate: 121, mortalityRate: 13, forecastRisk: 55, hotspotIntensity: 50, trend: "improving" },
  { country: "Ethiopia", iso3: "ETH", region: "East Africa", disease: "malaria", cases: 4700000, incidenceRate: 73, mortalityRate: 9, forecastRisk: 52, hotspotIntensity: 47, trend: "stable" },
  { country: "Burkina Faso", iso3: "BFA", region: "West Africa", disease: "malaria", cases: 15000000, incidenceRate: 395, mortalityRate: 44, forecastRisk: 87, hotspotIntensity: 82, trend: "rising" }
];

const hpvCountries: CountryMetric[] = [
  { country: "Nigeria", iso3: "NGA", region: "West Africa", disease: "hpv", cases: 124000, incidenceRate: 32, mortalityRate: 18, forecastRisk: 74, hotspotIntensity: 70, trend: "rising" },
  { country: "Kenya", iso3: "KEN", region: "East Africa", disease: "hpv", cases: 38800, incidenceRate: 29, mortalityRate: 15, forecastRisk: 68, hotspotIntensity: 62, trend: "rising" },
  { country: "Uganda", iso3: "UGA", region: "East Africa", disease: "hpv", cases: 42100, incidenceRate: 36, mortalityRate: 19, forecastRisk: 72, hotspotIntensity: 66, trend: "rising" },
  { country: "South Africa", iso3: "ZAF", region: "Southern Africa", disease: "hpv", cases: 27800, incidenceRate: 24, mortalityRate: 11, forecastRisk: 58, hotspotIntensity: 55, trend: "stable" },
  { country: "Ethiopia", iso3: "ETH", region: "East Africa", disease: "hpv", cases: 52100, incidenceRate: 31, mortalityRate: 17, forecastRisk: 71, hotspotIntensity: 64, trend: "rising" },
  { country: "Tanzania", iso3: "TZA", region: "East Africa", disease: "hpv", cases: 47200, incidenceRate: 34, mortalityRate: 18, forecastRisk: 69, hotspotIntensity: 63, trend: "rising" },
  { country: "Ghana", iso3: "GHA", region: "West Africa", disease: "hpv", cases: 14900, incidenceRate: 19, mortalityRate: 10, forecastRisk: 49, hotspotIntensity: 45, trend: "stable" },
  { country: "Rwanda", iso3: "RWA", region: "East Africa", disease: "hpv", cases: 5300, incidenceRate: 13, mortalityRate: 6, forecastRisk: 34, hotspotIntensity: 28, trend: "improving" }
];

const malariaProfiles: Record<string, CountryProfile> = {
  "uganda": {
    country: "Uganda",
    iso3: "UGA",
    disease: "malaria",
    summary: "Uganda remains a high-burden malaria country with sustained transmission pressure and elevated near-term forecast risk.",
    metrics: malariaCountries.find((item) => item.iso3 === "UGA")!,
    history: [
      { year: 2018, value: 10.1 },
      { year: 2019, value: 10.6 },
      { year: 2020, value: 11.1 },
      { year: 2021, value: 11.3 },
      { year: 2022, value: 11.9 },
      { year: 2023, value: 12.4 },
      { year: 2024, value: 12.8 },
      { year: 2025, value: 13.1 },
      { year: 2026, value: 13.4 }
    ],
    forecast: [
      { year: 2025, value: 13.1, lower: 12.5, upper: 13.8 },
      { year: 2026, value: 13.4, lower: 12.7, upper: 14.2 }
    ],
    recommendations: [
      "Prioritize surveillance in northern and eastern high-transmission districts.",
      "Track cross-border pressure with South Sudan and DRC corridors.",
      "Prepare seasonal surge capacity before the next high-transmission period."
    ]
  },
  "nigeria": {
    country: "Nigeria",
    iso3: "NGA",
    disease: "malaria",
    summary: "Nigeria drives a large share of continental malaria burden and remains the top priority for risk-informed intervention planning.",
    metrics: malariaCountries.find((item) => item.iso3 === "NGA")!,
    history: [
      { year: 2018, value: 58 },
      { year: 2019, value: 60.2 },
      { year: 2020, value: 61.7 },
      { year: 2021, value: 63.9 },
      { year: 2022, value: 65.1 },
      { year: 2023, value: 66.2 },
      { year: 2024, value: 67 },
      { year: 2025, value: 68.4 },
      { year: 2026, value: 69.8 }
    ],
    forecast: [
      { year: 2025, value: 68.4, lower: 66.7, upper: 70.3 },
      { year: 2026, value: 69.8, lower: 67.2, upper: 72.1 }
    ],
    recommendations: [
      "Sustain surveillance intensity in the highest-burden states.",
      "Prioritize mortality reduction strategies alongside case detection.",
      "Use forecast-driven prepositioning for malaria commodity planning."
    ]
  }
};

const hpvProfiles: Record<string, CountryProfile> = {
  "uganda": {
    country: "Uganda",
    iso3: "UGA",
    disease: "hpv",
    summary: "Uganda shows persistent HPV-related cervical cancer burden pressure and should remain in targeted screening and vaccination monitoring.",
    metrics: hpvCountries.find((item) => item.iso3 === "UGA")!,
    history: [
      { year: 2018, value: 31.2 },
      { year: 2019, value: 31.8 },
      { year: 2020, value: 32.6 },
      { year: 2021, value: 33.4 },
      { year: 2022, value: 34.1 },
      { year: 2023, value: 35.3 },
      { year: 2024, value: 36.0 },
      { year: 2025, value: 36.7 },
      { year: 2026, value: 37.2 }
    ],
    forecast: [
      { year: 2025, value: 36.7, lower: 35.8, upper: 37.6 },
      { year: 2026, value: 37.2, lower: 36.1, upper: 38.5 }
    ],
    recommendations: [
      "Prioritize cervical cancer screening scale-up in high-burden districts.",
      "Track HPV vaccination coverage alongside burden indicators.",
      "Flag service gaps where incidence and mortality remain jointly elevated."
    ]
  },
  "nigeria": {
    country: "Nigeria",
    iso3: "NGA",
    disease: "hpv",
    summary: "Nigeria remains a leading HPV-related burden context and should be prioritized for screening access, vaccination uptake, and mortality reduction planning.",
    metrics: hpvCountries.find((item) => item.iso3 === "NGA")!,
    history: [
      { year: 2018, value: 28.1 },
      { year: 2019, value: 29.0 },
      { year: 2020, value: 29.4 },
      { year: 2021, value: 30.2 },
      { year: 2022, value: 31.1 },
      { year: 2023, value: 31.7 },
      { year: 2024, value: 32.0 },
      { year: 2025, value: 32.6 },
      { year: 2026, value: 33.1 }
    ],
    forecast: [
      { year: 2025, value: 32.6, lower: 31.8, upper: 33.5 },
      { year: 2026, value: 33.1, lower: 32.0, upper: 34.4 }
    ],
    recommendations: [
      "Sustain high-priority screening and treatment referral monitoring.",
      "Combine vaccination coverage and burden analytics in planning reviews.",
      "Watch for mortality persistence where burden declines lag."
    ]
  }
};

const malariaMapPayload: MapPayload = {
  disease: "malaria",
  year: 2024,
  layer: "incidence",
  countries: malariaCountries,
  kpis: [
    { label: "Total estimated cases", value: "159.8M", change: "+4.2% YoY" },
    { label: "Median incidence rate", value: "268 / 1,000", change: "High in West + Central Africa" },
    { label: "Highest forecast risk", value: "Nigeria", change: "Risk score 90/100" },
    { label: "Countries with rising trends", value: "5", change: "Priority for surveillance" }
  ]
};

const malariaInsights: InsightsPayload = {
  narrative:
    "Malaria burden remains concentrated in West, Central, and parts of East Africa, with Nigeria, DRC, Burkina Faso, and Uganda showing the strongest short-term pressure in the current modeled outlook.",
  elevatedRisk: ["Nigeria", "Democratic Republic of the Congo", "Burkina Faso", "Uganda", "Mozambique"],
  improving: ["Kenya"],
  recommendations: [
    "Prioritize surveillance in countries with rising burden and elevated mortality.",
    "Monitor cross-border transmission corridors where neighboring burden remains high.",
    "Use the next-quarter risk signal to align commodity prepositioning and field response."
  ]
};

const hpvMapPayload: MapPayload = {
  disease: "hpv",
  year: 2024,
  layer: "incidence",
  countries: hpvCountries,
  kpis: [
    { label: "Total estimated cases", value: "354.2K", change: "+2.7% YoY" },
    { label: "Median incidence rate", value: "29 / 100,000", change: "Highest in East + West Africa" },
    { label: "Highest forecast risk", value: "Nigeria", change: "Risk score 74/100" },
    { label: "Countries with rising trends", value: "5", change: "Screening watchlist" }
  ]
};

const hpvInsights: InsightsPayload = {
  narrative:
    "HPV-related burden remains elevated in several East and West African countries, with Uganda, Nigeria, Ethiopia, and Tanzania showing sustained need for stronger screening, vaccination, and referral planning.",
  elevatedRisk: ["Nigeria", "Uganda", "Ethiopia", "Tanzania", "Kenya"],
  improving: ["Rwanda"],
  recommendations: [
    "Prioritize screening access in countries with sustained high incidence and mortality.",
    "Link burden review with HPV vaccination coverage and treatment referral capacity.",
    "Focus planning attention on countries with rising trend and forecast risk overlap."
  ]
};

export const diseaseBundles: Record<DiseaseSlug, DiseaseBundle> = {
  malaria: {
    map: malariaMapPayload,
    insights: malariaInsights,
    profiles: malariaProfiles
  },
  hpv: {
    map: hpvMapPayload,
    insights: hpvInsights,
    profiles: hpvProfiles
  }
};

export const mockMapPayload = diseaseBundles.malaria.map;
export const mockInsights = diseaseBundles.malaria.insights;
export const mockProfiles = diseaseBundles.malaria.profiles;
