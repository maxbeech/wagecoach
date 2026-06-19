import { type FaqItem } from "@/lib/faq";

export default function Faq({ items, title = "Frequently asked questions" }: { items: FaqItem[]; title?: string }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
      <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card shadow-card">
        {items.map((it, i) => (
          <details key={i} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded text-sm font-medium text-ink">
              {it.q}
              <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-faint transition group-open:rotate-45 group-open:border-brand-300 group-open:text-brand-700">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{it.a}</p>
          </details>
        ))}
      </div>
      {/* FAQ structured data for rich results — single source from the same items. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
      }) }} />
    </section>
  );
}
