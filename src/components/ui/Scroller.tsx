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
  /** Scroll direction */
  overflow?: "y" | "x" | "both";
  /** Container width */
  width?: string;
  /** Container height */
  height?: string;
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
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      strokeLinejoin="round"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.00001 4.93934L8.53034 5.46967L13.5303 10.4697L12.4697 11.5303L8.00001 7.06066L3.53034 11.5303L2.46968 10.4697L7.46968 5.46967L8.00001 4.93934Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      strokeLinejoin="round"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.00001 11.0607L7.46968 10.5303L2.46968 5.53033L3.53034 4.46967L8.00001 8.93934L12.4697 4.46967L13.5303 5.53033L8.53034 10.5303L8.00001 11.0607Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      strokeLinejoin="round"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.93934 8.00001L5.46967 7.46968L10.4697 2.46968L11.5303 3.53034L7.06066 8.00001L11.5303 12.4697L10.4697 13.5303L5.46967 8.53034L4.93934 8.00001Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      strokeLinejoin="round"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.0607 8.00001L10.5303 8.53034L5.53033 13.5303L4.46967 12.4697L8.93934 8.00001L4.46967 3.53034L5.53033 2.46968L10.5303 7.46968L11.0607 8.00001Z"
        fill="currentColor"
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
      className={`flex ${isVertical ? "flex-col" : "flex-row"} gap-2`}
    >
      <Button
        variant="secondary"
        shape="circle"
        size="small"
        onClick={onScrollPrev}
        aria-label={isVertical ? "Scroll up" : "Scroll left"}
      >
        {isVertical ? <ChevronUpIcon /> : <ChevronLeftIcon />}
      </Button>
      <Button
        variant="secondary"
        shape="circle"
        size="small"
        onClick={onScrollNext}
        aria-label={isVertical ? "Scroll down" : "Scroll right"}
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
      overflow = "y",
      width,
      height,
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
        (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
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

      const hasVertical = overflow === "y" || overflow === "both";
      const hasHorizontal = overflow === "x" || overflow === "both";

      setEdges({
        top: hasVertical && el.scrollTop > 1,
        bottom:
          hasVertical &&
          el.scrollTop < el.scrollHeight - el.clientHeight - 1,
        left: hasHorizontal && el.scrollLeft > 1,
        right:
          hasHorizontal &&
          el.scrollLeft < el.scrollWidth - el.clientWidth - 1,
      });
    }, [overflow]);

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
    if (overflow === "y") {
      overflowStyle.overflowY = "auto";
      overflowStyle.overflowX = "hidden";
    } else if (overflow === "x") {
      overflowStyle.overflowX = "auto";
      overflowStyle.overflowY = "hidden";
    } else {
      overflowStyle.overflow = "auto";
    }

    const fadeSize = 40;

    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{ width, height, maxWidth: "100%", minWidth: 0 }}
      >
        {/* Scrollable inner container */}
        <div
          ref={setRefs}
          className="scroller-hide-scrollbar h-full w-full"
          style={overflowStyle}
        >
          {children}
        </div>

        {/* Top fade overlay */}
        {edges.top && (
          <div
            className="pointer-events-none absolute top-0 left-0 right-0"
            style={{
              height: fadeSize,
              background:
                "linear-gradient(to bottom, var(--ds-background-100), transparent)",
            }}
          />
        )}

        {/* Bottom fade overlay */}
        {edges.bottom && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0"
            style={{
              height: fadeSize,
              background:
                "linear-gradient(to top, var(--ds-background-100), transparent)",
            }}
          />
        )}

        {/* Left fade overlay */}
        {edges.left && (
          <div
            className="pointer-events-none absolute top-0 bottom-0 left-0"
            style={{
              width: fadeSize,
              background:
                "linear-gradient(to right, var(--ds-background-100), transparent)",
            }}
          />
        )}

        {/* Right fade overlay */}
        {edges.right && (
          <div
            className="pointer-events-none absolute top-0 bottom-0 right-0"
            style={{
              width: fadeSize,
              background:
                "linear-gradient(to left, var(--ds-background-100), transparent)",
            }}
          />
        )}

        <style jsx>{`
          .scroller-hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .scroller-hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    );
  },
);

Scroller.displayName = "Scroller";

export default Scroller;
