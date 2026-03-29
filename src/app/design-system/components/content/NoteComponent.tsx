"use client";

import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import { Note } from "@/components/ui/Note";
import { Button } from "@/components/ui/Button";

// Toast notification for copy confirmation
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

// Global toast state management
let toastTimeout: NodeJS.Timeout | null = null;

function useToast() {
  const [toast, setToast] = useState({ message: "", isVisible: false });

  const showToast = useCallback((message: string) => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    setToast({ message, isVisible: true });
    toastTimeout = setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 2000);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return { toast, showToast, dismissToast };
}

// Link icon for section headers
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

// Header height and section padding constants (must match ContentWithTOC)
const HEADER_HEIGHT = 112;
const SECTION_PADDING = 48;

// Section header with link icon on hover
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

    // Copy URL with hash to clipboard
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    onCopyLink?.("Copied link to clipboard");

    // Update URL
    window.history.pushState(null, "", `#${id}`);

    // Scroll to correct position (accounting for header and padding)
    const element = document.getElementById(id);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.scrollY;
      const scrollTarget = absoluteElementTop - HEADER_HEIGHT - SECTION_PADDING;

      window.scrollTo({
        top: scrollTarget,
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
      <h2 className="text-[24px] leading-[1.2] font-semibold text-textDefault">
        <div className="absolute left-0 top-[8px] opacity-0 outline-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
          <LinkIcon />
        </div>
        {children}
      </h2>
    </button>
  );
}

// Render a single Shiki token with dual theme support
function RenderShikiToken({ token }: { token: DualThemeToken }) {
  const style = getTokenStyle(token);
  return <span style={style}>{token.content}</span>;
}

// Copy icon
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

// Check icon for copy confirmation
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

