"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import {
  TbRoad,
  TbArrowCapsule,
  TbMountain,
  TbCalendar,
  TbCloud,
  TbStopwatch,
  TbDeviceWatch,
  TbHeadphones,
  TbShirt,
  TbBatteryCharging,
  TbBottle,
  TbFlag,
  TbCalendarEvent,
  TbDatabase,
} from "react-icons/tb";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import MegaMenuPanel, {
  type MegaMenuFeatured,
} from "@/components/ui/MegaMenuPanel";
import { cn } from "@/lib/utils";

// ============================================================================
// Public types — shared with MobileNavDrawer and SiteHeaderWrapper.
// SiteHeaderWrapper fetches every featured* item via Sanity (mobile
// drawer + mega-menu both need them), so the FeaturedProduct /
// FeaturedRace shapes stay exported.
// ============================================================================

type SanitySlug = { current: string };

export type FeaturedProduct = {
  title: string;
  slug: SanitySlug;
  mainImage?: SanityImageSource | null;
  excerpt?: string;
} | null;

export type FeaturedRace = {
  title: string;
  slug: SanitySlug;
  mainImage?: SanityImageSource | null;
  eventDate?: string;
  location?: string;
} | null;

// ============================================================================
// Taxonomy — exported so MobileNavDrawer (and other consumers) can
// render the same link sets the desktop nav points at.
// ============================================================================

export type CategoryItem = {
  label: string;
  href: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
};

export const newsLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Road",
    href: "/articles/road",
    description: "Marathon and road racing",
    Icon: TbRoad,
  },
  {
    label: "Track",
    href: "/articles/track",
    description: "From 100m to 10,000m",
    Icon: TbArrowCapsule,
  },
  {
    label: "Trail",
    href: "/articles/trail",
    description: "Mountain and ultra racing",
    Icon: TbMountain,
  },
];

export const shoeLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Race-Day",
    href: "/shoes/race-day-shoes",
    description: "Built for PR days",
    Icon: TbFlag,
  },
  {
    label: "Daily Trainers",
    href: "/shoes/daily-trainers",
    description: "Your go-to runners",
    Icon: TbCalendar,
  },
  {
    label: "Max Cushion",
    href: "/shoes/max-cushion",
    description: "Plush for long miles",
    Icon: TbCloud,
  },
  {
    label: "Tempo",
    href: "/shoes/tempo-shoes",
    description: "Responsive and fast",
    Icon: TbStopwatch,
  },
  {
    label: "Trail",
    href: "/shoes/trail-shoes",
    description: "Off-road traction",
    Icon: TbMountain,
  },
];

export const gearLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Watches",
    href: "/gear/watches",
    description: "Track every run",
    Icon: TbDeviceWatch,
  },
  {
    label: "Headphones",
    href: "/gear/headphones",
    description: "Music on the move",
    Icon: TbHeadphones,
  },
  {
    label: "Apparel",
    href: "/gear/apparel",
    description: "Kit for every season",
    Icon: TbShirt,
  },
];

export const nutritionLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Gels",
    href: "/nutrition/gels",
    description: "Fast-acting fuel",
    Icon: TbBatteryCharging,
  },
  {
    label: "Hydration",
    href: "/nutrition/hydration",
    description: "Electrolytes and drinks",
    Icon: TbBottle,
  },
];

export const raceLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Races",
    href: "/races",
    description: "Browse race guides",
    Icon: TbFlag,
  },
  {
    label: "Calendar",
    href: "/races/calendar",
    description: "Upcoming races",
    Icon: TbCalendarEvent,
  },
  {
    label: "Database",
    href: "/races/database",
    description: "Search every race",
    Icon: TbDatabase,
  },
];

// ============================================================================
// Section config — five top-level mega-menu sections
// ============================================================================

type SectionKey = "news" | "shoes" | "gear" | "nutrition" | "races";

interface SectionDef {
  key: SectionKey;
  label: string;
  /** Where the trigger navigates if the user clicks it. */
  href: string;
  /** Eyebrow above the serif heading in the left column. */
  eyebrow: string;
  /** Serif heading shown in the left column. */
  heading: string;
  /** Lede beneath the heading. */
  tagline: string;
  /** CTA label, e.g. "View all news". */
  ctaLabel: string;
  /** CTA destination. */
  ctaHref: string;
  /** Middle-column link grid. */
  links: ReadonlyArray<CategoryItem>;
}

