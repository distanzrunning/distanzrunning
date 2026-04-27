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

import type { ComponentType } from "react";
import Link from "next/link";
import { SiInstagram, SiX, SiStrava, SiLinkedin } from "react-icons/si";
import { useConsent } from "@/contexts/ConsentContext";
import Logo from "@/components/ui/Logo";

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
    label: "X",
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

  const companyLinks: ReadonlyArray<FooterItem> = [
    { kind: "link", label: "About", href: "/about" },
    { kind: "link", label: "Contact", href: "/contact" },
    { kind: "link", label: "Work with us", href: "/careers" },
    { kind: "link", label: "Privacy", href: "/privacy" },
    { kind: "action", label: "Cookies", onClick: openSettings },
  ];

  return (
    <footer
      aria-label="Site footer"
      className="relative w-full bg-[color:var(--ds-background-100)] text-[color:var(--ds-gray-900)]"
    >
      <div className="mx-auto w-full max-w-7xl px-8 py-12">
        <div className="flex flex-col gap-y-12 md:flex-row md:items-start md:justify-between md:gap-x-12">
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

          {/* Three columns. 2 across on mobile, 3 across on md+. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 md:gap-x-12 lg:gap-x-20">
            <FooterColumn heading="Category" items={categoryLinks} />
            <FooterColumn heading="Company" items={companyLinks} />
            <SocialColumn />
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
              className={`${linkClasses} gap-x-2`}
            >
              <Icon size={14} className="shrink-0" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const linkClasses =
  "inline-flex items-center gap-x-1 rounded-sm text-[14px] leading-5 text-[color:var(--ds-gray-900)] transition-colors hover:text-[color:var(--ds-gray-1000)] focus-visible:text-[color:var(--ds-gray-1000)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--ds-focus-ring)]";
