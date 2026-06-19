import Link from "next/link";
import PayCalculator from "@/components/PayCalculator";
import HeroPaystub from "@/components/HeroPaystub";
import Faq from "@/components/Faq";
import { Eyebrow, SectionHeading, Card, Stat } from "@/components/primitives";
import { MockPaystub, MockStateTable, MockTipped } from "@/components/mockups";
import { HOME_FAQS } from "@/lib/faq";
import { CALCULATORS } from "@/lib/calculators";
import { STATES, effectiveMinWage } from "@/lib/states";
import { CITIES } from "@/lib/cities";
import { POSTS } from "@/lib/posts";
import { FEDERAL, dollars } from "@/lib/federal";
import { SITE } from "@/lib/site";

export const revalidate = 604800; // weekly ISR

const highest = [...STATES].sort((a, b) => effectiveMinWage(b) - effectiveMinWage(a))[0];
const aboveFederal = STATES.filter((s) => s.abbr !== "DC" && effectiveMinWage(s) > FEDERAL.minWage).length;

const INSIDE = [
  { mock: <MockPaystub />, title: "Overtime, broken out line by line", body: "Regular, time-and-a-half and double-time hours and rates, each shown separately so you can check the math and defend the total.", href: "/calculators/overtime-calculator", cta: "Open the calculator" },
  { mock: <MockStateTable />, title: "Every state's 2026 rules", body: "Minimum and tipped wages, daily-overtime rules, final-paycheck deadlines and break laws for all 50 states and DC, each cited to its source.", href: "/states", cta: "Browse by state" },
  { mock: <MockTipped />, title: "Tip-credit and exempt checks", body: "See whether your cash wage plus tips clears the minimum wage, and whether a salary really meets the overtime-exemption threshold.", href: "/calculators/tipped-wage-calculator", cta: "Check tipped pay" },
];

