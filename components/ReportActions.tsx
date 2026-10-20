"use client";

// Print / Save as PDF for the Pro report, the same route the Claim Kit uses: the
// browser's own print dialog, with the site header and footer already hidden in print.
export default function ReportActions() {
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button type="button" onClick={() => window.print()} className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800">Print / Save as PDF</button>
    </div>
  );
}