const SECTIONS: ReadonlyArray<SectionDef> = [
  {
    key: "news",
    label: "News",
    href: "/articles",
    eyebrow: "News",
    heading: "The latest in running",
    tagline: "Road, track, trail — every story worth your time.",
    ctaLabel: "View all news",
    ctaHref: "/articles",
    links: newsLinks,
  },
  {
    key: "shoes",
    label: "Shoes",
    href: "/shoes",
    eyebrow: "Shoes",
    heading: "Shoes that work",
    tagline: "From PR-day plates to daily trainers — tested by runners.",
    ctaLabel: "Browse all shoes",
    ctaHref: "/shoes",
    links: shoeLinks,
  },
  {
    key: "gear",
    label: "Gear",
    href: "/gear",
    eyebrow: "Gear",
    heading: "Kit for every run",
    tagline: "Watches, headphones, apparel — what to wear and carry.",
    ctaLabel: "Browse all gear",
    ctaHref: "/gear",
    links: gearLinks,
  },
  {
    key: "nutrition",
    label: "Nutrition",
    href: "/nutrition",
    eyebrow: "Nutrition",
    heading: "Fuel that delivers",
    tagline: "Gels and hydration that hold up at race pace.",
    ctaLabel: "Browse all nutrition",
    ctaHref: "/nutrition",
    links: nutritionLinks,
  },
  {
    key: "races",
    label: "Races",
    href: "/races",
    eyebrow: "Races",
    heading: "Find your next race",
    tagline: "Race guides, calendar, and a full database of events.",
    ctaLabel: "Browse all races",
    ctaHref: "/races",
    links: raceLinks,
  },
];

// ============================================================================
// Trigger anatomy
// ============================================================================
//
// Pill chip taken from Frontify's .ff-navbar-trigger spec:
//   - 14 px / 500 / 21 lh
//   - h-9 + px-4 (8 px / 16 px) — yields 36 px tall
//   - rounded-full so the hover bg reads as a true pill
//   - hover/focus + data-[state=open] all use bg-[var(--ds-gray-200)]
//     — the Geist "component background" hue, a step deeper than the
//     parent pill's translucent bg-200 fill so the chip pops without
//     reading as "selected". Flips correctly in dark mode (becomes a
//     visible light overlay on the near-black pill).
//   - The chevron rotates 180° while the trigger is hovered/focused
//     OR while its content is open. The Radix data-state attribute
//     drives the "stays rotated while menu open" branch — group-hover
//     alone wouldn't survive the user moving their pointer down onto
//     the panel.

const TRIGGER_CLASS = cn(
  // Named group `group/trigger` so the chevron can target THIS
  // element's hover / focus / data-state without colliding with the
  // outer `group/menu` on the bridge wrapper (which also carries
  // data-state=open for the whole-menu open flag).
  "group/trigger inline-flex h-9 items-center gap-1.5 rounded-full px-4 py-2",
  "text-[14px] leading-[21px] font-medium",
  "text-[color:var(--ds-gray-1000)]",
  "transition-colors",
  "hover:bg-[var(--ds-gray-200)] focus-visible:bg-[var(--ds-gray-200)]",
  "data-[state=open]:bg-[var(--ds-gray-200)]",
  "focus-visible:outline-none",
);

// Chevron — 16 px (size-4), rotates 180° on hover, focus, or open.
// All three selectors target the named /trigger group so the chevron
// only reacts to ITS OWN trigger's state. Without the name, the bare
// `group-*` selectors would also match the bridge wrapper (which is
// `group/menu` + data-state=open while ANY section is open) — and
// every chevron in the row would rotate at the same time.
const CHEVRON_CLASS = cn(
  "size-4 transition-transform duration-[220ms] ease-out",
  "group-hover/trigger:rotate-180 group-focus-visible/trigger:rotate-180",
  "group-data-[state=open]/trigger:rotate-180",
);

// ============================================================================
// Shared props for both the all-in-one default export and the split
// Root / Triggers composition used by SiteHeader.
// ============================================================================

export interface SiteNavigationMenuProps {
  featuredNews: FeaturedProduct;
  featuredShoe: FeaturedProduct;
  featuredGear: FeaturedProduct;
  featuredNutrition: FeaturedProduct;
  featuredRace: FeaturedRace;
}

