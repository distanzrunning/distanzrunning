"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { type ReactNode } from "react";

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
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 14px;
    line-height: 20px;
    max-width: 250px;
    background: var(--ds-gray-1000);
    color: var(--ds-background-100);
    box-shadow: var(--ds-shadow-tooltip);
    user-select: none;
    animation-duration: 200ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
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
    fill: var(--ds-gray-1000);
  }
`;

// ============================================================================
// Compound Components
// ============================================================================

function ContextCardTrigger({
  children,
  content,
  side = "top",
  sideOffset = 8,
}: ContextCardTriggerProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="ds-context-card"
          side={side}
          sideOffset={sideOffset}
        >
          {content}
          <Tooltip.Arrow className="ds-context-card-arrow" width={12} height={6} />
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
