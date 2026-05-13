// src/components/ui/StatCard.tsx
//
// Dashboard stat surface — small uppercase label, a prominent value,
// and an optional secondary hint line. Used as the building block for
// the consent and feedback dashboard headers; reach for this whenever
// a screen needs a row of "Total · Accepts · Rejects · Custom" tiles.
//
// All foundation values come from the DS:
//   - p-6 / gap-2 from the spacing scale (24 / 8 px)
//   - rounded-xl for the 12 px material-medium radius
//   - bg ds-background-100 + border ds-gray-400 (Materials > Hairline)
//   - text-label-12 + text-heading-32 from the Typography page

"use client";

import { type ReactNode } from "react";

export interface StatCardProps {
  /** Uppercase label rendered above the value */
  label: string;
  /** Primary stat value (renders large) */
  value: ReactNode;
  /** Optional secondary line rendered below the value */
  hint?: ReactNode;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="flex flex-col gap-2 p-6 rounded-xl bg-[color:var(--ds-background-100)] border border-[color:var(--ds-gray-400)]">
      <span className="text-label-12 font-medium uppercase tracking-wide text-[color:var(--ds-gray-700)]">
        {label}
      </span>
      <span className="text-heading-32 text-[color:var(--ds-gray-1000)]">
        {value}
      </span>
      {hint && (
        <span className="text-label-12 text-[color:var(--ds-gray-700)]">
          {hint}
        </span>
      )}
    </div>
  );
}

export default StatCard;
