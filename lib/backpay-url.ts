import { DEFAULT_BACKPAY, type BackPayInputs, type ClaimType } from "./backpay";
import { getStateByAbbr } from "./states";

// Encode/decode the back-pay inputs to the query string, so an estimate is a
// shareable, bookmarkable "case file" link — no account or database needed (the
// same pattern the pay calculator uses). The link is the saved case.

const CLAIM_CODES: Record<ClaimType, string> = {
  overtime: "ot",
  minimum_wage: "mw",
  off_the_clock: "otc",
  misclassification: "mc",
};
const CODE_TO_CLAIM: Record<string, ClaimType> = {
  ot: "overtime",
  mw: "minimum_wage",
  otc: "off_the_clock",
  mc: "misclassification",
};

export function encodeBackPay(inp: BackPayInputs): string {
  const p = new URLSearchParams();
  p.set("c", CLAIM_CODES[inp.claimType]);
  p.set("rate", String(inp.hourlyRate));
  p.set("hrs", String(inp.hoursPerWeek));
  p.set("paid", String(inp.paidWeekly));
  p.set("wks", String(inp.weeksAffected));
  if (inp.willful) p.set("wf", "1");
  if (inp.state) p.set("st", inp.state.abbr);
  return p.toString();
}

function num(v: string | null, fallback: number): number {
  if (v === null || v.trim() === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function decodeBackPay(search: string, seed?: Partial<BackPayInputs>): BackPayInputs {
  const p = new URLSearchParams(search);
  const base: BackPayInputs = { ...DEFAULT_BACKPAY, ...seed };
  const st = p.get("st");
  const code = p.get("c");
  return {
    claimType: (code && CODE_TO_CLAIM[code]) || base.claimType,
    hourlyRate: num(p.get("rate"), base.hourlyRate),
    hoursPerWeek: num(p.get("hrs"), base.hoursPerWeek),
    paidWeekly: num(p.get("paid"), base.paidWeekly),
    weeksAffected: num(p.get("wks"), base.weeksAffected),
    willful: p.get("wf") === "1" ? true : base.willful,
    state: st ? (getStateByAbbr(st) ?? base.state) : base.state,
  };
}
