"use client";

import React, { useState, useRef, useCallback, useEffect, cloneElement, isValidElement } from "react";
import { createPortal } from "react-dom";

// ============================================================================
// Types
// ============================================================================

type TooltipSide = "top" | "bottom" | "left" | "right";
type TooltipAlign = "start" | "center" | "end";

interface TooltipProps {
  /** Tooltip content — string or custom React content */
  content: React.ReactNode;
  /** Which side to show the tooltip */
  side?: TooltipSide;
  /** Alignment along the side axis */
  align?: TooltipAlign;
  /** Hover delay in ms (0 for instant) */
  delay?: number;
  /** Whether to show the arrow/tip indicator */
  showArrow?: boolean;
  /** Tooltip type/variant */
  type?: "default" | "success" | "error" | "warning";
  /** Text alignment within the tooltip */
  textAlign?: "left" | "center" | "right";
  /** The trigger element */
  children: React.ReactNode;
  /** Additional class for the wrapper */
  className?: string;
}

// ============================================================================
// Arrow offset + size
// ============================================================================

const ARROW_SIZE = 6;
const ARROW_GAP = 5; // gap between arrow tip and trigger
const TOOLTIP_OFFSET = ARROW_SIZE + ARROW_GAP;

// ============================================================================
// Type colors
// ============================================================================

const typeStyles: Record<
  "default" | "success" | "error" | "warning",
  { bg: string; color: string }
> = {
  default: { bg: "var(--ds-gray-1000)", color: "var(--ds-background-100)" },
  success: { bg: "var(--ds-blue-700)", color: "#fff" },
  error: { bg: "var(--ds-red-700)", color: "#fff" },
  warning: { bg: "var(--ds-amber-800)", color: "#fff" },
};

// ============================================================================
// Tooltip Component
// ============================================================================

