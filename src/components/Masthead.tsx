"use client";

import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { Search, Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";

import { DarkModeContext } from "@/components/DarkModeProvider";
import { useSearch } from "@/contexts/SearchContext";
import { Button } from "@/components/ui/Button";
import Wordmark from "@/components/ui/Wordmark";
import { formatDisplayDate } from "@/lib/dates";
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
    href: `/${section}/${item.slug.current}`,
    image: item.mainImage,
    publishedAt: formatDisplayDate(item.publishedAt),
    category: item.category
      ? {
          label: item.category.title,
          href: `/${section}/${item.category.slug}`,
        }
      : null,
  };
}

function buildFeaturedFromRace(race: FeaturedRace): MegaMenuFeatured | null {
  if (!race) return null;
  return {
    title: race.title,
    href: `/races/${race.slug.current}`,
    image: race.mainImage,
    // The race sub-shape switches the panel to the canonical RaceCard —
    // event date + location (no category/distance badge in the menu).
    race: {
      eventDate: race.eventDate,
      location: race.location,
    },
  };
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
    heading: "Shoes for every run",
    tagline:
      "From one shoe to rule them all, to race-day carbon plates. Explore our reviews and guides to pick the right shoes.",
    ctaLabel: "Browse all shoes",
    ctaHref: "/shoes",
    links: shoeLinks,
  },
  {
    key: "gear",
    label: "Gear",
    href: "/gear",
    heading: "Gearing up",
    tagline:
      "From smartwatches and headphones to apparel, explore our reviews and articles on the latest running tech and gear.",
    ctaLabel: "Browse all gear",
    ctaHref: "/gear",
    links: gearLinks,
  },
  {
    key: "nutrition",
    label: "Nutrition",
    href: "/nutrition",
    heading: "Fuel that delivers",
    tagline:
      "Explore the latest brands and products pushing the limits in sports nutrition.",
    ctaLabel: "Browse all nutrition",
    ctaHref: "/nutrition",
    links: nutritionLinks,
  },
  {
    key: "races",
    label: "Races",
    href: "/races",
    heading: "Find your next race",
    tagline:
      "Explore detailed race guides and a full calendar of upcoming events.",
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
  // flex + full height so each item fills the fixed-height nav band edge to
  // edge (its <li> stretches, and this element stretches inside it). px for
  // width; the hover block is a flush rectangle spanning both dividers — no
  // rounding, no gap. Text vertically centred.
  "flex h-full items-center px-3",
  "text-copy-14 font-medium tracking-[0.02em]",
  "text-textSubtle no-underline transition-colors",
  // Hover reveals a subtle gray-100 block behind the label instead of shifting
  // the text colour; reads on the canvas nav in both themes.
  "hover:bg-[var(--ds-gray-100)]",
);

