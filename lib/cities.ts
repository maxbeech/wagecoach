import { getStateByAbbr } from "./states";

// Major U.S. cities/counties that set their OWN minimum wage above their state's.
// 2026 figures verified against city/county .gov ordinance pages and reputable
// trackers. July transitions were checked again on 8 November 2026.
// The headline and calculator seed must use the rate already in force.
// Local rates change often,
// so each page links sources and tells the reader to confirm the current figure.

export interface City {
  slug: string;
  city: string;
  state: string; // 2-letter abbr
  minWage: number;
  note: string;
  source: string;
}

export const CITIES: City[] = [
  { slug: "seattle-wa", city: "Seattle", state: "WA", minWage: 21.30, note: "Effective Jan 1, 2026; a single rate for all employers (size tiers were eliminated in 2025).", source: "https://www.lni.wa.gov/workers-rights/wages/minimum-wage/local-minimum-wage-rates" },
  { slug: "tukwila-wa", city: "Tukwila", state: "WA", minWage: 21.65, note: "Large employers (15+ worldwide or >$2M in city revenue), effective Jan 1, 2026.", source: "https://www.lni.wa.gov/workers-rights/wages/minimum-wage/local-minimum-wage-rates" },
  { slug: "seatac-wa", city: "SeaTac", state: "WA", minWage: 20.74, note: "Hospitality and transportation industry workers, effective Jan 1, 2026.", source: "https://www.lni.wa.gov/workers-rights/wages/minimum-wage/local-minimum-wage-rates" },
  { slug: "new-york-city-ny", city: "New York City", state: "NY", minWage: 17.00, note: "Effective Jan 1, 2026; the same $17.00 rate covers Long Island and Westchester. CPI indexing begins 2027.", source: "https://www.governor.ny.gov/news/money-your-pockets-governor-hochul-reminds-new-yorkers-minimum-wage-increase-january-1" },
  { slug: "los-angeles-ca", city: "Los Angeles (City)", state: "CA", minWage: 18.42, note: "Citywide general rate, effective July 1, 2026 (re-indexes each July 1). Hotel and airport workers have separate, higher rates.", source: "https://wagesla.lacity.gov/" },
  { slug: "los-angeles-county-ca", city: "Los Angeles County", state: "CA", minWage: 18.47, note: "Unincorporated Los Angeles County; $18.47 effective July 1, 2026 (re-indexes each July 1).", source: "https://dcba.lacounty.gov/minimum-wage/" },
  { slug: "san-francisco-ca", city: "San Francisco", state: "CA", minWage: 19.61, note: "General rate effective July 1, 2026 (re-indexes each July 1). A separate rate applies to certain government-supported employees.", source: "https://media.api.sf.gov/documents/2026_Historical_San_Francisco_Minimum_Wage_Rates_M9ynRNo.pdf" },
  { slug: "san-jose-ca", city: "San Jose", state: "CA", minWage: 18.45, note: "Effective Jan 1, 2026; San Jose adjusts each January 1.", source: "https://www.paycor.com/resource-center/articles/california-minimum-wage/" },
  { slug: "oakland-ca", city: "Oakland", state: "CA", minWage: 17.34, note: "Effective Jan 1, 2026; Oakland adjusts each January 1.", source: "https://employers.org/2025/12/29/news-2026-minimum-wages-by-state-city-county-announced/" },
  { slug: "west-hollywood-ca", city: "West Hollywood", state: "CA", minWage: 20.25, note: "General (non-hotel) rate, effective Jan 1, 2026. Hotel workers are higher ($20.87 from July 1, 2026).", source: "https://hrwatchdog.calchamber.com/2026/06/california-local-minimum-wage-increases-for-july-1-2026/" },
  { slug: "mountain-view-ca", city: "Mountain View", state: "CA", minWage: 19.70, note: "Effective Jan 1, 2026; Mountain View adjusts each January 1 by CPI (San Francisco-Oakland-Hayward).", source: "https://econdev.mountainview.gov/resources/city-minimum-wage" },
  { slug: "chicago-il", city: "Chicago", state: "IL", minWage: 17.05, note: "Employers with 4+ employees; effective July 1, 2026 (re-indexes each July 1).", source: "https://www.chicago.gov/city/en/depts/bacp/provdrs/business_support_tools/news/2026/june/minimumwageincreaseandworkersrightsordinances.html" },
  { slug: "denver-co", city: "Denver", state: "CO", minWage: 19.29, note: "Effective Jan 1, 2026 (up from $18.81); re-indexes each January 1.", source: "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Auditors-Office/Denver-Labor/Citywide-Minimum-Wage" },
  { slug: "boulder-county-co", city: "Boulder County", state: "CO", minWage: 16.82, note: "Unincorporated Boulder County, effective Jan 1, 2026. (Edgewater, CO is higher at $18.17.)", source: "https://www.govdocs.com/colorados-new-minimum-wage-rates/" },
  { slug: "flagstaff-az", city: "Flagstaff", state: "AZ", minWage: 18.35, note: "Effective Jan 1, 2026; re-indexes each January 1.", source: "https://flagstaff.az.gov/3520/Minimum-Wage" },
  { slug: "tucson-az", city: "Tucson", state: "AZ", minWage: 15.45, note: "Effective Jan 1, 2026.", source: "https://www.tucsonaz.gov/Departments/Business-Services-Department/Tucson-Minimum-Wage-Act" },
  { slug: "portland-metro-or", city: "Portland Metro", state: "OR", minWage: 16.80, note: "Portland-metro tier (state standard + $1.25), $16.80 since July 1, 2026 (re-indexes each July 1).", source: "https://www.oregon.gov/boli/workers/pages/minimum-wage.aspx" },
  { slug: "montgomery-county-md", city: "Montgomery County", state: "MD", minWage: 18.00, note: "Large employers (51+); effective July 1, 2026 (re-indexes each July 1).", source: "https://www.montgomerycountymd.gov/office-human-rights/minimum-wage-increase" },
  { slug: "minneapolis-mn", city: "Minneapolis", state: "MN", minWage: 16.37, note: "Effective Jan 1, 2026; now a single rate for all employers regardless of size.", source: "https://www.minneapolismn.gov/news/2025/december/minimum-wage/" },
  { slug: "st-paul-mn", city: "St. Paul", state: "MN", minWage: 16.37, note: "Large employers (101+), effective Jan 1, 2026; smaller-employer tiers phase up to $16.37 by July 1, 2026.", source: "https://www.stpaul.gov/departments/human-rights-equal-economic-opportunity/labor-standards-enforcement-and-education/minimum-wage" },
];

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function citiesForState(abbr: string): City[] {
  return CITIES.filter((c) => c.state === abbr.toUpperCase());
}

// The parent state's record (for the state minimum wage + link).
export function cityState(c: City) {
  return getStateByAbbr(c.state);
}
