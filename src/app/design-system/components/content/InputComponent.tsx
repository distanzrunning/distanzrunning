"use client";

import React, { useState, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import { Input } from "@/components/ui/Input";

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
// Inline SVG Icons for demos
// ============================================================================

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 6.5C1.5 3.73858 3.73858 1.5 6.5 1.5C9.26142 1.5 11.5 3.73858 11.5 6.5C11.5 9.26142 9.26142 11.5 6.5 11.5C3.73858 11.5 1.5 9.26142 1.5 6.5ZM6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C8.05503 13 9.47429 12.4489 10.5924 11.5283L14.2803 15.2803L14.8107 15.8107L15.8713 14.75L15.341 14.2197L11.6531 10.4676C12.4919 9.3731 13 8.00016 13 6.5C13 2.91015 10.0899 0 6.5 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UserIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.75 0C5.95507 0 4.5 1.45507 4.5 3.25C4.5 5.04493 5.95507 6.5 7.75 6.5C9.54493 6.5 11 5.04493 11 3.25C11 1.45507 9.54493 0 7.75 0ZM6 3.25C6 2.2835 6.7835 1.5 7.75 1.5C8.7165 1.5 9.5 2.2835 9.5 3.25C9.5 4.2165 8.7165 5 7.75 5C6.7835 5 6 4.2165 6 3.25ZM2.5 14.5V13.1709C3.37565 10.8126 5.40929 9.5 7.75 9.5C10.0907 9.5 12.1243 10.8126 13 13.1709V14.5H2.5ZM7.75 8C4.82977 8 2.23401 9.67994 1.06796 12.4646L1 12.6263V16H14.5V12.6263L14.432 12.4646C13.266 9.67994 10.6702 8 7.75 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GlobeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM8 1.5C7.53718 1.5 6.92338 1.92238 6.34075 3.18416C6.10335 3.69858 5.9019 4.30078 5.74863 4.97487H10.2514C10.0981 4.30078 9.89665 3.69858 9.65925 3.18416C9.07662 1.92238 8.46282 1.5 8 1.5ZM11.1853 6.47487C11.058 5.60313 10.8263 4.80337 10.5107 4.11842C10.3584 3.78817 10.186 3.47784 9.99319 3.19379C11.9665 4.01974 13.4188 5.81855 13.8298 7.98639L11.1853 6.47487ZM13.9779 9.21985L11.2197 7.96233C11.033 9.03498 10.6645 10.0073 10.1729 10.8009C9.95439 11.1538 9.71357 11.4771 9.45247 11.7637C11.7068 11.0269 13.458 9.35684 13.9779 9.21985ZM7.75503 14.4904C7.27684 14.4171 6.71675 13.9646 6.18988 12.8271C5.87608 12.1495 5.62154 11.3179 5.45394 10.3859L2.80797 9.18186C3.28167 11.5763 5.28014 13.4529 7.75503 14.4904ZM4.43475 8.00698L1.57361 6.70668C1.52418 7.1282 1.5 7.5602 1.5 8C1.5 8.24773 1.51233 8.49263 1.53642 8.73419L4.43475 8.00698ZM4.41494 6.50476L1.7973 5.3177C2.65721 3.38504 4.25852 1.8555 6.24042 1.09508C5.98202 1.36499 5.74241 1.67107 5.52313 2.01199C4.99024 2.84033 4.60071 3.84927 4.36906 4.96249L4.41494 6.50476ZM5.92907 7.19261L5.88233 5.61842L10.3833 5.9755C10.4547 6.44354 10.5 6.93462 10.5148 7.44439L5.92907 7.19261ZM5.97408 8.69276L10.4842 8.94106C10.3871 9.66498 10.2168 10.3393 9.98635 10.9403C9.52397 9.74163 8.33512 8.88447 6.94614 8.75662L5.97408 8.69276Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UploadIcon() {
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
        d="M7.25 10.75V11.5H8.75V10.75V6.56066L10.2197 8.03033L10.75 8.56066L11.8107 7.5L11.2803 6.96967L8.53033 4.21967C8.23744 3.92678 7.76256 3.92678 7.46967 4.21967L4.71967 6.96967L4.18934 7.5L5.25 8.56066L5.78033 8.03033L7.25 6.56066V10.75ZM14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Code Examples
// ============================================================================

const defaultCode = `import { Input } from '@/components/ui/Input';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <Input size="small" placeholder="Small" />
      <Input placeholder="Default" />
      <Input size="large" placeholder="Large" />
    </div>
  );
}`;

const prefixSuffixCode = `import { Input } from '@/components/ui/Input';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input prefix={<SearchIcon />} prefixStyling={false} placeholder="Search..." />
      <Input suffix={<UserIcon />} suffixStyling={false} placeholder="Username" />
      <Input prefix="https://" suffix=".com" placeholder="domain" />
      <Input
        prefix={<GlobeIcon />}
        prefixStyling={false}
        suffix={<SearchIcon />}
        suffixStyling={false}
        placeholder="Search domains..."
      />
    </div>
  );
}`;

const disabledCode = `import { Input } from '@/components/ui/Input';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input disabled placeholder="Disabled placeholder" />
      <Input disabled value="Disabled with value" />
      <Input disabled prefix={<SearchIcon />} prefixStyling={false} placeholder="Disabled prefix" />
      <Input disabled prefix="https://" suffix=".com" placeholder="domain" />
    </div>
  );
}`;

const searchCode = `import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  const [value, setValue] = useState("");

  return (
    <Input
      type="search"
      prefix={<SearchIcon />}
      prefixStyling={false}
      placeholder="Search..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => { if (e.key === "Escape") setValue(""); }}
    />
  );
}`;

const commandKCode = `import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  const [value, setValue] = useState("");

  const badge = value ? (
    <kbd>Esc</kbd>
  ) : (
    <span><kbd>\u2318</kbd><kbd>K</kbd></span>
  );

  return (
    <Input
      prefix={<SearchIcon />}
      prefixStyling={false}
      suffix={badge}
      suffixStyling={false}
      placeholder="Search..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => { if (e.key === "Escape") setValue(""); }}
    />
  );
}`;

const errorCode = `import { Input } from '@/components/ui/Input';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Input size="small" error errorMessage="An error message." placeholder="Small" />
      <Input error errorMessage="An error message." placeholder="Default" />
      <Input size="large" error errorMessage="An error message." placeholder="Large" />
    </div>
  );
}`;

const labelCode = `import { Input } from '@/components/ui/Input';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Input label="Email address" placeholder="you@example.com" />
  );
}`;

// ============================================================================
// Demo Components
// ============================================================================

function DefaultDemo() {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between gap-4 flex-initial">
      <Input size="small" placeholder="Small" />
      <Input placeholder="Default" />
      <Input size="large" placeholder="Large" />
    </div>
  );
}

function PrefixSuffixDemo() {
  return (
    <div className="flex flex-col items-start justify-start gap-6 flex-initial">
      <Input prefix={<UploadIcon />} placeholder="Default" />
      <Input suffix={<UploadIcon />} placeholder="Default" />
      <Input prefix="https://" suffix=".com" placeholder="Default" />
      <Input
        prefix={<UploadIcon />}
        prefixStyling={false}
        suffix={<UploadIcon />}
        suffixStyling={false}
        placeholder="Default"
      />
      <Input
        prefix="distanz/"
        suffix={<UploadIcon />}
        suffixStyling={false}
        placeholder="Default"
      />
    </div>
  );
}

function DisabledDemo() {
  return (
    <div className="flex flex-col items-start justify-start gap-4 flex-initial">
      <Input disabled placeholder="Disabled with placeholder" />
      <Input disabled value="Disabled with value" readOnly />
      <Input disabled prefix={<UploadIcon />} placeholder="Disabled with prefix" />
      <Input disabled suffix={<UploadIcon />} placeholder="Disabled with suffix" />
      <Input disabled prefix="https://" suffix=".com" placeholder="Disabled with prefix and suffix" />
      <Input
        disabled
        prefix={<UploadIcon />}
        prefixStyling={false}
        suffix={<UploadIcon />}
        suffixStyling={false}
        placeholder="Disabled with prefix and suffix"
      />
      <Input
        disabled
        prefix="distanz/"
        suffix={<UploadIcon />}
        suffixStyling={false}
        placeholder="Default"
      />
    </div>
  );
}

function SearchDemo() {
  const [value, setValue] = useState("");
  return (
    <div style={{ maxWidth: 400 }}>
      <Input
        type="search"
        prefix={<SearchIcon />}
        prefixStyling={false}
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setValue("");
        }}
      />
    </div>
  );
}

