"use client";

import { useState } from "react";
import { STATES } from "@/lib/states";

// A checklist of all 50 states plus DC. Works two ways: inside a plain <form>
// (each checked box submits as `name=ABBR`, so it needs no JS handler), or with
// `onChange` when a parent such as the pricing card needs the live selection.
export default function StateChecklist({
  name = "states",
  defaultSelected = [],
  onChange,
}: {
  name?: string;
  defaultSelected?: string[];
  onChange?: (abbrs: string[]) => void;
}) {
  const [picked, setPicked] = useState<string[]>(defaultSelected);
  const set = (next: string[]) => {
    setPicked(next);
    onChange?.(next);
  };
  const toggle = (abbr: string) => set(picked.includes(abbr) ? picked.filter((a) => a !== abbr) : [...picked, abbr]);
  const linkBtn = "font-medium text-brand-700 underline decoration-brand-300 underline-offset-2";

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <button type="button" className={linkBtn} onClick={() => set(STATES.map((s) => s.abbr))}>Select all</button>
        <button type="button" className={linkBtn} onClick={() => set([])}>Clear</button>
        <span className="text-faint" role="status" aria-live="polite">{picked.length} selected</span>
      </div>
      <div className="grid max-h-56 grid-cols-2 gap-x-3 gap-y-1.5 overflow-y-auto rounded-lg border border-line bg-paper/50 p-3 text-sm sm:grid-cols-3 md:grid-cols-2">
        {STATES.map((s) => (
          <label key={s.abbr} className="flex cursor-pointer items-center gap-2 text-ink">
            <input type="checkbox" name={name} value={s.abbr} checked={picked.includes(s.abbr)} onChange={() => toggle(s.abbr)} className="h-4 w-4 accent-brand-600" />
            {s.name}
          </label>
        ))}
      </div>
    </div>
  );
}
