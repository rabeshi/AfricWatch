import { DiseaseDashboardControls } from "@/components/disease/DiseaseDashboardControls";
import { AfricaChoropleth } from "@/components/map/AfricaChoropleth";
import { KpiCard } from "@/components/ui/KpiCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getInsights, getMapData } from "@/lib/api";
import { DiseaseSlug } from "@/lib/types";

export default async function DiseasePage({
  searchParams
}: {
  searchParams?: { disease?: DiseaseSlug };
}) {
  const disease = searchParams?.disease === "hpv" ? "hpv" : "malaria";
  const [mapData, insights] = await Promise.all([getMapData(disease, "forecastRisk"), getInsights(disease)]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          eyebrow="Disease dashboard"
          title="Disease surveillance, burden, and forecast intelligence."
          description="Switch between malaria and HPV to compare how burden, forecast risk, and planning explanations change across disease modules."
        />
        <DiseaseDashboardControls disease={disease} />
      </div>
      <div className="mt-10">
        <AfricaChoropleth countries={mapData.countries} layer="forecastRisk" />
      </div>
      {mapData.countries.length === 0 ? (
        <div className="mt-6 rounded-[2rem] border border-white/10 bg-card/80 p-6 text-sm leading-7 text-muted shadow-panel">
          Live WHO data is currently unavailable for this module. AfricWatch will wait for the next verified monthly refresh instead of showing synthetic fallback values.
        </div>
      ) : null}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mapData.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-card/80 p-6 shadow-panel">
          <div className="text-xs uppercase tracking-[0.32em] text-accentSoft">
            {disease === "malaria" ? "Malaria interpretation" : "HPV interpretation"}
          </div>
          <p className="mt-4 text-base leading-7 text-muted">{insights.narrative}</p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-card/80 p-6 shadow-panel">
          <div className="text-xs uppercase tracking-[0.32em] text-accentSoft">
            {disease === "malaria" ? "Malaria recommendations" : "HPV recommendations"}
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
            {insights.recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