function CommandKDemo() {
  const [value, setValue] = useState("");

  const kbdStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 20,
    height: 20,
    padding: "0 4px",
    borderRadius: 4,
    border: "1px solid var(--ds-gray-alpha-400)",
    background: "var(--ds-background-200)",
    fontSize: 12,
    lineHeight: 1,
    fontFamily: "inherit",
    color: "var(--ds-gray-900)",
  };

  const badge = value ? (
    <kbd style={kbdStyle}>Esc</kbd>
  ) : (
    <span style={{ display: "flex", gap: 2 }}>
      <kbd style={kbdStyle}>{"\u2318"}</kbd>
      <kbd style={kbdStyle}>K</kbd>
    </span>
  );

  return (
    <div style={{ maxWidth: 400 }}>
      <Input
        prefix={<SearchIcon />}
        prefixStyling={false}
        suffix={badge}
        suffixStyling={false}
        placeholder="Search documentation..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setValue("");
        }}
      />
    </div>
  );
}

function ErrorDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 400 }}>
      <Input size="small" error errorMessage="An error message." placeholder="Small" />
      <Input error errorMessage="An error message." placeholder="Default" />
      <Input size="large" error errorMessage="An error message." placeholder="Large" />
    </div>
  );
}

function LabelDemo() {
  return (
    <div style={{ maxWidth: 400 }}>
      <Input label="Email address" placeholder="you@example.com" />
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function InputComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Section>
        <SectionHeader id="default" onCopyLink={showToast}>
          Default
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          Inputs at three sizes: <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">small</code>, <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">default</code>, and <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">large</code>. Controls height, font size, and padding.
        </p>
        <CodePreview componentCode={defaultCode}>
          <DefaultDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="prefix-and-suffix" onCopyLink={showToast}>
          Prefix and suffix
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          Inputs with prefix and suffix content. Use <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">prefixStyling=&#123;false&#125;</code> or <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">suffixStyling=&#123;false&#125;</code> to place icons inside the input without a border separator. Text prefixes like <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">https://</code> use the default bordered style.
        </p>
        <CodePreview componentCode={prefixSuffixCode}>
          <PrefixSuffixDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="disabled" onCopyLink={showToast}>
          Disabled
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          Disabled inputs with reduced opacity and <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">cursor: not-allowed</code>. Works with all variants including prefix, suffix, and text decorations.
        </p>
        <CodePreview componentCode={disabledCode}>
          <DisabledDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="search" onCopyLink={showToast}>
          Search
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          A search input with a magnifying glass icon prefix. Pressing <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">Escape</code> clears the value.
        </p>
        <CodePreview componentCode={searchCode}>
          <SearchDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="command-k" onCopyLink={showToast}>
          {"\u2318"}K
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          Search input with a keyboard shortcut badge in the suffix. Shows <kbd style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 3px", borderRadius: 3, border: "1px solid var(--ds-gray-alpha-400)", background: "var(--ds-background-200)", fontSize: 11, fontFamily: "inherit", color: "var(--ds-gray-900)" }}>{"\u2318"}</kbd><kbd style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 3px", borderRadius: 3, border: "1px solid var(--ds-gray-alpha-400)", background: "var(--ds-background-200)", fontSize: 11, fontFamily: "inherit", color: "var(--ds-gray-900)" }}>K</kbd> when empty and <kbd style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 3px", borderRadius: 3, border: "1px solid var(--ds-gray-alpha-400)", background: "var(--ds-background-200)", fontSize: 11, fontFamily: "inherit", color: "var(--ds-gray-900)" }}>Esc</kbd> when dirty.
        </p>
        <CodePreview componentCode={commandKCode}>
          <CommandKDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="error" onCopyLink={showToast}>
          Error
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          Inputs in an error state with a red border and an error message displayed below. Set <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">error</code> and <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">errorMessage</code> props.
        </p>
        <CodePreview componentCode={errorCode}>
          <ErrorDemo />
        </CodePreview>
      </Section>

      <Section>
        <SectionHeader id="label" onCopyLink={showToast}>
          Label
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          Input with a label above it. The label is automatically associated with the input for accessibility.
        </p>
        <CodePreview componentCode={labelCode}>
          <LabelDemo />
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
