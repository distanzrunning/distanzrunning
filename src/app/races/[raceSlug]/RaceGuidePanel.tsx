"use client";

// src/app/races/[raceSlug]/RaceGuidePanel.tsx
//
// Editorial panel for the race-detail page. Vertical stack of
// floating cards (hero, TOC, ads, key stats, elevation, course
// records, body sections) that overlays the sticky map on
// desktop and stacks below it on mobile (the layout is up to
// the parent shell — this component renders identically in
// either mode).
//
// Extracted from RaceGuideShell.tsx so the shell stays a thin
// layout chooser. All panel-internal helpers (stat tile
// visuals, body-section splitter, Portable Text component
// maps, …) live here too.

import { Fragment, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import {
  ArrowDown,
  ChevronRight,
  Clock,
  Droplets,
  Footprints,
  Mountain,
  Ruler,
  Thermometer,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AdSlot } from "@/components/ui/AdSlot";
import { Switch } from "@/components/ui/Switch";
import { formatDistance, formatElevation } from "@/lib/raceUtils";
import { useUnits, type UnitSystem } from "@/contexts/UnitsContext";
import type { ElevationPoint } from "@/lib/gpxUtils";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { PANEL_WIDTH } from "./_constants";
import { getRouteLineColor } from "./RaceMap";
import type { RaceGuideMeta } from "./_types";

// ============================================================================
// Public component — the only export consumed by the shell.
// ============================================================================

interface GuidePanelProps {
  race: RaceGuideMeta;
  heroImageUrl: string | null;
  elevationSeries: ElevationPoint[] | null;
  onHoverDistance: (distance: number | null) => void;
  /**
   * Slot rendered between the TOC and the ads / stats blocks.
   * Used on mobile where the map sits inline with the
   * editorial flow rather than as a sticky overlay; null /
   * undefined on desktop, where the shell renders the map as a
   * sibling instead.
   */
  mapSlot?: React.ReactNode;
}

export default function GuidePanel({
  race,
  heroImageUrl,
  elevationSeries,
  onHoverDistance,
  mapSlot,
}: GuidePanelProps) {
  // Single source of truth for whether the elevation block
  // appears: TOC entry and the card itself both gate on the
  // prefetched series being non-empty, so the TOC link can
  // never dead-end.
  const hasElevation = !!elevationSeries && elevationSeries.length > 0;
  // Split the body into H2-keyed sections once. Both the TOC and
  // the body cards consume this list so anchor IDs are guaranteed
  // to match.
  const bodySections = useMemo(
    () => splitBodyIntoSections(race.body),
    [race.body],
  );
  return (
    <div
      className="flex flex-col gap-10 lg:gap-6 lg:[width:var(--panel-width)]"
      style={
        {
          "--panel-width": `${PANEL_WIDTH}px`,
          pointerEvents: "auto",
        } as React.CSSProperties
      }
    >
      <HeroCard race={race} imageUrl={heroImageUrl} />
      <TocCard
        race={race}
        hasElevation={hasElevation}
        bodySections={bodySections}
      />
      <StatsCard race={race} />
      {mapSlot}
      {hasElevation && (
        <ElevationCard
          series={elevationSeries!}
          onHoverDistance={onHoverDistance}
        />
      )}
      <AdsCard />
      <CourseRecordsCard race={race} />
      <BodySections sections={bodySections} />
    </div>
  );
}

// ============================================================================
// Card surface tokens — shared across every card in the stack.
// ============================================================================
//
// At lg+ the cards carry a floating-surface treatment (rounded
// corners + secondary background + drop shadow + interior
// padding) so each section reads as a discrete card stacked
// over the sticky map. Below lg the panel is a single
// continuous editorial flow (no map underneath, so no need to
// distinguish cards from a base canvas) — we drop the card
// chrome and let sections share the shell's background. Inline
// style stays minimal: scroll-margin-top for anchored sections
// is the only thing that varies per-card.

const CARD_CLASS =
  "lg:overflow-hidden lg:rounded-md lg:bg-[color:var(--ds-background-200)] dark:lg:bg-[color:var(--ds-background-100)] lg:p-5 lg:[box-shadow:var(--ds-shadow-menu)]";

// ============================================================================
// Hero card — image, title, location, meta pills, intro lede.
// ============================================================================

function HeroCard({
  race,
  imageUrl,
}: {
  race: RaceGuideMeta;
  imageUrl: string | null;
}) {
  const pills = useHeroPills(race);
  return (
    <div
      className={CARD_CLASS}
    >
      {imageUrl && (
        // 3:4 portrait on desktop where the hero leans
        // editorial inside the card frame; 4:3 landscape on
        // mobile where the panel is the full page and a tall
        // portrait would dominate ~70 % of the viewport before
        // the reader sees any content.
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded lg:aspect-[3/4]">
          <Image
            src={imageUrl}
            alt={race.title}
            fill
            sizes={`${PANEL_WIDTH}px`}
            priority
            className="object-cover"
          />
        </div>
      )}
      <h1
        className={`m-0 text-balance text-heading-40 text-[color:var(--ds-gray-1000)] ${
          imageUrl ? "mt-5" : ""
        }`}
      >
        {race.title}
      </h1>
      {(() => {
        const location = formatLocation(race);
        return location ? (
          <p className="mt-1 text-copy-18 text-[color:var(--ds-gray-900)]">
            {location}
          </p>
        ) : null;
      })()}
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
            components={INTRODUCTION_PT_COMPONENTS}
          />
        </div>
      )}
    </div>
  );
}

