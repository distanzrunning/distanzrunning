"use client";

import React, { useState, useCallback, useRef } from "react";
import * as Popover from "@radix-ui/react-popover";

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
        d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM8.75 4.75V4H7.25V4.75V7.875C7.25 8.18976 7.39819 8.48615 7.65 8.675L9.55 10.1L10.15 10.55L11.05 9.35L10.45 8.9L8.75 7.625V4.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Constants
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
}

// ============================================================================
// Utility Functions
// ============================================================================

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

function formatDateRange(range: DateRange): string {
  if (!range.start) return "";
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
  let minutes = isEndTime ? 59 : 0;

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
// Calendar Grid Component
// ============================================================================

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

  const isInPreviewRange = (day: { fullDate: Date }) => {
    if (!isSelectingEnd || !dateRange.start || !hoveredDate) return false;
    if (isSameDay(day.fullDate, dateRange.start)) return false;
    if (isSameDay(day.fullDate, hoveredDate)) return false;

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
    if (hoveredDate < dateRange.start) {
      return isSameDay(day.fullDate, hoveredDate);
    }
    return isSameDay(day.fullDate, dateRange.start);
  };

  const isPreviewEnd = (day: { fullDate: Date }) => {
    if (!isSelectingEnd || !dateRange.start || !hoveredDate) return false;
    if (isSameDay(dateRange.start, hoveredDate)) return false;
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
    if (
      newDate.getMonth() !== currentMonth ||
      newDate.getFullYear() !== currentYear
    ) {
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    }
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

                    const previewStart = isPreviewStart(day);
                    const previewEnd = isPreviewEnd(day);
                    const inPreviewRange = isInPreviewRange(day);
                    const hoveredPreview = isHoveredForPreview(day);

                    let tdClasses = "calendar-cell";

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
                        if (dayIndex === 0)
                          tdClasses += " calendar-cell-row-start";
                        if (dayIndex === 6)
                          tdClasses += " calendar-cell-row-end";
                      }
                    }

                    if (previewStart) {
                      tdClasses += " calendar-cell-preview-start";
                    } else if (previewEnd && !hoveredPreview) {
                      tdClasses += " calendar-cell-preview-end";
                    } else if (inPreviewRange) {
                      tdClasses += " calendar-cell-in-preview-range";
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
}: CalendarProps) {
  // Compact mode overrides
  const effectiveWidth = compact ? 180 : width;
  const [isOpen, setIsOpen] = useState(false);
  const [internalDateRange, setInternalDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [selectionState, setSelectionState] = useState<"start" | "end">(
    "start",
  );
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState(false);
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

  // Use controlled value if provided, otherwise use internal state
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

  const handlePresetSelect = (presetValue: string) => {
    const preset =
      presets?.find((p) => p.value === presetValue) ||
      futurePresets?.find((p) => p.value === presetValue);
    if (preset) {
      const range = preset.getRange();
      setDateRange(range);
      setSelectedPreset(presetValue);
      setSelectionState("start");
    }
    setIsPresetDropdownOpen(false);
  };

  const hasSelection = dateRange.start !== null;
  const displayText = hasSelection ? formatDateRange(dateRange) : placeholder;
  const selectedPresetLabel =
    presets?.find((p) => p.value === selectedPreset)?.label ||
    futurePresets?.find((p) => p.value === selectedPreset)?.label;

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
        className={`calendar-wrapper ${presets && presets.length > 0 ? "calendar-wrapper-with-presets" : ""} ${compact ? "calendar-wrapper-compact" : ""}`}
        style={{
          width: presets && presets.length > 0 ? "auto" : effectiveWidth,
        }}
      >
        {/* Presets Combobox */}
        {presets && presets.length > 0 && (
          <Popover.Root
            open={isPresetDropdownOpen}
            onOpenChange={setIsPresetDropdownOpen}
          >
            <Popover.Trigger asChild>
              <div
                className={`calendar-combobox-wrapper ${compact ? "calendar-combobox-wrapper-compact" : ""}`}
                style={{ width: compact ? 40 : effectiveWidth }}
              >
                <input
                  className={`calendar-combobox-input ${compact ? "calendar-combobox-input-compact" : ""}`}
                  data-error="false"
                  data-testid="calendar/combobox-input"
                  placeholder={
                    compact && !isPresetDropdownOpen ? "" : presetPlaceholder
                  }
                  aria-haspopup="dialog"
                  aria-expanded={isPresetDropdownOpen}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  aria-autocomplete="list"
                  role="combobox"
                  type="text"
                  value={
                    compact && !isPresetDropdownOpen
                      ? ""
                      : selectedPresetLabel || ""
                  }
                  readOnly
                  onClick={() => setIsPresetDropdownOpen(true)}
                  style={
                    compact && !isPresetDropdownOpen
                      ? { width: 40, paddingRight: 0, color: "transparent" }
                      : compact
                        ? { paddingRight: 0 }
                        : undefined
                  }
                />
                {!compact && (
                  <span className="calendar-combobox-prefix">
                    <ClockIcon />
                  </span>
                )}
                <span
                  className={`calendar-combobox-suffix ${compact ? "calendar-combobox-suffix-compact" : ""}`}
                >
                  <ChevronDownIcon />
                </span>
                {/* Right border divider - hidden in compact mode */}
                {!compact && (
                  <div
                    aria-hidden="true"
                    className="calendar-combobox-divider"
                  />
                )}
              </div>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="calendar-preset-dropdown"
                sideOffset={12}
                align="start"
                style={{ zIndex: 2002 }}
              >
                <div className="calendar-preset-dropdown-inner">
                  {/* Left column - Suggestions */}
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
                  {/* Right column - Future date presets */}
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
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )}

        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              data-testid="calendar/trigger/button"
              title={placeholder}
              className={`calendar-trigger-button flex items-center justify-between text-left cursor-pointer text-[rgb(23,23,23)] dark:text-[rgb(237,237,237)] ${isOpen ? "calendar-trigger-button-expanded" : ""} ${presets && presets.length > 0 ? "calendar-trigger-button-with-presets" : ""} ${compact ? "calendar-trigger-button-compact" : ""}`}
              style={{
                width: effectiveWidth,
                height: 40,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: compact ? undefined : 6,
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
                {displayText}
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
              align={popoverAlignment}
              data-testid="calendar/popover"
              tabIndex={-1}
              style={{
                zIndex: 2001,
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && dateRange.start && dateRange.end) {
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
              <div
                className={`calendar-content-wrapper ${horizontalLayout ? "calendar-content-wrapper-horizontal" : ""}`}
              >
                {/* Flex container - direction changes based on data-side attribute */}
                <div
                  className={
                    horizontalLayout
                      ? "calendar-content-flex-horizontal"
                      : "calendar-content-flex"
                  }
                >
                  {/* Inputs section - position depends on popover side (cells always closer to trigger) */}
                  <div className="calendar-inputs-wrapper">
                    <div className="space-y-2">
                      {/* Start Date/Time */}
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
                              onChange={(e) =>
                                setStartDateInput(e.target.value)
                              }
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
                                onChange={(e) =>
                                  setStartTimeInput(e.target.value)
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* End Date/Time */}
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
                                onChange={(e) =>
                                  setEndTimeInput(e.target.value)
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Apply Button and Timezone - at bottom for horizontal layout */}
                    <div className={horizontalLayout ? "" : "mt-2"}>
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

                  {/* Calendar grid - always positioned closer to the trigger */}
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
    </>
  );
}

export default Calendar;
