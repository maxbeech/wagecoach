import { type FaqItem } from "@/lib/faq";

export default function Faq({ items, title = "Frequently asked questions" }: { items: FaqItem[]; title?: string }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-3 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {items.map((it, i) => (
          <details key={i} className="group px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded text-sm font-medium text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
              {it.q}
              <span aria-hidden="true" className="ml-2 text-slate-500 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm text-slate-600">{it.a}</p>
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
