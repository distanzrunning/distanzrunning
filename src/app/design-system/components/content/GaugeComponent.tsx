"use client";

import React, { useState, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import { Gauge } from "@/components/ui/Gauge";

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
// Code Examples
// ============================================================================

const defaultCode = `import { Gauge } from '@/components/ui/Gauge';

function DefaultExample() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      <Gauge value={50} size={20} />
      <Gauge value={50} size={32} />
      <Gauge value={50} size={64} />
      <Gauge value={50} size={128} />
    </div>
  );
}`;

const labelCode = `import { Gauge } from '@/components/ui/Gauge';

function LabelExample() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      <Gauge value={80} size={20} color="var(--ds-green-700)" />
      <Gauge value={80} size={32} color="var(--ds-green-700)" showLabel />
      <Gauge value={100} size={32} color="var(--ds-green-700)" gapPercent={0} showLabel />
      <Gauge value={80} size={64} color="var(--ds-green-700)" showLabel />
      <Gauge value={100} size={64} color="var(--ds-green-700)" gapPercent={0} showLabel />
      <Gauge value={80} size={128} color="var(--ds-green-700)" showLabel />
      <Gauge value={100} size={128} color="var(--ds-green-700)" gapPercent={0} showLabel />
    </div>
  );
}`;

const colorScaleCode = `import { Gauge } from '@/components/ui/Gauge';

function ColorScaleExample() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      <Gauge value={14} size={32} />
      <Gauge value={34} size={32} />
      <Gauge value={68} size={32} />
    </div>
  );
}`;

const customColorCode = `import { Gauge } from '@/components/ui/Gauge';

function CustomColorExample() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v, i) => (
        <Gauge
          key={v}
          value={v}
          size={32}
          color={\`var(--ds-pink-\${(i + 1) * 100})\`}
          gapPercent={v === 0 ? 0 : v >= 90 ? 0 : 6}
        />
      ))}
    </div>
  );
}`;

const secondaryColorCode = `import { Gauge } from '@/components/ui/Gauge';

function SecondaryColorExample() {
  return (
    <Gauge
      value={50}
      size={64}
      color="var(--ds-blue-700)"
      secondaryColor="var(--ds-blue-300)"
    />
  );
}`;

const arcPriorityCode = `import { Gauge } from '@/components/ui/Gauge';

function ArcPriorityExample() {
  return (
    <Gauge
      value={50}
      size={64}
      color="var(--ds-blue-700)"
      secondaryColor="var(--ds-red-700)"
      arcPriority="equal"
      showLabel
    />
  );
}`;

const indeterminateCode = `import { Gauge } from '@/components/ui/Gauge';

function IndeterminateExample() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Gauge value={25} size={20} indeterminate />
      <Gauge value={25} size={32} indeterminate />
      <Gauge value={25} size={64} indeterminate />
      <Gauge value={25} size={128} indeterminate />
    </div>
  );
}`;

// ============================================================================
// Demo Components
// ============================================================================

function DefaultDemo() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      <Gauge value={50} size={20} />
      <Gauge value={50} size={32} />
      <Gauge value={50} size={64} />
      <Gauge value={50} size={128} />
    </div>
  );
}

function LabelDemo() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
      <Gauge value={80} size={20} color="var(--ds-green-700)" />
      <Gauge value={80} size={32} color="var(--ds-green-700)" showLabel />
      <Gauge value={100} size={32} color="var(--ds-green-700)" gapPercent={0} showLabel />
      <Gauge value={80} size={64} color="var(--ds-green-700)" showLabel />
      <Gauge value={100} size={64} color="var(--ds-green-700)" gapPercent={0} showLabel />
      <Gauge value={80} size={128} color="var(--ds-green-700)" showLabel />
      <Gauge value={100} size={128} color="var(--ds-green-700)" gapPercent={0} showLabel />
    </div>
  );
}

function ColorScaleDemo() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      <Gauge value={14} size={32} />
      <Gauge value={34} size={32} />
      <Gauge value={68} size={32} />
    </div>
  );
}

const pinkShades = [
  "var(--ds-pink-100)",
  "var(--ds-pink-200)",
  "var(--ds-pink-300)",
  "var(--ds-pink-400)",
  "var(--ds-pink-400)",
  "var(--ds-pink-500)",
  "var(--ds-pink-600)",
  "var(--ds-pink-700)",
  "var(--ds-pink-800)",
  "var(--ds-pink-900)",
  "var(--ds-pink-1000)",
];

function CustomColorDemo() {
  const values = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      {values.map((v, i) => (
        <Gauge
          key={v}
          value={v}
          size={32}
          color={pinkShades[i]}
          gapPercent={v === 0 ? 0 : v >= 90 ? 0 : 6}
        />
      ))}
    </div>
  );
}

function SecondaryColorDemo() {
  return (
    <Gauge
      value={50}
      size={64}
      color="var(--ds-blue-700)"
      secondaryColor="var(--ds-blue-300)"
    />
  );
}

function ArcPriorityDemo() {
  return (
    <Gauge
      value={50}
      size={64}
      color="var(--ds-blue-700)"
      secondaryColor="var(--ds-red-700)"
      arcPriority="equal"
      showLabel
    />
  );
}

function IndeterminateDemo() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Gauge value={25} size={20} indeterminate color="var(--ds-red-800)" />
      <Gauge value={25} size={32} indeterminate color="var(--ds-red-800)" />
      <Gauge value={25} size={64} indeterminate color="var(--ds-red-800)" />
      <Gauge value={25} size={128} indeterminate color="var(--ds-red-800)" />
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function GaugeComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Section>
        <SectionHeader id="default" onCopyLink={showToast}>
          Default
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          Gauges at different sizes showing a percentage value. Color is automatically determined by the value.
        </p>
        <CodePreview componentCode={defaultCode}>
          <DefaultDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="label" onCopyLink={showToast}>
          Label
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          Gauges with a centered label showing the current value. Label size scales with the gauge.
        </p>
        <CodePreview componentCode={labelCode}>
          <LabelDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="default-color-scale" onCopyLink={showToast}>
          Default color scale
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          Without a custom color, the gauge uses a red/amber/green scale based on the value.
        </p>
        <CodePreview componentCode={colorScaleCode}>
          <ColorScaleDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="custom-color-range" onCopyLink={showToast}>
          Custom color range
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          Use any design token color for the primary arc.
        </p>
        <CodePreview componentCode={customColorCode}>
          <CustomColorDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="custom-secondary-color" onCopyLink={showToast}>
          Custom secondary color
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          Customize the secondary (background) arc color.
        </p>
        <CodePreview componentCode={secondaryColorCode}>
          <SecondaryColorDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="arc-priority" onCopyLink={showToast}>
          Arc priority
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          When using the gauge to display a ratio, use the <code>equal</code> arc priority to make both arcs equally sized.
        </p>
        <CodePreview componentCode={arcPriorityCode}>
          <ArcPriorityDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="indeterminate" onCopyLink={showToast}>
          Indeterminate
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          An animated indeterminate state for when the value is unknown.
        </p>
        <CodePreview componentCode={indeterminateCode}>
          <IndeterminateDemo />
        </CodePreview>
      </Section>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />
    </>
  );
}
