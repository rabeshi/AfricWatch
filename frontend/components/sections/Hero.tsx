import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[length:28px_28px] opacity-20" />
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-14 lg:px-8 lg:pb-16 lg:pt-20">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-accentSoft">
              Africa-focused disease intelligence
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-ink lg:text-7xl">
              A Pan-African Disease Intelligence Platform
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              AfricWatch translates WHO Global Health Observatory disease indicators into map-based intelligence, country forecasts, risk scoring, and policy-facing recommendations.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-card/70 p-6 shadow-panel">
            <div className="text-sm uppercase tracking-[0.26em] text-accentSoft">Phase 1 module</div>
            <div className="mt-3 text-3xl font-semibold">Malaria + HPV</div>
            <p className="mt-4 text-sm leading-7 text-muted">
              The platform now supports switching between malaria and HPV views while keeping the architecture ready for broader disease expansion across Africa.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/disease" className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-bg transition hover:bg-accentSoft">
                Open disease dashboard
              </Link>
              <Link href="/forecast" className="rounded-full border border-white/15 px-5 py-3 text-sm text-ink transition hover:border-accent">
                View forecast center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
