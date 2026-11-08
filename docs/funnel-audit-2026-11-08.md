# Correct city rates on search pages — 8 November 2026

The portfolio scan found zero search clicks on 66 impressions in the current 28-day window, with San Francisco the leading known city query destination. Live HTML still advertised $19.18 per hour and a future July 2026 rise, although the official current rate is $19.61. That record also seeds the pay calculator. The same stale transition existed for Los Angeles, Chicago and Montgomery County.

Correct the centrally held city records, not separate copies in page copy or calculator code:

| City / scope | Previous headline | Rate in force from 1 July 2026 |
|---|---:|---:|
| San Francisco, general rate | $19.18 | $19.61 |
| Los Angeles City, general rate | $17.87 | $18.42 |
| Chicago, employers with 4+ employees | $16.60 | $17.05 |
| Montgomery County, employers with 51+ employees | $17.65 | $18.00 |

Sources:

- [San Francisco historical rates](https://media.api.sf.gov/documents/2026_Historical_San_Francisco_Minimum_Wage_Rates_M9ynRNo.pdf)
- [Los Angeles Office of Wage Standards](https://wagesla.lacity.gov/)
- [Chicago official announcement](https://www.chicago.gov/city/en/depts/bacp/provdrs/business_support_tools/news/2026/june/minimumwageincreaseandworkersrightsordinances.html) (direct browser access restricted; the existing cited transition and the city's republished announcement agree)
- [Montgomery County government schedule](https://assets.montgomerycountymd.gov/files/2026-06/FY27-MWS.pdf)

All titles, city/state listings and pay-calculator seeds read the same CITIES registry. Existing specialised employer/industry limitations remain stated. Full npm test passed, including a regression test added to the normal test command for the four rates and shared registry identity. Production verification follows deployment; search uplift remains unproven until a recrawl and new real traffic.
