import { DEFAULT_PAY, type PayInputs } from "./overtime";
import { getStateByAbbr } from "./states";

// Encode/decode the pay calculator inputs to the query string so results are
// shareable and bookmarkable. State is carried as its abbreviation; daily hours
// (for daily-OT states) as a comma list.

export function encodeInputs(inp: PayInputs): string {
  const p = new URLSearchParams();
  p.set("rate", String(inp.hourlyRate));
  p.set("hrs", String(inp.hoursThisWeek));
  if (inp.otMultiplier !== 1.5) p.set("mult", String(inp.otMultiplier));
  if (inp.state) p.set("st", inp.state.abbr);
  if (inp.dailyHours && inp.dailyHours.some((h) => h > 0)) p.set("days", inp.dailyHours.join(","));
  return p.toString();
}

function num(v: string | null, fallback: number): number {
  if (v === null || v.trim() === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function decodeInputs(search: string, seed?: Partial<PayInputs>): PayInputs {
  const p = new URLSearchParams(search);
  const base: PayInputs = { ...DEFAULT_PAY, ...seed };
  const st = p.get("st");
  const days = p.get("days");
  return {
    hourlyRate: num(p.get("rate"), base.hourlyRate),
    hoursThisWeek: num(p.get("hrs"), base.hoursThisWeek),
    otMultiplier: num(p.get("mult"), base.otMultiplier),
    state: st ? (getStateByAbbr(st) ?? base.state) : base.state,
    dailyHours: days
      ? days.split(",").map((s) => num(s, 0)).slice(0, 7)
      : base.dailyHours,
  };
}
