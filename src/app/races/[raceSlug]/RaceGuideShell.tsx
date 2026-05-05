"use client";

// src/app/races/[raceSlug]/RaceGuideShell.tsx
//
// Map-led race guide canvas modelled on trippin.world's guide
// pages. The Mapbox map is sticky at the top of the viewport
// (just below the 50 px SiteHeader); the editorial panel sits
// on top of the map on the left and grows tall enough to make
// the page itself scroll. The panel scrolls with the page; the
// map stays put.

import { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import {
  ArrowDown,
  ChevronRight,
  ChevronsUp,
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
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { DarkModeContext } from "@/components/DarkModeProvider";
import { AdSlot } from "@/components/ui/AdSlot";
import { Switch } from "@/components/ui/Switch";
import { formatDistance, formatElevation } from "@/lib/raceUtils";
import { useUnits, type UnitSystem } from "@/contexts/UnitsContext";

export interface RaceGuideMeta {
  _id: string;
  title: string;
  slug?: string;
  eventDate?: string;
  startTime?: string;
  city?: string;
  stateRegion?: string;
  country?: string;
  category?: string;
  distance?: number;
  surface?: string;
  surfaceBreakdown?: string;
  profile?: string;
  elevationGain?: number;
  elevationLoss?: number;
  altitude?: number;
  humidity?: number;
  averageTemperature?: number;
  price?: number;
  currency?: string;
  fieldSize?: number;
  mensCourseRecord?: string;
  mensCourseRecordAthlete?: string;
  mensCourseRecordCountry?: string;
  womensCourseRecord?: string;
  womensCourseRecordAthlete?: string;
  womensCourseRecordCountry?: string;
  officialWebsite?: string;
  tags?: string[];
  introduction?: PortableTextBlock[];
  body?: PortableTextBlock[];
}

interface RaceGuideShellProps {
  race: RaceGuideMeta;
  routeGeoJsonUrl: string | null;
  heroImageUrl: string | null;
}

const ROUTE_LINE_COLOR = "#FF0058";

// Sticky map sits just below the 50 px SiteHeader, filling the
// rest of the viewport while the page scrolls past it.
const MAP_STICKY_TOP = 50;
const MAP_VIEWPORT_HEIGHT = "calc(100vh - 50px)";

const PANEL_WIDTH = 520;
const PANEL_INSET = 32;
// Extra breathing room around the route bbox so the map reads
// slightly zoomed out — the panel ate enough of the canvas
// width that the route would otherwise feel cramped.
const ROUTE_BREATHING = 96;

export default function RaceGuideShell({
  race,
  routeGeoJsonUrl,
  heroImageUrl,
}: RaceGuideShellProps) {
  return (
    // Single-cell grid: the sticky map and the editorial panel
    // both occupy row 1 / col 1. The cell auto-sizes to the
    // larger of the two children — so when the panel is taller
    // than the viewport, the grid (and therefore <main>) grows
    // tall enough to drive page scroll, while the map's
    // `position: sticky; top: 50px` keeps it pinned just under
    // the SiteHeader throughout that scroll.
    <div
      className="relative grid w-full"
      style={{ gridTemplateColumns: "1fr", gridTemplateRows: "auto" }}
      aria-label={`${race.title} route guide`}
    >
      <div
        className="overflow-hidden"
        style={{
          gridColumn: 1,
          gridRow: 1,
          position: "sticky",
          top: MAP_STICKY_TOP,
          height: MAP_VIEWPORT_HEIGHT,
        }}
      >
        {routeGeoJsonUrl ? (
          <RaceMap geoJsonUrl={routeGeoJsonUrl} />
        ) : (
          <StatusOverlay text="Route map coming soon." />
        )}
      </div>

      {/* Panel layer over the same grid cell. position:relative
          + zIndex lifts the wrapper above the sticky map: without
          this, the static wrapper would paint in a lower layer
          than the map (which is positioned via `sticky`), and
          Mapbox's absolutely-positioned canvas would cover the
          panel. The container is padded for the panel inset and
          is pointer-events:none so map interactions pass through
          the empty area; the aside re-enables pointer events so
          its own content stays interactive. */}
      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
          padding: PANEL_INSET,
          pointerEvents: "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        <GuidePanel race={race} heroImageUrl={heroImageUrl} />
      </div>
    </div>
  );
}

// ============================================================================
// Mapbox island
// ============================================================================

type MapStatus =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "error"; message: string };

function RaceMap({ geoJsonUrl }: { geoJsonUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const geoJsonRef = useRef<GeoJSON.FeatureCollection | null>(null);
  const { isDark } = useContext(DarkModeContext);
  const [status, setStatus] = useState<MapStatus>({ kind: "loading" });

  useEffect(() => {
    if (!containerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      setStatus({
        kind: "error",
        message: "Map unavailable — NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN missing.",
      });
      return;
    }
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: styleForMode(isDark),
      center: [0, 0],
      zoom: 1,
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "bottom-right",
    );

    map.on("error", (e) => {
      const msg =
        (e?.error as Error | undefined)?.message ?? "Mapbox error";
      // eslint-disable-next-line no-console
      console.error("[RaceMap] mapbox error:", msg, e);
      setStatus({ kind: "error", message: msg });
    });

    map.on("load", async () => {
      try {
        const res = await fetch(geoJsonUrl);
        if (!res.ok) throw new Error(`Route fetch HTTP ${res.status}`);
        const data = (await res.json()) as GeoJSON.FeatureCollection;
        geoJsonRef.current = data;
        addRouteLayer(map, data);
        const fitted = fitToRoute(map, data);
        if (!fitted) {
          setStatus({
            kind: "error",
            message: "Route GeoJSON contains no coordinates.",
          });
          return;
        }
        setStatus({ kind: "ready" });
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to load route";
        // eslint-disable-next-line no-console
        console.error("[RaceMap] route load failed:", err);
        setStatus({ kind: "error", message: msg });
      }
    });

    // Re-add the route layer after a style swap (setStyle wipes
    // user-added sources/layers).
    map.on("style.load", () => {
      const data = geoJsonRef.current;
      if (data) addRouteLayer(map, data);
    });

    // Resize after the first paint as a guard against the
    // container measuring 0 dimensions before layout settles.
    requestAnimationFrame(() => map.resize());

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoJsonUrl]);

  // Swap style when dark mode flips. Doesn't recreate the map.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(styleForMode(isDark));
  }, [isDark]);

  return (
    <>
      <div ref={containerRef} className="h-full w-full" />
      {status.kind === "loading" && (
        <StatusOverlay text="Loading route…" subtle />
      )}
      {status.kind === "error" && <StatusOverlay text={status.message} />}
    </>
  );
}

