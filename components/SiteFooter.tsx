import Link from "next/link";
import { LogoMark } from "./Logo";
import { SITE } from "@/lib/site";

const COLS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Calculators",
    links: [
      { href: "/calculators/overtime-calculator", label: "Overtime pay" },
      { href: "/calculators/time-and-a-half-calculator", label: "Time and a half" },
      { href: "/calculators/salary-to-hourly-calculator", label: "Salary to hourly" },
      { href: "/calculators/tipped-wage-calculator", label: "Tipped wage" },
      { href: "/calculators/pto-payout-calculator", label: "PTO payout" },
    ],
  },
  {
    heading: "Look up",
    links: [
      { href: "/calculators/minimum-wage-calculator", label: "Minimum wage by state" },
      { href: "/calculators/final-paycheck-calculator", label: "Final paycheck deadlines" },
      { href: "/states", label: "All states" },
      { href: "/cities", label: "City minimum wages" },
    ],
  },
  {
    heading: "More",
    links: [
      { href: "/blog", label: "Guides" },
      { href: "/methodology", label: "Methodology & sources" },
      { href: "/pricing", label: "Pro report" },
    ],
  },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-line bg-paper print:hidden">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:pr-6">
            <div className="flex items-center gap-2.5">
              <LogoMark size={26} />
              <span className="font-display text-base font-semibold text-ink">WageCalc HQ</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Free, sourced wage and hour calculators built on the federal FLSA and current state rules.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.heading}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-faint">{col.heading}</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-muted transition-colors hover:text-brand-700">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-faint">
          <p className="max-w-3xl">
            {SITE.name} offers general information, not legal or tax advice. Wage law changes often and has
            local exceptions, so confirm any figure with your state labor department before you rely on it.
          </p>
          <p className="mt-3">© {year} {SITE.name}. Built for workers and small employers in the United States.</p>
        </div>
      </div>
    </footer>
  );
}
