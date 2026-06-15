import { FEDERAL } from "./federal";
import { STATE_CORE, type StateCore } from "./states-data";
import { STATE_EXTRAS } from "./state-extras";

// A state's daily-overtime rule (states that go beyond the FLSA weekly-only rule).
export interface DailyOt {
  afterHours: number; // hours/day beyond which 1.5× applies
  note: string;
}

// The merged, page-ready record for a state (core wage/OT data + final-pay/break extras).
export interface StateLaw extends StateCore {
  finalPayFired: string;
  finalPayQuit: string;
  mealBreak: string;
  restBreak: string;
  extraSources: string[];
}

function merge(c: StateCore): StateLaw {
  const x = STATE_EXTRAS[c.abbr] ?? {
    finalPayFired: "Next regular payday",
    finalPayQuit: "Next regular payday",
    mealBreak: "No state requirement (follows federal — none mandated for adults)",
    restBreak: "No state requirement (follows federal — none mandated for adults)",
    sources: [],
  };
  return { ...c, ...x, extraSources: x.sources };
}

export const STATES: StateLaw[] = STATE_CORE.map(merge).sort((a, b) =>
  a.name.localeCompare(b.name),
);

export function getState(slug: string): StateLaw | undefined {
  return STATES.find((s) => s.slug === slug);
}

export function getStateByAbbr(abbr: string): StateLaw | undefined {
  return STATES.find((s) => s.abbr === abbr.toUpperCase());
}

// The minimum wage that actually applies — never below the federal floor.
export function effectiveMinWage(s: StateLaw | StateCore): number {
  return Math.max(s.minWage, FEDERAL.minWage);
}

// A short label for how a state's minimum wage compares to the federal floor.
export function minWageBand(minWage: number): string {
  if (minWage <= FEDERAL.minWage) return "federal floor";
  if (minWage < 12) return "modestly above federal";
  if (minWage < 15) return "above federal";
  return "high";
}
