import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackPayCalculator from "@/components/BackPayCalculator";
import Faq from "@/components/Faq";
import { STATES, getState } from "@/lib/states";
import { wageClaim } from "@/lib/wage-claim-data";
import { SITE } from "@/lib/site";
import { Eyebrow, SectionHeading, Chip, MoreLink } from "@/components/primitives";

export const revalidate = 604800; // weekly ISR

export function generateStaticParams() {
  return STATES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getState(slug);
  if (!s) return {};
  return {
    title: `How to File a Wage Claim in ${s.name} (2026) — Unpaid Wages & Back Pay`,
    description: `Owed unpaid wages in ${s.name}? File with ${wageClaim(s.abbr).agency}. See the back-pay window, penalties and a free calculator to estimate what you're owed.`,
    alternates: { canonical: `/wage-claim/${s.slug}` },
  };
}

function steps(stateName: string, agency: string): { name: string; text: string }[] {
  return [
    { name: "Gather your records", text: `Collect pay stubs, time records, schedules and any texts about hours. In ${stateName}, your own honest records can carry a claim if the employer's are missing.` },
    { name: "Calculate what you're owed", text: "Use the back-pay calculator on this page to estimate the unpaid wages and how far back you can recover them." },
    { name: "Send a written demand", text: "Many disputes settle after a dated demand letter that states the amount owed and the deadline you're giving the employer to pay." },
    { name: `File with ${agency}`, text: "If the employer doesn't pay, file a wage claim with the agency below, or talk to an employment attorney about a lawsuit." },
    { name: "Mind the deadline", text: "Federal claims must be filed within 2 years (3 if willful). Your state may set a shorter administrative deadline, so don't wait." },
  ];
}

export default async function WageClaimState({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getState(slug);
  if (!s) notFound();
  const wc = wageClaim(s.abbr);
  const flow = steps(s.name, wc.agency);

  const faqs = [
    { q: `Who do I file an unpaid-wage claim with in ${s.name}?`, a: `${wc.agency}${wc.fileUrl ? "" : ". You can also file a federal complaint with the U.S. Department of Labor's Wage and Hour Division"}. You can also sue in court, often with an employment attorney.` },
    { q: `How far back can I recover unpaid wages in ${s.name}?`, a: `Federal law (FLSA) allows 2 years of back pay, or 3 years for a willful violation, plus an equal amount in liquidated damages.${wc.statePlus ? ` ${wc.statePlus}` : ""}` },
    { q: `Can my employer retaliate for filing a wage claim in ${s.name}?`, a: "No. Federal and state law prohibit firing, demoting or punishing you for asserting your right to be paid. Retaliation is a separate violation you can also claim." },
  ];

  return (
    <div>
      <nav className="mb-4 text-sm text-faint">
        <Link href="/wage-claim" className="hover:text-ink">Unpaid wages</Link>
        <span className="mx-1.5">/</span><span className="text-muted">{s.name}</span>
      </nav>

      <Eyebrow>Unpaid wages</Eyebrow>
      <div className="mt-3">
        <SectionHeading
          as="h1"
          title={`How to File a Wage Claim in ${s.name}`}
          sub={
            <>
              To recover unpaid wages in {s.name}, file with <strong>{wc.agency}</strong>. Under federal law you can
              claim up to <strong>2 years of back pay</strong> (3 if the violation was willful), plus an equal amount in
              liquidated damages. Estimate what you&apos;re owed below.
            </>
          }
        />
      </div>

      <div className="mt-8">
        <BackPayCalculator seed={{ state: s }} />
      </div>

      {/* Filing route — the actionable answer engines and readers want. */}
      <section className="mt-10 overflow-hidden rounded-2xl border border-line bg-card shadow-card">
        <div className="border-b border-line bg-paper/50 px-6 py-4">
          <div className="font-display text-lg font-semibold text-ink">Where to file in {s.name}</div>
        </div>
        <dl className="divide-y divide-line">
          <div className="grid gap-1 px-6 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt className="pt-0.5 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-faint">Agency</dt>
            <dd className="text-sm leading-relaxed text-ink">
              {wc.agency}
              {wc.fileUrl && (
                <>
                  {" — "}
                  <a href={wc.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-600">file a wage claim</a>
                </>
              )}
            </dd>
          </div>
          <div className="grid gap-1 px-6 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt className="pt-0.5 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-faint">Federal window</dt>
            <dd className="text-sm leading-relaxed text-ink">2 years of back pay, or 3 years if the violation was willful — plus equal liquidated damages.</dd>
          </div>
          <div className="grid gap-1 px-6 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt className="pt-0.5 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-faint">{s.name} adds</dt>
            <dd className="text-sm leading-relaxed text-ink">{wc.statePlus ?? `${s.name} follows the federal framework; confirm any extra state penalties with the agency above.`}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">Filing a {s.name} wage claim, step by step</h2>
        <ol className="mt-4 space-y-4">
          {flow.map((step, i) => (
            <li key={i} className="flex gap-3.5">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 font-mono text-xs font-semibold text-brand-700">{i + 1}</span>
              <div>
                <div className="text-sm font-semibold text-ink">{step.name}</div>
                <p className="mt-0.5 text-sm leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-brand-800">Want a lawyer to check it first?</h2>
        <p className="mt-1 text-sm leading-relaxed text-brand-800">
          A free case review tells you whether your {s.name} claim is worth pursuing — most wage cases are taken on
          contingency, so there&apos;s no upfront cost.
        </p>
        <div className="mt-3"><MoreLink href="/free-case-review">Get a free case review</MoreLink></div>
      </section>

      <Faq items={faqs} />

      <p className="mt-8 text-xs leading-relaxed text-faint">
        {s.name} wage-claim figures are general information for 2026, not legal advice. Deadlines, agencies and remedies
        have local exceptions and change — confirm with {wc.agency} or an employment attorney before relying on this.
      </p>

      <section className="mt-8">
        <h2 className="font-display text-sm font-semibold text-ink">Wage claims in other states</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {STATES.filter((x) => x.slug !== s.slug).slice(0, 12).map((x) => (
            <Chip key={x.slug} href={`/wage-claim/${x.slug}`}>{x.name}</Chip>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "HowTo",
        name: `How to file a wage claim in ${s.name}`,
        description: `Recover unpaid wages in ${s.name} by filing with ${wc.agency}.`,
        step: flow.map((st, i) => ({ "@type": "HowToStep", position: i + 1, name: st.name, text: st.text })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Unpaid wages", item: `${SITE.url}/wage-claim` },
          { "@type": "ListItem", position: 2, name: s.name, item: `${SITE.url}/wage-claim/${s.slug}` },
        ],
      }) }} />
    </div>
  );
}