// ============================================================================
// SiteNavigationMenuRoot
// ============================================================================
//
// Composition primitive for SiteHeader: wraps both the trigger row
// AND the Viewport in a single NavigationMenu.Root so Radix can wire
// them together. The triggers + Viewport live in physically separate
// places inside the floating pill, but they MUST share one Root
// context — that's why this wrapper exists.
//
// `className="contents"` makes the Root contribute no box, so the
// triggers + viewport flow into whatever layout SiteHeader puts them
// in (the trigger row sits beside the wordmark; the Viewport mounts
// absolutely below the pill).
//
// `delayDuration={0}` opens the panel the instant a trigger is
// hovered — no hover-intent debounce. We tried 120 ms first; it
// reads as lag for a primary nav that wants to feel snappy.
// `skipDelayDuration={250}` is the grace window for consecutive
// trigger hovers (irrelevant once delayDuration is 0, but kept for
// the close→reopen edge case where the user briefly leaves and
// returns).

export function SiteNavigationMenuRoot({
  triggers,
  viewport,
}: {
  triggers: React.ReactNode;
  viewport: React.ReactNode;
}) {
  // Controlled value so we know when ANY section is open. Radix sets
  // value to the active item's value (or auto-generated id) on open
  // and back to "" on close. We pipe that into an overlay's opacity
  // to dim/blur the page behind the open mega-menu.
  const [value, setValue] = useState("");
  const isOpen = value !== "";

  // Hover-stable bridge: a transparent 1600 px-wide column spanning
  // from the viewport top down to the bottom of the panel. Cursor
  // anywhere in this column = "still in the menu" → no close. The
  // bridge wraps the trigger row + panel so the two small dead zones
  // (above the pill, between pill and panel) become part of the
  // menu's hit area without changing the visual layout.
  //
  // Mechanism: cursorInBridgeRef tracks whether the cursor is inside
  // the wrapper. Radix's onValueChange normally fires `""` when the
  // cursor leaves a trigger — we intercept that and suppress while
  // the cursor is still inside the bridge, deferring close to the
  // bridge's own onPointerLeave. Escape closes through a separate
  // keydown handler so keyboard dismissal still works.
  const cursorInBridgeRef = useRef(false);

  return (
    <NavigationMenuPrimitive.Root
      aria-label="Primary"
      delayDuration={0}
      skipDelayDuration={250}
      className="contents"
      value={value}
      onValueChange={(next) => {
        // Honor open requests immediately (Radix opening a section).
        // Suppress close requests while the cursor is in the bridge
        // — the bridge's onPointerLeave is the sole close trigger.
        if (next !== "" || !cursorInBridgeRef.current) {
          setValue(next);
        }
      }}
    >
      {/* Full-viewport scrim rendered as the FIRST child of the Root
          subtree so it stacks below the trigger pill and the Viewport
          (same z-context via the fixed wrapper in SiteHeader; DOM
          order decides who's on top). Always mounted — opacity is the
          only thing that toggles, so we get a smooth fade in/out.

          Reads from the shared --ds-overlay-backdrop-* tokens so
          this scrim matches the Modal and CommandMenu/Search scrim
          1:1. Dim direction (dark wash in light mode, light wash in
          dark) at moderate opacity, paired with 8px backdrop blur.
          Inline opacity: closed = 0, open = the scrim's token
          opacity. transition-opacity then animates 0 → token-value
          for the fade-in and back to 0 on close.

          pointer-events-none keeps the page beneath interactive at
          the cursor level — close is driven by the bridge's
          pointerLeave below, not by capturing clicks on the scrim. */}
      <div
        aria-hidden
        data-mega-menu-overlay
        style={{
          opacity: isOpen ? "var(--ds-overlay-backdrop-opacity)" : 0,
        }}
        className={cn(
          "pointer-events-none fixed inset-0",
          "bg-[var(--ds-overlay-backdrop-color)]",
          "[backdrop-filter:blur(8px)] [-webkit-backdrop-filter:blur(8px)]",
          "transition-opacity duration-200 ease-out",
        )}
      />
      {/* Hover-stable bridge wrapper.
          - pointer-events-auto: cursor doesn't fall through to the
            page beneath, so onPointerEnter/Leave fire on this exact
            element when the cursor crosses the 1600 px column edges.
          - mx-auto max-w-[1600px]: matches pill + panel width.
          - pt-4: bridges the 16 px above-pill gap (between viewport
            top and the pill itself).
          - The panel wrapper inside gets mt-4 to bridge the visible
            16 px between pill and panel — both halves are inside the
            wrapper, so the cursor never leaves the bridge while
            traversing either gap.
          - `group/menu` + `data-state={open|closed}` lets the pill
            in SiteHeader react to the menu's open state via
            `group-data-[state=open]/menu:…` — keeps the pill
            chameleon (bg-100) lit the entire time the menu is open,
            not just while a trigger is hovered. NAMED group is
            required: each Trigger is `group/trigger` for its own
            chevron rotation, and unnamed `group-*` selectors match
            ANY ancestor with `group`, which would conflate the two. */}
      <div
        className="group/menu pointer-events-auto mx-auto max-w-[1600px] pt-4"
        data-state={isOpen ? "open" : "closed"}
        onPointerEnter={() => {
          cursorInBridgeRef.current = true;
        }}
        onPointerLeave={() => {
          cursorInBridgeRef.current = false;
          setValue("");
        }}
        onKeyDown={(e) => {
          // Escape still closes — our onValueChange suppression above
          // would otherwise swallow Radix's Escape-driven close call
          // because the cursor is presumably still inside the bridge.
          if (e.key === "Escape") setValue("");
        }}
      >
        {triggers}
        <div className="mt-4">{viewport}</div>
      </div>
    </NavigationMenuPrimitive.Root>
  );
}

