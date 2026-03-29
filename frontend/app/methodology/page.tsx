import { SectionTitle } from "@/components/ui/SectionTitle";

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
      <SectionTitle
        eyebrow="Data and methodology"
        title="How AfricWatch turns WHO data into disease intelligence."
        description="The platform is designed around WHO Global Health Observatory data, Africa-only analytical filtering, transparent modeling assumptions, and explicit uncertainty communication."
      />
      <div className="mt-10 space-y-6">
        <article className="rounded-[2rem] border border-white/10 bg-card/80 p-6 shadow-panel">
          <h2 className="text-xl font-semibold">Source and indicator strategy</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            WHO GHO OData entities are queried, filtered for African countries, and normalized into a disease x indicator x country x year schema. The malaria-first MVP targets burden, incidence, mortality, and forecast-friendly time series indicators.
          </p>
        </article>
        <article className="rounded-[2rem] border border-white/10 bg-card/80 p-6 shadow-panel">
          <h2 className="text-xl font-semibold">Forecasting and uncertainty</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Baseline forecasts use trend-aware time-series methods. Confidence bands are displayed to communicate the limits of prediction quality, especially where historical series are sparse or unstable.
          </p>
        </article>
        <article className="rounded-[2rem] border border-white/10 bg-card/80 p-6 shadow-panel">
          <h2 className="text-xl font-semibold">Risk scoring and recommendations</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Country risk scoring combines recent trend direction, growth pressure, mortality burden, volatility, and neighboring-country burden. Recommendations are rule-based in the MVP and can later be augmented with supervised ranking models.
          </p>
        </article>
      </div>
    </div>
  );
}
