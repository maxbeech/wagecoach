"use client";

import { useEffect } from "react";

// Removes one-time query params (e.g. Stripe's session_id) from the address bar
// after the server has used them, so a bookmark or a shared screenshot doesn't
// carry them. Renders nothing.
export default function StripSearchParams({ keys }: { keys: string[] }) {
  useEffect(() => {
    const url = new URL(window.location.href);
    let changed = false;
    for (const k of keys) if (url.searchParams.has(k)) { url.searchParams.delete(k); changed = true; }
    if (changed) window.history.replaceState(null, "", url.pathname + (url.search ? url.search : ""));
  }, [keys]);
  return null;
}
