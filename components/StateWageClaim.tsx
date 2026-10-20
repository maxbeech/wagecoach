import Link from "next/link";
import Faq from "./Faq";
import { safeJsonLd } from "@/lib/json-ld";
import { wageClaim } from "@/lib/wage-claim-data";
import type { StateLaw } from "@/lib/states";

// "Recover unpaid wages in <state>": the filing route, steps, FAQ and HowTo data.
// It used to be a separate /wage-claim/<state> page that repeated most of the
// state page; it now lives on /states/<state> (anchor #wage-claim) and the old
// URLs 301 here, so each state has one strong page instead of two thin ones.

export function claimSteps(stateName: string, agency: string): { name: string; text: string }[] {
  return [
    { name: "Gather your records", text: `Collect pay stubs, time records, schedules and any texts about hours. In ${stateName}, your own honest records can carry a claim if the employer's are missing.` },
    { name: "Work out what you're owed", text: "The back-pay estimator adds up the unpaid wages and how far back you can recover them." },
    { name: "Send a written demand", text: "Many disputes settle after a dated letter that states the amount owed and the deadline you're giving the employer to pay." },
    { name: `File with ${agency}`, text: "If the employer doesn't pay, file a wage claim with the agency below. Filing is free and you don't need a lawyer." },
    { name: "Mind the deadline", text: "Federal claims must be filed within 2 years (3 if willful). Your state may set a shorter deadline for its own process, so don't wait." },
  ];
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 px-6 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
      <dt className="pt-0.5 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-faint">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

export default function StateWageClaim({ s }: { s: StateLaw }) {
  const wc = wageClaim(s.abbr);
  const flow = claimSteps(s.name, wc.agency);
  const faqs = [
    { q: `Who do I file an unpaid-wage claim with in ${s.name}?`, a: `${wc.agency}${wc.fileUrl ? "" : ". You can also file a federal complaint with the U.S. Department of Labor's Wage and Hour Division"}. You can also sue in court, often with an employment attorney.` },
    { q: `How far back can I recover unpaid wages in ${s.name}?`, a: `Federal law (FLSA) allows 2 years of back pay, or 3 years for a willful violation, plus an equal amount in liquidated damages.${wc.statePlus ? ` ${wc.statePlus}` : ""}` },
    { q: `Can my employer retaliate for filing a wage claim in ${s.name}?`, a: "No. Federal and state law prohibit firing, demoting or punishing you for asserting your right to be paid. Retaliation is a separate violation you can also claim." },
  ];

  return (
    <section id="wage-claim" className="mt-14 scroll-mt-24 border-t border-line pt-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">How to file a wage claim in {s.name}</h2>
      <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
        To recover unpaid wages in {s.name}, file with <strong className="text-ink">{wc.agency}</strong>. Federal law lets
        you claim up to 2 years of back pay (3 if the violation was willful), plus an equal amount in liquidated damages.
      </p>
      <div className="mt-4">
        <Link href={`/wage-claim?st=${s.abbr}`} className="inline-block rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-800">
          Estimate what I&apos;m owed in {s.name}
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-card shadow-card">
        <div className="border-b border-line bg-paper/50 px-6 py-4 font-display text-lg font-semibold text-ink">Where to file in {s.name}</div>
        <dl className="divide-y divide-line">
          <Row label="Agency">
            {wc.agency}
            {wc.fileUrl && (<>{". "}<a href={wc.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-600">File a wage claim</a></>)}
          </Row>
          <Row label="Federal window">2 years of back pay, or 3 if the violation was willful, plus equal liquidated damages.</Row>
          <Row label={`${s.name} adds`}>{wc.statePlus ?? `${s.name} follows the federal framework; confirm any extra state penalties with the agency above.`}</Row>
        </dl>
      </div>

      <h3 className="mt-8 font-display text-lg font-semibold text-ink">Step by step</h3>
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

      <div className="mt-10"><Faq items={faqs} title={`${s.name} wage claim questions`} /></div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org", "@type": "HowTo",
        name: `How to file a wage claim in ${s.name}`,
        description: `Recover unpaid wages in ${s.name} by filing with ${wc.agency}.`,
        step: flow.map((st, i) => ({ "@type": "HowToStep", position: i + 1, name: st.name, text: st.text })),
      }) }} />
    </section>
  );
}