// ============================================================================
// SiteNavigationMenuTriggers
// ============================================================================
//
// The trigger row (List + 5 Items). Used inside SiteNavigationMenuRoot
// so SiteHeader can drop the triggers next to the wordmark while
// the Viewport lives elsewhere in the same Root subtree.

export function SiteNavigationMenuTriggers({
  featuredNews,
  featuredShoe,
  featuredGear,
  featuredNutrition,
  featuredRace,
}: SiteNavigationMenuProps) {
  // Map each section key to the panel data it needs. Building the
  // map up here keeps the JSX tidy and means the SECTION → featured
  // mapping is a single readable lookup.
  const featuredBySection: Record<SectionKey, MegaMenuFeatured | null> = {
    news: buildFeaturedFromProduct(featuredNews, "news"),
    shoes: buildFeaturedFromProduct(featuredShoe, "shoes"),
    gear: buildFeaturedFromProduct(featuredGear, "gear"),
    nutrition: buildFeaturedFromProduct(featuredNutrition, "nutrition"),
    races: buildFeaturedFromRace(featuredRace),
  };

  return (
    <NavigationMenuPrimitive.List className="flex items-center gap-1">
      {SECTIONS.map((section) => (
        <NavigationMenuPrimitive.Item key={section.key}>
          <NavigationMenuPrimitive.Trigger
            data-nav-trigger
            className={TRIGGER_CLASS}
          >
            {section.label}
            <ChevronDown className={CHEVRON_CLASS} aria-hidden="true" />
          </NavigationMenuPrimitive.Trigger>
          <NavigationMenuPrimitive.Content
            // absolute top-0 left-0 w-full: during a trigger switch
            // Radix mounts both the outgoing and incoming Content at
            // the same time so the cross-fade has two elements to
            // animate against each other. Without absolute they sit
            // in normal flow and stack vertically — you see both
            // panels at once AND the Viewport tries to be tall
            // enough for both, which reads as the panel jumping.
            // With absolute they overlap in the same space, the
            // cross-fade looks like one element morphing, and the
            // Viewport's measured height only ever reflects the
            // active section.
            //
            // p-4 lives HERE (not on the Viewport) because Radix
            // measures the Content's outer box to populate
            // --radix-navigation-menu-viewport-height. If the
            // Viewport carries the padding, box-sizing:border-box
            // makes the Viewport `height = measured` but with 16 px
            // eaten from each edge — and the Content that is
            // `measured` tall gets clipped. Putting the padding on
            // the measured element keeps both numbers in sync.
            //
            // Animations: NONE on the Content. Section switches snap
            // instantly — no cross-fade overlap, no in-between
            // mush. The Viewport's height/width transition still
            // eases the panel resize, so the panel chrome morphs
            // smoothly between sections while the inside content
            // hard-swaps the moment Radix flips data-state.
            className="absolute top-0 left-0 w-full p-4"
          >
            <MegaMenuPanel
              sectionKey={section.key}
              eyebrow={section.eyebrow}
              heading={section.heading}
              tagline={section.tagline}
              ctaLabel={section.ctaLabel}
              ctaHref={section.ctaHref}
              links={section.links}
              featured={featuredBySection[section.key]}
            />
          </NavigationMenuPrimitive.Content>
        </NavigationMenuPrimitive.Item>
      ))}
    </NavigationMenuPrimitive.List>
  );
}

