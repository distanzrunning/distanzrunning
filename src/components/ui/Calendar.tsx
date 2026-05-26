"use client";

// Calendar — date-range picker built on Base UI Popover + react-day-picker.
//
// History: an earlier version was hand-rolled on Radix Popover with a
// custom day grid and bespoke keyboard nav. That worked but the
// PopoverBackdrop was locking body scroll in a way that produced a
// visible layout shift, and the day-grid logic was ours to maintain.
// We migrated the day grid to react-day-picker (which shadcn's Base UI
// Date Picker also uses) and the popover shell to Base UI's Popover.
//
// Public API is unchanged from the prior implementation — every prop
// (compact, compactPresetLabel, stacked, horizontalLayout, presets,
// futurePresets, defaultPreset, showMonthTab, showTimeInput,
// formatTriggerLabel, popoverAlignment, size, minDate, maxDate, width)
// behaves the same way. One new prop: `backdrop` (default false) opts a
// caller into the page-dim overlay + scroll lock (only /races uses it).
//
// Day grid: react-day-picker mode="range" with our CSS class names
// threaded through `classNames` / `modifiersClassNames`. The 12-month
// quick-pick grid stays hand-rolled (DayPicker doesn't ship that mode).

import React, { useState, useCallback, useRef } from "react";
import { Popover } from "@base-ui/react/popover";
import {
  DayPicker,
  type DateRange as RDPDateRange,
  type DayButtonProps,
} from "react-day-picker";

import Switch from "./Switch";
import PopoverBackdrop from "./PopoverBackdrop";

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

