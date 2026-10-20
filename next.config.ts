import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { REDIRECTS } from "./lib/redirects";

const nextConfig: NextConfig = {
  // Permanent (308) redirects, all defined in lib/redirects.ts.
  async redirects() {
    return REDIRECTS;
  },
};

/**
 * Sentry wraps the build to upload source maps, so production stack traces point
 * at real lines. Upload is skipped without SENTRY_AUTH_TOKEN, so a plain
 * `npm run build` still works.
 */
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "maxed-labs",
  project: process.env.SENTRY_PROJECT || "wagecoach_web",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // Route browser reports through our own domain so ad blockers do not drop
  // them. `true` picks a random path per build; a fixed "/monitoring" is on
  // blocker lists.
  tunnelRoute: true,
  sourcemaps: { deleteSourcemapsAfterUpload: true },
});
