import type { Metadata } from "next";
import Link from "next/link";
import BackPayCalculator from "@/components/BackPayCalculator";
import { STATES } from "@/lib/states";
import { SITE } from "@/lib/site";
import { Eyebrow, SectionHeading, MoreLink } from "@/components/primitives";

export const revalidate = 604800; // weekly ISR

export const metadata: Metadata = {
  title: "Unpaid Wages & Back Pay — Am I Owed? How to File a Claim",
  description: "Estimate the unpaid overtime or wages you're owed, see how far back you can recover under the FLSA, and find out how to file a wage claim in your state. Free, no account.",
  alternates: { canonical: "/wage-claim" },
};

export default function WageClaimIndex() {
  return (
    <div>
      <Eyebrow>Unpaid wages</Eyebrow>
      <div className="mt-3">
        <SectionHeading
          as="h1"
          title="Think you're owed unpaid wages?"
          sub="If you worked overtime for straight-time pay, clocked unpaid hours, or earned below the minimum wage, you may be owed back pay. Estimate it below, then see exactly how to file a wage claim in your state."
        />
      </div>

      <div className="mt-8">
        <BackPayCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-ink">How to file a wage claim in your state</h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          Each guide lists the agency that handles wage claims, the official filing route, the federal back-pay window,
          and the extra penalties your state may allow on top.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {STATES.map((s) => (
            <Link key={s.slug} href={`/wage-claim/${s.slug}`}
              className="rounded-xl border border-line bg-card px-4 py-3 text-sm font-medium text-ink shadow-sm transition hover:border-brand-300 hover:bg-brand-50">
              {s.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-line bg-card p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-ink">Not sure it&apos;s worth it?</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          A free case review from an employment attorney can tell you whether your claim is worth pursuing. Most wage
          cases are taken on contingency — no upfront cost.
        </p>
        <div className="mt-3"><MoreLink href="/free-case-review">Get a free case review</MoreLink></div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Unpaid wages", item: `${SITE.url}/wage-claim` },
        ],
      }) }} />
    </div>
  );
}
