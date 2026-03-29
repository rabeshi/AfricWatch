import Link from "next/link";

export function AfricWatchLogo() {
  return (
    <Link href="/" className="mt-2 inline-flex items-center gap-3">
      <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-accent/35 bg-card shadow-panel">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_35%),linear-gradient(160deg,rgba(90,188,122,0.95),rgba(16,56,36,0.95))]" />
        <span className="absolute h-5 w-5 rounded-full border border-white/50 bg-white/10" />
        <span className="absolute h-3 w-3 rounded-full bg-accentSoft" />
        <span className="absolute bottom-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-sand/90" />
      </span>
      <span>
        <span className="block text-[1.65rem] font-semibold leading-none tracking-tight text-ink">AfricWatch</span>
        <span className="mt-1 block text-[10px] uppercase tracking-[0.34em] text-accentSoft">Disease Intelligence</span>
      </span>
    </Link>
  );
}
