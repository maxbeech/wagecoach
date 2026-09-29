// The site is hosted on Helm7. Vercel's analytics packages report nothing off
// Vercel, and a dependency or import left behind ships dead code to every visitor.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { ok, report } from "./_assert.mts";

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string>; scripts?: Record<string, string> };
const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
ok(!deps.some((d) => d.startsWith("@vercel/")), `no @vercel/* package: ${deps.filter((d) => d.startsWith("@vercel/")).join(", ")}`);
ok(!Object.values(pkg.scripts ?? {}).some((s) => /(^|[\s&;])(npx\s+)?vercel\s/.test(s)), "no script runs the vercel CLI");

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    if (["node_modules", ".next", ".git", "test"].includes(name)) return [];
    const path = join(dir, name);
    return statSync(path).isDirectory() ? sources(path) : /\.(tsx?|mts|mjs|js)$/.test(name) ? [path] : [];
  });
}
for (const file of [...sources("app"), ...sources("lib"), ...sources("components")]) {
  const text = readFileSync(file, "utf8");
  ok(!/from\s+["']@vercel\/|require\(["']@vercel\//.test(text), `${file} imports nothing from @vercel/*`);
}
report("no-vercel");
