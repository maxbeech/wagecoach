import type { Metadata } from "next";
import { Suspense } from "react";
import CaseReviewForm from "@/components/CaseReviewForm";
import { Eyebrow, SectionHeading, LedgerTick } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Free Wage Case Review — Unpaid Overtime & Wages",
  description: "Think you're owed unpaid overtime or wages? Get a free, no-obligation case review from an employment attorney. Bring your back-pay estimate and we'll connect you.",
  alternates: { canonical: "/free-case-review" },
};

const STEPS = [
  "Tell us what happened and your back-pay estimate — it takes a minute.",
  "An independent employment attorney reviews whether you have a claim.",
  "If you do, they explain your options. Most wage cases are taken on contingency, so there's no upfront cost.",
];

export default function FreeCaseReview() {
  return (
    <div>
      <Eyebrow>Free case review</Eyebrow>
      <div className="mt-3">
        <SectionHeading
          as="h1"
          title="Get a free review of your wage case"
          sub="If your back-pay estimate looks significant, an employment attorney can tell you whether it's worth pursuing — for free, with no obligation. Many wage cases are handled on contingency, meaning the lawyer is only paid if you recover."
        />
      </div>

      <div className="mt-8 grid items-start gap-6 md:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">How it works</h2>
          <ol className="mt-3 space-y-3">
            {STEPS.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 font-mono text-xs font-semibold text-brand-700">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>

          <h2 className="mt-7 font-display text-lg font-semibold text-ink">Common claims attorneys take</h2>
          <ul className="mt-2 space-y-1.5">
            {["Unpaid or miscalculated overtime", "Misclassified as exempt / salaried", "Off-the-clock work before or after shifts", "Paid below the minimum wage", "Withheld final paycheck or unpaid tips"].map((n) => (
              <li key={n} className="flex gap-2.5 text-sm leading-relaxed text-muted"><LedgerTick />{n}</li>
            ))}
          </ul>
        </div>

        <Suspense fallback={null}>
          <CaseReviewForm />
        </Suspense>
      </div>
    </div>
  );
}
