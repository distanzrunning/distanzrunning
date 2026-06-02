"use client";

import { forwardRef } from "react";

// ============================================================================
// Icons
// ============================================================================

function ChevronLeftIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ width: 20, height: 20, color: "currentcolor" }}
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
      style={{ width: 20, height: 20, color: "currentcolor" }}
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
// Types
// ============================================================================

/**
 * Pagination slot config — provide either `href` (renders an anchor) or
 * `onClick` (renders a button). Omit the slot entirely to hide the
 * Previous or Next rail at the start / end of a sequence.
 */
export interface PaginationSlot {
  /** Destination page title — short Title Case noun phrase */
  title: string;
  /** Anchor href; mutually exclusive with onClick */
  href?: string;
  /** Click handler for SPA navigation; mutually exclusive with href */
  onClick?: () => void;
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
    ? "inline-block py-1 pl-7 pr-2 text-left text-textSubtle hover:text-textDefault transition-colors duration-200"
    : "inline-block py-1 pl-2 pr-7 text-left text-textSubtle hover:text-textDefault transition-colors duration-200";

  const content = (
    <>
      <span className="block text-[0.8125rem] leading-[1.125rem] font-normal mb-0.5">
        {isPrev ? "Previous" : "Next"}
      </span>
      <div className="relative flex items-center">
        <span className="text-[1rem] leading-[1.5rem] font-medium text-textDefault">
          {slot.title}
        </span>
        <span
          className={
            isPrev
              ? "absolute left-[-26px] mt-0.5"
              : "absolute right-[-26px] mt-0.5"
          }
        >
          {isPrev ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </span>
      </div>
    </>
  );

  if (slot.href) {
    return (
      <a href={slot.href} aria-label={ariaLabel} className={innerClass}>
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={slot.onClick}
      aria-label={ariaLabel}
      className={innerClass}
    >
      {content}
    </button>
  );
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  function Pagination({ previous, next, className = "", center }, ref) {
    if (!previous && !next) return null;
    return (
      <nav ref={ref} aria-label="pagination" className={className}>
        <div className="flex items-center pt-8 gap-6">
          <div className="flex-1">
            {previous && (
              <PaginationRail slot={previous} direction="previous" />
            )}
          </div>
          {center && (
            <div className="hidden md:block flex-shrink-0">{center}</div>
          )}
          <div className="flex-1 flex justify-end">
            {next && <PaginationRail slot={next} direction="next" />}
          </div>
        </div>
      </nav>
    );
  },
);

export default Pagination;
