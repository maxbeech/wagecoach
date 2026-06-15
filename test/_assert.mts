// Tiny zero-dependency assert helper for the tsx test files.
let passed = 0;
const failures: string[] = [];

export function ok(cond: boolean, msg: string) {
  if (cond) passed++;
  else failures.push(msg);
}

export function eq(actual: unknown, expected: unknown, msg: string) {
  ok(actual === expected, `${msg} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

export function approx(actual: number, expected: number, msg: string, tol = 0.01) {
  ok(Math.abs(actual - expected) <= tol, `${msg} — expected ≈${expected}, got ${actual}`);
}

export function report(suite: string) {
  if (failures.length) {
    console.error(`\n❌ ${suite}: ${failures.length} failed, ${passed} passed`);
    for (const f of failures) console.error("   • " + f);
    process.exit(1);
  }
  console.log(`✅ ${suite}: ${passed} checks passed`);
}
