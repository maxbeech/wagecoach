import type { Metadata } from "next";
import CheckoutButton from "@/components/CheckoutButton";
import { Eyebrow, SectionHeading } from "@/components/primitives";

export const revalidate = 604800; // weekly ISR

export const metadata: Metadata = {
  title: "Pro: Multi-State Wage Compliance Report",
  description: "A printable multi-state wage & hour compliance report: minimum wage, overtime, tipped pay, final-paycheck deadlines and break rules for every state your team works in. $19 one-time.",
  alternates: { canonical: "/pricing" },
};

const FREE = [
  "Every overtime, minimum-wage and paycheck calculator",
  "2026 minimum and tipped wage for all 50 states plus DC",
  "State daily-overtime and double-time rules",
  "Final-paycheck deadlines and break rules",
  "Shareable result links",
];
const PRO = [
  "Everything in the free tools",
  "Multi-state compliance report PDF for your whole team",
  "Minimum wage, overtime, tipped, final-pay and breaks per state, side by side",
  "Cited sources and effective dates for each rule",
  "Branded summary for HR and payroll review",
];

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="#d2e9df" />
      <path d="M4.5 8.2l2.3 2.3 4.7-4.8" stroke="#0d543f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Pricing() {
  return (
    <div>
      <Eyebrow>Pricing</Eyebrow>
      <div className="mt-3">
        <SectionHeading as="h1" title="Simple pricing" sub="Every calculator is free forever. When you run payroll across several states, the Pro report compiles the wage and hour rules for every state your people work in into one printable PDF." />
      </div>

      <div className="mt-8 grid items-start gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-line bg-card p-7 shadow-card">
          <div className="text-sm font-semibold uppercase tracking-wide text-faint">Free</div>
          <div className="mt-2 font-display text-4xl font-semibold text-ink">$0</div>
          <p className="mt-1 text-sm text-muted">Forever. No account.</p>
          <ul className="mt-5 space-y-2.5 text-sm text-muted">
            {FREE.map((f) => <li key={f} className="flex gap-2.5"><Check />{f}</li>)}
          </ul>
        </div>

        <div className="relative rounded-3xl border border-brand-300 bg-card p-7 shadow-float ring-1 ring-brand-100">
          <span className="absolute -top-3 right-7 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-white">For teams</span>
          <div className="text-sm font-semibold uppercase tracking-wide text-brand-700">Pro report</div>
          <div className="mt-2 font-display text-4xl font-semibold text-ink">$19<span className="font-sans text-base font-medium text-faint"> one-time</span></div>
          <p className="mt-1 text-sm text-muted">One report, no subscription.</p>
          <ul className="mt-5 space-y-2.5 text-sm text-muted">
            {PRO.map((f) => <li key={f} className="flex gap-2.5"><Check />{f}</li>)}
          </ul>
          <div className="mt-6"><CheckoutButton /></div>
          <p className="mt-3 text-xs leading-relaxed text-faint">
            WageCalc HQ is general information, not legal or tax advice. Wage law has local exceptions and
            changes often, so confirm with your state labor department or counsel before payroll decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
