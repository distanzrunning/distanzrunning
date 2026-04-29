// src/components/Footer.tsx
//
// Site footer — v0-style three-column layout: wordmark on the left,
// Category / Company / Social columns on the right. Theme-aware
// (uses --ds-* tokens), so it adapts to light and dark mode.
//
// Anatomy modelled on v0.app's footer: outer relative footer, max-w
// container, flex row that stacks on mobile and goes side-by-side on
// md+. Three columns inside the right cluster (2-col grid on mobile,
// 3-col on md+). Wordmark uses the same inline <Wordmark /> as the
// header so colour follows currentColor / text-gray-1000.

"use client";

import { useContext, type ComponentType } from "react";
import Link from "next/link";
import { SiInstagram, SiX, SiStrava, SiLinkedin } from "react-icons/si";
import { DarkModeContext } from "@/components/DarkModeProvider";
import { useConsent } from "@/contexts/ConsentContext";
import Logo from "@/components/ui/Logo";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

// ============================================================================
// Link / action union — Cookies needs to fire openSettings on the
// consent context, so a column can mix internal Next links with
// button actions. External social links live in their own column.
// ============================================================================

type FooterItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "action"; label: string; onClick: () => void };

const categoryLinks: ReadonlyArray<FooterItem> = [
  { kind: "link", label: "News", href: "/articles" },
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

// ============================================================================
// Main
// ============================================================================

export default function Footer() {
  const { openSettings } = useConsent();
  const { theme, setTheme } = useContext(DarkModeContext);

  const companyLinks: ReadonlyArray<FooterItem> = [
    { kind: "link", label: "About", href: "/about" },
    { kind: "link", label: "Work with us", href: "/careers" },
    { kind: "link", label: "Privacy", href: "/privacy" },
    { kind: "action", label: "Cookies", onClick: openSettings },
  ];

  return (
    <footer
      aria-label="Site footer"
      className="relative z-50 w-full text-[color:var(--ds-gray-900)]"
    >
      {/* Outer wrapper sized to v0: 1400 px max width, 40 px L/R
          padding, 48 px vertical margin, asymmetric pt-6 pb-10. */}
      <div className="mx-auto my-12 w-full max-w-[1400px] px-10 pt-6 pb-10">
        {/* Content row: stacked on mobile inside a 672 px (max-w-2xl)
            column with a generous 64 px gap between logo and link
            grid. On md+ it expands to the xl breakpoint and goes
            side-by-side. */}
        <div className="flex w-full max-w-2xl flex-col justify-between gap-x-12 gap-y-16 md:mx-auto md:max-w-7xl md:flex-row md:items-start">
          {/* Full Distanz Running lockup (icon + Distanz + Running).
              Same inline-SVG approach as the header wordmark so the
              colour follows currentColor / text-gray-1000 in both
              modes. */}
          <Link
            href="/"
            aria-label="Distanz Running — home"
            className="inline-flex h-fit shrink-0 text-[color:var(--ds-gray-1000)]"
          >
            <Logo className="h-12 w-auto" />
          </Link>

          {/* Link grid. Mobile: 2-col, no x-gap, 16 px y-gap (tight
              packing inside the 672 px column). md: 3 cols / 64 px
              gap. lg: 108 px gap. */}
          <div className="grid grid-cols-2 gap-x-0 gap-y-4 md:grid-cols-3 md:gap-16 lg:gap-[108px]">
            <FooterColumn heading="Category" items={categoryLinks} />
            <FooterColumn heading="Company" items={companyLinks} />
            <SocialColumn />
          </div>
        </div>

        {/* Bottom strip — theme switcher anchors the foot of the
            container. No label; the segmented sun/moon/system
            glyphs do the labelling work themselves. */}
        <div className="mt-16 md:mx-auto md:max-w-7xl">
          <ThemeSwitcher value={theme} onChange={setTheme} />
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
      <h2 className="text-[14px] leading-5 font-medium text-[color:var(--ds-gray-1000)]">
        {heading}
      </h2>
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
      <h2 className="text-[14px] leading-5 font-medium text-[color:var(--ds-gray-1000)]">
        Social
      </h2>
      <ul className="flex flex-col gap-y-2.5">
        {socialLinks.map(({ label, href, Icon }) => (
          <li key={href} className="w-fit">
            <a
              href={href}
              rel="noopener"
              target="_blank"
              className={linkClasses}
            >
              {/* mr-1 (not gap-x-) matches v0's social spacing —
                  4 px between icon and label. */}
              <Icon size={14} className="mr-1 shrink-0" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// gap-x-0.5 (2 px) matches v0's link-internal spacing — used by
// links that have a trailing arrow icon. With text-only links the
// gap is invisible.
const linkClasses =
  "inline-flex items-center gap-x-0.5 rounded-sm text-[14px] leading-5 text-[color:var(--ds-gray-900)] transition-colors hover:text-[color:var(--ds-gray-1000)] focus-visible:text-[color:var(--ds-gray-1000)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--ds-focus-ring)]";