// Animated copy button with scale + opacity transition
function CopyIconButton({ copied }: { copied: boolean }) {
  return (
    <div className="relative w-4 h-4">
      <span
        className={`absolute inset-0 transition-all duration-150 ease-out ${
          copied ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
      >
        <CopyIcon />
      </span>
      <span
        className={`absolute inset-0 transition-all duration-150 ease-out ${
          copied ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <CheckIcon />
      </span>
    </div>
  );
}

// Code Preview component with Shiki syntax highlighting
interface CodePreviewProps {
  children: React.ReactNode;
  componentCode: string;
}

function CodePreview({ children, componentCode }: CodePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use Shiki for syntax highlighting
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
      {/* Preview area */}
      <div className="p-6" style={{ background: "var(--ds-background-100)" }}>
        {children}
      </div>

      {/* Accordion trigger */}
      <div style={{ background: "var(--ds-background-200)" }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-textDefault border-t border-[var(--ds-gray-400)]"
        >
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>

        {/* Collapsible code section */}
        {isOpen && (
          <div
            className="border-t border-[var(--ds-gray-400)] overflow-x-auto font-mono text-[13px]"
            style={{ background: "var(--ds-background-100)" }}
          >
            <div className="relative group">
              {/* Floating copy button */}
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded border border-[var(--ds-gray-400)] opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-[var(--ds-background-200)] hover:bg-[var(--ds-gray-100)]"
                aria-label="Copy code"
              >
                <CopyIconButton copied={copied} />
              </button>

              {/* Code content */}
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
// Upgrade Button (reusable action)
// ============================================================================

function UpgradeButton() {
  return (
    <Button size="small">
      Upgrade
    </Button>
  );
}

// ============================================================================
// Code Examples
// ============================================================================

const defaultCode = `import { Note } from '@/components/ui/Note';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Note size="small">A small note.</Note>
      <Note>A default note.</Note>
      <Note size="large">A large note.</Note>
    </div>
  );
}`;

const actionCode = `import { Note } from '@/components/ui/Note';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-start justify-start gap-6 flex-initial">
      <Note action={<button>Upgrade</button>}>
        This note details some information.
      </Note>
      <Note action={<button>Upgrade</button>}>
        This note details a large amount information that could potentially wrap
        into two or more lines, forcing the height of the Note to be larger.
      </Note>
    </div>
  );
}`;

const successCode = `import { Note } from '@/components/ui/Note';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Note type="success">
      This note details some success information.
    </Note>
  );
}`;

const errorCode = `import { Note } from '@/components/ui/Note';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Note type="error">
      This note details some error information.
    </Note>
  );
}`;

const warningCode = `import { Note } from '@/components/ui/Note';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Note type="warning">
      This note details some warning information.
    </Note>
  );
}`;

const secondaryCode = `import { Note } from '@/components/ui/Note';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Note type="secondary">
      This note details some secondary information.
    </Note>
  );
}`;

const violetCode = `import { Note } from '@/components/ui/Note';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Note type="violet">
      This note details some violet information.
    </Note>
  );
}`;

const cyanCode = `import { Note } from '@/components/ui/Note';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Note type="cyan">
      This note details some cyan information.
    </Note>
  );
}`;

const disabledCode = `import { Note } from '@/components/ui/Note';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Note type="warning" fill disabled action={<button>Upgrade</button>}>
      This filled note details some warning information.
    </Note>
  );
}`;

const labelsCode = `import { Note } from '@/components/ui/Note';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <Note type="success">Default label with icon.</Note>
      <Note type="warning" label="Warning">Custom label text.</Note>
      <Note type="error" label={false}>No label or icon.</Note>
    </div>
  );
}`;

// ============================================================================
// Type Section Helper
// ============================================================================

function TypeSection({
  id,
  title,
  type,
  code,
  onCopyLink,
}: {
  id: string;
  title: string;
  type: "success" | "error" | "warning" | "secondary" | "violet" | "cyan";
  code: string;
  onCopyLink: (message: string) => void;
}) {
  const typeName = type;
  return (
    <Section>
      <SectionHeader id={id} onCopyLink={onCopyLink}>
        {title}
      </SectionHeader>
      <CodePreview componentCode={code}>
        <div className="flex flex-col gap-4">
          {/* Outline */}
          <Note type={typeName}>
            This note details some {typeName} information.
          </Note>
          {/* Outline + action */}
          <Note type={typeName} action={<UpgradeButton />}>
            This note details some {typeName} information.
          </Note>
          {/* Outline + action + link */}
          <Note type={typeName} action={<UpgradeButton />}>
            This note details some {typeName} information. Check{" "}
            <a href="#" className="ds-note-link">
              the documentation
            </a>{" "}
            to learn more.
          </Note>
          {/* Filled */}
          <Note type={typeName} fill>
            This filled note details some {typeName} information.
          </Note>
          {/* Filled + action */}
          <Note type={typeName} fill action={<UpgradeButton />}>
            This filled note details some {typeName} information.
          </Note>
          {/* Filled + action + link */}
          <Note type={typeName} fill action={<UpgradeButton />}>
            This filled note details some {typeName} information. Check{" "}
            <a href="#" className="ds-note-link">
              the documentation
            </a>{" "}
            to learn more.
          </Note>
        </div>
      </CodePreview>
    </Section>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function NoteComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />

      {/* 1. Default */}
      <Section>
        <SectionHeader id="default" onCopyLink={showToast}>
          Default
        </SectionHeader>
        <CodePreview componentCode={defaultCode}>
          <div className="flex flex-col md:flex-row items-start justify-start gap-6 flex-initial">
            <Note size="small">A small note.</Note>
            <Note>A default note.</Note>
            <Note size="large">A large note.</Note>
          </div>
        </CodePreview>
      </Section>

      {/* 2. Action */}
      <Section>
        <SectionHeader id="action" onCopyLink={showToast}>
          Action
        </SectionHeader>
        <CodePreview componentCode={actionCode}>
          <div className="flex flex-col items-start justify-start gap-6 flex-initial">
            <Note action={<UpgradeButton />}>
              This note details some information.
            </Note>
            <Note action={<UpgradeButton />}>
              This note details a large amount information that could potentially wrap
              into two or more lines, forcing the height of the Note to be larger.
            </Note>
          </div>
        </CodePreview>
      </Section>

      {/* 3. Success */}
      <TypeSection
        id="success"
        title="Success"
        type="success"
        code={successCode}
        onCopyLink={showToast}
      />

      {/* 4. Error */}
      <TypeSection
        id="error"
        title="Error"
        type="error"
        code={errorCode}
        onCopyLink={showToast}
      />

      {/* 5. Warning */}
      <TypeSection
        id="warning"
        title="Warning"
        type="warning"
        code={warningCode}
        onCopyLink={showToast}
      />

      {/* 6. Secondary */}
      <TypeSection
        id="secondary"
        title="Secondary"
        type="secondary"
        code={secondaryCode}
        onCopyLink={showToast}
      />

      {/* 7. Violet */}
      <TypeSection
        id="violet"
        title="Violet"
        type="violet"
        code={violetCode}
        onCopyLink={showToast}
      />

      {/* 8. Cyan */}
      <TypeSection
        id="cyan"
        title="Cyan"
        type="cyan"
        code={cyanCode}
        onCopyLink={showToast}
      />

      {/* 9. Disabled */}
      <Section>
        <SectionHeader id="disabled" onCopyLink={showToast}>
          Disabled
        </SectionHeader>
        <CodePreview componentCode={disabledCode}>
          <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
            <Note type="warning" fill disabled action={<UpgradeButton />}>
              This note details a warning.
            </Note>
            <Note type="warning" fill disabled action={<UpgradeButton />}>
              This filled note details some success information. Check{" "}
              <a href="#" className="ds-note-link">
                the documentation
              </a>{" "}
              to learn more.
            </Note>
          </div>
        </CodePreview>
      </Section>

      {/* 10. Labels */}
      <Section>
        <SectionHeader id="labels" onCopyLink={showToast}>
          Labels
        </SectionHeader>

        {/* Default label (icon variants) */}
        <h3 className="text-[16px] font-semibold text-textDefault mt-6 mb-4">
          Default label
        </h3>
        <div className="flex flex-col gap-4 mb-8">
          <Note type="default">This note details some default information.</Note>
          <Note type="success">This note details some success information.</Note>
          <Note type="error">This note details some error information.</Note>
          <Note type="warning">This note details some warning information.</Note>
          <Note type="secondary">This note details some secondary information.</Note>
          <Note type="violet">This note details some violet information.</Note>
          <Note type="cyan">This note details some cyan information.</Note>
        </div>

        {/* Custom label */}
        <h3 className="text-[16px] font-semibold text-textDefault mt-6 mb-4">
          Custom label
        </h3>
        <div className="flex flex-col gap-4 mb-8">
          <Note type="default" label="Note">This note details some default information.</Note>
          <Note type="success" label="Success">This note details some success information.</Note>
          <Note type="error" label="Error">This note details some error information.</Note>
          <Note type="warning" label="Warning">This note details some warning information.</Note>
          <Note type="secondary" label="Secondary">This note details some secondary information.</Note>
          <Note type="violet" label="Violet">This note details some violet information.</Note>
          <Note type="cyan" label="Cyan">This note details some cyan information.</Note>
        </div>

        {/* No label */}
        <h3 className="text-[16px] font-semibold text-textDefault mt-6 mb-4">
          No label
        </h3>
        <CodePreview componentCode={labelsCode}>
          <div className="flex flex-col gap-4">
            <Note type="default" label={false}>This note details some default information.</Note>
            <Note type="success" label={false}>This note details some success information.</Note>
            <Note type="error" label={false}>This note details some error information.</Note>
            <Note type="warning" label={false}>This note details some warning information.</Note>
            <Note type="secondary" label={false}>This note details some secondary information.</Note>
            <Note type="violet" label={false}>This note details some violet information.</Note>
            <Note type="cyan" label={false}>This note details some cyan information.</Note>
          </div>
        </CodePreview>
      </Section>
    </>
  );
}
