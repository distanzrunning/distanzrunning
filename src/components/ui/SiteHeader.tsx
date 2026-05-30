"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { Search as SearchIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import {
  NewsletterModal,
  preloadNewsletterHero,
} from "@/components/ui/NewsletterModal";
import {
  SiteNavigationMenuRoot,
  SiteNavigationMenuTriggers,
  SiteNavigationMenuViewport,
  type FeaturedProduct,
  type FeaturedRace,
} from "@/components/ui/SiteNavigationMenu";
import MobileNavDrawer from "@/components/ui/MobileNavDrawer";
import Wordmark from "@/components/ui/Wordmark";
import { useSearch } from "@/contexts/SearchContext";

// ============================================================================
// SiteHeader
// ============================================================================
//
// Public-site header rendered as a Frontify-style floating pill: a
// fixed 72 px-tall capsule that floats above the page with a 64 px
// outer gutter, a translucent bg-200 fill, and an oversize backdrop
// blur (200 px). No bottom rule — separation from page content comes
// from the floating geometry and translucent surface, never a
// hairline. Over a plain page section the pill resolves to the page
// tone and reads as invisible at rest; over any non-uniform content
// (hero photos, dark sections, cards) the blur kernel smears that
// content across the entire pill, giving it a wash that distinguishes
// it from the page automatically.
//
// Wordmark sits left, primary nav is absolutely centred in the pill so
// it stays geometrically centred regardless of the action cluster's
// width, and the right group hosts the search IconButton + Newsletter
// CTA on desktop alongside the mobile hamburger (md:hidden) — both live
// inside the pill so the chrome reads as a single floating element on
// every breakpoint.

export interface SiteHeaderProps {
  featuredNews: FeaturedProduct;
  featuredShoe: FeaturedProduct;
  featuredGear: FeaturedProduct;
  featuredNutrition: FeaturedProduct;
  featuredRace: FeaturedRace;
  /**
   * Where the newsletter trigger reports from in PostHog.
   * Defaults to "site_header".
   */
  newsletterSource?: string;
}

