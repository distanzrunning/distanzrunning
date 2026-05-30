"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  TbRoad,
  TbArrowCapsule,
  TbMountain,
  TbCalendar,
  TbCloud,
  TbStopwatch,
  TbDeviceWatch,
  TbHeadphones,
  TbShirt,
  TbBatteryCharging,
  TbBottle,
  TbFlag,
  TbCalendarEvent,
  TbDatabase,
} from "react-icons/tb";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// ============================================================================
// Public types — shared with MobileNavDrawer and SiteHeaderWrapper.
// SiteHeaderWrapper still fetches every featured* item via Sanity (the
// mobile drawer still surfaces them and the mega-menu revival will need
// them again), so the FeaturedProduct / FeaturedRace shapes stay exported
// even though the desktop nav no longer renders them.
// ============================================================================

type SanitySlug = { current: string };

export type FeaturedProduct = {
  title: string;
  slug: SanitySlug;
  mainImage?: SanityImageSource | null;
  excerpt?: string;
} | null;

export type FeaturedRace = {
  title: string;
  slug: SanitySlug;
  mainImage?: SanityImageSource | null;
  eventDate?: string;
  location?: string;
} | null;

// ============================================================================
// Taxonomy — exported so MobileNavDrawer (and the upcoming mega-menu
// redesign) can render the same link sets the desktop nav points at.
// ============================================================================

export type CategoryItem = {
  label: string;
  href: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
};

export const newsLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Road",
    href: "/articles/road",
    description: "Marathon and road racing",
    Icon: TbRoad,
  },
  {
    label: "Track",
    href: "/articles/track",
    description: "From 100m to 10,000m",
    Icon: TbArrowCapsule,
  },
  {
    label: "Trail",
    href: "/articles/trail",
    description: "Mountain and ultra racing",
    Icon: TbMountain,
  },
];

export const shoeLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Race-Day",
    href: "/shoes/race-day-shoes",
    description: "Built for PR days",
    Icon: TbFlag,
  },
  {
    label: "Daily Trainers",
    href: "/shoes/daily-trainers",
    description: "Your go-to runners",
    Icon: TbCalendar,
  },
  {
    label: "Max Cushion",
    href: "/shoes/max-cushion",
    description: "Plush for long miles",
    Icon: TbCloud,
  },
  {
    label: "Tempo",
    href: "/shoes/tempo-shoes",
    description: "Responsive and fast",
    Icon: TbStopwatch,
  },
  {
    label: "Trail",
    href: "/shoes/trail-shoes",
    description: "Off-road traction",
    Icon: TbMountain,
  },
];

export const gearLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Watches",
    href: "/gear/watches",
    description: "Track every run",
    Icon: TbDeviceWatch,
  },
  {
    label: "Headphones",
    href: "/gear/headphones",
    description: "Music on the move",
    Icon: TbHeadphones,
  },
  {
    label: "Apparel",
    href: "/gear/apparel",
    description: "Kit for every season",
    Icon: TbShirt,
  },
];

export const nutritionLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Gels",
    href: "/nutrition/gels",
    description: "Fast-acting fuel",
    Icon: TbBatteryCharging,
  },
  {
    label: "Hydration",
    href: "/nutrition/hydration",
    description: "Electrolytes and drinks",
    Icon: TbBottle,
  },
];

export const raceLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Races",
    href: "/races",
    description: "Browse race guides",
    Icon: TbFlag,
  },
  {
    label: "Calendar",
    href: "/races/calendar",
    description: "Upcoming races",
    Icon: TbCalendarEvent,
  },
  {
    label: "Database",
    href: "/races/database",
    description: "Search every race",
    Icon: TbDatabase,
  },
];

// ============================================================================
// Top-level nav links
// ============================================================================
//
// Direct links to each section index — no mega-menu for now (the
// editorial 3-column dropdown lands in a follow-up pass). Each link
// renders as a Frontify-style pill: at rest it's plain text in the
// pill's warm background; on hover/focus the chip pops to the same
// warm tone at full opacity (#f0f0eb), matching the parent pill's
// translucent bg pulled up to 100%.

const NAV_LINKS = [
  { label: "News", href: "/articles" },
  { label: "Shoes", href: "/shoes" },
  { label: "Gear", href: "/gear" },
  { label: "Nutrition", href: "/nutrition" },
  { label: "Races", href: "/races" },
] as const;

// Pill anatomy taken from Frontify's .ff-navbar-trigger:
//   - 14 px / 500 / 21 lh
//   - padding 8 px / 16 px (h-9 = 36 px total)
//   - rounded-full so the hover bg reads as a true pill
//   - hover/focus uses --ds-gray-alpha-200 (theme-aware translucent
//     gray) so the link chip reads as a subtle wash on top of the
//     pill's bg-100 surface — no warmth magic values, no rgba inlines.
//   - `group` so the chevron after the label can react to the link's
//     own hover/focus state
const NAV_LINK_CLASS =
  "group inline-flex h-9 items-center gap-1.5 rounded-full px-4 py-2 text-[14px] leading-[21px] font-medium text-[color:var(--ds-gray-1000)] transition-colors hover:bg-[var(--ds-gray-alpha-200)] focus-visible:bg-[var(--ds-gray-alpha-200)] focus-visible:outline-none";

// Chevron mirrors Frontify's: 16 px, sat next to the label with a 6 px
// gap (the .gap-1.5 on the link covers that), rotates 180° on hover or
// keyboard focus. Same 0.22s ease used in the Frontify reference.
const CHEVRON_CLASS =
  "size-4 transition-transform duration-[220ms] ease-out group-hover:rotate-180 group-focus-visible:rotate-180";

export default function SiteNavigationMenu() {
  return (
    <nav aria-label="Primary" className="flex items-center gap-1">
      {NAV_LINKS.map((link) => (
        <Link key={link.href} href={link.href} className={NAV_LINK_CLASS}>
          {link.label}
          <ChevronDown className={CHEVRON_CLASS} aria-hidden="true" />
        </Link>
      ))}
    </nav>
  );
}