export default function Home() {
  const guides = POSTS.slice(0, 3);

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative -mx-5 -mt-10 overflow-hidden px-5 pt-10 sm:-mt-12 sm:pt-14">
        <div aria-hidden className="ledger-grid pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-paper" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 pb-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Eyebrow>Free · Sourced to the U.S. DOL · 2026 rules</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              Overtime and time-and-a-half pay, itemized to the cent.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Enter your rate and hours. You get your regular pay, your time-and-a-half overtime and your gross
              total, with the federal 40-hour rule and your state&apos;s daily-overtime and minimum-wage rules
              already built in. No sign-up, and every figure is sourced.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="#calculator" className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-800">
                Calculate my pay
              </Link>
              <Link href="/calculators" className="rounded-full border border-line bg-card px-6 py-3 text-sm font-semibold text-ink transition hover:border-brand-300">
                Browse all calculators
              </Link>
            </div>
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              {[
                ["50 states + DC", "covered"],
                [`${dollars(highest.minWage).replace(".00", "")}`, `top rate, ${highest.name}`],
                ["No sign-up", "ever"],
              ].map(([big, small]) => (
                <div key={small} className="flex items-baseline gap-2">
                  <dt className="font-mono font-semibold text-ink">{big}</dt>
                  <dd className="text-faint">{small}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroPaystub />
        </div>
      </section>

      {/* Full calculator */}
      <section id="calculator" className="scroll-mt-24">
        <SectionHeading title="The overtime calculator" sub="The complete tool: pick your state to apply daily overtime and double time, switch the multiplier, or enter hours per day for California's 7th-day rule." />
        <div className="mt-6"><PayCalculator /></div>
      </section>

      {/* What's inside */}
      <section>
        <SectionHeading title="Built to show its work" sub="No black boxes. Each tool lays out the rule it applied and the numbers behind your result." />
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {INSIDE.map((f) => (
            <Card key={f.title} className="flex flex-col p-5">
              {f.mock}
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{f.body}</p>
              <Link href={f.href} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700 transition-all hover:gap-2">
                {f.cta} <span aria-hidden>→</span>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* All calculators */}
      <section>
        <SectionHeading title="Every wage question, one place" sub="Eight focused calculators for the moments you actually need them." />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CALCULATORS.map((c) => (
            <Link key={c.slug} href={`/calculators/${c.slug}`}
              className="group rounded-2xl border border-line bg-card p-4 transition hover:border-brand-300 hover:shadow-card">
              <span className="block h-1.5 w-1.5 rounded-full bg-gold-500 transition group-hover:bg-brand-600" />
              <div className="mt-3 font-medium text-ink">{c.name}</div>
              <div className="mt-1 text-xs leading-snug text-faint">{c.focus}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* By state */}
      <section>
        <SectionHeading title="Minimum wage and labor law by state" sub="The 2026 minimum wage, overtime rule, tipped wage and final-paycheck deadline for wherever you work." />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Highest minimum" value={`${dollars(highest.minWage)}/hr`} sub={highest.name} />
          <Stat label="Above the federal floor" value={`${aboveFederal} states`} sub="plus the District of Columbia" />
          <Stat label="Federal minimum" value={`${dollars(FEDERAL.minWage)}/hr`} sub="unchanged since 2009" />
        </div>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {STATES.map((s) => (
            <Link key={s.slug} href={`/states/${s.slug}`}
              className="rounded-lg border border-line bg-card px-2.5 py-1 text-xs font-medium text-muted transition hover:border-brand-300 hover:text-ink">
              {s.abbr}
            </Link>
          ))}
        </div>
        <Link href="/states" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:gap-2 transition-all">See the full state table <span aria-hidden>→</span></Link>
      </section>

      {/* By city */}
      <section>
        <SectionHeading title="Major city minimum wages" sub="Many cities set a higher local minimum than their state. The highest applicable rate is the one you must be paid." />
        <div className="mt-6 flex flex-wrap gap-1.5">
          {CITIES.slice(0, 14).map((c) => (
            <Link key={c.slug} href={`/cities/${c.slug}`}
              className="rounded-lg border border-line bg-card px-3 py-1.5 text-sm text-muted transition hover:border-brand-300 hover:text-ink">
              {c.city} <span className="font-mono text-xs text-faint">{dollars(c.minWage).replace(".00", "")}</span>
            </Link>
          ))}
        </div>
        <Link href="/cities" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:gap-2 transition-all">All city minimum wages <span aria-hidden>→</span></Link>
      </section>

      {/* Guides */}
      <section>
        <SectionHeading title="Guides that explain the rules" sub="Plain-English walkthroughs of the law behind the numbers." />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {guides.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group rounded-2xl border border-line bg-card p-5 transition hover:border-brand-300 hover:shadow-card">
              <div className="text-xs font-medium uppercase tracking-wider text-faint">{p.readMins} min read</div>
              <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink group-hover:text-brand-700">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
            </Link>
          ))}
        </div>
        <Link href="/blog" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:gap-2 transition-all">All guides <span aria-hidden>→</span></Link>
      </section>

      <Faq items={HOME_FAQS} />

      {/* Closing CTA */}
      <section className="relative overflow-hidden rounded-3xl bg-forest px-8 py-12 text-white sm:px-12">
        <div aria-hidden className="ledger-grid pointer-events-none absolute inset-0 opacity-[0.12]" />
        <div className="relative max-w-2xl">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Running payroll across several states?</h2>
          <p className="mt-3 text-white/75">
            The Pro report compiles minimum wage, overtime, tipped pay, final-paycheck deadlines and break rules
            for every state your team works in, sourced and dated, into one printable PDF.
          </p>
          <Link href="/pricing" className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest transition hover:bg-brand-50">
            See the Pro report
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "WebApplication",
        name: SITE.name, applicationCategory: "BusinessApplication", operatingSystem: "Web",
        description: SITE.description, url: SITE.url,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }) }} />
    </div>
  );
}
