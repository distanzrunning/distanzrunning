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
import { Calendar, CalendarPreset } from "@/components/ui/Calendar";

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
    <div className="border border-borderDefault rounded-lg overflow-hidden">
      <div
        className="p-6 rounded-t-lg"
        style={{ background: "hsl(var(--color-surface))" }}
      >
        {children}
      </div>
      <div
        className="rounded-b-lg"
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
// Code Example
// ============================================================================

const defaultCode = `import { Calendar, DateRange } from '@/components/ui/Calendar';
import { useState } from 'react';

export function DateRangePicker() {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });

  return (
    <Calendar
      placeholder="Select Date Range"
      value={dateRange}
      onChange={setDateRange}
      width={250}
    />
  );
}`;

const horizontalLayoutCode = `import { Calendar, DateRange } from '@/components/ui/Calendar';
import { useState } from 'react';

export function HorizontalDateRangePicker() {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });

  return (
    <Calendar
      placeholder="Select Date Range"
      value={dateRange}
      onChange={setDateRange}
      horizontalLayout
      showTimeInput={false}
      popoverAlignment="center"
    />
  );
}`;

const presetsCode = `import { Calendar, DateRange, CalendarPreset } from '@/components/ui/Calendar';
import { useState } from 'react';
import { startOfDay, endOfDay, subDays, addDays, addMonths } from 'date-fns';

const presets: CalendarPreset[] = [
  { label: 'Last 24 hours', value: 'last-24h', getRange: () => ({ start: subDays(new Date(), 1), end: new Date() }) },
  { label: 'Last 7 days', value: 'last-7d', getRange: () => ({ start: startOfDay(subDays(new Date(), 7)), end: endOfDay(new Date()) }) },
  { label: 'Last 30 days', value: 'last-30d', getRange: () => ({ start: startOfDay(subDays(new Date(), 30)), end: endOfDay(new Date()) }) },
  { label: 'Last 90 days', value: 'last-90d', getRange: () => ({ start: startOfDay(subDays(new Date(), 90)), end: endOfDay(new Date()) }) },
];

const futurePresets: CalendarPreset[] = [
  { label: 'Next 7 days', value: 'next-7d', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addDays(new Date(), 7)) }) },
  { label: 'Next 30 days', value: 'next-30d', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addDays(new Date(), 30)) }) },
  { label: 'Next 3 months', value: 'next-3m', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addMonths(new Date(), 3)) }) },
  { label: 'Next 6 months', value: 'next-6m', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addMonths(new Date(), 6)) }) },
];

export function DateRangePickerWithPresets() {
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  return (
    <Calendar
      presets={presets}
      futurePresets={futurePresets}
      value={dateRange}
      onChange={setDateRange}
    />
  );
}`;

const presetsWithDefaultCode = `import { Calendar, DateRange, CalendarPreset } from '@/components/ui/Calendar';
import { useState } from 'react';
import { startOfDay, endOfDay, subDays, addDays, addMonths } from 'date-fns';

const presets: CalendarPreset[] = [
  { label: 'Last 24 hours', value: 'last-24h', getRange: () => ({ start: subDays(new Date(), 1), end: new Date() }) },
  { label: 'Last 7 days', value: 'last-7d', getRange: () => ({ start: startOfDay(subDays(new Date(), 7)), end: endOfDay(new Date()) }) },
  { label: 'Last 14 days', value: 'last-14d', getRange: () => ({ start: startOfDay(subDays(new Date(), 14)), end: endOfDay(new Date()) }) },
  { label: 'Last 30 days', value: 'last-30d', getRange: () => ({ start: startOfDay(subDays(new Date(), 30)), end: endOfDay(new Date()) }) },
  { label: 'Last 90 days', value: 'last-90d', getRange: () => ({ start: startOfDay(subDays(new Date(), 90)), end: endOfDay(new Date()) }) },
];

const futurePresets: CalendarPreset[] = [
  { label: 'Next 7 days', value: 'next-7d', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addDays(new Date(), 7)) }) },
  { label: 'Next 30 days', value: 'next-30d', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addDays(new Date(), 30)) }) },
  { label: 'Next 3 months', value: 'next-3m', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addMonths(new Date(), 3)) }) },
  { label: 'Next 6 months', value: 'next-6m', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addMonths(new Date(), 6)) }) },
];

export function PresetsWithDefaultValue() {
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  return (
    <Calendar
      stacked
      presets={presets}
      futurePresets={futurePresets}
      defaultPreset="last-14d"
      value={dateRange}
      onChange={setDateRange}
    />
  );
}`;

