// One pricing tier card. Shared by /pricing and /wage-watch so a plan reads the
// same everywhere. `featured` gets the brand ring and an optional badge.

export function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="#d2e9df" />
      <path d="M4.5 8.2l2.3 2.3 4.7-4.8" stroke="#0d543f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PlanCard({ name, price, unit, blurb, features, badge, featured = false, children }: {
  name: string;
  price: string;
  unit?: string;
  blurb: string;
  features: string[];
  badge?: string;
  featured?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative flex h-full flex-col rounded-3xl border bg-card p-7 ${featured ? "border-brand-300 shadow-float ring-1 ring-brand-100" : "border-line shadow-card"}`}>
      {badge && <span className="absolute -top-3 right-7 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-white">{badge}</span>}
      <div className={`text-sm font-semibold uppercase tracking-wide ${featured ? "text-brand-700" : "text-faint"}`}>{name}</div>
      <div className="mt-2 font-display text-4xl font-semibold text-ink">
        {price}{unit && <span className="font-sans text-base font-medium text-faint"> {unit}</span>}
      </div>
      <p className="mt-1 text-sm text-muted">{blurb}</p>
      <ul className="mt-5 space-y-2.5 text-sm text-muted">
        {features.map((f) => <li key={f} className="flex gap-2.5"><Check />{f}</li>)}
      </ul>
      {children && <div className="mt-auto pt-6">{children}</div>}
    </div>
  );
}
