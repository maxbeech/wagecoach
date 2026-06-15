import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PayCalculator from "@/components/PayCalculator";
import { CITIES, getCity, cityState } from "@/lib/cities";
import { effectiveMinWage } from "@/lib/states";
import { FEDERAL, dollars } from "@/lib/federal";
import { SITE } from "@/lib/site";

export const revalidate = 604800; // weekly ISR

export function generateStaticParams() {
  return CITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCity(slug);
  if (!c) return {};
  return {
    title: `${c.city} Minimum Wage 2026 — ${dollars(c.minWage)}/hour`,
    description: `The ${c.city} minimum wage is ${dollars(c.minWage)}/hour in 2026 — higher than the state and federal rate. ${c.note}`,
    alternates: { canonical: `/cities/${c.slug}` },
  };
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-0.5 text-xl font-bold text-slate-900 tabular-nums">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCity(slug);
  if (!c) notFound();
  const st = cityState(c);
  const stateMin = st ? effectiveMinWage(st) : FEDERAL.minWage;
  const overState = (c.minWage - stateMin).toFixed(2);

  return (
    <div>
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/cities" className="hover:text-slate-900">City minimum wages</Link>
        <span className="mx-1.5">/</span><span className="text-slate-700">{c.city}</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{c.city} Minimum Wage (2026)</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        The {c.city} minimum wage is <strong>{dollars(c.minWage)}/hour</strong> in 2026 — that&apos;s{" "}
        <strong>${overState} above</strong> the {st ? st.name : "state"} minimum of {dollars(stateMin)} and{" "}
        {dollars(c.minWage - FEDERAL.minWage)} above the federal {dollars(FEDERAL.minWage)}.
      </p>
      <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{c.note}</div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label={`${c.city} (2026)`} value={`${dollars(c.minWage)}/hr`} />
        <Stat label={`${st ? st.name : "State"} minimum`} value={`${dollars(stateMin)}/hr`} />
        <Stat label="Federal minimum" value={`${dollars(FEDERAL.minWage)}/hr`} />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">Overtime & pay calculator</h2>
        <p className="mt-1 mb-3 text-sm text-slate-600">Pre-set to {st ? st.name : "your state"}. Enter your hourly rate (at least {dollars(c.minWage)} in {c.city}) and hours.</p>
        <PayCalculator seed={st ? { state: st, hourlyRate: c.minWage } : { hourlyRate: c.minWage }} />
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Source: <a href={c.source} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline hover:text-emerald-800">official rate page</a>.
        Local minimum wages change often and several re-index mid-year — confirm the current {c.city} rate before relying on it.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-slate-900">Other cities</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {CITIES.filter((x) => x.slug !== c.slug).slice(0, 12).map((x) => (
            <Link key={x.slug} href={`/cities/${x.slug}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-emerald-300 hover:text-slate-900">
              {x.city}
            </Link>
          ))}
        </div>
        {st && <Link href={`/states/${st.slug}`} className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline">{st.name} state labor laws →</Link>}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "City minimum wages", item: `${SITE.url}/cities` },
          { "@type": "ListItem", position: 2, name: c.city, item: `${SITE.url}/cities/${c.slug}` },
        ],
      }) }} />
    </div>
  );
}