const stackedCode = `import { Calendar, DateRange, CalendarPreset } from '@/components/ui/Calendar';
import { useState } from 'react';
import { startOfDay, endOfDay, subDays, addDays, addMonths } from 'date-fns';

const presets: CalendarPreset[] = [
  { label: 'Last 24 hours', value: 'last-24h', getRange: () => ({ start: subDays(new Date(), 1), end: new Date() }) },
  { label: 'Last 7 days', value: 'last-7d', getRange: () => ({ start: startOfDay(subDays(new Date(), 7)), end: endOfDay(new Date()) }) },
  { label: 'Last 30 days', value: 'last-30d', getRange: () => ({ start: startOfDay(subDays(new Date(), 30)), end: endOfDay(new Date()) }) },
  { label: 'Last 90 days', value: 'last-90d', getRange: () => ({ start: startOfDay(subDays(new Date(), 90)), end: endOfDay(new Date()) }) },
];

const futurePresets: CalendarPreset[] = [
  { label: 'Next 7 days', value: 'next-7d', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addDays(new Date(), 7)) }) },
  { label: 'Next 30 days', value: 'next-30d', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addDays(new Date(), 30)) }) },
  { label: 'Next 3 months', value: 'next-3m', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addMonths(new Date(), 3)) }) },
  { label: 'Next 6 months', value: 'next-6m', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addMonths(new Date(), 6)) }) },
];

export function StackedDateRangePicker() {
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  return (
    <Calendar
      stacked
      presets={presets}
      futurePresets={futurePresets}
      value={dateRange}
      onChange={setDateRange}
    />
  );
}`;

const compactCode = `import { Calendar, DateRange, CalendarPreset } from '@/components/ui/Calendar';
import { useState } from 'react';
import { startOfDay, endOfDay, subDays, addDays, addMonths } from 'date-fns';

const presets: CalendarPreset[] = [
  { label: 'Last 7 days', value: 'last-7d', getRange: () => ({ start: startOfDay(subDays(new Date(), 7)), end: endOfDay(new Date()) }) },
  { label: 'Last 30 days', value: 'last-30d', getRange: () => ({ start: startOfDay(subDays(new Date(), 30)), end: endOfDay(new Date()) }) },
];

const futurePresets: CalendarPreset[] = [
  { label: 'Next 7 days', value: 'next-7d', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addDays(new Date(), 7)) }) },
  { label: 'Next 30 days', value: 'next-30d', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addDays(new Date(), 30)) }) },
];

export function CompactDateRangePicker() {
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  return (
    <Calendar
      compact
      presets={presets}
      futurePresets={futurePresets}
      value={dateRange}
      onChange={setDateRange}
    />
  );
}`;

const compactPresetLabelCode = `import { Calendar, DateRange, CalendarPreset } from '@/components/ui/Calendar';
import { useState } from 'react';
import { startOfDay, endOfDay, subDays } from 'date-fns';

const presets: CalendarPreset[] = [
  { label: 'Last 7 days',  value: 'last-7d',  getRange: () => ({ start: startOfDay(subDays(new Date(), 7)),  end: endOfDay(new Date()) }) },
  { label: 'Last 30 days', value: 'last-30d', getRange: () => ({ start: startOfDay(subDays(new Date(), 30)), end: endOfDay(new Date()) }) },
  { label: 'Last 90 days', value: 'last-90d', getRange: () => ({ start: startOfDay(subDays(new Date(), 90)), end: endOfDay(new Date()) }) },
];

export function CompactPresetLabelPicker() {
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  // compactPresetLabel collapses the date trigger to an icon-only
  // button — the preset combobox alongside carries the active label
  // ("Last 7 days" rather than an explicit date span). Popover
  // expands right-to-left so it stays anchored to its container's
  // trailing edge. Used on /admin/consent.
  return (
    <Calendar
      compact
      compactPresetLabel
      popoverAlignment="end"
      presets={presets}
      defaultPreset="last-7d"
      value={dateRange}
      onChange={setDateRange}
    />
  );
}`;