function StatusOverlay({
  text,
  subtle = false,
}: {
  text: string;
  subtle?: boolean;
}) {
  return (
    <div
      className={[
        "pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center text-copy-14",
        subtle
          ? "bg-[color:var(--ds-background-100)]/40 text-[color:var(--ds-gray-900)]"
          : "bg-[color:var(--ds-gray-100)] text-[color:var(--ds-gray-900)]",
      ].join(" ")}
    >
      {text}
    </div>
  );
}

function styleForMode(isDark: boolean): string {
  return isDark
    ? "mapbox://styles/mapbox/dark-v11"
    : "mapbox://styles/mapbox/light-v11";
}

function addRouteLayer(
  map: mapboxgl.Map,
  data: GeoJSON.FeatureCollection,
): void {
  if (map.getSource("race-route")) return;
  map.addSource("race-route", { type: "geojson", data });
  map.addLayer({
    id: "race-route-line",
    type: "line",
    source: "race-route",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": ROUTE_LINE_COLOR,
      "line-width": 4,
    },
  });
}

function fitToRoute(
  map: mapboxgl.Map,
  data: GeoJSON.FeatureCollection,
): boolean {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  let hasPoint = false;

  const visit = (coords: GeoJSON.Position) => {
    const [lng, lat] = coords;
    if (typeof lng !== "number" || typeof lat !== "number") return;
    hasPoint = true;
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  };

  for (const feature of data.features) {
    const geom = feature.geometry;
    if (!geom) continue;
    if (geom.type === "LineString") {
      geom.coordinates.forEach(visit);
    } else if (geom.type === "MultiLineString") {
      geom.coordinates.forEach((line) => line.forEach(visit));
    } else if (geom.type === "Point") {
      visit(geom.coordinates);
    }
  }

  if (!hasPoint) return false;
  // Left padding accounts for the floating panel's inset + width
  // plus extra breathing room. Other sides also get the breathing
  // value so the route reads centred and slightly zoomed out.
  map.fitBounds(
    [
      [minLng, minLat],
      [maxLng, maxLat],
    ],
    {
      padding: {
        top: ROUTE_BREATHING,
        bottom: ROUTE_BREATHING,
        left: PANEL_INSET + PANEL_WIDTH + ROUTE_BREATHING,
        right: ROUTE_BREATHING,
      },
      duration: 0,
    },
  );
  return true;
}

