import { CITIES, getCity, citiesForState } from "../lib/cities.ts";
import { eq, ok, report } from "./_assert.mts";

// Published July 2026 transitions must reach every consumer of the city registry,
// including search titles, city/state lists and the pay calculator's hourly seed.
for (const [slug, expected] of [
  ["san-francisco-ca", 19.61], ["los-angeles-ca", 18.42],
  ["chicago-il", 17.05], ["montgomery-county-md", 18],
] as const) {
  const city = getCity(slug)!;
  eq(city.minWage, expected, `${slug}: rate in force after 1 July 2026`);
  ok(city.note.includes("effective July 1, 2026"), `${slug}: note describes an effective, not future, change`);
  eq(CITIES.find((row) => row.slug === slug), city, `${slug}: shared city registry identity`);
  ok(citiesForState(city.state).includes(city), `${slug}: state index shares the corrected row`);
}
report("city-rates");
