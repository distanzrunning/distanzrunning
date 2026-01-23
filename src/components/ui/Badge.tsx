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
  // Solid variants - Geist exact colors
  // Gray: uses gray-900 in both modes with white text
  gray: "bg-[var(--ds-gray-900)] text-white",
  blue: "bg-[var(--ds-blue-800)] text-white",
  purple: "bg-[var(--ds-purple-700)] text-white",
  // Amber uses dark text for better contrast on the warm background
  amber: "bg-[var(--ds-amber-700)] text-[var(--ds-amber-1000)]",
  red: "bg-[var(--ds-red-700)] text-white",
  pink: "bg-[var(--ds-pink-700)] text-white",
  green: "bg-[var(--ds-green-700)] text-white",
  teal: "bg-[var(--ds-teal-700)] text-white",
  // Inverted: black bg in light mode, white bg in dark mode (stands out against page)
  inverted: "bg-black text-white dark:bg-white dark:text-black",

  // Subtle variants - light tinted backgrounds with dark text
  "gray-subtle": "bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)]",
  "blue-subtle": "bg-[var(--ds-blue-200)] text-[var(--ds-blue-900)]",
  "purple-subtle": "bg-[var(--ds-purple-200)] text-[var(--ds-purple-900)]",
  "amber-subtle": "bg-[var(--ds-amber-200)] text-[var(--ds-amber-900)]",
  "red-subtle": "bg-[var(--ds-red-200)] text-[var(--ds-red-900)]",
  "pink-subtle": "bg-[var(--ds-pink-200)] text-[var(--ds-pink-900)]",
  "green-subtle": "bg-[var(--ds-green-200)] text-[var(--ds-green-900)]",
  "teal-subtle": "bg-[var(--ds-teal-200)] text-[var(--ds-teal-900)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "h-5 px-2 text-xs gap-1",
  md: "h-6 px-2.5 text-xs gap-1.5",
  lg: "h-7 px-3 text-sm gap-1.5",
};

const pillSizeStyles: Record<BadgeSize, string> = {
  sm: "h-5 px-2.5 text-xs gap-1",
  md: "h-6 px-2.5 text-xs gap-1.5",
  lg: "h-7 px-3 text-sm gap-1.5",
};

const iconSizeStyles: Record<BadgeSize, string> = {
  sm: "w-3 h-3",
  md: "w-3.5 h-3.5",
  lg: "w-4 h-4",
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
  ({ children, variant = "gray", size = "md", icon, className = "" }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
      >
        {icon && (
          <span className={`flex-shrink-0 ${iconSizeStyles[size]}`}>
            {icon}
          </span>
        )}
        <span>{children}</span>
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
  const pillStyles = `
    inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap
    bg-[var(--ds-background-100)] text-[var(--ds-gray-1000)]
    border border-[var(--ds-gray-400)]
    hover:bg-[var(--ds-gray-200)] hover:border-[var(--ds-gray-500)]
    transition-colors cursor-pointer
    ${pillSizeStyles[size]}
    ${className}
  `;

  const content = (
    <>
      {icon && (
        <span className={`flex-shrink-0 ${iconSizeStyles[size]}`}>{icon}</span>
      )}
      <span>{children}</span>
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
