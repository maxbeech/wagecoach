import { MAX_ROWS, parseTime, type Period, type TimeRow } from "./timecard";
import { getStateByAbbr, type StateLaw } from "./states";

// Time card <-> query string, so a filled-in card is a shareable link.
// Rows are "0900-1730-30" (in-out-break); a blank row is "--".

export interface TimeCardState {
  rows: TimeRow[];
  period: Period;
  hourlyRate: number;
  state: StateLaw | null;
}

export const blankRow = (): TimeRow => ({ in: "", out: "", breakMin: 0 });

export const DEFAULT_TIMECARD: TimeCardState = {
  rows: Array.from({ length: MAX_ROWS }, (_, i) =>
    i % 7 < 5 ? { in: "09:00", out: "17:30", breakMin: 30 } : blankRow()),
  period: "weekly",
  hourlyRate: 0,
  state: null,
};

const compact = (t: string) => {
  const m = parseTime(t);
  return m === null ? "" : `${String(Math.floor(m / 60)).padStart(2, "0")}${String(m % 60).padStart(2, "0")}`;
};
const expand = (c: string) => (/^\d{4}$/.test(c) ? `${c.slice(0, 2)}:${c.slice(2)}` : "");

export function encodeTimeCard(s: TimeCardState): string {
  const p = new URLSearchParams();
  p.set("p", s.period === "biweekly" ? "b" : "w");
  if (s.hourlyRate > 0) p.set("rate", String(s.hourlyRate));
  if (s.state) p.set("st", s.state.abbr);
  p.set("d", s.rows.slice(0, MAX_ROWS)
    .map((r) => `${compact(r.in)}-${compact(r.out)}-${Math.round(r.breakMin) || ""}`).join(","));
  return p.toString();
}

export function decodeTimeCard(search: string): TimeCardState {
  const p = new URLSearchParams(search);
  const rate = Number(p.get("rate"));
  const st = p.get("st");
  const d = p.get("d");
  const rows = DEFAULT_TIMECARD.rows;
  return {
    period: p.get("p") === "b" ? "biweekly" : "weekly",
    hourlyRate: Number.isFinite(rate) && rate > 0 ? Math.min(rate, 10000) : 0,
    state: st ? (getStateByAbbr(st) ?? null) : null,
    rows: d === null ? rows : Array.from({ length: MAX_ROWS }, (_, i) => {
      const [a = "", b = "", c = ""] = (d.split(",")[i] ?? "").split("-");
      const br = Number(c);
      return { in: expand(a), out: expand(b), breakMin: Number.isFinite(br) ? Math.min(600, Math.max(0, br)) : 0 };
    }),
  };
}
