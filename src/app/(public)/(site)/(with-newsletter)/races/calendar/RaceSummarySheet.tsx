"use client";

// src/app/races/calendar/RaceSummarySheet.tsx
//
// Race summary in a DS Sheet, opened by clicking a calendar entry
// (user call 2026-08-23) — a quick look at the race without leaving
// the month. Mirrors the race-detail page's hero-card anatomy (user
// call 2026-08-23): image, title, location, the meta pill row (date
// primary + surface + tags, each linking into the filtered /races
// index) and the introduction lede — then unit/currency controls and
// the stat rows, with the "View race guide" CTA pinned in the
// footer. Everything above the footer scrolls. Units follow the
// shared UnitsContext, matching the index and the guide panel.

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { PortableText } from "@portabletext/react";

import { Button, ButtonLink } from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import { useUnits, type UnitSystem } from "@/contexts/UnitsContext";
import {
  convertCurrencySync,
  formatDistance,
  formatElevation,
  formatPrice,
} from "@/lib/raceUtils";

import type { CalendarRace } from "./CalendarGrid";

function formatTemperature(c: number, units: UnitSystem): string {
  if (units === "imperial") return `${Math.round((c * 9) / 5 + 32)}°F`;
  return `${Math.round(c)}°C`;
}

// ---------------------------------------------------------------------------
// Meta pills — the race-detail hero card's pill recipe: "primary"
// (dark fill) for the date, "subtle" (gray-300 fill) for the rest;
// each opens the /races index pre-filtered by its dimension.
// ---------------------------------------------------------------------------

function MetaPill({
  children,
  href,
  variant = "subtle",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "subtle";
}) {
  const base =
    "inline-flex h-7 items-center rounded-full px-3 text-copy-13 font-medium transition-colors";
  const skin =
    variant === "primary"
      ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)] hover:bg-[color:var(--ds-gray-900)]"
      : "bg-[color:var(--ds-gray-300)] text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-400)]";
  const className = `${base} ${skin} no-underline`;
  if (href)
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  return <span className={className}>{children}</span>;
}

function buildPills(race: CalendarRace) {
  const pills: {
    key: string;
    value: string;
    href?: string;
    variant?: "primary" | "subtle";
  }[] = [];
  if (race.eventDate) {
    const d = new Date(race.eventDate);
    if (!Number.isNaN(d.getTime())) {
      const iso = race.eventDate.slice(0, 10);
      pills.push({
        key: "date",
        value: format(d, "d MMM, yyyy"),
        href: `/races?dateFrom=${iso}&dateTo=${iso}`,
        variant: "primary",
      });
    }
  }
  if (race.surface) {
    pills.push({
      key: "surface",
      value: race.surface,
      href: `/races?surface=${encodeURIComponent(race.surface)}`,
    });
  }
  for (const tag of race.tags ?? []) {
    pills.push({
      key: `tag-${tag}`,
      value: tag,
      href: `/races?tag=${encodeURIComponent(tag)}`,
    });
  }
  return pills;
}

// Lede voice — the hero card's introduction register verbatim
// (copy-16 / gray-900): the sheet is 512px against the panel's 520,
// so the two read at the same scale.
const INTRO_PT_COMPONENTS = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-3 text-copy-16 text-[color:var(--ds-gray-900)] last:mb-0">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-[color:var(--ds-gray-1000)]">
        {children}
      </strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({
      value,
      children,
    }: {
      value?: { href?: string };
      children?: React.ReactNode;
    }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={
          value?.href?.startsWith("http") ? "noopener noreferrer" : undefined
        }
        className="text-[color:var(--ds-gray-1000)] underline underline-offset-2 hover:text-[color:var(--ds-gray-700)]"
      >
        {children}
      </a>
    ),
  },
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 text-copy-14 first:pt-0 last:pb-0">
      <span className="text-textSubtle">{label}</span>
      <span className="text-right font-medium text-textDefault">{value}</span>
    </div>
  );
}

