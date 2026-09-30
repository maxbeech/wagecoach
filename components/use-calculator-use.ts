"use client";

import { useCallback } from "react";
import { trackCalculatorUse } from "@/lib/analytics-track";
import type { CalculatorTool } from "@/lib/analytics-events";

// Reports the first time someone actually edits a calculator on the page, not
// the page load and not the defaults being hydrated from the URL. Put the
// returned ref on the calculator's root element; it listens for `input`
// (fields, selects, checkboxes) and for a press on a segmented toggle, and
// stops after the first hit so one visit is one event per calculator.
export function useCalculatorUse<T extends HTMLElement>(tool: CalculatorTool) {
  return useCallback(
    (node: T | null) => {
      if (!node) return;
      const stop = () => {
        node.removeEventListener("input", onInput);
        node.removeEventListener("click", onClick);
      };
      const fire = () => {
        stop();
        trackCalculatorUse(tool);
      };
      const onInput = () => fire();
      const onClick = (e: Event) => {
        if (e.target instanceof Element && e.target.closest("button[aria-pressed]")) fire();
      };
      node.addEventListener("input", onInput);
      node.addEventListener("click", onClick);
      return stop;
    },
    [tool],
  );
}
