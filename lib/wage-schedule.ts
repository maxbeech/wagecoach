import { SCHEDULED_CHANGES, type ScheduledChange } from "./wage-schedule-data";
import { affectingKeys, cityKey, resolveLocation, stateKey, type LocationKey, type WatchLocation } from "./locations";

// Reads the cited schedule in lib/wage-schedule-data.ts. Pure: the caller passes
// "today" as YYYY-MM-DD, so tests and the daily job agree on what is due.

export type { ScheduledChange };

const DAY_MS = 86_400_000;

/** A stable id for one change, used to log that an alert about it went out. */
export function changeKey(c: ScheduledChange): string {
  return `${c.scope}:${c.key}:${c.field}:${c.effective}`;
}

export function changeLocationKey(c: ScheduledChange): LocationKey {
  return c.scope === "state" ? stateKey(c.key) : cityKey(c.key);
}

/** Whole days from `today` to `date` (both YYYY-MM-DD). Negative once it has passed. */
export function daysUntil(date: string, today: string): number {
  const a = Date.parse(`${today}T00:00:00Z`);
  const b = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return Number.NaN;
  return Math.round((b - a) / DAY_MS);
}

/**
 * A tipped-wage change that just repeats the minimum wage (states with no tip
 * credit) adds nothing for a reader, so lists and alerts leave it out.
 */
export function isRedundant(c: ScheduledChange, schedule: ScheduledChange[] = SCHEDULED_CHANGES): boolean {
  return c.field === "tippedCashWage" && schedule.some((m) =>
    m.field === "minWage" && m.scope === c.scope && m.key === c.key && m.effective === c.effective && m.value === c.value);
}

/** Changes that affect a place (its own and, for a city, its state's), soonest first. */
export function changesFor(loc: WatchLocation, schedule: ScheduledChange[] = SCHEDULED_CHANGES): ScheduledChange[] {
  const keys = new Set<string>(affectingKeys(loc));
  return schedule
    .filter((c) => keys.has(changeLocationKey(c)) && !isRedundant(c, schedule))
    .sort((a, b) => a.effective.localeCompare(b.effective));
}

/** Changes on or after `today`, optionally within `horizonDays`. */
export function upcomingFor(loc: WatchLocation, today: string, horizonDays = Infinity, schedule: ScheduledChange[] = SCHEDULED_CHANGES): ScheduledChange[] {
  return changesFor(loc, schedule).filter((c) => {
    const d = daysUntil(c.effective, today);
    return d >= 0 && d <= horizonDays;
  });
}

/** The next announced change for a location key, or null. Used by state and city pages. */
export function nextChange(rawKey: string, today: string, schedule: ScheduledChange[] = SCHEDULED_CHANGES): ScheduledChange | null {
  const loc = resolveLocation(rawKey);
  if (!loc) return null;
  // On a page about a place, only that place's own changes are "its" changes.
  return changesFor(loc, schedule).find((c) => changeLocationKey(c) === loc.key && daysUntil(c.effective, today) >= 0) ?? null;
}

/**
 * Which reminder a change is due for today. With leads [60, 30, 7, 0] a change
 * 5 days out is in the 7-day bucket; 61 days out is in none. Picking the
 * smallest bucket that still covers it means a late signup gets one timely
 * notice, not a burst of every reminder it missed.
 */
export function dueBucket(days: number, leadDays: number[]): number | null {
  if (!Number.isFinite(days) || days < 0) return null;
  const covering = leadDays.filter((l) => l >= days);
  return covering.length ? Math.min(...covering) : null;
}

export interface DueAlert {
  change: ScheduledChange;
  location: WatchLocation;
  leadDays: number;
}

/** Every alert due today for one subscriber's places, de-duplicated by change. */
export function dueAlerts(locations: WatchLocation[], leadDays: number[], today: string, schedule: ScheduledChange[] = SCHEDULED_CHANGES): DueAlert[] {
  const seen = new Set<string>();
  const out: DueAlert[] = [];
  for (const loc of locations) {
    for (const change of changesFor(loc, schedule)) {
      const bucket = dueBucket(daysUntil(change.effective, today), leadDays);
      const k = changeKey(change);
      if (bucket === null || seen.has(k)) continue;
      seen.add(k);
      out.push({ change, location: loc, leadDays: bucket });
    }
  }
  return out;
}

/** Today's date as YYYY-MM-DD in U.S. Eastern time, which is when most changes take effect. */
export function todayIso(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
