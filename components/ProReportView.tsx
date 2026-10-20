import { dollars } from "@/lib/federal";
import type { ProReport, ReportRow } from "@/lib/pro-report";
import { Eyebrow, SectionHeading } from "./primitives";
import ReportActions from "./ReportActions";

// The paid Pro report, rendered from lib/pro-report.ts. Presentational only:
// every figure and sentence comes from the report object, which comes from the
// same state data as the free pages. Prints cleanly (header and footer are
// already hidden in print) so "Print / Save as PDF" is the download.

const names = (list: string[]) => list.join(", ");
const refs = (n: number[]) => (n.length ? ` [${n.join(", ")}]` : "");

function tippedCell(r: ReportRow): string {
  if (!r.tipped.creditAllowed) return "None, full minimum wage";
  return r.tipped.cashWage === null ? "Varies, see below" : dollars(r.tipped.cashWage);
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5 py-2 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-wider text-faint">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

function StateSection({ r }: { r: ReportRow }) {
  return (
    <section className="break-inside-avoid rounded-xl border border-line bg-card p-5">
      <h3 className="font-display text-lg font-semibold text-ink">{r.name} <span className="font-mono text-sm text-faint">{r.abbr}</span></h3>
      <dl className="mt-2 divide-y divide-line">
        <Item label="Minimum wage">
          <span className="font-mono font-semibold tabular-nums">{dollars(r.minWage)}</span> per hour{r.minWageBasis === "federal" ? " (federal rate)" : ""}.
          {r.minWageNote && <span className="text-muted"> {r.minWageNote}</span>}{refs(r.refs.wage)}
        </Item>
        <Item label="Overtime">
          {r.overtime.daily ?? "No daily overtime rule."}
          {r.overtime.doubleTime && <span className="text-muted"> {r.overtime.doubleTime}</span>}
          {" "}Federal weekly rule: {r.overtime.weekly}.{refs(r.refs.overtime)}
        </Item>
        <Item label="Tipped employees">
          {r.tipped.creditAllowed ? "Tip credit allowed. " : "No tip credit. The full minimum wage is paid in cash before tips. "}
          {r.tipped.cashWage !== null ? <>Minimum cash wage <span className="font-mono font-semibold tabular-nums">{dollars(r.tipped.cashWage)}</span>.</> : "The cash wage varies. Confirm the current figure with the state."}
          {r.tipped.note && <span className="text-muted"> {r.tipped.note}</span>}{refs(r.refs.wage)}
        </Item>
        <Item label="Final paycheck">Fired or laid off: {r.finalPay.fired}. Quit: {r.finalPay.quit}.{refs(r.refs.finalPayAndBreaks)}</Item>
        <Item label="Meal and rest breaks">Meal: {r.breaks.meal}. Rest: {r.breaks.rest}.{refs(r.refs.finalPayAndBreaks)}</Item>
      </dl>
    </section>
  );
}

export default function ProReportView({ report, children }: { report: ProReport; children?: React.ReactNode }) {
  const { rows, highlights: h, federal: f } = report;
  const count = rows.length;
  return (
    <div className="mx-auto max-w-4xl">
      <Eyebrow>Your Pro report · paid ✓</Eyebrow>
      <div className="mt-3">
        <SectionHeading
          as="h1"
          title="Your multi-state compliance report"
          sub={`You paid for the Pro report. It is on this page. It covers ${count} ${count === 1 ? "state" : "states"}: ${names(rows.map((r) => r.abbr))}. Use Print / Save as PDF to keep a copy for your team.`}
        />
      </div>
      <div className="mt-4"><ReportActions /></div>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink">Summary</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            ["States covered", String(count), names(rows.map((r) => r.name))],
            ["Lowest minimum wage", dollars(h.lowestMinWage.wage), names(h.lowestMinWage.states)],
            ["Highest minimum wage", dollars(h.highestMinWage.wage), names(h.highestMinWage.states)],
          ].map(([label, value, sub]) => (
            <div key={label} className="rounded-xl border border-line bg-card p-4">
              <div className="text-[0.7rem] font-medium uppercase tracking-wider text-faint">{label}</div>
              <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-ink">{value}</div>
              <div className="mt-1 text-xs text-muted">{sub}</div>
            </div>
          ))}
        </div>
        <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-muted">
          <li>{h.aboveFederal} of {count} set a minimum wage above the federal {dollars(f.minWage)}.</li>
          <li>{h.dailyOvertime.length ? `Daily overtime applies in ${names(h.dailyOvertime)}.` : "None of these states add daily overtime. Federal weekly overtime applies."}</li>
          <li>{h.noTipCredit.length ? `No tip credit in ${names(h.noTipCredit)}. The full minimum wage is paid in cash.` : "All of these states allow a tip credit."}</li>
        </ul>
        <p className="mt-3 text-xs text-faint">{report.effectiveNote}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink">At a glance</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-line bg-card">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-faint">
              <tr>{["State", "Minimum wage", "Tipped cash wage", "Daily overtime", "Final pay if fired"].map((c) => <th key={c} className="px-4 py-2.5 font-medium">{c}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.abbr}>
                  <td className="px-4 py-2 font-medium text-ink">{r.name}</td>
                  <td className="px-4 py-2 font-mono tabular-nums text-ink">{dollars(r.minWage)}</td>
                  <td className="px-4 py-2 text-muted">{tippedCell(r)}</td>
                  <td className="px-4 py-2 text-muted">{r.overtime.daily ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 text-muted">{r.finalPay.fired}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink">State by state</h2>
        <div className="mt-3 space-y-4">{rows.map((r) => <StateSection key={r.abbr} r={r} />)}</div>
      </section>

      <section className="mt-8 break-inside-avoid">
        <h2 className="font-display text-lg font-semibold text-ink">Federal baseline (FLSA)</h2>
        <dl className="mt-2 divide-y divide-line rounded-xl border border-line bg-card px-5">
          <Item label="Minimum wage"><span className="font-mono font-semibold tabular-nums">{dollars(f.minWage)}</span> per hour.</Item>
          <Item label="Tipped employees">Cash wage <span className="font-mono font-semibold tabular-nums">{dollars(f.tippedCashWage)}</span>, tip credit up to <span className="font-mono font-semibold tabular-nums">{dollars(f.maxTipCredit)}</span>.</Item>
          <Item label="Overtime">{f.overtime}.</Item>
          <Item label="Exempt salary test">{f.exemptSalary}.</Item>
        </dl>
      </section>

      <section className="mt-8 break-inside-avoid">
        <h2 className="font-display text-lg font-semibold text-ink">Sources</h2>
        <ol className="mt-2 space-y-1 text-sm text-muted">
          {report.sources.map((s) => (
            <li key={s.n}>[{s.n}] <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline decoration-brand-300 underline-offset-2">{s.label}</a></li>
          ))}
        </ol>
      </section>

      {children}

      <p className="mt-8 text-xs leading-relaxed text-faint">{report.disclaimer}</p>
    </div>
  );
}