// ============================================================================
// Guide panel — vertical stack of editorial cards over the map.
// The wrapper has no visual treatment of its own; each card
// inside carries the floating-surface look (bg, rounded edge,
// shadow-menu elevation). Cards stack with a 24 px gap and the
// page itself scrolls; the panel never scrolls internally.
// ============================================================================

interface GuidePanelProps {
  race: RaceGuideMeta;
  heroImageUrl: string | null;
}

function GuidePanel({ race, heroImageUrl }: GuidePanelProps) {
  return (
    <div
      className="flex flex-col gap-6"
      style={{
        width: PANEL_WIDTH,
        pointerEvents: "auto",
      }}
    >
      <HeroCard race={race} imageUrl={heroImageUrl} />
      <StatsCard race={race} />
      <TocCard body={race.body} />
      <AdsCard />
      {/* Temporary spacer so the page keeps scrolling while we
          add more cards in subsequent iterations. Remove once
          the stack is full enough to overflow on its own. */}
      <div style={{ minHeight: 1500 }} />
    </div>
  );
}

// Reusable card surface — one of these per content section so
// each editorial block carries its own elevated treatment over
// the map.
const CARD_CLASS =
  "overflow-hidden rounded-md bg-[color:var(--ds-background-200)] dark:bg-[color:var(--ds-background-100)]";
