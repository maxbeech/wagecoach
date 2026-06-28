import type { Metadata } from "next";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import { Eyebrow, SectionHeading } from "@/components/primitives";

export const revalidate = 604800; // weekly ISR

export const metadata: Metadata = {
  title: "Pricing — Wage Claim Kit & Multi-State Compliance Report",
  description: "Every calculator is free. Workers: a $29 Claim Kit to recover unpaid wages. Employers: a $19 multi-state wage & hour compliance report.",
  alternates: { canonical: "/pricing" },
};

const FREE = [
  "Every overtime, minimum-wage and paycheck calculator",
  "Back-pay estimator with case-strength signal",
  "2026 minimum and tipped wage for all 50 states plus DC",
  "How to file a wage claim in every state",
  "Shareable result and case links",
];
const KIT = [
  "Your back-pay estimate, itemized and explained",
  "A demand letter pre-filled with your figures",
  "Your state's wage-claim agency and filing route",
  "Step-by-step complaint guide and deadlines",
  "Printable PDF — yours to send or take to a lawyer",
];
const PRO = [
  "Multi-state compliance report PDF for your whole team",
  "Minimum wage, overtime, tipped, final-pay and breaks per state",
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
        <SectionHeading as="h1" title="Simple pricing" sub="Every calculator is free forever. If you're a worker chasing unpaid wages, the Claim Kit turns your estimate into something you can act on. If you run payroll across several states, the Pro report compiles every state's rules into one printable PDF." />
      </div>

      <div className="mt-8 grid items-start gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-line bg-card p-7 shadow-card">
          <div className="text-sm font-semibold uppercase tracking-wide text-faint">Free</div>
          <div className="mt-2 font-display text-4xl font-semibold text-ink">$0</div>
          <p className="mt-1 text-sm text-muted">Forever. No account.</p>
          <ul className="mt-5 space-y-2.5 text-sm text-muted">
            {FREE.map((f) => <li key={f} className="flex gap-2.5"><Check />{f}</li>)}
          </ul>
        </div>

        <div className="relative rounded-3xl border border-brand-300 bg-card p-7 shadow-float ring-1 ring-brand-100">
          <span className="absolute -top-3 right-7 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-white">For workers</span>
          <div className="text-sm font-semibold uppercase tracking-wide text-brand-700">Claim Kit</div>
          <div className="mt-2 font-display text-4xl font-semibold text-ink">$29<span className="font-sans text-base font-medium text-faint"> one-time</span></div>
          <p className="mt-1 text-sm text-muted">Everything you need to claim back pay.</p>
          <ul className="mt-5 space-y-2.5 text-sm text-muted">
            {KIT.map((f) => <li key={f} className="flex gap-2.5"><Check />{f}</li>)}
          </ul>
          <div className="mt-6"><CheckoutButton product="kit" /></div>
          <p className="mt-3 text-xs leading-relaxed text-faint">
            Start free with the <Link href="/wage-claim" className="text-brand-700 underline decoration-brand-300 underline-offset-2">back-pay estimator</Link>. The kit is self-help information, not legal advice.
          </p>
        </div>

        <div className="rounded-3xl border border-line bg-card p-7 shadow-card">
          <div className="text-sm font-semibold uppercase tracking-wide text-faint">Pro report</div>
          <div className="mt-2 font-display text-4xl font-semibold text-ink">$19<span className="font-sans text-base font-medium text-faint"> one-time</span></div>
          <p className="mt-1 text-sm text-muted">For employers running multi-state payroll.</p>
          <ul className="mt-5 space-y-2.5 text-sm text-muted">
            {PRO.map((f) => <li key={f} className="flex gap-2.5"><Check />{f}</li>)}
          </ul>
          <div className="mt-6"><CheckoutButton /></div>
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-xs leading-relaxed text-faint">
        WageCoach is general information, not legal or tax advice, and is not a law firm. Wage law has local
        exceptions and strict deadlines, so confirm with your state labor department or an attorney before acting.
      </p>
    </div>
  );
}
