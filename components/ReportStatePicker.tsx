import StateChecklist from "./StateChecklist";

// A plain GET form that asks the report page to rebuild for a chosen set of
// states. It carries the session id along, which is what proves the purchase.
export default function ReportStatePicker({
  sessionId,
  selected = [],
  submitLabel,
}: {
  sessionId: string;
  selected?: string[];
  submitLabel: string;
}) {
  return (
    <form method="get" action="/pro-report" className="space-y-3 print:hidden">
      <input type="hidden" name="session_id" value={sessionId} />
      <StateChecklist defaultSelected={selected} />
      <button type="submit" className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800">{submitLabel}</button>
    </form>
  );
}
