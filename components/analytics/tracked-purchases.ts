// Remember a reported purchase so a reload of the success URL does not send it
// twice. Storage can be blocked; then GA's own transaction_id de-duplication
// is the only guard, which is fine.
const key = (transactionId: string) => `wagecoach:purchase-tracked:${transactionId}`;

export function alreadyTracked(transactionId: string): boolean {
  try {
    return localStorage.getItem(key(transactionId)) === "1";
  } catch {
    return false;
  }
}

export function markTracked(transactionId: string): void {
  try {
    localStorage.setItem(key(transactionId), "1");
  } catch {
    /* nothing to remember it with */
  }
}
