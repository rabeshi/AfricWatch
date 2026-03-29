"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DiseaseSlug } from "@/lib/types";

export function DiseaseDashboardControls({ disease }: { disease: DiseaseSlug }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateDisease(nextDisease: DiseaseSlug) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("disease", nextDisease);
    router.push(`/disease?${params.toString()}`);
  }

  return (
    <div className="inline-flex rounded-[2rem] border border-ink/10 bg-card/75 p-2">
      <div className="flex gap-2">
        {[
          { value: "malaria" as const, label: "Malaria" },
          { value: "hpv" as const, label: "HPV" }
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => updateDisease(option.value)}
            className={`rounded-full px-4 py-3 text-sm transition ${
              disease === option.value ? "bg-accent text-bg" : "text-muted hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
