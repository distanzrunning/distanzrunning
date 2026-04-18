"use client";

import React, { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { SiGoogleadsense } from "react-icons/si";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import { useToast } from "@/components/ui/Toast";
import { Note } from "@/components/ui/Note";
import { AdSlot } from "@/components/ui/AdSlot";

// ============================================================================
// Section header + copy-link (matches other DS pages)
// ============================================================================

const HEADER_HEIGHT = 112;
const SECTION_PADDING = 48;

function LinkIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
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
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.scrollY;
      const scrollTarget = absoluteElementTop - HEADER_HEIGHT - SECTION_PADDING;
      window.scrollTo({ top: scrollTarget, behavior: "smooth" });
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
// Code preview
// ============================================================================

function RenderShikiToken({ token }: { token: DualThemeToken }) {
  const style = getTokenStyle(token);
  return <span style={style}>{token.content}</span>;
}

function CopyIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CopyIconButton({ copied }: { copied: boolean }) {
  return (
    <div className="relative w-4 h-4">
      <span
        className={`absolute inset-0 transition-all duration-150 ease-out ${copied ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
      >
        <CopyIcon />
      </span>
      <span
        className={`absolute inset-0 transition-all duration-150 ease-out ${copied ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
      >
        <CheckIcon />
      </span>
    </div>
  );
}

interface CodePreviewProps {
  children: React.ReactNode;
  componentCode: string;
  minHeight?: number;
}

function CodePreview({ children, componentCode, minHeight = 200 }: CodePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const tokenizedLines = useShikiHighlighter(componentCode, "tsx");
  const lines: DualThemeToken[][] =
    tokenizedLines ||
    componentCode.split("\n").map(
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
    <div className="border border-[var(--ds-gray-400)] rounded-lg w-full min-w-0 overflow-hidden">
      <div
        className="p-6 flex items-center justify-center"
        style={{ background: "var(--ds-background-100)", minHeight }}
      >
        {children}
      </div>
      <div style={{ background: "var(--ds-background-200)" }}>
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
// Code snippets
// ============================================================================

const mpuCode = `import { AdSlot } from '@/components/ui/AdSlot';

<AdSlot slot="1234567890" size="mpu" />`;

const leaderboardCode = `import { AdSlot } from '@/components/ui/AdSlot';

<AdSlot slot="1234567890" size="leaderboard" />`;

const billboardCode = `import { AdSlot } from '@/components/ui/AdSlot';

<AdSlot slot="1234567890" size="billboard" />`;

const skyscraperCode = `import { AdSlot } from '@/components/ui/AdSlot';

<AdSlot slot="1234567890" size="skyscraper" />`;

const mobileBannerCode = `import { AdSlot } from '@/components/ui/AdSlot';

<AdSlot slot="1234567890" size="mobile-banner" />`;

const customFallbackCode = `import { AdSlot } from '@/components/ui/AdSlot';
import { NewsletterSignup } from '@/components/NewsletterSignup';

<AdSlot
  slot="1234567890"
  size="mpu"
  fallback={<NewsletterSignup variant="compact" />}
/>`;

// ============================================================================
// Main component
// ============================================================================

export default function AdSlotComponent() {
  const { showToast } = useToast();

  return (
    <div>
      {/* Intro */}
      <Section>
        <SectionHeader id="intro" onCopyLink={showToast}>
          Intro
        </SectionHeader>
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 xl:mt-7 mb-6">
          The ad slot is how Distanz Running embeds advertising into the
          product without breaking the layout or the design language. It
          renders a Google AdSense unit at a standard IAB size, reserves the
          exact pixel space before any network call, lazy-loads the ad only
          when the slot enters the viewport, labels the space as{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            Advertisement
          </code>{" "}
          per IAB guidelines, and falls back to a Distanz-branded card if
          the ad doesn&apos;t fill.
        </p>

        <Note type="default" label={false}>
          <span className="flex items-center gap-3">
            <SiGoogleadsense
              size={20}
              style={{ color: "#4285F4", flexShrink: 0 }}
            />
            <span>
              Distanz Running is set up under AdSense publisher{" "}
              <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
                ca-pub-8457173435004026
              </code>
              . The AdSense script is injected once in{" "}
              <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
                layout.tsx
              </code>
              ; every{" "}
              <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
                AdSlot
              </code>{" "}
              just passes the ad-unit slot ID it received from the AdSense
              dashboard. No script duplication, no CLS.
            </span>
          </span>
        </Note>
      </Section>

      {/* MPU */}
      <Section>
        <SectionHeader id="mpu" onCopyLink={showToast}>
          MPU &mdash; 300&times;250
        </SectionHeader>
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
          The default in-article and sidebar unit. Fits beside editorial
          copy, inside race guides, and at the end of gear reviews.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={mpuCode} minHeight={340}>
            <AdSlot slot="preview-mpu" size="mpu" preview />
          </CodePreview>
        </div>
      </Section>

      {/* Leaderboard */}
      <Section>
        <SectionHeader id="leaderboard" onCopyLink={showToast}>
          Leaderboard &mdash; 728&times;90
        </SectionHeader>
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
          Horizontal top-of-page unit for desktop. Paired below the nav or
          between content sections.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={leaderboardCode} minHeight={200}>
            <AdSlot slot="preview-leaderboard" size="leaderboard" preview />
          </CodePreview>
        </div>
      </Section>

      {/* Billboard */}
      <Section>
        <SectionHeader id="billboard" onCopyLink={showToast}>
          Billboard &mdash; 970&times;250
        </SectionHeader>
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
          Premium above-the-fold unit on wide desktop layouts. Reserve for
          homepage and landing pages.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={billboardCode} minHeight={340}>
            <AdSlot slot="preview-billboard" size="billboard" preview />
          </CodePreview>
        </div>
      </Section>

      {/* Skyscraper */}
      <Section>
        <SectionHeader id="skyscraper" onCopyLink={showToast}>
          Skyscraper &mdash; 160&times;600
        </SectionHeader>
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
          Vertical sidebar unit. Good for long-form article pages with a
          sticky rail.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={skyscraperCode} minHeight={680}>
            <AdSlot slot="preview-skyscraper" size="skyscraper" preview />
          </CodePreview>
        </div>
      </Section>

      {/* Mobile banner */}
      <Section>
        <SectionHeader id="mobile-banner" onCopyLink={showToast}>
          Mobile banner &mdash; 320&times;50
        </SectionHeader>
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
          Compact bottom-of-screen unit for mobile. Sits above the nav bar
          or at the end of a mobile feed.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={mobileBannerCode} minHeight={140}>
            <AdSlot slot="preview-mobile" size="mobile-banner" preview />
          </CodePreview>
        </div>
      </Section>

      {/* Custom fallback */}
      <Section>
        <SectionHeader id="custom-fallback" onCopyLink={showToast}>
          Custom fallback
        </SectionHeader>
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
          When no ad fills, the slot defaults to a Distanz &ldquo;advertise
          with us&rdquo; card. To show something else instead &mdash; a
          newsletter CTA, a related race, an affiliate product &mdash; pass
          any React node to{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            fallback
          </code>
          . The dimensions stay fixed so the layout never shifts whether an
          ad fills or not.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={customFallbackCode} minHeight={340}>
            <AdSlot
              slot="preview-custom"
              size="mpu"
              preview
              fallback={
                <div
                  className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border p-6 text-center"
                  style={{
                    borderColor: "var(--ds-gray-400)",
                    background: "var(--ds-background-200)",
                  }}
                >
                  <h4 className="text-[16px] font-semibold leading-tight text-textDefault">
                    Get the Shakeout
                  </h4>
                  <p className="text-[13px] leading-snug text-textSubtle">
                    Weekly running stories, gear, and race news.
                  </p>
                  <a
                    href="/newsletter"
                    className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-md font-sans text-[13px] font-semibold no-underline"
                    style={{
                      background: "var(--ds-gray-1000)",
                      color: "var(--ds-background-100)",
                    }}
                  >
                    Subscribe
                  </a>
                </div>
              }
            />
          </CodePreview>
        </div>
      </Section>
    </div>
  );
}
