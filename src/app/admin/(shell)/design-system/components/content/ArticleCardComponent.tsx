"use client";

import React, { useState, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import ArticleCard from "@/components/ArticleCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";

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
// Demo data — three real Sanity assets so the cards show realistic
// editorial content. The CDN host is allowed in next.config.ts.
// ============================================================================

const SANITY_CDN = "https://cdn.sanity.io/images/hstgum05/production";

const demoCards = [
  {
    href: "/articles/triathlon-champ-alex-yee-become-second-fastest-brit-in-the-marathon",
    title: "Triathlon champ Alex Yee becomes second fastest Brit in the Marathon",
    publishedAt: "2025-12-07T11:44:00.000Z",
    kicker: "Road",
    kickerHref: "/articles/road",
    excerpt:
      "Olympic triathlon champion Alex Yee runs the second-fastest marathon by a Briton, only behind Sir Mo Farah.",
    imageUrl: `${SANITY_CDN}/710da4b02149e4fcb3d44da6ce4c4102a31e77be-1200x675.png`,
  },
  {
    href: "/articles/femke-bol-switches-to-800m",
    title: "Femke Bol switches to 800m for showdown with Hodgkinson",
    publishedAt: "2025-11-13T22:28:00.000Z",
    kicker: "Track",
    kickerHref: "/articles/track",
    excerpt:
      "Dutch superstar and two-time 400m hurdles world champion Femke Bol announces she will switch events for the 2026 season.",
    imageUrl: `${SANITY_CDN}/6c82ba8b1d507472d499fbd928248eb9c77bd950-1200x675.png`,
  },
  {
    href: "/articles/la-2028-olympics-to-open-with-a-bang",
    title: "LA 2028 Olympics to open with a bang",
    publishedAt: "2026-02-04T09:10:00.000Z",
    kicker: "Olympics",
    kickerHref: "/articles/olympics",
    excerpt:
      "The 2028 Los Angeles Olympics will open with the men's and women's marathons on day one — a first for the modern Games.",
    imageUrl: `${SANITY_CDN}/cb830b49db7551af30919d34a0147e82254b2681-1200x675.png`,
  },
  {
    href: "/articles/chepngetich-banned",
    title: "Women's marathon record holder Chepngetich banned for three years",
    publishedAt: "2025-11-13T21:41:00.000Z",
    kicker: "Road",
    kickerHref: "/articles/road",
    excerpt:
      "Women's marathon world record holder Ruth Chepngetich has been banned for three years after admitting to anti-doping rule violations.",
    imageUrl: `${SANITY_CDN}/710da4b02149e4fcb3d44da6ce4c4102a31e77be-1200x675.png`,
  },
  {
    href: "/articles/tokyo-marathon-preview",
    title: "Tokyo Marathon course preview — and the four runners to watch",
    publishedAt: "2026-02-26T08:00:00.000Z",
    kicker: "Road",
    kickerHref: "/articles/road",
    excerpt:
      "A flat, fast course in late winter weather has produced six course records in the past decade. Here's the line-up that could break it again.",
    imageUrl: `${SANITY_CDN}/cb830b49db7551af30919d34a0147e82254b2681-1200x675.png`,
  },
];

// ============================================================================
// Code samples
// ============================================================================

const defaultCode = `import ArticleCard from "@/components/ArticleCard";
import { urlFor } from "@/sanity/lib/image";

<ArticleCard
  href="/articles/some-slug"
  title="Triathlon champ Alex Yee becomes second fastest Brit in the Marathon"
  publishedAt="2025-12-07T11:44:00.000Z"
  kicker="Road"
  kickerHref="/articles/road"
  excerpt="Olympic triathlon champion Alex Yee runs the second-fastest marathon by a Briton, only behind Sir Mo Farah."
  imageUrl={urlFor(post.mainImage).width(1200).auto("format").url()}
  blurDataURL={urlFor(post.mainImage).width(16).height(9).blur(20).auto("format").url()}
/>`;

const noImageCode = `<ArticleCard
  href="/articles/some-slug"
  title="An editorial without a hero image still reads cleanly."
  publishedAt="2026-04-12T10:00:00.000Z"
  kicker="Opinion"
  kickerHref="/articles/opinion"
  excerpt="When the image is omitted, the empty image box keeps its 16:8.75 ratio and shows the gray-100 placeholder so the row stays aligned."
/>`;

const plainKickerCode = `// Without kickerHref the kicker renders as plain text — useful when
// the section doesn't have a category landing page (race guides etc).
<ArticleCard
  href="/races/tokyo-marathon"
  title="Tokyo Marathon Guide"
  publishedAt="2026-03-01T00:00:00.000Z"
  kicker="Race Guide"
  imageUrl={...}
/>`;

const rowCode = `<div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-y-12">
  {items.map(item => (
    <ArticleCard key={item._id} {...item} />
  ))}
</div>

// 4-up row: just bump the column count
<div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-12">
  {items.map(item => (
    <ArticleCard key={item._id} {...item} />
  ))}
</div>`;

const scrollRowCode = `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";

// "group/row" surfaces the chevrons on hover anywhere over the row.
<Carousel
  opts={{ align: "start" }}
  className="group/row relative w-full"
>
  <CarouselContent>
    {items.map(item => (
      <CarouselItem
        key={item._id}
        className="basis-[85%] sm:basis-1/2 lg:basis-1/3"
      >
        <ArticleCard {...item} />
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious className="opacity-0 transition-opacity group-hover/row:opacity-100" />
  <CarouselNext className="opacity-0 transition-opacity group-hover/row:opacity-100" />
</Carousel>`;

// ============================================================================
// Anatomy preview — labelled breakdown of the parts inside one card
// ============================================================================

function AnatomyDemo() {
  const card = demoCards[0];
  return (
    <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[minmax(280px,420px)_1fr]">
      <ArticleCard
        href={card.href}
        title={card.title}
        publishedAt={card.publishedAt}
        kicker={card.kicker}
        kickerHref={card.kickerHref}
        excerpt={card.excerpt}
        imageUrl={card.imageUrl}
      />
      <ul
        className="flex flex-col gap-3 text-[13px] leading-[1.5]"
        style={{ color: "var(--ds-gray-900)" }}
      >
        <li>
          <strong style={{ color: "var(--ds-gray-1000)" }}>Image —</strong>{" "}
          16/8.75 cinematic ratio, rounded-md, starts at scale 104% and
          settles to 100% on hover (image visually &quot;sharpens into
          place&quot;).
        </li>
        <li>
          <strong style={{ color: "var(--ds-gray-1000)" }}>Kicker —</strong>{" "}
          11 px medium label. Becomes a clickable link when{" "}
          <code>kickerHref</code> is set; falls back to a plain span
          otherwise.
        </li>
        <li>
          <strong style={{ color: "var(--ds-gray-1000)" }}>Date —</strong>{" "}
          formatted as <code>d MMM yyyy</code>. Sits after the kicker with
          a faint dot separator.
        </li>
        <li>
          <strong style={{ color: "var(--ds-gray-1000)" }}>Title —</strong>{" "}
          19 px semibold, clamped to 2 lines on mobile and 3 on{" "}
          <code>md+</code>. The title&apos;s anchor carries the
          card-wide click overlay (<code>::after</code> spans the whole
          article).
        </li>
        <li>
          <strong style={{ color: "var(--ds-gray-1000)" }}>Excerpt —</strong>{" "}
          15 px medium, clamped to 2 lines, capped at{" "}
          <code>max-w-3xl</code>.
        </li>
      </ul>
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

export default function ArticleCardComponent() {
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
          The editorial card used in homepage rows (Breaking News, etc.)
          and section listings. Modelled on Quartr&apos;s article card —
          cinematic image, kicker · date meta row, clamped title, two-line
          excerpt. Uses the &quot;card-with-overlay-link&quot; pattern so the
          whole surface stays clickable while the kicker carries its own
          link to the category landing page.
        </p>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          Image URLs are pre-resolved by the caller — pass
          <code> imageUrl</code> (and optionally{" "}
          <code>blurDataURL</code>) as strings. Sanity callers run{" "}
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
          Five parts stack vertically: image, kicker · date meta row,
          title, excerpt.
        </p>
        <CodePreview componentCode={defaultCode}>
          <AnatomyDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="row" onCopyLink={showToast}>
          In a row
        </SectionHeader>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          Drop the card into a CSS grid. The canonical homepage layout
          is three cards on <code>md+</code>, but the column count is
          just a Tailwind class — bump it to{" "}
          <code>md:grid-cols-2</code>, <code>lg:grid-cols-4</code>, etc.
          to suit the section. Cards top-align in their cells, so total
          heights vary with title length.
        </p>
        <CodePreview componentCode={rowCode}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-y-12">
            {demoCards.slice(0, 3).map((card) => (
              <ArticleCard
                key={card.href}
                href={card.href}
                title={card.title}
                publishedAt={card.publishedAt}
                kicker={card.kicker}
                kickerHref={card.kickerHref}
                excerpt={card.excerpt}
                imageUrl={card.imageUrl}
              />
            ))}
          </div>
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="scrollable-row" onCopyLink={showToast}>
          Scrollable row
        </SectionHeader>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          When the row carries more items than the viewport can show,
          drop the cards into the shared{" "}
          <code>&lt;Carousel /&gt;</code> primitive (Embla under the
          hood) instead of a grid. Each card becomes a{" "}
          <code>CarouselItem</code> with a responsive{" "}
          <code>basis-*</code>: ~1 card on mobile (with a peek of the
          next), 2 on small tablets, 3 on desktop. Hover-only chevron
          chips appear on hover; mobile users get native swipe / drag.
          This is the same pattern the homepage Breaking News row falls
          back to when more than three articles are curated.
        </p>
        <CodePreview componentCode={scrollRowCode}>
          <Carousel
            opts={{ align: "start" }}
            className="group/row relative w-full"
          >
            <CarouselContent>
              {demoCards.map((card) => (
                <CarouselItem
                  key={card.href}
                  className="basis-[85%] sm:basis-1/2 lg:basis-1/3"
                >
                  <ArticleCard
                    href={card.href}
                    title={card.title}
                    publishedAt={card.publishedAt}
                    kicker={card.kicker}
                    kickerHref={card.kickerHref}
                    excerpt={card.excerpt}
                    imageUrl={card.imageUrl}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="opacity-0 transition-opacity group-hover/row:opacity-100 disabled:opacity-0" />
            <CarouselNext className="opacity-0 transition-opacity group-hover/row:opacity-100 disabled:opacity-0" />
          </Carousel>
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
          16/8.75 ratio and shows a gray-100 placeholder so the column
          alignment doesn&apos;t collapse.
        </p>
        <CodePreview componentCode={noImageCode}>
          <div className="max-w-[420px]">
            <ArticleCard
              href="/articles/no-image-example"
              title="An editorial without a hero image still reads cleanly."
              publishedAt="2026-04-12T10:00:00.000Z"
              kicker="Opinion"
              kickerHref="/articles/opinion"
              excerpt="When the image is omitted, the empty box keeps its 16:8.75 ratio and shows the gray-100 placeholder so the row stays aligned."
            />
          </div>
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="plain-kicker" onCopyLink={showToast}>
          Plain kicker (no link)
        </SectionHeader>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          Drop <code>kickerHref</code> and the kicker renders as a plain{" "}
          <code>&lt;span&gt;</code> — appropriate when there&apos;s no
          landing page for the category (e.g. Race Guides where the
          kicker is just a label).
        </p>
        <CodePreview componentCode={plainKickerCode}>
          <div className="max-w-[420px]">
            <ArticleCard
              href="/races/tokyo-marathon"
              title="Tokyo Marathon Guide"
              publishedAt="2026-03-01T00:00:00.000Z"
              kicker="Race Guide"
              excerpt="Everything runners need to know — qualifying, course profile, weather, and how to navigate the city after."
              imageUrl={demoCards[2].imageUrl}
            />
          </div>
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="hover" onCopyLink={showToast}>
          Hover behaviour
        </SectionHeader>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          Two affordances fire on hover:
        </p>
        <ul
          className="text-copy-16 text-textSubtle mb-6 list-disc pl-6"
          style={{ lineHeight: 1.6 }}
        >
          <li>
            <strong style={{ color: "var(--ds-gray-1000)" }}>
              Image settle —
            </strong>{" "}
            scales from 104% to 100% over 300 ms (group-hover on the
            outer <code>&lt;article&gt;</code>).
          </li>
          <li>
            <strong style={{ color: "var(--ds-gray-1000)" }}>
              Kicker colour shift —
            </strong>{" "}
            kicker text fades from <code>--ds-gray-900</code> to{" "}
            <code>--ds-gray-1000</code> when hovered directly. The
            kicker&apos;s anchor sits with{" "}
            <code>relative z-10</code> so it punches through the title&apos;s
            full-card click overlay.
          </li>
        </ul>
        <p
          className="text-copy-16 text-textSubtle mt-3 mb-6"
          style={{ lineHeight: 1.5 }}
        >
          Hover the card below to see both.
        </p>
        <CodePreview componentCode={defaultCode}>
          <div className="max-w-[420px]">
            <ArticleCard
              href={demoCards[0].href}
              title={demoCards[0].title}
              publishedAt={demoCards[0].publishedAt}
              kicker={demoCards[0].kicker}
              kickerHref={demoCards[0].kickerHref}
              excerpt={demoCards[0].excerpt}
              imageUrl={demoCards[0].imageUrl}
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
                  Article URL. Becomes the title link and the card-wide
                  click overlay.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">title</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">—</td>
                <td className="py-3 px-4">
                  Card headline. Clamped to 2 / 3 lines.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">publishedAt</td>
                <td className="py-3 px-4 font-mono">string (ISO)</td>
                <td className="py-3 px-4 font-mono">—</td>
                <td className="py-3 px-4">
                  ISO date. Formatted as <code>d MMM yyyy</code>; an
                  invalid value renders nothing.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">kicker</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">undefined</td>
                <td className="py-3 px-4">
                  Short label above the title (category, &quot;Race
                  Guide&quot;, etc.).
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">kickerHref</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">undefined</td>
                <td className="py-3 px-4">
                  When set, kicker becomes a link punching through the
                  card-wide click overlay.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">excerpt</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">undefined</td>
                <td className="py-3 px-4">
                  Two-line dek. Capped at <code>max-w-3xl</code>.
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
                <td className="py-3 pr-4 font-mono">blurDataURL</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono">undefined</td>
                <td className="py-3 px-4">
                  Optional low-res blur placeholder used by{" "}
                  <code>next/image</code>.
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
