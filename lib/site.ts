export const SITE = {
  name: "WageCalc HQ",
  // Canonical host. This must be a host that actually serves the site, because
  // it drives every canonical tag, the sitemap, robots and all JSON-LD URLs.
  // The apex wagecalchq.com is not connected yet, so we point at the live
  // Vercel host. When the custom domain is wired in Vercel, flip both lines
  // back to wagecalchq.com.
  domain: "wagecalchq.vercel.app",
  url: "https://wagecalchq.vercel.app",
  tagline: "Free overtime, minimum wage & paycheck calculators",
  description:
    "Free U.S. wage & hour calculators. Work out overtime and time-and-a-half pay, look up the 2026 minimum wage and tipped wage for your state, check final-paycheck deadlines, PTO payout and exempt-salary thresholds, with the federal FLSA and state rules shown for all 50 states and DC.",
  email: "hello@wagecalchq.com",
  // The year the baked wage data is effective for. Surfaced in copy + methodology.
  dataYear: 2026,
  // Stable last-updated date for sitemap lastmod (avoids churn on every deploy).
  updated: "2026-06-15",
};
