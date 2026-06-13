"use client";

import React, { useState, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "../ContentWithTOC";
import { ComponentRef } from "../ComponentRef";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import { Progress, ProgressWithStops } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";

// ============================================================================
// Toast Component
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
          <svg
            height="16"
            strokeLinejoin="round"
            viewBox="0 0 16 16"
            width="16"
          >
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
    toastTimeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 2000);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return { toast, showToast, dismissToast };
}

// ============================================================================
// Section Header Component
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
      const scrollTarget =
        absoluteElementTop - HEADER_HEIGHT - SECTION_PADDING;
      window.scrollTo({ top: scrollTarget, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative -ml-5 inline-block pl-5 no-underline outline-none text-inherit text-left cursor-pointer bg-transparent border-none"
      id={id}
    >
      <h2 className="text-heading-24 text-textDefault">
        <div className="absolute left-0 top-[8px] opacity-0 outline-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
          <LinkIcon />
        </div>
        {children}
      </h2>
    </button>
  );
}

// ============================================================================
// Code Preview Component
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
}

function CodePreview({ children, componentCode }: CodePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const tokenizedLines = useShikiHighlighter(componentCode, "tsx", undefined, isOpen);
  const lines: DualThemeToken[][] =
    tokenizedLines ||
    componentCode.split("\n").map(
      (line) =>
        [
          {
            content: line,
            color: "hsl(var(--color-textDefault))",
            darkColor: "hsl(var(--color-textDefault))",
          },
        ] as DualThemeToken[],
    );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(componentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [componentCode]);

  return (
    <div className="border border-borderDefault rounded-lg">
      <div
        className="p-6 rounded-t-lg"
        style={{ background: "hsl(var(--color-surface))" }}
      >
        {children}
      </div>
      <div
        className="rounded-b-lg overflow-hidden"
        style={{ background: "hsl(var(--color-canvas))" }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-textDefault border-t border-borderDefault"
        >
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>
        {isOpen && (
          <div
            className="border-t border-borderDefault overflow-x-auto font-mono text-copy-13"
            style={{ background: "hsl(var(--color-surface))" }}
          >
            <div className="relative group">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded border border-borderDefault opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-canvas hover:bg-[var(--ds-gray-100)]"
                aria-label="Copy code"
              >
                <CopyIconButton copied={copied} />
              </button>
              <pre className="overflow-x-auto py-4" data-code-block>
                <code className="block text-copy-13 leading-[20px] font-mono">
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
// Code Examples
// ============================================================================

const defaultCode = `import { Progress } from '@/components/ui/Progress';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return <Progress value={30} />;
}`;

const customMaxCode = `import { Progress } from '@/components/ui/Progress';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return <Progress max={40} value={30} />;
}`;

const dynamicColorsCode = `import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { useState, type JSX } from 'react';

export function Component(): JSX.Element {
  const [value, setValue] = useState(0);

  const getColor = (v: number) => {
    if (v <= 25) return 'hsl(var(--color-textDefault))';
    if (v <= 50) return 'var(--ds-amber-700)';
    if (v <= 75) return 'var(--ds-blue-700)';
    return 'var(--ds-green-700)';
  };

  return (
    <div className="flex flex-col items-start justify-start gap-6 flex-initial">
      <Progress value={value} color={getColor(value)} />
      <div className="flex flex-row items-stretch justify-start gap-4 flex-initial">
        <Button
          size="small"
          onClick={() => {
            if (value < 100) setValue(value + 10);
          }}
        >
          Increase
        </Button>
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            if (value > 0) setValue(value - 10);
          }}
        >
          Decrease
        </Button>
      </div>
    </div>
  );
}`;

const themedCode = `import { Progress } from '@/components/ui/Progress';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
      <Progress value={100} color="var(--ds-blue-700)" />
      <Progress value={10} color="var(--ds-red-700)" />
      <Progress value={40} color="var(--ds-amber-700)" />
      <Progress value={70} color="hsl(var(--color-textSubtler))" />
    </div>
  );
}`;

const withStopsCode = `import { ProgressWithStops } from '@/components/ui/Progress';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <ProgressWithStops
      value={30}
      color="var(--ds-blue-700)"
      stops={[
        { position: 10 },
        { position: 20 },
        { position: 30 },
        { position: 40 },
        { position: 50 },
        { position: 60 },
        { position: 70 },
        { position: 80 },
        { position: 90 },
        { position: 95 },
      ]}
    />
  );
}`;

const widthsCode = `import { Progress } from '@/components/ui/Progress';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <Progress value={60} width={100} />
      <Progress value={60} width={200} />
      <Progress value={60} width={300} />
      <Progress value={60} width="50%" />
      <Progress value={60} width="100%" />
    </div>
  );
}`;

const heightsCode = `import { Progress } from '@/components/ui/Progress';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col gap-6 max-w-prose">
      <Progress value={60} height={4} />
      <Progress value={60} height={10} />
      <Progress value={60} height={50} />
      <Progress value={60} height={200} />
    </div>
  );
}`;

// ============================================================================
// Demo Components
// ============================================================================

function DefaultDemo() {
  return <Progress value={30} />;
}

function CustomMaxDemo() {
  return <Progress value={30} max={40} />;
}

function DynamicColorsDemo() {
  const [value, setValue] = useState(0);

  const getColor = (v: number) => {
    if (v <= 25) return "hsl(var(--color-textDefault))";
    if (v <= 50) return "var(--ds-amber-700)";
    if (v <= 75) return "var(--ds-blue-700)";
    return "var(--ds-green-700)";
  };

  return (
    <div className="flex flex-col items-start justify-start gap-6 flex-initial">
      <Progress value={value} color={getColor(value)} />
      <div className="flex flex-row items-stretch justify-start gap-4 flex-initial">
        <Button
          size="small"
          onClick={() => {
            if (value < 100) setValue(value + 10);
          }}
        >
          Increase
        </Button>
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            if (value > 0) setValue(value - 10);
          }}
        >
          Decrease
        </Button>
      </div>
    </div>
  );
}

function ThemedDemo() {
  return (
    <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
      <Progress value={100} color="var(--ds-blue-700)" />
      <Progress value={10} color="var(--ds-red-700)" />
      <Progress value={40} color="var(--ds-amber-700)" />
      <Progress value={70} color="hsl(var(--color-textSubtler))" />
    </div>
  );
}

function WithStopsDemo() {
  const stops = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95].map((position) => ({
    position,
  }));

  return (
    <ProgressWithStops value={30} color="var(--ds-blue-700)" stops={stops} />
  );
}

function WidthsDemo() {
  return (
    <div className="flex flex-col items-start justify-start gap-6 flex-initial">
      <Progress value={60} width={100} />
      <Progress value={60} width={200} />
      <Progress value={60} width={300} />
      <Progress value={60} width="50%" />
      <Progress value={60} width="100%" />
    </div>
  );
}

function HeightsDemo() {
  return (
    <div className="flex flex-col items-stretch justify-start gap-6 flex-initial max-w-prose">
      <Progress value={60} height={4} />
      <Progress value={60} height={10} />
      <Progress value={60} height={50} />
      <Progress value={60} height={200} />
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function ProgressComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Section>
        <SectionHeader id="default" onCopyLink={showToast}>
          Default
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={defaultCode}>
            <DefaultDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="custom-max" onCopyLink={showToast}>
          Custom max
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={customMaxCode}>
            <CustomMaxDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="dynamic-colors" onCopyLink={showToast}>
          Dynamic colors
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={dynamicColorsCode}>
            <DynamicColorsDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="themed" onCopyLink={showToast}>
          Themed
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={themedCode}>
            <ThemedDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="with-stops" onCopyLink={showToast}>
          With Stops
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={withStopsCode}>
            <WithStopsDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="widths" onCopyLink={showToast}>
          Widths
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={widthsCode}>
            <WidthsDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="heights" onCopyLink={showToast}>
          Heights
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={heightsCode}>
            <HeightsDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Best Practices Section */}
      <Section>
        <SectionHeader id="best-practices" onCopyLink={showToast}>
          Best Practices
        </SectionHeader>

        <h3
          id="when-to-use"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          When to use
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            Determinate work whose total is knowable, like file uploads,
            multi-step setup, build steps, or batch deletions.
          </li>
          <li>
            For short indeterminate waits (~1&ndash;3s), use{" "}
            <ComponentRef name="Spinner" />; for inline copy like{" "}
            <code className="inline-code">Saving</code>, use{" "}
            <ComponentRef name="Loading Dots" />.
          </li>
          <li>
            For usage against a quota or ratio, use{" "}
            <ComponentRef name="Gauge" />; the circle reads as health,
            the bar reads as progress.
          </li>
        </ul>

        <h3
          id="behavior"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          Behavior
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            Use <code className="inline-code">max</code> for the real
            ceiling (
            <code className="inline-code">{"max={files.length}"}</code>),
            not a hardcoded <code className="inline-code">100</code>. The
            component computes the percentage from{" "}
            <code className="inline-code">value / max</code>.
          </li>
          <li>
            Threshold colors via{" "}
            <code className="inline-code">dynamicColors</code> should
            mirror the same breakpoints used elsewhere (warning at the
            same threshold a quota note fires).
          </li>
          <li>
            Use stops for genuine multi-stage work and label the stage
            next to the bar (
            <code className="inline-code">Step 2 of 4 · Building</code>
            ); a stop with no label is decorative noise.
          </li>
        </ul>

        <h3
          id="content"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          Content
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            Pair the bar with text naming the work and units:{" "}
            <code className="inline-code">Uploading 12 of 30 files</code>
            ,{" "}
            <code className="inline-code">Building · 1.2 GB / 4 GB</code>
            . The bar alone doesn&apos;t say what&apos;s progressing.
          </li>
          <li>
            Don&apos;t append{" "}
            <code className="inline-code">successfully</code> or{" "}
            <code className="inline-code">complete</code> once the bar
            fills; swap to a completion state (toast, success row,
            redirect).
          </li>
          <li>
            For long operations, name the work in the surrounding copy (
            <code className="inline-code">Building deployment&hellip;</code>
            ) instead of leaving a bare percentage.
          </li>
        </ul>

        <h3
          id="accessibility"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          Accessibility
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            The native{" "}
            <code className="inline-code">&lt;progress&gt;</code> element
            already exposes{" "}
            <code className="inline-code">role=&quot;progressbar&quot;</code>{" "}
            with <code className="inline-code">aria-valuemin</code>,{" "}
            <code className="inline-code">aria-valuemax</code>, and{" "}
            <code className="inline-code">aria-valuenow</code>. Pass an
            accessible name via{" "}
            <code className="inline-code">aria-label</code> on the
            wrapper or a sibling{" "}
            <code className="inline-code">&lt;label&gt;</code> tied with{" "}
            <code className="inline-code">aria-labelledby</code>.
          </li>
          <li>
            Throttle{" "}
            <code className="inline-code">value</code> updates to roughly
            once a second so screen readers don&apos;t announce every
            increment of a fast upload.
          </li>
          <li>
            Each stop accepts a{" "}
            <code className="inline-code">label</code>; name them (
            <code className="inline-code">Build complete</code>,{" "}
            <code className="inline-code">Tests complete</code>) so the
            bar is readable at a glance.
          </li>
        </ul>
      </Section>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />
    </>
  );
}
