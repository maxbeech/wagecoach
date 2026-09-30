import { track } from "./openhelm-analytics";
import { calculatorUseEvents, type AnalyticsEventName, type CalculatorTool, type EventParams } from "./analytics-events";

/** Send one of the events in ./analytics-events. A no-op when analytics is not configured. */
export function trackEvent(name: AnalyticsEventName, params: EventParams = {}): boolean {
  try {
    return track(name, params);
  } catch {
    // Analytics must never interrupt a user action.
    return false;
  }
}

/** Report the first use of a calculator on this page. */
export function trackCalculatorUse(tool: CalculatorTool): void {
  for (const e of calculatorUseEvents(tool)) trackEvent(e.name, e.params);
}
