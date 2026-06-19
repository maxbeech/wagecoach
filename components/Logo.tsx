import { SITE } from "@/lib/site";

// The brand mark: a paper tile holding three itemized "line items" of growing
// length — the ledger / paystub motif the whole site is built around. Single
// source of truth, reused in the header, footer, 404 and social image.
export function LogoMark({ size = 30, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="wc-mark" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#136a51" />
          <stop offset="1" stopColor="#0f241b" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="8.5" fill="url(#wc-mark)" />
      <rect x="8" y="10" width="11" height="2.4" rx="1.2" fill="#ffffff" fillOpacity="0.55" />
      <rect x="8" y="15" width="16" height="2.4" rx="1.2" fill="#ffffff" fillOpacity="0.8" />
      <rect x="8" y="20" width="8" height="2.4" rx="1.2" fill="#ffffff" fillOpacity="0.4" />
      <circle cx="23.5" cy="21.2" r="2.4" fill="#b08a35" />
    </svg>
  );
}

// Full lockup: mark + editorial serif wordmark.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="font-display text-[1.15rem] font-semibold tracking-tight text-ink">
        WageCalc<span className="text-brand-700"> HQ</span>
      </span>
      <span className="sr-only">{SITE.name}</span>
    </span>
  );
}
