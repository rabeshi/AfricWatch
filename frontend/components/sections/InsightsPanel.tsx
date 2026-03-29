import { InsightsPayload } from "@/lib/types";

export function InsightsPanel({ insights }: { insights: InsightsPayload }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-card/85 p-6 shadow-panel">
      <div className="text-xs uppercase tracking-[0.32em] text-accentSoft">AI-guided insights</div>
      <p className="mt-4 text-base leading-7 text-muted">{insights.narrative}</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div>
          <div className="text-sm font-medium text-ink">Elevated risk</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {insights.elevatedRisk.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium text-ink">Improving signal</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {insights.improving.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium text-ink">Recommendations</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {insights.recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
