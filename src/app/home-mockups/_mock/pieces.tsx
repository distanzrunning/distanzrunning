import type { ReactNode } from "react";

// Shared section chrome for the homepage mockups.

/** "Latest ———————————— view all" section label (DS rule + heading-14). */
export function SectionLabel({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-heading-14 text-textDefault">{title}</span>
      <span className="h-px flex-1 bg-borderSubtle" />
      {action}
    </div>
  );
}

/** Heavy editorial rule (border-t-4 border-textDefault) — major section break. */
export function HeavyRule() {
  return <hr className="border-0 border-t-4 border-textDefault" />;
}

/** Kicker / category eyebrow above a title. */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="text-heading-14 uppercase tracking-[0.06em] text-textSubtle">
      {children}
    </span>
  );
}

/** Simple wireframe footer — wordmark + three link columns. */
export function MockFooter() {
  const cols = [
    { h: "Sections", links: ["Racing", "Training", "Gear", "Culture"] },
    { h: "Company", links: ["About", "Contact", "Careers"] },
    { h: "Follow", links: ["Instagram", "Strava", "Newsletter"] },
  ];
  return (
    <footer className="border-t border-borderSubtle bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <span className="text-[19px] font-bold uppercase tracking-[0.16em] text-textDefault">
            Distanz
          </span>
          <span className="text-copy-13 max-w-[28ch] text-textSubtle">
            Editorial running, gear, and race coverage.
          </span>
        </div>
        {cols.map((c) => (
          <div key={c.h} className="flex flex-col gap-2">
            <span className="text-heading-14 text-textDefault">{c.h}</span>
            {c.links.map((l) => (
              <a
                key={l}
                href="#"
                className="text-copy-14 text-textSubtle no-underline hover:text-textDefault"
              >
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
