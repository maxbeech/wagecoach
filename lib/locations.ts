import { STATES, getStateByAbbr } from "./states";
import { CITIES, getCity } from "./cities";

// A place someone can watch for wage changes: a state, or one of the cities and
// counties that set their own minimum wage. Keys are stable strings so they can
// sit in a URL, a form and a Postgres text[] unchanged:
//   "state:CA"          -> lib/states.ts by abbreviation
//   "city:seattle-wa"   -> lib/cities.ts by slug
// Anything else is rejected, so stored data can only ever hold real places.

export type LocationKey = `state:${string}` | `city:${string}`;

export interface WatchLocation {
  key: LocationKey;
  label: string;      // "California" / "Seattle, WA"
  stateAbbr: string;  // the state a city sits in, so a city watcher also hears about state changes
}

export function stateKey(abbr: string): LocationKey {
  return `state:${abbr.toUpperCase()}`;
}

export function cityKey(slug: string): LocationKey {
  return `city:${slug}`;
}

/** Resolve a key to a real place, or null when it names nothing we know. */
export function resolveLocation(raw: unknown): WatchLocation | null {
  if (typeof raw !== "string") return null;
  const [kind, id] = raw.trim().split(":");
  if (!id) return null;
  if (kind === "state") {
    const s = getStateByAbbr(id);
    return s ? { key: stateKey(s.abbr), label: s.name, stateAbbr: s.abbr } : null;
  }
  if (kind === "city") {
    const c = getCity(id.toLowerCase());
    return c ? { key: cityKey(c.slug), label: `${c.city}, ${c.state}`, stateAbbr: c.state } : null;
  }
  return null;
}

/** Clean a user-supplied list: real places only, no duplicates, at most `max`. */
export function parseLocations(raw: unknown, max: number): WatchLocation[] {
  const list = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(",") : [];
  const out: WatchLocation[] = [];
  for (const item of list) {
    const loc = resolveLocation(item);
    if (loc && !out.some((o) => o.key === loc.key)) out.push(loc);
    if (out.length >= Math.max(0, max)) break;
  }
  return out;
}

/**
 * The scopes a location is affected by. A city watcher needs the city's own
 * changes AND its state's, because a state increase can overtake a city rate.
 */
export function affectingKeys(loc: WatchLocation): LocationKey[] {
  return loc.key.startsWith("city:") ? [loc.key, stateKey(loc.stateAbbr)] : [loc.key];
}

/** Every watchable place, states first then cities, for pickers. */
export const ALL_LOCATIONS: WatchLocation[] = [
  ...STATES.map((s) => ({ key: stateKey(s.abbr), label: s.name, stateAbbr: s.abbr })),
  ...CITIES.map((c) => ({ key: cityKey(c.slug), label: `${c.city}, ${c.state}`, stateAbbr: c.state })),
];
