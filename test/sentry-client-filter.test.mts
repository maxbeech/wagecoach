import { isSyntheticScriptParseError } from "../lib/sentry-client-filter.ts";
import { eq, report } from "./_assert.mts";

eq(isSyntheticScriptParseError({
  exception: {
    values: [{
      type: "SyntaxError",
      value: "Invalid or unexpected token",
      stacktrace: { frames: [{ filename: "app:///9e8abec0754b8ed8/script.js", lineno: 1, colno: 2 }] },
    }],
  },
}), true, "drops the exact crawler-owned script parse signature (colno 2)");

// WAGECOACH_WEB-1 regressed because this exact case — same signature, colno 1
// instead of 2 — was not caught by the original colno === 2 check.
eq(isSyntheticScriptParseError({
  exception: {
    values: [{
      type: "SyntaxError",
      value: "Invalid or unexpected token",
      stacktrace: { frames: [{ filename: "app:///2404c887455fec2a/script.js", lineno: 1, colno: 1 }] },
    }],
  },
}), true, "drops the same signature at colno 1 (the regressed WAGECOACH_WEB-1 occurrence)");

// colno is unreliable across bots/browsers and isn't part of the signature —
// a missing colno should still be dropped as long as lineno/filename/message match.
eq(isSyntheticScriptParseError({
  exception: {
    values: [{
      type: "SyntaxError",
      value: "Invalid or unexpected token",
      stacktrace: { frames: [{ filename: "app:///abc123def456/script.js", lineno: 1 }] },
    }],
  },
}), true, "drops the signature even when colno is absent");

eq(isSyntheticScriptParseError({
  exception: {
    values: [{
      type: "SyntaxError",
      value: "Invalid or unexpected token",
      stacktrace: { frames: [{ filename: "app:///app/page.tsx", lineno: 1, colno: 2 }] },
    }],
  },
}), false, "keeps an application SyntaxError for investigation");

eq(isSyntheticScriptParseError({
  exception: {
    values: [{
      type: "TypeError",
      value: "Cannot read properties of undefined",
      stacktrace: { frames: [{ filename: "app:///9e8abec0754b8ed8/script.js", lineno: 1, colno: 2 }] },
    }],
  },
}), false, "keeps other errors from the same script path");

eq(isSyntheticScriptParseError({
  exception: {
    values: [{
      type: "SyntaxError",
      value: "Invalid or unexpected token",
      stacktrace: { frames: [{ filename: "app:///9e8abec0754b8ed8/script.js", lineno: 4, colno: 1 }] },
    }],
  },
}), false, "keeps a real SyntaxError elsewhere in a bundle chunk (lineno !== 1)");

report("sentry-client-filter");
