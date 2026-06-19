import Link from "next/link";

// Shared presentational atoms — single source of truth for headings, cards,
// stats and chips used across the marketing pages and the calculators.

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
      <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
      {children}
    </span>
  );
}

export function SectionHeading({ title, sub, as: Tag = "h2" }: { title: React.ReactNode; sub?: React.ReactNode; as?: "h1" | "h2" }) {
  return (
    <div>
      <Tag className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</Tag>
      {sub && <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-line bg-card shadow-card ${className}`}>{children}</div>;
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <div className="text-[0.7rem] font-medium uppercase tracking-wider text-faint">{label}</div>
      <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-ink">{value}</div>
      {sub && <div className="mt-0.5 text-xs leading-snug text-faint">{sub}</div>}
    </div>
  );
}

export function Chip({ href, children }: { href?: string; children: React.ReactNode }) {
  const cls =
    "inline-flex items-center rounded-full border border-line bg-card px-3 py-1.5 text-sm text-muted transition-colors hover:border-brand-300 hover:text-ink";
  return href ? <Link href={href} className={cls}>{children}</Link> : <span className={cls}>{children}</span>;
}
