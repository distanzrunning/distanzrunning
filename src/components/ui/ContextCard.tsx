"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { forwardRef, useId, type ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

export interface ContextCardProps {
  /** Wrap triggers to share a single tooltip provider */
  children: ReactNode;
  /** Delay in ms before the tooltip appears */
  delayDuration?: number;
}

interface ContextCardTriggerProps {
  /** The element that triggers the tooltip on hover */
  children: ReactNode;
  /** Content shown inside the tooltip */
  content: ReactNode;
  /** Which side of the trigger the tooltip appears on */
  side?: "top" | "bottom" | "left" | "right";
  /** Distance in px between trigger and tooltip */
  sideOffset?: number;
}

// ============================================================================
// Styles
// ============================================================================

const CONTEXT_CARD_CSS = `
  .ds-context-card {
    border-radius: 6px;
    padding: 12px;
    font-size: 16px;
    line-height: 20px;
    max-width: max-content;
    background: var(--ds-background-100);
    color: var(--ds-gray-1000);
    box-shadow: var(--ds-shadow-tooltip);
    user-select: none;
    will-change: transform, opacity;
    animation-duration: 250ms;
    animation-timing-function: cubic-bezier(0.29, -0.31, -0.05, 0.96);
  }

  .ds-context-card[data-state="delayed-open"][data-side="top"] {
    animation-name: ds-context-card-slide-down-fade;
  }
  .ds-context-card[data-state="delayed-open"][data-side="bottom"] {
    animation-name: ds-context-card-slide-up-fade;
  }
  .ds-context-card[data-state="delayed-open"][data-side="left"] {
    animation-name: ds-context-card-slide-right-fade;
  }
  .ds-context-card[data-state="delayed-open"][data-side="right"] {
    animation-name: ds-context-card-slide-left-fade;
  }

  @keyframes ds-context-card-slide-up-fade {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes ds-context-card-slide-down-fade {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes ds-context-card-slide-left-fade {
    from { opacity: 0; transform: translateX(4px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes ds-context-card-slide-right-fade {
    from { opacity: 0; transform: translateX(-4px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .ds-context-card-arrow {
    position: absolute;
    pointer-events: none;
  }

  .ds-context-card-arrow path {
    fill: var(--ds-background-100);
    stroke: var(--ds-gray-400);
    stroke-width: 1px;
    shape-rendering: geometricPrecision;
  }
`;

// ============================================================================
// Compound Components
// ============================================================================

/**
 * Custom curved arrow SVG matching Geist's tooltip arrow.
 * The path is clipped to a 14×7 rectangle so the flat-edge stroke is hidden.
 * Uses forwardRef so Radix's asChild can position it correctly.
 */
const GeistArrow = forwardRef<SVGSVGElement, React.ComponentPropsWithoutRef<"svg">>(
  function GeistArrow(props, ref) {
    const clipId = useId();
    return (
      <svg
        {...props}
        ref={ref}
        className={`ds-context-card-arrow ${props.className ?? ""}`}
        width="14"
        height="7"
        viewBox="0 0 14 7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={clipId}>
            <rect width="14" height="7" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <path d="M15 -0.5V0.5H12.9834L12.8184 0.508789C12.4377 0.550822 12.0853 0.738056 11.8359 1.03418L8.53027 4.95996C7.73114 5.90893 6.26886 5.90892 5.46973 4.95996L2.16406 1.03418C1.87905 0.695733 1.45907 0.5 1.0166 0.5H-1V-0.5H15Z" />
        </g>
      </svg>
    );
  }
);

function ContextCardTrigger({
  children,
  content,
  side = "top",
  sideOffset = 8,
}: ContextCardTriggerProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            overflow: "hidden",
            pointerEvents: "all",
          }}
        >
          <span>{children}</span>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="ds-context-card"
          side={side}
          sideOffset={sideOffset}
        >
          {content}
          <Tooltip.Arrow asChild width={14} height={7}>
            <GeistArrow />
          </Tooltip.Arrow>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

// ============================================================================
// ContextCard
// ============================================================================

export function ContextCard({
  children,
  delayDuration = 200,
}: ContextCardProps) {
  return (
    <>
      <style>{CONTEXT_CARD_CSS}</style>
      <Tooltip.Provider delayDuration={delayDuration}>
        {children}
      </Tooltip.Provider>
    </>
  );
}

ContextCard.Trigger = ContextCardTrigger;
