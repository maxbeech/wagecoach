import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PayCalculator from "@/components/PayCalculator";
import { STATES, getState, effectiveMinWage } from "@/lib/states";
import { citiesForState } from "@/lib/cities";
import { dollars } from "@/lib/federal";
import { SITE } from "@/lib/site";
import { Eyebrow, SectionHeading, Chip } from "@/components/primitives";

export const revalidate = 604800; // weekly ISR

export function generateStaticParams() {
  return STATES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getState(slug);
  if (!s) return {};
  return {
    title: `${s.name} Minimum Wage, Overtime & Labor Laws (2026)`,
    description: `${s.name}'s 2026 minimum wage is ${dollars(effectiveMinWage(s))}/hr. See overtime rules, tipped wage, final-paycheck deadlines and break laws, plus a free pay calculator.`,
    alternates: { canonical: `/states/${s.slug}` },
  };
}

// One ruled line of the rate sheet: a fixed-width label column and the detail,
// like a row on an official wage order.
function SheetRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 px-6 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
      <dt className="pt-0.5 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-faint">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

export default async function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getState(slug);
  if (!s) notFound();
  const min = effectiveMinWage(s);
  const cities = citiesForState(s.abbr);

  return (
    <div>
      <nav className="mb-4 text-sm text-faint">
        <Link href="/states" className="hover:text-ink">By state</Link>
        <span className="mx-1.5">/</span><span className="text-muted">{s.name}</span>
      </nav>

      <Eyebrow>By state</Eyebrow>
      <div className="mt-3">
        <SectionHeading
          as="h1"
          title={`${s.name} Minimum Wage & Labor Laws (2026)`}
          sub={
            <>
              In 2026, the {s.name} minimum wage is <strong>{dollars(min)}/hour</strong>. Overtime is{" "}
              {s.dailyOt ? `required daily (over ${s.dailyOt.afterHours} hrs) and weekly (over 40)` : "1.5× the regular rate over 40 hours a week"}.
              Below are the wage, overtime, final-paycheck and break rules, plus a calculator pre-set to {s.name}.
            </>
          }
        />
      </div>

      {s.minWageNote && (
        <div className="mt-3 rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-800">{s.minWageNote}</div>
      )}

      {/* The state's wage & hour rules as a single official-looking rate sheet. */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-card shadow-card">
        <div className="flex items-center justify-between gap-4 border-b border-line bg-paper/50 px-6 py-4">
          <div>
            <div className="font-display text-lg font-semibold text-ink">{s.name} wage &amp; hour rate sheet</div>
            <div className="mt-0.5 text-xs text-faint">2026 rules, sourced to the U.S. DOL and the state labor department</div>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-mono text-3xl font-semibold leading-none tabular-nums text-ink">{dollars(min)}<span className="text-base font-medium text-faint">/hr</span></div>
            <div className="mt-1 text-[0.62rem] uppercase tracking-wider text-faint">minimum wage</div>
          </div>
        </div>
        <dl className="divide-y divide-line">
          <SheetRow label="Overtime">
            {s.dailyOt ? `Daily over ${s.dailyOt.afterHours} hours and weekly over 40. ` : "1.5x the regular rate for hours over 40 in a workweek. "}
            {s.dailyOt ? s.dailyOt.note : `${s.name} follows the federal FLSA weekly rule.`}{s.doubleTime ? " " + s.doubleTime : ""}
          </SheetRow>
          <SheetRow label="Tipped pay">
            <span className="font-mono tabular-nums">{s.tipCreditAllowed ? (s.tippedCashWage !== null ? `${dollars(s.tippedCashWage)}/hr cash` : "State-set cash wage") : `${dollars(min)}/hr in full`}</span>
            {". "}
            {s.tipCreditAllowed ? (s.tippedNote ?? `Employers may take a tip credit; cash wage plus tips must reach ${dollars(min)}/hr.`) : `No tip credit: tipped staff must be paid the full minimum in cash, with tips on top.`}
          </SheetRow>
          <SheetRow label="Final paycheck">
            Fired: {s.finalPayFired}. Quit: {s.finalPayQuit}.
          </SheetRow>
          <SheetRow label="Meal &amp; rest breaks">
            Meal: {s.mealBreak}. Rest: {s.restBreak}.
          </SheetRow>
        </dl>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold text-ink">{s.name} pay &amp; overtime calculator</h2>
        <p className="mt-1 mb-3 text-sm text-muted">Pre-set to {s.name}. Enter your rate and hours.</p>
        <PayCalculator seed={{ state: s }} />
      </div>

      <p className="mt-6 text-xs text-faint">
        {s.name} figures are current for 2026 and compiled from the U.S. Department of Labor and {s.name}&apos;s
        labor department. Cities and counties may set higher local minimums, and industry rules vary, so confirm
        with your state labor department before relying on this for payroll or a legal decision.
      </p>

      {cities.length > 0 && (
        <section className="mt-8 rounded-2xl border border-line bg-card p-5 shadow-card">
          <h2 className="font-display text-lg font-semibold text-ink">Cities in {s.name} with a higher minimum wage</h2>
          <p className="mt-1 text-sm text-muted">These {s.name} localities set a local minimum above the state&apos;s {dollars(min)}/hr:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {cities.map((c) => (
              <Link key={c.slug} href={`/cities/${c.slug}`}
                className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:border-brand-300 hover:bg-brand-100">
                {c.city} · <span className="ml-1 font-mono tabular-nums">{dollars(c.minWage)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-display text-sm font-semibold text-ink">Other states</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {STATES.filter((x) => x.slug !== s.slug).slice(0, 12).map((x) => (
            <Chip key={x.slug} href={`/states/${x.slug}`}>{x.name}</Chip>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "By state", item: `${SITE.url}/states` },
          { "@type": "ListItem", position: 2, name: s.name, item: `${SITE.url}/states/${s.slug}` },
        ],
      }) }} />
    </div>
  );
}
