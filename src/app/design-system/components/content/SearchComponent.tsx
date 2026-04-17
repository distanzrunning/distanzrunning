"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ChevronDown, Search, ArrowRight, ExternalLink } from "lucide-react";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { Note } from "@/components/ui/Note";
import { useToast } from "@/components/ui/Toast";
import IconButton from "@/components/ui/IconButton";

// ============================================================================
// Section header + copy link (matches other DS pages)
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
      style={{ scrollMarginTop: 32 }}
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
// Code preview (preview box + collapsible code, matches other DS pages)
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
        className="p-6 rounded-t-lg flex items-center justify-center min-h-[200px]"
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
// Sample data for the live modal
// ============================================================================

const SAMPLE_GROUPS: { heading: string; items: string[] }[] = [
  {
    heading: "Foundations",
    items: ["Introduction", "Colours", "Icons", "Typography", "Materials"],
  },
  {
    heading: "Components",
    items: ["Avatar", "Badge", "Button", "Input", "Modal", "Tooltip"],
  },
];

// ============================================================================
// Code strings
// ============================================================================

const triggerCode = `import { useState } from 'react';
import { CommandMenu } from '@/components/ui/CommandMenu';

export function SearchTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-8 w-[220px] items-center justify-between rounded border border-[var(--ds-gray-400)] bg-transparent pl-2 pr-1.5 text-sm text-[var(--ds-gray-700)] hover:bg-[var(--ds-background-200)]"
      >
        Search Stride
        <kbd
          className="ml-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded bg-[var(--ds-background-100)] px-1 text-[12px] text-[var(--ds-gray-900)]"
          style={{ boxShadow: '0 0 0 1px var(--ds-gray-alpha-400)' }}
        >
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>

      <CommandMenu open={open} onClose={() => setOpen(false)} placeholder="Search...">
        {/* CommandMenu.Group and CommandMenu.Item children */}
      </CommandMenu>
    </>
  );
}`;

const iconTriggerCode = `import { useState } from 'react';
import { Search } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';
import { CommandMenu } from '@/components/ui/CommandMenu';

export function SearchIconTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        variant="primary"
        aria-label="Search"
        onClick={() => setOpen(true)}
      >
        <Search className="w-5 h-5" />
      </IconButton>

      <IconButton
        variant="secondary"
        aria-label="Search"
        onClick={() => setOpen(true)}
      >
        <Search className="w-5 h-5" />
      </IconButton>

      <IconButton
        variant="tertiary"
        aria-label="Search"
        onClick={() => setOpen(true)}
      >
        <Search className="w-5 h-5" />
      </IconButton>

      <CommandMenu open={open} onClose={() => setOpen(false)} placeholder="Search...">
        {/* ... */}
      </CommandMenu>
    </>
  );
}`;

// ============================================================================
// Main component
// ============================================================================

export default function SearchComponent() {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div>
      {/* Overview */}
      <Section>
        <div className="py-12">
          <p className="text-[16px] leading-[1.6] text-textSubtle max-w-[720px] mb-6">
            Search is a header-level trigger paired with a modal that lets
            users jump between pages. The trigger can be a compact
            input-styled button showing the{" "}
            <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
              ⌘K
            </code>{" "}
            shortcut, or a square icon button. The modal is built on{" "}
            <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
              CommandMenu
            </code>{" "}
            and lists navigable destinations grouped by section.
          </p>

          <Note type="default" label="Algolia">
            Search on{" "}
            <a
              href="https://distanzrunning.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-textDefault hover:text-textSubtle inline-flex items-center gap-1"
            >
              distanzrunning.com
              <ExternalLink className="w-3.5 h-3.5" />
            </a>{" "}
            is powered by Algolia across articles, gear, and races. The
            design-system search here is a local, in-app navigator — no
            external index.
          </Note>
        </div>
      </Section>

      {/* Default trigger with shortcut */}
      <Section>
        <div className="py-12">
          <SectionHeader id="trigger" onCopyLink={showToast}>
            Trigger with shortcut
          </SectionHeader>
          <p className="text-[16px] leading-[1.6] text-textSubtle max-w-[720px] mt-4 mb-6">
            The primary placement in a page header. Click or press{" "}
            <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
              ⌘K
            </code>{" "}
            to open the modal.
          </p>

          <CodePreview componentCode={triggerCode}>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-8 w-[220px] cursor-pointer items-center justify-between rounded border border-[var(--ds-gray-400)] bg-transparent pl-2 pr-1.5 font-sans text-sm text-[var(--ds-gray-700)] outline-none transition-colors hover:bg-[var(--ds-background-200)]"
            >
              Search Stride
              <kbd
                className="ml-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded bg-[var(--ds-background-100)] px-1 font-sans text-[12px] leading-5 text-[var(--ds-gray-900)]"
                style={{ boxShadow: "0 0 0 1px var(--ds-gray-alpha-400)" }}
              >
                <span style={{ minWidth: "1em", display: "inline-block" }}>
                  ⌘
                </span>
                <span>K</span>
              </kbd>
            </button>
          </CodePreview>
        </div>
      </Section>

      {/* Icon triggers */}
      <Section>
        <div className="py-12">
          <SectionHeader id="icon-triggers" onCopyLink={showToast}>
            Icon triggers
          </SectionHeader>
          <p className="text-[16px] leading-[1.6] text-textSubtle max-w-[720px] mt-4 mb-6">
            When space is tight — or the shortcut would be out of place — use
            an icon button. Available in the three standard variants.
          </p>

          <CodePreview componentCode={iconTriggerCode}>
            <div className="flex items-center gap-4">
              <IconButton
                variant="primary"
                aria-label="Search"
                onClick={() => setOpen(true)}
              >
                <Search className="w-5 h-5" />
              </IconButton>
              <IconButton
                variant="secondary"
                aria-label="Search"
                onClick={() => setOpen(true)}
              >
                <Search className="w-5 h-5" />
              </IconButton>
              <IconButton
                variant="tertiary"
                aria-label="Search"
                onClick={() => setOpen(true)}
              >
                <Search className="w-5 h-5" />
              </IconButton>
            </div>
          </CodePreview>
        </div>
      </Section>

      <CommandMenu
        open={open}
        onClose={() => setOpen(false)}
        placeholder="Search..."
      >
        {SAMPLE_GROUPS.map((group) => (
          <CommandMenu.Group key={group.heading} heading={group.heading}>
            {group.items.map((label) => (
              <CommandMenu.Item
                key={label}
                icon={<ArrowRight className="w-4 h-4" />}
                onSelect={() => {
                  showToast(`Selected "${label}"`);
                  setOpen(false);
                }}
              >
                {label}
              </CommandMenu.Item>
            ))}
          </CommandMenu.Group>
        ))}
      </CommandMenu>
    </div>
  );
}
