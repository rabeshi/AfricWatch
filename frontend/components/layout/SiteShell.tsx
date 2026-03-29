import Link from "next/link";
import { ReactNode } from "react";
import { AfricWatchLogo } from "@/components/layout/AfricWatchLogo";
import { FooterPicker } from "@/components/ui/FooterPicker";

const navItems = [
  { href: "/disease", label: "Disease Dashboard" },
  { href: "/forecast", label: "Forecast Center" },
  { href: "/publications", label: "Publications" },
  { href: "/methodology", label: "Methodology" },
  { href: "/api", label: "API / Data Access" }
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <AfricWatchLogo />
          <nav className="hidden gap-6 text-sm text-muted lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-ink/10 bg-surface/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_auto] lg:items-start lg:px-8">
          <div>
            <div className="text-2xl font-semibold tracking-tight">Menu</div>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-ink">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="inline-flex rounded-full border border-ink/10 bg-card/65 px-3 py-2 lg:justify-self-end">
            <FooterPicker />
          </div>
        </div>
      </footer>
    </div>
  );
}
