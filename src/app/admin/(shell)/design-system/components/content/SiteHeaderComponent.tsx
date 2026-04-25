"use client";

import React, { useState, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import {
  TbRoad,
  TbArrowCapsule,
  TbMountain,
  TbFlag,
  TbCalendar,
  TbCloud,
  TbStopwatch,
} from "react-icons/tb";
import { ArrowRight } from "lucide-react";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import Skeleton from "@/components/ui/Skeleton";
import SiteHeader from "@/components/ui/SiteHeader";

// ============================================================================
// Toast (local copy of the shared pattern used on other DS pages)
// ============================================================================

function Toast({
  message,
  isVisible,
  onDismiss,
}: {
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
}) {
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <div
        className="material-menu flex items-center gap-3 px-4 py-3"
        role="status"
        aria-live="polite"
      >
        <span className="text-sm text-textDefault">{message}</span>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss toast"
          className="p-1 rounded hover:bg-[var(--ds-gray-100)] transition-colors"
        >
          <svg height="16" viewBox="0 0 16 16" width="16">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showToast = useCallback((message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, isVisible: true });
    toastTimeoutRef.current = setTimeout(
      () => setToast((p) => ({ ...p, isVisible: false })),
      2000,
    );
  }, []);
  const dismissToast = useCallback(() => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast((p) => ({ ...p, isVisible: false }));
  }, []);
  return { toast, showToast, dismissToast };
}

// ============================================================================
// Section header (shared local pattern)
// ============================================================================

const HEADER_HEIGHT = 112;
const SECTION_PADDING = 48;

