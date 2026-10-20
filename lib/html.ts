// Escapes a value for interpolation into the HTML emails we send (alerts, the
// Pro report safety-net mail). Anything user-controlled goes through this.
export function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
