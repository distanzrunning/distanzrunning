"use client";

import React, { useState, useCallback, useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import RaceCard from "@/components/RaceCard";

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
// Demo data — real raceGuide rows pulled from the production Sanity
// dataset so the cards show realistic race photos and metadata. The
// CDN host is allowed in next.config.ts.
// ============================================================================

const SANITY_CDN = "https://cdn.sanity.io/images/hstgum05/production";

// Convert a Sanity image asset _ref into a CDN URL.
//   image-<hash>-<dims>-<ext>  →  <hash>-<dims>.<ext>
function refToUrl(ref: string): string {
  const stripped = ref.replace(/^image-/, "");
  const lastDash = stripped.lastIndexOf("-");
  const ext = stripped.slice(lastDash + 1);
  const rest = stripped.slice(0, lastDash);
  return `${SANITY_CDN}/${rest}.${ext}`;
}

const demoRaces = [
  {
    href: "/races/berlin-marathon",
    title: "Berlin Marathon",
    eventDate: "2026-09-27T07:00:00.000Z",
    location: "Berlin, Germany",
    category: "Marathon",
    imageUrl: refToUrl(
      "image-70af52946876cf95bb91d515e3f7b243d1af15c1-2048x1365-png",
    ),
    surface: "Road",
    surfaceBreakdown: "100% Paved",
    profile: "flat",
    elevationGain: 73,
    price: 205,
    currency: "EUR",
  },
  {
    href: "/races/chicago-marathon",
    title: "Chicago Marathon",
    eventDate: "2026-10-11T05:20:00.000Z",
    location: "Chicago, Illinois, United States",
    category: "Marathon",
    imageUrl: refToUrl(
      "image-d8ed921320f034af1e6a91020e193408c82eb40f-2048x1365-png",
    ),
    surface: "Road",
    surfaceBreakdown: "100% Paved",
    profile: "flat",
    elevationGain: 74,
    price: 260,
    currency: "USD",
  },
  {
    href: "/races/copenhagen-half-marathon",
    title: "Copenhagen Half Marathon",
    eventDate: "2026-09-20T07:30:00.000Z",
    location: "Copenhagen, Denmark",
    category: "Half Marathon",
    imageUrl: refToUrl(
      "image-40855cc2790c508bce25b00fdef0e8892abffbf0-1024x576-jpg",
    ),
    surface: "Road",
    surfaceBreakdown: "100% Paved",
    profile: "flat",
    elevationGain: 25,
    price: 645,
    currency: "DKK",
  },
  {
    href: "/races/sydney-marathon",
    title: "Sydney Marathon",
    eventDate: "2026-08-30T04:30:00.000Z",
    location: "Sydney, Australia",
    category: "Marathon",
    imageUrl: refToUrl(
      "image-2e94943c73919e427f2dea1062794ff4a7e364fc-2048x1365-png",
    ),
    surface: "Road",
    surfaceBreakdown: "100% Paved",
    profile: "hilly",
    elevationGain: 313,
    price: 330,
    currency: "AUD",
  },
  {
    href: "/races/tcs-amsterdam-marathon",
    title: "Amsterdam Marathon",
    eventDate: "2026-10-18T07:00:00.000Z",
    location: "Amsterdam, Netherlands",
    category: "Marathon",
    imageUrl: refToUrl(
      "image-cfe1a15634688cd41cc2a1fb4a7d26d763a85c36-2000x1333-jpg",
    ),
    surface: "Road",
    surfaceBreakdown: "100% Paved",
    profile: "flat",
    elevationGain: 91,
    price: 145,
    currency: "EUR",
  },
  {
    href: "/races/valencia-half-marathon",
    title: "Valencia Half Marathon",
    eventDate: "2026-10-25T06:32:00.000Z",
    location: "Valencia, Spain",
    category: "Half Marathon",
    imageUrl: refToUrl(
      "image-3dc878af9ce734bb03a14abf4201d15af6c6df00-2550x1108-webp",
    ),
    surface: "Road",
    surfaceBreakdown: "100% Paved",
    profile: "flat",
    elevationGain: 69,
    price: 80,
    currency: "EUR",
  },
];

// ============================================================================
// Code samples
// ============================================================================

const defaultCode = `import RaceCard from "@/components/RaceCard";
import { urlFor } from "@/sanity/lib/image";

// Homepage variant — image with category Badge top-right, body
// stacks title + location with a date pill on the right.
<RaceCard
  href="/races/berlin-marathon"
  title="Berlin Marathon"
  eventDate="2026-09-27T07:00:00.000Z"
  location="Berlin, Germany"
  category="Marathon"
  imageUrl={urlFor(race.mainImage).width(1200).auto("format").url()}
/>`;

const indexVariantCode = `// Index variant — adds a glassy hover overlay over the image
// with three stat columns (Surface / Elevation / Price). Uses
// UnitsContext to format elevation + price per the user's
// preferences (metric vs imperial, target currency).
<RaceCard
  variant="index"
  href="/races/berlin-marathon"
  title="Berlin Marathon"
  eventDate="2026-09-27T07:00:00.000Z"
  location="Berlin, Germany"
  category="Marathon"
  imageUrl={urlFor(race.mainImage).width(1200).auto("format").url()}
  surface="Road"
  surfaceBreakdown="100% Paved"
  profile="flat"
  elevationGain={73}
  price={205}
  currency="EUR"
/>`;

const homepageRowCode = `// Homepage scroll-snap row — 1-up on mobile, 2-up at sm, 3-up
// at lg. Real implementation lives in HomepageRaces.tsx and adds
// chevron chips that fade in on hover.
<div className="snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
  <ul className="flex list-none gap-x-6 p-0">
    {races.map(race => (
      <li
        key={race._id}
        className="w-[85%] shrink-0 snap-start sm:w-[calc(1/2*(100%-1.5rem))] lg:w-[calc(1/3*(100%-1.5rem*2))]"
      >
        <RaceCard
          href={race.href}
          title={race.title}
          eventDate={race.eventDate}
          location={formatLocation(race)}
          category={race.category}
          imageUrl={urlFor(race.mainImage).width(1200).auto("format").url()}
        />
      </li>
    ))}
  </ul>
</div>`;

const indexGridCode = `// /races index page grid — 1 / 2 / 3 columns. Cards top-align
// in their cells, so total heights vary with title length.
<ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
  {races.map(race => (
    <li key={race._id}>
      <RaceCard variant="index" {...race} />
    </li>
  ))}
</ul>`;

const noImageCode = `<RaceCard
  href="/races/example"
  title="Race without a hero image still reads cleanly."
  eventDate="2026-06-15T08:00:00.000Z"
  location="Somewhere, Earth"
  category="10K"
/>`;

// ============================================================================
// Anatomy preview — labelled breakdown of the parts inside one card
// ============================================================================

function AnatomyDemo() {
  const race = demoRaces[0];
  return (
    <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[minmax(280px,420px)_1fr]">
      <RaceCard
        href={race.href}
        title={race.title}
        eventDate={race.eventDate}
        location={race.location}
        category={race.category}
        imageUrl={race.imageUrl}
      />
      <ul
        className="flex flex-col gap-3 text-[13px] leading-[1.5]"
        style={{ color: "var(--ds-gray-900)" }}
      >
        <li>
          <strong style={{ color: "var(--ds-gray-1000)" }}>Image —</strong>{" "}
          16/8.75 cinematic ratio. Starts at scale 104% and settles to
          100% on hover so the photo &quot;sharpens into place.&quot;
        </li>
        <li>
          <strong style={{ color: "var(--ds-gray-1000)" }}>
            Category Badge —
          </strong>{" "}
          inverted Badge ({" "}
          <code>variant=&quot;inverted&quot;</code>) pinned to the
          image&apos;s top-right corner. Dark fill + white text reads
          against any photo.
        </li>
        <li>
          <strong style={{ color: "var(--ds-gray-1000)" }}>Title —</strong>{" "}
          <code>text-heading-20</code>, line-clamped to 2 lines. The
          title&apos;s anchor carries the card-wide click overlay (
          <code>::after</code> spans the whole article).
        </li>
        <li>
          <strong style={{ color: "var(--ds-gray-1000)" }}>Location —</strong>{" "}
          <code>text-copy-14</code>, single-line truncated. Pre-formatted
          by the caller as <code>City, State, Country</code>.
        </li>
        <li>
          <strong style={{ color: "var(--ds-gray-1000)" }}>Date pill —</strong>{" "}
          gray-300 pill at <code>h-7</code> / <code>text-copy-13</code>.
          Formats <code>eventDate</code> as <code>d MMM, yyyy</code>.
          Vertically centered against the title + location stack.
        </li>
      </ul>
    </div>
  );
}

// ============================================================================
// Homepage row demo — mirrors the HomepageRaces.tsx scroll-snap
// pattern in miniature, with chevron buttons modelled on the same
// component.
// ============================================================================

const SCROLL_GAP_PX = 24;

function HomepageRowDemo() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 0);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstItem = el.querySelector<HTMLElement>("[data-scroll-item]");
    const cardStep =
      (firstItem?.offsetWidth ?? el.clientWidth * 0.85) + SCROLL_GAP_PX;
    el.scrollBy({ left: cardStep * dir, behavior: "smooth" });
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Scroll races left"
        onClick={() => scrollByCard(-1)}
        disabled={!canScrollPrev}
        className="absolute left-0 top-1/2 z-20 hidden size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] text-[color:var(--ds-gray-1000)] shadow-sm transition-opacity hover:bg-[color:var(--ds-gray-100)] disabled:pointer-events-none disabled:opacity-0 sm:flex dark:bg-[color:var(--ds-background-200)]"
      >
        <ChevronLeft className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Scroll races right"
        onClick={() => scrollByCard(1)}
        disabled={!canScrollNext}
        className="absolute right-0 top-1/2 z-20 hidden size-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] text-[color:var(--ds-gray-1000)] shadow-sm transition-opacity hover:bg-[color:var(--ds-gray-100)] disabled:pointer-events-none disabled:opacity-0 sm:flex dark:bg-[color:var(--ds-background-200)]"
      >
        <ChevronRight className="size-4" aria-hidden />
      </button>

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="snap-x snap-mandatory scroll-smooth overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex list-none gap-x-6 p-0">
          {demoRaces.map((race) => (
            <li
              key={race.href}
              data-scroll-item
              className="w-[85%] shrink-0 snap-start sm:w-[calc(1/2*(100%-1.5rem))] lg:w-[calc(1/3*(100%-1.5rem*2))]"
            >
              <RaceCard
                href={race.href}
                title={race.title}
                eventDate={race.eventDate}
                location={race.location}
                category={race.category}
                imageUrl={race.imageUrl}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

export default function RaceCardComponent() {
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
          The card used to surface a race guide. A 16/8.75 cinematic
          image carries the inverted category Badge in its top-right
          corner; the body stacks the title + location on the left with
          a gray date pill (<code>d MMM, yyyy</code>) vertically centered
          against the stack on the right. Two visual variants ship the
          same component to two surfaces:
        </p>
        <ul
          className="text-copy-16 text-textSubtle mb-6 list-disc pl-6"
          style={{ lineHeight: 1.6 }}
        >
          <li>
            <strong style={{ color: "var(--ds-gray-1000)" }}>default</strong> —
            homepage &quot;Upcoming races&quot; row. No hover affordance
            beyond the image settle-zoom.
          </li>
          <li>
            <strong style={{ color: "var(--ds-gray-1000)" }}>index</strong> —
            <code> /races</code> grid. Adds a glassy hover overlay over
            the image with three stat columns (Surface / Elevation /
            Price) that fades in on group hover. Outer corners use
            <code> overflow-hidden rounded-md</code> so the hover layer
            clips to the card&apos;s border radius.
          </li>
        </ul>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          Like ArticleCard, image URLs are pre-resolved by the caller —
          pass <code>imageUrl</code> as a string. Sanity callers run{" "}
          <code>urlFor(...)</code> at the data layer.
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
          Five parts make up the default card: image, category Badge,
          title, location, date pill.
        </p>
        <CodePreview componentCode={defaultCode}>
          <AnatomyDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="homepage-row" onCopyLink={showToast}>
          Homepage row (default variant)
        </SectionHeader>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          The homepage &quot;Upcoming races&quot; section drops the
          default-variant card into a horizontal scroll-snap row — 1-up
          on mobile (with a peek of the next), 2-up at <code>sm</code>,
          3-up at <code>lg</code>. Trackpad horizontal swipes scroll
          natively; desktop users get hover-revealed chevron chips on
          either edge.
        </p>
        <CodePreview componentCode={homepageRowCode}>
          <HomepageRowDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="index-grid" onCopyLink={showToast}>
          Index grid (index variant)
        </SectionHeader>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          The <code>/races</code> page renders the index variant in a 1
          / 2 / 3 column responsive grid. Hover any card below to see the
          glassy stat overlay fade in over the image. The overlay uses{" "}
          <code>backdrop-filter: blur(12px) brightness(0.8)
          contrast(1.1)</code> so the photo remains legible underneath.
        </p>
        <CodePreview componentCode={indexGridCode}>
          <ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {demoRaces.slice(0, 3).map((race) => (
              <li key={race.href}>
                <RaceCard
                  variant="index"
                  href={race.href}
                  title={race.title}
                  eventDate={race.eventDate}
                  location={race.location}
                  category={race.category}
                  imageUrl={race.imageUrl}
                  surface={race.surface}
                  surfaceBreakdown={race.surfaceBreakdown}
                  profile={race.profile}
                  elevationGain={race.elevationGain}
                  price={race.price}
                  currency={race.currency}
                />
              </li>
            ))}
          </ul>
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="hover-overlay" onCopyLink={showToast}>
          Hover overlay (index variant)
        </SectionHeader>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          Three stat columns appear on hover when the card is in the
          index variant and the relevant fields are present:
        </p>
        <ul
          className="text-copy-16 text-textSubtle mb-6 list-disc pl-6"
          style={{ lineHeight: 1.6 }}
        >
          <li>
            <strong style={{ color: "var(--ds-gray-1000)" }}>Surface —</strong>{" "}
            value from <code>surface</code>; <code>surfaceBreakdown</code>{" "}
            shows beneath as the detail line.
          </li>
          <li>
            <strong style={{ color: "var(--ds-gray-1000)" }}>
              Elevation —
            </strong>{" "}
            <code>profile</code> (Flat / Rolling / Hilly) is the headline;{" "}
            <code>elevationGain</code> is the detail. Formatting respects
            the visitor&apos;s metric / imperial preference via{" "}
            <code>UnitsContext</code>.
          </li>
          <li>
            <strong style={{ color: "var(--ds-gray-1000)" }}>Price —</strong>{" "}
            converted to the visitor&apos;s preferred display currency
            (or kept in the source currency when set to{" "}
            <code>local</code>) via <code>convertCurrencySync</code>.
          </li>
        </ul>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          Hover the card below to see the overlay fade in (300 ms).
        </p>
        <CodePreview componentCode={indexVariantCode}>
          <div className="max-w-[420px]">
            <RaceCard
              variant="index"
              href={demoRaces[0].href}
              title={demoRaces[0].title}
              eventDate={demoRaces[0].eventDate}
              location={demoRaces[0].location}
              category={demoRaces[0].category}
              imageUrl={demoRaces[0].imageUrl}
              surface={demoRaces[0].surface}
              surfaceBreakdown={demoRaces[0].surfaceBreakdown}
              profile={demoRaces[0].profile}
              elevationGain={demoRaces[0].elevationGain}
              price={demoRaces[0].price}
              currency={demoRaces[0].currency}
            />
          </div>
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="no-image" onCopyLink={showToast}>
          Without an image
        </SectionHeader>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          When <code>imageUrl</code> is omitted, the image box keeps its
          16/8.75 ratio and shows the gray-100 placeholder so the row
          stays aligned. The category Badge still renders if{" "}
          <code>category</code> is set.
        </p>
        <CodePreview componentCode={noImageCode}>
          <div className="max-w-[420px]">
            <RaceCard
              href="/races/example"
              title="Race without a hero image still reads cleanly."
              eventDate="2026-06-15T08:00:00.000Z"
              location="Somewhere, Earth"
              category="10K"
            />
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
                <td className="py-3 pr-4 font-mono">href</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">—</td>
                <td className="py-3 px-4">
                  Race guide URL. Becomes the title link and the
                  card-wide click overlay.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">title</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">—</td>
                <td className="py-3 px-4">
                  Race name. Clamped to 2 lines.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">eventDate</td>
                <td className="py-3 px-4 font-mono">string (ISO)</td>
                <td className="py-3 px-4 font-mono">undefined</td>
                <td className="py-3 px-4">
                  ISO date. Formatted as <code>d MMM, yyyy</code>; the
                  date pill is omitted when invalid or empty.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">location</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">undefined</td>
                <td className="py-3 px-4">
                  Pre-formatted location string (e.g.{" "}
                  <code>Tokyo, Japan</code>).
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">category</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">undefined</td>
                <td className="py-3 px-4">
                  Race category (Marathon / Half Marathon / 10K). Renders
                  as the inverted Badge in the image&apos;s top-right
                  corner.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">imageUrl</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">undefined</td>
                <td className="py-3 px-4">
                  Pre-resolved image URL. Without it the box shows a
                  gray-100 placeholder.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">imageAlt</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">title</td>
                <td className="py-3 px-4">
                  Override the alt text when the image conveys something
                  different from the title.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">priority</td>
                <td className="py-3 px-4 font-mono">boolean</td>
                <td className="py-3 px-4 font-mono">false</td>
                <td className="py-3 px-4">
                  Mark above-the-fold cards as priority — disables the
                  next/image lazy-load.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">variant</td>
                <td className="py-3 px-4 font-mono">
                  &quot;default&quot; | &quot;index&quot;
                </td>
                <td className="py-3 px-4 font-mono">
                  &quot;default&quot;
                </td>
                <td className="py-3 px-4">
                  <code>default</code> is the homepage row; <code>index</code>{" "}
                  enables the glassy hover overlay used on{" "}
                  <code>/races</code>.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">surface</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">undefined</td>
                <td className="py-3 px-4">
                  Index variant only. Headline of the Surface stat column
                  in the hover overlay.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">surfaceBreakdown</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">undefined</td>
                <td className="py-3 px-4">
                  Index variant only. Detail line under the Surface
                  headline (e.g. <code>100% Paved</code>).
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">profile</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">undefined</td>
                <td className="py-3 px-4">
                  Index variant only. Course profile (
                  <code>flat</code> / <code>rolling</code> /{" "}
                  <code>hilly</code>) — title-cased for display.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">elevationGain</td>
                <td className="py-3 px-4 font-mono">number</td>
                <td className="py-3 px-4 font-mono">undefined</td>
                <td className="py-3 px-4">
                  Index variant only. In metres. Formatted via{" "}
                  <code>formatElevation</code> per the visitor&apos;s
                  unit preference.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">price</td>
                <td className="py-3 px-4 font-mono">number</td>
                <td className="py-3 px-4 font-mono">undefined</td>
                <td className="py-3 px-4">
                  Index variant only. Entry fee in <code>currency</code>.
                  Converted via <code>convertCurrencySync</code> to the
                  visitor&apos;s preferred display currency.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">currency</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">undefined</td>
                <td className="py-3 px-4">
                  ISO currency code paired with <code>price</code> (e.g.{" "}
                  <code>EUR</code>, <code>USD</code>, <code>GBP</code>).
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono">className</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">&quot;&quot;</td>
                <td className="py-3 px-4">
                  Extra classes appended to the outer{" "}
                  <code>&lt;article&gt;</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />
    </>
  );
}
