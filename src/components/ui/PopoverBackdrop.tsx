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
  // Lock document scroll while open. We set overflow: hidden on the
  // <html> element (not body) because `scrollbar-gutter: stable` in
  // globals.css applies to <html> — combining overflow: hidden with
  // scrollbar-gutter: stable on the same element is the spec-defined
  // way to reserve a gutter while suppressing the scrollbar, with
  // zero layout shift. Locking on <body> instead lets the scrollbar
  // gutter collapse and the page jumps right by ~15 px.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-hidden
      className="fixed inset-x-0 bottom-0 top-[50px] transition-opacity duration-150"
      style={{
        zIndex,
        // Shared scrim, matching Modal/Sheet/CommandMenu/Mega-menu: the
        // --ds-overlay-backdrop-* token (rgb(0,0,0) @ 0.2) + blur(8px).
        // Was a hand-rolled opacity:0.5 / blur(12px).
        backgroundColor: "var(--ds-overlay-backdrop-color)",
        opacity: "var(--ds-overlay-backdrop-opacity)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        pointerEvents: "none",
      }}
    />,
    document.body,
  );
}
