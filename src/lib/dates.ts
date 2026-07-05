// src/lib/dates.ts

/** "5 Jul 2026" — the display format for article meta lines (card meta,
 *  hero byline dates). Returns undefined for missing/invalid input so
 *  callers can conditionally render. */
export function formatDisplayDate(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
