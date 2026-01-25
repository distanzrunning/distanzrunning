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
  // Icon-only buttons (square/circle shapes) - use height tokens for width too
  if (shape === "square" || shape === "circle") {
    switch (size) {
      case "tiny":
        return "h-[var(--ds-button-height-tiny)] w-[var(--ds-button-height-tiny)] text-button-12";
      case "small":
        return "h-[var(--ds-button-height-small)] w-[var(--ds-button-height-small)] text-button-12";
      case "medium":
        return "h-[var(--ds-button-height-medium)] w-[var(--ds-button-height-medium)] text-button-14";
      case "large":
        return "h-[var(--ds-button-height-large)] w-[var(--ds-button-height-large)] text-button-16";
      default:
        return "h-[var(--ds-button-height-medium)] w-[var(--ds-button-height-medium)] text-button-14";
    }
  }

  // Regular buttons with text - use design tokens for height, padding, gap
  switch (size) {
    case "tiny":
      return "h-[var(--ds-button-height-tiny)] px-[var(--ds-button-padding-tiny)] text-button-12 gap-[var(--ds-button-gap-tiny)]";
    case "small":
      return "h-[var(--ds-button-height-small)] px-[var(--ds-button-padding-small)] text-button-12 gap-[var(--ds-button-gap-small)]";
    case "medium":
      return "h-[var(--ds-button-height-medium)] px-[var(--ds-button-padding-medium)] text-button-14 gap-[var(--ds-button-gap-medium)]";
    case "large":
      return "h-[var(--ds-button-height-large)] px-[var(--ds-button-padding-large)] text-button-16 gap-[var(--ds-button-gap-large)]";
    default:
      return "h-[var(--ds-button-height-medium)] px-[var(--ds-button-padding-medium)] text-button-14 gap-[var(--ds-button-gap-medium)]";
  }
};

const getIconSize = (size: ButtonSize): string => {
  // Returns CSS variable reference for icon sizing
  switch (size) {
    case "tiny":
      return "var(--ds-button-icon-size-tiny)";
    case "small":
      return "var(--ds-button-icon-size-small)";
    case "medium":
      return "var(--ds-button-icon-size-medium)";
    case "large":
      return "var(--ds-button-icon-size-large)";
    default:
      return "var(--ds-button-icon-size-medium)";
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
        return "bg-[var(--ds-background-200)] text-[var(--ds-gray-700)] shadow-[0_0_0_1px_var(--ds-gray-400)] cursor-not-allowed";
      case "tertiary":
        return "bg-transparent text-[var(--ds-gray-600)] cursor-not-allowed";
      default:
        return "bg-[var(--ds-gray-300)] text-[var(--ds-gray-600)] cursor-not-allowed";
    }
  }

  switch (variant) {
    case "default":
      // Light mode: white overlay lightens dark button
      // Dark mode: black overlay darkens light button
      return `
        bg-[var(--ds-gray-1000)] text-[var(--ds-background-100)]
        hover:bg-[color-mix(in_srgb,var(--ds-gray-1000),white_15%)]
        dark:hover:bg-[color-mix(in_srgb,var(--ds-gray-1000),black_15%)]
      `;
    case "error":
      // Light mode: darken on hover
      // Dark mode: lighten to red-900 on hover
      return `
        bg-[var(--ds-red-800)] text-white
        hover:bg-[color-mix(in_srgb,var(--ds-red-800),black_15%)]
        dark:hover:bg-[var(--ds-red-900)]
      `;
    case "warning":
      // Same color in light and dark modes
      // Always darkens on hover (same hover in both modes)
      // Warning uses dark text, not white
      return `
        bg-[var(--ds-amber-800)] text-[var(--ds-gray-1000)]
        hover:bg-[color-mix(in_srgb,var(--ds-amber-800),black_15%)]
      `;
    case "secondary":
      // Light: white bg, gray border via box-shadow, darker bg on hover
      // Dark: dark bg, subtle border via box-shadow, lighter bg on hover
      return `
        bg-[var(--ds-background-100)] text-[var(--ds-gray-1000)]
        shadow-[0_0_0_1px_var(--ds-gray-200)]
        hover:bg-[var(--ds-gray-100)]
        dark:shadow-[0_0_0_1px_var(--ds-gray-400)]
        dark:hover:bg-[var(--ds-gray-200)]
      `;
    case "tertiary":
      // Transparent bg, shows subtle overlay on hover
      // Uses --ds-hover-overlay token (light: black 8%, dark: white 9%)
      return `
        bg-transparent text-[var(--ds-gray-1000)]
        hover:bg-[var(--ds-hover-overlay)]
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
      transition-[border-color,background,color,transform,box-shadow] duration-[var(--ds-transition-duration)] ease-[var(--ds-transition-timing)]
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)] focus-visible:ring-offset-2
    `;

    const sizeClasses = getSizeClasses(size, shape);
    const shapeClasses = getShapeClasses(shape);
    const variantClasses = getVariantClasses(variant, disabled, loading);
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
    const iconSize = getIconSize(size);

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={combinedClasses}
        style={{ "--geist-icon-size": iconSize } as React.CSSProperties}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size={spinnerSize} />
            {children && (
              <span className="content px-[var(--ds-button-content-padding)] ml-2">
                {children}
              </span>
            )}
          </>
        ) : (
          <>
            {prefixIcon && <span className="prefix">{prefixIcon}</span>}
            {children && (
              <span className="content px-[var(--ds-button-content-padding)]">
                {children}
              </span>
            )}
            {suffixIcon && <span className="suffix">{suffixIcon}</span>}
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
      transition-[border-color,background,color,transform,box-shadow] duration-[var(--ds-transition-duration)] ease-[var(--ds-transition-timing)]
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)] focus-visible:ring-offset-2
      no-underline
    `;

    const sizeClasses = getSizeClasses(size, shape);
    const shapeClasses = getShapeClasses(shape);
    const variantClasses = getVariantClasses(variant, false, false);
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

    const iconSize = getIconSize(size);

    return (
      <a
        ref={ref}
        className={combinedClasses}
        style={{ "--geist-icon-size": iconSize } as React.CSSProperties}
        {...props}
      >
        {prefixIcon && <span className="prefix">{prefixIcon}</span>}
        {children && (
          <span className="content px-[var(--ds-button-content-padding)]">
            {children}
          </span>
        )}
        {suffixIcon && <span className="suffix">{suffixIcon}</span>}
      </a>
    );
  },
);

ButtonLink.displayName = "ButtonLink";

// Default export for backwards compatibility
export default Button;
