"use client";

import {
  forwardRef,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
} from "react";

// ============================================================================
// Types
// ============================================================================

export type ButtonSize = "tiny" | "small" | "medium" | "large";
export type ButtonVariant =
  | "default"
  | "error"
  | "warning"
  | "secondary"
  | "tertiary";
export type ButtonShape = "default" | "square" | "circle" | "rounded";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "prefix"> {
  /** Button content */
  children?: ReactNode;
  /** Size variant */
  size?: ButtonSize;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Shape variant for icon-only buttons */
  shape?: ButtonShape;
  /** Icon or element to display before the content */
  prefixIcon?: ReactNode;
  /** Icon or element to display after the content */
  suffixIcon?: ReactNode;
  /** Show loading spinner (disables button) */
  loading?: boolean;
  /** Add shadow effect (typically used with rounded shape) */
  shadow?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export interface ButtonLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "prefix"> {
  /** Button content */
  children?: ReactNode;
  /** Size variant */
  size?: ButtonSize;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Shape variant */
  shape?: ButtonShape;
  /** Icon or element to display before the content */
  prefixIcon?: ReactNode;
  /** Icon or element to display after the content */
  suffixIcon?: ReactNode;
  /** Add shadow effect */
  shadow?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Spinner Component
// ============================================================================

interface SpinnerProps {
  size?: number;
  className?: string;
}

function Spinner({ size = 16, className = "" }: SpinnerProps) {
  const lines = size <= 16 ? 10 : 12;
  const duration = size <= 16 ? 1000 : 1200;

  return (
    <div
      className={className}
      style={{ height: size, width: size }}
      role="status"
      aria-label="Loading"
    >
      <div
        className="relative left-1/2 top-1/2"
        style={{ height: size, width: size, color: "currentColor" }}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="absolute left-[-10%] top-[-3.9%] bg-current rounded-full"
            style={{
              height: size <= 16 ? "1.5px" : "8%",
              width: size <= 16 ? "4px" : "24%",
              opacity: 0.25,
              animation: `spinner-fade ${duration}ms linear infinite`,
              animationDelay: `${-duration + (i * duration) / lines}ms`,
              transform: `rotate(${(i * 360) / lines}deg) translate(146%)`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes spinner-fade {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.25;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// Style Utilities
// ============================================================================

const getSizeClasses = (size: ButtonSize, shape: ButtonShape): string => {
  // Icon-only buttons (square/circle shapes)
  if (shape === "square" || shape === "circle") {
    switch (size) {
      case "tiny":
        return "h-6 w-6 text-button-12";
      case "small":
        return "h-8 w-8 text-button-14";
      case "medium":
        return "h-10 w-10 text-button-14";
      case "large":
        return "h-12 w-12 text-button-16";
      default:
        return "h-10 w-10 text-button-14";
    }
  }

  // Regular buttons with text
  // Uses text-button-* typography tokens from design system
  // Small: 32px height, 6px button padding, text-button-14
  // Medium: 40px height, 10px button padding, text-button-14
  // Large: 48px height, 14px button padding, text-button-16
  switch (size) {
    case "tiny":
      return "h-6 px-1.5 text-button-12 gap-1";
    case "small":
      return "h-8 px-[6px] text-button-14 gap-1.5";
    case "medium":
      return "h-10 px-[10px] text-button-14 gap-2";
    case "large":
      return "h-12 px-[14px] text-button-16 gap-2";
    default:
      return "h-10 px-[10px] text-button-14 gap-2";
  }
};

// Get content span padding based on size (Geist uses 6px on all sizes)
const getContentPadding = (size: ButtonSize): string => {
  switch (size) {
    case "tiny":
      return "px-1";
    case "small":
    case "medium":
    case "large":
    default:
      return "px-[6px]";
  }
};

const getShapeClasses = (shape: ButtonShape): string => {
  switch (shape) {
    case "square":
      return "rounded-[var(--ds-radius-small)]";
    case "circle":
      return "rounded-[var(--ds-radius-full)]";
    case "rounded":
      return "rounded-[var(--ds-radius-full)]";
    default:
      return "rounded-[var(--ds-radius-small)]";
  }
};

const getVariantClasses = (
  variant: ButtonVariant,
  disabled: boolean,
  loading: boolean,
): string => {
  const isDisabled = disabled || loading;

  if (isDisabled) {
    switch (variant) {
      case "secondary":
        return "bg-[var(--ds-background-200)] text-[var(--ds-gray-700)] border border-[var(--ds-gray-400)] cursor-not-allowed";
      case "tertiary":
        return "bg-transparent text-[var(--ds-gray-600)] cursor-not-allowed";
      default:
        return "bg-[var(--ds-gray-300)] text-[var(--ds-gray-600)] cursor-not-allowed";
    }
  }

  switch (variant) {
    case "default":
      // Uses white alpha overlay on hover for subtle lightening effect
      return `
        bg-[var(--ds-gray-1000)] text-[var(--ds-background-100)]
        hover:bg-[color-mix(in_srgb,var(--ds-gray-1000),white_15%)]
      `;
    case "error":
      return `
        bg-[var(--ds-red-700)] text-white
        hover:bg-[var(--ds-red-800)]
      `;
    case "warning":
      return `
        bg-[var(--ds-amber-700)] text-white
        hover:bg-[var(--ds-amber-800)]
      `;
    case "secondary":
      return `
        bg-[var(--ds-background-100)] text-[var(--ds-gray-1000)]
        border border-[var(--ds-gray-400)]
        hover:bg-[var(--ds-gray-100)] hover:border-[var(--ds-gray-500)]
      `;
    case "tertiary":
      return `
        bg-transparent text-[var(--ds-gray-900)]
        hover:bg-[var(--ds-gray-100)]
        dark:hover:bg-[var(--ds-gray-alpha-100)]
      `;
    default:
      return "";
  }
};

// ============================================================================
// Button Component
// ============================================================================

/**
 * Button component following Geist design system patterns.
 *
 * @example
 * // Default button
 * <Button>Upload</Button>
 *
 * // With sizes
 * <Button size="small">Small</Button>
 * <Button size="large">Large</Button>
 *
 * // With variants
 * <Button variant="error">Delete</Button>
 * <Button variant="secondary">Cancel</Button>
 * <Button variant="tertiary">Learn more</Button>
 *
 * // Icon-only (square or circle shape)
 * <Button shape="square" aria-label="Upload"><UploadIcon /></Button>
 * <Button shape="circle" aria-label="Settings"><SettingsIcon /></Button>
 *
 * // With prefix/suffix icons
 * <Button prefix={<ArrowLeftIcon />}>Back</Button>
 * <Button suffix={<ArrowRightIcon />}>Next</Button>
 *
 * // Loading state
 * <Button loading>Saving...</Button>
 *
 * // Rounded with shadow (marketing style)
 * <Button shape="rounded" shadow variant="secondary">Get Started</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      size = "medium",
      variant = "default",
      shape = "default",
      prefixIcon,
      suffixIcon,
      loading = false,
      shadow = false,
      disabled = false,
      className = "",
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const baseClasses = `
      inline-flex items-center justify-center
      select-none
      transition-[border-color,background,color,transform,box-shadow] duration-150 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)] focus-visible:ring-offset-2
    `;

    const sizeClasses = getSizeClasses(size, shape);
    const shapeClasses = getShapeClasses(shape);
    const variantClasses = getVariantClasses(variant, disabled, loading);
    const contentPadding = getContentPadding(size);
    const shadowClasses = shadow
      ? "shadow-[var(--ds-shadow-border-small)]"
      : "";

    const combinedClasses = `
      ${baseClasses}
      ${sizeClasses}
      ${shapeClasses}
      ${variantClasses}
      ${shadowClasses}
      ${className}
    `
      .replace(/\s+/g, " ")
      .trim();

    // Get spinner size based on button size
    const spinnerSize = size === "large" ? 24 : 16;

    // For icon-only buttons (square/circle), don't add content padding
    const isIconOnly = shape === "square" || shape === "circle";

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={combinedClasses}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size={spinnerSize} />
            {children && (
              <span className={`ml-2 ${contentPadding}`}>{children}</span>
            )}
          </>
        ) : (
          <>
            {prefixIcon && <span className="flex-shrink-0">{prefixIcon}</span>}
            {children && (
              <span className={isIconOnly ? "" : contentPadding}>
                {children}
              </span>
            )}
            {suffixIcon && <span className="flex-shrink-0">{suffixIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

// ============================================================================
// ButtonLink Component
// ============================================================================

/**
 * Anchor element styled as a button.
 * Use for links that should look like buttons.
 *
 * @example
 * <ButtonLink href="/signup">Sign Up</ButtonLink>
 */
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      size = "medium",
      variant = "default",
      shape = "default",
      prefixIcon,
      suffixIcon,
      shadow = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseClasses = `
      inline-flex items-center justify-center
      select-none
      transition-[border-color,background,color,transform,box-shadow] duration-150 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)] focus-visible:ring-offset-2
      no-underline
    `;

    const sizeClasses = getSizeClasses(size, shape);
    const shapeClasses = getShapeClasses(shape);
    const variantClasses = getVariantClasses(variant, false, false);
    const contentPadding = getContentPadding(size);
    const shadowClasses = shadow
      ? "shadow-[var(--ds-shadow-border-small)]"
      : "";

    const combinedClasses = `
      ${baseClasses}
      ${sizeClasses}
      ${shapeClasses}
      ${variantClasses}
      ${shadowClasses}
      ${className}
    `
      .replace(/\s+/g, " ")
      .trim();

    // For icon-only buttons (square/circle), don't add content padding
    const isIconOnly = shape === "square" || shape === "circle";

    return (
      <a ref={ref} className={combinedClasses} {...props}>
        {prefixIcon && <span className="flex-shrink-0">{prefixIcon}</span>}
        {children && (
          <span className={isIconOnly ? "" : contentPadding}>{children}</span>
        )}
        {suffixIcon && <span className="flex-shrink-0">{suffixIcon}</span>}
      </a>
    );
  },
);

ButtonLink.displayName = "ButtonLink";

// Default export for backwards compatibility
export default Button;