// Portable Text components for the lede paragraph(s) inside
// the hero card. Single concern: each block becomes a paragraph
// in the same copy-16 / gray-900 voice as the location line so
// the introduction reads as a continuation of the meta header,
// not as the body content (which gets its own card later).
const INTRODUCTION_PT_COMPONENTS = {
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

// Mirrors the formatter in src/app/races/RaceGrid.tsx so the
// location string reads identically on the index card and the
// race detail page: "City, State, Country" with state optional.
function formatLocation(race: RaceGuideMeta): string | null {
  const parts = [race.city, race.stateRegion, race.country].filter(
    (p): p is string => Boolean(p),
  );
  return parts.length ? parts.join(", ") : null;
}

// Pill that opens a filtered /races page. Two variants:
//   - "primary" — dark fill, used for the date pill so it
//     reads as the headline meta on the card.
//   - "subtle"  — gray-300 fill, used for the rest (surface,
//     tag) so they sit quietly behind the date.
// Pills without an `href` render as a non-interactive <span>.
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
  const className = `${base} ${skin}`;
  if (href) return <Link href={href} className={className}>{children}</Link>;
  return <span className={className}>{children}</span>;
}

interface HeroPill {
  key: string;
  value: string;
  href?: string;
  variant?: "primary" | "subtle";
}