const backdropCode = `import { Calendar, DateRange } from '@/components/ui/Calendar';
import { useState } from 'react';

export function OverlayDateRangePicker() {
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  // \`backdrop\` opts the picker into a page-dim overlay + document
  // scroll-lock while open. Off by default so most dashboards don't
  // lock scroll on every open; on for focal contexts like the /races
  // search filter row where the picker reads as the primary action.
  return (
    <Calendar
      placeholder="Select Date Range"
      value={dateRange}
      onChange={setDateRange}
      backdrop
      width={250}
    />
  );
}`;

const minMaxDatesCode = `import { Calendar, DateRange } from '@/components/ui/Calendar';
import { useState } from 'react';

export function MinMaxDateRangePicker() {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });

  // Only allow dates within the last 90 days to today
  const today = new Date();
  const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

  return (
    <Calendar
      placeholder="Select Date Range"
      value={dateRange}
      onChange={setDateRange}
      minDate={ninetyDaysAgo}
      maxDate={today}
      width={250}
    />
  );
}`;

const monthTabCode = `import { Calendar, DateRange } from '@/components/ui/Calendar';
import { useState } from 'react';

export function MonthTabDateRangePicker() {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });

  return (
    <Calendar
      placeholder="Select Date Range"
      value={dateRange}
      onChange={setDateRange}
      showMonthTab
      width={250}
    />
  );
}`;

const sizesCode = `import { Calendar, CalendarPreset } from '@/components/ui/Calendar';
import { startOfDay, endOfDay, subDays, addDays, addMonths } from 'date-fns';

const presets: CalendarPreset[] = [
  { label: 'Last 7 days', value: 'last-7d', getRange: () => ({ start: startOfDay(subDays(new Date(), 7)), end: endOfDay(new Date()) }) },
  { label: 'Last 30 days', value: 'last-30d', getRange: () => ({ start: startOfDay(subDays(new Date(), 30)), end: endOfDay(new Date()) }) },
];

const futurePresets: CalendarPreset[] = [
  { label: 'Next 7 days', value: 'next-7d', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addDays(new Date(), 7)) }) },
  { label: 'Next 30 days', value: 'next-30d', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(addDays(new Date(), 30)) }) },
];

// Small size (32px height)
<Calendar size="small" placeholder="Select Date Range" width={250} />
<Calendar size="small" compact presets={presets} futurePresets={futurePresets} />
<Calendar size="small" stacked presets={presets} futurePresets={futurePresets} />
<Calendar size="small" presets={presets} futurePresets={futurePresets} />

// Default / large size (40px height)
<Calendar placeholder="Select Date Range" width={250} />
<Calendar compact presets={presets} futurePresets={futurePresets} />
<Calendar stacked presets={presets} futurePresets={futurePresets} />
<Calendar presets={presets} futurePresets={futurePresets} />`;

// Default presets for the demo
const defaultPresets: CalendarPreset[] = [
  {
    label: "Last 24 hours",
    value: "last-24-hours",
    getRange: () => {
      const end = new Date();
      const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      return { start, end };
    },
  },
  {
    label: "Last 7 days",
    value: "last-7-days",
    getRange: () => {
      const end = new Date();
      const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { start, end };
    },
  },
  {
    label: "Last 30 days",
    value: "last-30-days",
    getRange: () => {
      const end = new Date();
      const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { start, end };
    },
  },
  {
    label: "Last 90 days",
    value: "last-90-days",
    getRange: () => {
      const end = new Date();
      const start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
      return { start, end };
    },
  },
];

