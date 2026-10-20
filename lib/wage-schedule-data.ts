// Announced minimum-wage changes (cited). Single source for upcoming-change notices and wage alerts.
// Only officially announced figures; never estimates. Verified 2026-10-20.
// Window: effective 2026-07-01 through 2027-12-31. A 2027 indexed figure that has not been
// announced is deliberately absent (e.g. VT, NE, DC Jul 2027, FL 2028, LA/SF Jul 2027,
// San Jose/Oakland/Mountain View/Tukwila/SeaTac/Tucson/Boulder County Jan 2027).
// Where a state has no tip credit, tippedCashWage equals minWage and is listed explicitly.
export interface ScheduledChange {
  scope: "state" | "city";
  key: string;          // state abbr (e.g. "CA") or city slug from lib/cities.ts (e.g. "seattle-wa")
  field: "minWage" | "tippedCashWage";
  value: number;        // dollars per hour
  effective: string;    // YYYY-MM-DD
  source: string;       // URL
  note?: string;        // short qualifier, e.g. "employers with 15+ employees"
}

const AK = "https://labor.alaska.gov/news/2025/news25-11.htm";
const AZ = "https://www.stirnitzkelaw.com/index.php/2026/10/02/arizonas-minimum-wage-is-increasing-in-2027-what-employers-should-do-now/";
const CA = "https://www.dir.ca.gov/DIRNews/2026/2026-66.html";
const CO = "https://members.employerscouncil.org/blogs/jacqueline-talbot/2026/08/19/colorado-2027-minimum-wages";
const DC = "https://does.dc.gov/sites/default/files/dc/sites/does/publication/attachments/2026%20Minimum%20Wage%20Increase%20Notice.pdf";
const FL = "https://www.lowndes-law.com/newsroom/insights/floridas-minimum-wage-reaches-15-00-on-september-30-2026";
const MI = "https://www.michigan.gov/leo/bureaus-agencies/ber/Wage-and-Hour/min-wage";
const MI_TIP = "https://www.sbam.org/notice-to-employers-michigans-minimum-wage-will-increase-january-1/";
const ME = "https://www.maine.gov/labor/docs/2027/posters/Spanish_minimum_wage.pdf";
const MN = "https://dli.mn.gov/news/minimum-wage-rate-adjusted-inflation-jan-1-2027";
const MT = "https://erd.dli.mt.gov/labor-standards/wage-and-hour-payment-act/state-minimum-wage";
const NJ = "https://www.nj.gov/labor/lwdhome/press/2026/20260929_min_wage.shtml";
const OH = "https://dam.assets.ohio.gov/image/upload/com.ohio.gov/DICO/WageAndHour/2027_Minumum_Wage_Poster.pdf";
const OR = "https://www.oregon.gov/boli/workers/pages/minimum-wage.aspx";
const RI = "https://webserver.rilegislature.gov/Statutes/TITLE28/28-12/28-12-3.htm";
const SD = "https://dlr.sd.gov/employment_laws/minimum_wage.aspx";
const VA = "https://law.lis.virginia.gov/vacode/title40.1/chapter3/section40.1-28.10/";
const WA = "https://www.opb.org/article/2026/10/02/washington-nation-high-minimum-wage-rising-in-2027/";
const EXPERIAN = "https://www.experian.com/blogs/employer-services/2027-state-by-state-local-minimum-wage-changes-and-posting-updates/";
const NOTIP = "No tip credit; tipped cash wage equals the minimum wage";

