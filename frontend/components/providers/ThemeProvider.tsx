"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type ThemeName = "black" | "white" | "green";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("green");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("africwatch-theme") as ThemeName | null;
    const nextTheme = savedTheme ?? "green";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  const updateTheme = (nextTheme: ThemeName) => {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("africwatch-theme", nextTheme);
  };

  return <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
