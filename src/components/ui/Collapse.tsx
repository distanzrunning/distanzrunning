"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

// ============================================================================
// Context
// ============================================================================

interface CollapseGroupContextValue {
  openIds: Set<string>;
  toggle: (id: string) => void;
  register: (id: string) => void;
  multiple: boolean;
  alwaysOpen: boolean;
}

const CollapseGroupContext = createContext<CollapseGroupContextValue | null>(
  null,
);

// ============================================================================
// ChevronRight Icon (internal)
// ============================================================================

function ChevronRightIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// CollapseGroup
// ============================================================================

export interface CollapseGroupProps {
  children: ReactNode;
  /** Allow multiple items to be open simultaneously */
  multiple?: boolean;
  /** When true, one item must always remain open */
  alwaysOpen?: boolean;
  className?: string;
}

export function CollapseGroup({ children, multiple = false, alwaysOpen = false, className = "" }: CollapseGroupProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.has(id);
      if (isOpen) {
        if (alwaysOpen && prev.size === 1) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      }
      if (multiple) {
        const next = new Set(prev);
        next.add(id);
        return next;
      }
      return new Set([id]);
    });
  };

  const register = (id: string) => {
    setOpenIds((prev) => {
      if (prev.has(id)) return prev;
      if (!multiple && prev.size > 0) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <CollapseGroupContext.Provider value={{ openIds, toggle, register, multiple, alwaysOpen }}>
      <div
        className={className}
        style={{ borderTop: "1px solid var(--ds-gray-400)" }}
      >
        {children}
      </div>
    </CollapseGroupContext.Provider>
  );
}

// ============================================================================
// Collapse
// ============================================================================

export interface CollapseProps {
  /** Title text displayed in the trigger button */
  title: string;
  /** Content displayed when expanded */
  children: ReactNode;
  /** Size variant for title typography */
  size?: "default" | "small";
  /** Whether the item starts expanded */
  defaultExpanded?: boolean;
  /** Prevent toggling (locks expanded/collapsed state) */
  disabled?: boolean;
  className?: string;
}

export function Collapse({
  title,
  children,
  size = "default",
  defaultExpanded = false,
  disabled = false,
  className = "",
}: CollapseProps) {
  const reactId = useId();
  const triggerId = `collapse-button-${reactId}`;
  const contentId = `collapse-section-${reactId}`;

  const groupCtx = useContext(CollapseGroupContext);
  const [localOpen, setLocalOpen] = useState(defaultExpanded);

  // Register default-expanded items with the group
  useEffect(() => {
    if (groupCtx && defaultExpanded) {
      groupCtx.register(reactId);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isExpanded = groupCtx ? groupCtx.openIds.has(reactId) : localOpen;

  const handleToggle = () => {
    if (disabled) return;

    if (groupCtx) {
      groupCtx.toggle(reactId);
    } else {
      setLocalOpen((prev) => !prev);
    }
  };

  // Height animation
  const contentRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setMeasuredHeight(contentRef.current.scrollHeight);
    }
  }, [children, isExpanded]);

  // Set inert attribute imperatively (not yet in React's type defs)
  useEffect(() => {
    if (regionRef.current) {
      if (!isExpanded) {
        regionRef.current.setAttribute("inert", "");
      } else {
        regionRef.current.removeAttribute("inert");
      }
    }
  }, [isExpanded]);

  // Title typography
  const titleClasses =
    size === "small"
      ? "text-[16px] leading-[24px] font-medium"
      : "text-[24px] leading-[32px] font-semibold";

  const titleStyle =
    size === "small"
      ? {}
      : { letterSpacing: "-0.029375rem" };

  return (
    <div
      className={`border-b border-[var(--ds-gray-400)] ${className}`}
    >
      <h3
        style={{ color: "var(--ds-gray-1000)", margin: 0 }}
      >
        <button
          type="button"
          id={triggerId}
          aria-controls={contentId}
          aria-expanded={isExpanded}
          aria-disabled={disabled || undefined}
          onClick={handleToggle}
          className={`
            flex w-full justify-between items-center text-left
            bg-transparent border-none outline-none p-0
            ${disabled ? "cursor-default" : "cursor-pointer"}
          `}
          style={{ color: "inherit", font: "inherit" }}
        >
          <span
            className={titleClasses}
            style={{
              ...titleStyle,
              padding: "24px 0",
            }}
          >
            {title}
          </span>
          <span
            style={{
              display: "inline-flex",
              transition: "transform 200ms ease",
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            <ChevronRightIcon />
          </span>
        </button>
      </h3>

      <div
        ref={regionRef}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        style={{
          height: isExpanded ? measuredHeight : 0,
          overflowY: "hidden",
          transition: "height 200ms ease",
          willChange: "height",
        }}
      >
        <div ref={contentRef} style={{ overflow: "hidden" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