// Future presets for race calendar
const defaultFuturePresets: CalendarPreset[] = [
  {
    label: "Next 7 days",
    value: "next-7-days",
    getRange: () => {
      const start = new Date();
      const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
      return { start, end };
    },
  },
  {
    label: "Next 30 days",
    value: "next-30-days",
    getRange: () => {
      const start = new Date();
      const end = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
      return { start, end };
    },
  },
  {
    label: "Next 3 months",
    value: "next-3-months",
    getRange: () => {
      const start = new Date();
      const end = new Date(start);
      end.setMonth(end.getMonth() + 3);
      return { start, end };
    },
  },
  {
    label: "Next 6 months",
    value: "next-6-months",
    getRange: () => {
      const start = new Date();
      const end = new Date(start);
      end.setMonth(end.getMonth() + 6);
      return { start, end };
    },
  },
];

// Presets with "Last 14 days" for the default value demo
const presetsWithDefault: CalendarPreset[] = [
  {
    label: "Last 24 hours",
    value: "last-24-hours",
    getRange: () => {
      const end = new Date();
      const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      return { start, end };
    },
  },
  {
    label: "Last 7 days",
    value: "last-7-days",
    getRange: () => {
      const end = new Date();
      const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { start, end };
    },
  },
  {
    label: "Last 14 days",
    value: "last-14-days",
    getRange: () => {
      const end = new Date();
      const start = new Date(end.getTime() - 14 * 24 * 60 * 60 * 1000);
      return { start, end };
    },
  },
  {
    label: "Last 30 days",
    value: "last-30-days",
    getRange: () => {
      const end = new Date();
      const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { start, end };
    },
  },
  {
    label: "Last 90 days",
    value: "last-90-days",
    getRange: () => {
      const end = new Date();
      const start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
      return { start, end };
    },
  },
];

// Min/max dates for the demo (90 days ago to today)
const demoMaxDate = new Date();
const demoMinDate = new Date(demoMaxDate.getTime() - 90 * 24 * 60 * 60 * 1000);

// ============================================================================
// Main Component
// ============================================================================

