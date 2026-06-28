"use client";

import { useState, useEffect } from "react";
import { personaliseLetter, type LetterFields } from "@/lib/demand-letter";

// Wraps the generated demand letter with a fill-in-the-blanks form so the user
// can personalise the [bracketed placeholders] in the browser before printing.
// All data stays client-side — nothing is sent to a server.
export default function ClaimKitPersonaliser({ letter }: { letter: string }) {
  const [fields, setFields] = useState<Partial<LetterFields>>({});
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(true);

  // Default letter date to today on mount. The date is deliberately client-only:
  // computing `new Date()` during render would differ between server and client
  // and cause a hydration mismatch, so we set it in an effect after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe client-only date
    setFields((f) => ({
      letterDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      ...f,
    }));
  }, []);

  const filled = personaliseLetter(letter, fields);
  const remaining = (filled.match(/\[[\w /·]+\]/g) ?? []).length;

  const set = (k: keyof LetterFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(filled);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked */ }
  };

  return (
    <div>
      {/* Personalisation form */}
      <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-50 p-5">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between"
        >
          <span className="font-display text-base font-semibold text-brand-800">
            Fill in your details
          </span>
          <span className="text-xs text-brand-600">
            {remaining === 0 ? "All filled ✓" : `${remaining} placeholder${remaining === 1 ? "" : "s"} remaining`}
            {" "}{open ? "▲" : "▼"}
          </span>
        </button>

        {open && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Letter date" value={fields.letterDate ?? ""} onChange={set("letterDate")} placeholder="June 28, 2026" />
            <Field label="Your full name" value={fields.yourName ?? ""} onChange={set("yourName")} placeholder="Jane Smith" />
            <Field label="Your address" value={fields.yourAddress ?? ""} onChange={set("yourAddress")} placeholder="123 Main St, Chicago, IL 60601" span />
            <Field label="Your phone" value={fields.yourPhone ?? ""} onChange={set("yourPhone")} placeholder="(312) 555-0100" />
            <Field label="Your email" value={fields.yourEmail ?? ""} onChange={set("yourEmail")} placeholder="jane@example.com" />
            <Field label="Employer / company name" value={fields.employerName ?? ""} onChange={set("employerName")} placeholder="Acme Corp" />
            <Field label="Employer address" value={fields.employerAddress ?? ""} onChange={set("employerAddress")} placeholder="456 Business Ave, Chicago, IL 60601" span />
            <Field label="Start date of underpayment" value={fields.startDate ?? ""} onChange={set("startDate")} placeholder="January 1, 2024" />
            <Field label="End date of underpayment" value={fields.endDate ?? ""} onChange={set("endDate")} placeholder="June 28, 2026" />
          </div>
        )}

        {remaining === 0 && !open && (
          <p className="mt-2 text-xs text-brand-700">
            All personal details are filled — your letter is ready to print.
          </p>
        )}
      </div>

      {/* Letter header + actions */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-lg font-semibold text-ink">1 · Your demand letter</h2>
        <div className="flex flex-wrap gap-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800"
          >
            Print / Save as PDF
          </button>
          <button
            onClick={copy}
            className="rounded-lg border border-line bg-card px-4 py-2 text-sm font-medium text-ink transition hover:border-brand-300 hover:bg-brand-50"
          >
            {copied ? "Letter copied ✓" : "Copy letter text"}
          </button>
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? "Letter copied to clipboard" : ""}
          </span>
        </div>
      </div>

      {/* Live-updating letter */}
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-line bg-card p-6 font-mono text-[0.8rem] leading-relaxed text-ink shadow-card">
        {filled}
      </pre>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  span,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  span?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1 ${span ? "sm:col-span-2" : ""}`}>
      <span className="text-[0.7rem] font-medium uppercase tracking-wider text-brand-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
    </label>
  );
}
