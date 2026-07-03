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
//   bottom tier: centered section nav. Road/Track/Trail are plain links
//                (single article categories, no children). Shoes/Gear/
//                Nutrition/Races are mega-menu TRIGGERS that fold down a
//                full-width panel (the production MegaMenuPanel, adapted to
//                the 1400 px navbar) with subcategory links + a featured
//                Sanity card.
// Sticky (flat, no scroll shadow). Wires the real DarkModeContext (theme)
// and SearchContext (⌘K search). Featured items are fetched server-side in
// page.tsx and passed down.

// ============================================================================
// Featured data plumbing (mirrors SiteNavigationMenu's helpers — kept local).
// ============================================================================

export interface MastheadProps {
  featuredShoe: FeaturedProduct;
  featuredGear: FeaturedProduct;
  featuredNutrition: FeaturedProduct;
  featuredRace: FeaturedRace;
}

function buildFeaturedFromProduct(
  item: FeaturedProduct,
  section: "shoes" | "gear" | "nutrition",
): MegaMenuFeatured | null {
  if (!item) return null;
  return {
    title: item.title,
    description: item.excerpt,
    href: `/${section}/${item.slug.current}`,
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
// Nav taxonomy
// ============================================================================
//
// Editorial disciplines: plain links (single article categories, no
// sub-routes). Rendered first so the row reads Road · Track · Trail · … .

const EDITORIAL_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Road", href: "/articles/road" },
  { label: "Track", href: "/articles/track" },
  { label: "Trail", href: "/articles/trail" },
];

// Mega-menu sections: each folds down a MegaMenuPanel with real subcategory
// links + a featured Sanity card.

type MegaKey = "shoes" | "gear" | "nutrition" | "races";

interface MegaSection {
  key: MegaKey;
  label: string;
  href: string;
  eyebrow: string;
  heading: string;
  tagline: string;
  ctaLabel: string;
  ctaHref: string;
  links: ReadonlyArray<CategoryItem>;
}

const MEGA_SECTIONS: ReadonlyArray<MegaSection> = [
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

// Row item styling — identical for plain links and mega-menu triggers so the
// bottom tier reads as one uniform 404-style nav (14 px, textSubtle →
// textDefault on hover; triggers also light on open). No pill padding, no
// chevron — same size + spacing as the original plain links.
const LINK_CLASS = cn(
  // Full-height hover target: px for width, py-2.5 to span the nav band. The
  // List carries no vertical padding, so the hover block fills the whole space
  // between the top and bottom dividers — a flush rectangle, not a rounded
  // pill.
  "px-3 py-2.5",
  "text-copy-14 font-medium tracking-[0.02em]",
  "text-textSubtle no-underline transition-colors",
  // Hover reveals a subtle gray-100 block behind the label instead of shifting
  // the text colour; reads on the canvas nav in both themes.
  "hover:bg-[var(--ds-gray-100)]",
);

const TRIGGER_CLASS = cn(
  LINK_CLASS,
  // inline-flex + gap for the chevron; named group so the chevron reacts to
  // THIS trigger's hover/focus/open state only.
  "group/trigger inline-flex items-center gap-1",
  "cursor-pointer bg-transparent",
  "focus-visible:outline-none focus-visible:bg-[var(--ds-gray-100)]",
  // Open trigger keeps the hover pill lit so the active section stays obvious.
  "data-[state=open]:bg-[var(--ds-gray-100)]",
);

// Chevron — 14 px, inherits the trigger's colour, rotates 180° on hover,
// focus, or while this trigger's panel is open.
const CHEVRON_CLASS = cn(
  "size-3.5 transition-transform duration-200 ease-out",
  "group-hover/trigger:rotate-180 group-focus-visible/trigger:rotate-180",
  "group-data-[state=open]/trigger:rotate-180",
);

// Viewport chrome — the panel reads as the header itself expanding downward:
// same bg-canvas tone as the masthead, no outer border / shadow / radius, just
// a single bottom rule that becomes the header's bottom border once open (the
// nav row's own border goes transparent while open — see the List below). The
// Radix-measured height var + transition drives the downward-expand reveal;
// overflow-hidden clips the content as it unfolds.
const VIEWPORT_CLASS = cn(
  "relative w-full overflow-hidden",
  "bg-canvas border-b border-borderSubtle",
  "h-[var(--radix-navigation-menu-viewport-height)]",
  "transition-[height,width] duration-200 ease-out",
);

export default function Masthead({
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

  const featuredBySection: Record<MegaKey, MegaMenuFeatured | null> = {
    shoes: buildFeaturedFromProduct(featuredShoe, "shoes"),
    gear: buildFeaturedFromProduct(featuredGear, "gear"),
    nutrition: buildFeaturedFromProduct(featuredNutrition, "nutrition"),
    races: buildFeaturedFromRace(featuredRace),
  };

  return (
    <>
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

        {/* bottom tier — nav (desktop). The Root wraps the row AND the
            fold-down Viewport so Radix can wire them together; `relative`
            anchors the absolutely-positioned Viewport below the row. Hidden
            on mobile — the hamburger menu handles small screens. */}
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
              trigger down into its panel. */}
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
              {/* Persistent navbar bottom rule — stays under the links whether
                  the menu is open or closed; the panel then expands downward
                  below it with its own matching bottom border. */}
              <NavigationMenuPrimitive.List className="flex items-center justify-center gap-1 border-b border-borderSubtle">
                {/* Editorial disciplines — plain links, no panel. Entering one
                    closes any open mega-menu: the bridge suppresses Radix's
                    close while the cursor is still in the row, so a plain link
                    (which has no Radix value to switch to) would otherwise leave
                    the previous trigger stuck open. */}
                {EDITORIAL_LINKS.map((item) => (
                  <NavigationMenuPrimitive.Item key={item.href}>
                    <NavigationMenuPrimitive.Link asChild>
                      <Link
                        href={item.href}
                        className={LINK_CLASS}
                        onPointerEnter={() => setValue("")}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuPrimitive.Link>
                  </NavigationMenuPrimitive.Item>
                ))}

                {/* Product + races — mega-menu triggers. */}
                {MEGA_SECTIONS.map((section) => (
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
                    {/* absolute + p-4: outgoing and incoming Content overlap in
                        the Viewport during a section switch, and Radix measures
                        this box for the Viewport height (padding lives here, not
                        on the Viewport). */}
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

        {/* mobile menu — flat top-level links. */}
        {mobileOpen && (
          <div className="border-b border-borderSubtle sm:hidden">
            <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-4">
              {[
                ...EDITORIAL_LINKS,
                ...MEGA_SECTIONS.map((s) => ({ label: s.label, href: s.href })),
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-copy-14 font-medium text-textSubtle no-underline hover:text-textDefault"
                >
                  {item.label}
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
