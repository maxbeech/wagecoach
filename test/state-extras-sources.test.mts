import { STATE_EXTRAS } from "../lib/state-extras.ts";
import { eq, ok, report } from "./_assert.mts";

// Final-pay and break rules must cite official pages only (.gov), never payroll blogs.
eq(Object.keys(STATE_EXTRAS).length, 51, "50 states + DC");
for (const [abbr, x] of Object.entries(STATE_EXTRAS)) {
  ok(x.sources.length > 0, `${abbr}: has sources`);
  for (const url of x.sources) {
    ok(/^https:\/\/([a-z0-9-]+\.)*(gov|state\.[a-z]{2}\.us)\//.test(url) || /^https:\/\/[a-z0-9.-]+\.(gov|us)\//.test(url), `${abbr}: ${url} is an official source`);
  }
}
report("state-extras-sources");
