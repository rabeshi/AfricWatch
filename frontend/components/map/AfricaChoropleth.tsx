"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { CountryMetric, MapLayer } from "@/lib/types";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const countryLabelPositions: Record<string, { lon: number; lat: number }> = {
  NGA: { lon: 8.7, lat: 9.1 },
  COD: { lon: 23.7, lat: -2.8 },
  UGA: { lon: 32.3, lat: 1.4 },
  MOZ: { lon: 35.5, lat: -18.5 },
  GHA: { lon: -1.2, lat: 7.9 },
  KEN: { lon: 37.9, lat: 0.4 },
  ETH: { lon: 40.5, lat: 8.8 },
  BFA: { lon: -1.6, lat: 12.3 },
  ZAF: { lon: 24.0, lat: -29.0 },
  TZA: { lon: 34.8, lat: -6.3 },
  RWA: { lon: 29.9, lat: -1.9 }
};

const layerLabels: Record<MapLayer, string> = {
  incidence: "Incidence rate per 1,000",
  mortality: "Mortality rate",
  forecastRisk: "Forecast risk score",
  hotspot: "Hotspot intensity"
};

function getValue(metric: CountryMetric, layer: MapLayer) {
  if (layer === "incidence") return metric.incidenceRate;
  if (layer === "mortality") return metric.mortalityRate;
  if (layer === "forecastRisk") return metric.forecastRisk;
  return metric.hotspotIntensity;
}

export function AfricaChoropleth({
  countries,
  layer,
  onCountrySelect
}: {
  countries: CountryMetric[];
  layer: MapLayer;
  onCountrySelect?: (iso3: string) => void;
}) {
  const chartData = useMemo(
    () => {
      const labeledCountries = countries.filter((item) => countryLabelPositions[item.iso3]);

      return [
        {
        type: "choropleth",
        locationmode: "ISO-3",
        locations: countries.map((item) => item.iso3),
        z: countries.map((item) => getValue(item, layer)),
        text: countries.map((item) => `${item.country}<br>${layerLabels[layer]}: ${getValue(item, layer)}`),
        colorscale: [
          [0, "#8fd6c8"],
          [0.4, "#2ca58d"],
          [0.7, "#f2c14e"],
          [1, "#ef7d57"]
        ],
        marker: {
          line: {
            color: "rgba(255,255,255,0.35)",
            width: 0.5
          }
        },
        colorbar: {
          title: layerLabels[layer]
        },
        hoverlabel: {
          bgcolor: "#0f2f2c",
          font: { color: "#e8f3f0" }
        }
        },
        {
          type: "scattergeo",
          mode: "text",
          lon: labeledCountries.map((item) => countryLabelPositions[item.iso3].lon),
          lat: labeledCountries.map((item) => countryLabelPositions[item.iso3].lat),
          text: labeledCountries.map((item) => item.country),
          textfont: {
            color: "#e8f3f0",
            size: 11
          },
          hoverinfo: "skip",
          showlegend: false
        }
      ];
    },
    [countries, layer]
  );

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-surface p-4 shadow-panel">
      <div className="pointer-events-none absolute left-8 top-8 z-10 rounded-2xl border border-ink/10 bg-bg/80 px-4 py-3 backdrop-blur">
        <div className="text-xs uppercase tracking-[0.28em] text-accentSoft">Map label</div>
        <div className="mt-1 text-lg font-medium">Africa disease intelligence map</div>
        <div className="mt-1 text-xs text-muted">Click a country to update the KPI cards</div>
      </div>
      <Plot
        data={chartData as never[]}
        layout={{
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          margin: { l: 0, r: 0, t: 0, b: 0 },
          dragmode: "pan",
          geo: {
            scope: "africa",
            projection: { type: "mercator" },
            bgcolor: "rgba(0,0,0,0)",
            showframe: false,
            showcoastlines: false,
            showland: true,
            landcolor: "rgba(18,49,45,1)",
            lakecolor: "rgba(10,36,33,1)",
            showcountries: true,
            countrycolor: "rgba(255,255,255,0.2)"
          },
          font: {
            color: "#e8f3f0"
          }
        }}
        config={{
          displayModeBar: false,
          responsive: true,
          scrollZoom: true
        }}
        onClick={(event: { points?: Array<{ location?: string }> }) => {
          const iso3 = event.points?.[0]?.location;
          if (iso3 && onCountrySelect) {
            onCountrySelect(String(iso3));
          }
        }}
        style={{ width: "100%", height: "620px" }}
      />
    </div>
  );
}
