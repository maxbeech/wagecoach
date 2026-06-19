import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";
import { Eyebrow, SectionHeading } from "@/components/primitives";

export const revalidate = 604800; // weekly ISR

export const metadata: Metadata = {
  title: "Wage & Hour Calculators",
  description: "Free U.S. wage and hour calculators: overtime, time and a half, double time, minimum wage by state, tipped wage, exempt-salary, PTO payout and final-paycheck deadlines.",
  alternates: { canonical: "/calculators" },
};

export default function CalculatorsIndex() {
  return (
    <div>
      <Eyebrow>Calculators</Eyebrow>
      <div className="mt-3">
        <SectionHeading
          as="h1"
          title="Wage & Hour Calculators"
          sub="Free calculators built on the federal FLSA and 2026 state rules. Cover overtime and pay, minimum and tipped wage, exempt status, PTO payout and final-paycheck deadlines. No sign-up."
        />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CALCULATORS.map((c) => (
          <Link key={c.slug} href={`/calculators/${c.slug}`}
            className="rounded-2xl border border-line bg-card p-4 shadow-card transition-colors hover:border-brand-300 hover:bg-brand-50">
            <div className="font-semibold text-ink">{c.name}</div>
            <p className="mt-1 text-sm text-muted">{c.focus}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
