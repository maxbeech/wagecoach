import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PayCalculator from "@/components/PayCalculator";
import SalaryConverter from "@/components/SalaryConverter";
import StateWageLookup from "@/components/StateWageLookup";
import TippedWageCalculator from "@/components/TippedWageCalculator";
import ExemptChecker from "@/components/ExemptChecker";
import PtoPayoutCalculator from "@/components/PtoPayoutCalculator";
import BackPayCalculator from "@/components/BackPayCalculator";
import Faq from "@/components/Faq";
import { CALCULATORS, getCalc, type CalcDef } from "@/lib/calculators";
import { SITE } from "@/lib/site";
import { Eyebrow, SectionHeading, Chip, LedgerTick } from "@/components/primitives";

export const revalidate = 604800; // weekly ISR

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
    case "salary": return <SalaryConverter />;
    case "minwage": return <StateWageLookup focus="minwage" />;
    case "finalpay": return <StateWageLookup focus="finalpay" />;
    case "tipped": return <TippedWageCalculator />;
    case "exempt": return <ExemptChecker />;
    case "pto": return <PtoPayoutCalculator />;
    case "backpay": return <BackPayCalculator />;
  }
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCalc(slug);
  if (!c) notFound();

  return (
    <div>
      <nav className="mb-4 text-sm text-faint">
        <Link href="/calculators" className="hover:text-ink">Calculators</Link>
        <span className="mx-1.5">/</span><span className="text-muted">{c.name}</span>
      </nav>

      <Eyebrow>Calculators</Eyebrow>
      <div className="mt-3">
        <SectionHeading as="h1" title={c.h1} sub={c.intro} />
      </div>
      <p className="mt-2 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
        {c.focus}
      </p>

      <div className="mt-6"><Tool c={c} /></div>

      <section className="mt-8 rounded-2xl border border-line bg-card p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-ink">Notes</h2>
        <ul className="mt-2 space-y-1.5">
          {c.notes.map((n, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted">
              <LedgerTick />{n}
            </li>
          ))}
        </ul>
      </section>

      <Faq items={c.faqs} />

      <section className="mt-10">
        <h2 className="font-display text-sm font-semibold text-ink">Other calculators</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {CALCULATORS.filter((x) => x.slug !== c.slug).map((x) => (
            <Chip key={x.slug} href={`/calculators/${x.slug}`}>{x.name}</Chip>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: c.h1, applicationCategory: "BusinessApplication", operatingSystem: "Web",
        description: c.meta, url: `${SITE.url}/calculators/${c.slug}`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Calculators", item: `${SITE.url}/calculators` },
          { "@type": "ListItem", position: 2, name: c.name, item: `${SITE.url}/calculators/${c.slug}` },
        ],
      }) }} />
    </div>
  );
}
