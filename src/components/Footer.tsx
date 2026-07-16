// src/components/Footer.tsx
//
// Site footer — v0.app's link-column anatomy over Quartr's giant-
// wordmark bookend, on Stride tokens: five link columns across the
// content width, then the full Distanz Running lockup blown up to
// full width at the very bottom, clipped mid-"RUNNING" by the page
// edge (Quartr's cropped-logomark move). One structural hairline on
// top (the same Default rule the homepage sections use), everything
// on the page canvas.
//
// Typography: column headings run text-heading-14 (the DS mini-header
// slot — v0's `label-14 font-medium` analogue; a stacked font-medium
// would lose to the slot's own weight, see the Masthead LINK_CLASS
// note). Links are text-label-14, textSubtle stepping up to
// textDefault on hover/focus — v0's gray-900 → gray-1000 move.

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import FooterCookiesButton from "@/components/FooterCookiesButton";
import Logo from "@/components/ui/Logo";
import LogoIcon from "@/components/ui/LogoIcon";
import { cn } from "@/lib/utils";

// ============================================================================
// Link / action union — Cookies opens the consent settings dialog via a
// client child (FooterCookiesButton), so a column can mix internal Next
// links with the cookies action. Functions can't cross the server→client
// boundary, so the action carries no onClick — FooterColumn renders the
// client component for the "cookies" kind instead.
// ============================================================================

type FooterItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "cookies"; label: string };

// Mirrors the Masthead's navigation, split by register: the three
// editorial sections, the product categories, then races. Hrefs match
// the mega-menu's canonical links (SiteNavigationMenu.tsx).
const storiesLinks: ReadonlyArray<FooterItem> = [
  { kind: "link", label: "Road", href: "/articles/road" },
  { kind: "link", label: "Track", href: "/articles/track" },
  { kind: "link", label: "Trail", href: "/articles/trail" },
];

const gearColumnLinks: ReadonlyArray<FooterItem> = [
  { kind: "link", label: "Shoes", href: "/shoes" },
  { kind: "link", label: "Watches", href: "/gear/watches" },
  { kind: "link", label: "Apparel", href: "/gear/apparel" },
  { kind: "link", label: "Nutrition", href: "/nutrition" },
];

const racesColumnLinks: ReadonlyArray<FooterItem> = [
  // "Race guides", not "Races" — the column heading is already Races,
  // and the stacked repeat read as a stutter.
  { kind: "link", label: "Race guides", href: "/races" },
  { kind: "link", label: "Race calendar", href: "/races/calendar" },
];

const aboutLinks: ReadonlyArray<FooterItem> = [
  { kind: "link", label: "About", href: "/about" },
  { kind: "link", label: "Contact", href: "/contact-us" },
  { kind: "link", label: "Privacy", href: "/privacy" },
  { kind: "cookies", label: "Cookies" },
];

type SocialLink = {
  label: string;
  href: string;
};

const socialLinks: ReadonlyArray<SocialLink> = [
  { label: "Instagram", href: "https://instagram.com/distanzrunning" },
  { label: "X (Twitter)", href: "https://x.com/distanzrunning" },
  { label: "Strava", href: "https://strava.com/clubs/distanzrunning" },
  { label: "LinkedIn", href: "https://linkedin.com/company/distanzrunning" },
];

// gap-x-0.5 (2px) is v0's link-internal spacing — invisible on
// text-only links, correct if one ever gains a trailing glyph.
const linkClasses =
  "inline-flex min-h-[32px] items-center gap-x-0.5 rounded-sm text-label-14 text-textSubtle transition-colors hover:text-textDefault focus-visible:text-textDefault focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)]";

// ============================================================================
// Main
// ============================================================================

export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="w-full border-t border-borderSubtle"
    >
      {/* Content grid — the icon + columns align with the newsletter
          band above and the page sections, not a narrower centred
          block (tried, read as adrift against the page edge). */}
      <div className="mx-auto w-full max-w-content px-4 pb-16 pt-12 md:pb-24 lg:pt-16">
        {/* Icon mark above the columns (Quartr's logomark slot),
            flush with the leftmost list's edge — doubles as the
            footer's home link now that the small lockup is gone. */}
        <Link
          href="/"
          aria-label="Distanz Running — home"
          className="mb-10 inline-flex text-textDefault"
        >
          <LogoIcon className="h-6 w-6" />
        </Link>

        {/* Link grid — single column on mobile (Quartr's stacked
            footer groups), five equal columns from md. */}
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-5 md:gap-10 lg:gap-16">
          <FooterColumn heading="Stories" items={storiesLinks} />
          <FooterColumn heading="Gear" items={gearColumnLinks} />
          <FooterColumn heading="Races" items={racesColumnLinks} />
          <FooterColumn heading="About" items={aboutLinks} />
          <SocialColumn />
        </div>
      </div>

      {/* Giant lockup bookend — the full Distanz Running lockup blown
          up, centred, with the page edge cutting through "RUNNING"
          (Quartr's cropped-wordmark move; theirs caps at 825px too).
          The wrapper's aspect ratio is the SVG's 1579.12-wide viewBox
          over y=460 — the RUNNING glyphs span y 410.5–484.7, so
          exactly the bottom third of the word is cropped at any
          width; no bottom padding below, the cut IS the page bottom.
          Decorative: the Masthead carries the home link. currentColor
          keeps it theme-aware. */}
      <div className="mx-auto w-full max-w-3xl px-6" aria-hidden>
        <div className="aspect-[1579.12/460] overflow-hidden text-textDefault">
          <Logo className="h-auto w-full" />
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// Column primitives
// ============================================================================

function FooterColumn({
  heading,
  items,
}: {
  heading: string;
  items: ReadonlyArray<FooterItem>;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-heading-14 text-textDefault">{heading}</h2>
      <ul className="flex flex-col gap-y-1">
        {items.map((item) => (
          <li key={item.label} className="w-fit">
            {item.kind === "link" ? (
              <Link href={item.href} className={linkClasses}>
                {item.label}
              </Link>
            ) : (
              <FooterCookiesButton className={linkClasses} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialColumn() {
  return (
    <div className="space-y-4">
      <h2 className="text-heading-14 text-textDefault">Social</h2>
      <ul className="flex flex-col gap-y-1">
        {socialLinks.map(({ label, href }) => (
          <li key={href} className="w-fit">
            {/* Quartr's external-link anatomy: label + trailing
                arrow-up-right that nudges 2px up-and-right on hover
                (the group-hover translate below). */}
            <a
              href={href}
              rel="noopener"
              target="_blank"
              className={cn(linkClasses, "group gap-x-1")}
            >
              {label}
              <span
                aria-hidden
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
