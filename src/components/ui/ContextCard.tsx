"use client";

import * as HoverCard from "@radix-ui/react-hover-card";
import { createContext, useContext, useId, type ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

export interface ContextCardProps {
  /** Wrap triggers so they share the same delay defaults */
  children: ReactNode;
  /** Delay in ms before the card opens on hover. Defaults to 200. */
  delayDuration?: number;
  /** Delay in ms before the card closes on cursor exit. Defaults to 150. */
  closeDelay?: number;
}

interface ContextCardTriggerProps {
  /** The element that triggers the card on hover or focus */
  children: ReactNode;
  /** Content shown inside the card */
  content: ReactNode;
  /** Which side of the trigger the card appears on */
  side?: "top" | "bottom" | "left" | "right";
  /** Alignment of the card against the trigger */
  align?: "start" | "center" | "end";
  /** Distance in px between trigger and card */
  sideOffset?: number;
  /** Override the open delay for this trigger */
  openDelay?: number;
  /** Override the close delay for this trigger */
  closeDelay?: number;
}

// ============================================================================
// Context — shares delay defaults from <ContextCard> down to each trigger
// ============================================================================

const ContextCardDelaysContext = createContext<{
  openDelay: number;
  closeDelay: number;
}>({ openDelay: 200, closeDelay: 150 });

// ============================================================================
// Styles
// ============================================================================

const CONTEXT_CARD_CSS = `
  .ds-context-card {
    z-index: 1000000;
    border-radius: 6px;
    padding: 12px;
    font-size: 16px;
    line-height: 20px;
    max-width: max-content;
    background: hsl(var(--color-surface));
    color: var(--ds-gray-1000);
    box-shadow: var(--ds-shadow-tooltip);
    will-change: transform, opacity;
    animation-duration: 250ms;
    animation-timing-function: cubic-bezier(0.29, -0.31, -0.05, 0.96);
  }

  .ds-context-card[data-state="open"][data-side="top"] {
    animation-name: ds-context-card-slide-down-fade;
  }
  .ds-context-card[data-state="open"][data-side="bottom"] {
    animation-name: ds-context-card-slide-up-fade;
  }
  .ds-context-card[data-state="open"][data-side="left"] {
    animation-name: ds-context-card-slide-right-fade;
  }
  .ds-context-card[data-state="open"][data-side="right"] {
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
    width: 14px;
    height: 7px;
    pointer-events: none;
  }

  .ds-context-card-arrow path {
    fill: hsl(var(--color-surface));
    stroke: var(--ds-gray-400);
    stroke-width: 1px;
    shape-rendering: geometricPrecision;
  }

  /* Always center the arrow on the card edge, regardless of trigger position */
  .ds-context-card[data-side="top"] .ds-context-card-arrow {
    bottom: -7px;
    left: 50%;
    transform: translateX(-50%);
  }
  .ds-context-card[data-side="bottom"] .ds-context-card-arrow {
    top: -7px;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
  }
  .ds-context-card[data-side="left"] .ds-context-card-arrow {
    right: -10.5px;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
    transform-origin: center;
  }
  .ds-context-card[data-side="right"] .ds-context-card-arrow {
    left: -10.5px;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: center;
  }
`;

// ============================================================================
// Compound Components
// ============================================================================

function GeistArrow() {
  const clipId = useId();
  return (
    <svg
      className="ds-context-card-arrow"
      width="14"
      height="7"
      viewBox="0 0 14 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
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

function ContextCardTrigger({
  children,
  content,
  side = "top",
  align = "center",
  sideOffset = 8,
  openDelay,
  closeDelay,
}: ContextCardTriggerProps) {
  const delays = useContext(ContextCardDelaysContext);
  return (
    <HoverCard.Root
      openDelay={openDelay ?? delays.openDelay}
      closeDelay={closeDelay ?? delays.closeDelay}
    >
      <HoverCard.Trigger asChild>
        <div
          style={{
            cursor: "pointer",
            display: "inline-flex",
            pointerEvents: "all",
          }}
        >
          {children}
        </div>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="ds-context-card"
          side={side}
          sideOffset={sideOffset}
          align={align}
        >
          {content}
          <GeistArrow />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

// ============================================================================
// ContextCard
// ============================================================================

export function ContextCard({
  children,
  delayDuration = 200,
  closeDelay = 150,
}: ContextCardProps) {
  return (
    <>
      <style>{CONTEXT_CARD_CSS}</style>
      <ContextCardDelaysContext.Provider
        value={{ openDelay: delayDuration, closeDelay }}
      >
        {children}
      </ContextCardDelaysContext.Provider>
    </>
  );
}

ContextCard.Trigger = ContextCardTrigger;
