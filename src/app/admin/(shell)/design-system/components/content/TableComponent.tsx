"use client";

import React, { useState, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "../ContentWithTOC";
import { ComponentRef } from "../ComponentRef";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

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

  const tokenizedLines = useShikiHighlighter(componentCode, "tsx", undefined, isOpen);
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
    <div className="border border-borderDefault rounded-lg">
      <div
        className="p-6 rounded-t-lg"
        style={{ background: "hsl(var(--color-surface))" }}
      >
        {children}
      </div>
      <div
        className="rounded-b-lg overflow-hidden"
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
// Code Examples
// ============================================================================

const basicCode = `import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Col 1</TableHead>
          <TableHead>Col 2</TableHead>
          <TableHead>Col 3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Value 1.1</TableCell>
          <TableCell>Value 1.2</TableCell>
          <TableCell>Value 1.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 2.1</TableCell>
          <TableCell>Value 2.2</TableCell>
          <TableCell>Value 2.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 3.1</TableCell>
          <TableCell>Value 3.2</TableCell>
          <TableCell>Value 3.3</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`;

const stripedCode = `import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Table striped>
      <TableHeader>
        <TableRow>
          <TableHead>Col 1</TableHead>
          <TableHead>Col 2</TableHead>
          <TableHead>Col 3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Value 1.1</TableCell>
          <TableCell>Value 1.2</TableCell>
          <TableCell>Value 1.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 2.1</TableCell>
          <TableCell>Value 2.2</TableCell>
          <TableCell>Value 2.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 3.1</TableCell>
          <TableCell>Value 3.2</TableCell>
          <TableCell>Value 3.3</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`;

const borderedCode = `import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Table bordered>
      <TableHeader>
        <TableRow>
          <TableHead>Col 1</TableHead>
          <TableHead>Col 2</TableHead>
          <TableHead>Col 3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Value 1.1</TableCell>
          <TableCell>Value 1.2</TableCell>
          <TableCell>Value 1.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 2.1</TableCell>
          <TableCell>Value 2.2</TableCell>
          <TableCell>Value 2.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 3.1</TableCell>
          <TableCell>Value 3.2</TableCell>
          <TableCell>Value 3.3</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`;

const interactiveCode = `import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Table interactive>
      <TableHeader>
        <TableRow>
          <TableHead>Col 1</TableHead>
          <TableHead>Col 2</TableHead>
          <TableHead>Col 3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Value 1.1</TableCell>
          <TableCell>Value 1.2</TableCell>
          <TableCell>Value 1.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 2.1</TableCell>
          <TableCell>Value 2.2</TableCell>
          <TableCell>Value 2.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 3.1</TableCell>
          <TableCell>Value 3.2</TableCell>
          <TableCell>Value 3.3</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`;

const fullFeaturedCode = `import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from '@/components/ui/Table';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Table striped interactive>
      <colgroup>
        <col style={{ width: '44%' }} />
        <col style={{ width: '22%' }} />
        <col style={{ width: '22%' }} />
        <col style={{ width: '11%' }} />
      </colgroup>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Charge</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Brake Pads Set</TableCell>
          <TableCell>100 sets</TableCell>
          <TableCell>$50 per set</TableCell>
          <TableCell>$5,000.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Oil Filters</TableCell>
          <TableCell>200 filters</TableCell>
          <TableCell>$10 per filter</TableCell>
          <TableCell>$2,000.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Car Batteries</TableCell>
          <TableCell>50 batteries</TableCell>
          <TableCell>$100 per battery</TableCell>
          <TableCell>$5,000.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Headlight Bulbs</TableCell>
          <TableCell>300 bulbs</TableCell>
          <TableCell>$15 per bulb</TableCell>
          <TableCell>$4,500.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Windshield Wipers</TableCell>
          <TableCell>250 pairs</TableCell>
          <TableCell>$20 per pair</TableCell>
          <TableCell>$5,000.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Spark Plugs</TableCell>
          <TableCell>500 sets</TableCell>
          <TableCell>$5 per set</TableCell>
          <TableCell>$2,500.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="text-gray-1000">
            Subtotal
          </TableCell>
          <TableCell className="text-gray-1000">$24,000.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}`;

const virtualizedCode = `import { useState } from 'react';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';
import type { JSX } from 'react';

const COLLAPSED_ROWS = 9;

export function Component({ data }: { data: string[][] }): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? data : data.slice(0, COLLAPSED_ROWS);
  const collapsible = data.length > COLLAPSED_ROWS;

  return (
    <div className="relative">
      <Table striped interactive>
        <colgroup>
          <col style={{ width: '44%' }} />
          <col style={{ width: '22%' }} />
          <col style={{ width: '22%' }} />
          <col style={{ width: '11%' }} />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Charge</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Only the visible window is mounted while collapsed. */}
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {collapsible && (expanded ? (
        <div className="sticky bottom-4 mt-3 flex justify-center">
          <Button variant="secondary" size="small" className="!rounded-full whitespace-nowrap" onClick={() => setExpanded(false)}>
            Show Less
            <ChevronDown className="ml-1 h-4 w-4 rotate-180" />
          </Button>
        </div>
      ) : (
        <>
          <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[hsl(var(--color-surface))] to-transparent" />
          <div className="absolute inset-x-0 bottom-4 flex justify-center">
            <Button variant="secondary" size="small" className="!rounded-full whitespace-nowrap" onClick={() => setExpanded(true)}>
              Show More
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </>
      ))}
    </div>
  );
}`;

// ============================================================================
// Demo Components
// ============================================================================

function BasicDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Col 1</TableHead>
          <TableHead>Col 2</TableHead>
          <TableHead>Col 3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Value 1.1</TableCell>
          <TableCell>Value 1.2</TableCell>
          <TableCell>Value 1.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 2.1</TableCell>
          <TableCell>Value 2.2</TableCell>
          <TableCell>Value 2.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 3.1</TableCell>
          <TableCell>Value 3.2</TableCell>
          <TableCell>Value 3.3</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function StripedDemo() {
  return (
    <Table striped>
      <TableHeader>
        <TableRow>
          <TableHead>Col 1</TableHead>
          <TableHead>Col 2</TableHead>
          <TableHead>Col 3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Value 1.1</TableCell>
          <TableCell>Value 1.2</TableCell>
          <TableCell>Value 1.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 2.1</TableCell>
          <TableCell>Value 2.2</TableCell>
          <TableCell>Value 2.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 3.1</TableCell>
          <TableCell>Value 3.2</TableCell>
          <TableCell>Value 3.3</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function BorderedDemo() {
  return (
    <Table bordered>
      <TableHeader>
        <TableRow>
          <TableHead>Col 1</TableHead>
          <TableHead>Col 2</TableHead>
          <TableHead>Col 3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Value 1.1</TableCell>
          <TableCell>Value 1.2</TableCell>
          <TableCell>Value 1.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 2.1</TableCell>
          <TableCell>Value 2.2</TableCell>
          <TableCell>Value 2.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 3.1</TableCell>
          <TableCell>Value 3.2</TableCell>
          <TableCell>Value 3.3</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function InteractiveDemo() {
  return (
    <Table interactive>
      <TableHeader>
        <TableRow>
          <TableHead>Col 1</TableHead>
          <TableHead>Col 2</TableHead>
          <TableHead>Col 3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Value 1.1</TableCell>
          <TableCell>Value 1.2</TableCell>
          <TableCell>Value 1.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 2.1</TableCell>
          <TableCell>Value 2.2</TableCell>
          <TableCell>Value 2.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Value 3.1</TableCell>
          <TableCell>Value 3.2</TableCell>
          <TableCell>Value 3.3</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function FullFeaturedDemo() {
  return (
    <Table striped interactive>
      <colgroup>
        <col style={{ width: "44%" }} />
        <col style={{ width: "22%" }} />
        <col style={{ width: "22%" }} />
        <col style={{ width: "11%" }} />
      </colgroup>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Charge</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Brake Pads Set</TableCell>
          <TableCell>100 sets</TableCell>
          <TableCell>$50 per set</TableCell>
          <TableCell>$5,000.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Oil Filters</TableCell>
          <TableCell>200 filters</TableCell>
          <TableCell>$10 per filter</TableCell>
          <TableCell>$2,000.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Car Batteries</TableCell>
          <TableCell>50 batteries</TableCell>
          <TableCell>$100 per battery</TableCell>
          <TableCell>$5,000.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Headlight Bulbs</TableCell>
          <TableCell>300 bulbs</TableCell>
          <TableCell>$15 per bulb</TableCell>
          <TableCell>$4,500.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Windshield Wipers</TableCell>
          <TableCell>250 pairs</TableCell>
          <TableCell>$20 per pair</TableCell>
          <TableCell>$5,000.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Spark Plugs</TableCell>
          <TableCell>500 sets</TableCell>
          <TableCell>$5 per set</TableCell>
          <TableCell>$2,500.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="text-gray-1000">
            Subtotal
          </TableCell>
          <TableCell className="text-gray-1000">$24,000.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

// Larger dataset for the virtualized preview (cycles the six base products).
const VIRTUAL_BASE = [
  ["Brake Pads Set", "100 sets", "$50 per set", "$5,000.00"],
  ["Oil Filters", "200 filters", "$10 per filter", "$2,000.00"],
  ["Car Batteries", "50 batteries", "$100 per battery", "$5,000.00"],
  ["Headlight Bulbs", "300 bulbs", "$15 per bulb", "$4,500.00"],
  ["Windshield Wipers", "250 pairs", "$20 per pair", "$5,000.00"],
  ["Spark Plugs", "500 sets", "$5 per set", "$2,500.00"],
];
const VIRTUAL_DATA = Array.from(
  { length: 36 },
  (_, i) => VIRTUAL_BASE[i % VIRTUAL_BASE.length],
);
const COLLAPSED_ROWS = 9;

// Renders a fixed preview window of the dataset; "Show More" mounts the rest.
// Only the visible rows are in the DOM while collapsed — the off-screen rows
// are never rendered, mirroring Geist's windowed body.
function VirtualizedDemo() {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? VIRTUAL_DATA : VIRTUAL_DATA.slice(0, COLLAPSED_ROWS);
  const collapsible = VIRTUAL_DATA.length > COLLAPSED_ROWS;

  return (
    <div className="relative">
      <Table striped interactive>
        <colgroup>
          <col style={{ width: "44%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "11%" }} />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Charge</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {collapsible &&
        (expanded ? (
          // Expanded: no fade; the control sticks to the bottom of the viewport
          // while the long table scrolls past.
          <div className="sticky bottom-4 mt-3 flex justify-center">
            <Button
              variant="secondary"
              size="small"
              className="!rounded-full whitespace-nowrap"
              onClick={() => setExpanded(false)}
            >
              Show Less
              <ChevronDown className="ml-1 h-4 w-4 rotate-180" />
            </Button>
          </div>
        ) : (
          // Collapsed: fade the last rows into the surface; control floats over it.
          <>
            <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[hsl(var(--color-surface))] to-transparent" />
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <Button
                variant="secondary"
                size="small"
                className="!rounded-full whitespace-nowrap"
                onClick={() => setExpanded(true)}
              >
                Show More
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </>
        ))}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function TableComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Section>
        <SectionHeader id="basic-table" onCopyLink={showToast}>
          Basic table
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={basicCode}>
            <BasicDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="striped-table" onCopyLink={showToast}>
          Striped table
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={stripedCode}>
            <StripedDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="bordered-table" onCopyLink={showToast}>
          Bordered table
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={borderedCode}>
            <BorderedDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="interactive-table" onCopyLink={showToast}>
          Interactive table
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={interactiveCode}>
            <InteractiveDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="full-featured-table" onCopyLink={showToast}>
          Full featured table
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={fullFeaturedCode}>
            <FullFeaturedDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="virtualized-table" onCopyLink={showToast}>
          Virtualized table
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          Render a fixed preview window of a large dataset, mounting only the
          visible rows. Show More reveals the rest.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={virtualizedCode}>
            <VirtualizedDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Best Practices Section */}
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
            Use{" "}
            <code className="inline-code">&lt;Table&gt;</code> for
            tabular data where rows share the same shape and at least
            one column is sortable or comparable across rows.
          </li>
          <li>
            For a row of descriptive content paired with a single
            action (membership row, integration row), use{" "}
            <ComponentRef name="Entity" /> instead.
          </li>
          <li>
            For a key/value metadata block on a detail page, use{" "}
            <ComponentRef name="Description" />, not a two-column
            table.
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
            When the underlying list is empty (filter cleared, never
            created), render <ComponentRef name="Empty State" />{" "}
            outside the table rather than an empty{" "}
            <code className="inline-code">
              &lt;Table.Body&gt;
            </code>
            .
          </li>
          <li>
            Render <code className="inline-code">—</code> in cells
            where a value is unknown or not applicable. Don&apos;t
            substitute <code className="inline-code">N/A</code>,{" "}
            <code className="inline-code">null</code>, or an empty
            string.
          </li>
          <li>
            Sortable column headers are buttons. The visible label
            stays Title Case; the sort-direction arrow is decorative
            and the button announces the next sort state to assistive
            tech.
          </li>
          <li>
            Apply <code className="inline-code">tabular-nums</code>{" "}
            (or Geist Mono) to numeric columns so digits align across
            rows for comparison.
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
            Column headers (
            <code className="inline-code">
              &lt;Table.Head&gt;
            </code>
            ) are Title Case nouns or noun phrases:{" "}
            <code className="inline-code">Last Used</code>,{" "}
            <code className="inline-code">Requests (7d)</code>,{" "}
            <code className="inline-code">Created</code>,{" "}
            <code className="inline-code">Status</code>. Never
            sentences.
          </li>
          <li>
            Use the canonical short relative-time form in cells (
            <code className="inline-code">2m ago</code>,{" "}
            <code className="inline-code">5h ago</code>); switch to{" "}
            <code className="inline-code">Mar 14, 2026</code> past 7
            days. See <ComponentRef name="Relative Time Card" />.
          </li>
          <li>
            Pagination labels are{" "}
            <code className="inline-code">Previous</code> and{" "}
            <code className="inline-code">Next</code>. Page-count copy
            reads <code className="inline-code">Page 2 of 7</code> or{" "}
            <code className="inline-code">21–40 of 142</code> with an
            en-dash inside the range.
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
