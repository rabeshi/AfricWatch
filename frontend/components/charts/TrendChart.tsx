"use client";

import dynamic from "next/dynamic";
import { TrendPoint } from "@/lib/types";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export function TrendChart({
  title,
  history,
  forecast
}: {
  title: string;
  history: TrendPoint[];
  forecast?: Array<TrendPoint & { lower: number; upper: number }>;
}) {
  const traces: unknown[] = [
    {
      x: history.map((point) => point.year),
      y: history.map((point) => point.value),
      type: "scatter",
      mode: "lines+markers",
      name: "Historical",
      line: { color: "#8fd6c8", width: 3 }
    }
  ];

  if (forecast) {
    traces.push(
      {
        x: forecast.map((point) => point.year),
        y: forecast.map((point) => point.upper),
        type: "scatter",
        mode: "lines",
        line: { color: "rgba(242,193,78,0)" },
        showlegend: false
      },
      {
        x: forecast.map((point) => point.year),
        y: forecast.map((point) => point.lower),
        type: "scatter",
        mode: "lines",
        fill: "tonexty",
        fillcolor: "rgba(242,193,78,0.18)",
        line: { color: "rgba(242,193,78,0)" },
        name: "Confidence band"
      },
      {
        x: forecast.map((point) => point.year),
        y: forecast.map((point) => point.value),
        type: "scatter",
        mode: "lines+markers",
        name: "Forecast",
        line: { color: "#f2c14e", width: 3, dash: "dash" }
      }
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-card/80 p-5 shadow-panel">
      <div className="mb-4 text-lg font-medium">{title}</div>
      <Plot
        data={traces as never[]}
        layout={{
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          margin: { l: 40, r: 10, t: 10, b: 40 },
          font: { color: "#e8f3f0" },
          xaxis: { gridcolor: "rgba(255,255,255,0.08)" },
          yaxis: { gridcolor: "rgba(255,255,255,0.08)" },
          legend: { orientation: "h" }
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%", height: "320px" }}
      />
    </div>
  );
}
