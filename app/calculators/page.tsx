import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";

export const revalidate = 604800; // weekly ISR

export const metadata: Metadata = {
  title: "Wage & Hour Calculators",
  description: "Free U.S. wage and hour calculators: overtime, time and a half, double time, minimum wage by state, tipped wage, exempt-salary, PTO payout and final-paycheck deadlines.",
  alternates: { canonical: "/calculators" },
};

export default function CalculatorsIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Wage & Hour Calculators</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Free calculators built on the federal FLSA and 2026 state rules — overtime and pay, minimum and
        tipped wage, exempt status, PTO payout and final-paycheck deadlines. No sign-up.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CALCULATORS.map((c) => (
          <Link key={c.slug} href={`/calculators/${c.slug}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-emerald-300 hover:bg-emerald-50">
            <div className="font-semibold text-slate-900">{c.name}</div>
            <p className="mt-1 text-sm text-slate-600">{c.focus}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
