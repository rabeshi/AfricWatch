import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function PublicationsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
      <SectionTitle
        eyebrow="Publications"
        title="Research and supporting literature"
        description="This section highlights relevant scientific work that strengthens the public-health and forecasting context around the platform."
      />
      <article className="mt-10 rounded-[2rem] border border-ink/10 bg-card/80 p-6 shadow-panel">
        <div className="text-xs uppercase tracking-[0.3em] text-accentSoft">Featured publication</div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
          Time series modeling of monkeypox incidence in central africa&apos;s endemic regions
        </h2>
        <div className="mt-4 text-sm leading-7 text-muted">
          Authors: Chidozie Williams Chukwu, George Obaido, Ibomoiye Domor Mienye, Kehinde Aruleba,
          Ebenezer Esenogho, Cameron Modisane
        </div>
        <Link
          href="https://www.sciencedirect.com/science/article/pii/S2666827025001616"
          className="mt-6 inline-block text-sm text-accentSoft"
          target="_blank"
          rel="noreferrer"
        >
          Open publication
        </Link>
      </article>
    </div>
  );
}
