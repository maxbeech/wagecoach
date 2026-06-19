import type { Metadata } from "next";
import Link from "next/link";
import { STATES, effectiveMinWage } from "@/lib/states";
import { dollars } from "@/lib/federal";
import { Eyebrow, SectionHeading } from "@/components/primitives";

export const revalidate = 604800; // weekly ISR

export const metadata: Metadata = {
  title: "Minimum Wage & Labor Law by State (2026)",
  description: "2026 minimum wage, overtime rules and final-paycheck deadlines for all 50 states and DC. Pick your state for tipped wages, breaks and a pre-loaded pay calculator.",
  alternates: { canonical: "/states" },
};

export default function StatesIndex() {
  return (
    <div>
      <Eyebrow>By state</Eyebrow>
      <div className="mt-3">
        <SectionHeading
          as="h1"
          title="Minimum Wage & Labor Law by State"
          sub="The 2026 minimum wage, overtime rule and final-paycheck deadline for every state and DC. Open a state for its tipped wage, meal and rest breaks, sources and a pay calculator pre-loaded to that state."
        />
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[34rem] text-sm">
          <thead className="bg-brand-50/40 text-left text-xs uppercase tracking-wide text-faint">
            <tr>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2">2026 min wage</th>
              <th className="px-4 py-2">Overtime</th>
              <th className="px-4 py-2">Final pay (fired)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-card">
            {STATES.map((s) => (
              <tr key={s.slug} className="hover:bg-brand-50/40">
                <td className="px-4 py-2">
                  <Link href={`/states/${s.slug}`} className="font-medium text-brand-700 hover:underline">{s.name}</Link>
                  {s.minWage <= 7.25 && <span className="ml-2 rounded border border-line bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-700">federal</span>}
                  {!s.tipCreditAllowed && <span className="ml-2 rounded border border-line bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-700">no tip credit</span>}
                </td>
                <td className="px-4 py-2 font-mono font-semibold tabular-nums text-ink">{dollars(effectiveMinWage(s))}</td>
                <td className="px-4 py-2 text-muted">{s.dailyOt ? `Daily >${s.dailyOt.afterHours}h + 40/wk` : "Over 40/wk"}</td>
                <td className="px-4 py-2 text-muted">{s.finalPayFired}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
