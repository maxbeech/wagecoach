import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PayCalculator from "@/components/PayCalculator";
import StateWageLookup from "@/components/StateWageLookup";
import TippedWageCalculator from "@/components/TippedWageCalculator";
import ExemptChecker from "@/components/ExemptChecker";
import PtoPayoutCalculator from "@/components/PtoPayoutCalculator";
import Faq from "@/components/Faq";
import { CALCULATORS, getCalc, type CalcDef } from "@/lib/calculators";

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCalc(slug);
  if (!c) return {};
  return { title: c.h1, description: c.meta, alternates: { canonical: `/calculators/${c.slug}` } };
}

function Tool({ c }: { c: CalcDef }) {
  switch (c.tool) {
    case "pay": return <PayCalculator seed={c.seed} />;
    case "minwage": return <StateWageLookup focus="minwage" />;
    case "finalpay": return <StateWageLookup focus="finalpay" />;
    case "tipped": return <TippedWageCalculator />;
    case "exempt": return <ExemptChecker />;
    case "pto": return <PtoPayoutCalculator />;
  }
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCalc(slug);
  if (!c) notFound();

  return (
    <div>
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/calculators" className="hover:text-slate-900">Calculators</Link>
        <span className="mx-1.5">/</span><span className="text-slate-700">{c.name}</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{c.h1}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{c.intro}</p>
      <p className="mt-2 inline-block rounded-lg bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
        {c.focus}
      </p>

      <div className="mt-6"><Tool c={c} /></div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Notes</h2>
        <ul className="mt-2 space-y-1.5">
          {c.notes.map((n, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />{n}
            </li>
          ))}
        </ul>
      </section>

      <Faq items={c.faqs} />

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-slate-900">Other calculators</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {CALCULATORS.filter((x) => x.slug !== c.slug).map((x) => (
            <Link key={x.slug} href={`/calculators/${x.slug}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-emerald-300 hover:text-slate-900">
              {x.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
