"use client";

// src/app/races/calendar/RaceSummarySheet.tsx
//
// Race summary in a DS Sheet, opened by clicking a calendar entry
// (user call 2026-08-23) — a quick look at the race without leaving
// the month: hero image, headline meta, a stat run-down, and the
// "View race guide" CTA into the full page. Units follow the shared
// UnitsContext, matching the index and the guide panel.

import Image from "next/image";
import { format } from "date-fns";

import { Button, ButtonLink } from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import { useUnits, type UnitSystem } from "@/contexts/UnitsContext";
import { formatDistance, formatElevation, formatPrice } from "@/lib/raceUtils";

import type { CalendarRace } from "./CalendarGrid";

function formatTemperature(c: number, units: UnitSystem): string {
  if (units === "imperial") return `${Math.round((c * 9) / 5 + 32)}°F`;
  return `${Math.round(c)}°C`;
}

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
  const { units } = useUnits();

  const location = race
    ? [race.city, race.country].filter(Boolean).join(", ")
    : "";
  const date = race?.eventDate
    ? format(new Date(race.eventDate), "EEEE d MMMM yyyy")
    : null;

  const rows: { label: string; value: string }[] = [];
  if (race) {
    if (date) rows.push({ label: "Date", value: date });
    if (race.startTime)
      rows.push({ label: "Start time", value: race.startTime });
    if (race.category) rows.push({ label: "Category", value: race.category });
    if (race.distance != null)
      rows.push({
        label: "Distance",
        value: formatDistance(race.distance, units),
      });
    if (race.surface) rows.push({ label: "Surface", value: race.surface });
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
    if (race.price != null && race.currency)
      rows.push({
        label: "Entry price",
        value: formatPrice(race.price, race.currency),
      });
  }

  return (
    <Sheet open={race !== null} onOpenChange={(open) => !open && onClose()}>
      <Sheet.Content side="right" size="420px">
        {race && (
          <>
            <Sheet.Header>
              <Sheet.Title>{race.title}</Sheet.Title>
              {location && <Sheet.Description>{location}</Sheet.Description>}
            </Sheet.Header>
            <Sheet.Body>
              <div className="flex flex-col gap-5">
                {race.imageUrl && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs">
                    <Image
                      src={race.imageUrl}
                      alt={race.title}
                      fill
                      sizes="420px"
                      placeholder={race.blurDataURL ? "blur" : undefined}
                      blurDataURL={race.blurDataURL ?? undefined}
                      className="object-cover"
                    />
                  </div>
                )}
                {rows.length > 0 && (
                  <div className="divide-y divide-borderSubtle">
                    {rows.map((row) => (
                      <SummaryRow key={row.label} {...row} />
                    ))}
                  </div>
                )}
              </div>
            </Sheet.Body>
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