export default function RaceSummarySheet({
  race,
  onClose,
}: {
  /** The selected race — null renders a closed sheet. */
  race: CalendarRace | null;
  onClose: () => void;
}) {
  const { units, currency: displayCurrency } = useUnits();

  const location = race
    ? [race.city, race.country].filter(Boolean).join(", ")
    : "";
  const pills = race ? buildPills(race) : [];

  const rows: { label: string; value: string }[] = [];
  if (race) {
    if (race.startTime)
      rows.push({ label: "Start time", value: race.startTime });
    if (race.category) rows.push({ label: "Category", value: race.category });
    if (race.distance != null)
      rows.push({
        label: "Distance",
        value: formatDistance(race.distance, units),
      });
    if (race.elevationGain != null)
      rows.push({
        label: "Elevation gain",
        value: formatElevation(race.elevationGain, units),
      });
    if (race.averageTemperature != null)
      rows.push({
        label: "Avg. temperature",
        value: formatTemperature(race.averageTemperature, units),
      });
    if (race.price != null && race.currency) {
      // Same conversion pattern as RaceCard: "local" keeps the
      // race's source currency, otherwise convert to the selected
      // display currency.
      const isLocalCurrency = displayCurrency === "local";
      const targetCurrency = isLocalCurrency
        ? race.currency
        : displayCurrency;
      rows.push({
        label: "Entry price",
        value: formatPrice(
          isLocalCurrency
            ? race.price
            : convertCurrencySync(race.price, race.currency, displayCurrency),
          targetCurrency,
        ),
      });
    }
  }

  return (
    <Sheet open={race !== null} onOpenChange={(open) => !open && onClose()}>
      {/* The DS docs' default Sheet recipe — floating above the page:
          12px inset margin, 16px radius, height clear of the inset,
          p-0 (sections carry their own padding). Width goes
          responsive where the docs' fixed 512px would overflow phones. */}
      <Sheet.Content
        side="right"
        className="m-3 flex h-[calc(100%-1.5rem)] w-[calc(100vw-1.5rem)] flex-col rounded-[1rem] p-0 sm:w-[512px]"
      >
        {race && (
          <>
            {/* Everything above the footer scrolls — with the lede
                aboard, tall content shouldn't push the CTA away. */}
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-4 pt-6 [scrollbar-width:thin]">
              {race.imageUrl && (
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xs">
                  <Image
                    src={race.imageUrl}
                    alt={race.title}
                    fill
                    sizes="512px"
                    placeholder={race.blurDataURL ? "blur" : undefined}
                    blurDataURL={race.blurDataURL ?? undefined}
                    className="object-cover"
                  />
                </div>
              )}
              {/* Hero-card anatomy at the hero card's own scale
                  (display-40 title, copy-18 location, mt-5 rhythm) —
                  the two panels sit at near-identical widths, so
                  they align visually. Title/Description keep the
                  Radix a11y wiring. */}
              <Sheet.Title
                className={`text-balance text-display-40 text-[color:var(--ds-gray-1000)] ${race.imageUrl ? "mt-5" : ""}`}
              >
                {race.title}
              </Sheet.Title>
              {location && (
                <div className="mt-1">
                  <Sheet.Description className="text-copy-18 text-[color:var(--ds-gray-900)]">
                    {location}
                  </Sheet.Description>
                </div>
              )}
              {pills.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {pills.map((p) => (
                    <MetaPill
                      key={p.key}
                      variant={p.variant ?? "subtle"}
                      href={p.href}
                    >
                      {p.value}
                    </MetaPill>
                  ))}
                </div>
              )}
              {race.introduction && race.introduction.length > 0 && (
                <div className="mt-5">
                  <PortableText
                    value={race.introduction}
                    components={INTRO_PT_COMPONENTS}
                  />
                </div>
              )}
              {rows.length > 0 && (
                <>
                  {/* The panel's StatsCard section title. The unit /
                      currency controls live on the calendar page
                      header (picked once); the shared UnitsContext
                      carries the choice into these rows. */}
                  <h3 className="mb-4 mt-6 text-heading-20 text-[color:var(--ds-gray-1000)]">
                    Key stats
                  </h3>
                  <div className="divide-y divide-borderSubtle">
                    {rows.map((row) => (
                      <SummaryRow key={row.label} {...row} />
                    ))}
                  </div>
                </>
              )}
            </div>
            <Sheet.Footer>
              <Sheet.Close>
                <Button variant="secondary" size="small">
                  Close
                </Button>
              </Sheet.Close>
              <ButtonLink href={`/races/${race.slug}`} prefetch size="small">
                View race guide
              </ButtonLink>
            </Sheet.Footer>
          </>
        )}
      </Sheet.Content>
    </Sheet>
  );
}
