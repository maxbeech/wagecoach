export const SITE = {
  name: "WageCoach",
  // Canonical host. This must be a host that actually serves the site, because
  // it drives every canonical tag, the sitemap, robots and all JSON-LD URLs.
  // The apex wagecoach.com is not connected yet, so we point at the live
  // Vercel host. When the custom domain is wired in Vercel, flip both lines
  // back to wagecoach.com.
  domain: "wagecoach.vercel.app",
  url: "https://wagecoach.vercel.app",
  tagline: "Check your pay. Recover what you're owed.",
  description:
    "WageCoach helps U.S. workers check their pay and recover unpaid wages. Free overtime, minimum-wage and paycheck calculators, a back-pay estimator that shows what you may be owed, and step-by-step help to file a wage claim in any state — built on the federal FLSA and 2026 state rules for all 50 states and DC.",
  email: "hello@wagecoach.com",
  // The year the baked wage data is effective for. Surfaced in copy + methodology.
  dataYear: 2026,
  // Stable last-updated date for sitemap lastmod (avoids churn on every deploy).
  updated: "2026-06-15",
};