export default function SiteHeader({
  featuredNews,
  featuredShoe,
  featuredGear,
  featuredNutrition,
  featuredRace,
  newsletterSource = "site_header",
}: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openSearch } = useSearch();
  // Newsletter modal state lives at the header level so the modal
  // can outlive both the desktop trigger and the mobile drawer —
  // the drawer can close itself before the modal appears, so the
  // user only ever sees one overlay at a time.
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [newsletterEventSource, setNewsletterEventSource] =
    useState(newsletterSource);

  const openNewsletter = useCallback(
    (source: string, options?: { fromMobileDrawer?: boolean }) => {
      try {
        posthog.capture("newsletter_modal_opened", { location: source });
      } catch {
        // PostHog may not be loaded yet (consent not granted) — ignore.
      }
      setNewsletterEventSource(source);
      if (options?.fromMobileDrawer) setMobileOpen(false);
      setNewsletterOpen(true);
    },
    [],
  );

  // Scroll-position state retained for future use (e.g. animating the
  // pill's elevation or opacity once content scrolls under it). It no
  // longer drives className — the floating pill has no rest/scrolled
  // border state to toggle.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl+K shortcut + Dialog are owned by SearchProvider —
  // see src/contexts/SearchContext.tsx.

  return (
    <>
      {/* Outer wrapper: fixed, full-bleed, with a 64 px gutter on each
          side (Frontify spec). pointer-events-none keeps the gutter
          transparent to clicks so page content beneath the floating
          pill stays interactive in those margins.

          SiteNavigationMenuRoot wraps BOTH the trigger row (rendered
          inside the pill, beside the wordmark) AND the mega-menu
          Viewport (rendered as a sibling of the pill, absolutely
          positioned below it). Both must live in the same
          NavigationMenu.Root subtree so Radix can wire them together
          — the Root contributes no DOM box of its own (className
          "contents" inside SiteNavigationMenuRoot), so the pill and
          Viewport flow as siblings inside this fixed wrapper. */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-40 px-16">
        <SiteNavigationMenuRoot
          triggers={
            // The pill: max-width capped, centred, re-enables pointer
            // events for its own surface. h-[72px] + p-4 + rounded-[8px]
            // matches the Frontify reference.
            //
            // Rest fill = page bg at 80% opacity (rgba on bg-200-rgb,
            // theme-flipping). On a plain page section the pill is
            // mathematically identical to the page (same tone, blur of
            // uniform = uniform) so it reads as invisible at rest. The
            // moment any non-uniform content (hero photo, dark section,
            // cards) sits inside the blur(200px) kernel's reach, that
            // content gets sampled and smeared across the entire pill
            // surface — the whole pill picks up a wash and becomes
            // visibly distinct from the page. blur(200px) is huge on
            // purpose: the radius exceeds the pill's own width, so the
            // filter averages a viewport-wide neighbourhood per pixel,
            // which produces the propagation effect.
            //
            // Hover lift: when a descendant carrying [data-nav-trigger]
            // is hovered (nav links + Search), the pill flips to opaque
            // bg-100. Gives the navbar a clear "yes, this is a real
            // surface" affordance on plain page bg where the rest
            // state is invisible. Subscribe is excluded — it's a primary
            // CTA, not a nav trigger, so its filled-black hover should
            // not chameleon the surrounding pill. 260 ms ease-out keeps
            // the transition smooth enough to read as deliberate.
            <header className="pointer-events-auto relative mx-auto flex h-[72px] max-w-[1600px] items-center justify-between rounded-[8px] bg-[rgba(var(--ds-background-200-rgb),0.8)] p-4 transition-colors duration-[260ms] ease-out has-[[data-nav-trigger]:hover]:bg-[var(--ds-background-100)] [backdrop-filter:blur(200px)] [-webkit-backdrop-filter:blur(200px)]">
          {/* Left: wordmark only. The primary nav lives in its own
              absolute-centred slot below so the three-zone layout
              (brand / nav / actions) reads symmetrically — diverges
              from Frontify's left-aligned trigger row in favour of
              the more conventional centre nav that pairs cleanly
              with our pill's geometric symmetry. */}
          <Link
            href="/"
            aria-label="Distanz Running — home"
            className="inline-flex h-10 items-center px-1 text-[color:var(--ds-gray-1000)]"
          >
            {/* Inline SVG via <Wordmark /> — single render, no network
                request, no light/dark download swap. Colour follows
                currentColor (text-gray-1000), which flips automatically
                between near-black and near-white in dark mode. */}
            <Wordmark className="h-7 w-auto" />
          </Link>

          {/* Centre: primary nav. Absolute-positioned + transform so
              the trigger row is geometrically centred in the pill
              regardless of how wide the wordmark or the action
              cluster end up being. justify-between on the parent
              still pushes wordmark and right cluster to the edges
              (the absolute nav is out of flex flow). md:block hides
              it on mobile — the hamburger handles small viewports. */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <SiteNavigationMenuTriggers
              featuredNews={featuredNews}
              featuredShoe={featuredShoe}
              featuredGear={featuredGear}
              featuredNutrition={featuredNutrition}
              featuredRace={featuredRace}
            />
          </div>

          {/* Right: action cluster. Desktop shows search + Newsletter;
              mobile shows the hamburger ↔ X toggle. Both live in the
              same flex group so spacing inside the pill stays uniform
              across breakpoints. */}
          <div className="flex items-center gap-2">
            {/* Desktop: search utility + Subscribe primary CTA. Sized
                to medium (≈40 px) so both chips read at the same
                visual weight as the nav triggers in the left group —
                a tiny chip floating next to 40 px-tall nav items
                makes the right cluster feel weightless. Theme
                switcher lives in the footer (set-once preference
                doesn't deserve top-of-page real estate). */}
            <div className="hidden items-center gap-2 md:flex">
              <IconButton
                variant="tertiary"
                size="default"
                aria-label="Open search"
                title="Search (⌘K)"
                onClick={openSearch}
                data-nav-trigger
                className="hover:!bg-[var(--ds-gray-200)]"
              >
                <SearchIcon className="size-4" />
              </IconButton>
              <Button
                size="medium"
                onClick={() => openNewsletter(newsletterSource)}
                onMouseEnter={preloadNewsletterHero}
                onFocus={preloadNewsletterHero}
                data-attr="newsletter-modal-open"
              >
                Subscribe
              </Button>
            </div>

            {/* Mobile: hamburger ↔ close toggle. 28 px square with
                rounded-md + hairline border. Interior is the alternate
                of the header surface (bg-200 light, bg-100 dark) so the
                chip reads against either chrome. The icon swaps to an X
                glyph while the drawer is open so the close affordance
                is obvious. */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              data-mobile-nav-toggle
              onClick={() => setMobileOpen((prev) => !prev)}
              className="pointer-events-auto relative z-[101] grid size-7 place-items-center rounded-md border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-200)] text-[color:var(--ds-gray-1000)] transition-colors hover:bg-[color:var(--ds-gray-100)] md:hidden dark:bg-[color:var(--ds-background-100)] dark:hover:bg-[color:var(--ds-gray-100)]"
            >
              {mobileOpen ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.75 4H1V5.5H1.75H14.25H15V4H14.25H1.75ZM1.75 10.5H1V12H1.75H14.25H15V10.5H14.25H1.75Z"
                  />
                </svg>
              )}
            </button>
          </div>
        </header>
          }
          viewport={
            // Viewport sits absolutely below the pill, centred to the
            // same 1600 px max-width so its left/right edges align
            // with the pill's. top-[88px] = pill height (72) + the
            // outer top-4 offset (16). pointer-events-auto on the
            // inner wrapper re-enables interaction (the outer fixed
            // wrapper sets pointer-events-none for the gutter).
            //
            // mx-auto + max-w-[1600px] gives the panel the same
            // horizontal extent as the pill. The Viewport itself
            // measures the active Content and exposes its height as
            // --radix-navigation-menu-viewport-height — see
            // SiteNavigationMenuViewport for the chrome.
            <div className="pointer-events-none absolute inset-x-0 top-[88px] z-40 px-16">
              <div className="pointer-events-auto mx-auto max-w-[1600px]">
                <SiteNavigationMenuViewport />
              </div>
            </div>
          }
        />
      </div>

      <MobileNavDrawer
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        featuredNews={featuredNews}
        featuredShoe={featuredShoe}
        featuredGear={featuredGear}
        featuredNutrition={featuredNutrition}
        featuredRace={featuredRace}
        onOpenNewsletter={() =>
          openNewsletter(`${newsletterSource}_mobile`, {
            fromMobileDrawer: true,
          })
        }
      />

      <NewsletterModal
        isOpen={newsletterOpen}
        onClose={() => setNewsletterOpen(false)}
        source={newsletterEventSource}
      />
    </>
  );
}
