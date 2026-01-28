"use client";

import React, { useState, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
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
    <div className="border border-[var(--ds-gray-400)] rounded-lg overflow-visible">
      <div
        className="p-6 rounded-t-lg"
        style={{ background: "var(--ds-background-100)" }}
      >
        {children}
      </div>
      <div
        className="rounded-b-lg"
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

function CalendarIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ width: 16, height: 16, color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.5 0.5V1.25V2H10.5V1.25V0.5H12V1.25V2H14H15.5V3.5V13.5C15.5 14.8807 14.3807 16 13 16H3C1.61929 16 0.5 14.8807 0.5 13.5V3.5V2H2H4V1.25V0.5H5.5ZM2 3.5H14V6H2V3.5ZM2 7.5V13.5C2 14.0523 2.44772 14.5 3 14.5H13C13.5523 14.5 14 14.0523 14 13.5V7.5H2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
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
        d="M10.5 14.0607L9.96966 13.5303L5.14644 8.7071C4.75592 8.31658 4.75592 7.68341 5.14644 7.29289L9.96966 2.46966L10.5 1.93933L11.5607 2.99999L11.0303 3.53032L6.56065 7.99999L11.0303 12.4697L11.5607 13L10.5 14.0607Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronRightIcon() {
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
        d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Calendar Dropdown Component
// ============================================================================

const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const days: {
    date: number;
    fullDate: Date;
    isCurrentMonth: boolean;
    isWeekend: boolean;
    isToday: boolean;
    dayOfWeek: number;
  }[] = [];

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = prevMonthLastDay - i;
    const dayOfWeek = (startDayOfWeek - i - 1 + 7) % 7;
    days.push({
      date,
      fullDate: new Date(year, month - 1, date),
      isCurrentMonth: false,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isToday: false,
      dayOfWeek,
    });
  }

  // Current month days
  const today = new Date();
  for (let date = 1; date <= daysInMonth; date++) {
    const dayOfWeek = (startDayOfWeek + date - 1) % 7;
    const isToday =
      today.getDate() === date &&
      today.getMonth() === month &&
      today.getFullYear() === year;
    days.push({
      date,
      fullDate: new Date(year, month, date),
      isCurrentMonth: true,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isToday,
      dayOfWeek,
    });
  }

  // Next month days to fill the grid (always show 5 or 6 rows)
  const remainingDays = 35 - days.length; // 5 rows
  const extraRow = days.length > 35 ? 42 - days.length : remainingDays;
  for (let date = 1; date <= extraRow; date++) {
    const dayOfWeek = days.length % 7;
    days.push({
      date,
      fullDate: new Date(year, month + 1, date),
      isCurrentMonth: false,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isToday: false,
      dayOfWeek,
    });
  }

  return days;
}

function formatAriaLabel(day: {
  fullDate: Date;
  isToday: boolean;
  dayOfWeek: number;
}) {
  const dayName = DAY_NAMES[day.dayOfWeek];
  const monthName = MONTH_NAMES[day.fullDate.getMonth()];
  const date = day.fullDate.getDate();
  const year = day.fullDate.getFullYear();

  if (day.isToday) {
    return `Today, ${dayName}, ${monthName} ${date}, ${year}`;
  }
  return `${dayName}, ${monthName} ${date}, ${year}`;
}

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface TimeValue {
  hours: number;
  minutes: number;
}

type TimezoneOption = "UTC" | "local";

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
}

