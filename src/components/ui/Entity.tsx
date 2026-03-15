"use client";

import { forwardRef, type ReactNode, type HTMLAttributes } from "react";

// ============================================================================
// Types
// ============================================================================

export interface EntityProps extends HTMLAttributes<HTMLElement> {
  /** Content for the left column (name, description, avatar, etc.) */
  children: ReactNode;
  /** Padding inside the entity row (default: 16px) */
  padding?: number;
  /** Render as a button with hover background */
  hoverable?: boolean;
}

export interface EntityContentProps {
  /** Primary text (e.g. name, title) */
  title: string;
  /** Secondary/subtitle text */
  subtitle?: string;
  /** Thumbnail element placed before the text (e.g. Avatar) */
  thumbnail?: ReactNode;
}

export interface EntityFieldProps {
  /** Content displayed in the right column (actions, status text, etc.) */
  children: ReactNode;
}

export interface EntityListProps extends HTMLAttributes<HTMLUListElement> {
  /** Entity items */
  children: ReactNode;
  /** Show divider lines between items (default: true) */
  dividers?: boolean;
  /** Wrap list in a bordered card container */
  bordered?: boolean;
}

export interface SkeletonProps {
  /** Width of the skeleton bar (default: "100%") */
  width?: string | number;
  /** Height of the skeleton bar (default: 20) */
  height?: number;
}

// ============================================================================
// Sub-components
// ============================================================================

/** Text content block with title + optional subtitle */
function EntityContent({ title, subtitle, thumbnail }: EntityContentProps) {
  return (
    <div className="flex flex-1 flex-row items-center gap-4 min-w-0">
      {thumbnail && <div className="flex-shrink-0">{thumbnail}</div>}
      <div className="flex flex-1 flex-col min-w-0">
        <p
          className="truncate m-0 text-[14px] leading-[20px] font-semibold"
          style={{ color: "var(--ds-gray-1000)" }}
        >
          {title}
        </p>
        {subtitle && (
          <p
            className="truncate m-0 text-[14px] leading-[20px]"
            style={{ color: "var(--ds-gray-900)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/** Right-side field for actions or metadata */
function EntityField({ children }: EntityFieldProps) {
  return (
    <div className="flex flex-shrink-0 flex-row items-center gap-4">
      {children}
    </div>
  );
}

/** A list container that renders Entity items with optional dividers */
function EntityList({ children, dividers = true, bordered = false, className = "", ...rest }: EntityListProps) {
  return (
    <ul
      className={`list-none m-0 p-0 ${dividers ? "divide-y divide-[var(--ds-gray-400)]" : ""} ${className}`}
      style={bordered ? {
        borderRadius: 6,
        backgroundColor: "var(--ds-background-100)",
        boxShadow: "var(--ds-gray-alpha-400) 0px 0px 0px 1px, var(--ds-background-100) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 6px 0px",
        overflow: "hidden",
      } : undefined}
      {...rest}
    >
      {children}
    </ul>
  );
}

/** Skeleton loading placeholder */
function EntitySkeleton({ width = "100%", height = 20 }: SkeletonProps) {
  return (
    <span
      className="block rounded animate-pulse"
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        minHeight: `${height}px`,
        backgroundColor: "var(--ds-gray-300)",
      }}
    />
  );
}

// ============================================================================
// Entity (root)
// ============================================================================

const Entity = forwardRef<HTMLElement, EntityProps>(
  ({ children, padding = 16, hoverable = false, className = "", style, ...rest }, ref) => {
    if (hoverable) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          className={`flex flex-col items-stretch w-full text-left bg-transparent border-none outline-none transition-colors hover:bg-[var(--ds-gray-100)] ${className}`}
          style={{ padding: `${padding}px`, cursor: "pointer", ...style }}
          {...(rest as HTMLAttributes<HTMLButtonElement>)}
        >
          <section className="flex flex-row items-center gap-4">
            {children}
          </section>
        </button>
      );
    }

    return (
      <li
        ref={ref as React.Ref<HTMLLIElement>}
        className={`flex flex-col items-stretch list-none ${className}`}
        style={{ padding: `${padding}px`, ...style }}
        {...rest}
      >
        <section className="flex flex-row items-center gap-4">
          {children}
        </section>
      </li>
    );
  },
);

Entity.displayName = "Entity";

// ============================================================================
// Compound export
// ============================================================================

const EntityCompound = Object.assign(Entity, {
  Content: EntityContent,
  Field: EntityField,
  List: EntityList,
  Skeleton: EntitySkeleton,
});

export { EntityCompound as Entity };
export default EntityCompound;
