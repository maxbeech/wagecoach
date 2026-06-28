"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { href: "/calculators", label: "Calculators" },
  { href: "/wage-claim", label: "Unpaid wages" },
  { href: "/states", label: "By state" },
  { href: "/cities", label: "By city" },
  { href: "/blog", label: "Guides" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" aria-label="WageCoach home" className="rounded">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href}
              className={`relative py-1 transition-colors ${isActive(l.href) ? "text-ink" : "text-muted hover:text-ink"}`}>
              {l.label}
              {isActive(l.href) && <span className="absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-brand-600" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/pricing"
            className="hidden rounded-full bg-forest px-4 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-white/10 transition hover:bg-brand-800 sm:inline-block">
            Pro report
          </Link>
          <button type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink md:hidden">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {open ? <path d="M4 4l10 10M14 4L4 14" /> : <><path d="M2 5h14" /><path d="M2 9h14" /><path d="M2 13h14" /></>}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper px-5 py-3 md:hidden">
          <div className="flex flex-col">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className={`border-b border-line/60 py-2.5 text-sm last:border-0 ${isActive(l.href) ? "font-medium text-brand-700" : "text-muted"}`}>
                {l.label}
              </Link>
            ))}
            <Link href="/pricing" onClick={() => setOpen(false)} className="mt-3 rounded-full bg-forest px-4 py-2.5 text-center text-sm font-medium text-white">
              Pro report
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
