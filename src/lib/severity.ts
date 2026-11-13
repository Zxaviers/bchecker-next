export type Severity = "low" | "mid" | "high";

/** Display-only colouring of the gauge; does not change the data. */
export function severity(percent: number): Severity {
  if (percent <= 15) return "low";
  if (percent <= 30) return "mid";
  return "high";
}