function LinkIcon() {
  return (
    <svg
      height="16"
      viewBox="0 0 16 16"
      width="16"
      style={{ width: 14, height: 14, color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.46968 1.46968C10.1433 -0.203925 12.8567 -0.203923 14.5303 1.46968C16.2039 3.14329 16.2039 5.85674 14.5303 7.53034L12.0303 10.0303L10.9697 8.96968L13.4697 6.46968C14.5575 5.38186 14.5575 3.61816 13.4697 2.53034C12.3819 1.44252 10.6182 1.44252 9.53034 2.53034L7.03034 5.03034L5.96968 3.96968L8.46968 1.46968ZM11.5303 5.53034L5.53034 11.5303L4.46968 10.4697L10.4697 4.46968L11.5303 5.53034ZM1.46968 14.5303C3.14329 16.2039 5.85673 16.204 7.53034 14.5303L10.0303 12.0303L8.96968 10.9697L6.46968 13.4697C5.38186 14.5575 3.61816 14.5575 2.53034 13.4697C1.44252 12.3819 1.44252 10.6182 2.53034 9.53034L5.03034 7.03034L3.96968 5.96968L1.46968 8.46968C-0.203923 10.1433 -0.203925 12.8567 1.46968 14.5303Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SectionHeader({
  id,
  children,
  onCopyLink,
}: {
  id: string;
  children: React.ReactNode;
  onCopyLink?: (message: string) => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    onCopyLink?.("Copied link to clipboard");
    window.history.pushState(null, "", `#${id}`);
    const element = document.getElementById(id);
    if (element) {
      const rect = element.getBoundingClientRect();
      window.scrollTo({
        top: rect.top + window.scrollY - HEADER_HEIGHT - SECTION_PADDING,
        behavior: "smooth",
      });
    }
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative -ml-5 inline-block pl-5 no-underline outline-none text-inherit text-left cursor-pointer bg-transparent border-none"
      id={id}
      style={{ scrollMarginTop: 32 }}
    >
      <h2 className="text-[24px] leading-[1.2] font-semibold text-textDefault">
        <div className="absolute left-0 top-[8px] opacity-0 outline-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
          <LinkIcon />
        </div>
        {children}
      </h2>
    </button>
  );
}

// ============================================================================
// Code preview (shared pattern)
// ============================================================================

function RenderShikiToken({ token }: { token: DualThemeToken }) {
  const style = getTokenStyle(token);
  return <span style={style}>{token.content}</span>;
}

function CopyIconButton({ copied }: { copied: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ color: "currentcolor" }}
    >
      {copied ? (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"
          fill="currentColor"
        />
      ) : (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}

function CodePreview({
  children,
  componentCode,
}: {
  children: React.ReactNode;
  componentCode: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const tokenized = useShikiHighlighter(componentCode, "tsx");
  const lines: DualThemeToken[][] =
    tokenized ||
    componentCode
      .split("\n")
      .map(
        (line) =>
          [
            {
              content: line,
              color: "var(--ds-gray-1000)",
              darkColor: "var(--ds-gray-1000)",
            },
          ] as DualThemeToken[],
      );
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(componentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [componentCode]);
  return (
    <div className="border border-[var(--ds-gray-400)] rounded-lg">
      <div
        className="p-6 rounded-t-lg"
        style={{ background: "var(--ds-background-100)" }}
      >
        {children}
      </div>
      <div
        className="rounded-b-lg overflow-hidden"
        style={{ background: "var(--ds-background-200)" }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-textDefault border-t border-[var(--ds-gray-400)]"
        >
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>
        {isOpen && (
          <div
            className="border-t border-[var(--ds-gray-400)] overflow-x-auto font-mono text-[13px]"
            style={{ background: "var(--ds-background-100)" }}
          >
            <div className="relative group">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded border border-[var(--ds-gray-400)] opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-[var(--ds-background-200)] hover:bg-[var(--ds-gray-100)]"
                aria-label="Copy code"
              >
                <CopyIconButton copied={copied} />
              </button>
              <pre className="overflow-x-auto py-4" data-code-block>
                <code className="block text-[13px] leading-[20px] font-mono">
                  {lines.map((lineTokens, index) => (
                    <div
                      key={index}
                      className="flex px-4"
                      style={{ fontFeatureSettings: '"liga" off' }}
                    >
                      <span className="select-none w-[32px] min-w-[32px] text-right pr-4 text-textSubtler">
                        {index + 1}
                      </span>
                      <span className="flex-1 pr-4">
                        {lineTokens.map((token, i) => (
                          <RenderShikiToken key={i} token={token} />
                        ))}
                        {lineTokens.length === 0 && " "}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Mock data — featured items use mainImage=null so the live SiteHeader's
// FeaturedCard naturally falls back to its placeholder background.
// (Sanity images are wired through SiteHeaderWrapper in production.)
// ============================================================================

const mockFeatured = {
  title: "Berlin is the fastest marathon in the world",
  slug: { current: "berlin-marathon-2026" },
  mainImage: null,
  excerpt: "",
};

const mockRace = {
  title: "Berlin Marathon 2026",
  slug: { current: "berlin-marathon-2026" },
  mainImage: null,
  eventDate: "2026-09-27",
  location: "Berlin, Germany",
};

// ============================================================================
// Header in the page — live SiteHeader rendered as it ships, with mock
// featured props. Hover any trigger to see the live dropdown menu.
// ============================================================================

function HeaderInPagePreview() {
  return (
    // Outer wrapper sets a high stacking context so when the dropdown
    // viewport opens (z-50 relative to its own stacking context), it
    // sits above any DS page content below — Section dividers, the
    // CodePreview's "Show code" toggle, the next Section, etc.
    <div className="w-full" style={{ position: "relative", zIndex: 100 }}>
      <div
        className="w-full"
        style={{
          background: "var(--ds-background-100)",
          border: "1px solid var(--ds-gray-400)",
          borderRadius: 6,
          minHeight: 60,
          overflow: "visible",
        }}
      >
        <SiteHeader
          featuredNews={mockFeatured}
          featuredShoe={mockFeatured}
          featuredGear={mockFeatured}
          featuredNutrition={mockFeatured}
          featuredRace={mockRace}
          newsletterSource="design-system"
        />
      </div>
    </div>
  );
}

// ============================================================================
// Anatomy — static SVG-style breakdown of the bar's three zones.
// ============================================================================

function HeaderAnatomy() {
  return (
    <div
      className="flex w-full items-center justify-between px-3"
      style={{
        height: 50,
        background: "var(--ds-background-100)",
        border: "1px solid var(--ds-gray-400)",
        borderRadius: 6,
      }}
    >
      <Zone label="Wordmark" />
      <Zone label="Primary nav (centred)" wide />
      <Zone label="Actions (newsletter, theme)" />
    </div>
  );
}

function Zone({ label, wide }: { label: string; wide?: boolean }) {
  return (
    <div
      className="flex h-8 items-center justify-center px-3"
      style={{
        background: "var(--ds-gray-100)",
        border: "1px dashed var(--ds-gray-400)",
        borderRadius: 6,
        color: "var(--ds-gray-700)",
        fontSize: 11,
        fontFamily: "var(--font-mono)",
        minWidth: wide ? 320 : 160,
      }}
    >
      {label}
    </div>
  );
}

// ============================================================================
// Dropdown anatomy — replicates the open dropdown panel layout so we
// can show Skeleton in the featured image slot without modifying the
// production SiteNavigationMenu. Mirrors DropdownPanel's grid / column
// styles; trigger labels are static strings.
// ============================================================================

const demoLinks = [
  {
    label: "Race-Day",
    description: "Built for PR days",
    Icon: TbFlag,
  },
  {
    label: "Daily Trainers",
    description: "Your go-to runners",
    Icon: TbCalendar,
  },
  {
    label: "Max Cushion",
    description: "Plush for long miles",
    Icon: TbCloud,
  },
  {
    label: "Tempo",
    description: "Responsive and fast",
    Icon: TbStopwatch,
  },
  {
    label: "Trail",
    description: "Off-road traction",
    Icon: TbMountain,
  },
];

function DropdownAnatomy() {
  return (
    <div
      className="grid w-full max-w-[800px] grid-cols-3 overflow-hidden border border-[color:var(--ds-gray-400)]"
      style={{ borderRadius: 12, minHeight: 360 }}
    >
      {/* Links column */}
      <div className="col-span-1 flex flex-col gap-0.5 border-r border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-200)] p-2 dark:bg-[color:var(--ds-background-100)]">
        <h4 className="px-3 pt-2.5 pb-1 text-[14px] leading-5 font-normal text-[color:var(--ds-gray-900)]">
          Shoes
        </h4>
        {demoLinks.map((item) => (
          <DemoIconRow key={item.label} item={item} />
        ))}
      </div>

      {/* Featured column with Skeleton in the image slot */}
      <div className="col-span-2 bg-[color:var(--ds-background-100)] p-4 dark:bg-[color:var(--ds-background-200)]">
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          {/* Skeleton stands in for the Sanity-loaded image */}
          <Skeleton
            width="100%"
            height="100%"
            shape="squared"
            className="absolute inset-0"
            style={{ borderRadius: 12 }}
          />

          {/* Top-down scrim + overlay caption — same as the real
              FeaturedCard so the structure matches */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0) 65%)",
              borderRadius: 12,
            }}
          />
          <div className="absolute inset-x-0 top-0 flex items-start gap-3 p-5">
            <div className="min-w-0 flex-1">
              <span className="text-[14px] leading-5 font-medium text-white/90">
                Featured
              </span>
              <h3
                className="mt-1 text-[20px] leading-[24px] font-[550] text-white"
                style={{ letterSpacing: "-0.005em" }}
              >
                Berlin is the fastest marathon in the world
              </h3>
            </div>
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md"
            >
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoIconRow({
  item,
}: {
  item: { label: string; description: string; Icon: React.ComponentType<{ className?: string }> };
}) {
  const { label, description, Icon } = item;
  return (
    <div className="group/row flex flex-row items-center gap-3 rounded-sm p-3">
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-xs border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] text-[color:var(--ds-gray-900)]"
      >
        <Icon className="size-5 stroke-[1.5]" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[14px] leading-5 font-medium text-[color:var(--ds-gray-1000)]">
          {label}
        </span>
        <span className="text-[12px] leading-4 text-[color:var(--ds-gray-900)]">
          {description}
        </span>
      </span>
    </div>
  );
}

// ============================================================================
// Code samples
// ============================================================================

const usageCode = `import SiteHeader from '@/components/ui/SiteHeader';
import { sanityFetch } from '@/sanity/lib/live';
import {
  featuredShoeProductQuery,
  featuredGearProductQuery,
  featuredNutritionProductQuery,
} from '@/sanity/queries/featuredProductQueries';
import { featuredNewsQuery } from '@/sanity/queries/featuredNewsQuery';
import { featuredRaceQuery } from '@/sanity/queries/featuredRaceQuery';

export default async function SiteHeaderWrapper() {
  const [news, shoe, gear, nutrition, race] = await Promise.all([
    sanityFetch({ query: featuredNewsQuery }),
    sanityFetch({ query: featuredShoeProductQuery }),
    sanityFetch({ query: featuredGearProductQuery }),
    sanityFetch({ query: featuredNutritionProductQuery }),
    sanityFetch({ query: featuredRaceQuery }),
  ]);

  return (
    <SiteHeader
      featuredNews={news.data}
      featuredShoe={shoe.data}
      featuredGear={gear.data}
      featuredNutrition={nutrition.data}
      featuredRace={race.data}
    />
  );
}`;

// ============================================================================
// Main
// ============================================================================

export default function SiteHeaderComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Section>
        <SectionHeader id="overview" onCopyLink={showToast}>
          Overview
        </SectionHeader>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          The 50 px sticky bar that sits above <code>PageFrame</code> on the
          public site. Three horizontal zones: the wordmark on the left, the
          primary navigation centred, and the action row (newsletter trigger
          + theme switcher) on the right. Modelled on{" "}
          <a
            href="https://v0.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--ds-gray-1000)",
              textDecoration: "underline",
            }}
          >
            v0.app
          </a>
          &apos;s chat header anatomy, translated to our DS tokens.
        </p>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          The centred nav is built on Radix NavigationMenu via
          <code>SiteNavigationMenu</code> — five triggers (News, Shoes, Gear,
          Nutrition, Races), each opening a two-column dropdown with category
          rows on the left and a featured Sanity-loaded card on the right.
        </p>
      </Section>

      <Section>
        <SectionHeader id="anatomy" onCopyLink={showToast}>
          Anatomy
        </SectionHeader>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          Three zones inside a 50 px-tall bar with 12 px horizontal padding.
          The centre zone is absolutely positioned across the bar so it
          stays geometrically centred regardless of the wordmark and action
          row widths.
        </p>
        <CodePreview componentCode={usageCode}>
          <HeaderAnatomy />
        </CodePreview>
      </Section>

      {/* Note: this section deliberately bypasses <Section /> because
          Section wraps children in a GridCell with position:relative
          + z-index:2, which creates a stacking context that traps the
          live dropdown viewport at z=2 in the page root — sibling
          Sections (also z=2) painted later in DOM then cover it. By
          rendering bare, the inner z-index 100 wrapper around the
          SiteHeader sits at z=100 in the page root and the dropdown
          paints above everything below. */}
      <div
        style={{
          padding: 48,
          borderBottom: "1px solid var(--ds-gray-400)",
        }}
      >
        <SectionHeader id="header-in-page" onCopyLink={showToast}>
          Header in the page
        </SectionHeader>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          Live <code>SiteHeader</code> rendered with mock featured props.
          Hover any trigger to open its dropdown — featured images aren&apos;t
          loaded here, so the cards fall back to the placeholder surface.
        </p>
        <CodePreview componentCode={usageCode}>
          <HeaderInPagePreview />
        </CodePreview>
      </div>

      <Section>
        <SectionHeader id="dropdown-anatomy" onCopyLink={showToast}>
          Dropdown anatomy
        </SectionHeader>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          800 px wide grid split 1:2 — links column on the left
          (background-200 in light, background-100 in dark), full-bleed
          featured card on the right (the surfaces flip in dark mode so
          contrast reads correctly in both). The grid is locked to a 360 px
          minimum height so every section&apos;s featured image renders at
          the same size, regardless of how many link rows that section has.
        </p>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          The featured image is loaded from Sanity at the page edge —
          here it&apos;s drawn as a <code>Skeleton</code> to mark where
          that content sits.
        </p>
        <CodePreview componentCode={usageCode}>
          <div className="flex w-full justify-center">
            <DropdownAnatomy />
          </div>
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="props" onCopyLink={showToast}>
          Props
        </SectionHeader>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Prop
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Default
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">featuredNews</td>
                <td className="py-3 px-4 font-mono">FeaturedProduct</td>
                <td className="py-3 px-4 font-mono">—</td>
                <td className="py-3 px-4">
                  Featured post for the News dropdown. Sourced from
                  <code>featuredNewsQuery</code> (latest road/track/trail
                  post flagged <code>featuredPost</code>).
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">featuredShoe</td>
                <td className="py-3 px-4 font-mono">FeaturedProduct</td>
                <td className="py-3 px-4 font-mono">—</td>
                <td className="py-3 px-4">
                  Featured product post for the Shoes dropdown
                  (<code>section == &quot;shoes&quot;</code>).
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">featuredGear</td>
                <td className="py-3 px-4 font-mono">FeaturedProduct</td>
                <td className="py-3 px-4 font-mono">—</td>
                <td className="py-3 px-4">
                  Featured product post for the Gear dropdown
                  (<code>section == &quot;gear&quot;</code>).
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">featuredNutrition</td>
                <td className="py-3 px-4 font-mono">FeaturedProduct</td>
                <td className="py-3 px-4 font-mono">—</td>
                <td className="py-3 px-4">
                  Featured product post for the Nutrition dropdown
                  (<code>section == &quot;nutrition&quot;</code>).
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">featuredRace</td>
                <td className="py-3 px-4 font-mono">FeaturedRace</td>
                <td className="py-3 px-4 font-mono">—</td>
                <td className="py-3 px-4">
                  Featured race guide for the Races dropdown
                  (<code>raceGuide</code> with <code>featuredRace</code>).
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono">newsletterSource</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">
                  &quot;site_header&quot;
                </td>
                <td className="py-3 px-4">
                  Source label sent to PostHog when the right-side
                  newsletter trigger is clicked.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          <code>FeaturedProduct</code> shape:
          <code>
            {" "}
            {"{ title, slug: { current }, mainImage?, excerpt? } | null"}
          </code>
          .{" "}
          <code>FeaturedRace</code> adds <code>eventDate</code> and{" "}
          <code>location</code>. All featured props accept <code>null</code>
          — the corresponding dropdown then renders without a card.
        </p>
      </Section>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />
    </>
  );
}
