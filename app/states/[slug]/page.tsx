import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PayCalculator from "@/components/PayCalculator";
import { STATES, getState, effectiveMinWage } from "@/lib/states";
import { citiesForState } from "@/lib/cities";
import { dollars } from "@/lib/federal";
import { SITE } from "@/lib/site";

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
    description: `${s.name}'s 2026 minimum wage is ${dollars(effectiveMinWage(s))}/hr. See overtime rules, tipped wage, final-paycheck deadlines and break laws — with a free pay calculator.`,
    alternates: { canonical: `/states/${s.slug}` },
  };
}

function Item({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-0.5 font-semibold text-slate-900">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-slate-500">{sub}</div>}
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
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/states" className="hover:text-slate-900">By state</Link>
        <span className="mx-1.5">/</span><span className="text-slate-700">{s.name}</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{s.name} Minimum Wage & Labor Laws (2026)</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        In 2026, the {s.name} minimum wage is <strong>{dollars(min)}/hour</strong>. Overtime is{" "}
        {s.dailyOt ? `required daily (over ${s.dailyOt.afterHours} hrs) and weekly (over 40)` : "1.5× the regular rate over 40 hours a week"}.
        Below are the wage, overtime, final-paycheck and break rules — with a calculator pre-set to {s.name}.
      </p>

      {s.minWageNote && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{s.minWageNote}</div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Item label="Minimum wage" value={`${dollars(min)}/hr`} />
        <Item label="Tipped cash wage" value={s.tipCreditAllowed ? (s.tippedCashWage !== null ? `${dollars(s.tippedCashWage)}/hr` : "Varies") : "Full min wage"} sub={s.tipCreditAllowed ? undefined : "No tip credit"} />
        <Item label="Overtime" value={s.dailyOt ? `Daily >${s.dailyOt.afterHours}h + 40/wk` : "Over 40/week"} />
        <Item label="Final pay (fired)" value={s.finalPayFired} />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">{s.name} pay & overtime calculator</h2>
        <p className="mt-1 mb-3 text-sm text-slate-600">Pre-set to {s.name}. Enter your rate and hours.</p>
        <PayCalculator seed={{ state: s }} />
      </div>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <div className="font-semibold text-slate-900">Overtime</div>
          <p className="mt-1 text-slate-600">{s.dailyOt ? s.dailyOt.note : `${s.name} follows the federal rule: 1.5× the regular rate for hours over 40 in a workweek.`}{s.doubleTime ? " " + s.doubleTime : ""}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <div className="font-semibold text-slate-900">Tipped employees</div>
          <p className="mt-1 text-slate-600">{s.tipCreditAllowed ? (s.tippedNote ?? `Employers may take a tip credit; cash wage + tips must reach ${dollars(min)}/hr.`) : `No tip credit — tipped staff must be paid the full ${dollars(min)}/hr in cash, with tips on top.`}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <div className="font-semibold text-slate-900">Final paycheck</div>
          <p className="mt-1 text-slate-600">Fired: {s.finalPayFired}. Quit: {s.finalPayQuit}.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <div className="font-semibold text-slate-900">Meal & rest breaks</div>
          <p className="mt-1 text-slate-600">Meal: {s.mealBreak}. Rest: {s.restBreak}.</p>
        </div>
      </section>

      <p className="mt-4 text-xs text-slate-500">
        {s.name} figures are current for 2026 and compiled from the U.S. Department of Labor and {s.name}&apos;s
        labor department. Cities and counties may set higher local minimums, and industry rules vary — confirm
        with your state labor department before relying on this for payroll or a legal decision.
      </p>

      {cities.length > 0 && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Cities in {s.name} with a higher minimum wage</h2>
          <p className="mt-1 text-sm text-slate-600">These {s.name} localities set a local minimum above the state&apos;s {dollars(min)}/hr:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {cities.map((c) => (
              <Link key={c.slug} href={`/cities/${c.slug}`}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 hover:bg-emerald-100">
                {c.city} · {dollars(c.minWage)}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-slate-900">Other states</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {STATES.filter((x) => x.slug !== s.slug).slice(0, 12).map((x) => (
            <Link key={x.slug} href={`/states/${x.slug}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-emerald-300 hover:text-slate-900">
              {x.name}
            </Link>
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
