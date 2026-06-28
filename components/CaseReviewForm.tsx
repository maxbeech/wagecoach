"use client";

import { useEffect, useState } from "react";
import { CLAIM_LABELS, type ClaimType } from "@/lib/backpay";
import { decodeBackPay } from "@/lib/backpay-url";
import { dollars } from "@/lib/federal";
import { Field, StateSelect, inputCls } from "./ui";

const CLAIMS: ClaimType[] = ["overtime", "misclassification", "off_the_clock", "minimum_wage"];

export default function CaseReviewForm() {
  const [state, setState] = useState("");
  const [claim, setClaim] = useState<ClaimType>("overtime");
  const [amount, setAmount] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  // Prefill from the estimate the person carried over from the calculator. The
  // one-time hydration from the URL on mount is the same justified pattern the
  // calculators use (window is client-only).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const decoded = decodeBackPay(window.location.search);
    const amt = Number(params.get("amt"));
    /* eslint-disable react-hooks/set-state-in-effect */
    setClaim(decoded.claimType);
    if (decoded.state) setState(decoded.state.abbr);
    if (Number.isFinite(amt) && amt > 0) setAmount(Math.round(amt));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending"); setMessage("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, state, claimType: CLAIM_LABELS[claim], amount, summary }),
      });
      const data = await res.json();
      if (data.ok) { setStatus("done"); setMessage(data.message); return; }
      setStatus("error"); setMessage(data.message ?? "Something went wrong. Please try again.");
    } catch {
      setStatus("error"); setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-brand-300 bg-brand-50 p-6 text-center shadow-card">
        <div className="font-display text-lg font-semibold text-brand-800">Request sent</div>
        <p className="mt-2 text-sm leading-relaxed text-brand-800">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
      {amount !== null && (
        <div className="mb-4 rounded-xl bg-forest px-5 py-3 text-white">
          <div className="text-xs uppercase tracking-wider text-white/55">Your estimate</div>
          <div className="font-mono text-xl font-semibold tabular-nums">{dollars(amount)} in possible back pay</div>
        </div>
      )}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Your name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></Field>
          <Field label="Email" hint="Where the attorney will reply.">
            <input className={inputCls} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Phone (optional)"><input className={inputCls} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" /></Field>
          <Field label="State"><StateSelect value={state} onChange={setState} /></Field>
        </div>
        <Field label="What happened?">
          <select className={inputCls} value={claim} onChange={(e) => setClaim(e.target.value as ClaimType)}>
            {CLAIMS.map((c) => <option key={c} value={c}>{CLAIM_LABELS[c]}</option>)}
          </select>
        </Field>
        <Field label="Anything else? (optional)" hint="Dates, your employer, how the underpayment happened.">
          <textarea className={`${inputCls} min-h-24`} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </Field>

        <button type="submit" disabled={status === "sending"}
          className="w-full rounded-full bg-forest px-6 py-3 font-semibold text-white shadow-card transition hover:bg-brand-800 disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Request my free case review"}
        </button>
        {status === "error" && <p className="text-sm text-amber-800">{message}</p>}
        <p className="text-xs leading-relaxed text-faint">
          Submitting connects you with an independent employment attorney for a free, no-obligation review. WageCoach
          is not a law firm and does not provide legal advice. We share only the details you enter here.
        </p>
      </div>
    </form>
  );
}
