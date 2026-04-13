"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
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

const ARROW_SIZE = 5;
const TOOLTIP_OFFSET = 8;

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
  delay = 200,
  showArrow = true,
  type = "default",
  textAlign = "center",
  children,
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;

    // Position based on side
    switch (side) {
      case "top":
        top =
          triggerRect.top + scrollY - tooltipRect.height - TOOLTIP_OFFSET;
        break;
      case "bottom":
        top = triggerRect.bottom + scrollY + TOOLTIP_OFFSET;
        break;
      case "left":
        left =
          triggerRect.left + scrollX - tooltipRect.width - TOOLTIP_OFFSET;
        break;
      case "right":
        left = triggerRect.right + scrollX + TOOLTIP_OFFSET;
        break;
    }

    // Alignment
    if (side === "top" || side === "bottom") {
      switch (align) {
        case "start":
          left = triggerRect.left + scrollX;
          break;
        case "center":
          left =
            triggerRect.left +
            scrollX +
            triggerRect.width / 2 -
            tooltipRect.width / 2;
          break;
        case "end":
          left =
            triggerRect.right + scrollX - tooltipRect.width;
          break;
      }
    } else {
      switch (align) {
        case "start":
          top = triggerRect.top + scrollY;
          break;
        case "center":
          top =
            triggerRect.top +
            scrollY +
            triggerRect.height / 2 -
            tooltipRect.height / 2;
          break;
        case "end":
          top =
            triggerRect.bottom + scrollY - tooltipRect.height;
          break;
      }
    }

    setPosition({ top, left });
  }, [side, align]);

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(true);
    }
  }, [delay]);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Use rAF to ensure tooltip is rendered before measuring
      requestAnimationFrame(() => {
        calculatePosition();
      });
    }
  }, [isVisible, calculatePosition]);

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

    switch (side) {
      case "top":
        return {
          ...base,
          bottom: -ARROW_SIZE,
          left: "50%",
          transform: "translateX(-50%)",
          borderWidth: `${ARROW_SIZE}px ${ARROW_SIZE}px 0 ${ARROW_SIZE}px`,
          borderColor: `${styles.bg} transparent transparent transparent`,
        };
      case "bottom":
        return {
          ...base,
          top: -ARROW_SIZE,
          left: "50%",
          transform: "translateX(-50%)",
          borderWidth: `0 ${ARROW_SIZE}px ${ARROW_SIZE}px ${ARROW_SIZE}px`,
          borderColor: `transparent transparent ${styles.bg} transparent`,
        };
      case "left":
        return {
          ...base,
          right: -ARROW_SIZE,
          top: "50%",
          transform: "translateY(-50%)",
          borderWidth: `${ARROW_SIZE}px 0 ${ARROW_SIZE}px ${ARROW_SIZE}px`,
          borderColor: `transparent transparent transparent ${styles.bg}`,
        };
      case "right":
        return {
          ...base,
          left: -ARROW_SIZE,
          top: "50%",
          transform: "translateY(-50%)",
          borderWidth: `${ARROW_SIZE}px ${ARROW_SIZE}px ${ARROW_SIZE}px 0`,
          borderColor: `transparent ${styles.bg} transparent transparent`,
        };
    }
  };

  const tooltipElement = isVisible && mounted
    ? createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            zIndex: 9999,
            pointerEvents: "none",
            animation: "tooltip-fade-in 0.15s ease-out",
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
              padding: "4px 8px",
              borderRadius: 6,
              whiteSpace: "nowrap",
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

  return (
    <>
      <span
        ref={triggerRef}
        className={className}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={0}
        style={{ display: "inline-flex", cursor: "default" }}
      >
        {children}
      </span>
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
