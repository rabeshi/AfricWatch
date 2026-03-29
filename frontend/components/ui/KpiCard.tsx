import { Kpi } from "@/lib/types";

export function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-card/85 p-5 shadow-panel">
      <div className="text-sm text-muted">{kpi.label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{kpi.value}</div>
      <div className="mt-2 text-sm text-accentSoft">{kpi.change}</div>
    </div>
  );
}
