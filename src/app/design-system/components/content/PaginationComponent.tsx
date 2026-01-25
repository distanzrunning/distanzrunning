"use client";

import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";

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
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
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
  const toastTimeoutRef = { current: null as NodeJS.Timeout | null };

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
    <div className="border border-[var(--ds-gray-400)] rounded-lg overflow-hidden">
      <div className="p-6" style={{ background: "var(--ds-background-100)" }}>
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
// Pagination Icons
// ============================================================================

function ChevronLeftIcon() {
  return (
    <svg
      height="20"
      width="20"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 14.0607L9.96966 13.5303L5.14644 8.7071C4.75592 8.31658 4.75592 7.68341 5.14644 7.29289L9.96966 2.46966L10.5 1.93933L11.5607 2.99999L11.0303 3.53032L6.56065 7.99999L11.0303 12.4697L11.5607 13L10.5 14.0607Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      height="20"
      width="20"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Pagination Component (Demo)
// ============================================================================

interface PaginationDemoProps {
  prevLabel?: string;
  prevTitle?: string;
  nextLabel?: string;
  nextTitle?: string;
}

function PaginationDemo({
  prevLabel = "Previous",
  prevTitle = "Button",
  nextLabel = "Next",
  nextTitle = "Code Block",
}: PaginationDemoProps) {
  return (
    <nav aria-label="pagination">
      <div className="flex justify-between items-start">
        {/* Previous page */}
        <button
          onClick={() => {}}
          aria-label={`Go to previous page: ${prevTitle}`}
          className="group flex items-end text-left"
        >
          <span className="text-[var(--ds-gray-900)] group-hover:text-[var(--ds-gray-1000)] transition-colors mb-0.5">
            <ChevronLeftIcon />
          </span>
          <div className="flex flex-col items-start ml-1">
            <span className="text-[13px] leading-[18px] font-normal text-[var(--ds-gray-900)] group-hover:text-[var(--ds-gray-1000)] transition-colors mb-1">
              {prevLabel}
            </span>
            <span className="text-[16px] leading-[24px] font-medium text-[var(--ds-gray-1000)]">
              {prevTitle}
            </span>
          </div>
        </button>

        {/* Next page */}
        <button
          onClick={() => {}}
          aria-label={`Go to next page: ${nextTitle}`}
          className="group flex items-end text-right"
        >
          <div className="flex flex-col items-end mr-1">
            <span className="text-[13px] leading-[18px] font-normal text-[var(--ds-gray-900)] group-hover:text-[var(--ds-gray-1000)] transition-colors mb-1">
              {nextLabel}
            </span>
            <span className="text-[16px] leading-[24px] font-medium text-[var(--ds-gray-1000)]">
              {nextTitle}
            </span>
          </div>
          <span className="text-[var(--ds-gray-900)] group-hover:text-[var(--ds-gray-1000)] transition-colors mb-0.5">
            <ChevronRightIcon />
          </span>
        </button>
      </div>
    </nav>
  );
}

// ============================================================================
// Code Examples
// ============================================================================

const basicCode = `import { Pagination } from '@/components/ui/Pagination';

export function Component() {
  return (
    <Pagination
      prevPage={{ id: 'button', label: 'Button' }}
      nextPage={{ id: 'code-block', label: 'Code Block' }}
      onNavigate={(id) => console.log('Navigate to:', id)}
    />
  );
}`;

const prevOnlyCode = `import { Pagination } from '@/components/ui/Pagination';

export function Component() {
  return (
    <Pagination
      prevPage={{ id: 'button', label: 'Button' }}
      onNavigate={(id) => console.log('Navigate to:', id)}
    />
  );
}`;

const nextOnlyCode = `import { Pagination } from '@/components/ui/Pagination';

export function Component() {
  return (
    <Pagination
      nextPage={{ id: 'code-block', label: 'Code Block' }}
      onNavigate={(id) => console.log('Navigate to:', id)}
    />
  );
}`;

const anatomyCode = `// Pagination anatomy
<nav aria-label="pagination">
  <div className="flex justify-between items-start">
    {/* Previous link */}
    <button className="group flex items-end text-left">
      <span className="text-[var(--ds-gray-900)] group-hover:text-[var(--ds-gray-1000)]">
        <ChevronLeftIcon />
      </span>
      <div className="flex flex-col items-start ml-1">
        <span className="text-[13px] leading-[18px] text-[var(--ds-gray-900)]">
          Previous
        </span>
        <span className="text-[16px] leading-[24px] font-medium text-[var(--ds-gray-1000)]">
          Button
        </span>
      </div>
    </button>

    {/* Next link */}
    <button className="group flex items-end text-right">
      <div className="flex flex-col items-end mr-1">
        <span className="text-[13px] leading-[18px] text-[var(--ds-gray-900)]">
          Next
        </span>
        <span className="text-[16px] leading-[24px] font-medium text-[var(--ds-gray-1000)]">
          Code Block
        </span>
      </div>
      <span className="text-[var(--ds-gray-900)] group-hover:text-[var(--ds-gray-1000)]">
        <ChevronRightIcon />
      </span>
    </button>
  </div>
</nav>`;

// ============================================================================
// Main Component
// ============================================================================

export default function PaginationComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />

      {/* Basic Section */}
      <Section>
        <SectionHeader id="basic" onCopyLink={showToast}>
          Basic
        </SectionHeader>
        <p className="mt-2 leading-6 text-[var(--ds-gray-900)] xl:mt-4">
          The pagination component displays previous and next navigation links
          at the bottom of content pages.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={basicCode}>
            <PaginationDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Previous Only Section */}
      <Section>
        <SectionHeader id="previous-only" onCopyLink={showToast}>
          Previous only
        </SectionHeader>
        <p className="mt-2 leading-6 text-[var(--ds-gray-900)] xl:mt-4">
          When on the last page, only the previous link is displayed.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={prevOnlyCode}>
            <nav aria-label="pagination">
              <div className="flex justify-between items-start">
                <button
                  onClick={() => {}}
                  aria-label="Go to previous page: Button"
                  className="group flex items-end text-left"
                >
                  <span className="text-[var(--ds-gray-900)] group-hover:text-[var(--ds-gray-1000)] transition-colors mb-0.5">
                    <ChevronLeftIcon />
                  </span>
                  <div className="flex flex-col items-start ml-1">
                    <span className="text-[13px] leading-[18px] font-normal text-[var(--ds-gray-900)] group-hover:text-[var(--ds-gray-1000)] transition-colors mb-1">
                      Previous
                    </span>
                    <span className="text-[16px] leading-[24px] font-medium text-[var(--ds-gray-1000)]">
                      Button
                    </span>
                  </div>
                </button>
                <div />
              </div>
            </nav>
          </CodePreview>
        </div>
      </Section>

      {/* Next Only Section */}
      <Section>
        <SectionHeader id="next-only" onCopyLink={showToast}>
          Next only
        </SectionHeader>
        <p className="mt-2 leading-6 text-[var(--ds-gray-900)] xl:mt-4">
          When on the first page, only the next link is displayed.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={nextOnlyCode}>
            <nav aria-label="pagination">
              <div className="flex justify-between items-start">
                <div />
                <button
                  onClick={() => {}}
                  aria-label="Go to next page: Code Block"
                  className="group flex items-end text-right"
                >
                  <div className="flex flex-col items-end mr-1">
                    <span className="text-[13px] leading-[18px] font-normal text-[var(--ds-gray-900)] group-hover:text-[var(--ds-gray-1000)] transition-colors mb-1">
                      Next
                    </span>
                    <span className="text-[16px] leading-[24px] font-medium text-[var(--ds-gray-1000)]">
                      Code Block
                    </span>
                  </div>
                  <span className="text-[var(--ds-gray-900)] group-hover:text-[var(--ds-gray-1000)] transition-colors mb-0.5">
                    <ChevronRightIcon />
                  </span>
                </button>
              </div>
            </nav>
          </CodePreview>
        </div>
      </Section>

      {/* Anatomy Section */}
      <Section>
        <SectionHeader id="anatomy" onCopyLink={showToast}>
          Anatomy
        </SectionHeader>
        <p className="mt-2 leading-6 text-[var(--ds-gray-900)] xl:mt-4">
          Each pagination link consists of a chevron icon, a label
          (&quot;Previous&quot; or &quot;Next&quot;), and the page title. The
          label uses{" "}
          <code className="px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] text-sm">
            13px/18px
          </code>{" "}
          font size with normal weight, while the title uses{" "}
          <code className="px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] text-sm">
            16px/24px
          </code>{" "}
          with medium weight.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={anatomyCode}>
            <div className="flex flex-col gap-6">
              {/* Anatomy breakdown */}
              <div className="flex items-center gap-8">
                {/* Previous anatomy */}
                <div className="flex items-end">
                  <div className="flex flex-col items-center mr-2">
                    <span className="text-[10px] text-[var(--ds-gray-700)] mb-1">
                      20×20px
                    </span>
                    <span className="text-[var(--ds-gray-900)]">
                      <ChevronLeftIcon />
                    </span>
                  </div>
                  <div className="flex flex-col items-start ml-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] leading-[18px] font-normal text-[var(--ds-gray-900)]">
                        Previous
                      </span>
                      <span className="text-[10px] text-[var(--ds-gray-700)]">
                        13px/18px
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[16px] leading-[24px] font-medium text-[var(--ds-gray-1000)]">
                        Button
                      </span>
                      <span className="text-[10px] text-[var(--ds-gray-700)]">
                        16px/24px medium
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Accessibility Section */}
      <Section>
        <SectionHeader id="accessibility" onCopyLink={showToast}>
          Accessibility
        </SectionHeader>
        <p className="mt-2 leading-6 text-[var(--ds-gray-900)] xl:mt-4">
          The pagination component uses proper semantic markup with{" "}
          <code className="px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] text-sm">
            nav
          </code>{" "}
          element and{" "}
          <code className="px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] text-sm">
            aria-label=&quot;pagination&quot;
          </code>{" "}
          for screen readers. Each link includes a descriptive{" "}
          <code className="px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] text-sm">
            aria-label
          </code>{" "}
          that announces both the direction and the destination page title.
        </p>
        <div className="mt-4 xl:mt-7">
          <div className="p-6 border border-[var(--ds-gray-400)] rounded-lg bg-[var(--ds-background-100)]">
            <ul className="list-disc list-inside space-y-2 text-[var(--ds-gray-900)]">
              <li>
                Uses{" "}
                <code className="px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] text-sm">
                  &lt;nav&gt;
                </code>{" "}
                landmark element
              </li>
              <li>
                <code className="px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] text-sm">
                  aria-label=&quot;pagination&quot;
                </code>{" "}
                identifies the navigation purpose
              </li>
              <li>
                Each link has{" "}
                <code className="px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] text-sm">
                  aria-label
                </code>{" "}
                with full context (e.g., &quot;Go to previous page:
                Button&quot;)
              </li>
              <li>Hover states provide clear visual feedback</li>
              <li>
                Color contrast meets WCAG AA requirements for both label and
                title text
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
