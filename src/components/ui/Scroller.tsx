"use client";

import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Button } from "@/components/ui/Button";

// ============================================================================
// Types
// ============================================================================

interface ScrollerProps {
  children: React.ReactNode;
  /**
   * Scroll direction. `vertical` clips horizontally, `horizontal` clips
   * vertically, `free` allows scrolling on both axes.
   */
  direction?: "vertical" | "horizontal" | "free";
  /** Container width */
  width?: string;
  /** Container height */
  height?: string;
  /** Hide the edge-fade overlay entirely */
  hideFade?: boolean;
  /** Additional CSS classes */
  className?: string;
}

interface ScrollerButtonsProps {
  direction: "vertical" | "horizontal";
  onScrollPrev: () => void;
  onScrollNext: () => void;
}

// ============================================================================
// Chevron Icons
// ============================================================================

function ChevronUpIcon() {
  return (
    <svg viewBox="0 0 16 16" height="16" width="16" style={{ color: "currentcolor" }}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="m1.94 10.5.53-.53 4.82-4.82a1 1 0 0 1 1.42 0l4.82 4.82.53.53L13 11.56l-.53-.53L8 6.56l-4.47 4.47-.53.53z"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 16 16" height="16" width="16" style={{ color: "currentcolor" }}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="m14.06 5.5-.53.53-4.82 4.82a1 1 0 0 1-1.42 0L2.47 6.03l-.53-.53L3 4.44l.53.53L8 9.44l4.47-4.47.53-.53z"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 16 16" height="16" width="16" style={{ color: "currentcolor" }}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="m10.5 14.06-.53-.53-4.82-4.82a1 1 0 0 1 0-1.42l4.82-4.82.53-.53L11.56 3l-.53.53L6.56 8l4.47 4.47.53.53z"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 16 16" height="16" width="16" style={{ color: "currentcolor" }}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="m5.5 1.94.53.53 4.82 4.82a1 1 0 0 1 0 1.42l-4.82 4.82-.53.53L4.44 13l.53-.53L9.44 8 4.97 3.53 4.44 3z"
      />
    </svg>
  );
}

// ============================================================================
// ScrollerButtons Component
// ============================================================================

export function ScrollerButtons({
  direction,
  onScrollPrev,
  onScrollNext,
}: ScrollerButtonsProps) {
  const isVertical = direction === "vertical";

  return (
    <div
      className={`flex flex-row gap-2 ${
        isVertical ? "justify-center" : "justify-start"
      }`}
    >
      <Button
        variant="secondary"
        shape="circle"
        size="small"
        onClick={onScrollPrev}
        aria-label={isVertical ? "scroll top" : "scroll left"}
      >
        {isVertical ? <ChevronUpIcon /> : <ChevronLeftIcon />}
      </Button>
      <Button
        variant="secondary"
        shape="circle"
        size="small"
        onClick={onScrollNext}
        aria-label={isVertical ? "scroll bottom" : "scroll right"}
      >
        {isVertical ? <ChevronDownIcon /> : <ChevronRightIcon />}
      </Button>
    </div>
  );
}

// ============================================================================
// Scroller Component
// ============================================================================

export const Scroller = forwardRef<HTMLDivElement, ScrollerProps>(
  (
    {
      children,
      direction = "vertical",
      width,
      height,
      hideFade = false,
      className = "",
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const [edges, setEdges] = useState({
      top: false,
      bottom: false,
      left: false,
      right: false,
    });

    // Merge forwarded ref with internal ref
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        (innerRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    const updateEdges = useCallback(() => {
      const el = innerRef.current;
      if (!el) return;

      const hasVertical = direction === "vertical" || direction === "free";
      const hasHorizontal = direction === "horizontal" || direction === "free";

      setEdges({
        top: hasVertical && el.scrollTop > 1,
        bottom:
          hasVertical && el.scrollTop < el.scrollHeight - el.clientHeight - 1,
        left: hasHorizontal && el.scrollLeft > 1,
        right:
          hasHorizontal && el.scrollLeft < el.scrollWidth - el.clientWidth - 1,
      });
    }, [direction]);

    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      updateEdges();

      el.addEventListener("scroll", updateEdges, { passive: true });

      const resizeObserver = new ResizeObserver(() => {
        updateEdges();
      });
      resizeObserver.observe(el);

      return () => {
        el.removeEventListener("scroll", updateEdges);
        resizeObserver.disconnect();
      };
    }, [updateEdges]);

    const overflowStyle: React.CSSProperties = {};
    let dataOverflow: "x" | "y" | "both";
    if (direction === "vertical") {
      overflowStyle.overflowY = "auto";
      overflowStyle.overflowX = "hidden";
      dataOverflow = "y";
    } else if (direction === "horizontal") {
      overflowStyle.overflowX = "auto";
      overflowStyle.overflowY = "hidden";
      dataOverflow = "x";
    } else {
      overflowStyle.overflow = "auto";
      dataOverflow = "both";
    }

    // Geist's overlay is a single element whose per-edge fade is revealed by
    // toggling these classes (it shifts background-position with a transition).
    const overlayClasses = [
      "ds-scroller-overlay",
      edges.top && "is-top",
      edges.bottom && "is-bottom",
      edges.left && "is-left",
      edges.right && "is-right",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={`relative overflow-hidden ${className}`.trim()}
        style={{ width, height }}
      >
        {/* Scroll area — absolute so it doesn't expand the outer container. */}
        <div
          ref={setRefs}
          className="ds-scroller-track absolute inset-0"
          style={overflowStyle}
          data-overflow={dataOverflow}
        >
          {children}
        </div>

        {!hideFade && <div aria-hidden="true" className={overlayClasses} />}
      </div>
    );
  },
);

Scroller.displayName = "Scroller";

export default Scroller;