const CARD_SHADOW = "var(--ds-shadow-menu)";

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
      className={`${CARD_CLASS} p-5`}
      style={{ boxShadow: CARD_SHADOW }}
    >
      {imageUrl && (
        // Image sits inset within the card surface — the card's
        // bg shows around it as a frame. Inner radius is one
        // step down from the card's so the visible margin
        // between the two reads consistently. 3:4 portrait so
        // the hero leans editorial.
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded">
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
      // Filter the index to races on the same calendar day.
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

// "2026-07-12" from any ISO datetime — drops the time portion
// so the /races index filter matches the entire calendar day
// in the visitor's local timezone-ish way (the index treats
// dateFrom / dateTo as date-only strings).
function isoDate(iso: string): string | null {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

// ============================================================================
// In-this-guide TOC card. Derives one entry per H2 block in the
// raceGuide body. Each link points to the matching `#section-id`
// anchor, which the body card (still to come) will stamp on its
// rendered <h2> elements. Auto-hides when the body has no H2s
// (e.g. the empty NYC race).
// ============================================================================

interface TocEntry {
  id: string;
  title: string;
}

function TocCard({ body }: { body?: PortableTextBlock[] }) {
  const entries = deriveTocEntries(body);
  if (entries.length === 0) return null;
  return (
    <aside
      className={`${CARD_CLASS} p-5`}
      style={{ boxShadow: CARD_SHADOW }}
    >
      <h2 className="m-0 mb-4 text-heading-20 text-[color:var(--ds-gray-1000)]">
        In this guide
      </h2>
      <ol className="m-0 list-none divide-y divide-[color:var(--ds-gray-400)] p-0">
        {entries.map((entry, i) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
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

// Walks Portable Text body blocks, picks out H2s, joins their
// span text, and slugifies for the anchor id. Falls back to
// `section-N` if a heading has no plain text (rare).
function deriveTocEntries(
  body: PortableTextBlock[] | undefined,
): TocEntry[] {
  if (!body) return [];
  const out: TocEntry[] = [];
  body.forEach((block, idx) => {
    if (block._type !== "block") return;
    if ((block as { style?: string }).style !== "h2") return;
    const children = (block as { children?: { _type?: string; text?: string }[] })
      .children;
    const text = (children ?? [])
      .filter((c) => c._type === "span")
      .map((c) => c.text ?? "")
      .join("")
      .trim();
    if (!text) return;
    out.push({
      id: slugify(text) || `section-${idx + 1}`,
      title: text,
    });
  });
  return out;
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
// Ad card. MPU (300×250) AdSlot inside the panel's standard card
// surface. `preview` is on for now since this position doesn't
// have a real AdSense slot ID — the fallback below renders in
// its place. Wire a real `slot` ID and drop `preview` once the
// AdSense unit is created.
// ============================================================================

function AdsCard() {
  return (
    <div
      className={`${CARD_CLASS} p-5`}
      style={{ boxShadow: CARD_SHADOW }}
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

// ============================================================================
// Stats card. 2-column grid of dark stat tiles (matches the
// "primary" pill treatment: --ds-gray-1000 bg, --ds-background-100
// text — both flip with theme so the tile reads as an inverted
// surface in both modes). Each tile auto-omits when its
// underlying field is empty so sparse races render fewer tiles
// without leaving holes.
// ============================================================================

function StatsCard({ race }: { race: RaceGuideMeta }) {
  const tiles = useStatTiles(race);
  // The Switch is bound to the same UnitsContext as
  // /races/RaceUnitControls, so flipping it here also updates
  // the index page (and persists via localStorage).
  const { units, setUnits } = useUnits();
  if (tiles.length === 0) return null;
  return (
    <section
      className={`${CARD_CLASS} p-5`}
      style={{ boxShadow: CARD_SHADOW }}
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
  /** Optional bottom-right indicator. Each tile builds its own
   *  shape (bars, thermometer, etc) so visuals stay distinct
   *  per-stat rather than reusing the same primitive. */
  visual?: React.ReactNode;
}

function StatTile({ Icon, label, value, subtitle, visual }: Tile) {
  return (
    // Tiles are content-sized; the grid's row-stretch keeps
    // tiles in the same row uniform-height. Visual sits
    // absolute bottom-right so it doesn't add to the tile's
    // intrinsic height and can overlap the value text on
    // tiles where the value is long.
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
      {/* Always render the subtitle slot — even when empty —
          so every tile lands at the same height. Tiles without
          a real subtitle render a non-breaking space so the
          row still occupies the full text-copy-13 line height. */}
      <div
        className="mt-auto text-copy-13 font-medium"
        style={{ opacity: 0.6 }}
      >
        {subtitle ?? " "}
      </div>
      {visual && (
        <div className="pointer-events-none absolute bottom-4 right-4">
          {visual}
        </div>
      )}
    </div>
  );
}

// Four ascending pill bars (6 / 12 / 24 / 36 px tall) inside a
// 36 px square. The first `level` bars from the left render at
// full opacity; the remainder dim to ~20% so the silhouette
// still reads as a bar chart at-rest. Anchored to the same
// foreground colour as the tile's value text so it inverts
// cleanly with the theme.
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

// Vertical thermometer-style scale. 15 horizontal pill ticks
// stacked from 0 °C (bottom) to 35 °C (top) in 2.5 °C steps.
// Major ticks at every 5 °C are wider (18 px) so the scale
// reads like a thermometer's degree markings; minor 2.5 °C
// ticks are narrower (10 px). Lit ticks are at-or-below the
// race temperature; the rest dim to 20 %. Right-aligned so all
// ticks share a "spine" on the right edge.
// Ticks ascend from the tile's bottom-right corner upward.
// Anchored to start at the bottom and extend up — the
// silhouette can rise into the row of the value text, which
// is fine: the visual is decorative and uses pointer-events:
// none, and the tile's heading-24 sits above it. Major ticks
// at every 5 °C are wider (24 px), minor 2.5 °C ticks are
// narrower (12 px) so the scale reads like a thermometer's
// degree markings. Ticks at-or-below the race temperature
// render full-opacity; the rest dim to 20 %. Right-aligned so
// every tick shares a vertical "spine" on the right edge.
function ThermometerVisual({ celsius }: { celsius: number }) {
  // 13 ticks covering 0–30 °C in 2.5 °C steps. Tighter overall
  // than the previous 0–40 / 17-tick design — fits the same
  // bottom-right slot as the BarsVisual (~37 px footprint).
  const MIN_C = 0;
  const MAX_C = 30;
  const STEP = 2.5;
  const ticks: number[] = [];
  for (let v = MIN_C; v <= MAX_C; v += STEP) ticks.push(v);
  return (
    <div className="flex flex-col-reverse items-end gap-[2px]" aria-hidden>
      {ticks.map((t) => {
        const isMajor = t % 5 === 0;
        const lit = t <= celsius;
        return (
          <div
            key={t}
            className="rounded-full"
            style={{
              height: 1,
              width: isMajor ? 16 : 8,
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

  // Order is curated — fastest-glance facts first (distance,
  // surface, elevation), then environment (altitude, temp,
  // humidity), then logistics (field size, start time).

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

  // Plain string from the schema's startTime field — editor
  // types literal race-local time so no timezone math is
  // needed. Falls back to nothing (tile omits) when not set.
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

// °C → °F when the visitor prefers imperial. Source values are
// always stored in °C in Sanity.
function formatTemperature(c: number, units: UnitSystem): string {
  if (units === "imperial") {
    return `${Math.round((c * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(c)}°C`;
}

// metres → feet conversion + thousands separator. Source values
// are always stored in metres in Sanity.
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

// Maps a race distance (km) to the closest standard race-type
// label per World Athletics / AIMS — the same set the /races
// distance filter chip uses. ±0.5 km tolerance handles editor
// rounding (42.2 vs 42.195, etc). Unknown distances return
// null so the tile renders without a subtitle.
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

// Same buckets the /races temperature filter uses (°C-anchored,
// regardless of viewer's display unit) so the label reads
// consistently across surfaces.
function temperatureLabel(c: number): string {
  if (c < 10) return "Cold";
  if (c < 18) return "Mild";
  if (c < 25) return "Warm";
  return "Hot";
}

// Elevation gain (metres) → 4-bucket intensity scale that maps
// onto the BarsVisual. Tuned for marathon-distance gains; tweak
// thresholds when shorter/longer races need a different feel.
function elevationLevel(metres: number): 1 | 2 | 3 | 4 {
  if (metres < 100) return 1; // very flat (Berlin, Chicago)
  if (metres < 300) return 2; // rolling
  if (metres < 600) return 3; // hilly
  return 4; // mountain
}

// Plain fallback — no border / bg of its own because the parent
// panel card already supplies the surface, hairline, and
// shadow. Just inner content.
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

function formatPillDate(iso: string | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : format(d, "d MMM, yyyy");
}