function formatDateForInput(date: Date | null): string {
  if (!date) return "";
  const month = MONTH_NAMES[date.getMonth()].slice(0, 3);
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day.toString().padStart(2, "0")}, ${year}`;
}

function formatTimeForInput(date: Date | null): string {
  if (!date) return "12:00 AM";
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

function ChevronDownIcon() {
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
        d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CalendarContent({
  dateRange,
  onDateSelect,
  isSelectingEnd,
}: {
  dateRange: DateRange;
  onDateSelect: (date: Date) => void;
  isSelectingEnd: boolean;
}) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [focusedDate, setFocusedDate] = useState<Date>(
    dateRange.start || today,
  );
  const tableRef = useRef<HTMLTableElement>(null);

  const days = getCalendarDays(currentYear, currentMonth);

  const isStartDate = (day: { fullDate: Date }) => {
    if (!dateRange.start) return false;
    return isSameDay(day.fullDate, dateRange.start);
  };

  const isEndDate = (day: { fullDate: Date }) => {
    if (!dateRange.end) return false;
    return isSameDay(day.fullDate, dateRange.end);
  };

  const isInRange = (day: { fullDate: Date }) => {
    if (!dateRange.start || !dateRange.end) return false;
    return isDateInRange(day.fullDate, dateRange.start, dateRange.end);
  };

  const isSelected = (day: { fullDate: Date }) => {
    return isStartDate(day) || isEndDate(day);
  };

  // Preview range logic (when selecting end date and hovering)
  const isInPreviewRange = (day: { fullDate: Date }) => {
    if (!isSelectingEnd || !dateRange.start || !hoveredDate) return false;
    if (isSameDay(day.fullDate, dateRange.start)) return false;
    if (isSameDay(day.fullDate, hoveredDate)) return false;

    // Determine the actual range based on hover position
    const start = dateRange.start;
    const end = hoveredDate;
    if (end < start) {
      return isDateInRange(day.fullDate, end, start);
    }
    return isDateInRange(day.fullDate, start, end);
  };

  const isPreviewStart = (day: { fullDate: Date }) => {
    if (!isSelectingEnd || !dateRange.start || !hoveredDate) return false;
    if (isSameDay(dateRange.start, hoveredDate)) return false;
    // The preview start is the earlier of the two dates
    if (hoveredDate < dateRange.start) {
      return isSameDay(day.fullDate, hoveredDate);
    }
    return isSameDay(day.fullDate, dateRange.start);
  };

  const isPreviewEnd = (day: { fullDate: Date }) => {
    if (!isSelectingEnd || !dateRange.start || !hoveredDate) return false;
    if (isSameDay(dateRange.start, hoveredDate)) return false;
    // The preview end is the later of the two dates
    if (hoveredDate < dateRange.start) {
      return isSameDay(day.fullDate, dateRange.start);
    }
    return isSameDay(day.fullDate, hoveredDate);
  };

  const isHoveredForPreview = (day: { fullDate: Date }) => {
    if (!isSelectingEnd || !dateRange.start || !hoveredDate) return false;
    return isSameDay(day.fullDate, hoveredDate);
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isFocusedDate = (day: { fullDate: Date }) => {
    return isSameDay(day.fullDate, focusedDate);
  };

  const navigateToDate = (newDate: Date) => {
    setFocusedDate(newDate);
    // Update the viewed month if necessary
    if (
      newDate.getMonth() !== currentMonth ||
      newDate.getFullYear() !== currentYear
    ) {
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    }
    // Also update hovered date for preview when selecting end
    if (isSelectingEnd) {
      setHoveredDate(newDate);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newDate: Date | null = null;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        newDate = new Date(focusedDate);
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "ArrowRight":
        e.preventDefault();
        newDate = new Date(focusedDate);
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        newDate = new Date(focusedDate);
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "ArrowDown":
        e.preventDefault();
        newDate = new Date(focusedDate);
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        onDateSelect(focusedDate);
        return;
      default:
        return;
    }

    if (newDate) {
      navigateToDate(newDate);
    }
  };

  return (
    <>
      {/* Header with month/year and navigation */}
      <div
        className="calendar-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          margin: "-3px 0",
          height: 25,
          width: "100%",
          maxWidth: "100%",
          minWidth: 1,
          position: "relative",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            marginLeft: -16,
            paddingLeft: 16,
            flex: "1 1 0%",
            height: 25,
          }}
        >
          <h2 className="calendar-month-label" style={{ whiteSpace: "nowrap" }}>
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h2>
        </div>
        <button
          type="button"
          onClick={goToPrevMonth}
          aria-label="Previous"
          data-testid="calendar/nav/prev"
          className="calendar-nav-button"
          style={{ marginLeft: "auto" }}
        >
          <span className="calendar-nav-button-content">
            <ChevronLeftIcon />
          </span>
        </button>
        <span aria-hidden="true" style={{ marginLeft: 5 }} />
        <button
          type="button"
          onClick={goToNextMonth}
          aria-label="Next"
          data-testid="calendar/nav/next"
          className="calendar-nav-button"
        >
          <span className="calendar-nav-button-content">
            <ChevronRightIcon />
          </span>
        </button>
      </div>

      {/* Spacer */}
      <div aria-hidden="true" style={{ marginTop: 11 }} />

      {/* Calendar grid */}
      <table
        className="calendar-table"
        role="grid"
        aria-multiselectable="true"
        ref={tableRef}
        onKeyDown={handleKeyDown}
        data-testid="calendar/grid"
      >
        <caption className="sr-only">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </caption>
        <thead>
          <tr className="calendar-header-row">
            {DAYS_OF_WEEK.map((day, i) => (
              <th
                key={i}
                abbr={
                  [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ][i]
                }
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className="calendar-body"
          onMouseLeave={() => setHoveredDate(null)}
        >
          {Array.from(
            { length: Math.ceil(days.length / 7) },
            (_, weekIndex) => (
              <tr key={weekIndex} className="calendar-body-row">
                {days
                  .slice(weekIndex * 7, weekIndex * 7 + 7)
                  .map((day, dayIndex) => {
                    const isStart = isStartDate(day);
                    const isEnd = isEndDate(day);
                    const inRange = isInRange(day);
                    const selected = isStart || isEnd;

                    // Preview state checks
                    const previewStart = isPreviewStart(day);
                    const previewEnd = isPreviewEnd(day);
                    const inPreviewRange = isInPreviewRange(day);
                    const hoveredPreview = isHoveredForPreview(day);

                    // Determine td classes for range styling
                    let tdClasses = "calendar-cell";

                    // Confirmed range classes (only when both start and end are set)
                    const hasCompleteRange = dateRange.start && dateRange.end;
                    if (hasCompleteRange) {
                      if (isStart && isEnd) {
                        tdClasses +=
                          " calendar-cell-first-in-range calendar-cell-last-in-range";
                      } else if (isStart) {
                        tdClasses += " calendar-cell-first-in-range";
                      } else if (isEnd) {
                        tdClasses += " calendar-cell-last-in-range";
                      } else if (inRange) {
                        tdClasses += " calendar-cell-in-range";
                        // Add row boundary classes for rounding
                        if (dayIndex === 0)
                          tdClasses += " calendar-cell-row-start";
                        if (dayIndex === 6)
                          tdClasses += " calendar-cell-row-end";
                      }
                    }

                    // Preview range classes (when selecting end date)
                    if (previewStart) {
                      tdClasses += " calendar-cell-preview-start";
                    } else if (previewEnd && !hoveredPreview) {
                      tdClasses += " calendar-cell-preview-end";
                    } else if (inPreviewRange) {
                      tdClasses += " calendar-cell-in-preview-range";
                      // Add row boundary classes for rounding
                      if (dayIndex === 0)
                        tdClasses += " calendar-cell-row-start";
                      if (dayIndex === 6) tdClasses += " calendar-cell-row-end";
                    }

                    const focused = isFocusedDate(day);

                    return (
                      <td
                        key={dayIndex}
                        role="gridcell"
                        aria-selected={selected || inRange}
                        className={tdClasses}
                      >
                        <span
                          role="button"
                          tabIndex={focused ? 0 : -1}
                          aria-label={formatAriaLabel(day)}
                          data-testid={`calendar/cell/date-${day.date}`}
                          onClick={() => {
                            onDateSelect(day.fullDate);
                            setFocusedDate(day.fullDate);
                          }}
                          onMouseEnter={() => setHoveredDate(day.fullDate)}
                          onFocus={() => setFocusedDate(day.fullDate)}
                          className={`
                            calendar-day
                            ${!day.isCurrentMonth ? "calendar-day-outside" : ""}
                            ${day.isWeekend && !day.isToday && !selected && !hoveredPreview ? "calendar-day-weekend" : ""}
                            ${day.isToday ? "calendar-day-today" : ""}
                            ${selected ? "calendar-day-selected" : ""}
                            ${hoveredPreview ? "calendar-day-hover-preview" : ""}
                          `}
                        >
                          {day.date}
                        </span>
                      </td>
                    );
                  })}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </>
  );
}

// ============================================================================
// Code Example
// ============================================================================

const defaultCode = `import { Calendar } from '@/components/ui/Calendar';

