// 2026 state minimum-wage, tipped-wage and daily-overtime data — the single
// source of truth for the per-state pages and the calculators.
//
// Minimum wages are the 2026 statewide standard rate (effective Jan 1, 2026
// unless a different effective date is noted), cross-checked across GovDocs,
// Paycom, Paycor and Ogletree (June 2026). Many cities/counties set HIGHER local
// minimums — those are noted but not enumerated.
//
//  - `noStateLaw`: the state has no minimum-wage statute (or one below $7.25), so
//    the federal $7.25 applies to FLSA-covered employers.
//  - `tipCreditAllowed=false` (AK, CA, MN, MT, NV, OR, WA): the employer must pay
//    the FULL minimum wage in cash before tips — no tip credit.
//  - `tippedCashWage`: the required minimum CASH wage for tipped employees. For
//    no-tip-credit states this equals the minimum wage; null = the state sets its
//    own figure that varies/should be confirmed (the tip calculator still works
//    off the minimum wage).
//  - `dailyOt`: states that require daily overtime on top of the FLSA weekly rule.

export interface StateCore {
  slug: string;
  name: string;
  abbr: string;
  minWage: number;
  minWageNote?: string;
  noStateLaw?: boolean;
  tipCreditAllowed: boolean;
  tippedCashWage: number | null;
  tippedNote?: string;
  dailyOt: { afterHours: number; note: string } | null;
  doubleTime?: string;
}

const CA_DT =
  "Double time (2×) applies over 12 hours in a workday. On the 7th consecutive day worked in a week, the first 8 hours are 1.5× and hours beyond 8 are 2×.";

