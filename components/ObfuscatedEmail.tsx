"use client";

import { useEffect, useRef } from "react";

// Renders the public contact email as a clickable mailto without exposing the
// literal address in the server-rendered HTML, to reduce harvesting by spam
// scrapers (which mostly read static markup). The SSR output is a human-readable
// "hello [at] wagecoach.com" with no href and no "@" — the real address and the
// mailto link are assembled only in the browser on mount, via a ref so the
// component never re-renders and hydration stays stable. No-JS users still see a
// decodable address.
const USER = "hello";
const DOMAIN = "wagecoach.com";

export default function ObfuscatedEmail({ className }: { className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const addr = `${USER}@${DOMAIN}`;
    a.setAttribute("href", `mailto:${addr}`);
    a.textContent = addr;
  }, []);

  return (
    <a ref={ref} className={className}>
      {USER} [at] {DOMAIN}
    </a>
  );
}
