"use client";

import { useEffect, useRef, useState } from "react";

// Smoothly tweens a displayed number toward `target` whenever it changes
// (ease-out, ~360ms). Honours prefers-reduced-motion by jumping instantly.
// Presentational only; the source figure is always the real engine result.
export function useCountUp(target: number, ms = 360): number {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || ms <= 0) {
      // No animation wanted: snap straight to the real value. Intentional.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(target);
      return;
    }

    fromRef.current = display;
    startRef.current = null;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const t = Math.min(1, (now - startRef.current) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(fromRef.current + (target - fromRef.current) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // Re-run only when the target changes; `display` is read as the start point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ms]);

  return display;
}
