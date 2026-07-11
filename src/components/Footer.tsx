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

"use client";

import { type ComponentType } from "react";
import Link from "next/link";
import { SiInstagram, SiX, SiStrava, SiLinkedin } from "react-icons/si";
import { useConsentSettings } from "@/components/consent/useConsentSettings";
import Logo from "@/components/ui/Logo";
import LogoIcon from "@/components/ui/LogoIcon";

// ============================================================================
// Link / action union — Cookies opens the consent settings dialog, so
// a column can mix internal Next links with button actions.
// ============================================================================

type FooterItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "action"; label: string; onClick: () => void };

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
  { kind: "link", label: "Races", href: "/races" },
  { kind: "link", label: "Race Calendar", href: "/races/calendar" },
];

type SocialLink = {
  label: string;
  href: string;
  Icon: ComponentType<{ size?: number | string; className?: string }>;
};

const socialLinks: ReadonlyArray<SocialLink> = [
  {
    label: "Instagram",
    href: "https://instagram.com/distanzrunning",
    Icon: SiInstagram,
  },
  {
    label: "Twitter",
    href: "https://x.com/distanzrunning",
    Icon: SiX,
  },
  {
    label: "Strava",
    href: "https://strava.com/clubs/distanzrunning",
    Icon: SiStrava,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/distanzrunning",
    Icon: SiLinkedin,
  },
];

// gap-x-0.5 (2px) is v0's link-internal spacing — invisible on
// text-only links, correct if one ever gains a trailing glyph.
const linkClasses =
  "inline-flex items-center gap-x-0.5 rounded-sm text-label-14 text-textSubtle transition-colors hover:text-textDefault focus-visible:text-textDefault focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)]";

// ============================================================================
// Main
// ============================================================================

export default function Footer() {
  const { openSettings } = useConsentSettings();

  const aboutLinks: ReadonlyArray<FooterItem> = [
    { kind: "link", label: "About", href: "/about" },
    { kind: "link", label: "Contact", href: "/contact-us" },
    { kind: "link", label: "Privacy", href: "/privacy" },
    { kind: "action", label: "Cookies", onClick: openSettings },
  ];

  return (
    <footer
      aria-label="Site footer"
      className="w-full border-t border-borderSubtle"
    >
      <div className="mx-auto w-full max-w-content px-6 pb-16 pt-12 md:pb-24 lg:pt-16">
        {/* Icon mark above the columns, top-left (Quartr's logomark
            slot) — doubles as the footer's home link now that the
            small lockup is gone. */}
        <Link
          href="/"
          aria-label="Distanz Running — home"
          className="mb-10 inline-flex text-textDefault"
        >
          <LogoIcon className="h-6 w-6" />
        </Link>

        {/* Link grid — 2-col packing on mobile, five spread columns
            across the content width on md+ (Quartr's columns row). */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-5 md:gap-10 lg:gap-16">
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
      <ul className="flex flex-col gap-y-2.5">
        {items.map((item) => (
          <li key={item.label} className="w-fit">
            {item.kind === "link" ? (
              <Link href={item.href} className={linkClasses}>
                {item.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className={linkClasses}
              >
                {item.label}
              </button>
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
      <ul className="flex flex-col gap-y-2.5">
        {socialLinks.map(({ label, href, Icon }) => (
          <li key={href} className="w-fit">
            <a
              href={href}
              rel="noopener"
              target="_blank"
              className={linkClasses}
            >
              {/* mr-1 (not the gap) matches v0's icon-to-label spacing;
                  16px = the DS small inline icon size. */}
              <Icon size={16} className="mr-1 shrink-0" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
