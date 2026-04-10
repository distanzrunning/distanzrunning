"use client";

import React, { useState, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import {
  ProjectBanner,
  ProjectBannerAction,
} from "@/components/ui/ProjectBanner";
import * as Tooltip from "@radix-ui/react-tooltip";

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
// Icons
// ============================================================================

function ShieldCheckIcon() {
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
        d="M3.5 9.52717V4.057C3.69054 4.00405 3.8926 3.95131 4.10681 3.8954L4.10684 3.89539C4.25396 3.85699 4.40682 3.81709 4.5656 3.7746C5.15243 3.61758 5.79596 3.43066 6.38899 3.17017C6.97334 2.91351 7.55664 2.56529 8 2.05704C8.44336 2.56529 9.02666 2.91351 9.61101 3.17017C10.204 3.43066 10.8476 3.61758 11.4344 3.7746C11.5932 3.81709 11.746 3.85699 11.8932 3.89539C12.1074 3.9513 12.3094 4.00405 12.5 4.057V9.52717C12.5 10.9221 11.7257 12.2018 10.49 12.849L8 14.1533L5.50997 12.849C4.27429 12.2018 3.5 10.9221 3.5 9.52717ZM6.87802 1.06132C7.10537 0.796772 7.25 0.467199 7.25 0H8.75C8.75 0.467199 8.89463 0.796772 9.12198 1.06132C9.3643 1.34329 9.73045 1.58432 10.2142 1.79681C10.6962 2.00853 11.2465 2.17155 11.8221 2.32558C11.9557 2.36133 12.0926 2.39704 12.2305 2.43301L12.2307 2.43305C12.6631 2.54586 13.1054 2.66124 13.4872 2.78849L14 2.95943V3.5V9.52717C14 11.4801 12.916 13.2716 11.186 14.1778L8.34801 15.6644L8 15.8467L7.65199 15.6644L4.81396 14.1778C3.084 13.2716 2 11.4801 2 9.52717V3.5V2.95943L2.51283 2.78849C2.89458 2.66124 3.33687 2.54586 3.76932 2.43305L3.7694 2.43303C3.90732 2.39706 4.04424 2.36134 4.17787 2.32558C4.75351 2.17155 5.30375 2.00853 5.78576 1.79681C6.26955 1.58432 6.6357 1.34329 6.87802 1.06132ZM10.5303 7.53033L11.0607 7L10 5.93934L9.46967 6.46967L7 8.93934L6.53033 8.46967L6 7.93934L4.93934 9L5.46967 9.53033L6.46967 10.5303C6.76256 10.8232 7.23744 10.8232 7.53033 10.5303L10.5303 7.53033Z"
        fill="currentColor"
      />
    </svg>
  );
}