export default function CalendarComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />

      {/* Default Section */}
      <Section>
        <SectionHeader id="default" onCopyLink={showToast}>
          Default
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={defaultCode}>
            <div className="flex justify-center py-12">
              <Calendar placeholder="Select Date Range" width={250} />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Horizontal Layout Section */}
      <Section>
        <SectionHeader id="horizontal-layout" onCopyLink={showToast}>
          Horizontal Layout
        </SectionHeader>
        <p className="mt-2 leading-6 text-textSubtle xl:mt-4">
          Use{" "}
          <code className="inline-code">
            horizontalLayout
          </code>{" "}
          to align content horizontally within the calendar popover.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={horizontalLayoutCode}>
            <div className="flex justify-center py-12">
              <Calendar
                placeholder="Select Date Range"
                horizontalLayout
                showTimeInput={false}
                popoverAlignment="center"
              />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Sizes Section */}
      <Section>
        <SectionHeader id="sizes" onCopyLink={showToast}>
          Sizes
        </SectionHeader>
        <p className="mt-2 leading-6 text-textSubtle xl:mt-4">
          Choose between{" "}
          <code className="inline-code">
            large
          </code>{" "}
          (default) and{" "}
          <code className="inline-code">
            small
          </code>{" "}
          for size.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={sizesCode}>
            <div className="py-12 space-y-12">
              <div>
                <p className="text-sm text-textSubtle mb-4 font-mono">
                  small
                </p>
                <div className="flex flex-wrap items-start gap-x-4 gap-y-8">
                  <Calendar
                    size="small"
                    placeholder="Select Date Range"
                    width={250}
                  />
                  <Calendar
                    size="small"
                    compact
                    presets={defaultPresets}
                    futurePresets={defaultFuturePresets}
                  />
                  <Calendar
                    size="small"
                    stacked
                    presets={defaultPresets}
                    futurePresets={defaultFuturePresets}
                    presetPlaceholder="Select Period"
                  />
                  <Calendar
                    size="small"
                    presets={defaultPresets}
                    futurePresets={defaultFuturePresets}
                    presetPlaceholder="Select Period"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-textSubtle mb-4 font-mono">
                  default / large
                </p>
                <div className="flex flex-wrap items-start gap-x-4 gap-y-8">
                  <Calendar placeholder="Select Date Range" width={250} />
                  <Calendar
                    compact
                    presets={defaultPresets}
                    futurePresets={defaultFuturePresets}
                  />
                  <Calendar
                    stacked
                    presets={defaultPresets}
                    futurePresets={defaultFuturePresets}
                    presetPlaceholder="Select Period"
                  />
                  <Calendar
                    presets={defaultPresets}
                    futurePresets={defaultFuturePresets}
                    presetPlaceholder="Select Period"
                  />
                </div>
              </div>
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Presets Section */}
      <Section>
        <SectionHeader id="presets" onCopyLink={showToast}>
          Presets
        </SectionHeader>
        <p className="mt-2 leading-6 text-textSubtle xl:mt-4">
          Provide common date ranges.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={presetsCode}>
            <div className="flex justify-center py-12">
              <Calendar
                placeholder="Select Date Range"
                presets={defaultPresets}
                futurePresets={defaultFuturePresets}
                presetPlaceholder="Select Period"
              />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Compact Section */}
      <Section>
        <SectionHeader id="compact" onCopyLink={showToast}>
          Compact
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={compactCode}>
            <div className="flex justify-center py-12">
              <Calendar
                compact
                placeholder="Select Date Range"
                presets={defaultPresets}
                futurePresets={defaultFuturePresets}
                presetPlaceholder="Select Period"
              />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Compact with preset label */}
      <Section>
        <SectionHeader id="compact-preset-label" onCopyLink={showToast}>
          Compact with preset label
        </SectionHeader>
        <p className="mt-2 leading-6 text-textSubtle xl:mt-4">
          Pair <code className="inline-code">compact</code> with{" "}
          <code className="inline-code">compactPresetLabel</code> to collapse
          the date trigger to an icon-only button and let the preset
          combobox carry the active label. Useful when the resting state
          should read <em>&ldquo;Last 7 days&rdquo;</em> rather than a date
          span. Used on{" "}
          <code className="inline-code">/admin/consent</code>.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={compactPresetLabelCode}>
            <div className="flex justify-center py-12">
              <Calendar
                compact
                compactPresetLabel
                popoverAlignment="end"
                presets={defaultPresets}
                defaultPreset="last-7-days"
              />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Stacked Section */}
      <Section>
        <SectionHeader id="stacked" onCopyLink={showToast}>
          Stacked
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={stackedCode}>
            <div className="flex justify-center py-12">
              <Calendar
                stacked
                placeholder="Select Date Range"
                presets={defaultPresets}
                futurePresets={defaultFuturePresets}
                presetPlaceholder="Select Period"
              />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Presets with Default Value Section */}
      <Section>
        <SectionHeader id="presets-with-default-value" onCopyLink={showToast}>
          Presets with default value
        </SectionHeader>
        <p className="mt-2 leading-6 text-textSubtle xl:mt-4">
          Provide common date ranges with an additional default value.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={presetsWithDefaultCode}>
            <div className="flex justify-center py-12">
              <Calendar
                stacked
                presets={presetsWithDefault}
                futurePresets={defaultFuturePresets}
                defaultPreset="last-14-days"
              />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Min and Max Dates Section */}
      <Section>
        <SectionHeader id="min-and-max-dates" onCopyLink={showToast}>
          Min and max dates
        </SectionHeader>
        <p className="mt-2 leading-6 text-textSubtle xl:mt-4">
          Constrain the selectable date range with minimum and maximum dates.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={minMaxDatesCode}>
            <div className="flex justify-center py-12">
              <Calendar
                placeholder="Select Date Range"
                minDate={demoMinDate}
                maxDate={demoMaxDate}
                width={250}
              />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Month Tab Section */}
      <Section>
        <SectionHeader id="month-tab" onCopyLink={showToast}>
          Month tab
        </SectionHeader>
        <p className="mt-2 leading-6 text-textSubtle xl:mt-4">
          Use{" "}
          <code className="inline-code">
            showMonthTab
          </code>{" "}
          to add a Dates/Months tab switcher within the calendar popover,
          allowing selection of an entire month at once.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={monthTabCode}>
            <div className="flex justify-center py-12">
              <Calendar
                placeholder="Select Date Range"
                showMonthTab
                width={250}
              />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Backdrop / overlay variant */}
      <Section>
        <SectionHeader id="backdrop" onCopyLink={showToast}>
          With overlay
        </SectionHeader>
        <p className="mt-2 leading-6 text-textSubtle xl:mt-4">
          Pass <code className="inline-code">backdrop</code> to render a
          page-dim overlay behind the open popover and lock document
          scroll while it&rsquo;s open. Off by default so most dashboards
          don&rsquo;t lock scroll on every open; on for focal contexts
          where the picker reads as the primary action. Used on{" "}
          <code className="inline-code">/races</code> in the filter row.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={backdropCode}>
            <div className="flex justify-center py-12">
              <Calendar
                placeholder="Select Date Range"
                backdrop
                width={250}
              />
            </div>
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
            Pick <code className="inline-code">&lt;Calendar&gt;</code>{" "}
            for analytics ranges and any picker where day-of-week
            and month context matter.
          </li>
          <li>
            For ISO dates pasted whole or relative shorthand like{" "}
            <code className="inline-code">7d</code>, use a
            free-form <ComponentRef name="Input" />.
          </li>
          <li>
            Provide <code className="inline-code">presets</code> for
            the common ranges (
            <code className="inline-code">Last 7 Days</code>,{" "}
            <code className="inline-code">Month to Date</code>) so
            users land on the right window in one click.
          </li>
          <li>
            Pair a horizontal layout with live results next to the
            calendar; in narrow surfaces like a sidebar, fall back
            to the stacked layout.
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
            Set <code className="inline-code">minDate</code> and{" "}
            <code className="inline-code">maxDate</code> to the data
            window so users can&apos;t pick outside the retention
            range.
          </li>
          <li>
            Default to the user&apos;s locale and timezone; never
            silently render UTC for a US-Pacific viewer.
          </li>
          <li>
            Keep the trigger label as the chosen range (
            <code className="inline-code">Apr 1 – Apr 28, 2026</code>
            ); don&apos;t fall back to{" "}
            <code className="inline-code">Pick a date</code> once a
            value is committed.
          </li>
          <li>
            Persist the selected range when the popover closes and
            re-opens so users can tweak the end date without
            re-picking the start.
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
            Trap focus inside the popover so Tab cycles day cells
            and presets instead of the page behind it.
          </li>
          <li>
            Support arrow-key day navigation,{" "}
            <code className="inline-code">Shift</code> + arrow for
            week jumps, and{" "}
            <code className="inline-code">Page Up</code> /{" "}
            <code className="inline-code">Page Down</code> for
            month jumps.
          </li>
          <li>
            Announce range changes through{" "}
            <code className="inline-code">
              aria-live=&quot;polite&quot;
            </code>{" "}
            so a screen reader hears{" "}
            <code className="inline-code">
              From Apr 1 to Apr 28
            </code>{" "}
            after the second click.
          </li>
          <li>
            Each preset is a real button with a Title Case label (
            <code className="inline-code">Last 30 Days</code>);
            don&apos;t mark presets as menu items without keyboard
            handling.
          </li>
        </ul>
      </Section>
    </>
  );
}
