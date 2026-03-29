import { notFound } from "next/navigation";
import { TrendChart } from "@/components/charts/TrendChart";
import { KpiCard } from "@/components/ui/KpiCard";
import { getCountryProfile } from "@/lib/api";
import { DiseaseSlug } from "@/lib/types";

export default async function CountryPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: { disease?: DiseaseSlug };
}) {
  const disease = searchParams?.disease === "hpv" ? "hpv" : "malaria";
  const profile = await getCountryProfile(params.slug, disease);

  if (!profile) {
    notFound();
  }

  const incidenceUnit = profile.disease === "malaria" ? "/1,000" : "/100,000";

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="max-w-4xl">
        <div className="text-xs uppercase tracking-[0.32em] text-accentSoft">Country explorer</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight lg:text-5xl">{profile.country}</h1>
        <div className="mt-4 text-sm uppercase tracking-[0.24em] text-accentSoft">{profile.disease}</div>
        <p className="mt-5 text-base leading-7 text-muted">{profile.summary}</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard kpi={{ label: "Estimated cases", value: profile.metrics.cases.toLocaleString(), change: profile.metrics.trend }} />
        <KpiCard kpi={{ label: "Incidence rate", value: `${profile.metrics.incidenceRate}${incidenceUnit}`, change: "Latest WHO-backed profile" }} />
        <KpiCard kpi={{ label: "Mortality rate", value: `${profile.metrics.mortalityRate}`, change: "Deaths-related burden signal" }} />
        <KpiCard kpi={{ label: "Forecast risk", value: `${profile.metrics.forecastRisk}/100`, change: "Next-quarter risk" }} />
      </div>
      <div className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <TrendChart title={`${profile.country} historical trend and forecast`} history={profile.history} forecast={profile.forecast} />
        <div className="rounded-[2rem] border border-white/10 bg-card/80 p-6 shadow-panel">
          <div className="text-xs uppercase tracking-[0.32em] text-accentSoft">Recommended actions</div>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-muted">
            {profile.recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