function ClockIcon() {
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
        d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM8.75 4.75V4H7.25V4.75V7.875C7.25 8.18976 7.39819 8.48615 7.65 8.675L9.55 10.1L10.15 10.55L11.05 9.35L8.75 7.625V4.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Constants
// ============================================================================

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

// ============================================================================
// Types
// ============================================================================

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarPreset {
  label: string;
  value: string;
  getRange: () => DateRange;
}

type TimezoneOption = "UTC" | "local";

export interface CalendarProps {
  placeholder?: string;
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  width?: number;
  horizontalLayout?: boolean;
  showTimeInput?: boolean;
  popoverAlignment?: "start" | "center" | "end";
  presets?: CalendarPreset[];
  futurePresets?: CalendarPreset[];
  presetPlaceholder?: string;
  compact?: boolean;
  /** When `compact` and `presets` are also set, collapse the date
   *  trigger to an icon-only button (40px) and let the preset
   *  combobox carry the label. Useful when the resting state
   *  should read "Last 7 days" rather than an explicit date range. */
  compactPresetLabel?: boolean;
  stacked?: boolean;
  defaultPreset?: string;
  minDate?: Date;
  maxDate?: Date;
  size?: "small" | "default";
  showMonthTab?: boolean;
  /** Override the trigger button label. Receives the current
   *  range; return what the trigger should display. When omitted,
   *  the built-in formatDateRange is used. */
  formatTriggerLabel?: (range: DateRange) => string;
  /** Render a page-dim overlay behind the open popover and lock
   *  document scroll while open. Off by default — opt in on pages
   *  where the picker is a focal action (e.g. /races filter row).
   *  When off, no scroll lock means no layout shift on open. */
  backdrop?: boolean;
}

// ============================================================================
// Utility Functions
// ============================================================================

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function formatDateForInput(date: Date | null): string {
  if (!date) return "";
  const month = MONTH_NAMES[date.getMonth()].slice(0, 3);
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day.toString().padStart(2, "0")}, ${year}`;
}

function isFullMonth(range: DateRange): boolean {
  if (!range.start || !range.end) return false;
  const start = range.start;
  const end = range.end;
  if (
    start.getMonth() !== end.getMonth() ||
    start.getFullYear() !== end.getFullYear()
  )
    return false;
  const lastDayOfMonth = new Date(
    start.getFullYear(),
    start.getMonth() + 1,
    0,
  ).getDate();
  return start.getDate() === 1 && end.getDate() === lastDayOfMonth;
}

function formatDateRange(range: DateRange): string {
  if (!range.start) return "";

  if (!range.end || isSameDay(range.start, range.end)) {
    const month = MONTH_NAMES[range.start.getMonth()].slice(0, 3);
    return `${month} ${range.start.getDate()}, ${range.start.getFullYear()}`;
  }

  if (isFullMonth(range)) {
    return `${MONTH_NAMES[range.start.getMonth()]} ${range.start.getFullYear()}`;
  }

  const startMonth = MONTH_NAMES[range.start.getMonth()].slice(0, 3);
  const endMonth = MONTH_NAMES[range.end.getMonth()].slice(0, 3);
  const startYear = range.start.getFullYear();
  const endYear = range.end.getFullYear();

  if (startYear === endYear) {
    return `${startMonth} ${range.start.getDate()} – ${endMonth} ${range.end.getDate()}, ${endYear}`;
  }
  return `${startMonth} ${range.start.getDate()}, ${startYear} – ${endMonth} ${range.end.getDate()}, ${endYear}`;
}

function getLocalTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "Local";
  }
}

function getTimezoneOffsetHours(): number {
  return new Date().getTimezoneOffset() / -60;
}

function formatTimeForTimezone(
  tz: TimezoneOption,
  isEndTime: boolean = false,
): string {
  let hours = isEndTime ? 23 : 0;
  const minutes = isEndTime ? 59 : 0;

  if (tz === "UTC") {
    const offsetHours = getTimezoneOffsetHours();
    hours = hours - offsetHours;

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

// ============================================================================
// Day grid — react-day-picker wrapper
// ============================================================================
//
// DayPicker handles the day grid, keyboard navigation, and a11y. We thread
// our CSS class names through `classNames` and `modifiersClassNames` so the
// visual treatment matches what we hand-rolled. The DOM shape (table + td
// + button) is close enough to ours that the .calendar-* styles in
// globals.css apply with only minor adjustments (see the .rdp-day_button
// reset block adjacent to .calendar-day).

function toRdpRange(range: DateRange): RDPDateRange | undefined {
  if (!range.start) return undefined;
  return {
    from: range.start,
    to: range.end ?? undefined,
  };
}

function addMonths(date: Date, n: number): Date {
  const out = new Date(date);
  out.setMonth(out.getMonth() + n);
  return out;
}

// Custom DayButton — mirrors every active modifier onto a `data-*`
// attribute on the `<button>` itself so the day-state CSS can be
// written as simple attribute selectors (`.calendar-day[data-today]`)
// instead of descendant chains off the parent `<td>`. Same trick
// shadcn's Base UI Calendar uses; lets us drop the modifier→className
// mapping for selected/today/outside/disabled/weekend from DayPicker's
// `classNames` prop, since the styling now lives on the button.
// react-day-picker still emits its own data-* attrs on the `<td>` (Day);
// these duplicate a subset of those on the button for selector reach.
function CalendarDayButton(props: DayButtonProps) {
  const { day: _day, modifiers, ...buttonProps } = props;
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const dataAttr = (active: boolean | undefined) =>
    active ? "" : undefined;

  return (
    <button
      ref={ref}
      data-selected={dataAttr(modifiers.selected)}
      data-range-start={dataAttr(modifiers.range_start)}
      data-range-middle={dataAttr(modifiers.range_middle)}
      data-range-end={dataAttr(modifiers.range_end)}
      data-today={dataAttr(modifiers.today)}
      data-outside={dataAttr(modifiers.outside)}
      data-disabled={dataAttr(modifiers.disabled)}
      data-weekend={dataAttr(modifiers.weekend)}
      {...buttonProps}
    />
  );
}

function CalendarGrid({
  dateRange,
  onDateSelect,
  minDate,
  maxDate,
}: {
  dateRange: DateRange;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}) {
  const today = new Date();
  const [month, setMonth] = useState<Date>(dateRange.start ?? today);

  const selected = toRdpRange(dateRange);

  const disabledMatcher = React.useMemo(() => {
    const matchers: Array<(d: Date) => boolean> = [];
    if (minDate) {
      const floor = new Date(
        minDate.getFullYear(),
        minDate.getMonth(),
        minDate.getDate(),
      );
      matchers.push((d) => d < floor);
    }
    if (maxDate) {
      const ceil = new Date(
        maxDate.getFullYear(),
        maxDate.getMonth(),
        maxDate.getDate(),
      );
      matchers.push((d) => d > ceil);
    }
    if (matchers.length === 0) return undefined;
    return (d: Date) => matchers.some((m) => m(d));
  }, [minDate, maxDate]);

  const weekendModifier = React.useCallback(
    (date: Date) => date.getDay() === 0 || date.getDay() === 6,
    [],
  );

  // We render our own caption (label + prev/next) outside DayPicker
  // so the header keeps the original layout (label flex-left, nav
  // buttons flex-right) without fighting DayPicker's grid. DayPicker
  // is reduced to a controlled day grid — its hideNavigation hides
  // the built-in nav, and we drive it via month / onMonthChange.
  return (
    <>
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
            {MONTH_NAMES[month.getMonth()]} {month.getFullYear()}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setMonth(addMonths(month, -1))}
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
          onClick={() => setMonth(addMonths(month, 1))}
          aria-label="Next"
          data-testid="calendar/nav/next"
          className="calendar-nav-button"
        >
          <span className="calendar-nav-button-content">
            <ChevronRightIcon />
          </span>
        </button>
      </div>

      <div aria-hidden="true" style={{ marginTop: 11 }} />

      <DayPicker
        mode="range"
        selected={selected}
        onDayClick={(day, modifiers) => {
          if (modifiers.disabled) return;
          onDateSelect(day);
        }}
        month={month}
        onMonthChange={setMonth}
        disabled={disabledMatcher}
        showOutsideDays
        weekStartsOn={0}
        hideNavigation
        modifiers={{ weekend: weekendModifier }}
        components={{ DayButton: CalendarDayButton }}
        classNames={{
          root: "calendar-rdp-root",
          months: "calendar-rdp-months",
          month: "calendar-rdp-month",
          month_caption: "calendar-rdp-month-caption-hidden",
          caption_label: "calendar-rdp-caption-label-hidden",
          month_grid: "calendar-table",
          weekdays: "calendar-header-row",
          weekday: "calendar-rdp-weekday",
          weeks: "calendar-body",
          week: "calendar-body-row",
          // Day cell (<td>) — range-state classes drive the half-fill /
          // light-fill background. Day-state styling (selected, today,
          // outside, disabled, weekend) is on the inner <button> via
          // data-* attrs (see CalendarDayButton).
          day: "calendar-cell",
          day_button: "calendar-day",
          range_start: "calendar-cell-first-in-range",
          range_middle: "calendar-cell-in-range",
          range_end: "calendar-cell-last-in-range",
        }}
      />
    </>
  );
}

// ============================================================================
// Month Grid Component (for showMonthTab)
// ============================================================================

function MonthGrid({
  dateRange,
  onMonthSelect,
  minDate,
  maxDate,
}: {
  dateRange: DateRange;
  onMonthSelect: (start: Date, end: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const isMonthSelected = (monthIndex: number) => {
    if (!dateRange.start) return false;
    return (
      dateRange.start.getMonth() === monthIndex &&
      dateRange.start.getFullYear() === currentYear
    );
  };

  const isMonthDisabled = (monthIndex: number) => {
    const monthStart = new Date(currentYear, monthIndex, 1);
    const monthEnd = new Date(currentYear, monthIndex + 1, 0);
    if (
      minDate &&
      monthEnd <
        new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    )
      return true;
    if (
      maxDate &&
      monthStart >
        new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
    )
      return true;
    return false;
  };

  return (
    <>
      {/* Year navigation */}
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
            {currentYear}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setCurrentYear(currentYear - 1)}
          aria-label="Previous year"
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
          onClick={() => setCurrentYear(currentYear + 1)}
          aria-label="Next year"
          className="calendar-nav-button"
        >
          <span className="calendar-nav-button-content">
            <ChevronRightIcon />
          </span>
        </button>
      </div>

      {/* Spacer */}
      <div aria-hidden="true" style={{ marginTop: 11 }} />

      {/* Month grid */}
      <div className="calendar-month-grid">
        {MONTH_NAMES.map((monthName, index) => {
          const selected = isMonthSelected(index);
          const disabled = isMonthDisabled(index);

          return (
            <button
              key={monthName}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (disabled) return;
                const start = new Date(currentYear, index, 1);
                const end = new Date(currentYear, index + 1, 0);
                onMonthSelect(start, end);
              }}
              className={`calendar-month-cell ${selected ? "calendar-month-cell-selected" : ""} ${disabled ? "calendar-month-cell-disabled" : ""}`}
            >
              {monthName.slice(0, 3)}
            </button>
          );
        })}
      </div>
    </>
  );
}

// ============================================================================
// Main Calendar Component
// ============================================================================

export function Calendar({
  placeholder = "Select Date Range",
  value,
  onChange,
  width = 250,
  horizontalLayout = false,
  showTimeInput = true,
  popoverAlignment = "start",
  presets,
  futurePresets,
  presetPlaceholder = "Select Period",
  compact = false,
  compactPresetLabel = false,
  stacked = false,
  defaultPreset,
  minDate,
  maxDate,
  size = "default",
  showMonthTab = false,
  formatTriggerLabel,
  backdrop = false,
}: CalendarProps) {
  // Resolve default preset on initial render.
  const resolvedDefault = React.useMemo(() => {
    if (!defaultPreset) return null;
    const preset =
      presets?.find((p) => p.value === defaultPreset) ||
      futurePresets?.find((p) => p.value === defaultPreset);
    if (!preset) return null;
    return { value: preset.value, range: preset.getRange() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effectiveWidth = compact ? 180 : width;
  const [isOpen, setIsOpen] = useState(false);
  const [internalDateRange, setInternalDateRange] = useState<DateRange>(
    resolvedDefault?.range ?? { start: null, end: null },
  );
  const [selectionState, setSelectionState] = useState<"start" | "end">(
    "start",
  );
  const [selectedPreset, setSelectedPreset] = useState<string>(
    resolvedDefault?.value ?? "",
  );
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState(false);
  const [calendarTab, setCalendarTab] = useState<"dates" | "months">("dates");
  const [timezone, setTimezone] = useState<TimezoneOption>("local");
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

  // Controlled value when provided, internal otherwise.
  const dateRange = value ?? internalDateRange;
  const setDateRange = (range: DateRange) => {
    if (onChange) {
      onChange(range);
    } else {
      setInternalDateRange(range);
    }
  };

  const getTimezoneDisplayText = useCallback((tz: TimezoneOption) => {
    return tz === "UTC" ? "UTC" : `Local (${getLocalTimezone()})`;
  }, []);

  const measureTimezoneWidth = useCallback(() => {
    if (timezoneTextRef.current) {
      const width = timezoneTextRef.current.offsetWidth;
      setTimezoneWidth(width + 32);
    }
  }, []);

  React.useLayoutEffect(() => {
    measureTimezoneWidth();
  }, [timezone, measureTimezoneWidth]);

  React.useEffect(() => {
    setStartTimeInput(formatTimeForTimezone(timezone, false));
    setEndTimeInput(formatTimeForTimezone(timezone, true));
  }, [timezone]);

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
      setEndDateInput(formatDateForInput(dateRange.start));
    } else {
      setEndDateInput(formatDateForInput(today));
    }
  }, [dateRange]);

  // Two-click range selection: first click sets start, second sets end
  // (auto-swap if before start). If a complete range exists, the next
  // click restarts from that day. Matches the original Calendar.
  const handleDateSelect = (date: Date) => {
    if (selectionState === "start") {
      setDateRange({ start: date, end: null });
      setSelectionState("end");
    } else {
      if (dateRange.start && date < dateRange.start) {
        setDateRange({ start: date, end: dateRange.start });
      } else {
        setDateRange({ start: dateRange.start, end: date });
      }
      setSelectionState("start");
      setIsOpen(false);
    }
  };

  const handleApply = () => {
    if (dateRange.start && dateRange.end) {
      setIsOpen(false);
    }
  };

  const handleClearRange = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDateRange({ start: null, end: null });
    setSelectionState("start");
    setSelectedPreset("");
    const today = new Date();
    setStartDateInput(formatDateForInput(today));
    setEndDateInput(formatDateForInput(today));
    setStartTimeInput(formatTimeForTimezone(timezone, false));
    setEndTimeInput(formatTimeForTimezone(timezone, true));
  };

  const handleMonthSelect = (start: Date, end: Date) => {
    setDateRange({ start, end });
    setSelectionState("start");
    setSelectedPreset("");
    setIsOpen(false);
  };

  const handlePresetSelect = (presetValue: string, closeDropdown = true) => {
    const preset =
      presets?.find((p) => p.value === presetValue) ||
      futurePresets?.find((p) => p.value === presetValue);
    if (preset) {
      const range = preset.getRange();
      setDateRange(range);
      setSelectedPreset(presetValue);
      setSelectionState("start");
    }
    if (closeDropdown) {
      setIsPresetDropdownOpen(false);
    }
  };

  const hasSelection = dateRange.start !== null;
  const displayText = hasSelection
    ? formatTriggerLabel
      ? formatTriggerLabel(dateRange)
      : formatDateRange(dateRange)
    : placeholder;
  const selectedPresetLabel =
    presets?.find((p) => p.value === selectedPreset)?.label ||
    futurePresets?.find((p) => p.value === selectedPreset)?.label;

  // Map our `popoverAlignment` to Base UI's Positioner `align`.
  const positionerAlign = popoverAlignment;
  const positionerSideOffset = 12;

  return (
    <>
      {/* Hidden element to measure timezone text width */}
      <span
        ref={timezoneTextRef}
        className="calendar-select-measure"
        aria-hidden="true"
      >
        {getTimezoneDisplayText(timezone)}
      </span>

      <div
        className={`calendar-wrapper ${presets && presets.length > 0 ? "calendar-wrapper-with-presets" : ""} ${compact ? "calendar-wrapper-compact" : ""} ${stacked ? "calendar-wrapper-stacked" : ""}`}
        style={
          {
            width:
              presets && presets.length > 0 && !stacked
                ? "auto"
                : effectiveWidth,
            "--calendar-width": `${effectiveWidth}px`,
          } as React.CSSProperties
        }
        data-preset-open={isPresetDropdownOpen}
        data-size={size}
      >
        {/* Compact mode with presets: unified container with calendar trigger + divider + preset trigger. */}
        {compact && presets && presets.length > 0 && (
          <div
            className="calendar-compact-container"
            data-preset-open={isPresetDropdownOpen}
            data-preset-label={compactPresetLabel || undefined}
          >
            {/* Calendar trigger */}
            <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
              <Popover.Trigger
                className="calendar-compact-calendar-trigger"
                aria-haspopup="dialog"
                data-testid="calendar/trigger/button"
                title={placeholder}
                onClick={() => setIsPresetDropdownOpen(false)}
              >
                <span className="calendar-compact-icon">
                  <CalendarIcon />
                </span>
                <span className="calendar-compact-date-text">
                  {displayText}
                </span>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Positioner
                  side="bottom"
                  align="start"
                  sideOffset={positionerSideOffset}
                  style={{ zIndex: 2001 }}
                >
                  <Popover.Popup
                    className="calendar-dropdown"
                    data-testid="calendar/popover"
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
                    <CalendarPopoverBody
                      horizontalLayout={horizontalLayout}
                      showMonthTab={showMonthTab}
                      showTimeInput={showTimeInput}
                      startDateInput={startDateInput}
                      setStartDateInput={setStartDateInput}
                      endDateInput={endDateInput}
                      setEndDateInput={setEndDateInput}
                      startTimeInput={startTimeInput}
                      setStartTimeInput={setStartTimeInput}
                      endTimeInput={endTimeInput}
                      setEndTimeInput={setEndTimeInput}
                      timezone={timezone}
                      setTimezone={setTimezone}
                      timezoneWidth={timezoneWidth}
                      handleApply={handleApply}
                      calendarTab={calendarTab}
                      setCalendarTab={setCalendarTab}
                      dateRange={dateRange}
                      handleDateSelect={handleDateSelect}
                      handleMonthSelect={handleMonthSelect}
                      minDate={minDate}
                      maxDate={maxDate}
                    />
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>

            {/* Divider */}
            <div className="calendar-compact-divider" aria-hidden="true" />

            {/* Preset trigger */}
            <Popover.Root
              open={isPresetDropdownOpen}
              onOpenChange={setIsPresetDropdownOpen}
            >
              <Popover.Trigger
                className="calendar-compact-preset-trigger"
                aria-haspopup="dialog"
                data-testid="calendar/preset-trigger"
              >
                <span className="calendar-compact-preset-text">
                  {selectedPresetLabel || presetPlaceholder}
                </span>
                <span className="calendar-compact-chevron">
                  <ChevronDownIcon />
                </span>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Positioner
                  side="bottom"
                  align="end"
                  sideOffset={positionerSideOffset}
                  style={{ zIndex: 2002 }}
                >
                  <Popover.Popup className="calendar-preset-dropdown calendar-preset-dropdown-compact">
                    <div className="calendar-preset-dropdown-inner">
                      <div className="calendar-preset-list">
                        {presets.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            className={`calendar-preset-item ${selectedPreset === preset.value ? "calendar-preset-item-selected" : ""}`}
                            onClick={() =>
                              handlePresetSelect(preset.value, false)
                            }
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          </div>
        )}

        {/* Non-compact mode: presets combobox */}
        {!compact && presets && presets.length > 0 && (
          <Popover.Root
            open={isPresetDropdownOpen}
            onOpenChange={setIsPresetDropdownOpen}
          >
            <Popover.Trigger
              render={
                <div
                  className="calendar-combobox-wrapper"
                  style={{ width: effectiveWidth }}
                />
              }
              nativeButton={false}
            >
              <input
                className="calendar-combobox-input"
                data-error="false"
                data-testid="calendar/combobox-input"
                placeholder={presetPlaceholder}
                aria-haspopup="dialog"
                aria-expanded={isPresetDropdownOpen}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                aria-autocomplete="list"
                role="combobox"
                type="text"
                value={selectedPresetLabel || ""}
                readOnly
              />
              <span className="calendar-combobox-prefix">
                <ClockIcon />
              </span>
              <span className="calendar-combobox-suffix">
                <ChevronDownIcon />
              </span>
              <div aria-hidden="true" className="calendar-combobox-divider" />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner
                side="bottom"
                align="start"
                sideOffset={positionerSideOffset}
                style={{ zIndex: 2002 }}
              >
                <Popover.Popup className="calendar-preset-dropdown">
                  <div className="calendar-preset-dropdown-inner">
                    <div className="calendar-preset-list">
                      {presets.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          className={`calendar-preset-item ${selectedPreset === preset.value ? "calendar-preset-item-selected" : ""}`}
                          onClick={() => handlePresetSelect(preset.value)}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    {futurePresets && (
                      <div className="calendar-preset-future">
                        {futurePresets.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            className={`calendar-preset-item ${selectedPreset === preset.value ? "calendar-preset-item-selected" : ""}`}
                            onClick={() => handlePresetSelect(preset.value)}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        )}

        {/* Standalone trigger (non-compact-with-presets) */}
        {(!compact || !presets || presets.length === 0) &&
          !(compact && presets && presets.length > 0) && (
            <span className={compact ? "calendar-trigger-wrapper-compact" : ""}>
              <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
                <Popover.Trigger
                  className={`calendar-trigger-button flex items-center justify-between text-left cursor-pointer text-[rgb(23,23,23)] dark:text-[rgb(237,237,237)] ${isOpen ? "calendar-trigger-button-expanded" : ""} ${presets && presets.length > 0 ? "calendar-trigger-button-with-presets" : ""} ${compact ? "calendar-trigger-button-compact" : ""}`}
                  aria-haspopup="dialog"
                  data-testid="calendar/trigger/button"
                  title={placeholder}
                  style={{
                    width: compact ? undefined : effectiveWidth,
                    height: size === "small" ? 32 : 40,
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: compact ? undefined : 6,
                    fontSize: 14,
                    lineHeight: "20px",
                    fontWeight: 400,
                  }}
                >
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
                  <span
                    className="calendar-trigger-content overflow-hidden text-ellipsis whitespace-nowrap flex-1"
                    style={{
                      paddingLeft: 6,
                      paddingRight: hasSelection && !stacked ? 8 : 20,
                    }}
                  >
                    {displayText}
                  </span>
                  {hasSelection && !stacked && (
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
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Positioner
                    side="bottom"
                    align={positionerAlign}
                    sideOffset={positionerSideOffset}
                    style={{ zIndex: 2001 }}
                  >
                    <Popover.Popup
                      className="calendar-dropdown"
                      data-testid="calendar/popover"
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
                      <CalendarPopoverBody
                        horizontalLayout={horizontalLayout}
                        showMonthTab={showMonthTab}
                        showTimeInput={showTimeInput}
                        startDateInput={startDateInput}
                        setStartDateInput={setStartDateInput}
                        endDateInput={endDateInput}
                        setEndDateInput={setEndDateInput}
                        startTimeInput={startTimeInput}
                        setStartTimeInput={setStartTimeInput}
                        endTimeInput={endTimeInput}
                        setEndTimeInput={setEndTimeInput}
                        timezone={timezone}
                        setTimezone={setTimezone}
                        timezoneWidth={timezoneWidth}
                        handleApply={handleApply}
                        calendarTab={calendarTab}
                        setCalendarTab={setCalendarTab}
                        dateRange={dateRange}
                        handleDateSelect={handleDateSelect}
                        handleMonthSelect={handleMonthSelect}
                        minDate={minDate}
                        maxDate={maxDate}
                      />
                    </Popover.Popup>
                  </Popover.Positioner>
                </Popover.Portal>
              </Popover.Root>
            </span>
          )}
      </div>

      {/* Optional page-dim + scroll-lock overlay. Off by default so
          most pages don't lock document scroll on open (which is what
          previously caused the layout shift). /races opts in. */}
      {backdrop && (
        <PopoverBackdrop open={isOpen || isPresetDropdownOpen} />
      )}
    </>
  );
}

// ============================================================================
// Calendar popover body (shared between compact + standalone triggers)
// ============================================================================
//
// The contents of the calendar popover are identical between the
// compact and standalone triggers — inputs section + grid (or month
// tab) section, optionally laid out side-by-side. Pulled out into one
// component so the two triggers don't drift apart.

interface CalendarPopoverBodyProps {
  horizontalLayout: boolean;
  showMonthTab: boolean;
  showTimeInput: boolean;
  startDateInput: string;
  setStartDateInput: (v: string) => void;
  endDateInput: string;
  setEndDateInput: (v: string) => void;
  startTimeInput: string;
  setStartTimeInput: (v: string) => void;
  endTimeInput: string;
  setEndTimeInput: (v: string) => void;
  timezone: TimezoneOption;
  setTimezone: (tz: TimezoneOption) => void;
  timezoneWidth: number | null;
  handleApply: () => void;
  calendarTab: "dates" | "months";
  setCalendarTab: (t: "dates" | "months") => void;
  dateRange: DateRange;
  handleDateSelect: (date: Date) => void;
  handleMonthSelect: (start: Date, end: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

function CalendarPopoverBody({
  horizontalLayout,
  showMonthTab,
  showTimeInput,
  startDateInput,
  setStartDateInput,
  endDateInput,
  setEndDateInput,
  startTimeInput,
  setStartTimeInput,
  endTimeInput,
  setEndTimeInput,
  timezone,
  setTimezone,
  timezoneWidth,
  handleApply,
  calendarTab,
  setCalendarTab,
  dateRange,
  handleDateSelect,
  handleMonthSelect,
  minDate,
  maxDate,
}: CalendarPopoverBodyProps) {
  return (
    <>
      <button type="button" className="sr-only">
        Calendar dialog
      </button>
      <div
        className={`calendar-content-wrapper ${horizontalLayout ? "calendar-content-wrapper-horizontal" : ""}`}
      >
        <div
          className={
            horizontalLayout
              ? "calendar-content-flex-horizontal"
              : "calendar-content-flex"
          }
        >
          {!showMonthTab && (
            <div className="calendar-inputs-wrapper">
              <div className="space-y-2">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label data-version="v1">
                      <div className="calendar-input-label">Start</div>
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
                        onChange={(e) => setStartDateInput(e.target.value)}
                      />
                    </div>
                    {showTimeInput && (
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
                          onChange={(e) => setStartTimeInput(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label data-version="v1">
                      <div className="calendar-input-label">End</div>
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
                        onChange={(e) => setEndDateInput(e.target.value)}
                      />
                    </div>
                    {showTimeInput && (
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
                          onChange={(e) => setEndTimeInput(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={horizontalLayout ? "" : "mt-2"}>
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
                <div className="mt-1 flex justify-center">
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
                          setTimezone(e.target.value as TimezoneOption)
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
          )}
          <div>
            {showMonthTab && (
              <Switch
                size="small"
                fullWidth
                className="mb-3"
                options={[
                  { value: "dates", label: "Dates" },
                  { value: "months", label: "Months" },
                ]}
                value={calendarTab}
                onChange={(v) => setCalendarTab(v as "dates" | "months")}
              />
            )}
            {(!showMonthTab || calendarTab === "dates") && (
              <CalendarGrid
                dateRange={dateRange}
                onDateSelect={handleDateSelect}
                minDate={minDate}
                maxDate={maxDate}
              />
            )}
            {showMonthTab && calendarTab === "months" && (
              <MonthGrid
                dateRange={dateRange}
                onMonthSelect={handleMonthSelect}
                minDate={minDate}
                maxDate={maxDate}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Calendar;
