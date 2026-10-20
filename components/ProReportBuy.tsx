"use client";

import { useState } from "react";
import CheckoutButton from "./CheckoutButton";
import StateChecklist from "./StateChecklist";

// The Pro report's buy control on /pricing. The report is built for the states
// the buyer runs payroll in, so they pick them first; the choice rides through
// Stripe in the session's metadata and the report page rebuilds from it.
export default function ProReportBuy() {
  const [states, setStates] = useState<string[]>([]);
  return (
    <div>
      <details className="rounded-xl border border-line bg-paper/40 p-3">
        <summary className="cursor-pointer text-sm font-medium text-ink">
          Choose your states{states.length > 0 && <span className="font-normal text-faint"> ({states.length} selected)</span>}
        </summary>
        <p className="mt-2 text-xs text-faint">The report covers the states you pick. One price, any number of states.</p>
        <div className="mt-3"><StateChecklist onChange={setStates} /></div>
      </details>
      <div className="mt-4"><CheckoutButton product="report" states={states} /></div>
    </div>
  );
}
