import type { Metadata } from "next";
import CheckoutButton from "@/components/CheckoutButton";

export const revalidate = 604800; // weekly ISR

export const metadata: Metadata = {
  title: "Pro — Multi-State Wage Compliance Report",
  description: "A printable multi-state wage & hour compliance report: minimum wage, overtime, tipped pay, final-paycheck deadlines and break rules for every state your team works in. $19 one-time.",
  alternates: { canonical: "/pricing" },
};

const FREE = [
  "Every overtime, minimum-wage and paycheck calculator",
  "2026 minimum & tipped wage for all 50 states + DC",
  "State daily-overtime and double-time rules",
  "Final-paycheck deadlines and break rules",
  "Shareable result links",
];
const PRO = [
  "Everything in the free tools",
  "Multi-state compliance report PDF for your whole team",
  "Minimum wage, overtime, tipped, final-pay & breaks per state, side by side",
  "Cited sources and effective dates for each rule",
  "Branded summary for HR / payroll review",
];

export default function Pricing() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Simple pricing</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Every calculator is free forever. When you manage a team across several states, the Pro report
        compiles the wage and hour rules for every state your people work in into one printable PDF.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold text-slate-500">Free</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">$0</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {FREE.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-emerald-600">✓</span>{f}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-emerald-300 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-emerald-700">Pro report</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">$19<span className="text-base font-medium text-slate-500"> one-time</span></div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {PRO.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-emerald-600">✓</span>{f}</li>
            ))}
          </ul>
          <div className="mt-5"><CheckoutButton /></div>
          <p className="mt-3 text-xs text-slate-500">
            WageCalc HQ is general information, not legal or tax advice. Wage law has local exceptions and
            changes often — confirm with your state labor department or counsel before payroll decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
