"use client";

import { forwardRef } from "react";

// ============================================================================
// Icons
// ============================================================================

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      height="20"
      width="20"
      data-slot="geist-icon"
      style={{ color: "currentcolor" }}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="m10.5 14.06-.53-.53-4.82-4.82a1 1 0 0 1 0-1.42l4.82-4.82.53-.53L11.56 3l-.53.53L6.56 8l4.47 4.47.53.53z"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      height="20"
      width="20"
      data-slot="geist-icon"
      style={{ color: "currentcolor" }}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="m5.5 1.94.53.53 4.82 4.82a1 1 0 0 1 0 1.42l-4.82 4.82-.53.53L4.44 13l.53-.53L9.44 8 4.97 3.53 4.44 3z"
      />
    </svg>
  );
}

// ============================================================================
// Types
// ============================================================================

/**
 * Pagination slot config. Renders a real anchor (`<a href>`) — pagination is
 * URL navigation, so links keep open-in-new-tab, crawlability, and correct
 * semantics. For client-side routing, pass a `next/link`-resolved href. Omit
 * the slot entirely to hide the Previous or Next rail at the start / end of a
 * sequence.
 */
export interface PaginationSlot {
  /** Destination page title — short Title Case noun phrase */
  title: string;
  /** Destination href */
  href: string;
}

export interface PaginationProps {
  /** Previous-page slot. Omit to hide at the start of a sequence. */
  previous?: PaginationSlot;
  /** Next-page slot. Omit to hide at the end of a sequence. */
  next?: PaginationSlot;
  /** Additional CSS classes for the nav wrapper */
  className?: string;
  /** Inject between the previous and next rails (e.g. a feedback widget) */
  center?: React.ReactNode;
}

// ============================================================================
// Pagination
// ============================================================================

function PaginationRail({
  slot,
  direction,
}: {
  slot: PaginationSlot;
  direction: "previous" | "next";
}) {
  const isPrev = direction === "previous";
  const ariaLabel = `Go to ${direction} page: ${slot.title}`;
  const innerClass = isPrev
    ? "group p-1 rounded-md pr-2 pl-7"
    : "group p-1 rounded-md pl-2 pr-7 ml-auto";

  const content = (
    <>
      <span className="text-copy-13 !text-[var(--ds-gray-900)] mb-0.5 transition-colors duration-200 ease-in-out group-hover:!text-[var(--ds-gray-1000)]">
        {isPrev ? "Previous" : "Next"}
      </span>
      <div className="relative flex [&>span]:max-w-[20em] [&>span]:inline-block [&>span]:truncate [&>span]:break-words focus-visible:outline-none focus-visible:shadow-[var(--ds-focus-ring)]">
        <span className="text-[16px] leading-[24px] font-medium">
          {slot.title}
        </span>
        <span
          className={`absolute mt-0.5 text-[var(--ds-gray-900)] transition-colors duration-200 ease-in-out group-hover:text-[var(--ds-gray-1000)] ${
            isPrev ? "-left-[26px]" : "-right-[26px]"
          }`}
        >
          {isPrev ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </span>
      </div>
    </>
  );

  return (
    <a href={slot.href} aria-label={ariaLabel} className={innerClass}>
      {content}
    </a>
  );
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  function Pagination({ previous, next, className = "", center }, ref) {
    if (!previous && !next) return null;
    return (
      <nav
        ref={ref}
        aria-label="pagination"
        className={`relative flex justify-between flex-wrap items-start w-full [&_a]:no-underline ${className}`.trim()}
      >
        {previous && <PaginationRail slot={previous} direction="previous" />}
        {center && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2] max-xl:hidden">
            {center}
          </div>
        )}
        {next && <PaginationRail slot={next} direction="next" />}
      </nav>
    );
  },
);

export default Pagination;
