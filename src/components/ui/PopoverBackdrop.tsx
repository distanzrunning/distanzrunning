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

import { lockDocumentScroll } from "@/lib/scroll-lock";

interface PopoverBackdropProps {
  open: boolean;
  /** z-index of the backdrop. Defaults to 40 — UNDER the sticky
   *  masthead (z-50) so the chrome stays sharp at any header height
   *  (the mega-menu scrim's layering model), while everything in the
   *  page flow recedes. The popover content itself portals at
   *  z-[2001], far above. */
  zIndex?: number;
}

export default function PopoverBackdrop({
  open,
  zIndex = 40,
}: PopoverBackdropProps) {
  // Lock document scroll while open. lockDocumentScroll pads <html> by
  // the freed scrollbar width — there is no reserved scrollbar-gutter
  // (full-bleed chrome, see globals.css), so suppressing the scrollbar
  // without compensation would shift the page right by ~15 px.
  useEffect(() => {
    if (!open) return;
    return lockDocumentScroll();
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-hidden
      // Keyframe animation, not transition-opacity: the layer mounts
      // conditionally, so a transition has no from-state and the scrim
      // used to POP in at full strength.
      // inset-0, not the old top-[50px]: that offset was the previous
      // site header's height and sliced the veil through the taller
      // masthead — z-40 under the header now keeps the chrome sharp
      // instead of a magic pixel offset.
      className="fixed inset-0 motion-reduce:animate-none"
      style={{
        zIndex,
        // HALF the modal treatment (user call 2026-08-13 — the full
        // 0.8-frost + 8px blur read abrasive under a popover-scale
        // surface): same token colour, half opacity, half blur, eased
        // in. Modal/Sheet/CommandMenu/Mega-menu keep the full-strength
        // pair — a popover recedes the page, it doesn't replace it.
        backgroundColor: "var(--ds-overlay-backdrop-color)",
        opacity: "calc(var(--ds-overlay-backdrop-opacity) / 2)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        pointerEvents: "none",
        animation: "popover-backdrop-in 150ms ease-out",
      }}
    />,
    document.body,
  );
}
