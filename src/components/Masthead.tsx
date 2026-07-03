"use client";

import Link from "next/link";
import { useContext, useRef, useState } from "react";
import { Search, Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";

import { DarkModeContext } from "@/components/DarkModeProvider";
import { useSearch } from "@/contexts/SearchContext";
import { Button } from "@/components/ui/Button";
import MegaMenuPanel, {
  type MegaMenuFeatured,
} from "@/components/ui/MegaMenuPanel";
import {
  newsLinks,
  shoeLinks,
  gearLinks,
  nutritionLinks,
  raceLinks,
  type CategoryItem,
  type FeaturedProduct,
  type FeaturedRace,
} from "@/components/ui/SiteNavigationMenu";
import { cn } from "@/lib/utils";

// Distanz masthead — our take on the 404 Media two-tier header:
//   top tier:    search + theme toggle (left) · centered wordmark · Sign in /
//                Subscribe + mobile hamburger (right)
//   bottom tier: centered section nav — each item is a mega-menu TRIGGER,
//                not a plain link. Hovering/focusing a trigger folds down a
//                full-width panel (the production MegaMenuPanel, adapted to
//                the 1400 px navbar width) with that section's subcategory
//                links + a featured Sanity card.
// Sticky (flat, no scroll shadow). Wires the real DarkModeContext (theme)
// and SearchContext (⌘K search). Featured items are fetched server-side in
// page.tsx and passed down.

// ============================================================================
// Featured data plumbing (mirrors SiteNavigationMenu's helpers — kept local
// so the Masthead owns its own 7-section split of Road/Track/Trail).
// ============================================================================

/** One featured News article per discipline (see featuredNewsByCategoryQuery). */
export type FeaturedNewsByCategory = {
  road: FeaturedProduct;
  track: FeaturedProduct;
  trail: FeaturedProduct;
} | null;

export interface MastheadProps {
  featuredNews: FeaturedNewsByCategory;
  featuredShoe: FeaturedProduct;
  featuredGear: FeaturedProduct;
  featuredNutrition: FeaturedProduct;
  featuredRace: FeaturedRace;
}

function buildFeaturedFromProduct(
  item: FeaturedProduct,
  section: "news" | "shoes" | "gear" | "nutrition",
): MegaMenuFeatured | null {
  if (!item) return null;
  // News articles live under /articles/post/<slug>; the product sections
  // (shoes/gear/nutrition) live at /<section>/<slug>. Mirrors the production
  // nav so a given featured item resolves to the same URL there and here.
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

function buildFeaturedFromRace(race: FeaturedRace): MegaMenuFeatured | null {
  if (!race) return null;
  return {
    title: race.title,
    description: buildRaceDescription(race.location, race.eventDate),
    href: `/races/${race.slug.current}`,
    image: race.mainImage,
  };
}

// "Location · DD Mon YYYY" line under the race featured card. Both pieces are
// optional in the source, so filter nulls before joining.
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

// ============================================================================
// Section taxonomy — 7 top-level triggers. Road/Track/Trail each carry the
// shared discipline set (they're single-category sections with no sub-routes,
// so the panel lists the three disciplines as a switcher); the product
// sections carry their real subcategory links.
// ============================================================================

type SectionKey =
  | "road"
  | "track"
  | "trail"
  | "shoes"
  | "gear"
  | "nutrition"
  | "races";

interface SectionDef {
  key: SectionKey;
  label: string;
  /** Where the trigger's section index lives (used for the mobile fallback). */
  href: string;
  eyebrow: string;
  heading: string;
  tagline: string;
  ctaLabel: string;
  ctaHref: string;
  links: ReadonlyArray<CategoryItem>;
}

const SECTIONS: ReadonlyArray<SectionDef> = [
  {
    key: "road",
    label: "Road",
    href: "/articles/road",
    eyebrow: "Road",
    heading: "Roads and majors",
    tagline: "Marathon majors, road racing, and the training behind the times.",
    ctaLabel: "View all road",
    ctaHref: "/articles/road",
    links: newsLinks,
  },
  {
    key: "track",
    label: "Track",
    href: "/articles/track",
    eyebrow: "Track",
    heading: "Track and field",
    tagline: "From the 100 m to the 10,000 m — the oval and everything on it.",
    ctaLabel: "View all track",
    ctaHref: "/articles/track",
    links: newsLinks,
  },
  {
    key: "trail",
    label: "Trail",
    href: "/articles/trail",
    eyebrow: "Trail",
    heading: "Trail and ultra",
    tagline: "Mountains, ultras, and the long way round.",
    ctaLabel: "View all trail",
    ctaHref: "/articles/trail",
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

// Trigger anatomy — keeps the established bottom-tier look (plain 14 px text,
// textSubtle → textDefault on hover/open) rather than the production pill, so
// the row still reads as the flat 404-style nav. The chevron rotates 180° on
// hover, focus, or while this trigger's panel is open. All three selectors
// target the named /trigger group so a chevron only reacts to ITS OWN trigger
// (the outer /menu group also carries data-state=open for the whole menu).
const TRIGGER_CLASS = cn(
  "group/trigger inline-flex items-center gap-1 rounded-sm px-1.5 py-1",
  "text-copy-14 font-medium tracking-[0.02em]",
  "text-textSubtle transition-colors",
  "hover:text-textDefault focus-visible:text-textDefault",
  "data-[state=open]:text-textDefault",
  "focus-visible:outline-none",
);

const CHEVRON_CLASS = cn(
  "size-3.5 transition-transform duration-200 ease-out",
  "group-hover/trigger:rotate-180 group-focus-visible/trigger:rotate-180",
  "group-data-[state=open]/trigger:rotate-180",
);

// Viewport chrome — opaque surface panel, 8 px radius + menu shadow, height
// driven by Radix's measured-content var. Height/width transition eases the
// resize between sections; no enter/exit animation (matches production — a
// primary nav should feel instant).
const VIEWPORT_CLASS = cn(
  "relative w-full overflow-hidden",
  "rounded-[8px] bg-surface shadow-[var(--ds-shadow-menu)]",
  "h-[var(--radix-navigation-menu-viewport-height)]",
  "transition-[height,width] duration-200 ease-out",
);

export default function Masthead({
  featuredNews,
  featuredShoe,
  featuredGear,
  featuredNutrition,
  featuredRace,
}: MastheadProps) {
  const { isDark, toggleDarkMode } = useContext(DarkModeContext);
  const { openSearch } = useSearch();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Controlled open state so we know when ANY section is open (drives the
  // page scrim) and so we can run the hover-stable bridge below.
  const [value, setValue] = useState("");
  const isOpen = value !== "";

  // Hover-stable bridge: onValueChange normally fires "" the moment the cursor
  // leaves a trigger. We suppress that while the cursor is still inside the
  // bridge wrapper (which spans the trigger row + the flush panel beneath it),
  // deferring close to the wrapper's own onPointerLeave. Escape closes through
  // the keydown handler so keyboard dismissal still works.
  const cursorInBridgeRef = useRef(false);

  const featuredBySection: Record<SectionKey, MegaMenuFeatured | null> = {
    road: buildFeaturedFromProduct(featuredNews?.road ?? null, "news"),
    track: buildFeaturedFromProduct(featuredNews?.track ?? null, "news"),
    trail: buildFeaturedFromProduct(featuredNews?.trail ?? null, "news"),
    shoes: buildFeaturedFromProduct(featuredShoe, "shoes"),
    gear: buildFeaturedFromProduct(featuredGear, "gear"),
    nutrition: buildFeaturedFromProduct(featuredNutrition, "nutrition"),
    races: buildFeaturedFromRace(featuredRace),
  };

  return (
    <>
      {/* Full-viewport scrim — sibling of the header so it sits BELOW the
          z-50 header (header stays crisp) but above page content. Reads the
          shared --ds-overlay-backdrop-* tokens so it matches Modal / Search
          1:1. Always mounted; only opacity toggles for a smooth fade. */}
      <div
        aria-hidden
        data-mega-menu-overlay
        style={{
          opacity: isOpen ? "var(--ds-overlay-backdrop-opacity)" : 0,
        }}
        className={cn(
          "pointer-events-none fixed inset-0 z-40",
          "bg-[var(--ds-overlay-backdrop-color)]",
          "[backdrop-filter:blur(8px)] [-webkit-backdrop-filter:blur(8px)]",
          "transition-opacity duration-200 ease-out",
        )}
      />

      <header className="sticky top-0 z-50 bg-canvas">
        {/* top tier — divider spans the content (button to button) */}
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-borderSubtle py-3">
            {/* left — search + single theme toggle */}
            <div className="flex items-center gap-1">
              <Button
                shape="square"
                size="large"
                variant="tertiary"
                onClick={openSearch}
                aria-label="Search"
                title="Search (⌘K)"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                shape="square"
                size="large"
                variant="tertiary"
                onClick={toggleDarkMode}
                aria-label={
                  isDark ? "Switch to light theme" : "Switch to dark theme"
                }
                title={isDark ? "Light theme" : "Dark theme"}
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* center — wordmark */}
            <Link
              href="/"
              aria-label="Distanz — home"
              className="flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/wordmark-black.svg"
                alt="Distanz"
                className="block h-12 w-auto dark:hidden"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/wordmark-white.svg"
                alt="Distanz"
                className="hidden h-12 w-auto dark:block"
              />
            </Link>

            {/* right — auth + hamburger */}
            <div className="flex items-center justify-end gap-2">
              <div className="hidden items-center gap-2 sm:flex">
                <Button variant="tertiary" size="large">
                  Sign in
                </Button>
                <Button variant="default" size="large">
                  Subscribe
                </Button>
              </div>
              <Button
                shape="square"
                size="large"
                variant="tertiary"
                onClick={() => setMobileOpen((v) => !v)}
                className="sm:hidden"
                aria-label="Menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* bottom tier — mega-menu nav (desktop). The Root wraps the trigger
            row AND the fold-down Viewport so Radix can wire them together;
            `relative` anchors the absolutely-positioned Viewport below the
            row. Hidden on mobile — the hamburger menu handles small screens. */}
        <NavigationMenuPrimitive.Root
          aria-label="Primary"
          delayDuration={0}
          skipDelayDuration={250}
          value={value}
          onValueChange={(next) => {
            // Honor open requests immediately; suppress close requests while
            // the cursor is still in the bridge (the bridge's onPointerLeave
            // is the sole close trigger for pointer users).
            if (next !== "" || !cursorInBridgeRef.current) setValue(next);
          }}
          className="relative hidden sm:block"
        >
          {/* Bridge wrapper — spans the trigger row + the flush panel beneath
              it so the cursor never leaves the "menu" while traversing from a
              trigger down into its panel. `group/menu` + data-state lets other
              chrome react to the whole-menu open flag if needed. */}
          <div
            className="group/menu"
            data-state={isOpen ? "open" : "closed"}
            onPointerEnter={() => {
              cursorInBridgeRef.current = true;
            }}
            onPointerLeave={() => {
              cursorInBridgeRef.current = false;
              setValue("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setValue("");
            }}
          >
            <div className="mx-auto max-w-[1400px] px-6">
              <NavigationMenuPrimitive.List className="flex items-center justify-center gap-6 border-b border-borderSubtle py-2.5">
                {SECTIONS.map((section) => (
                  <NavigationMenuPrimitive.Item
                    key={section.key}
                    value={section.key}
                  >
                    <NavigationMenuPrimitive.Trigger
                      data-nav-trigger
                      className={TRIGGER_CLASS}
                    >
                      {section.label}
                      <ChevronDown className={CHEVRON_CLASS} aria-hidden />
                    </NavigationMenuPrimitive.Trigger>
                    {/* absolute + p-4: both the outgoing and incoming Content
                        overlap in the Viewport during a section switch, and
                        Radix measures this box for the Viewport height (so the
                        padding lives here, not on the Viewport). */}
                    <NavigationMenuPrimitive.Content className="absolute left-0 top-0 w-full p-4">
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
            </div>

            {/* Viewport drop — flush below the bottom-tier border (top-full,
                no gap) so there's no dead zone between the row and the panel.
                Full navbar width, centered. */}
            <div className="absolute left-0 right-0 top-full">
              <div className="mx-auto max-w-[1400px] px-6">
                <NavigationMenuPrimitive.Viewport className={VIEWPORT_CLASS} />
              </div>
            </div>
          </div>
        </NavigationMenuPrimitive.Root>

        {/* mobile menu — flat top-level links (subcategory drill-down is a
            later pass; matches the pre-mega-menu behaviour). */}
        {mobileOpen && (
          <div className="border-b border-borderSubtle sm:hidden">
            <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-4">
              {SECTIONS.map((section) => (
                <Link
                  key={section.key}
                  href={section.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-copy-14 font-medium text-textSubtle no-underline hover:text-textDefault"
                >
                  {section.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="tertiary" size="small">
                  Sign in
                </Button>
                <Button variant="default" size="small">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