export const STATE_CORE: StateCore[] = [
  { slug: "alabama", name: "Alabama", abbr: "AL", minWage: 7.25, noStateLaw: true, minWageNote: "Alabama has no state minimum-wage law, so the federal $7.25 applies.", tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "alaska", name: "Alaska", abbr: "AK", minWage: 13.00, minWageNote: "Rises to $14.00 on July 1, 2026 under the 2024 ballot measure (then $15.00 in 2027).", tipCreditAllowed: false, tippedCashWage: 13.00, dailyOt: { afterHours: 8, note: "Alaska requires 1.5× over 8 hours/day and over 40/week (employers with 4+ employees)." } },
  { slug: "arizona", name: "Arizona", abbr: "AZ", minWage: 15.15, minWageNote: "Indexed to inflation. Flagstaff and Tucson set higher local minimums.", tipCreditAllowed: true, tippedCashWage: 12.15, tippedNote: "Tip credit up to $3.00.", dailyOt: null },
  { slug: "arkansas", name: "Arkansas", abbr: "AR", minWage: 11.00, minWageNote: "Applies to employers with 4+ employees.", tipCreditAllowed: true, tippedCashWage: 2.63, dailyOt: null },
  { slug: "california", name: "California", abbr: "CA", minWage: 16.90, minWageNote: "Many CA cities are higher (e.g. West Hollywood, Emeryville); fast-food chains are $20.00 and some healthcare employers higher.", tipCreditAllowed: false, tippedCashWage: 16.90, dailyOt: { afterHours: 8, note: "California requires 1.5× over 8 hours/day and over 40/week." }, doubleTime: CA_DT },
  { slug: "colorado", name: "Colorado", abbr: "CO", minWage: 15.16, minWageNote: "Denver and some counties set higher local minimums; indexed annually.", tipCreditAllowed: true, tippedCashWage: 12.14, tippedNote: "Tip credit up to $3.02.", dailyOt: { afterHours: 12, note: "Colorado requires 1.5× over 12 hours/day, over 12 consecutive hours, or over 40/week — whichever yields the most (COMPS Order)." } },
  { slug: "connecticut", name: "Connecticut", abbr: "CT", minWage: 16.94, minWageNote: "Indexed to the employment-cost index each January.", tipCreditAllowed: true, tippedCashWage: 6.38, tippedNote: "$6.38 for most tipped staff; $8.23 for hotel/restaurant service employees.", dailyOt: null },
  { slug: "delaware", name: "Delaware", abbr: "DE", minWage: 15.00, tipCreditAllowed: true, tippedCashWage: 2.23, dailyOt: null },
  { slug: "district-of-columbia", name: "District of Columbia", abbr: "DC", minWage: 17.95, minWageNote: "Highest in the nation; DC re-indexes again on July 1, 2026.", tipCreditAllowed: true, tippedCashWage: 10.00, tippedNote: "DC is phasing out its tip credit under Initiative 82; confirm the current tipped cash wage.", dailyOt: null },
  { slug: "florida", name: "Florida", abbr: "FL", minWage: 14.00, minWageNote: "Rises to $15.00 on September 30, 2026 under the Amendment 2 schedule.", tipCreditAllowed: true, tippedCashWage: 10.98, tippedNote: "Tip credit fixed at $3.02 below the state minimum.", dailyOt: null },
  { slug: "georgia", name: "Georgia", abbr: "GA", minWage: 7.25, minWageNote: "Georgia's own rate is $5.15, but the federal $7.25 applies to FLSA-covered employers.", tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "hawaii", name: "Hawaii", abbr: "HI", minWage: 16.00, minWageNote: "Scheduled to reach $18.00 in 2028.", tipCreditAllowed: true, tippedCashWage: 14.75, tippedNote: "Tip credit up to $1.25, and only if cash wage + tips is at least $7.00 above the minimum.", dailyOt: null },
  { slug: "idaho", name: "Idaho", abbr: "ID", minWage: 7.25, tipCreditAllowed: true, tippedCashWage: 3.35, dailyOt: null },
  { slug: "illinois", name: "Illinois", abbr: "IL", minWage: 15.00, minWageNote: "Chicago and Cook County set higher local minimums.", tipCreditAllowed: true, tippedCashWage: 9.00, tippedNote: "Tipped cash wage is 60% of the state minimum.", dailyOt: null },
  { slug: "indiana", name: "Indiana", abbr: "IN", minWage: 7.25, tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "iowa", name: "Iowa", abbr: "IA", minWage: 7.25, tipCreditAllowed: true, tippedCashWage: 4.35, dailyOt: null },
  { slug: "kansas", name: "Kansas", abbr: "KS", minWage: 7.25, tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "kentucky", name: "Kentucky", abbr: "KY", minWage: 7.25, tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "louisiana", name: "Louisiana", abbr: "LA", minWage: 7.25, noStateLaw: true, minWageNote: "Louisiana has no state minimum-wage law, so the federal $7.25 applies.", tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "maine", name: "Maine", abbr: "ME", minWage: 15.10, minWageNote: "Indexed to inflation; Portland is higher.", tipCreditAllowed: true, tippedCashWage: 7.55, tippedNote: "Tipped cash wage is half the state minimum.", dailyOt: null },
  { slug: "maryland", name: "Maryland", abbr: "MD", minWage: 15.00, minWageNote: "Montgomery County sets a higher local minimum.", tipCreditAllowed: true, tippedCashWage: 3.63, dailyOt: null },
  { slug: "massachusetts", name: "Massachusetts", abbr: "MA", minWage: 15.00, tipCreditAllowed: true, tippedCashWage: 6.75, dailyOt: null },
  { slug: "michigan", name: "Michigan", abbr: "MI", minWage: 13.73, minWageNote: "Rising on a court-ordered schedule toward a higher rate.", tipCreditAllowed: true, tippedCashWage: 5.49, dailyOt: null },
  { slug: "minnesota", name: "Minnesota", abbr: "MN", minWage: 11.41, minWageNote: "Minneapolis and St. Paul set higher local minimums.", tipCreditAllowed: false, tippedCashWage: 11.41, dailyOt: null },
  { slug: "mississippi", name: "Mississippi", abbr: "MS", minWage: 7.25, noStateLaw: true, minWageNote: "Mississippi has no state minimum-wage law, so the federal $7.25 applies.", tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "missouri", name: "Missouri", abbr: "MO", minWage: 15.00, minWageNote: "Raised to $15.00 on Jan 1, 2026 under Proposition A.", tipCreditAllowed: true, tippedCashWage: 7.50, tippedNote: "Tipped cash wage is half the state minimum.", dailyOt: null },
  { slug: "montana", name: "Montana", abbr: "MT", minWage: 10.85, minWageNote: "Businesses not covered by the FLSA with ≤ $110,000 in gross sales may pay $4.00.", tipCreditAllowed: false, tippedCashWage: 10.85, dailyOt: null },
  { slug: "nebraska", name: "Nebraska", abbr: "NE", minWage: 15.00, minWageNote: "Indexed to inflation starting in 2027.", tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "nevada", name: "Nevada", abbr: "NV", minWage: 12.00, minWageNote: "Single statewide rate; Nevada re-indexes on July 1. No tip credit allowed.", tipCreditAllowed: false, tippedCashWage: 12.00, dailyOt: { afterHours: 8, note: "Nevada requires 1.5× over 8 hours in a 24-hour period — but only for employees earning less than 1.5× the minimum wage — and over 40/week." } },
  { slug: "new-hampshire", name: "New Hampshire", abbr: "NH", minWage: 7.25, minWageNote: "New Hampshire adopts the federal $7.25.", tipCreditAllowed: true, tippedCashWage: 3.27, tippedNote: "Tipped cash wage is 45% of the minimum.", dailyOt: null },
  { slug: "new-jersey", name: "New Jersey", abbr: "NJ", minWage: 15.92, minWageNote: "Seasonal and small (≤5) employers: $14.93. Indexed annually.", tipCreditAllowed: true, tippedCashWage: 6.05, dailyOt: null },
  { slug: "new-mexico", name: "New Mexico", abbr: "NM", minWage: 12.00, minWageNote: "Santa Fe, Las Cruces and Albuquerque set higher local minimums.", tipCreditAllowed: true, tippedCashWage: 3.00, dailyOt: null },
  { slug: "new-york", name: "New York", abbr: "NY", minWage: 16.00, minWageNote: "$17.00 in NYC, Long Island and Westchester County; $16.00 in the rest of the state.", tipCreditAllowed: true, tippedCashWage: null, tippedNote: "Tipped cash wage varies by region and industry (e.g. NYC food-service ~$11.35, service employees ~$14.20).", dailyOt: null },
  { slug: "north-carolina", name: "North Carolina", abbr: "NC", minWage: 7.25, tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "north-dakota", name: "North Dakota", abbr: "ND", minWage: 7.25, tipCreditAllowed: true, tippedCashWage: 4.86, dailyOt: null },
  { slug: "ohio", name: "Ohio", abbr: "OH", minWage: 11.00, minWageNote: "Employers grossing under $394,000 may pay the federal $7.25.", tipCreditAllowed: true, tippedCashWage: 5.50, dailyOt: null },
  { slug: "oklahoma", name: "Oklahoma", abbr: "OK", minWage: 7.25, tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "oregon", name: "Oregon", abbr: "OR", minWage: 15.05, minWageNote: "Standard $15.05; Portland metro $16.30; nonurban counties $14.05. Re-indexes July 1.", tipCreditAllowed: false, tippedCashWage: 15.05, dailyOt: null },
  { slug: "pennsylvania", name: "Pennsylvania", abbr: "PA", minWage: 7.25, tipCreditAllowed: true, tippedCashWage: 2.83, dailyOt: null },
  { slug: "rhode-island", name: "Rhode Island", abbr: "RI", minWage: 16.00, tipCreditAllowed: true, tippedCashWage: 3.89, dailyOt: null },
  { slug: "south-carolina", name: "South Carolina", abbr: "SC", minWage: 7.25, noStateLaw: true, minWageNote: "South Carolina has no state minimum-wage law, so the federal $7.25 applies.", tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "south-dakota", name: "South Dakota", abbr: "SD", minWage: 11.85, minWageNote: "Indexed to inflation.", tipCreditAllowed: true, tippedCashWage: 5.93, dailyOt: null },
  { slug: "tennessee", name: "Tennessee", abbr: "TN", minWage: 7.25, noStateLaw: true, minWageNote: "Tennessee has no state minimum-wage law, so the federal $7.25 applies.", tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "texas", name: "Texas", abbr: "TX", minWage: 7.25, tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "utah", name: "Utah", abbr: "UT", minWage: 7.25, tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "vermont", name: "Vermont", abbr: "VT", minWage: 14.42, minWageNote: "Indexed to inflation.", tipCreditAllowed: true, tippedCashWage: 7.21, tippedNote: "Tipped cash wage is half the state minimum.", dailyOt: null },
  { slug: "virginia", name: "Virginia", abbr: "VA", minWage: 12.77, minWageNote: "Indexed to inflation.", tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
  { slug: "washington", name: "Washington", abbr: "WA", minWage: 17.13, minWageNote: "Seattle, SeaTac, Tukwila, Renton and Burien set higher local minimums.", tipCreditAllowed: false, tippedCashWage: 17.13, dailyOt: null },
  { slug: "west-virginia", name: "West Virginia", abbr: "WV", minWage: 8.75, minWageNote: "Applies to employers with 6+ non-exempt employees; others follow the federal $7.25.", tipCreditAllowed: true, tippedCashWage: 6.13, dailyOt: null },
  { slug: "wisconsin", name: "Wisconsin", abbr: "WI", minWage: 7.25, tipCreditAllowed: true, tippedCashWage: 2.33, dailyOt: null },
  { slug: "wyoming", name: "Wyoming", abbr: "WY", minWage: 7.25, minWageNote: "Wyoming's own rate is $5.15, but the federal $7.25 applies to FLSA-covered employers.", tipCreditAllowed: true, tippedCashWage: 2.13, dailyOt: null },
];
