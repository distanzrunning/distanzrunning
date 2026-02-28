"use client";

import React, { useState, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import { ContextMenu } from "@/components/ui/ContextMenu";

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
// Trigger Box — shared dashed-border trigger area matching Geist
// ============================================================================

function TriggerBox() {
  return (
    <div
      style={{
        width: 300,
        padding: "45px 0",
        border: "1px var(--ds-gray-alpha-600) dashed",
        borderRadius: 4,
        textAlign: "center",
        fontSize: 14,
      }}
    >
      Right click here
    </div>
  );
}

// ============================================================================
// Demo Icons (simple SVG icons for prefix demos)
// ============================================================================

function ArrowLeftIcon() {
  return (
    <svg height="16" viewBox="0 0 16 16" width="16" style={{ color: "currentcolor" }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.46966 13.5303L6.99999 14.0607L8.06065 13L7.53032 12.4697L3.81065 8.74999H14.25H15V7.24999H14.25H3.81065L7.53032 3.53032L8.06065 2.99999L6.99999 1.93933L6.46966 2.46966L1.46966 7.46966C1.17677 7.76255 1.17677 8.23743 1.46966 8.53032L6.46966 13.5303Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg height="16" viewBox="0 0 16 16" width="16" style={{ color: "currentcolor" }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.53034 2.46966L9.00001 1.93933L7.93935 2.99999L8.46968 3.53032L12.1893 7.24999H1.75001H1.00001V8.74999H1.75001H12.1893L8.46968 12.4697L7.93935 13L9.00001 14.0607L9.53034 13.5303L14.5303 8.53032C14.8232 8.23743 14.8232 7.76255 14.5303 7.46966L9.53034 2.46966Z"
        fill="currentColor"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg height="16" viewBox="0 0 16 16" width="16" style={{ color: "currentcolor" }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.34315 2.34315C7.79049 0.895811 10.1095 0.895811 11.5569 2.34315L11.8994 2.68566L12.7929 3.57907L13.5 4.28613V2.50003V1.75003H15V2.50003V6.25003V7.00003H14.25H10.5H9.75V5.50003H10.5H12.2322L11.3358 4.60363L10.9933 4.26112C10.1323 3.40013 8.76777 3.40013 7.90678 4.26112C7.04578 5.12211 7.04578 6.48666 7.90678 7.34766L8.60388 8.04476L7.54322 9.10542L6.84612 8.40832C5.39878 6.96098 5.39878 4.64199 6.34315 2.34315ZM9.65685 13.6569C8.20951 15.1042 5.89052 15.1042 4.44318 13.6569L4.10066 13.3143L3.20712 12.4209L2.5 11.7139V13.5V14.25H1V13.5V9.75003V9.00003H1.75H5.5H6.25V10.5H5.5H3.76777L4.66421 11.3964L5.00672 11.7389C5.86772 12.5999 7.23227 12.5999 8.09326 11.7389C8.95426 10.8779 8.95426 9.51338 8.09326 8.65238L7.39616 7.95528L8.45682 6.89462L9.15392 7.59172C10.6013 9.03906 10.6013 11.358 9.65685 13.6569Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg height="16" viewBox="0 0 16 16" width="16" style={{ color: "currentcolor" }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.56065 5.43934L5.09098 5.96967L3.06065 8L5.09098 10.0303L4.56065 10.5607L3.49999 11.6213L2.96966 11.091L0.878677 9.00001C0.292893 8.41422 0.292893 7.46448 0.878677 6.87869L2.96966 4.78771L3.49999 4.25738L4.56065 5.43934ZM11.4393 5.43934L10.909 5.96967L12.9393 8L10.909 10.0303L11.4393 10.5607L12.5 11.6213L13.0303 11.091L15.1213 9.00001C15.7071 8.41422 15.7071 7.46448 15.1213 6.87869L13.0303 4.78771L12.5 4.25738L11.4393 5.43934ZM9.97066 2.01587L10.7793 2.27004L6.77932 15.2344L6.02932 13.9841L9.97066 2.01587Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg height="16" viewBox="0 0 16 16" width="16" style={{ color: "currentcolor" }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.75 1H15.25H16V1.75V6.25V7H14.5V6.25V3.56066L8.53033 9.53033L8 10.0607L6.93934 9L7.46967 8.46967L13.4393 2.5H10.75H10V1H10.75ZM1 3.75C1 2.7835 1.7835 2 2.75 2H7.25H8V3.5H7.25H2.75C2.61193 3.5 2.5 3.61193 2.5 3.75V13.25C2.5 13.3881 2.61193 13.5 2.75 13.5H12.25C12.3881 13.5 12.5 13.3881 12.5 13.25V8.75V8H14V8.75V13.25C14 14.2165 13.2165 15 12.25 15H2.75C1.7835 15 1 14.2165 1 13.25V3.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Code Examples
// ============================================================================

const defaultCode = `import { ContextMenu } from '@/components/ui/ContextMenu';

function DefaultExample() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>
        <div style={{
          width: 300, padding: '45px 0',
          border: '1px var(--ds-gray-alpha-600) dashed',
          borderRadius: 4, textAlign: 'center', fontSize: 14,
        }}>
          Right click here
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item onSelect={() => console.log('Back')}>
          Back
        </ContextMenu.Item>
        <ContextMenu.Item onSelect={() => console.log('Forward')}>
          Forward
        </ContextMenu.Item>
        <ContextMenu.Item onSelect={() => console.log('Reload')}>
          Reload
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item onSelect={() => console.log('View Source')}>
          View Source
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}`;

const disabledCode = `import { ContextMenu } from '@/components/ui/ContextMenu';

function DisabledExample() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>
        <div style={{
          width: 300, padding: '45px 0',
          border: '1px var(--ds-gray-alpha-600) dashed',
          borderRadius: 4, textAlign: 'center', fontSize: 14,
        }}>
          Right click here
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item onSelect={() => console.log('Back')}>
          Back
        </ContextMenu.Item>
        <ContextMenu.Item disabled>Forward</ContextMenu.Item>
        <ContextMenu.Item onSelect={() => console.log('Reload')}>
          Reload
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item disabled>View Source</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}`;

const linkCode = `import { ContextMenu } from '@/components/ui/ContextMenu';

function LinkExample() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>
        <div style={{
          width: 300, padding: '45px 0',
          border: '1px var(--ds-gray-alpha-600) dashed',
          borderRadius: 4, textAlign: 'center', fontSize: 14,
        }}>
          Right click here
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.LinkItem href="https://vercel.com">
          Vercel Homepage
        </ContextMenu.LinkItem>
        <ContextMenu.LinkItem
          href="https://github.com"
          target="_blank"
        >
          GitHub
        </ContextMenu.LinkItem>
      </ContextMenu.Content>
    </ContextMenu>
  );
}`;

const prefixSuffixCode = `import { ContextMenu } from '@/components/ui/ContextMenu';

function PrefixSuffixExample() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {/* Prefix icons */}
      <ContextMenu>
        <ContextMenu.Trigger>
          <div style={{ /* trigger styles */ }}>
            Right click here
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item
            prefix={<ArrowLeftIcon />}
            onSelect={() => {}}
          >
            Back
          </ContextMenu.Item>
          <ContextMenu.Item
            prefix={<ArrowRightIcon />}
            onSelect={() => {}}
          >
            Forward
          </ContextMenu.Item>
          <ContextMenu.Item
            prefix={<RefreshIcon />}
            onSelect={() => {}}
          >
            Reload
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>

      {/* Suffix shortcuts */}
      <ContextMenu>
        <ContextMenu.Trigger>
          <div style={{ /* trigger styles */ }}>
            Right click here
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item
            suffix="⌘["
            onSelect={() => {}}
          >
            Back
          </ContextMenu.Item>
          <ContextMenu.Item
            suffix="⌘]"
            onSelect={() => {}}
          >
            Forward
          </ContextMenu.Item>
          <ContextMenu.Item
            suffix="⌘R"
            onSelect={() => {}}
          >
            Reload
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    </div>
  );
}`;

// ============================================================================
// Demo Components
// ============================================================================

function DefaultDemo() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>
        <TriggerBox />
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Back</ContextMenu.Item>
        <ContextMenu.Item>Forward</ContextMenu.Item>
        <ContextMenu.Item>Reload</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>View Source</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}

function DisabledDemo() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>
        <TriggerBox />
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Back</ContextMenu.Item>
        <ContextMenu.Item disabled>Forward</ContextMenu.Item>
        <ContextMenu.Item>Reload</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item disabled>View Source</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}

function LinkDemo() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>
        <TriggerBox />
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.LinkItem href="https://vercel.com">
          Vercel Homepage
        </ContextMenu.LinkItem>
        <ContextMenu.LinkItem href="https://github.com" target="_blank">
          GitHub
        </ContextMenu.LinkItem>
        <ContextMenu.Separator />
        <ContextMenu.LinkItem href="https://nextjs.org" target="_blank">
          Next.js Documentation
        </ContextMenu.LinkItem>
      </ContextMenu.Content>
    </ContextMenu>
  );
}

function PrefixSuffixDemo() {
  return (
    <div
      className="flex flex-col md:flex-row items-stretch justify-start flex-initial"
      style={{ gap: 24 }}
    >
      {/* Prefix icons */}
      <ContextMenu>
        <ContextMenu.Trigger>
          <TriggerBox />
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item prefix={<ArrowLeftIcon />}>Back</ContextMenu.Item>
          <ContextMenu.Item prefix={<ArrowRightIcon />}>
            Forward
          </ContextMenu.Item>
          <ContextMenu.Item prefix={<RefreshIcon />}>Reload</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item prefix={<CodeIcon />}>
            View Source
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>

      {/* Suffix shortcuts */}
      <ContextMenu>
        <ContextMenu.Trigger>
          <TriggerBox />
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item suffix="⌘[">Back</ContextMenu.Item>
          <ContextMenu.Item suffix="⌘]">Forward</ContextMenu.Item>
          <ContextMenu.Item suffix="⌘R">Reload</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item suffix="⌘U">View Source</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function ContextMenuComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />

      {/* Default */}
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

      {/* Disabled items */}
      <Section>
        <SectionHeader id="disabled-items" onCopyLink={showToast}>
          Disabled items
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={disabledCode}>
            <DisabledDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Link items */}
      <Section>
        <SectionHeader id="link-items" onCopyLink={showToast}>
          Link items
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={linkCode}>
            <LinkDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Prefix and suffix */}
      <Section>
        <SectionHeader id="prefix-and-suffix" onCopyLink={showToast}>
          Prefix and suffix
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={prefixSuffixCode}>
            <PrefixSuffixDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Props */}
      <Section>
        <SectionHeader id="props" onCopyLink={showToast}>
          Props
        </SectionHeader>

        <p className="text-copy-14 text-textSubtle mt-4 mb-4">
          ContextMenu.Item props.
        </p>
        <div className="overflow-x-auto">
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
                <td className="py-3 pr-4 font-mono">children</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  ReactNode
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Item label content
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">onSelect</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  {"() => void"}
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Called when the item is selected
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">disabled</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  boolean
                </td>
                <td className="py-3 px-4 text-textSubtle">false</td>
                <td className="py-3 px-4 text-textSubtle">
                  Whether the item is disabled
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">prefix</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  ReactNode
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Optional element rendered before the label
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">suffix</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  ReactNode
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Optional element rendered after the label
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-copy-14 text-textSubtle mt-8 mb-4">
          ContextMenu.LinkItem props.
        </p>
        <div className="overflow-x-auto">
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
                <td className="py-3 pr-4 font-mono">children</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  ReactNode
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Link label content
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">href</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  string
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  URL the link navigates to
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">target</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  string
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Link target attribute (e.g. {`"_blank"`})
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">prefix</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  ReactNode
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Optional element rendered before the label
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">suffix</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  ReactNode
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Optional element rendered after the label
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
