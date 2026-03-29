"use client";

import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export function FooterPicker() {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="text-[10px] uppercase tracking-[0.24em] text-accentSoft">Switch colors</div>
      <div className="inline-block">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
