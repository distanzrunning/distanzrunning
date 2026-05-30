// src/components/ui/PanelCard.tsx
//
// Generic bordered card with an optional title + body. The shape every
// "info panel" in admin reaches for: a section header (h2), an
// optional action element on the right (a "Clear" link, an "Export"
// button), and arbitrary body content underneath.
//
// All foundation values come from the DS:
//   - p-6 / gap-4 from the spacing scale (24 / 16 px)
//   - rounded-xl for the 12 px material-medium radius
//   - bg ds-background-100 + border ds-gray-400 (Materials > Hairline)
//   - text-heading-16 for the title (Typography > Small card titles)

"use client";

import { type ReactNode } from "react";

export interface PanelCardProps {
  /** Optional header title rendered as h2 */
  title?: ReactNode;
  /** Optional element rendered on the right of the title (e.g. a
      clear-search link, an "Export" button). Hidden when there's no
      title either. */
  action?: ReactNode;
  /** Card body */
  children: ReactNode;
  /** Border radius variant.
   *  - `xl` (default, 12 px) — the standard admin panel.
   *  - `md` (6 px) — tighter; use when pairing the card with the
   *    Vercel-style leaderboard chrome elsewhere on the page so
   *    the panel radii line up. */
  radius?: "md" | "xl";
}

export function PanelCard({
  title,
  action,
  children,
  radius = "xl",
}: PanelCardProps) {
  const hasHeader = title != null || action != null;
  const radiusClass = radius === "md" ? "rounded-md" : "rounded-xl";
  return (
    <section
      className={`flex flex-col gap-4 p-6 ${radiusClass} bg-[color:var(--ds-background-100)] border border-[color:var(--ds-gray-400)]`}
    >
      {hasHeader && (
        <header className="flex justify-between items-center">
          {title != null ? (
            <h2 className="text-heading-16 m-0 text-[color:var(--ds-gray-1000)]">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export default PanelCard;
