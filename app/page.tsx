import Link from "next/link";
import PayCalculator from "@/components/PayCalculator";
import HeroPaystub from "@/components/HeroPaystub";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import OvertimeBar from "@/components/illustrations/OvertimeBar";
import WageSpectrum from "@/components/illustrations/WageSpectrum";
import { Eyebrow, SectionHeading, MoreLink } from "@/components/primitives";
import { MockReport } from "@/components/mockups";
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

// The three things the overtime diagram is annotating, in the margin.
const READING = [
  { n: "1", title: "Your regular hours", body: "Every hour up to 40 is paid at your base rate, flat." },
  { n: "2", title: "The 40-hour line", body: "Federal law (29 USC 207) draws overtime at this mark, not at the end of a long day." },
  { n: "3", title: "Overtime lights up", body: "Hours past 40 are paid at 1.5x. Drag the week longer and watch the premium grow." },
];

export default function Home() {
  const guides = POSTS.slice(0, 3);

  return (
    <div className="space-y-24 sm:space-y-28">
      {/* Hero */}
      <section className="relative -mx-5 -mt-10 overflow-hidden px-5 pt-10 sm:-mt-12 sm:pt-14">
        <div aria-hidden className="ledger-grid pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-paper" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 pb-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Eyebrow>Free · Sourced to the U.S. DOL · 2026 rules</Eyebrow>
            <h1 className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.03] tracking-tight text-ink sm:text-[3.4rem]">
              Overtime and time-and-a-half pay, <span className="italic text-brand-700">itemized to the cent.</span>
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
          {/* The paystub sits on the desk at a slight angle, straightening when you reach for it. */}
          <div className="group transition-transform duration-500 ease-out [transform:rotate(1.1deg)] hover:[transform:rotate(0deg)] lg:-mr-6">
            <HeroPaystub />
          </div>
        </div>
      </section>

      {/* Full calculator */}
      <section id="calculator" className="scroll-mt-24">
        <SectionHeading rule title="The overtime calculator" sub="The complete tool: pick your state to apply daily overtime and double time, switch the multiplier, or enter hours per day for California's 7th-day rule." />
        <Reveal className="mt-6"><PayCalculator /></Reveal>
      </section>

      {/* Signature annotated diagram — replaces the old 3-tile grid */}
      <section>
        <SectionHeading rule title="Where overtime begins" sub="The whole site turns on one line. Here it is, live: drag the week past 40 hours and watch the premium switch on." />
        <Reveal className="mt-7 overflow-hidden rounded-3xl border border-line bg-card shadow-card">
          <div className="grid lg:grid-cols-[1.35fr_1fr]">
            <div className="border-b border-line p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <OvertimeBar />
            </div>
            <div className="bg-paper/40 p-6 sm:p-8">
              <ol className="space-y-6">
                {READING.map((r) => (
                  <li key={r.n} className="flex gap-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-forest font-mono text-xs font-semibold text-white">{r.n}</span>
                    <div>
                      <div className="font-display font-semibold text-ink">{r.title}</div>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{r.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-7 border-t border-line pt-5">
                <MoreLink href="/calculators/overtime-calculator">Open the full overtime calculator</MoreLink>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Ledger index — the calculators as statement line-items */}
      <section>
        <SectionHeading rule title="Every wage question, one place" sub="Eight focused calculators, each sourced and built to show its work. Pick a line." />
        <Reveal className="mt-6 overflow-hidden rounded-2xl border border-line bg-card shadow-card">
          <div className="grid sm:grid-cols-2">
            {CALCULATORS.map((c, i) => (
              <Link key={c.slug} href={`/calculators/${c.slug}`}
                className={`group flex items-baseline gap-3 px-5 py-4 transition hover:bg-brand-50/50 ${i % 2 === 0 ? "sm:border-r sm:border-line" : ""} ${i < CALCULATORS.length - (CALCULATORS.length % 2 === 0 ? 2 : 1) ? "border-b border-line" : ""}`}>
                <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-medium text-ink group-hover:text-brand-700">{c.name}</span>
                <span className="leader" />
                <span className="hidden shrink-0 text-xs text-faint sm:block">{c.focus}</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Full-bleed dark "wage map" — the signature data moment */}
      <section className="relative -mx-5 overflow-hidden bg-forest px-5 py-16 text-white sm:rounded-[2rem] sm:px-10 lg:px-14">
        <div aria-hidden className="ledger-grid pointer-events-none absolute inset-0 opacity-[0.08]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-500">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> 2026 minimum wage
              </span>
              <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-[2.6rem]">
                <span className="font-mono tabular-nums text-gold-500">{aboveFederal}</span> states pay above the federal floor.
              </h2>
              <p className="mt-3 max-w-md text-white/70">
                The federal minimum has been {dollars(FEDERAL.minWage)} since 2009. Find where any state sits, and the
                overtime and tipped rules that travel with it.
              </p>
            </div>
            <Link href="/states" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest transition hover:bg-brand-50">
              The full 2026 state table
            </Link>
          </div>
          <div className="mt-12">
            <WageSpectrum />
          </div>
        </div>
      </section>

      {/* By city */}
      <section>
        <SectionHeading rule title="Major city minimum wages" sub="Many cities set a higher local minimum than their state. The highest applicable rate is the one you must be paid." />
        <div className="mt-6 flex flex-wrap gap-1.5">
          {CITIES.slice(0, 14).map((c) => (
            <Link key={c.slug} href={`/cities/${c.slug}`}
              className="rounded-lg border border-line bg-card px-3 py-1.5 text-sm text-muted transition hover:border-brand-300 hover:text-ink">
              {c.city} <span className="font-mono text-xs text-faint">{dollars(c.minWage).replace(".00", "")}</span>
            </Link>
          ))}
        </div>
        <div className="mt-5"><MoreLink href="/cities">All city minimum wages</MoreLink></div>
      </section>

      {/* Guides */}
      <section>
        <SectionHeading rule title="Guides that explain the rules" sub="Plain-English walkthroughs of the law behind the numbers." />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {guides.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <Link href={`/blog/${p.slug}`} className="lift flex h-full flex-col rounded-2xl border border-line bg-card p-5">
                <div className="text-xs font-medium uppercase tracking-wider text-faint">{p.readMins} min read</div>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-5"><MoreLink href="/blog">All guides</MoreLink></div>
      </section>

      <Faq items={HOME_FAQS} />

      {/* Closing CTA — sell the artifact */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-card shadow-card">
        <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow>For teams across states</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">One sourced wage sheet for every state your team works in</h2>
            <p className="mt-3 max-w-md leading-relaxed text-muted">
              The Pro report compiles minimum wage, overtime, tipped pay, final-paycheck deadlines and break rules
              for every state you choose, dated and cited, into one printable PDF.
            </p>
            <Link href="/pricing" className="mt-6 inline-block rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800">
              See the Pro report
            </Link>
          </div>
          <div className="lg:rotate-[-1.4deg]">
            <MockReport />
          </div>
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