const TRIGGER_CLASS = cn(
  LINK_CLASS,
  // gap for the chevron; named group so the chevron reacts to THIS trigger's
  // hover/focus/open state only.
  "group/trigger gap-1",
  "cursor-pointer bg-transparent",
  "focus-visible:outline-none focus-visible:bg-[var(--ds-gray-100)]",
  // Open trigger keeps the hover block lit so the active section stays obvious.
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

  // ---- Scroll behaviours (404's .is-scrolled pair) ----------------------
  // condensed: past 96px of scroll the bottom links tier folds away;
  //   back under, it returns. CRITICAL: the fold is an OVERLAY animation
  //   — the row lives in a constant-height slot (see the spacer below),
  //   so the header's LAYOUT height never changes. Animating the in-flow
  //   height (the first implementation) reflowed the whole page by 40px
  //   at the boundary, and the browser's scroll anchoring compensated by
  //   adjusting scrollY — re-crossing the threshold and ping-ponging the
  //   state (the flicker). With zero layout shift, one tight threshold
  //   is safe: boundary jitter just reverses the animation mid-flight.
  // overInverted: a section that declares data-nav-surface="inverted"
  //   (e.g. the homepage promo band) is passing under the header's bottom
  //   edge — the hairline rule goes transparent so the header reads as a
  //   solid block against the contrasting band, 404-style.
  const headerRef = useRef<HTMLElement>(null);
  const [condensed, setCondensed] = useState(false);
  const [overInverted, setOverInverted] = useState(false);

  useEffect(() => {
    const CONDENSE_Y = 96;
    const NAV_TIER_H = 40; // the h-10 nav slot — empty while condensed
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const condensedNow = y > CONDENSE_Y;
      setCondensed(condensedNow);
      const header = headerRef.current;
      if (header) {
        // The header's rect includes the constant nav slot; while condensed
        // the slot is empty, so the VISIBLE chrome ends one tier higher.
        const edge =
          header.getBoundingClientRect().bottom -
          (condensedNow ? NAV_TIER_H : 0);
        let over = false;
        for (const band of document.querySelectorAll(
          '[data-nav-surface="inverted"]',
        )) {
          const r = band.getBoundingClientRect();
          if (r.top <= edge && r.bottom >= edge) {
            over = true;
            break;
          }
        }
        setOverInverted(over);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Never condense while a mega-menu is open — the panel is anchored to the
  // trigger row and would lose its anchor mid-interaction.
  const navCondensed = condensed && !isOpen;

  const featuredBySection: Record<MegaKey, MegaMenuFeatured | null> = {
    shoes: buildFeaturedFromProduct(featuredShoe, "shoes"),
    gear: buildFeaturedFromProduct(featuredGear, "gear"),
    nutrition: buildFeaturedFromProduct(featuredNutrition, "nutrition"),
    races: buildFeaturedFromRace(featuredRace),
  };

  return (
    <>
      {/* The header shell is TRANSPARENT and pointer-inert — each tier
          paints its own canvas and re-enables pointer events. That lets the
          nav slot below read as truly empty while the row is folded: content
          scrolls visibly through it AND stays clickable (a transparent shell
          would still swallow clicks over the strip). */}
      <header ref={headerRef} className="pointer-events-none sticky top-0 z-50">
        {/* top tier — divider spans the content (button to button). When the
            nav is condensed this rule is the header's bottom edge, and it
            goes transparent while an inverted band passes beneath (the
            colour-aware border: solid block over contrast, inset rule over
            matching canvas). */}
        <div className="pointer-events-auto bg-canvas">
          <div className="mx-auto max-w-[1400px] px-6">
          <div
            className={cn(
              "grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b py-3",
              "transition-colors duration-200",
              navCondensed && overInverted
                ? "border-transparent"
                : "border-borderSubtle",
            )}
          >
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

            {/* center — wordmark. Inline SVG (not <img>): it ships in the
                SSR HTML so it paints with the first frame — no network
                fetch, no pop-in flicker. currentColor + text-textDefault
                is the brand ink and flips with the theme (no second
                asset, no dark: image swap). */}
            <Link
              href="/"
              aria-label="Distanz — home"
              className="flex items-center justify-center text-textDefault"
            >
              <Wordmark className="h-12 w-auto" zHover="tilt" />
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
        </div>

        {/* bottom tier — nav (desktop). The row lives in a CONSTANT-HEIGHT
            slot and overlays it (absolute): folding the row animates only
            the overlay, so the header's layout height never changes — no
            page reflow at the threshold, no scroll-anchoring feedback loop
            (the old flicker). The slot is transparent + pointer-inert while
            empty, so content scrolls visibly through it when condensed.
            The Root wraps the row AND the fold-down Viewport so Radix can
            wire them together. Hidden on mobile — the hamburger menu
            handles small screens. */}
        <div className="pointer-events-none relative hidden h-10 sm:block">
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
          className="pointer-events-auto absolute inset-x-0 top-0 bg-canvas"
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
            onClick={(e) => {
              // Close on any link activation inside the panel. Radix only
              // auto-dismisses its own NavigationMenu.Link elements — the
              // ArticleCard's internal links (title overlay, category kicker)
              // aren't wrapped, and a soft nav would otherwise leave the
              // panel hanging open on the next page.
              if ((e.target as HTMLElement).closest("a")) setValue("");
            }}
          >
            <div className="mx-auto max-w-[1400px] px-6">
              {/* Persistent navbar bottom rule — stays under the links whether
                  the menu is open or closed; the panel then expands downward
                  below it with its own matching bottom border. */}
              <NavigationMenuPrimitive.List
                className={cn(
                  "flex items-stretch justify-center gap-1 overflow-hidden border-b",
                  // 404's .is-scrolled collapse: height → 0 + border off,
                  // eased. visibility rides the same transition (interpolated
                  // as visible until the end), so the links stay drawn while
                  // the row folds, then leave the tab order once hidden.
                  "transition-[height,visibility] duration-200 ease-out motion-reduce:transition-none",
                  navCondensed
                    ? "invisible h-0 border-transparent"
                    : "h-10 border-borderSubtle",
                )}
              >
                {/* Editorial disciplines — plain links, no panel. Entering one
                    closes any open mega-menu: the bridge suppresses Radix's
                    close while the cursor is still in the row, so a plain link
                    (which has no Radix value to switch to) would otherwise leave
                    the previous trigger stuck open. */}
                {EDITORIAL_LINKS.map((item) => (
                  <NavigationMenuPrimitive.Item key={item.href} className="flex">
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
                    className="flex"
                  >
                    <NavigationMenuPrimitive.Trigger
                      data-nav-trigger
                      className={TRIGGER_CLASS}
                    >
                      {section.label}
                      <ChevronDown className={CHEVRON_CLASS} aria-hidden />
                    </NavigationMenuPrimitive.Trigger>
                    {/* absolute: outgoing and incoming Content overlap in the
                        Viewport during a section switch. No padding here — the
                        panel carries its own py, and horizontal alignment comes
                        from the viewport's max-w-[1400px] px-6 wrapper so the
                        columns sit on the site grid. */}
                    <NavigationMenuPrimitive.Content className="absolute left-0 top-0 w-full">
                      <MegaMenuPanel
                        sectionKey={section.key}
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
        </div>

        {/* mobile menu — flat top-level links. bg-canvas + pointer-events
            are its own (the header shell is transparent + inert). */}
        {mobileOpen && (
          <div className="pointer-events-auto border-b border-borderSubtle bg-canvas sm:hidden">
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
