"use client";

import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import { Button, ButtonLink } from "@/components/ui/Button";

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
// Upload Icon (for button examples)
// ============================================================================

function UploadIcon() {
  return (
    <svg
      height="var(--ds-icon-size, 16px)"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="var(--ds-icon-size, 16px)"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.70711 1.39644C8.31659 1.00592 7.68342 1.00592 7.2929 1.39644L2.21968 6.46966L1.68935 6.99999L2.75001 8.06065L3.28034 7.53032L7.25001 3.56065V14.25V15H8.75001V14.25V3.56065L12.7197 7.53032L13.25 8.06065L14.3107 6.99999L13.7803 6.46966L8.70711 1.39644Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      height="var(--ds-icon-size, 16px)"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="var(--ds-icon-size, 16px)"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.46966 13.7803L6.99999 14.3107L8.06065 13.25L7.53032 12.7197L3.56065 8.75001H14.25H15V7.25001H14.25H3.56065L7.53032 3.28034L8.06065 2.75001L6.99999 1.68935L6.46966 2.21968L1.39644 7.2929C1.00592 7.68342 1.00592 8.31659 1.39644 8.70711L6.46966 13.7803Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      height="var(--ds-icon-size, 16px)"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="var(--ds-icon-size, 16px)"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Code Examples
// ============================================================================

const sizesCode = `import { Button } from '@/components/ui/Button';

export function Component() {
  return (
    <div className="flex flex-col md:flex-row items-start gap-4">
      <Button size="small">Upload</Button>
      <Button>Upload</Button>
      <Button size="large">Upload</Button>
    </div>
  );
}`;

const allTypesCode = `import { Button } from '@/components/ui/Button';

export function Component() {
  return (
    <div className="flex flex-col gap-6">
      {/* Small */}
      <div className="flex items-center gap-3">
        <Button size="small">Upload</Button>
        <Button size="small" variant="error">Upload</Button>
        <Button size="small" variant="warning">Upload</Button>
        <Button size="small" variant="secondary">Upload</Button>
        <Button size="small" variant="tertiary">Upload</Button>
      </div>
      {/* Medium (default) */}
      <div className="flex items-center gap-3">
        <Button>Upload</Button>
        <Button variant="error">Upload</Button>
        <Button variant="warning">Upload</Button>
        <Button variant="secondary">Upload</Button>
        <Button variant="tertiary">Upload</Button>
      </div>
      {/* Large */}
      <div className="flex items-center gap-3">
        <Button size="large">Upload</Button>
        <Button size="large" variant="error">Upload</Button>
        <Button size="large" variant="warning">Upload</Button>
        <Button size="large" variant="secondary">Upload</Button>
        <Button size="large" variant="tertiary">Upload</Button>
      </div>
    </div>
  );
}`;

const shapesCode = `import { Button } from '@/components/ui/Button';

// Icons inherit size from --ds-icon-size CSS variable set by Button
function UploadIcon() {
  return (
    <svg
      height="var(--ds-icon-size, 16px)"
      width="var(--ds-icon-size, 16px)"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M8.70711 1.39644C8.31659 1.00592 7.68342 1.00592 7.2929 1.39644L2.21968 6.46966L1.68935 6.99999L2.75001 8.06065L3.28034 7.53032L7.25001 3.56065V14.25V15H8.75001V14.25V3.56065L12.7197 7.53032L13.25 8.06065L14.3107 6.99999L13.7803 6.46966L8.70711 1.39644Z" />
    </svg>
  );
}

export function Component() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Default variant - Square and Circle */}
      <div className="flex items-center justify-between">
        <Button shape="square" size="tiny" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="square" size="small" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="square" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="square" size="large" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="circle" size="tiny" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="circle" size="small" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="circle" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="circle" size="large" aria-label="Upload"><UploadIcon /></Button>
      </div>
      {/* Secondary variant - Square and Circle */}
      <div className="flex items-center justify-between">
        <Button shape="square" size="tiny" variant="secondary" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="square" size="small" variant="secondary" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="square" variant="secondary" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="square" size="large" variant="secondary" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="circle" size="tiny" variant="secondary" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="circle" size="small" variant="secondary" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="circle" variant="secondary" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="circle" size="large" variant="secondary" aria-label="Upload"><UploadIcon /></Button>
      </div>
      {/* Tertiary variant - Square and Circle */}
      <div className="flex items-center justify-between">
        <Button shape="square" size="tiny" variant="tertiary" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="square" size="small" variant="tertiary" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="square" variant="tertiary" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="square" size="large" variant="tertiary" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="circle" size="tiny" variant="tertiary" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="circle" size="small" variant="tertiary" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="circle" variant="tertiary" aria-label="Upload"><UploadIcon /></Button>
        <Button shape="circle" size="large" variant="tertiary" aria-label="Upload"><UploadIcon /></Button>
      </div>
    </div>
  );
}`;

const prefixSuffixCode = `import { Button } from '@/components/ui/Button';

// Icons inherit size from --ds-icon-size CSS variable set by Button
function ArrowLeftIcon() {
  return (
    <svg
      height="var(--ds-icon-size, 16px)"
      width="var(--ds-icon-size, 16px)"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M6.46966 13.7803L6.99999 14.3107L8.06065 13.25L7.53032 12.7197L3.56065 8.75001H14.25H15V7.25001H14.25H3.56065L7.53032 3.28034L8.06065 2.75001L6.99999 1.68935L6.46966 2.21968L1.39644 7.2929C1.00592 7.68342 1.00592 8.31659 1.39644 8.70711L6.46966 13.7803Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      height="var(--ds-icon-size, 16px)"
      width="var(--ds-icon-size, 16px)"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z" />
    </svg>
  );
}

export function Component() {
  return (
    <div className="flex flex-col md:flex-row items-start gap-4">
      <Button prefixIcon={<ArrowLeftIcon />}>Upload</Button>
      <Button suffixIcon={<ArrowRightIcon />}>Upload</Button>
      <Button prefixIcon={<ArrowLeftIcon />} suffixIcon={<ArrowRightIcon />}>Upload</Button>
    </div>
  );
}`;

const roundedCode = `import { Button } from '@/components/ui/Button';

export function Component() {
  return (
    <div className="flex flex-col md:flex-row items-start gap-4">
      <Button shape="rounded" shadow variant="secondary" size="small">Upload</Button>
      <Button shape="rounded" shadow variant="secondary">Upload</Button>
      <Button shape="rounded" shadow variant="secondary" size="large">Upload</Button>
    </div>
  );
}`;

const loadingCode = `import { Button } from '@/components/ui/Button';

export function Component() {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between gap-4 flex-initial">
      <Button loading size="small">Upload</Button>
      <Button loading>Upload</Button>
      <Button loading size="large">Upload</Button>
    </div>
  );
}`;

const disabledCode = `import { Button } from '@/components/ui/Button';

export function Component() {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between gap-4 flex-initial">
      <Button disabled size="small">Upload</Button>
      <Button disabled>Upload</Button>
      <Button disabled size="large">Upload</Button>
    </div>
  );
}`;

const linkCode = `import { ButtonLink } from '@/components/ui/Button';

export function Component() {
  return (
    <ButtonLink className="w-fit" href="#">Sign Up</ButtonLink>
  );
}`;

// ============================================================================
// Main Component
// ============================================================================

export default function ButtonComponentNew() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />

      {/* Sizes Section */}
      <Section>
        <SectionHeader id="sizes" onCopyLink={showToast}>
          Sizes
        </SectionHeader>
        <p className="mt-2 leading-6 text-[var(--ds-gray-900)] xl:mt-4">
          The default size is medium.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={sizesCode}>
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 flex-initial">
              <Button size="small">Upload</Button>
              <Button>Upload</Button>
              <Button size="large">Upload</Button>
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* All Types and Sizes Section */}
      <Section>
        <SectionHeader
          id="all-types-and-sizes-in-comparison"
          onCopyLink={showToast}
        >
          All Types and Sizes in comparison
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={allTypesCode}>
            <div className="flex flex-col gap-6">
              {/* Small */}
              <div className="flex items-center gap-3 flex-wrap">
                <Button size="small">Upload</Button>
                <Button size="small" variant="error">
                  Upload
                </Button>
                <Button size="small" variant="warning">
                  Upload
                </Button>
                <Button size="small" variant="secondary">
                  Upload
                </Button>
                <Button size="small" variant="tertiary">
                  Upload
                </Button>
              </div>
              {/* Medium (default) */}
              <div className="flex items-center gap-3 flex-wrap">
                <Button>Upload</Button>
                <Button variant="error">Upload</Button>
                <Button variant="warning">Upload</Button>
                <Button variant="secondary">Upload</Button>
                <Button variant="tertiary">Upload</Button>
              </div>
              {/* Large */}
              <div className="flex items-center gap-3 flex-wrap">
                <Button size="large">Upload</Button>
                <Button size="large" variant="error">
                  Upload
                </Button>
                <Button size="large" variant="warning">
                  Upload
                </Button>
                <Button size="large" variant="secondary">
                  Upload
                </Button>
                <Button size="large" variant="tertiary">
                  Upload
                </Button>
              </div>
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Shapes Section */}
      <Section>
        <SectionHeader id="shapes" onCopyLink={showToast}>
          Shapes
        </SectionHeader>
        <p className="mt-2 leading-6 text-[var(--ds-gray-900)] xl:mt-4">
          Icon-only buttons should include an{" "}
          <code className="px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] text-sm">
            aria-label
          </code>
          .
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={shapesCode}>
            <div className="flex flex-col gap-4 w-full">
              {/* Default variant - Square and Circle */}
              <div className="flex items-center justify-between">
                <Button shape="square" size="tiny" aria-label="Upload">
                  <UploadIcon />
                </Button>
                <Button shape="square" size="small" aria-label="Upload">
                  <UploadIcon />
                </Button>
                <Button shape="square" aria-label="Upload">
                  <UploadIcon />
                </Button>
                <Button shape="square" size="large" aria-label="Upload">
                  <UploadIcon />
                </Button>
                <Button shape="circle" size="tiny" aria-label="Upload">
                  <UploadIcon />
                </Button>
                <Button shape="circle" size="small" aria-label="Upload">
                  <UploadIcon />
                </Button>
                <Button shape="circle" aria-label="Upload">
                  <UploadIcon />
                </Button>
                <Button shape="circle" size="large" aria-label="Upload">
                  <UploadIcon />
                </Button>
              </div>
              {/* Secondary variant - Square and Circle */}
              <div className="flex items-center justify-between">
                <Button
                  shape="square"
                  size="tiny"
                  variant="secondary"
                  aria-label="Upload"
                >
                  <UploadIcon />
                </Button>
                <Button
                  shape="square"
                  size="small"
                  variant="secondary"
                  aria-label="Upload"
                >
                  <UploadIcon />
                </Button>
                <Button shape="square" variant="secondary" aria-label="Upload">
                  <UploadIcon />
                </Button>
                <Button
                  shape="square"
                  size="large"
                  variant="secondary"
                  aria-label="Upload"
                >
                  <UploadIcon />
                </Button>
                <Button
                  shape="circle"
                  size="tiny"
                  variant="secondary"
                  aria-label="Upload"
                >
                  <UploadIcon />
                </Button>
                <Button
                  shape="circle"
                  size="small"
                  variant="secondary"
                  aria-label="Upload"
                >
                  <UploadIcon />
                </Button>
                <Button shape="circle" variant="secondary" aria-label="Upload">
                  <UploadIcon />
                </Button>
                <Button
                  shape="circle"
                  size="large"
                  variant="secondary"
                  aria-label="Upload"
                >
                  <UploadIcon />
                </Button>
              </div>
              {/* Tertiary variant - Square and Circle */}
              <div className="flex items-center justify-between">
                <Button
                  shape="square"
                  size="tiny"
                  variant="tertiary"
                  aria-label="Upload"
                >
                  <UploadIcon />
                </Button>
                <Button
                  shape="square"
                  size="small"
                  variant="tertiary"
                  aria-label="Upload"
                >
                  <UploadIcon />
                </Button>
                <Button shape="square" variant="tertiary" aria-label="Upload">
                  <UploadIcon />
                </Button>
                <Button
                  shape="square"
                  size="large"
                  variant="tertiary"
                  aria-label="Upload"
                >
                  <UploadIcon />
                </Button>
                <Button
                  shape="circle"
                  size="tiny"
                  variant="tertiary"
                  aria-label="Upload"
                >
                  <UploadIcon />
                </Button>
                <Button
                  shape="circle"
                  size="small"
                  variant="tertiary"
                  aria-label="Upload"
                >
                  <UploadIcon />
                </Button>
                <Button shape="circle" variant="tertiary" aria-label="Upload">
                  <UploadIcon />
                </Button>
                <Button
                  shape="circle"
                  size="large"
                  variant="tertiary"
                  aria-label="Upload"
                >
                  <UploadIcon />
                </Button>
              </div>
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Prefix and Suffix Section */}
      <Section>
        <SectionHeader id="prefix-and-suffix" onCopyLink={showToast}>
          Prefix and suffix
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={prefixSuffixCode}>
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 flex-initial">
              <Button prefixIcon={<ArrowLeftIcon />}>Upload</Button>
              <Button suffixIcon={<ArrowRightIcon />}>Upload</Button>
              <Button
                prefixIcon={<ArrowLeftIcon />}
                suffixIcon={<ArrowRightIcon />}
              >
                Upload
              </Button>
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Rounded Section */}
      <Section>
        <SectionHeader id="rounded" onCopyLink={showToast}>
          Rounded
        </SectionHeader>
        <p className="mt-2 leading-6 text-[var(--ds-gray-900)] xl:mt-4">
          Combination of{" "}
          <code className="px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] text-sm">
            shape=&quot;rounded&quot;
          </code>{" "}
          and the{" "}
          <code className="px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] text-sm">
            shadow
          </code>{" "}
          prop, often used on marketing pages.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={roundedCode}>
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 flex-initial">
              <Button shape="rounded" shadow variant="secondary" size="small">
                Upload
              </Button>
              <Button shape="rounded" shadow variant="secondary">
                Upload
              </Button>
              <Button shape="rounded" shadow variant="secondary" size="large">
                Upload
              </Button>
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Loading Section */}
      <Section>
        <SectionHeader id="loading" onCopyLink={showToast}>
          Loading
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={loadingCode}>
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 flex-initial">
              <Button loading size="small">
                Upload
              </Button>
              <Button loading>Upload</Button>
              <Button loading size="large">
                Upload
              </Button>
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Disabled Section */}
      <Section>
        <SectionHeader id="disabled" onCopyLink={showToast}>
          Disabled
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={disabledCode}>
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 flex-initial">
              <Button disabled size="small">
                Upload
              </Button>
              <Button disabled>Upload</Button>
              <Button disabled size="large">
                Upload
              </Button>
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Link Section */}
      <Section>
        <SectionHeader id="link" onCopyLink={showToast}>
          Link
        </SectionHeader>
        <p className="mt-2 leading-6 text-[var(--ds-gray-900)] xl:mt-4">
          Use{" "}
          <code className="px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] text-sm">
            ButtonLink
          </code>{" "}
          for links with the same props as{" "}
          <code className="px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] text-sm">
            Button
          </code>
          .
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={linkCode}>
            <ButtonLink className="w-fit" href="#">
              Sign Up
            </ButtonLink>
          </CodePreview>
        </div>
      </Section>
    </>
  );
}