// Builds the ordered list of meta pills shown under the title.
// Skips entries that have no underlying value so empty fields
// don't appear as ghost pills. Each pill links to the /races
// index pre-filtered by the matching field, except for any pill
// whose source isn't a /races filter dimension.
function useHeroPills(race: RaceGuideMeta): HeroPill[] {
  const pills: HeroPill[] = [];

  const date = formatPillDate(race.eventDate);
  if (date && race.eventDate) {
    const iso = isoDate(race.eventDate);
    pills.push({
      key: "date",
      value: date,
      href: iso ? `/races?dateFrom=${iso}&dateTo=${iso}` : undefined,
      variant: "primary",
    });
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

function isoDate(iso: string): string | null {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function formatPillDate(iso: string | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : format(d, "d MMM, yyyy");
}

// ============================================================================
// In-this-guide TOC card.
// ============================================================================

interface TocEntry {
  id: string;
  title: string;
}

const STATS_SECTION_ID = "key-stats";
const ELEVATION_SECTION_ID = "elevation";
const RECORDS_SECTION_ID = "course-records";
const SCROLL_MARGIN_TOP = 66;

function smoothScrollToAnchor(
  e: React.MouseEvent<HTMLAnchorElement>,
  id: string,
): void {
  if (typeof document === "undefined") return;
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  if (typeof history !== "undefined") {
    history.replaceState(null, "", `#${id}`);
  }
}

function TocCard({
  race,
  hasElevation,
  bodySections,
}: {
  race: RaceGuideMeta;
  hasElevation: boolean;
  bodySections: BodySection[];
}) {
  const sectionEntries: TocEntry[] = [];
  if (hasStatsData(race)) {
    sectionEntries.push({ id: STATS_SECTION_ID, title: "Key stats" });
  }
  if (hasElevation) {
    sectionEntries.push({ id: ELEVATION_SECTION_ID, title: "Elevation profile" });
  }
  if (hasCourseRecords(race)) {
    sectionEntries.push({ id: RECORDS_SECTION_ID, title: "Course records" });
  }
  const bodyEntries = bodySections.map((s) => ({ id: s.id, title: s.title }));
  const entries = [...sectionEntries, ...bodyEntries];
  if (entries.length === 0) return null;
  return (
    <aside
      className={CARD_CLASS}
    >
      <h2 className="m-0 mb-4 text-heading-20 text-[color:var(--ds-gray-1000)]">
        In this guide
      </h2>
      <ol className="m-0 list-none divide-y divide-[color:var(--ds-gray-400)] p-0">
        {entries.map((entry, i) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              onClick={(e) => smoothScrollToAnchor(e, entry.id)}
              className="group flex items-center justify-between gap-3 py-2 text-copy-16 text-[color:var(--ds-gray-1000)] no-underline"
            >
              <span className="min-w-0">
                <span className="text-[color:var(--ds-gray-900)]">
                  {i + 1}
                </span>
                <span className="ml-3 underline-offset-4 group-hover:underline">
                  {entry.title}
                </span>
              </span>
              <ArrowDown
                className="size-4 shrink-0 text-[color:var(--ds-gray-900)] group-hover:text-[color:var(--ds-gray-1000)]"
                aria-hidden
              />
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function hasStatsData(race: RaceGuideMeta): boolean {
  return (
    race.distance != null ||
    Boolean(race.surface) ||
    race.elevationGain != null ||
    race.altitude != null ||
    race.averageTemperature != null ||
    race.humidity != null ||
    race.fieldSize != null ||
    Boolean(race.startTime)
  );
}

function hasCourseRecords(race: RaceGuideMeta): boolean {
  return Boolean(
    race.mensCourseRecord ||
      race.womensCourseRecord ||
      race.mensWheelchairCourseRecord ||
      race.womensWheelchairCourseRecord,
  );
}

interface BodySection {
  id: string;
  title: string;
  blocks: PortableTextBlock[];
}

function splitBodyIntoSections(
  body: PortableTextBlock[] | undefined,
): BodySection[] {
  if (!body) return [];
  const sections: BodySection[] = [];
  let current: BodySection | null = null;
  body.forEach((block) => {
    const isH2 =
      block._type === "block" &&
      (block as { style?: string }).style === "h2";
    if (isH2) {
      const children = (
        block as { children?: { _type?: string; text?: string }[] }
      ).children;
      const text = (children ?? [])
        .filter((c) => c._type === "span")
        .map((c) => c.text ?? "")
        .join("")
        .trim();
      if (!text) return;
      current = {
        id: slugify(text) || `section-${sections.length + 1}`,
        title: text,
        blocks: [],
      };
      sections.push(current);
    } else if (current) {
      current.blocks.push(block);
    }
  });
  return sections;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ============================================================================
// Ad card.
// ============================================================================

function AdsCard() {
  // Below lg the panel has no card chrome — but the ad slot is
  // a "this is sponsored" block that shouldn't blend into the
  // editorial flow. Give it its own border + radius + padding
  // so it reads as a distinct unit even without the floating-
  // surface treatment the other cards lose on mobile. lg keeps
  // CARD_CLASS's full chrome and clears the mobile-only border.
  return (
    <div
      className={`${CARD_CLASS} rounded-md border border-[color:var(--ds-gray-400)] p-5 lg:border-0`}
    >
      <AdSlot
        slot="race-detail-panel"
        size="mpu"
        preview
        label={false}
        fallback={<AdsCardFallback />}
        className="mx-auto"
      />
    </div>
  );
}

function AdsCardFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
      <h4 className="m-0 text-heading-16 text-[color:var(--ds-gray-1000)]">
        Want to reach runners?
      </h4>
      <p className="m-0 max-w-[80%] text-copy-13 leading-snug text-[color:var(--ds-gray-900)]">
        Feature your brand, product, or story here.
      </p>
      <a
        href="mailto:brand@distanzrunning.com?subject=Advertising%20on%20Distanz%20Running"
        className="inline-flex h-9 items-center gap-1 rounded-md bg-[color:var(--ds-gray-1000)] px-4 text-copy-13 font-semibold text-[color:var(--ds-background-100)] no-underline transition-colors hover:bg-[color:var(--ds-gray-900)]"
      >
        Get in touch
        <ChevronRight className="size-4" />
      </a>
    </div>
  );
}

// ============================================================================
// Stats card — 2-col grid of inverted-surface tiles.
// ============================================================================

function StatsCard({ race }: { race: RaceGuideMeta }) {
  const tiles = useStatTiles(race);
  const { units, setUnits } = useUnits();
  if (tiles.length === 0) return null;
  return (
    <section
      id={STATS_SECTION_ID}
      className={CARD_CLASS}
      style={{ scrollMarginTop: SCROLL_MARGIN_TOP }}
    >
      <header className="mb-4 flex items-center justify-between gap-4">
        <h2 className="m-0 text-heading-20 text-[color:var(--ds-gray-1000)]">
          Key stats
        </h2>
        <Switch
          size="small"
          name="race-detail-units"
          options={UNIT_TOGGLE_OPTIONS}
          value={units}
          onChange={(next) => setUnits(next as UnitSystem)}
        />
      </header>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map(({ key, ...tile }) => (
          <StatTile key={key} {...tile} />
        ))}
      </div>
    </section>
  );
}

const UNIT_TOGGLE_OPTIONS = [
  { value: "imperial", label: "Imperial" },
  { value: "metric", label: "Metric" },
];

interface Tile {
  key: string;
  Icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  visual?: React.ReactNode;
}

function StatTile({ Icon, label, value, subtitle, visual }: Tile) {
  return (
    <div
      className="relative flex flex-col gap-3 rounded-md p-4"
      style={{
        background: "var(--ds-gray-1000)",
        color: "var(--ds-background-100)",
      }}
    >
      <div
        className="flex items-center gap-2 text-copy-13"
        style={{ opacity: 0.6 }}
      >
        <Icon className="size-4" aria-hidden />
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-heading-24">{value}</div>
      <div
        className="mt-auto text-copy-13 font-medium"
        style={{ opacity: 0.6 }}
      >
        {subtitle ?? " "}
      </div>
      {visual && (
        <div className="pointer-events-none absolute bottom-4 right-4">
          {visual}
        </div>
      )}
    </div>
  );
}

// 4 ascending bars (1 to 4 lit). Anchored to the tile fg colour.
function BarsVisual({ level }: { level: 1 | 2 | 3 | 4 }) {
  const HEIGHTS = [6, 12, 24, 36] as const;
  return (
    <div className="flex h-9 items-end gap-1" aria-hidden>
      {HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="w-[6px] rounded-full"
          style={{
            height: h,
            background: "var(--ds-background-100)",
            opacity: i < level ? 1 : 0.2,
          }}
        />
      ))}
    </div>
  );
}

// Stepped mountain silhouette for altitude.
function AltitudeVisual({ metres }: { metres: number }) {
  const STEPS = [
    { width: 28, key: "sea-level" },
    { width: 22, key: "lowland" },
    { width: 16, key: "highland" },
    { width: 10, key: "mountain" },
  ] as const;
  const activeIndex = altitudeBucketIndex(metres);
  return (
    <div
      className="flex flex-col-reverse items-center gap-[5px]"
      aria-hidden
    >
      {STEPS.map((step, i) => {
        const lit = i === activeIndex;
        return (
          <div
            key={step.key}
            className="rounded-full"
            style={{
              width: step.width,
              height: 3,
              background: "var(--ds-background-100)",
              opacity: lit ? 1 : 0.2,
            }}
          />
        );
      })}
    </div>
  );
}

function altitudeBucketIndex(metres: number): 0 | 1 | 2 | 3 {
  if (metres < 200) return 0;
  if (metres < 1000) return 1;
  if (metres < 2500) return 2;
  return 3;
}

// Quarter-arc humidity gauge — 21 ticks fanning up from the
// tile's bottom-right corner. Active tick is a 24 px needle;
// the rest are 12 px outer pips at 20 % opacity.
function HumidityVisual({ percent }: { percent: number }) {
  const TICK_COUNT = 21;
  const TRANSLATE = 36;
  const ARC_DEG = 90;
  const HALF = 12;
  const stepPercent = 100 / (TICK_COUNT - 1);
  const activeIndex = Math.max(
    0,
    Math.min(TICK_COUNT - 1, Math.round(percent / stepPercent)),
  );
  return (
    <div
      className="relative"
      style={{ width: TRANSLATE + HALF * 2, height: TRANSLATE + HALF * 2 }}
      aria-hidden
    >
      {Array.from({ length: TICK_COUNT }).map((_, i) => {
        const angle = -90 + (i * ARC_DEG) / (TICK_COUNT - 1);
        const lit = i === activeIndex;
        return (
          <div
            key={i}
            className="absolute bottom-0 right-0 flex flex-col"
            style={{
              width: 2,
              height: HALF * 2,
              transform: `rotate(${angle}deg) translateY(-${TRANSLATE}px)`,
            }}
          >
            <div
              style={{
                width: 2,
                height: HALF,
                background: "var(--ds-background-100)",
                opacity: lit ? 1 : 0.2,
                borderRadius: lit ? "1000px 1000px 0 0" : "1000px",
              }}
            />
            <div
              style={{
                width: 2,
                height: HALF,
                background: "var(--ds-background-100)",
                opacity: lit ? 1 : 0,
                borderRadius: "0 0 1000px 1000px",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

// Vertical thermometer scale: 17 ticks at every 2.5 °C from
// 0–40 °C. Major ticks (every 5 °C) are 24 px; minor are 12 px.
// Lit ticks are at-or-below the race temperature.
function ThermometerVisual({ celsius }: { celsius: number }) {
  const MIN_C = 0;
  const MAX_C = 40;
  const STEP = 2.5;
  const ticks: number[] = [];
  for (let v = MIN_C; v <= MAX_C; v += STEP) ticks.push(v);
  return (
    <div className="flex flex-col-reverse items-end gap-[3px]" aria-hidden>
      {ticks.map((t) => {
        const isMajor = t % 5 === 0;
        const lit = t <= celsius;
        return (
          <div
            key={t}
            className="rounded-full"
            style={{
              height: 2,
              width: isMajor ? 24 : 12,
              background: "var(--ds-background-100)",
              opacity: lit ? 1 : 0.2,
            }}
          />
        );
      })}
    </div>
  );
}

function useStatTiles(race: RaceGuideMeta): Tile[] {
  const { units } = useUnits();
  const tiles: Tile[] = [];

  if (race.distance != null) {
    tiles.push({
      key: "distance",
      Icon: Ruler,
      label: "Distance",
      value: formatDistance(race.distance, units),
      subtitle: raceTypeLabel(race.distance) ?? undefined,
    });
  }

  if (race.surface) {
    tiles.push({
      key: "surface",
      Icon: Footprints,
      label: "Surface",
      value: race.surface,
      subtitle: race.surfaceBreakdown,
    });
  }

  if (race.elevationGain != null) {
    tiles.push({
      key: "elevation",
      Icon: TrendingUp,
      label: "Elevation",
      value: formatElevation(race.elevationGain, units),
      subtitle: race.profile
        ? race.profile.charAt(0).toUpperCase() + race.profile.slice(1)
        : undefined,
      visual: <BarsVisual level={elevationLevel(race.elevationGain)} />,
    });
  }

  if (race.altitude != null) {
    tiles.push({
      key: "altitude",
      Icon: Mountain,
      label: "Altitude",
      value: formatAltitude(race.altitude, units),
      subtitle: altitudeLabel(race.altitude),
      visual: <AltitudeVisual metres={race.altitude} />,
    });
  }

  if (race.averageTemperature != null) {
    tiles.push({
      key: "temperature",
      Icon: Thermometer,
      label: "Temperature",
      value: formatTemperature(race.averageTemperature, units),
      subtitle: temperatureLabel(race.averageTemperature),
      visual: <ThermometerVisual celsius={race.averageTemperature} />,
    });
  }

  if (race.humidity != null) {
    tiles.push({
      key: "humidity",
      Icon: Droplets,
      label: "Humidity",
      value: `${Math.round(race.humidity)}%`,
      subtitle: humidityLabel(race.humidity),
      visual: <HumidityVisual percent={race.humidity} />,
    });
  }

  if (race.fieldSize != null) {
    tiles.push({
      key: "field-size",
      Icon: Users,
      label: "Field size",
      value: race.fieldSize.toLocaleString(),
    });
  }

  if (race.startTime) {
    tiles.push({
      key: "start-time",
      Icon: Clock,
      label: "Start time",
      value: race.startTime,
    });
  }

  return tiles;
}

function formatTemperature(c: number, units: UnitSystem): string {
  if (units === "imperial") {
    return `${Math.round((c * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(c)}°C`;
}

function formatAltitude(m: number, units: UnitSystem): string {
  if (units === "imperial") {
    return `${Math.round(m * 3.281).toLocaleString()} ft`;
  }
  return `${Math.round(m).toLocaleString()} m`;
}

function altitudeLabel(metres: number): string {
  if (metres < 200) return "Sea level";
  if (metres < 1000) return "Lowland";
  if (metres < 2500) return "Highland";
  return "Mountain";
}

function humidityLabel(percent: number): string {
  if (percent < 30) return "Dry";
  if (percent < 60) return "Moderate";
  return "Humid";
}

function raceTypeLabel(km: number): string | null {
  const within = (target: number, tol = 0.5) =>
    km >= target - tol && km <= target + tol;
  if (within(5)) return "5K";
  if (within(10)) return "10K";
  if (within(16.0934)) return "10 Mile";
  if (within(21.0975)) return "Half Marathon";
  if (within(42.195)) return "Marathon";
  if (km >= 50) return "Ultra";
  return null;
}

function temperatureLabel(c: number): string {
  if (c < 10) return "Cold";
  if (c < 18) return "Mild";
  if (c < 25) return "Warm";
  return "Hot";
}

function elevationLevel(metres: number): 1 | 2 | 3 | 4 {
  if (metres < 100) return 1;
  if (metres < 300) return 2;
  if (metres < 600) return 3;
  return 4;
}

// ============================================================================
// Course records.
// ============================================================================

function CourseRecordsCard({ race }: { race: RaceGuideMeta }) {
  const rows = [
    {
      label: "Men",
      time: race.mensCourseRecord,
      athlete: race.mensCourseRecordAthlete,
      country: race.mensCourseRecordCountry,
    },
    {
      label: "Women",
      time: race.womensCourseRecord,
      athlete: race.womensCourseRecordAthlete,
      country: race.womensCourseRecordCountry,
    },
    {
      label: "Men's Wheelchair",
      time: race.mensWheelchairCourseRecord,
      athlete: race.mensWheelchairCourseRecordAthlete,
      country: race.mensWheelchairCourseRecordCountry,
    },
    {
      label: "Women's Wheelchair",
      time: race.womensWheelchairCourseRecord,
      athlete: race.womensWheelchairCourseRecordAthlete,
      country: race.womensWheelchairCourseRecordCountry,
    },
  ].filter((r) => Boolean(r.time));
  if (rows.length === 0) return null;
  return (
    <section
      id={RECORDS_SECTION_ID}
      className={CARD_CLASS}
      style={{ scrollMarginTop: SCROLL_MARGIN_TOP }}
    >
      <h2 className="m-0 mb-4 text-heading-20 text-[color:var(--ds-gray-1000)]">
        Course records
      </h2>
      <ul className="m-0 list-none divide-y divide-[color:var(--ds-gray-400)] p-0">
        {rows.map((r) => {
          const detail = [r.athlete, r.country].filter(Boolean).join(", ");
          return (
            <li
              key={r.label}
              className="flex items-baseline justify-between gap-4 py-3 text-copy-14 text-[color:var(--ds-gray-1000)] first:pt-0 last:pb-0"
            >
              <span className="font-medium">{r.label}</span>
              <span className="text-right">
                <span className="font-semibold tabular-nums">{r.time}</span>
                {detail && (
                  <span className="text-[color:var(--ds-gray-900)]">
                    {" "}
                    ({detail})
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ============================================================================
// Elevation card — Recharts area chart styled with DS tokens.
// ============================================================================

const ELEVATION_GRADIENT_ID = "race-elevation-gradient";

function ElevationCard({
  series,
  onHoverDistance,
}: {
  series: ElevationPoint[];
  onHoverDistance: (distance: number | null) => void;
}) {
  const { units } = useUnits();
  const useMetric = units === "metric";
  const [lineColor] = useState(() => getRouteLineColor());
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const chart = useMemo(() => {
    const distKm = series.map((p) => p.distance);
    const eleM = series.map((p) => p.elevation);
    const maxKm = Math.max(...distKm);
    const minM = Math.min(...eleM);
    const maxM = Math.max(...eleM);

    const points = series.map((p) => ({
      distance: useMetric ? p.distance : p.distance / 1.609344,
      elevation: useMetric ? p.elevation : p.elevation * 3.28084,
    }));

    const distMax = useMetric ? Math.ceil(maxKm) : Math.ceil(maxKm / 1.609344);
    const distInterval = distanceTickInterval(distMax, useMetric);
    const distTicks: number[] = [];
    for (let v = 0; v <= distMax; v += distInterval) distTicks.push(v);

    const eleInterval = elevationTickInterval(maxM - minM, useMetric);
    const eleStart = useMetric
      ? Math.floor(minM / eleInterval) * eleInterval
      : Math.floor((minM * 3.28084) / eleInterval) * eleInterval;
    const eleEnd = useMetric
      ? Math.ceil(maxM / eleInterval) * eleInterval
      : Math.ceil((maxM * 3.28084) / eleInterval) * eleInterval;
    const eleTicks: number[] = [];
    for (let v = eleStart; v <= eleEnd; v += eleInterval) eleTicks.push(v);

    return {
      points,
      distDomain: [0, distMax] as [number, number],
      eleDomain: [eleStart, eleEnd] as [number, number],
      distTicks,
      eleTicks,
    };
  }, [series, useMetric]);

  const distanceUnit = useMetric ? "km" : "mi";
  const elevationUnit = useMetric ? "m" : "ft";
  const axisColor = "rgba(var(--ds-gray-1000-rgb), 0.55)";
  const gridColor = "var(--ds-gray-400)";

  return (
    <section
      id={ELEVATION_SECTION_ID}
      className={CARD_CLASS}
      style={{ scrollMarginTop: SCROLL_MARGIN_TOP }}
    >
      <h2 className="m-0 mb-4 text-heading-20 text-[color:var(--ds-gray-1000)]">
        Elevation profile
      </h2>
      <div
        ref={chartContainerRef}
        style={{ height: 220 }}
        onMouseMove={(e) => {
          // Native handler instead of Recharts' onMouseMove
          // because Recharts' state shape has shifted across
          // versions. Compute distance from cursor X relative
          // to the chart's plot area — left padding ≈ YAxis
          // width (44 px) + AreaChart margin.left (-8) = 36 px;
          // right padding ≈ margin.right (8 px). Imprecise by a
          // pixel or two but the lookup snaps to the closest
          // sample so small offsets don't matter.
          const container = chartContainerRef.current;
          if (!container || series.length === 0) return;
          const rect = container.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const leftPad = 36;
          const rightPad = 8;
          const plotWidth = rect.width - leftPad - rightPad;
          if (plotWidth <= 0) return;
          const ratio = (mouseX - leftPad) / plotWidth;
          if (ratio < 0 || ratio > 1) {
            onHoverDistance(null);
            return;
          }
          const maxKm = series[series.length - 1].distance;
          onHoverDistance(ratio * maxKm);
        }}
        onMouseLeave={() => onHoverDistance(null)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chart.points}
            margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={ELEVATION_GRADIENT_ID}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.32} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke={gridColor}
              strokeDasharray="2 4"
              vertical={false}
            />
            <XAxis
              dataKey="distance"
              type="number"
              domain={chart.distDomain}
              ticks={chart.distTicks}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: axisColor, fontSize: 11 }}
              tickFormatter={(v: number) => `${Math.round(v)}${distanceUnit}`}
            />
            <YAxis
              type="number"
              domain={chart.eleDomain}
              ticks={chart.eleTicks}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={44}
              tick={{ fill: axisColor, fontSize: 11 }}
              tickFormatter={(v: number) =>
                `${Math.round(v).toLocaleString()}${elevationUnit}`
              }
            />
            <Tooltip
              content={
                <ElevationTooltip
                  distanceUnit={distanceUnit}
                  elevationUnit={elevationUnit}
                  points={chart.points}
                  useMetric={useMetric}
                />
              }
              cursor={{
                stroke: "var(--ds-gray-1000)",
                strokeWidth: 1,
                strokeDasharray: "2 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="elevation"
              stroke={lineColor}
              strokeWidth={2}
              fill={`url(#${ELEVATION_GRADIENT_ID})`}
              isAnimationActive={false}
              activeDot={{
                r: 3,
                fill: lineColor,
                stroke: "var(--ds-background-100)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

interface ElevationTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { distance: number; elevation: number } }>;
  distanceUnit: string;
  elevationUnit: string;
  points: Array<{ distance: number; elevation: number }>;
  useMetric: boolean;
}

function ElevationTooltip({
  active,
  payload,
  distanceUnit,
  elevationUnit,
  points,
  useMetric,
}: ElevationTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  const grade = computeGrade(points, point.distance, useMetric);
  return (
    <div
      className="rounded-md border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] px-3 py-2"
      style={{ boxShadow: "var(--ds-shadow-menu)" }}
    >
      <TooltipRow
        label="Distance"
        value={`${point.distance.toFixed(2)} ${distanceUnit}`}
      />
      <TooltipRow
        label="Elevation"
        value={`${Math.round(point.elevation).toLocaleString()} ${elevationUnit}`}
      />
      <TooltipRow
        label="Grade"
        value={`${grade >= 0 ? "+" : ""}${grade.toFixed(1)}%`}
      />
    </div>
  );
}

function TooltipRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-copy-13">
      <span className="text-[color:var(--ds-gray-900)]">{label}</span>
      <span className="font-semibold tabular-nums text-[color:var(--ds-gray-1000)]">
        {value}
      </span>
    </div>
  );
}

function computeGrade(
  points: Array<{ distance: number; elevation: number }>,
  targetDistance: number,
  useMetric: boolean,
): number {
  if (points.length < 2) return 0;
  let lo = 0;
  let hi = points.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (points[mid].distance < targetDistance) lo = mid + 1;
    else hi = mid;
  }
  const idx =
    lo > 0 &&
    Math.abs(points[lo - 1].distance - targetDistance) <
      Math.abs(points[lo].distance - targetDistance)
      ? lo - 1
      : lo;
  const lookAhead = 3;
  const startIdx = Math.max(0, idx - lookAhead);
  const endIdx = Math.min(points.length - 1, idx + lookAhead);
  if (endIdx <= startIdx) return 0;
  const elevationChange = points[endIdx].elevation - points[startIdx].elevation;
  const distanceChange = points[endIdx].distance - points[startIdx].distance;
  if (distanceChange <= 0) return 0;
  const distanceLinear = useMetric
    ? distanceChange * 1000
    : distanceChange * 5280;
  return (elevationChange / distanceLinear) * 100;
}

function pickTickInterval(
  range: number,
  candidates: number[],
  maxTicks: number,
): number {
  for (const c of candidates) {
    if (Math.ceil(range / c) <= maxTicks) return c;
  }
  return candidates[candidates.length - 1];
}

const DISTANCE_TICK_CANDIDATES_KM = [1, 2, 5, 10, 20, 50, 100];
const DISTANCE_TICK_CANDIDATES_MI = [0.5, 1, 2, 5, 10, 25, 50];
const ELEVATION_TICK_CANDIDATES_M = [10, 20, 50, 100, 250, 500, 1000];
const ELEVATION_TICK_CANDIDATES_FT = [25, 50, 100, 250, 500, 1000, 2500];
const MAX_X_TICKS = 6;
const MAX_Y_TICKS = 5;

function distanceTickInterval(maxDist: number, useMetric: boolean): number {
  return pickTickInterval(
    maxDist,
    useMetric ? DISTANCE_TICK_CANDIDATES_KM : DISTANCE_TICK_CANDIDATES_MI,
    MAX_X_TICKS,
  );
}

function elevationTickInterval(rangeMetres: number, useMetric: boolean): number {
  if (useMetric) {
    return pickTickInterval(
      rangeMetres,
      ELEVATION_TICK_CANDIDATES_M,
      MAX_Y_TICKS,
    );
  }
  return pickTickInterval(
    rangeMetres * 3.28084,
    ELEVATION_TICK_CANDIDATES_FT,
    MAX_Y_TICKS,
  );
}

// ============================================================================
// Body sections — one card per H2 in the editorial body, with
// AdsCard interleaved every 3 sections for longer guides.
// ============================================================================

const SECTIONS_PER_AD = 3;
const MIN_SECTIONS_FOR_ADS = 4;

function shouldInsertAdAfter(idx: number, total: number): boolean {
  if (total < MIN_SECTIONS_FOR_ADS) return false;
  const positionFromTop = idx + 1;
  return positionFromTop % SECTIONS_PER_AD === 0 && positionFromTop < total;
}

function BodySections({ sections }: { sections: BodySection[] }) {
  if (sections.length === 0) return null;
  return (
    <>
      {sections.map((section, i) => (
        <Fragment key={section.id}>
          <BodySectionCard section={section} />
          {shouldInsertAdAfter(i, sections.length) && <AdsCard />}
        </Fragment>
      ))}
    </>
  );
}

function BodySectionCard({ section }: { section: BodySection }) {
  return (
    <section
      id={section.id}
      className={CARD_CLASS}
      style={{ scrollMarginTop: SCROLL_MARGIN_TOP }}
    >
      <h2 className="m-0 mb-4 text-heading-20 text-[color:var(--ds-gray-1000)]">
        {section.title}
      </h2>
      <PortableText value={section.blocks} components={BODY_PT_COMPONENTS} />
    </section>
  );
}

// Body Portable Text renderer. DS-token-anchored typography.
const BODY_PT_COMPONENTS = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 text-copy-16 text-[color:var(--ds-gray-1000)] last:mb-0">
        {children}
      </p>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-2 mt-6 text-heading-16 text-[color:var(--ds-gray-1000)] first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mb-2 mt-4 text-heading-14 text-[color:var(--ds-gray-1000)] first:mt-0">
        {children}
      </h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-5 border-l-2 border-[color:var(--ds-gray-400)] pl-4 text-copy-16 italic text-[color:var(--ds-gray-900)]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold">{children}</strong>
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
    }) => {
      const isExternal = value?.href?.startsWith("http");
      return (
        <a
          href={value?.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-[color:var(--ds-gray-1000)] underline underline-offset-2 hover:text-[color:var(--ds-gray-700)]"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-4 list-disc space-y-2 pl-6 text-copy-16 text-[color:var(--ds-gray-1000)] last:mb-0 marker:text-[color:var(--ds-gray-700)]">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li>{children}</li>
    ),
  },
  types: {
    image: BodyImage,
  },
};

type BodyImageValue = SanityImageSource & {
  alt?: string;
  caption?: string;
  credit?: string;
};

function BodyImage({ value }: { value: BodyImageValue }) {
  if (!value) return null;
  const url = urlFor(value).width(960).auto("format").url();
  return (
    <figure className="my-5">
      <div className="overflow-hidden rounded">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={value.alt ?? ""} className="block w-full" />
      </div>
      {(value.caption || value.credit) && (
        <figcaption className="mt-2 text-copy-13 text-[color:var(--ds-gray-900)]">
          {value.caption}
          {value.caption && value.credit ? " " : ""}
          {value.credit && (
            <span className="text-[color:var(--ds-gray-700)]">
              — {value.credit}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
