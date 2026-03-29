import { SectionTitle } from "@/components/ui/SectionTitle";

const endpoints = [
  "GET /api/v1/diseases",
  "GET /api/v1/map-data?disease=malaria&year=2024&layer=incidence",
  "GET /api/v1/trends?disease=malaria&country=UGA&indicator=cases",
  "GET /api/v1/countries/UGA",
  "GET /api/v1/forecast?disease=malaria&country=UGA&indicator=cases&horizon=12m",
  "GET /api/v1/insights?disease=malaria",
  "GET /api/v1/methodology"
];

export default function ApiPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
      <SectionTitle
        eyebrow="API and data access"
        title="Read-only platform outputs for downstream use."
        description="AfricWatch exposes clean backend endpoints for maps, country profiles, trends, forecasts, and methodology so the frontend and external institutional consumers can share the same disease intelligence layer."
      />
      <div className="mt-10 rounded-[2rem] border border-white/10 bg-card/80 p-6 shadow-panel">
        <ul className="space-y-3 text-sm text-muted">
          {endpoints.map((endpoint) => (
            <li key={endpoint} className="rounded-2xl border border-white/10 bg-surface/75 px-4 py-3 font-mono text-xs text-accentSoft">
              {endpoint}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
