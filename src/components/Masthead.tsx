"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { Search, Moon, Sun, ChevronDown, ArrowUpRight } from "lucide-react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";

import { DarkModeContext } from "@/components/DarkModeProvider";
import { lockDocumentScroll } from "@/lib/scroll-lock";
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
import { socialLinks } from "@/lib/social-links";
import { cn } from "@/lib/utils";

// Distanz masthead — our take on the 404 Media two-tier header:
//   top tier:    search + theme toggle (left) · centered wordmark · Sign in /
//                Subscribe + mobile hamburger (right)
//   bottom tier: centered section nav. Road/Track/Trail are plain links
//                (single article categories, no children). Shoes/Gear/
//                Nutrition/Races are mega-menu TRIGGERS that fold down a
//                full-width panel (the production MegaMenuPanel, adapted to
//                the max-w-content navbar) with subcategory links + a
//                featured Sanity card.
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
  if (!item?.slug?.current) return null;
  return {
    title: item.title,
    href: `/${section}/${item.slug.current}`,
    image: item.mainImage,
    lqip: item.lqip,
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
  if (!race?.slug?.current) return null;
  return {
    title: race.title,
    href: `/races/${race.slug.current}`,
    image: race.mainImage,
    lqip: race.lqip,
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
  "text-copy-14 font-medium",
  "text-textSubtle no-underline transition-colors",
  // Hover reveals a subtle gray-100 block behind the label instead of shifting
  // the text colour; reads on the canvas nav in both themes.
  "hover:bg-[var(--ds-gray-100)]",
  "focus-visible:bg-[var(--ds-gray-100)] focus-visible:outline-none",
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

// Condensed-shrink treatment for the top tier's three content groups.
// v4 scale/translate are independent properties — both must be NAMED in
// the transition list (the transform gotcha from the fold rework). The
// per-group transform-origin lives on each group's own class.
const SHRINK_TRANSITION =
  "transition-[translate,scale] duration-500 ease-[ease] motion-reduce:transition-none";
const SHRINK_CONDENSED = "sm:translate-y-2 sm:scale-[0.8]";

// Mobile menu row — ≥40px tap target (WCAG 2.5.8 comfort); hover/focus is
// Footer's linkClasses verbatim (Footer.tsx:72-73).
const MOBILE_LINK_CLASS = cn(
  "flex min-h-[40px] items-center text-copy-14 font-medium text-textSubtle no-underline transition-colors",
  "hover:text-textDefault",
  "focus-visible:text-textDefault focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)]",
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

  // Mobile menu (Quartr's overlay model, user call 2026-07-17): a fixed
  // sheet from the header's bottom edge to the viewport bottom — not a
  // dropdown. The page behind is scroll-locked; the sheet scrolls
  // internally. Focus enters the panel on open; Escape closes and returns
  // focus to the trigger; Tab is contained within the header (top tier +
  // panel — the ✕ toggle must stay reachable) since the covered page
  // shouldn't receive focus while it can't be seen.
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  // The sheet content's top edge = the header's live bottom edge (measured,
  // not a constant: the announcement bar above the header offsets it at
  // page top). The sheet itself covers the full viewport.
  const [mobileTop, setMobileTop] = useState(0);

  // Exit animation (Quartr's ending-style): the sheet stays mounted through
  // the 200ms out animation. Driven by the open→closed transition so every
  // close path (✕, Escape, link click, route change, sm crossing) animates
  // without touching each call site.
  const [mobileClosing, setMobileClosing] = useState(false);
  const prevMobileOpenRef = useRef(false);
  useEffect(() => {
    if (prevMobileOpenRef.current && !mobileOpen) setMobileClosing(true);
    prevMobileOpenRef.current = mobileOpen;
    if (mobileOpen) setMobileClosing(false);
  }, [mobileOpen]);
  useEffect(() => {
    if (!mobileClosing) return;
    const t = setTimeout(() => setMobileClosing(false), 200);
    return () => clearTimeout(t);
  }, [mobileClosing]);

  useEffect(() => {
    if (!mobileOpen) return;
    mobileNavRef.current?.focus();

    const measure = () => {
      const header = headerRef.current;
      if (header) setMobileTop(header.getBoundingClientRect().bottom);
    };
    measure();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        mobileTriggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const header = headerRef.current;
      if (!header) return;
      const focusables = Array.from(
        header.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (el) => el.getClientRects().length > 0 && !el.closest("[inert]"),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = active !== null && header.contains(active);
      if (e.shiftKey && (!inside || active === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || active === last)) {
        e.preventDefault();
        first.focus();
      }
    };

    // Crossing into the sm layout hides the sheet via CSS — release the
    // open state (and with it the scroll lock) rather than leaving the
    // page locked under a menu that no longer renders.
    const mq = window.matchMedia("(min-width: 640px)");
    const onMq = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };

    const unlock = lockDocumentScroll();
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", measure);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", onMq);
      unlock();
    };
  }, [mobileOpen]);

  // The sheet covers the page, so a navigation initiated from the header
  // itself (wordmark, search result) must also dismiss it — per-link
  // onClick handlers can't cover those paths.
  const pathname = usePathname();
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
        // the slot is empty, so the VISIBLE chrome ends one tier higher —
        // but ONLY where the slot renders at all (it is display:none below
        // sm). Subtracting it on mobile put the edge 40px above the real
        // chrome bottom, leaving a 40px scroll window where the band was
        // visibly under the header yet the border stayed painted — the
        // pale hairline over the inverted band the user spotted.
        const navTierRendered = window.matchMedia("(min-width: 640px)").matches;
        const edge =
          header.getBoundingClientRect().bottom -
          (condensedNow && navTierRendered ? NAV_TIER_H : 0);
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
        {/* Page scrim while a mega-menu section is open — ported from the
            previous nav iteration. Reads the shared --ds-overlay-backdrop-*
            tokens so it matches the Modal / Sheet / Search scrims 1:1
            (bg-200 frost at 0.8, always paired with 8px backdrop blur —
            near-white in light, near-black in dark). Always mounted;
            opacity is the only thing that toggles, so open/close is a
            smooth fade on the panel's own 200ms curve.

            -z-10: the scrim is a positioned box, so without an explicit
            negative z it would paint OVER the header's static top tier
            (positioned > in-flow within the header's stacking context).
            Below zero it sits under both tiers and the panel, while the
            header's own z-50 keeps it above all page content.

            pointer-events-none keeps the page beneath interactive at the
            cursor level — close stays driven by the bridge's pointerLeave,
            not by capturing clicks. hidden below sm: the nav tier (and so
            isOpen) is desktop-only; the mobile sheet brings its own
            full-page canvas.

            absolute + h-screen, NOT fixed inset-0 (user call 2026-08-02):
            anchored to the header's top edge so the announcement banner
            above the masthead stays out of the wash — while the banner is
            visible the header (and so the scrim) starts below it; once
            scrolled, the header pins to the viewport top and the scrim
            covers the full viewport as before. */}
        <div
          aria-hidden
          data-mega-menu-overlay
          style={{
            opacity: isOpen ? "var(--ds-overlay-backdrop-opacity)" : 0,
          }}
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-screen sm:block",
            "bg-[var(--ds-overlay-backdrop-color)]",
            "[backdrop-filter:blur(8px)] [-webkit-backdrop-filter:blur(8px)]",
            "transition-opacity duration-200 ease-out",
          )}
        />
        {/* top tier — divider is full-bleed at every breakpoint (404's
            header model; user call 2026-07-29: header rules span the
            viewport, content stays on the max-w-content column). When
            the nav is condensed this rule is the header's bottom edge,
            and it goes transparent while an inverted band passes
            beneath (the colour-aware border). */}
        {/* Condensed shrink (sm+, user call 2026-08-09): past the fold
            threshold the whole tier translates 16px up — the visible
            band drops 73 → 57px with ZERO layout change (the same
            overlay principle as the nav fold: sticky-chrome layout
            height never animates, so no scroll-anchoring feedback at
            the threshold). The vacated strip under the risen rule is
            just the pointer-inert shell — content scrolls through it
            and stays clickable. The inner row counter-shifts +8px and
            scales to .8, so the wordmark and buttons shrink and
            re-centre in the shorter band, all on the compositor. */}
        <div
          data-masthead-chrome
          className={cn(
            "pointer-events-auto bg-canvas border-b",
            // sm:-scoped will-change: below sm the hint would create a
            // stacking context on the tier for nothing (the shrink is
            // desktop-only) — and that context TRAPS the wordmark's and
            // hamburger's z-[2], dropping them under the mobile sheet's
            // z-[1] (the open-menu logo/✕ vanish, fixed 2026-08-13).
            "transition-[border-color,translate] duration-500 ease-[ease] sm:will-change-[translate] motion-reduce:transition-none",
            navCondensed && "sm:-translate-y-4",
            navCondensed && overInverted
              ? "border-transparent"
              : "border-borderSubtle",
          )}
        >
          <div className="mx-auto max-w-content px-4">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3">
              {/* left — search + single theme toggle. inert while the mobile
                sheet covers them: out of the tab order and AT tree, since
                only the wordmark and the ✕ stay visible over the sheet. */}
              {/* Condensed shrink is applied PER GROUP, each scaling about
                  its own anchor (left cluster from its left edge, wordmark
                  from centre, right cluster from its right edge) — scaling
                  the whole row about its centre dragged the outer clusters
                  ~130px toward the middle (user call 2026-08-09: contents
                  stay in place, one seamless motion). +8px recentres each
                  group vertically in the 57px condensed band (the tier
                  itself rises 16); everything shares the fold's 500ms
                  house curve. */}
              <div
                className={cn(
                  "flex origin-left items-center gap-1",
                  SHRINK_TRANSITION,
                  navCondensed && SHRINK_CONDENSED,
                )}
                inert={mobileOpen || undefined}
              >
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
                className={cn(
                  "relative z-[2] flex origin-center items-center justify-center text-textDefault",
                  SHRINK_TRANSITION,
                  navCondensed && SHRINK_CONDENSED,
                )}
              >
                <Wordmark className="h-12 w-auto" zHover="tilt" />
              </Link>

              {/* right — auth + hamburger */}
              <div
                className={cn(
                  "flex origin-right items-center justify-end gap-2",
                  SHRINK_TRANSITION,
                  navCondensed && SHRINK_CONDENSED,
                )}
              >
                <div className="hidden items-center gap-2 sm:flex">
                  <Button variant="tertiary" size="large">
                    Sign in
                  </Button>
                  <Button variant="default" size="large">
                    Subscribe
                  </Button>
                </div>
                <Button
                  ref={mobileTriggerRef}
                  shape="square"
                  size="large"
                  variant="tertiary"
                  onClick={() => {
                    // Measure in the same event so the sheet's first frame
                    // already sits at the header edge (the effect's measure
                    // runs after paint).
                    if (!mobileOpen) {
                      const header = headerRef.current;
                      if (header) {
                        setMobileTop(header.getBoundingClientRect().bottom);
                      }
                    }
                    setMobileOpen(!mobileOpen);
                  }}
                  className="relative z-[2] sm:hidden"
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileOpen}
                >
                  {/* Two-bar burger that MORPHS into the ✕ (no icon
                      swap): each bar translates to the glyph's centre
                      and counter-rotates 45°, on the same
                      cubic-bezier(.22,1,.36,1) curve as the sheet so
                      button and overlay read as one gesture. bg-current
                      inherits the Button ink; geometry — 20px box, 16px
                      bars at thirds (centres y 7 / 13 → ±3px to meet). */}
                  <span aria-hidden className="relative block h-5 w-5">
                    <span
                      className={cn(
                        "absolute left-[2px] top-[6.25px] h-[1.5px] w-4 rounded-full bg-current",
                        "transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
                        mobileOpen && "translate-y-[3px] rotate-45",
                      )}
                    />
                    <span
                      className={cn(
                        "absolute bottom-[6.25px] left-[2px] h-[1.5px] w-4 rounded-full bg-current",
                        "transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
                        mobileOpen && "-translate-y-[3px] -rotate-45",
                      )}
                    />
                  </span>
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
            className={cn(
              "absolute inset-x-0 top-0",
              // No bg here — the canvas rides the SLIDING ROW (and the
              // Viewport paints its own): the Root now keeps a constant
              // 40px footprint, so a Root-level canvas would paint a
              // white strip over content while the row is folded away.
              // Pointer events follow the row for the same reason —
              // while condensed the strip is empty, and clicks/hovers
              // must fall through to the page scrolling beneath it.
              navCondensed ? "pointer-events-none" : "pointer-events-auto",
            )}
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
              {/* Persistent navbar bottom rule — full-bleed across the
                  viewport (user call 2026-07-29) while the links stay on
                  the max-w-content column inside; the rule rides the
                  sliding row so it spans past the content edge. The
                  panel then expands downward below it with its own
                  matching bottom border. */}
              {/* The fold is a composited SLIDE, not a height animation
                  (user call 2026-08-09: the height transition ran
                  main-thread layout every frame and stuttered against
                  live scrolling). The clip wrapper keeps a constant
                  40px box; the row translates up behind the top tier
                  on the compositor, canvas + rule riding along.
                  visibility shares the transition (interpolated as
                  visible until the end) so the links stay drawn while
                  the row departs, then leave the tab order once
                  hidden. */}
              {/* The clip wrapper RIDES THE TIER's condensed translate
                  (same -16px, same timeline) so its top edge — where the
                  links get clipped — is always exactly the tier's risen
                  rule. Without this the row vanished at an invisible
                  line 16px below the shrinking header (user call
                  2026-08-09: the fold should read as the band rolling
                  up INTO the main navigation). */}
              <div
                data-masthead-chrome
                className={cn(
                  "h-10 overflow-hidden",
                  "transition-[translate] duration-500 ease-[ease] motion-reduce:transition-none",
                  navCondensed && "sm:-translate-y-4",
                )}
              >
                <div
                  className={cn(
                    "h-full border-b border-borderSubtle bg-canvas",
                    // `translate` in the transition list, not just
                    // `transform`: Tailwind v4's translate utilities set
                    // the independent `translate` PROPERTY (transform
                    // stays `none`) — with only `transform` listed the
                    // slide snaps instead of easing.
                    // 500ms plain `ease` — the BBC header's condensation
                    // timing verbatim (user calls 2026-08-09/10: softened
                    // stepwise from 200ms ease-out; the house bezier's
                    // front-loaded attack still read fast at 400ms). The
                    // whole condense family (tier, groups, clip, row)
                    // shares this; the sheet/burger keep the house curve
                    // (user-initiated gesture vs ambient chrome motion).
                    "transition-[translate,visibility] duration-500 ease-[ease] will-change-[translate] motion-reduce:transition-none",
                    navCondensed
                      ? "invisible -translate-y-full"
                      : "translate-y-0",
                  )}
                >
                  {/* grid, not block: Radix wraps the List in a classless
                    indicator-track div we can't style, and a percentage
                    h-full can't resolve through its auto height — the
                    links would top-align in the band. A grid cell
                    stretches that div to the full band height, giving
                    the List's h-full something definite to fill. */}
                  <div className="mx-auto grid h-full max-w-content px-4">
                    <NavigationMenuPrimitive.List className="flex h-full items-stretch justify-center gap-1">
                      {/* Editorial disciplines — plain links, no panel. Entering one
                    closes any open mega-menu: the bridge suppresses Radix's
                    close while the cursor is still in the row, so a plain link
                    (which has no Radix value to switch to) would otherwise leave
                    the previous trigger stuck open. */}
                      {EDITORIAL_LINKS.map((item) => (
                        <NavigationMenuPrimitive.Item
                          key={item.href}
                          className="flex"
                        >
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
                            <ChevronDown
                              className={CHEVRON_CLASS}
                              aria-hidden
                            />
                          </NavigationMenuPrimitive.Trigger>
                          {/* absolute: outgoing and incoming Content overlap in the
                        Viewport during a section switch. No padding here — the
                        panel carries its own py AND its own max-w-content px-4
                        container (the Viewport is full-bleed), so the columns
                        sit on the site grid. */}
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
                </div>
              </div>

              {/* Viewport drop — flush below the bottom-tier border (top-full,
                no gap) so there's no dead zone between the row and the panel.
                Full-bleed like the header rules (user call 2026-08-01): the
                Viewport's canvas + bottom border span the viewport width;
                the panel content centres itself on the max-w-content
                column inside (MegaMenuPanel owns the container + px). */}
              <div className="absolute left-0 right-0 top-full">
                <NavigationMenuPrimitive.Viewport className={VIEWPORT_CLASS} />
              </div>
            </div>
          </NavigationMenuPrimitive.Root>
        </div>

        {/* mobile menu — Quartr's full-page dialog verbatim: fixed inset-0
            OVER the header (z-[1] within the header's stacking context;
            the wordmark and the hamburger/✕ carry z-[2] so only they stay
            visible — the covered left controls go inert). Motion is
            Quartr's exactly: scale .95 ↔ 1 + fade from origin-top-right
            (the hamburger corner), 350ms in / 200ms out on
            cubic-bezier(.22,1,.36,1); the sheet stays mounted through the
            exit (mobileClosing). Content scrolls in an inner region inset
            below the header line (their top-[var(--header-height)] —
            ours is measured, see mobileTop), over the locked page.
            `fixed` works from inside the sticky header because sticky
            doesn't create a containing block for fixed descendants. */}
        {(mobileOpen || mobileClosing) && (
          <nav
            aria-label="Menu"
            tabIndex={-1}
            ref={mobileNavRef}
            className={cn(
              "fixed inset-0 z-[1] origin-top-right bg-canvas outline-none sm:hidden",
              "motion-reduce:animate-none",
              mobileOpen
                ? "pointer-events-auto animate-menu-sheet-in"
                : "pointer-events-none animate-menu-sheet-out",
            )}
          >
            <div
              className="absolute inset-x-0 bottom-0 overflow-y-auto overscroll-contain"
              style={{ top: mobileTop }}
            >
              <div className="mx-auto flex max-w-content flex-col px-4 py-6">
                {/* Account group leads the sheet (404's menu model: auth as
                  list rows under an "Account" heading, not a button pair).
                  Rows are buttons — the auth flows aren't wired yet, same
                  as the desktop tier's Sign in / Subscribe. */}
                <div className="flex flex-col">
                  <p className="mb-1 text-heading-14 text-textDefault">
                    Account
                  </p>
                  <button
                    type="button"
                    className={cn(
                      MOBILE_LINK_CLASS,
                      "cursor-pointer text-left",
                    )}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    className={cn(
                      MOBILE_LINK_CLASS,
                      "cursor-pointer text-left",
                    )}
                  >
                    Subscribe
                  </button>
                </div>
                {/* One flat Discover group — editorial disciplines then the
                  mega-menu sections, the whole nav taxonomy in a single
                  list (404 keeps its menu to one Navigation list too). */}
                <div className="mt-6 flex flex-col">
                  <p className="mb-1 text-heading-14 text-textDefault">
                    Discover
                  </p>
                  {EDITORIAL_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={MOBILE_LINK_CLASS}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {MEGA_SECTIONS.map((section) => (
                    <Link
                      key={section.href}
                      href={section.href}
                      onClick={() => setMobileOpen(false)}
                      className={MOBILE_LINK_CLASS}
                    >
                      {section.label}
                    </Link>
                  ))}
                </div>
                {/* Social profiles — mobile menu only (the desktop chrome
                  leaves socials to the Footer). Same shared list and
                  external-link anatomy as the Footer's Social column:
                  trailing arrow-up-right, 2px hover nudge. */}
                <div className="mt-6 flex flex-col">
                  <p className="mb-1 text-heading-14 text-textDefault">
                    Follow us
                  </p>
                  {socialLinks.map(({ label, href }) => (
                    <a
                      key={href}
                      href={href}
                      rel="noopener"
                      target="_blank"
                      className={cn(MOBILE_LINK_CLASS, "group gap-x-1")}
                    >
                      {label}
                      <span
                        aria-hidden
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      >
                        <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