function RollbackIcon() {
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
        d="M13.5 8C13.5 4.96643 11.0257 2.5 7.96452 2.5C5.42843 2.5 3.29365 4.19393 2.63724 6.5H5.25H6V8H5.25H0.75C0.335787 8 0 7.66421 0 7.25V2.75V2H1.5V2.75V5.23347C2.57851 2.74164 5.06835 1 7.96452 1C11.8461 1 15 4.13001 15 8C15 11.87 11.8461 15 7.96452 15C5.62368 15 3.54872 13.8617 2.27046 12.1122L1.828 11.5066L3.03915 10.6217L3.48161 11.2273C4.48831 12.6051 6.12055 13.5 7.96452 13.5C11.0257 13.5 13.5 11.0336 13.5 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WarningTriangleIcon() {
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
        d="M8.55846 2H7.44148L1.88975 13.5H14.1102L8.55846 2ZM9.90929 1.34788C9.65902 0.829456 9.13413 0.5 8.55846 0.5H7.44148C6.86581 0.5 6.34092 0.829454 6.09065 1.34787L0.192608 13.5653C-0.127943 14.2293 0.355835 15 1.09316 15H14.9068C15.6441 15 16.1279 14.2293 15.8073 13.5653L9.90929 1.34788ZM8.74997 4.75V5.5V8V8.75H7.24997V8V5.5V4.75H8.74997ZM7.99997 12C8.55226 12 8.99997 11.5523 8.99997 11C8.99997 10.4477 8.55226 10 7.99997 10C7.44769 10 6.99997 10.4477 6.99997 11C6.99997 11.5523 7.44769 12 7.99997 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Code Examples
// ============================================================================

const successCode = `import { ProjectBanner, ProjectBannerAction } from '@/components/ui/ProjectBanner';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <ProjectBanner
      variant="success"
      icon={<ShieldCheckIcon />}
      action={
        <ProjectBannerAction variant="success" href="/">
          Disable
        </ProjectBannerAction>
      }
    >
      Attack Challenge Mode is enabled for this project
    </ProjectBanner>
  );
}`;

const warningCode = `import { ProjectBanner, ProjectBannerAction } from '@/components/ui/ProjectBanner';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <ProjectBanner
      variant="warning"
      icon={<RollbackIcon />}
      action={
        <ProjectBannerAction variant="warning" onClick={() => {}}>
          Undo Rollback
        </ProjectBannerAction>
      }
    >
      This project was rolled back by{' '}
      <span
        className="underline decoration-dashed underline-offset-[5px]"
        title="johnphamous"
      >
        @johnphamous
      </span>
    </ProjectBanner>
  );
}`;

const errorCode = `import { ProjectBanner, ProjectBannerAction } from '@/components/ui/ProjectBanner';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <ProjectBanner
      variant="error"
      icon={<WarningTriangleIcon />}
      action={
        <ProjectBannerAction variant="error" href="/">
          Pay Invoices
        </ProjectBannerAction>
      }
    >
      Payment failed, pay any open invoices before your account is shut down
    </ProjectBanner>
  );
}`;

// ============================================================================
// Demo Components
// ============================================================================

function SuccessDemo() {
  return (
    <ProjectBanner
      variant="success"
      icon={<ShieldCheckIcon />}
      action={
        <ProjectBannerAction variant="success" href="/">
          Disable
        </ProjectBannerAction>
      }
    >
      Attack Challenge Mode is enabled for this project
    </ProjectBanner>
  );
}

function WarningDemo() {
  return (
    <Tooltip.Provider delayDuration={200}>
      <ProjectBanner
        variant="warning"
        icon={<RollbackIcon />}
        action={
          <ProjectBannerAction variant="warning" onClick={() => {}}>
            Undo Rollback
          </ProjectBannerAction>
        }
      >
        This project was rolled back by{" "}
        <Tooltip.Root>
          <Tooltip.Trigger
            className="underline decoration-dashed underline-offset-[5px] cursor-default bg-transparent border-none p-0 font-inherit text-inherit text-[inherit] leading-inherit outline-none"
          >
            @johnphamous
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="z-50 rounded-md px-3 py-1.5 text-xs leading-none animate-in fade-in-0 zoom-in-95"
              style={{
                background: "var(--ds-gray-1000)",
                color: "var(--ds-background-100)",
                boxShadow: "var(--ds-shadow-tooltip)",
              }}
              side="top"
              sideOffset={5}
            >
              johnphamous
              <Tooltip.Arrow
                style={{ fill: "var(--ds-gray-1000)" }}
              />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </ProjectBanner>
    </Tooltip.Provider>
  );
}

function ErrorDemo() {
  return (
    <ProjectBanner
      variant="error"
      icon={<WarningTriangleIcon />}
      action={
        <ProjectBannerAction variant="error" href="/">
          Pay Invoices
        </ProjectBannerAction>
      }
    >
      Payment failed, pay any open invoices before your account is shut down
    </ProjectBanner>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function ProjectBannerComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Section>
        <SectionHeader id="success" onCopyLink={showToast}>
          Success
        </SectionHeader>
        <p
          className="mt-2 leading-6 xl:mt-4"
          style={{ color: "var(--ds-gray-900)" }}
        >
          For positive, temporary mitigations put in place to protect a project,
          e.g., Attack Challenge Mode
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={successCode}>
            <SuccessDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="warning" onCopyLink={showToast}>
          Warning
        </SectionHeader>
        <p
          className="mt-2 leading-6 xl:mt-4"
          style={{ color: "var(--ds-gray-900)" }}
        >
          When a project is in an exceptional state which requires non-immediate
          action to exit, e.g., during a rollback
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={warningCode}>
            <WarningDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="error" onCopyLink={showToast}>
          Error
        </SectionHeader>
        <p
          className="mt-2 leading-6 xl:mt-4"
          style={{ color: "var(--ds-gray-900)" }}
        >
          When a project is approaching or experiencing critical downtime which
          requires immediate attention, e.g., when payment is overdue
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={errorCode}>
            <ErrorDemo />
          </CodePreview>
        </div>
      </Section>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />
    </>
  );
}
