"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { type ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

export interface DescriptionProps {
  /** Root wrapper — contains Title and Content */
  children: ReactNode;
}

interface DescriptionTitleProps {
  /** Title text */
  children: ReactNode;
  /** If provided, renders an info icon with tooltip content */
  tooltip?: ReactNode;
}

interface DescriptionContentProps {
  /** Description content */
  children: ReactNode;
}

// ============================================================================
// Styles — Geist computed values, scoped to .ds-description-*
// ============================================================================

const DESCRIPTION_CSS = `
  .ds-description {
    margin: 0;
    padding: 0;
    font-size: 14px;
    line-height: 20px;
  }

  .ds-description-title {
    display: flex;
    align-items: center;
    gap: var(--ds-space);
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: var(--ds-gray-1000);
  }

  .ds-description-icon {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    color: var(--ds-gray-700);
  }

  .ds-description-content {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--ds-gray-900);
  }

  .ds-description-tooltip {
    max-width: 250px;
    padding: var(--ds-space-2x) var(--ds-space-3x);
    border-radius: var(--ds-radius-small);
    background: var(--ds-gray-1000);
    color: var(--ds-background-100);
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    user-select: none;
    will-change: transform, opacity;
    animation-duration: 0.1s;
    animation-timing-function: ease-in;
  }

  .ds-description-tooltip[data-state="delayed-open"] {
    animation-name: ds-description-tooltip-fade-in;
  }

  @keyframes ds-description-tooltip-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .ds-description-tooltip-arrow {
    fill: var(--ds-gray-1000);
  }
`;

// ============================================================================
// Info Icon SVG — matches Geist's circle-i icon
// ============================================================================

function InfoIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ width: 14, height: 14, color: "currentcolor" }}
    >
      <path
        d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 6C8.55228 6 9 5.55228 9 5C9 4.44772 8.55228 4 8 4C7.44771 4 7 4.44772 7 5C7 5.55228 7.44771 6 8 6ZM7 7H6.25V8.5H7H7.24999V10.5V11.25H8.74999V10.5V8C8.74999 7.44772 8.30227 7 7.74999 7H7Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Compound Components
// ============================================================================

function DescriptionTitle({ children, tooltip }: DescriptionTitleProps) {
  return (
    <dt className="ds-description-title">
      {children}
      {tooltip && (
        <Tooltip.Provider delayDuration={400}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span className="ds-description-icon" tabIndex={0}>
                <InfoIcon />
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="ds-description-tooltip"
                side="top"
                sideOffset={8}
              >
                {tooltip}
                <Tooltip.Arrow className="ds-description-tooltip-arrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </dt>
  );
}

function DescriptionContent({ children }: DescriptionContentProps) {
  return <dd className="ds-description-content">{children}</dd>;
}

// ============================================================================
// Description
// ============================================================================

export function Description({ children }: DescriptionProps) {
  return (
    <>
      <style>{DESCRIPTION_CSS}</style>
      <dl className="ds-description">{children}</dl>
    </>
  );
}

Description.Title = DescriptionTitle;
Description.Content = DescriptionContent;
