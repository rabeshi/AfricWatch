import { ForecastControls } from "@/components/forecast/ForecastControls";
import { TrendChart } from "@/components/charts/TrendChart";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getDiseaseBundle, getForecast } from "@/lib/api";
import { CountryMetric, CountryProfile, DiseaseSlug, TrendPoint } from "@/lib/types";

function buildHistory(selectedCountry: CountryMetric, profile?: CountryProfile): TrendPoint[] {
  if (profile) {
    return profile.history;
  }

  const base = selectedCountry.disease === "malaria" ? selectedCountry.cases / 1_000_000 : selectedCountry.incidenceRate;
  return [
    { year: 2018, value: Number((base * 0.83).toFixed(1)) },
    { year: 2019, value: Number((base * 0.87).toFixed(1)) },
    { year: 2020, value: Number((base * 0.9).toFixed(1)) },
    { year: 2021, value: Number((base * 0.94).toFixed(1)) },
    { year: 2022, value: Number((base * 0.97).toFixed(1)) },
    { year: 2023, value: Number((base * 0.99).toFixed(1)) },
    { year: 2024, value: Number(base.toFixed(1)) },
    { year: 2025, value: Number((base * 1.02).toFixed(1)) },
    { year: 2026, value: Number((base * 1.03).toFixed(1)) }
  ];
}

function buildCountryBrief(selectedCountry: CountryMetric, disease: DiseaseSlug, horizon: "30d" | "60d" | "90d") {
  const diseaseLabel = disease === "malaria" ? "malaria" : "HPV";
  const burdenText =
    disease === "malaria"
      ? `${selectedCountry.cases.toLocaleString()} estimated cases and an incidence rate of ${selectedCountry.incidenceRate}/1,000`
      : `${selectedCountry.cases.toLocaleString()} estimated cases and an incidence rate of ${selectedCountry.incidenceRate}/100,000`;
  const trendText =
    selectedCountry.trend === "rising"
      ? "a rising-risk context that warrants closer surveillance attention"
      : selectedCountry.trend === "stable"
        ? "a relatively stable risk profile that still needs routine monitoring"
        : "an improving profile, though continued monitoring remains important";

  return `Current view: ${selectedCountry.country} in ${selectedCountry.region}, focused on ${diseaseLabel} over the next ${horizon.replace(
    "d",
    ""
  )} days. The selected country currently shows ${burdenText} and is classified as ${trendText}.`;
}

export default async function ForecastPage({
  searchParams
}: {
  searchParams?: {
    horizon?: "30d" | "60d" | "90d";
    disease?: DiseaseSlug;
    country?: string;
    model?: "damped_trend" | "arima" | "ets";
  };
}) {
  const disease = searchParams?.disease === "hpv" ? "hpv" : "malaria";
  const horizon = searchParams?.horizon === "30d" || searchParams?.horizon === "60d" ? searchParams.horizon : "90d";
  const model = searchParams?.model === "arima" || searchParams?.model === "ets" ? searchParams.model : "damped_trend";
  const bundle = getDiseaseBundle(disease);
  const sortedCountries = bundle.map.countries.slice().sort((left, right) => left.country.localeCompare(right.country));
  const selectedCountry =
    sortedCountries.find((item) => item.iso3 === searchParams?.country) ??
    bundle.map.countries.slice().sort((left, right) => right.forecastRisk - left.forecastRisk)[0];
  const selectedProfile = bundle.profiles[selectedCountry.country.toLowerCase()];
  const [forecast] = await Promise.all([getForecast(disease, selectedCountry.iso3, horizon, model)]);
  const history = buildHistory(selectedCountry, selectedProfile);
  const modelLabel = model === "arima" ? "ARIMA" : model === "ets" ? "ETS" : "Damped Trend";

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <SectionTitle
        eyebrow="Forecast center"
        title="Predictive analytics for the next 30, 60, or 90 days."
        description="The forecast center supports short-horizon planning windows across malaria and HPV using a trend-aware baseline model built for operational disease monitoring."
      />
      <div className="mt-8">
        <ForecastControls
          disease={disease}
          horizon={horizon}
          model={model}
          country={selectedCountry.iso3}
          countries={sortedCountries.map((item) => ({ iso3: item.iso3, country: item.country }))}
        />
      </div>
      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <TrendChart
          title={`${selectedCountry.country} ${disease === "malaria" ? "malaria" : "HPV"} forecast outlook for the next ${horizon.replace("d", "")} days`}
          history={history}
          forecast={forecast.points}
        />
        <div className="rounded-[2rem] border border-white/10 bg-card/80 p-6 shadow-panel">
          <div className="text-xs uppercase tracking-[0.32em] text-accentSoft">Forecast briefing</div>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-surface/75 p-4">
              <div className="text-lg font-medium">Selected forecast window</div>
              <p className="mt-2 text-sm leading-7 text-muted">
                {buildCountryBrief(selectedCountry, disease, horizon)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-surface/75 p-4">
              <div className="text-lg font-medium">Forecasting approach</div>
              <p className="mt-2 text-sm leading-7 text-muted">
                Selected model: {modelLabel}. ARIMA and ETS are served through a statsmodels-backed forecasting layer, while Damped Trend remains available as a lightweight baseline for comparison and fallback.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-surface/75 p-4">
              <div className="text-lg font-medium">Country-specific interpretation</div>
              <p className="mt-2 text-sm leading-7 text-muted">
                {selectedCountry.country} is currently classified as{" "}
                {selectedCountry.trend === "rising" ? "a rising-risk context" : selectedCountry.trend === "stable" ? "a stable-risk context" : "an improving-risk context"}{" "}
                with a forecast-risk score of {selectedCountry.forecastRisk}/100 in the selected {disease === "malaria" ? "malaria" : "HPV"} module.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