export const SCHEDULED_CHANGES: ScheduledChange[] = [
  // ---- States ----
  { scope: "state", key: "AK", field: "minWage", value: 14.00, effective: "2026-07-01", source: AK, note: "Second step of the 2024 ballot measure" },
  { scope: "state", key: "AK", field: "tippedCashWage", value: 14.00, effective: "2026-07-01", source: AK, note: NOTIP },
  { scope: "state", key: "AK", field: "minWage", value: 15.00, effective: "2027-07-01", source: AK, note: "Last step of the 2024 ballot measure" },
  { scope: "state", key: "AK", field: "tippedCashWage", value: 15.00, effective: "2027-07-01", source: AK, note: NOTIP },
  { scope: "state", key: "AZ", field: "minWage", value: 15.65, effective: "2027-01-01", source: AZ, note: "Annual inflation adjustment" },
  { scope: "state", key: "AZ", field: "tippedCashWage", value: 12.65, effective: "2027-01-01", source: AZ, note: "Minimum wage less the $3.00 maximum tip credit" },
  { scope: "state", key: "CA", field: "minWage", value: 17.40, effective: "2027-01-01", source: CA, note: "Annual inflation adjustment; fast-food and local rates differ" },
  { scope: "state", key: "CA", field: "tippedCashWage", value: 17.40, effective: "2027-01-01", source: CA, note: NOTIP },
  { scope: "state", key: "CO", field: "minWage", value: 15.71, effective: "2027-01-01", source: CO, note: "Annual inflation adjustment" },
  { scope: "state", key: "CO", field: "tippedCashWage", value: 12.69, effective: "2027-01-01", source: CO, note: "$3.02 tip credit" },
  { scope: "state", key: "CT", field: "minWage", value: 17.48, effective: "2027-01-01", source: "https://portal.ct.gov/governor/news/press-releases/2026/08-2026/governor-lamont-announces-minimum-wage-will-increase", note: "Annual adjustment" },
  { scope: "state", key: "DC", field: "minWage", value: 18.40, effective: "2026-07-01", source: DC, note: "Annual inflation adjustment; all employers" },
  { scope: "state", key: "DC", field: "tippedCashWage", value: 10.30, effective: "2026-07-01", source: DC, note: "Employer must make up any shortfall to the full minimum" },
  { scope: "state", key: "FL", field: "minWage", value: 15.00, effective: "2026-09-30", source: FL, note: "Last step of Amendment 2" },
  { scope: "state", key: "FL", field: "tippedCashWage", value: 11.98, effective: "2026-09-30", source: FL, note: "$3.02 tip credit" },
  { scope: "state", key: "MI", field: "minWage", value: 15.00, effective: "2027-01-01", source: MI, note: "Set by state law" },
  { scope: "state", key: "MI", field: "tippedCashWage", value: 6.30, effective: "2027-01-01", source: MI_TIP, note: "42% of the minimum wage" },
  { scope: "state", key: "ME", field: "minWage", value: 15.70, effective: "2027-01-01", source: ME, note: "Annual inflation adjustment" },
  { scope: "state", key: "ME", field: "tippedCashWage", value: 7.85, effective: "2027-01-01", source: ME, note: "Direct wage for service employees (half the minimum)" },
  { scope: "state", key: "MN", field: "minWage", value: 11.87, effective: "2027-01-01", source: MN, note: "Annual inflation adjustment" },
  { scope: "state", key: "MN", field: "tippedCashWage", value: 11.87, effective: "2027-01-01", source: MN, note: NOTIP },
  { scope: "state", key: "MT", field: "minWage", value: 11.20, effective: "2027-01-01", source: MT, note: "Businesses over $110,000 in gross sales or FLSA-covered" },
  { scope: "state", key: "MT", field: "tippedCashWage", value: 11.20, effective: "2027-01-01", source: MT, note: NOTIP },
  { scope: "state", key: "NJ", field: "minWage", value: 16.48, effective: "2027-01-01", source: NJ, note: "Most employers; seasonal and small (under 6 employees) employers $16.25" },
  { scope: "state", key: "NJ", field: "tippedCashWage", value: 6.61, effective: "2027-01-01", source: NJ, note: "Maximum tip credit stays $9.87" },
  { scope: "state", key: "OH", field: "minWage", value: 11.40, effective: "2027-01-01", source: OH, note: "Employers grossing over the threshold; others pay federal $7.25" },
  { scope: "state", key: "OH", field: "tippedCashWage", value: 5.70, effective: "2027-01-01", source: OH },
  { scope: "state", key: "OR", field: "minWage", value: 15.55, effective: "2026-07-01", source: OR, note: "Standard rate; non-urban counties pay $14.55" },
  { scope: "state", key: "OR", field: "tippedCashWage", value: 15.55, effective: "2026-07-01", source: OR, note: NOTIP },
  { scope: "state", key: "RI", field: "minWage", value: 17.00, effective: "2027-01-01", source: RI, note: "Set by state law; tipped cash wage stays $3.89" },
  { scope: "state", key: "SD", field: "minWage", value: 12.30, effective: "2027-01-01", source: SD, note: "Annual inflation adjustment" },
  { scope: "state", key: "SD", field: "tippedCashWage", value: 6.15, effective: "2027-01-01", source: SD },
  { scope: "state", key: "VA", field: "minWage", value: 13.75, effective: "2027-01-01", source: VA, note: "Set by state law; $15.00 follows in 2028" },
  { scope: "state", key: "WA", field: "minWage", value: 17.73, effective: "2027-01-01", source: WA, note: "Annual inflation adjustment" },
  { scope: "state", key: "WA", field: "tippedCashWage", value: 17.73, effective: "2027-01-01", source: WA, note: NOTIP },
  // ---- Cities and counties (slugs from lib/cities.ts) ----
  { scope: "city", key: "seattle-wa", field: "minWage", value: 22.14, effective: "2027-01-01", source: "https://www.fox13seattle.com/news/seattle-minimum-wage-increase", note: "All employers" },
  { scope: "city", key: "los-angeles-ca", field: "minWage", value: 18.42, effective: "2026-07-01", source: "https://www.dwt.com/blogs/employment-labor-and-benefits/2026/06/california-local-minimum-wage-increases-july-2026", note: "General citywide rate" },
  { scope: "city", key: "los-angeles-county-ca", field: "minWage", value: 18.47, effective: "2026-07-01", source: "https://hrcalifornia.calchamber.com/articles/california-local-minimum-wage-increases-for-july-1-2026", note: "Unincorporated county" },
  { scope: "city", key: "san-francisco-ca", field: "minWage", value: 19.61, effective: "2026-07-01", source: "https://www.dwt.com/blogs/employment-labor-and-benefits/2026/06/california-local-minimum-wage-increases-july-2026" },
  { scope: "city", key: "west-hollywood-ca", field: "minWage", value: 20.94, effective: "2027-01-01", source: "https://www.nixonpeabody.com/insights/alerts/2026/10/12/california-localities-to-raise-the-minimum-wage-in-2027", note: "Non-hotel rate; hotel workers are paid more" },
  { scope: "city", key: "chicago-il", field: "minWage", value: 17.05, effective: "2026-07-01", source: "https://hrsource.org/HRS/Articles/2026/06/09/1-July-1--2026--Chicago-Wage-and-Fair-Workweek-Changes-", note: "Employers with 4+ employees" },
  { scope: "city", key: "chicago-il", field: "tippedCashWage", value: 12.96, effective: "2026-07-01", source: "https://hrsource.org/HRS/Articles/2026/06/09/1-July-1--2026--Chicago-Wage-and-Fair-Workweek-Changes-", note: "Tip credit is being phased down" },
  { scope: "city", key: "denver-co", field: "minWage", value: 19.84, effective: "2027-01-01", source: "https://news.bloombergtax.com/payroll/denver-minimum-wage-rising-55-cents-for-2027", note: "Annual inflation adjustment" },
  { scope: "city", key: "denver-co", field: "tippedCashWage", value: 16.82, effective: "2027-01-01", source: "https://news.bloombergtax.com/payroll/denver-minimum-wage-rising-55-cents-for-2027", note: "Food and beverage workers only; $3.02 tip credit" },
  { scope: "city", key: "flagstaff-az", field: "minWage", value: 18.95, effective: "2027-01-01", source: "https://www.kold.com/2026/09/15/flagstaffs-minimum-wage-rise-2027/", note: "Tipped staff get the full rate" },
  { scope: "city", key: "portland-metro-or", field: "minWage", value: 16.80, effective: "2026-07-01", source: OR, note: "Inside the Portland urban growth boundary" },
  { scope: "city", key: "montgomery-county-md", field: "minWage", value: 18.00, effective: "2026-07-01", source: "https://www.montgomerycountymd.gov/office-human-rights/minimum-wage-increase", note: "Employers with 51+ employees" },
  { scope: "city", key: "minneapolis-mn", field: "minWage", value: 17.02, effective: "2027-01-01", source: EXPERIAN, note: "Single rate for all employers" },
  { scope: "city", key: "st-paul-mn", field: "minWage", value: 17.02, effective: "2027-01-01", source: "https://stpaul.gov/news/announcing-city-saint-paul-minimum-wage-rates-2027", note: "Employers with 101+ employees; smaller employers follow in July" },
];
