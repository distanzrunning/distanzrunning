"use client";

import { forwardRef } from "react";

// ============================================================================
// Types
// ============================================================================

/** Badge variant options */
export type BadgeVariant =
  | "gray"
  | "gray-subtle"
  | "blue"
  | "blue-subtle"
  | "purple"
  | "purple-subtle"
  | "amber"
  | "amber-subtle"
  | "red"
  | "red-subtle"
  | "pink"
  | "pink-subtle"
  | "green"
  | "green-subtle"
  | "teal"
  | "teal-subtle"
  | "inverted";

/** Badge size options */
export type BadgeSize = "sm" | "md" | "lg";

/** Props for the Badge component */
export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Visual variant of the badge */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Icon to display before the content */
  icon?: React.ReactNode;
  /**
   * Accessible name for ambiguous badges (e.g. `Pro`, `Alpha`,
   * `Beta`) — applied as both the HTML `title` attribute (hover
   * tooltip) and `aria-label` (screen reader). Omit when the
   * children text already reads as self-explanatory.
   */
  title?: string;
  /** Additional CSS classes */
  className?: string;
}

/** Props for the BadgePill component (link-style badge) */
export interface BadgePillProps extends Omit<BadgeProps, "variant"> {
  /** URL for the pill link */
  href?: string;
  /** Click handler (alternative to href) */
  onClick?: () => void;
}

// ============================================================================
// Style Maps
// ============================================================================

const variantStyles: Record<BadgeVariant, string> = {
  // Solid variants — Geist's exact mapping: a coloured fill + fixed white
  // text (--ds-contrast-fg). The -900 (and gray-900) fills flip light in
  // dark mode, so dark overrides drop to a mid shade that keeps white text
  // legible. blue needs no dark override; amber pairs with black text.
  gray: "bg-[var(--ds-gray-900)] text-[var(--ds-contrast-fg)] dark:bg-[var(--ds-gray-500)]",
  blue: "bg-[var(--ds-blue-800)] text-[var(--ds-contrast-fg)]",
  purple:
    "bg-[var(--ds-purple-900)] text-[var(--ds-contrast-fg)] dark:bg-[var(--ds-purple-500)]",
  amber: "bg-[var(--ds-amber-700)] text-[#000]",
  red: "bg-[var(--ds-red-900)] text-[var(--ds-contrast-fg)] dark:bg-[var(--ds-red-800)]",
  pink: "bg-[var(--ds-pink-900)] text-[var(--ds-contrast-fg)] dark:bg-[var(--ds-pink-600)]",
  green:
    "bg-[var(--ds-green-900)] text-[var(--ds-contrast-fg)] dark:bg-[var(--ds-green-600)]",
  teal: "bg-[var(--ds-teal-900)] text-[var(--ds-contrast-fg)] dark:bg-[var(--ds-teal-600)]",
  inverted: "bg-[var(--ds-gray-1000)] text-[var(--ds-gray-100)]",

  // Subtle variants - light tinted backgrounds with dark text (Geist-exact)
  "gray-subtle": "bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)]",
  "blue-subtle": "bg-[var(--ds-blue-200)] text-[var(--ds-blue-900)]",
  "purple-subtle": "bg-[var(--ds-purple-200)] text-[var(--ds-purple-900)]",
  "amber-subtle": "bg-[var(--ds-amber-200)] text-[var(--ds-amber-900)]",
  "red-subtle": "bg-[var(--ds-red-200)] text-[var(--ds-red-900)]",
  "pink-subtle": "bg-[var(--ds-pink-300)] text-[var(--ds-pink-900)]",
  "green-subtle": "bg-[var(--ds-green-200)] text-[var(--ds-green-900)]",
  "teal-subtle": "bg-[var(--ds-teal-300)] text-[var(--ds-teal-900)]",
};

// Geist sizing: sm 11/h-5/px-1.5/gap-1/0.2px, md 12/h-6/px-3/gap-1, lg
// 14/h-8/px-3/gap-1.5. Icons: sm 12px, md 14px (tucked -ml-0.5), lg 16px.
const sizeStyles: Record<BadgeSize, string> = {
  sm: "h-5 px-1.5 text-[11px] tracking-[0.2px] gap-1",
  md: "h-6 px-3 text-[12px] gap-1",
  lg: "h-8 px-3 text-[14px] gap-1.5",
};

// Geist's pill uses the same padding as the badge (not tighter).
const pillSizeStyles: Record<BadgeSize, string> = {
  sm: "h-5 px-1.5 text-[11px] tracking-[0.2px] gap-1",
  md: "h-6 px-3 text-[12px] gap-1",
  lg: "h-8 px-3 text-[14px] gap-1.5",
};

const iconSizeStyles: Record<BadgeSize, string> = {
  sm: "w-3 h-3 [&>svg]:w-full [&>svg]:h-full",
  md: "w-3.5 h-3.5 -ml-0.5 [&>svg]:w-full [&>svg]:h-full",
  lg: "w-4 h-4 [&>svg]:w-full [&>svg]:h-full",
};

// ============================================================================
// Badge Component
// ============================================================================

/**
 * Badge component for labels, tags, and status indicators.
 *
 * @example
 * <Badge variant="blue">New</Badge>
 * <Badge variant="green-subtle" size="lg" icon={<Check />}>Verified</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { children, variant = "gray", size = "md", icon, title, className = "" },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        title={title}
        aria-label={title}
        className={`
          inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap tabular-nums
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
      >
        {icon && (
          <span
            className={`flex-shrink-0 flex items-center justify-center ${iconSizeStyles[size]}`}
          >
            {icon}
          </span>
        )}
        <span className="leading-none">{children}</span>
      </span>
    );
  },
);

Badge.displayName = "Badge";

// ============================================================================
// BadgePill Component
// ============================================================================

/**
 * BadgePill component - a link-styled badge for navigation.
 *
 * @example
 * <BadgePill href="/docs">Documentation</BadgePill>
 * <BadgePill onClick={() => alert('clicked')} icon={<Slack />}>Slack</BadgePill>
 */
export const BadgePill = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  BadgePillProps
>(({ children, size = "md", icon, href, onClick, className = "" }, ref) => {
  // Geist pill: surface fill, gray-1000 text, a gray-alpha-400 INSET ring
  // (not a solid border), hover → gray-200. It's a link, so no underline.
  const pillStyles = `
    inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap tabular-nums
    bg-surface text-textDefault no-underline
    ring-1 ring-inset ring-[var(--ds-gray-alpha-400)]
    hover:bg-[var(--ds-gray-200)]
    transition-colors cursor-pointer
    ${pillSizeStyles[size]}
    ${className}
  `;

  const content = (
    <>
      {icon && (
        <span
          className={`flex-shrink-0 flex items-center justify-center ${iconSizeStyles[size]}`}
        >
          {icon}
        </span>
      )}
      <span className="leading-none">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={pillStyles}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      className={pillStyles}
    >
      {content}
    </button>
  );
});

BadgePill.displayName = "BadgePill";

// Default export
export default Badge;
