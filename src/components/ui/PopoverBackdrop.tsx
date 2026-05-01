"use client";

// src/components/ui/PopoverBackdrop.tsx
//
// Page-dim + glassy blur shared by every popover-shaped filter
// surface (FilterChip, Calendar, etc). Mounts a fixed overlay
// portaled to document.body and locks body scroll while the
// popover is open. Mirrors the SiteHeader megamenu pattern so
// open popovers read as the focused surface and the page
// underneath clearly recedes.
//
// The overlay starts at top: 50 px so the SiteHeader stays sharp.
// pointer-events: none so the host popover's outside-click
// detection still fires through the layer.

import { useEffect } from "react";
import { createPortal } from "react-dom";

interface PopoverBackdropProps {
  open: boolean;
  /** z-index of the backdrop. Should sit just below the popover
   *  content's z-index. Defaults to 2000. */
  zIndex?: number;
}

export default function PopoverBackdrop({
  open,
  zIndex = 2000,
}: PopoverBackdropProps) {
  // Lock body scroll while open. Compensate for the disappearing
  // scrollbar so the page doesn't jump ~15 px when the overflow
  // flips to hidden.
  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-hidden
      className="fixed inset-x-0 bottom-0 top-[50px] transition-opacity duration-150"
      style={{
        zIndex,
        backgroundColor: "var(--ds-overlay-backdrop-color)",
        opacity: 0.5,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        pointerEvents: "none",
      }}
    />,
    document.body,
  );
}
