import type { Metadata } from "next";
import Link from "next/link";
import { STATES, effectiveMinWage } from "@/lib/states";
import { dollars } from "@/lib/federal";

export const revalidate = 604800; // weekly ISR

export const metadata: Metadata = {
  title: "Minimum Wage & Labor Law by State (2026)",
  description: "2026 minimum wage, overtime rules and final-paycheck deadlines for all 50 states and DC. Pick your state for tipped wages, breaks and a pre-loaded pay calculator.",
  alternates: { canonical: "/states" },
};

export default function StatesIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Minimum Wage & Labor Law by State</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        The 2026 minimum wage, overtime rule and final-paycheck deadline for every state and DC. Open a
        state for its tipped wage, meal/rest breaks, sources and a pay calculator pre-loaded to that state.
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[34rem] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2">2026 min wage</th>
              <th className="px-4 py-2">Overtime</th>
              <th className="px-4 py-2">Final pay (fired)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {STATES.map((s) => (
              <tr key={s.slug} className="hover:bg-emerald-50">
                <td className="px-4 py-2">
                  <Link href={`/states/${s.slug}`} className="font-medium text-emerald-700 hover:underline">{s.name}</Link>
                  {s.minWage <= 7.25 && <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">federal</span>}
                  {!s.tipCreditAllowed && <span className="ml-2 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">no tip credit</span>}
                </td>
                <td className="px-4 py-2 font-semibold text-slate-900 tabular-nums">{dollars(effectiveMinWage(s))}</td>
                <td className="px-4 py-2 text-slate-600">{s.dailyOt ? `Daily >${s.dailyOt.afterHours}h + 40/wk` : "Over 40/wk"}</td>
                <td className="px-4 py-2 text-slate-500">{s.finalPayFired}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
