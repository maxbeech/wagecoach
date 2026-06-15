import Link from "next/link";
import PayCalculator from "@/components/PayCalculator";
import Faq from "@/components/Faq";
import { HOME_FAQS } from "@/lib/faq";
import { CALCULATORS } from "@/lib/calculators";
import { STATES } from "@/lib/states";
import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <div>
      <section className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Overtime & Time-and-a-Half Pay Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Enter your hourly rate and hours worked to see your regular pay, overtime at time-and-a-half,
          and total gross — with the federal 40-hour rule and your state&apos;s daily-overtime and
          minimum-wage rules applied. Free, no sign-up.
        </p>
      </section>

      <PayCalculator />

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { t: "Real FLSA + state rules", d: "Federal time-and-a-half over 40 hours, plus California / Alaska / Nevada / Colorado daily overtime and California double time." },
          { t: "2026 wage data", d: "Current minimum and tipped wages for all 50 states and DC, with final-paycheck deadlines and break rules — every figure cited." },
          { t: "Every number shown", d: "We break out regular, overtime and double-time hours and rates so you can check and defend the total." },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">{c.t}</div>
            <p className="mt-1 text-sm text-slate-600">{c.d}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">Wage & hour calculators</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {CALCULATORS.map((c) => (
            <Link key={c.slug} href={`/calculators/${c.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-3 text-sm hover:border-emerald-300 hover:bg-emerald-50">
              <div className="font-medium text-slate-900">{c.name}</div>
              <div className="mt-0.5 text-xs text-slate-500">{c.keyword}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">Minimum wage & labor law by state</h2>
        <p className="mt-1 text-sm text-slate-600">2026 minimum wage, overtime, tipped wage, final-paycheck and break rules for every state. Pick yours.</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {STATES.map((s) => (
            <Link key={s.slug} href={`/states/${s.slug}`}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:border-emerald-300 hover:text-slate-900">
              {s.abbr}
            </Link>
          ))}
        </div>
        <Link href="/states" className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline">See the full state table →</Link>
      </section>

      <Faq items={HOME_FAQS} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "WebApplication",
        name: SITE.name, applicationCategory: "BusinessApplication", operatingSystem: "Web",
        description: SITE.description, url: SITE.url,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }) }} />
    </div>
  );
}
