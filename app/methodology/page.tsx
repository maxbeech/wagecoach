import type { Metadata } from "next";
import { FEDERAL, dollars } from "@/lib/federal";
import { STATES } from "@/lib/states";
import { Eyebrow, SectionHeading } from "@/components/primitives";

export const revalidate = 604800; // weekly ISR

export const metadata: Metadata = {
  title: "Methodology & Sources: How WageCalc HQ Computes Pay",
  description: "The exact FLSA rules, 2026 state wage data and sources WageCalc HQ uses for its overtime, minimum-wage and paycheck calculators. Transparent and cited.",
  alternates: { canonical: "/methodology" },
};

const noTipCredit = STATES.filter((s) => !s.tipCreditAllowed).map((s) => s.name).join(", ");
const dailyOt = STATES.filter((s) => s.dailyOt).map((s) => s.name).join(", ");

export default function Methodology() {
  return (
    <div className="max-w-none">
      <Eyebrow>Methodology</Eyebrow>
      <div className="mt-3">
        <SectionHeading
          as="h1"
          title="Methodology & Sources"
          sub={
            <>
              WageCalc HQ implements the federal <strong>Fair Labor Standards Act (FLSA)</strong> and each
              state&apos;s 2026 wage and hour rules. This page is the single source of truth for the numbers the
              calculators use, with every source cited. It is general information, not legal advice.
            </>
          }
        />
      </div>

      <section className="mt-8 text-sm text-muted">
        <h2 className="font-display text-lg font-semibold text-ink">Federal constants (FLSA)</h2>
        <div className="mt-2 overflow-hidden rounded-xl border border-line bg-card">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-line">
              <tr><td className="px-4 py-2 text-muted">Federal minimum wage</td><td className="px-4 py-2 font-mono font-semibold tabular-nums text-ink">{dollars(FEDERAL.minWage)}/hr (since 2009)</td></tr>
              <tr><td className="px-4 py-2 text-muted">Tipped cash wage / max tip credit</td><td className="px-4 py-2 font-mono font-semibold tabular-nums text-ink">{dollars(FEDERAL.tippedCashWage)} / {dollars(FEDERAL.maxTipCredit)}</td></tr>
              <tr><td className="px-4 py-2 text-muted">Overtime</td><td className="px-4 py-2 font-semibold text-ink">1.5× over 40 hrs/workweek</td></tr>
              <tr><td className="px-4 py-2 text-muted">Exempt salary threshold</td><td className="px-4 py-2 font-semibold text-ink"><span className="font-mono tabular-nums">$684</span>/week = <span className="font-mono tabular-nums">{dollars(FEDERAL.exemptAnnualSalary)}</span>/yr</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-faint">
          The 2024 rule raising the exempt threshold was vacated nationwide on Nov 15, 2024 (Texas v. DOL),
          reverting to the $684/week (2019) level. The salary test is paired with a duties test.
        </p>
      </section>

      <section className="mt-8 text-sm text-muted">
        <h2 className="font-display text-lg font-semibold text-ink">How overtime is computed</h2>
        <p className="mt-2">
          Regular hours up to 40 in a workweek are paid at the regular rate; hours over 40 at 1.5× (or 2×
          for the double-time preset). For daily-overtime states we compute per-day overtime and reconcile
          with the weekly 40-hour rule without pyramiding (hours already paid as daily overtime are not
          counted again toward the 40).
        </p>
        <ul className="mt-2 space-y-1.5">
          <li><strong className="text-ink">Daily overtime states:</strong> {dailyOt}. California also has double time (over 12 hrs/day and beyond 8 on a 7th consecutive workday).</li>
          <li><strong className="text-ink">No-tip-credit states</strong> (full minimum wage paid in cash before tips): {noTipCredit}.</li>
        </ul>
      </section>

      <section className="mt-8 text-sm text-muted">
        <h2 className="font-display text-lg font-semibold text-ink">State data &amp; sources</h2>
        <p className="mt-2">
          2026 state minimum and tipped wages are cross-checked across the U.S. Department of Labor and
          reputable payroll/compliance trackers (GovDocs, Paycom, Paycor, Ogletree). Final-paycheck
          deadlines and meal/rest-break rules are compiled from state labor-department (.gov) pages and
          cross-referenced with Rippling, Patriot Software and the TimeClick break-law guide. Each
          state page links the figures back to these sources.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li><a className="text-brand-700 underline hover:text-brand-800" href="https://www.dol.gov/agencies/whd/minimum-wage" target="_blank" rel="noopener noreferrer">U.S. DOL: Minimum Wage</a></li>
          <li><a className="text-brand-700 underline hover:text-brand-800" href="https://www.dol.gov/agencies/whd/overtime" target="_blank" rel="noopener noreferrer">U.S. DOL: Overtime Pay (FLSA)</a></li>
          <li><a className="text-brand-700 underline hover:text-brand-800" href="https://www.govdocs.com/state-minimum-wage-rates/" target="_blank" rel="noopener noreferrer">GovDocs: 2026 State Minimum Wage Rates</a></li>
        </ul>
      </section>

      <section className="mt-8 text-sm text-muted">
        <h2 className="font-display text-lg font-semibold text-ink">What this tool does not do</h2>
        <p className="mt-2">
          It does not calculate income-tax withholding or net (take-home) pay, and it does not replace
          legal advice. Local ordinances (many cities set higher minimums), industry-specific rules, union
          contracts and individual circumstances can change the result. Always confirm with your state
          labor department or an employment-law professional before a payroll or legal decision.
        </p>
      </section>
    </div>
  );
}
