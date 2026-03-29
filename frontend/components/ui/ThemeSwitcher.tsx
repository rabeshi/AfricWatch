"use client";

import { ThemeName, useTheme } from "@/components/providers/ThemeProvider";

const options: ThemeName[] = ["black", "white", "green"];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-card/50 p-0.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setTheme(option)}
          aria-label={`Switch to ${option} theme`}
          title={option}
          className={`h-4 w-4 rounded-full border transition ${
            theme === option ? "scale-110 border-accentSoft ring-2 ring-accentSoft/40" : "border-ink/15 hover:scale-105"
          }`}
          style={{
            background:
              option === "black"
                ? "linear-gradient(135deg, #0b1220 0%, #2a3443 100%)"
                : option === "white"
                  ? "linear-gradient(135deg, #ffffff 0%, #dfe9e3 100%)"
                  : "linear-gradient(135deg, #163b26 0%, #5abc7a 100%)"
          }}
        />
      ))}
    </div>
  );
}
