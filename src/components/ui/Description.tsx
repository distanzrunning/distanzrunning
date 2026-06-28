"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { type ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

export interface DescriptionProps {
  /** Root wrapper — contains Title and Content */
  children: ReactNode;
  /** Text alignment of the list. Defaults to `left`. */
  align?: "left" | "right";
  /** Truncate the title and content to a single line with an ellipsis. */
  ellipsis?: boolean;
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
  }

  .ds-description--right {
    text-align: right;
  }

  .ds-description--ellipsis {
    width: 100%;
  }
  .ds-description--ellipsis > dt {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ds-description--ellipsis > dd {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Geist: the title is the muted label (gray-900, normal weight) */
  .ds-description-title {
    margin: 0 0 var(--ds-space-2x);
    font-size: 14px;
    line-height: 14px;
    min-height: 14px;
    font-weight: 400;
    text-transform: capitalize;
    white-space: nowrap;
    color: var(--ds-gray-900);
  }

  .ds-description-icon {
    display: inline-flex;
    align-items: center;
    vertical-align: -2px;
    margin-left: var(--ds-space);
    cursor: pointer;
    color: currentColor;
  }

  /* Geist: the content is the prominent value (gray-1000, medium) */
  .ds-description-content {
    margin: 0;
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    color: var(--ds-gray-1000);
  }

  .ds-description-tooltip {
    z-index: 1000000;
    max-width: 250px;
    padding: var(--ds-space-2x) var(--ds-space-3x);
    border-radius: var(--ds-radius-small);
    background: hsl(var(--color-textDefault));
    color: hsl(var(--color-textInverted));
    font-size: 13px;
    line-height: 1.3;
    font-weight: 400;
    text-align: center;
    white-space: pre-line;
    overflow-wrap: break-word;
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

  .ds-description-tooltip-arrow path {
    fill: var(--ds-gray-1000);
  }
`;

// ============================================================================
// Info Icon SVG — matches Geist's circle-i icon
// ============================================================================

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      height="14"
      width="14"
      style={{ color: "currentcolor" }}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fillOpacity=".08"
        d="M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2M7 7h-.75v1.5h1v2.75h1.5V8a1 1 0 0 0-1-1z"
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
                <Tooltip.Arrow asChild width={14} height={6}>
                  <svg
                    className="ds-description-tooltip-arrow"
                    viewBox="0 0 14 6"
                    width="14"
                    height="6"
                    aria-hidden="true"
                  >
                    <path d="M13.8284 0H0.17157C0.702003 0 1.21071 0.210714 1.58578 0.585787L5.58578 4.58579C6.36683 5.36684 7.63316 5.36683 8.41421 4.58579L12.4142 0.585786C12.7893 0.210714 13.298 0 13.8284 0Z" />
                  </svg>
                </Tooltip.Arrow>
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

export function Description({
  children,
  align = "left",
  ellipsis = false,
}: DescriptionProps) {
  const className = [
    "ds-description",
    align === "right" && "ds-description--right",
    ellipsis && "ds-description--ellipsis",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <style>{DESCRIPTION_CSS}</style>
      <dl className={className}>{children}</dl>
    </>
  );
}

Description.Title = DescriptionTitle;
Description.Content = DescriptionContent;
