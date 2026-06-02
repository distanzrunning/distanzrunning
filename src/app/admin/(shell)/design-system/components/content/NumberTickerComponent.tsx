"use client";

import React, { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { NumberTicker } from "@/components/ui/NumberTicker";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";

import { ComponentRef } from "../ComponentRef";
import { Section } from "../ContentWithTOC";

// ============================================================================
// Page chrome — copied verbatim from AccordionComponent.tsx per the DS
// convention (TODO: extract into a shared module once we touch more than
// one of these in a single PR).
// ============================================================================

const HEADER_HEIGHT = 112;
const SECTION_PADDING = 48;

function Toast({
  message,
  isVisible,
}: {
  message: string;
  isVisible: boolean;
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
        <span className="text-copy-14 text-textDefault">{message}</span>
      </div>
    </div>
  );
}

function LinkIcon() {
  return (
    <svg
      height="14"
      width="14"
      viewBox="0 0 16 16"
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      aria-hidden="true"
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
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top - HEADER_HEIGHT - SECTION_PADDING,
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

function CopyIconButton({ copied }: { copied: boolean }) {
  return copied ? (
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
  ) : (
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

function RenderShikiToken({ token }: { token: DualThemeToken }) {
  const style = getTokenStyle(token);
  return <span style={style}>{token.content}</span>;
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

  const tokenizedLines = useShikiHighlighter(componentCode, "tsx");
  const lines: DualThemeToken[][] =
    tokenizedLines ||
    componentCode.split("\n").map(
      (line) =>
        [
          {
            content: line,
            color: "rgb(var(--color-textDefault))",
            darkColor: "rgb(var(--color-textDefault))",
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
          className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-textDefault border-t border-borderDefault"
        >
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>
        {isOpen && (
          <div
            className="border-t border-borderDefault overflow-x-auto font-mono text-copy-13"
            style={{ background: "var(--ds-background-100)" }}
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
// Demos
// ============================================================================

const PRESET_VALUES = [0, 42, 1234, 8421, 199];

function DefaultDemo() {
  const [step, setStep] = useState(0);
  const value = PRESET_VALUES[step % PRESET_VALUES.length];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
      }}
    >
      <span
        className="text-heading-32"
        style={{ color: "rgb(var(--color-textDefault))" }}
      >
        <NumberTicker value={value} />
      </span>
      <Button
        type="button"
        size="small"
        variant="secondary"
        onClick={() => setStep((s) => s + 1)}
      >
        Next value
      </Button>
    </div>
  );
}

function SuffixDemo() {
  const [step, setStep] = useState(0);
  const values = [12, 67, 95, 33, 100];
  const value = values[step % values.length];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
      }}
    >
      <span
        className="text-heading-32"
        style={{ color: "rgb(var(--color-textDefault))" }}
      >
        <NumberTicker value={value} suffix="%" />
      </span>
      <Button
        type="button"
        size="small"
        variant="secondary"
        onClick={() => setStep((s) => s + 1)}
      >
        Next rate
      </Button>
    </div>
  );
}

function DecimalsDemo() {
  const [step, setStep] = useState(0);
  const values = [3.14, 1.41, 2.71, 6.28];
  const value = values[step % values.length];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
      }}
    >
      <span
        className="text-heading-32 font-mono"
        style={{ color: "rgb(var(--color-textDefault))" }}
      >
        <NumberTicker value={value} decimals={2} />
      </span>
      <Button
        type="button"
        size="small"
        variant="secondary"
        onClick={() => setStep((s) => s + 1)}
      >
        Next constant
      </Button>
    </div>
  );
}

// ============================================================================
// Code strings
// ============================================================================

const defaultCode = `import { NumberTicker } from '@/components/ui/NumberTicker';

export function Example() {
  const [value, setValue] = useState(0);
  return (
    <>
      <NumberTicker value={value} />
      <button onClick={() => setValue(42)}>Set to 42</button>
    </>
  );
}`;

const suffixCode = `import { NumberTicker } from '@/components/ui/NumberTicker';

export function Example() {
  return <NumberTicker value={67} suffix="%" />;
}`;

const decimalsCode = `import { NumberTicker } from '@/components/ui/NumberTicker';

export function Example() {
  return <NumberTicker value={3.14159} decimals={2} />;
}`;

// ============================================================================
// Page
// ============================================================================

export default function NumberTickerComponent() {
  const [toast, setToast] = useState({ message: "", isVisible: false });

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
    setTimeout(() => setToast((t) => ({ ...t, isVisible: false })), 2000);
  };

  return (
    <>
      <Toast message={toast.message} isVisible={toast.isVisible} />

      {/* Default */}
      <Section>
        <SectionHeader id="default" onCopyLink={showToast}>
          Default
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          Renders an integer that tweens to the next{" "}
          <code className="inline-code">value</code> whenever the prop
          changes. Locale-aware thousands separators (1,234) come for
          free. Default tween is 400 ms with an ease-out-expo curve.
        </p>
        <CodePreview componentCode={defaultCode}>
          <DefaultDemo />
        </CodePreview>
      </Section>

      {/* Suffix */}
      <Section>
        <SectionHeader id="suffix" onCopyLink={showToast}>
          Suffix / prefix
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          Pass <code className="inline-code">suffix</code> or{" "}
          <code className="inline-code">prefix</code> to glue a static
          string to the formatted number. Common: %, $,{" "}
          <em>pts</em>.
        </p>
        <CodePreview componentCode={suffixCode}>
          <SuffixDemo />
        </CodePreview>
      </Section>

      {/* Decimals */}
      <Section>
        <SectionHeader id="decimals" onCopyLink={showToast}>
          Decimals
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          <code className="inline-code">decimals</code> sets the number
          of decimal places to render. Defaults to 0 (rounded integer).
          Pair with <code className="inline-code">font-mono</code> when
          alignment matters across multiple ticker instances.
        </p>
        <CodePreview componentCode={decimalsCode}>
          <DecimalsDemo />
        </CodePreview>
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
            Dashboard <ComponentRef name="Stat Card" /> headline numbers
            that change in response to a filter / date-range switch —
            the tween gives feedback that the value actually changed,
            so the user doesn&apos;t miss a small delta.
          </li>
          <li>
            Live counters that update on a timer (visitors online,
            queued jobs). The tween smooths jumps that would otherwise
            flash distractingly.
          </li>
          <li>
            Don&apos;t use for static numbers that never change —
            it&apos;s overhead with no benefit. Plain text is fine
            for a page&apos;s subtitle <em>1,234 articles</em>.
          </li>
          <li>
            Don&apos;t use for high-frequency updates (e.g. realtime
            sub-second updates) — the rAF tween won&apos;t keep up and
            you&apos;ll see lurching. Use a non-animated formatter
            instead.
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
            On mount the displayed value equals the initial{" "}
            <code className="inline-code">value</code> — no
            initial-tween-from-zero. The first tween fires when{" "}
            <code className="inline-code">value</code> changes.
          </li>
          <li>
            If <code className="inline-code">value</code> changes
            mid-tween, the current tween is cancelled and a new one
            starts from wherever the display is now.
          </li>
          <li>
            Tween uses <code className="inline-code">requestAnimationFrame</code>{" "}
            and ease-out-expo (fast start, gentle settle). Default
            duration is 400 ms — override via{" "}
            <code className="inline-code">duration</code>.
          </li>
          <li>
            Each frame triggers a React re-render, so don&apos;t mount
            hundreds of NumberTickers at once. For a single dashboard
            with ≤ 10 tiles it&apos;s imperceptible.
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
            <code className="inline-code">value</code> is always a
            number. Pre-rounded values render instantly without a
            settling pass; high-precision values (e.g. 67.3851) tween
            but display rounded to{" "}
            <code className="inline-code">decimals</code> on each
            frame.
          </li>
          <li>
            <code className="inline-code">suffix</code> /{" "}
            <code className="inline-code">prefix</code> are static
            strings — they don&apos;t tween. The number tweens between
            them.
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
            The tween is purely visual — screen readers receive each
            frame&apos;s text content but most don&apos;t announce them
            because the surrounding container isn&apos;t a live region.
            If you want SR users to hear the new value, wrap the
            container in <code className="inline-code">aria-live=&quot;polite&quot;</code>
            {" "}— but use sparingly, every frame is noisy.
          </li>
          <li>
            Respect{" "}
            <code className="inline-code">prefers-reduced-motion</code>:
            consider passing{" "}
            <code className="inline-code">duration={"{0}"}</code> when
            the media query matches, so the value snaps instantly
            instead of tweening.
          </li>
        </ul>
      </Section>
    </>
  );
}