export function Component() {
  return <Calendar placeholder="Select Date Range" />;
}`;

// ============================================================================
// Main Component
// ============================================================================

function formatDateRange(range: DateRange): string {
  if (!range.start) return "Select Date Range";
  if (!range.end || isSameDay(range.start, range.end)) {
    // Single date selected
    const month = MONTH_NAMES[range.start.getMonth()].slice(0, 3);
    return `${month} ${range.start.getDate()}`;
  }
  // Range selected
  const startMonth = MONTH_NAMES[range.start.getMonth()].slice(0, 3);
  const endMonth = MONTH_NAMES[range.end.getMonth()].slice(0, 3);
  if (startMonth === endMonth) {
    return `${startMonth} ${range.start.getDate()} - ${range.end.getDate()}`;
  }
  return `${startMonth} ${range.start.getDate()} - ${endMonth} ${range.end.getDate()}`;
}

function CloseIcon() {
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
        d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
        fill="currentColor"
      />
    </svg>
  );
}

function getLocalTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "Local";
  }
}

// Helper to get default date range (today to today)
function getDefaultDateRange(): DateRange {
  const today = new Date();
  return { start: today, end: today };
}

// Get the local timezone offset in hours
function getTimezoneOffsetHours(): number {
  return new Date().getTimezoneOffset() / -60;
}

// Format time for display based on timezone
// Local time is always 12:00 AM to 11:59 PM (full day)
// UTC shows the converted time based on local timezone offset
function formatTimeForTimezone(
  tz: TimezoneOption,
  isEndTime: boolean = false,
): string {
  // Base times in local: 00:00 (midnight) for start, 23:59 for end
  let hours = isEndTime ? 23 : 0;
  let minutes = isEndTime ? 59 : 0;

  if (tz === "UTC") {
    // Convert local time to UTC by subtracting the offset
    // e.g., Brussels is UTC+1, so local 00:00 = UTC 23:00 (previous day)
    const offsetHours = getTimezoneOffsetHours();
    hours = hours - offsetHours;

    // Handle wraparound
    if (hours < 0) {
      hours += 24;
    } else if (hours >= 24) {
      hours -= 24;
    }
  }

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export default function CalendarComponent() {
  const { toast, showToast, dismissToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  // No dates selected by default - inputs show today as placeholder
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [selectionState, setSelectionState] = useState<"start" | "end">(
    "start",
  );
  const [timezone, setTimezone] = useState<TimezoneOption>("local");
  // Width starts as null until measured
  const [timezoneWidth, setTimezoneWidth] = useState<number | null>(null);
  const timezoneTextRef = useRef<HTMLSpanElement>(null);
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState(() =>
    formatTimeForTimezone("local", false),
  );
  const [endTimeInput, setEndTimeInput] = useState(() =>
    formatTimeForTimezone("local", true),
  );

  // Get display text for timezone
  const getTimezoneDisplayText = useCallback((tz: TimezoneOption) => {
    return tz === "UTC" ? "UTC" : `Local (${getLocalTimezone()})`;
  }, []);

  // Measure and update timezone select width
  const measureTimezoneWidth = useCallback(() => {
    if (timezoneTextRef.current) {
      const width = timezoneTextRef.current.offsetWidth;
      // Add padding: 6px left + 22px right for chevron + 4px buffer
      setTimezoneWidth(width + 32);
    }
  }, []);

  // Use layout effect for synchronous measurement before paint
  React.useLayoutEffect(() => {
    measureTimezoneWidth();
  }, [timezone, measureTimezoneWidth]);

  // Update time inputs when timezone changes
  React.useEffect(() => {
    setStartTimeInput(formatTimeForTimezone(timezone, false));
    setEndTimeInput(formatTimeForTimezone(timezone, true));
  }, [timezone]);

  // Sync input values when date range changes
  // Show today's date as default when no selection
  React.useEffect(() => {
    const today = new Date();
    if (dateRange.start) {
      setStartDateInput(formatDateForInput(dateRange.start));
    } else {
      setStartDateInput(formatDateForInput(today));
    }
    if (dateRange.end) {
      setEndDateInput(formatDateForInput(dateRange.end));
    } else if (dateRange.start) {
      // If only start is selected, show it in end too
      setEndDateInput(formatDateForInput(dateRange.start));
    } else {
      setEndDateInput(formatDateForInput(today));
    }
  }, [dateRange]);

  const handleDateSelect = (date: Date) => {
    if (selectionState === "start") {
      // First click - set start date
      setDateRange({ start: date, end: null });
      setSelectionState("end");
    } else {
      // Second click - set end date
      if (dateRange.start && date < dateRange.start) {
        // If clicked date is before start, swap them
        setDateRange({ start: date, end: dateRange.start });
      } else {
        setDateRange({ start: dateRange.start, end: date });
      }
      setSelectionState("start");
      // Close dropdown after selecting end date
      setIsOpen(false);
    }
  };

  const handleApply = () => {
    // Apply the date range with times
    if (dateRange.start && dateRange.end) {
      setIsOpen(false);
      showToast("Date range applied");
    }
  };

  const handleClearRange = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDateRange({ start: null, end: null });
    setSelectionState("start");
    // Reset to today's date as default
    const today = new Date();
    setStartDateInput(formatDateForInput(today));
    setEndDateInput(formatDateForInput(today));
    setStartTimeInput(formatTimeForTimezone(timezone, false));
    setEndTimeInput(formatTimeForTimezone(timezone, true));
  };

  const hasSelection = dateRange.start !== null;

  return (
    <>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />

      {/* Hidden element to measure timezone text width - rendered outside popover for immediate measurement */}
      <span
        ref={timezoneTextRef}
        className="calendar-select-measure"
        aria-hidden="true"
      >
        {getTimezoneDisplayText(timezone)}
      </span>

      {/* Default Section */}
      <Section>
        <SectionHeader id="default" onCopyLink={showToast}>
          Default
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={defaultCode}>
            <div className="flex justify-center py-12">
              <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    data-testid="calendar/trigger/button"
                    title="Select Date Range"
                    className={`calendar-trigger-button flex items-center justify-between text-left cursor-pointer text-[rgb(23,23,23)] dark:text-[rgb(237,237,237)] ${isOpen ? "calendar-trigger-button-expanded" : ""}`}
                    style={{
                      width: 250,
                      height: 40,
                      paddingLeft: 10,
                      paddingRight: 10,
                      borderRadius: 6,
                      fontSize: 14,
                      lineHeight: "20px",
                      fontWeight: 400,
                    }}
                  >
                    {/* Prefix (icon container) */}
                    <span
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        height: 16,
                        width: 20,
                        minWidth: 20,
                        marginRight: 2,
                      }}
                    >
                      <CalendarIcon />
                    </span>
                    {/* Content (text) */}
                    <span
                      className="overflow-hidden text-ellipsis whitespace-nowrap flex-1"
                      style={{
                        paddingLeft: 6,
                        paddingRight: hasSelection ? 8 : 20,
                      }}
                    >
                      {formatDateRange(dateRange)}
                    </span>
                    {/* Clear button */}
                    {hasSelection && (
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label="Clear date range"
                        onClick={handleClearRange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleClearRange(e as unknown as React.MouseEvent);
                          }
                        }}
                        className="flex items-center justify-center flex-shrink-0 rounded hover:bg-[var(--ds-gray-200)] transition-colors"
                        style={{
                          height: 20,
                          width: 20,
                          minWidth: 20,
                        }}
                      >
                        <CloseIcon />
                      </span>
                    )}
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="calendar-dropdown"
                    sideOffset={12}
                    align="start"
                    data-testid="calendar/popover"
                    tabIndex={-1}
                    style={{
                      zIndex: 2001,
                      width: 280,
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        dateRange.start &&
                        dateRange.end
                      ) {
                        e.preventDefault();
                        handleApply();
                      }
                    }}
                  >
                    {/* Screen reader only button for focus management */}
                    <button type="button" className="sr-only">
                      Calendar dialog
                    </button>
                    {/* Content wrapper with padding */}
                    <div className="calendar-content-wrapper">
                      {/* Flex container - column-reverse puts calendar on top, inputs below */}
                      <div className="calendar-content-flex">
                        {/* Inputs section (renders below calendar due to column-reverse) */}
                        <div className="calendar-inputs-wrapper">
                          <div className="space-y-2">
                            {/* Start Date/Time */}
                            <div>
                              <div className="mb-1 flex items-center justify-between">
                                <label data-version="v1">
                                  <div className="calendar-input-label">
                                    Start
                                  </div>
                                </label>
                              </div>
                              <div className="flex gap-2">
                                <div className="calendar-input-container flex-1">
                                  <input
                                    aria-labelledby="start-date"
                                    placeholder="Jan 01, 2025"
                                    aria-invalid="false"
                                    autoCapitalize="none"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    className="calendar-input"
                                    data-testid="calendar/input/start-date"
                                    spellCheck="false"
                                    type="text"
                                    value={startDateInput}
                                    onChange={(e) =>
                                      setStartDateInput(e.target.value)
                                    }
                                  />
                                </div>
                                <div
                                  className="calendar-input-container"
                                  style={{ width: 96 }}
                                >
                                  <input
                                    aria-labelledby="time"
                                    placeholder="12:00 AM"
                                    aria-invalid="false"
                                    autoCapitalize="none"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    className="calendar-input"
                                    data-testid="calendar/input/start-time"
                                    spellCheck="false"
                                    type="text"
                                    value={startTimeInput}
                                    onChange={(e) =>
                                      setStartTimeInput(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            {/* End Date/Time */}
                            <div>
                              <div className="mb-1 flex items-center justify-between">
                                <label data-version="v1">
                                  <div className="calendar-input-label">
                                    End
                                  </div>
                                </label>
                              </div>
                              <div className="flex gap-2">
                                <div className="calendar-input-container flex-1">
                                  <input
                                    aria-labelledby="end-date"
                                    placeholder="Jan 01, 2025"
                                    aria-invalid="false"
                                    autoCapitalize="none"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    className="calendar-input"
                                    data-testid="calendar/input/end-date"
                                    spellCheck="false"
                                    type="text"
                                    value={endDateInput}
                                    onChange={(e) =>
                                      setEndDateInput(e.target.value)
                                    }
                                  />
                                </div>
                                <div
                                  className="calendar-input-container"
                                  style={{ width: 96 }}
                                >
                                  <input
                                    aria-labelledby="time"
                                    placeholder="11:59 PM"
                                    aria-invalid="false"
                                    autoCapitalize="none"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    className="calendar-input"
                                    data-testid="calendar/input/end-time"
                                    spellCheck="false"
                                    type="text"
                                    value={endTimeInput}
                                    onChange={(e) =>
                                      setEndTimeInput(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Apply Button */}
                            <div>
                              <button
                                type="button"
                                onClick={handleApply}
                                className="calendar-apply-button"
                                data-testid="calendar/button/apply"
                              >
                                <span className="calendar-apply-button-content">
                                  Apply
                                  <span className="calendar-apply-hint">↵</span>
                                </span>
                              </button>
                            </div>

                            {/* Timezone Selector */}
                            <div className="mt-2 flex justify-center">
                              <label
                                className="calendar-timezone-label"
                                data-version="v1"
                              >
                                <div className="calendar-select-container">
                                  <select
                                    aria-invalid="false"
                                    className="calendar-select"
                                    data-testid="calendar/select/timezone"
                                    value={timezone}
                                    style={{ width: timezoneWidth ?? "auto" }}
                                    onChange={(e) =>
                                      setTimezone(
                                        e.target.value as TimezoneOption,
                                      )
                                    }
                                  >
                                    <option value="UTC">UTC</option>
                                    <option value="local">
                                      Local ({getLocalTimezone()})
                                    </option>
                                  </select>
                                  <span className="calendar-select-suffix">
                                    <ChevronDownIcon />
                                  </span>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Calendar grid (renders on top due to column-reverse) */}
                        <div>
                          <CalendarContent
                            dateRange={dateRange}
                            onDateSelect={handleDateSelect}
                            isSelectingEnd={selectionState === "end"}
                          />
                        </div>
                      </div>
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>
          </CodePreview>
        </div>
      </Section>
    </>
  );
}
