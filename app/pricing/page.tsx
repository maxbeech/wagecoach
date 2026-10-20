import type { Metadata } from "next";
import Link from "next/link";
import PlanCard from "@/components/PlanCard";
import { Eyebrow, SectionHeading } from "@/components/primitives";
import { SITE } from "@/lib/site";
import { safeJsonLd } from "@/lib/json-ld";
import { WATCH_FEATURES } from "@/lib/watch-copy";
import { WATCH_PLANS } from "@/lib/watch-plan";

export const revalidate = 604800; // weekly ISR

export const metadata: Metadata = {
  title: "Pricing: Free Calculators, Claim Kit and Wage Watch",
  description: "Every calculator is free. Workers: a $29 Claim Kit to recover unpaid wages. Employers: minimum wage change alerts, free for one place or $9 a month for up to 10.",
  alternates: { canonical: "/pricing" },
};

const FREE = [
  "Every overtime, minimum-wage, paycheck and time card calculator",
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
  "Printable, and yours to send or take to a lawyer",
];

const link = "rounded-full px-6 py-3 text-center text-sm font-semibold transition block";

export default function Pricing() {
  const watch = WATCH_PLANS.watch;
  return (
    <div>
      <Eyebrow>Pricing</Eyebrow>
      <div className="mt-3">
        <SectionHeading as="h1" title="Simple pricing" sub="Every calculator is free. If you're owed wages, the Claim Kit turns your estimate into a letter and a filing plan. If you employ people in more than one place, Wage Watch tells you before the minimum wage changes." />
      </div>

      <div className="mt-8 grid items-stretch gap-5 md:grid-cols-3">
        <PlanCard name="Free" price="$0" blurb="Forever. No account." features={FREE}>
          <p className="mb-3 text-xs leading-relaxed text-faint">No signup. Results stay in the link.</p>
          <Link href="/calculators" className={`${link} border border-line text-ink hover:border-brand-300`}>Open the calculators</Link>
        </PlanCard>
        <PlanCard name="Claim Kit" price="$29" unit="one-time" badge="For workers" featured blurb="Everything you need to claim back pay." features={KIT}>
          <p className="mb-3 text-xs leading-relaxed text-faint">Built from your estimate, so it starts there. Self-help information, not legal advice.</p>
          <Link href="/wage-claim" className={`${link} bg-forest text-white hover:bg-brand-800`}>Start with your estimate</Link>
        </PlanCard>
        <PlanCard name={watch.name} price={`$${watch.priceUsd}`} unit="a month" badge="For employers" blurb={`Rate-change alerts for up to ${watch.maxLocations} places. Free for one.`} features={WATCH_FEATURES.watch}>
          <p className="mb-3 text-xs leading-relaxed text-faint">Start with one place free, then upgrade from your settings.</p>
          <Link href="/wage-watch" className={`${link} border border-line text-ink hover:border-brand-300`}>Get Wage Watch</Link>
        </PlanCard>
      </div>

      <p className="mt-6 max-w-2xl text-xs leading-relaxed text-faint">
        WageCoach is general information, not legal or tax advice, and is not a law firm. Wage law has local
        exceptions and strict deadlines, so confirm with your state labor department or an attorney before acting.
      </p>

      {/* Machine-readable pricing, kept in lockstep with the tiers rendered above. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: SITE.name, applicationCategory: "BusinessApplication", operatingSystem: "Web",
        description: SITE.description, url: `${SITE.url}/pricing`,
        offers: [
          { "@type": "Offer", name: "Free calculators & back-pay estimator", price: "0", priceCurrency: "USD", description: "Every overtime, minimum-wage, paycheck and time card calculator, plus the back-pay estimator. No account." },
          { "@type": "Offer", name: "Claim Kit", price: "29", priceCurrency: "USD", description: "A demand letter pre-filled with your figures, your state's wage-claim agency and filing route, and a step-by-step complaint guide." },
          { "@type": "Offer", name: watch.name, price: String(watch.priceUsd), priceCurrency: "USD", description: `Minimum wage change alerts for up to ${watch.maxLocations} states and cities, with a printable compliance sheet.`,
            priceSpecification: { "@type": "UnitPriceSpecification", price: String(watch.priceUsd), priceCurrency: "USD", billingDuration: "P1M" } },
        ],
      }) }} />
    </div>
  );
}
