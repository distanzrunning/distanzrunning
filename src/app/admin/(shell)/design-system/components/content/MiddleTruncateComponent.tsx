"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "../ContentWithTOC";
import { ComponentRef } from "../ComponentRef";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import { MiddleTruncate } from "@/components/ui/MiddleTruncate";
import { Slider } from "@/components/ui/Slider";
import Toggle from "@/components/ui/Toggle";

// ============================================================================
// Toast
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
          <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16">
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
// Section header
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
}

function CodePreview({ children, componentCode }: CodePreviewProps) {
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
    <div className="border border-borderDefault rounded-lg overflow-hidden">
      <div
        className="p-6 rounded-t-lg"
        style={{ background: "hsl(var(--color-surface))" }}
      >
        {children}
      </div>
      <div
        className="rounded-b-lg"
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
// Demo
// ============================================================================

const EXAMPLE_ROWS: { label: string; value: string; mono?: boolean }[] = [
  {
    label: "Branch",
    value: "feature/redesign-dashboard-navigation-with-sidebar-improvements",
  },
  {
    label: "Preview URL",
    value:
      "platform-web-git-feature-redesign-dashboard-navigation-phamous.vercel.app",
  },
  { label: "Deployment ID", value: "dpl_8gmXTT1yJRP8UbGfXD7A3sp4RKhW" },
  { label: "Env var key", value: "STRIPE_WEBHOOK_SIGNING_SECRET", mono: true },
  {
    label: "Commit SHA",
    value: "2b0874e797d7c2a4092d0033ee0c2f0f9aef2869",
  },
  {
    label: "File path",
    value:
      "apps/vercel-site/app/(dashboard)/[teamSlug]/[project]/settings/page.tsx",
  },
  {
    label: "Custom domain",
    value: "api.internal.platform-observability.example.com",
  },
  { label: "Model name", value: "google/gemini-3.1-flash-image-preview" },
  { label: "Fits as-is", value: "sidebar.tsx" },
];

const WIDTH_MIN = 0;
const WIDTH_MAX = 600;

function MiddleTruncateDemo() {
  const [width, setWidth] = useState(WIDTH_MAX);
  const [animate, setAnimate] = useState(false);

  // Animate on → oscillate the width between MIN and MAX so the truncation
  // recomputes live (Geist's "Animate" toggle drives the slider up and down).
  useEffect(() => {
    if (!animate) return;
    const mid = (WIDTH_MIN + WIDTH_MAX) / 2;
    const amp = (WIDTH_MAX - WIDTH_MIN) / 2;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const phase = ((now - start) / 4000) * 2 * Math.PI; // 4s per cycle
      setWidth(Math.round(mid - amp * Math.cos(phase)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {EXAMPLE_ROWS.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-4 rounded-md border border-[var(--ds-gray-alpha-400)] px-4 py-3"
          >
            <div className="basis-32 shrink-0 text-copy-13 text-textSubtler">
              {row.label}
            </div>
            <div className="min-w-0 grow" style={{ maxWidth: width }}>
              <MiddleTruncate
                text={row.value}
                className={`text-label-14 text-textDefault ${row.mono ? "font-mono" : ""}`}
              />
            </div>
          </div>
        ))}
      </div>
      <aside className="flex flex-col gap-3">
        <div>
          <div className="text-copy-13 text-textSubtle mb-2">Width</div>
          <div className="flex items-center gap-3">
            <div className="min-w-[180px] max-w-xs grow">
              <Slider
                min={WIDTH_MIN}
                max={WIDTH_MAX}
                value={width}
                onChange={setWidth}
              />
            </div>
            <span className="font-mono text-copy-13 text-textSubtle tabular-nums">
              {width}px
            </span>
          </div>
        </div>
        <Toggle checked={animate} onChange={setAnimate} label="Animate" />
      </aside>
    </div>
  );
}

const exampleCode = `import { MiddleTruncate } from '@/components/ui/MiddleTruncate';

export function Example() {
  return (
    <div className="max-w-[280px]">
      <MiddleTruncate text="apps/vercel-site/app/(dashboard)/[project]/settings/page.tsx" />
    </div>
  );
}`;

// ============================================================================
// Main
// ============================================================================

export default function MiddleTruncateComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      {/* Examples */}
      <Section>
        <SectionHeader id="examples" onCopyLink={showToast}>
          Examples
        </SectionHeader>
        <p className="mt-2 leading-6 text-textSubtle xl:mt-4">
          Covers strings that benefit from middle truncation.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={exampleCode}>
            <MiddleTruncateDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Best Practices */}
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
            Use Middle Truncate for strings whose head and tail both carry
            information: file paths (
            <code className="inline-code">apps/…/page.tsx</code>), URLs,
            deployment IDs (<code className="inline-code">dpl_…abc123</code>),
            commit hashes, branch names with prefixes.
          </li>
          <li>
            For prose, descriptions, and headings, use end-truncation with{" "}
            <code className="inline-code">…</code> instead; cutting the middle of
            a sentence destroys meaning.
          </li>
          <li>
            For any truncated value the user might need verbatim, pair with a{" "}
            <ComponentRef name="Tooltip" /> showing the full string or a
            copy-on-click affordance.
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
            Middle Truncate renders a single ellipsis glyph (
            <code className="inline-code">…</code>) rather than three periods.
            This keeps monospace values — env var keys, IDs, hashes, and paths —
            from reserving three character cells for the truncation marker.
          </li>
          <li>
            The component tracks its container width, so layouts that change
            width on hover (expanding cards, animated rows) make the truncation
            point jitter. Lock the width during interaction.
          </li>
          <li>
            Copying yields the full original string (kept in the DOM), not the
            visible ellipsis form. Confirm this holds if you wrap it with a
            custom <code className="inline-code">onCopy</code>.
          </li>
          <li>
            Don&apos;t wrap Middle Truncate in another{" "}
            <code className="inline-code">text-overflow: ellipsis</code>{" "}
            container; the two strategies fight and the inner ellipsis wins
            inconsistently.
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
            Expose the full string to assistive tech via the wrapping
            element&apos;s accessible name (the component keeps the full value in
            the DOM and as a <code className="inline-code">title</code>).
          </li>
          <li>
            Avoid Middle Truncate inside focusable controls without an explicit{" "}
            <code className="inline-code">aria-label</code>; the ellipsis on its
            own gives screen readers nothing to announce.
          </li>
          <li>
            Keep the visible string long enough on small viewports that the head
            still identifies the resource (path segment, ID prefix).
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
