"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DiseaseSlug } from "@/lib/types";

interface ForecastControlsProps {
  disease: DiseaseSlug;
  horizon: "30d" | "60d" | "90d";
  model: "damped_trend" | "arima" | "ets";
  country: string;
  countries: Array<{ iso3: string; country: string }>;
}

export function ForecastControls({ disease, horizon, model, country, countries }: ForecastControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateQuery(next: {
    disease?: DiseaseSlug;
    horizon?: "30d" | "60d" | "90d";
    model?: "damped_trend" | "arima" | "ets";
    country?: string;
  }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextDisease = next.disease ?? disease;
    const nextHorizon = next.horizon ?? horizon;
    const nextModel = next.model ?? model;
    const nextCountry = next.country ?? country;

    params.set("disease", nextDisease);
    params.set("horizon", nextHorizon);
    params.set("model", nextModel);
    params.set("country", nextCountry);
    router.push(`/forecast?${params.toString()}`);
  }

  return (
    <div className="grid gap-4 rounded-[2rem] border border-ink/10 bg-card/60 p-5 md:grid-cols-4">
      <label className="block text-sm text-muted">
        <span className="mb-2 block text-xs uppercase tracking-[0.26em] text-accentSoft">Disease</span>
        <select
          value={disease}
          onChange={(event) => updateQuery({ disease: event.target.value as DiseaseSlug, country: countries[0]?.iso3 ?? country })}
          className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3 text-ink outline-none transition focus:border-accent"
        >
          <option value="malaria">Malaria</option>
          <option value="hpv">HPV</option>
        </select>
      </label>

      <label className="block text-sm text-muted">
        <span className="mb-2 block text-xs uppercase tracking-[0.26em] text-accentSoft">Forecast window</span>
        <select
          value={horizon}
          onChange={(event) => updateQuery({ horizon: event.target.value as "30d" | "60d" | "90d" })}
          className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3 text-ink outline-none transition focus:border-accent"
        >
          <option value="30d">30 days</option>
          <option value="60d">60 days</option>
          <option value="90d">90 days</option>
        </select>
      </label>

      <label className="block text-sm text-muted">
        <span className="mb-2 block text-xs uppercase tracking-[0.26em] text-accentSoft">Model</span>
        <select
          value={model}
          onChange={(event) => updateQuery({ model: event.target.value as "damped_trend" | "arima" | "ets" })}
          className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3 text-ink outline-none transition focus:border-accent"
        >
          <option value="damped_trend">Damped Trend</option>
          <option value="arima">ARIMA</option>
          <option value="ets">ETS</option>
        </select>
      </label>

      <label className="block text-sm text-muted">
        <span className="mb-2 block text-xs uppercase tracking-[0.26em] text-accentSoft">Country</span>
        <select
          value={country}
          onChange={(event) => updateQuery({ country: event.target.value })}
          className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3 text-ink outline-none transition focus:border-accent"
        >
          {countries.map((item) => (
            <option key={item.iso3} value={item.iso3}>
              {item.country}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