export function Tooltip({
  content,
  side = "top",
  align = "center",
  delay = 150,
  showArrow = true,
  type = "default",
  textAlign = "center",
  children,
  className = "",
}: TooltipProps) {
  const [isActive, setIsActive] = useState(false); // trigger hovered
  const [isPositioned, setIsPositioned] = useState(false); // measured & placed
  const [position, setPosition] = useState({ top: 0, left: 0, arrowOffset: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Measurement helper — uses raw getBoundingClientRect()
  // (viewport-relative) coords, no scrollX/scrollY math, since
  // the tooltip itself is rendered with position:fixed. For a
  // sticky / fixed trigger that's the entire fix: the trigger
  // stays at its viewport position and the tooltip stays at
  // its viewport position, so they remain aligned during scroll
  // without any extra work. For non-sticky triggers, scroll
  // changes the trigger's viewport coords, so the scroll
  // listener below re-runs this to keep them aligned.
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (side) {
      case "top":
        top = triggerRect.top - tooltipRect.height - TOOLTIP_OFFSET;
        break;
      case "bottom":
        top = triggerRect.bottom + TOOLTIP_OFFSET;
        break;
      case "left":
        left = triggerRect.left - tooltipRect.width - TOOLTIP_OFFSET;
        break;
      case "right":
        left = triggerRect.right + TOOLTIP_OFFSET;
        break;
    }

    if (side === "top" || side === "bottom") {
      switch (align) {
        case "start":
          left = triggerRect.left;
          break;
        case "center":
          left =
            triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case "end":
          left = triggerRect.right - tooltipRect.width;
          break;
      }
    } else {
      switch (align) {
        case "start":
          top = triggerRect.top;
          break;
        case "center":
          top =
            triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
        case "end":
          top = triggerRect.bottom - tooltipRect.height;
          break;
      }
    }

    let arrowOffset = 0;
    if (side === "top" || side === "bottom") {
      arrowOffset = triggerRect.left + triggerRect.width / 2 - left;
    } else {
      arrowOffset = triggerRect.top + triggerRect.height / 2 - top;
    }

    setPosition({ top, left, arrowOffset });
    setIsPositioned(true);
  }, [side, align]);

  // When tooltip becomes active, render it offscreen then measure & position
  useEffect(() => {
    if (!isActive || !mounted) {
      setIsPositioned(false);
      return;
    }

    // Wait for the tooltip DOM to render, then measure
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(updatePosition);
      return () => cancelAnimationFrame(raf2);
    });

    return () => cancelAnimationFrame(raf1);
  }, [isActive, mounted, updatePosition]);

  // Track scroll + resize while the tooltip is open so it stays
  // glued to its trigger. Capture-phase scroll listener catches
  // scrolls on any ancestor (nested scroll containers + window).
  // rAF-throttled to one update per frame.
  useEffect(() => {
    if (!isActive) return;

    let rafId: number | null = null;
    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updatePosition();
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isActive, updatePosition]);

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsActive(true);
      }, delay);
    } else {
      setIsActive(true);
    }
  }, [delay]);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsActive(false);
    setIsPositioned(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const styles = typeStyles[type];

  // Arrow styles based on side
  const getArrowStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      width: 0,
      height: 0,
      borderStyle: "solid",
    };

    const offset = position.arrowOffset;

    switch (side) {
      case "top":
        return {
          ...base,
          bottom: -ARROW_SIZE,
          left: offset,
          transform: "translateX(-50%)",
          borderWidth: `${ARROW_SIZE}px ${ARROW_SIZE}px 0 ${ARROW_SIZE}px`,
          borderColor: `${styles.bg} transparent transparent transparent`,
        };
      case "bottom":
        return {
          ...base,
          top: -ARROW_SIZE,
          left: offset,
          transform: "translateX(-50%)",
          borderWidth: `0 ${ARROW_SIZE}px ${ARROW_SIZE}px ${ARROW_SIZE}px`,
          borderColor: `transparent transparent ${styles.bg} transparent`,
        };
      case "left":
        return {
          ...base,
          right: -ARROW_SIZE,
          top: offset,
          transform: "translateY(-50%)",
          borderWidth: `${ARROW_SIZE}px 0 ${ARROW_SIZE}px ${ARROW_SIZE}px`,
          borderColor: `transparent transparent transparent ${styles.bg}`,
        };
      case "right":
        return {
          ...base,
          left: -ARROW_SIZE,
          top: offset,
          transform: "translateY(-50%)",
          borderWidth: `${ARROW_SIZE}px ${ARROW_SIZE}px ${ARROW_SIZE}px 0`,
          borderColor: `transparent ${styles.bg} transparent transparent`,
        };
    }
  };

  const tooltipElement = isActive && mounted
    ? createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            // position:fixed (not absolute) so the tooltip is
            // anchored to the viewport rather than the page —
            // sticky / fixed triggers (e.g. the race-detail map
            // controls) keep the tooltip glued to the button
            // through scroll without any recompute, since both
            // are then viewport-anchored. Non-sticky triggers
            // are handled by the scroll listener above.
            position: "fixed",
            top: isPositioned ? position.top : -9999,
            left: isPositioned ? position.left : -9999,
            zIndex: 9999,
            pointerEvents: "none",
            opacity: isPositioned ? 1 : 0,
            animation: isPositioned ? "tooltip-fade-in 0.15s ease-out" : "none",
          }}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: styles.bg,
              color: styles.color,
              fontSize: 13,
              lineHeight: "20px",
              fontWeight: 400,
              padding: "6px 12px",
              borderRadius: 8,
              maxWidth: 250,
              textAlign,
              boxShadow: "var(--ds-shadow-tooltip)",
            }}
          >
            {content}
            {showArrow && <span style={getArrowStyle()} />}
          </div>
        </div>,
        document.body,
      )
    : null;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Escape" || !isActive) return;
      e.stopPropagation();
      hide();
      // Return focus to the trigger so keyboard users keep their
      // place. cloneElement / span fallback both forward the ref so
      // triggerRef points at whichever element receives focus.
      triggerRef.current?.focus();
    },
    [isActive, hide],
  );

  const triggerProps = {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    onKeyDown: handleKeyDown,
  };

  const trigger = isValidElement(children) ? (
    cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ref: triggerRef,
      ...triggerProps,
      tabIndex: (children as React.ReactElement<Record<string, unknown>>).props.tabIndex ?? 0,
    })
  ) : (
    <span
      ref={triggerRef}
      className={className}
      tabIndex={0}
      style={{ display: "inline-flex", cursor: "default" }}
      {...triggerProps}
    >
      {children}
    </span>
  );

  return (
    <>
      {trigger}
      {tooltipElement}
      {mounted &&
        createPortal(
          <style>{`
            @keyframes tooltip-fade-in {
              from { opacity: 0; transform: scale(0.97); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>,
          document.head,
        )}
    </>
  );
}

export default Tooltip;