// ============================================================================
// SiteNavigationMenuViewport
// ============================================================================
//
// Just the Viewport chrome — mounted by SiteHeader as a sibling of
// the floating pill so it sits below the pill with the same 1600 px
// max-width. Must live inside the same NavigationMenu.Root subtree
// as the triggers (SiteNavigationMenuRoot handles that).
//
// Chrome:
//   - opaque bg-100 surface (the panel must be readable over any page
//     bg the floating pill happens to be sitting on)
//   - 8 px radius, 16 px padding
//   - height driven by --radix-navigation-menu-viewport-height (Radix
//     measures the active Content and exposes the value as a CSS var)
//   - fade + zoom on open/close (~200 ms), matched to the Frontify ref

export function SiteNavigationMenuViewport() {
  return (
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "relative w-full overflow-hidden",
        "rounded-[8px] bg-[var(--ds-background-100)]",
        "shadow-[var(--ds-shadow-menu)]",
        "h-[var(--radix-navigation-menu-viewport-height)]",
        // Smooth resize between sections of different heights so a
        // taller section doesn't pop. The Content swap is instant
        // (zero animation on Content) but the chrome morphs.
        "transition-[height,width] duration-200 ease-out",
        // NO open/close animations. The panel appears the instant
        // a trigger is hovered and disappears the instant intent
        // ends — anything else reads as lag for a primary nav.
      )}
    />
  );
}

// ============================================================================
// Default export — all-in-one wrapper. SiteHeader doesn't use this;
// it composes via SiteNavigationMenuRoot so it can mount the Viewport
// outside the trigger row's flex box (the Viewport needs to span the
// full pill width and sit below the pill, not inside it).
// ============================================================================

export default function SiteNavigationMenu(props: SiteNavigationMenuProps) {
  return (
    <SiteNavigationMenuRoot
      triggers={
        <div className="relative flex items-center">
          <SiteNavigationMenuTriggers {...props} />
        </div>
      }
      viewport={
        <div className="absolute left-0 right-0 top-full mt-2 flex justify-center">
          <SiteNavigationMenuViewport />
        </div>
      }
    />
  );
}

// ============================================================================
// Helpers — build the MegaMenuFeatured shape from the raw Sanity
// fetch result. The mega-menu doesn't care which content type the
// featured item came from; it just needs an href + image + title +
// short description.
// ============================================================================

function buildFeaturedFromProduct(
  item: FeaturedProduct,
  section: "news" | "shoes" | "gear" | "nutrition",
): MegaMenuFeatured | null {
  if (!item) return null;
  // News articles live under /articles/post/<slug>; the product
  // sections (shoes/gear/nutrition) live at /<section>/<slug>. Mirrors
  // MobileNavDrawer's featuredHref logic so a given featured item
  // resolves to the same URL on both mobile and desktop nav.
  const href =
    section === "news"
      ? `/articles/post/${item.slug.current}`
      : `/${section}/${item.slug.current}`;
  return {
    title: item.title,
    description: item.excerpt,
    href,
    image: item.mainImage,
  };
}

function buildFeaturedFromRace(
  race: FeaturedRace,
): MegaMenuFeatured | null {
  if (!race) return null;
  return {
    title: race.title,
    description: buildRaceDescription(race.location, race.eventDate),
    href: `/races/${race.slug.current}`,
    image: race.mainImage,
  };
}

// Builds the "Location · DD Mon YYYY" line shown under the race
// featured card title. Both pieces are optional in the source data,
// so we filter out nulls before joining.
function buildRaceDescription(
  location?: string,
  eventDate?: string,
): string | undefined {
  const parts: string[] = [];
  if (location) parts.push(location);
  if (eventDate) {
    const d = new Date(eventDate);
    if (!Number.isNaN(d.getTime())) {
      parts.push(
        d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      );
    }
  }
  return parts.length > 0 ? parts.join(" · ") : undefined;
}
