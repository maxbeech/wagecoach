import Link from "next/link";

// Shared presentational atoms — single source of truth for headings, cards,
// stats, chips and "read more" links used across the marketing pages and the
// calculators.

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
      <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
      {children}
    </span>
  );
}

export function SectionHeading({
  title,
  sub,
  as: Tag = "h2",
  rule = false,
}: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  as?: "h1" | "h2";
  rule?: boolean;
}) {
  return (
    <div>
      {rule && <div className="gold-rule mb-3" aria-hidden />}
      <Tag className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</Tag>
      {sub && <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}

export function Card({ className = "", lift = false, children }: { className?: string; lift?: boolean; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-line bg-card shadow-card ${lift ? "lift" : ""} ${className}`}>{children}</div>;
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

// The single "continue reading" affordance for the whole site. No "→" glyph and
// no gap-grow (the two loudest template tells) — instead an inline chevron and an
// underline that draws in from the left on hover/focus.
export function MoreLink({ href, children, tone = "brand" }: { href: string; children: React.ReactNode; tone?: "brand" | "light" }) {
  const color = tone === "light" ? "text-white" : "text-brand-700";
  const bar = tone === "light" ? "bg-white" : "bg-brand-700";
  return (
    <Link href={href} className={`group inline-flex items-center gap-1.5 text-sm font-medium ${color}`}>
      <span className="relative">
        {children}
        <span aria-hidden className={`absolute -bottom-0.5 left-0 h-px w-0 ${bar} transition-all duration-300 group-hover:w-full group-focus-visible:w-full`} />
      </span>
      <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3.5 10.5 8 6 12.5" />
      </svg>
    </Link>
  );
}

// A small brass "line item" tick — the ledger motif, used for list bullets in
// place of the over-used gold dot.
export function LedgerTick() {
  return <span aria-hidden className="mt-1 h-3.5 w-[3px] shrink-0 rounded-full bg-gold-500/80" />;
}
