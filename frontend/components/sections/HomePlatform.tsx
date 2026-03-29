"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TrendChart } from "@/components/charts/TrendChart";
import { AfricaChoropleth } from "@/components/map/AfricaChoropleth";
import { Hero } from "@/components/sections/Hero";
import { InsightsPanel } from "@/components/sections/InsightsPanel";
import { KpiCard } from "@/components/ui/KpiCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCountryProfile, getInsights, getMapData, slugifyCountryName } from "@/lib/api";
import { CountryMetric, CountryProfile, DiseaseSlug, Kpi, MapPayload } from "@/lib/types";

const diseaseOptions: Array<{ slug: DiseaseSlug; label: string }> = [
  { slug: "malaria", label: "Malaria" },
  { slug: "hpv", label: "HPV" }
];

function buildCountryKpis(country: CountryMetric): Kpi[] {
  return [
    {
      label: "Total estimated cases",
      value: country.cases.toLocaleString(),
      change: `${country.country} selected`
    },
    {
      label: "Median incidence rate",
      value: `${country.incidenceRate}${country.disease === "malaria" ? " / 1,000" : " / 100,000"}`,
      change: `${country.region} burden profile`
    },
    {
      label: "Highest forecast risk",
      value: `${country.forecastRisk}/100`,
      change: `${country.country} risk outlook`
    },
    {
      label: "Countries with rising trends",
      value: country.trend === "rising" ? "Yes" : "No",
      change: "Selected-country trend signal"
    }
  ];
}

export function HomePlatform() {
  const [disease, setDisease] = useState<DiseaseSlug>("malaria");
  const [selectedIso3, setSelectedIso3] = useState<string | null>(null);
  const [mapData, setMapData] = useState<MapPayload | null>(null);
  const [insights, setInsights] = useState<{ narrative: string; elevatedRisk: string[]; improving: string[]; recommendations: string[] } | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<CountryProfile | null>(null);

  useEffect(() => {
    let active = true;
    setSelectedIso3(null);
    void Promise.all([getMapData(disease, "incidence"), getInsights(disease)]).then(([nextMapData, nextInsights]) => {
      if (!active) {
        return;
      }
      setMapData(nextMapData);
      setInsights(nextInsights);
    });
    return () => {
      active = false;
    };
  }, [disease]);

  const selectedCountry = mapData?.countries.find((item) => item.iso3 === selectedIso3) ?? null;
  const highlightedCountry = selectedCountry ?? mapData?.countries[0] ?? null;

  useEffect(() => {
    let active = true;
    if (!highlightedCountry) {
      setSelectedProfile(null);
      return () => {
        active = false;
      };
    }
    void getCountryProfile(slugifyCountryName(highlightedCountry.country), disease).then((profile) => {
      if (active) {
        setSelectedProfile(profile);
      }
    });
    return () => {
      active = false;
    };
  }, [disease, highlightedCountry]);

  const displayKpis = useMemo(
    () => (selectedCountry ? buildCountryKpis(selectedCountry) : mapData?.kpis ?? []),
    [mapData?.kpis, selectedCountry]
  );

  const priorityCountries = (mapData?.countries ?? []).slice().sort((left, right) => right.forecastRisk - left.forecastRisk).slice(0, 2);
  const chartHistory = selectedProfile?.history ?? [];
  const chartForecast = selectedProfile?.forecast;

  return (
    <div className="pb-20">
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            eyebrow="Continental overview"
            title="A large Africa map anchors the platform."
            description="Switch between malaria and HPV, click a country to drill into its latest signal, and use the map as the command surface for burden, risk, and trend interpretation."
          />
          <div className="rounded-[2rem] border border-ink/10 bg-card/75 p-2">
            <div className="flex gap-2">
              {diseaseOptions.map((option) => (
                <button
                  key={option.slug}
                  type="button"
                  onClick={() => {
                    setDisease(option.slug);
                    setSelectedIso3(null);
                  }}
                  className={`rounded-full px-4 py-3 text-sm transition ${
                    disease === option.slug ? "bg-accent text-bg" : "text-muted hover:text-ink"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <AfricaChoropleth
            countries={mapData?.countries ?? []}
            layer="incidence"
            onCountrySelect={(iso3) => setSelectedIso3(iso3)}
          />
        </div>
        <div className="mt-4 text-sm text-muted">
          {selectedCountry
            ? `Selected country: ${selectedCountry.country}. KPI cards now reflect the clicked map area.`
            : `Showing continent-wide ${disease} KPIs. Click a country on the map to inspect local values.`}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {displayKpis.map((kpi) => (
            <KpiCard key={kpi.label} kpi={kpi} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-2">
          <TrendChart
            title={`${selectedProfile?.country ?? "Priority country"} ${disease === "malaria" ? "burden" : "HPV burden"} trajectory and modeled forecast`}
            history={chartHistory}
            forecast={chartForecast}
          />
          <div className="rounded-[2rem] border border-ink/10 bg-card/80 p-6 shadow-panel">
            <div className="text-xs uppercase tracking-[0.32em] text-accentSoft">Priority countries</div>
            <div className="mt-4 space-y-4">
              {priorityCountries.map((country) => (
                <div key={country.iso3} className="rounded-2xl border border-ink/10 bg-surface/80 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-medium">{country.country}</div>
                      <div className="text-sm text-muted">{country.region}</div>
                    </div>
                    <div className="rounded-full bg-danger/10 px-3 py-1 text-sm text-danger">
                      Risk {country.forecastRisk}/100
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted">
                    <div>Cases: {country.cases.toLocaleString()}</div>
                    <div>Incidence: {country.incidenceRate}</div>
                    <div>Mortality: {country.mortalityRate}</div>
                    <div>Trend: {country.trend}</div>
                  </div>
                  <Link
                    href={`/country/${slugifyCountryName(country.country)}?disease=${disease}` as Route}
                    className="mt-4 inline-block text-sm text-accentSoft"
                  >
                    Open country explorer
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {insights ? <InsightsPanel insights={insights} /> : null}
      </section>
    </div>
  );
}
