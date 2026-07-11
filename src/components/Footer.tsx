// src/components/Footer.tsx
//
// Site footer — v0.app's anatomy on Stride tokens: full lockup on the
// left, Category / About / Social link columns on the right, theme
// switcher tucked bottom-left. One structural hairline on top (the
// same Default rule the homepage sections use), everything on the
// page canvas.
//
// Typography: column headings run text-heading-14 (the DS mini-header
// slot — v0's `label-14 font-medium` analogue; a stacked font-medium
// would lose to the slot's own weight, see the Masthead LINK_CLASS
// note). Links are text-label-14, textSubtle stepping up to
// textDefault on hover/focus — v0's gray-900 → gray-1000 move.

"use client";

import { useContext, type ComponentType } from "react";
import Link from "next/link";
import { SiInstagram, SiX, SiStrava, SiLinkedin } from "react-icons/si";
import { DarkModeContext } from "@/components/DarkModeProvider";
import { useConsentSettings } from "@/components/consent/useConsentSettings";
import Logo from "@/components/ui/Logo";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

// ============================================================================
// Link / action union — Cookies opens the consent settings dialog, so
// a column can mix internal Next links with button actions.
// ============================================================================

type FooterItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "action"; label: string; onClick: () => void };

// Mirrors the Masthead's navigation order: the three editorial
// sections, then the mega-menu categories.
const categoryLinks: ReadonlyArray<FooterItem> = [
  { kind: "link", label: "Road", href: "/articles/road" },
  { kind: "link", label: "Track", href: "/articles/track" },
  { kind: "link", label: "Trail", href: "/articles/trail" },
  { kind: "link", label: "Shoes", href: "/shoes" },
  { kind: "link", label: "Gear", href: "/gear" },
  { kind: "link", label: "Nutrition", href: "/nutrition" },
  { kind: "link", label: "Races", href: "/races" },
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
  const { theme, setTheme } = useContext(DarkModeContext);

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
      <div className="mx-auto w-full max-w-content px-6 py-12 lg:py-16">
        {/* Content row — stacked on mobile, logo left / link grid right
            on md+. `relative` anchors the theme switcher's absolute
            position on desktop. */}
        <div className="relative flex w-full flex-col justify-between gap-x-12 gap-y-16 md:flex-row md:items-start">
          {/* Full Distanz Running lockup — inline SVG on currentColor,
              same approach as the header wordmark, so dark mode is a
              text-* flip. */}
          <Link
            href="/"
            aria-label="Distanz Running — home"
            className="inline-flex h-fit shrink-0 text-textDefault"
          >
            <Logo className="h-12 w-auto" />
          </Link>

          {/* Link grid — 2-col packing on mobile (Social wraps below),
              three spread columns on md+. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 md:gap-16 lg:gap-24">
            <FooterColumn heading="Category" items={categoryLinks} />
            <FooterColumn heading="About" items={aboutLinks} />
            <SocialColumn />
          </div>

          {/* Theme switcher.
              Mobile: last item in the stacked flow, below the grid.
              Desktop: pinned to the bottom-left of the row, flush with
              the bottom of the link grid and the wordmark's left edge.
              No label — the segmented glyphs are self-labelling. */}
          <div className="md:absolute md:bottom-0 md:left-0">
            <ThemeSwitcher value={theme} onChange={setTheme} />
          </div>
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
