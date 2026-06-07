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

/**
 * Custom colour set for a one-off button (Geist's `--button-custom-*`
 * mechanism). Supply `fg`/`bg` (and optionally `border` + hover/active
 * overrides); any colour string is accepted — a token (`var(--ds-blue-700)`)
 * or a literal. Hover falls back to the base colour; active falls back to
 * hover → base. Pass via the `customColors` prop; it overrides `variant`.
 * Reserve this for genuinely bespoke buttons (e.g. an "Upgrade" CTA) — for
 * normal actions use a built-in variant.
 */
export interface ButtonCustomColors {
  /** Text colour */
  fg: string;
  /** Background fill */
  bg: string;
  /** Hairline border colour (defaults to `bg`) */
  border?: string;
  /** Hover text (defaults to `fg`) */
  fgHover?: string;
  /** Hover fill (defaults to `bg`) */
  bgHover?: string;
  /** Hover border (defaults to `border`) */
  borderHover?: string;
  /** Active text (defaults to `fgHover`) */
  fgActive?: string;
  /** Active fill (defaults to `bgHover`) */
  bgActive?: string;
  /** Active border (defaults to `borderHover`) */
  borderActive?: string;
}

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
  /** Bespoke colour set — overrides `variant`. See {@link ButtonCustomColors}. */
  customColors?: ButtonCustomColors;
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
  /** Bespoke colour set — overrides `variant`. See {@link ButtonCustomColors}. */
  customColors?: ButtonCustomColors;
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
        return "h-[var(--ds-button-height-small)] w-[var(--ds-button-height-small)] text-button-14";
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
      return "h-[var(--ds-button-height-small)] px-[var(--ds-button-padding-small)] text-button-14 gap-[var(--ds-button-gap-small)]";
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

// Radius tracks the SIZE for default/square shapes (Geist: tiny 4px,
// small+medium 6px, large 8px); circle/rounded are fully round.
const getRadiusClasses = (size: ButtonSize, shape: ButtonShape): string => {
  if (shape === "circle" || shape === "rounded") {
    return "rounded-[var(--ds-radius-full)]";
  }
  switch (size) {
    case "tiny":
      return "rounded-[4px]";
    case "large":
      return "rounded-[8px]";
    default:
      return "rounded-[var(--ds-radius-small)]"; // small + medium = 6px
  }
};

const getVariantClasses = (
  variant: ButtonVariant,
  disabled: boolean,
  loading: boolean,
  shadow: boolean = false,
): string => {
  const isDisabled = disabled || loading;

  if (isDisabled) {
    switch (variant) {
      case "secondary":
        return "bg-[var(--ds-gray-100)] text-textSubtler shadow-[0_0_0_1px_var(--ds-gray-400)] cursor-not-allowed";
      case "tertiary":
        return "bg-transparent text-textSubtler cursor-not-allowed";
      default:
        return "bg-[var(--ds-gray-100)] text-textSubtler cursor-not-allowed";
    }
  }

  switch (variant) {
    case "default":
      // Geist primary fg is --ds-background-100 (pure #fff light / #0A0A0A
      // dark — flips with the theme), NOT textInverted (gray-200/gray-100),
      // which read as a greyish off-white on the dark fill.
      return `
        bg-[var(--ds-gray-1000)] text-[var(--ds-background-100)]
        hover:bg-[color-mix(in_srgb,var(--ds-gray-1000),white_15%)]
        dark:hover:bg-[color-mix(in_srgb,var(--ds-gray-1000),black_15%)]
      `;
    case "error":
      // Geist error-fill: bg red-800, fixed white text (--ds-contrast-fg)
      // both themes. Hover is Geist-verbatim: dark uses the red-900 token
      // (#ff5c61, lightens — Geist's dark-mode hover pattern); light uses
      // Geist's literal #ae292f (a darkened, desaturated brick red that no
      // point on our red scale reproduces — red-900 light is too vivid and
      // barely darker than the base).
      return `
        bg-[var(--ds-red-800)] text-[var(--ds-contrast-fg)]
        hover:bg-[#ae292f] dark:hover:bg-[var(--ds-red-900)]
      `;
    case "warning":
      // Geist warning-fill: bg amber-800 (identical in both themes), fixed
      // near-black ink #0a0a0a both themes — Geist's literal
      // `geist-new-warning-fill { --themed-fg: #0a0a0a }` (a hair softer
      // than pure black; amber stays light enough that it reads). Hover is
      // Geist's literal #d27504 — a darkened amber with no token on our scale.
      return `
        bg-[var(--ds-amber-800)] text-[#0a0a0a]
        hover:bg-[#d27504]
      `;
    case "secondary":
      if (shadow) {
        return `button-shadow-rounded`;
      }
      return `
        bg-surface text-textDefault
        shadow-[0_0_0_1px_var(--ds-gray-400)]
        hover:bg-[var(--ds-gray-100)]
        dark:shadow-[0_0_0_1px_var(--ds-gray-400)]
        dark:hover:bg-[var(--ds-gray-200)]
      `;
    case "tertiary":
      return `
        bg-transparent text-textDefault
        hover:bg-[var(--ds-hover-overlay)]
      `;
    default:
      return "";
  }
};

// Custom-colour buttons (Geist's `--button-custom-*` mechanism). The colours
// are driven through CSS vars set inline, so the hover/active pseudo-classes
// resolve them at render time. The border is a hairline ring (box-shadow),
// matching `secondary`. Disabled custom buttons fall back to the normal
// disabled styling (Geist applies custom only to `:not([disabled])`).
const CUSTOM_COLOR_CLASSES = `
  bg-[var(--btn-c-bg)] text-[var(--btn-c-fg)]
  shadow-[0_0_0_1px_var(--btn-c-border)]
  hover:bg-[var(--btn-c-bg-hover)] hover:text-[var(--btn-c-fg-hover)] hover:shadow-[0_0_0_1px_var(--btn-c-border-hover)]
  active:bg-[var(--btn-c-bg-active)] active:text-[var(--btn-c-fg-active)] active:shadow-[0_0_0_1px_var(--btn-c-border-active)]
`;

// Resolve the custom palette into the CSS vars the classes above consume,
// applying Geist's fallback chain: hover → base, active → hover → base.
const getCustomColorStyle = (c: ButtonCustomColors): React.CSSProperties => {
  const border = c.border ?? c.bg;
  const fgHover = c.fgHover ?? c.fg;
  const bgHover = c.bgHover ?? c.bg;
  const borderHover = c.borderHover ?? border;
  return {
    "--btn-c-fg": c.fg,
    "--btn-c-bg": c.bg,
    "--btn-c-border": border,
    "--btn-c-fg-hover": fgHover,
    "--btn-c-bg-hover": bgHover,
    "--btn-c-border-hover": borderHover,
    "--btn-c-fg-active": c.fgActive ?? fgHover,
    "--btn-c-bg-active": c.bgActive ?? bgHover,
    "--btn-c-border-active": c.borderActive ?? borderHover,
  } as React.CSSProperties;
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
      customColors,
      disabled = false,
      className = "",
      type = "button",
      onClick,
      ...props
    },
    ref,
  ) => {
    // Two "disabled" axes:
    //   - disabled prop → HTML disabled attribute. Removes the button
    //     from the tab order and blocks pointer events at the browser
    //     level. Use when the action is genuinely unavailable.
    //   - loading prop → keeps the button focusable so the busy state
    //     is announced when the user lands on it (per the Best
    //     Practices section). We mark it aria-disabled + aria-busy
    //     for assistive tech and guard onClick below.
    const isVisuallyDisabled = disabled || loading;

    const baseClasses = `
      inline-flex items-center justify-center
      select-none
      transition-[border-color,background,color,transform,box-shadow] duration-[var(--ds-transition-duration)] ease-in-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-background-100)]
    `;

    const sizeClasses = getSizeClasses(size, shape);
    const shapeClasses = getRadiusClasses(size, shape);
    // Custom colours override the variant, but only while interactive —
    // disabled/loading still use the standard disabled styling.
    const useCustomColors = !!customColors && !isVisuallyDisabled;
    const variantClasses = useCustomColors
      ? CUSTOM_COLOR_CLASSES
      : getVariantClasses(variant, disabled, loading, shadow);

    const combinedClasses = `
      ${baseClasses}
      ${sizeClasses}
      ${shapeClasses}
      ${variantClasses}
      ${className}
    `
      .replace(/\s+/g, " ")
      .trim();

    // Get spinner size based on button size
    const spinnerSize = size === "large" ? 24 : 16;
    const iconSize = getIconSize(size);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-busy={loading || undefined}
        aria-disabled={loading || undefined}
        onClick={handleClick}
        className={combinedClasses}
        style={
          {
            "--ds-icon-size": iconSize,
            ...(useCustomColors ? getCustomColorStyle(customColors!) : null),
            ...(isVisuallyDisabled ? { cursor: "not-allowed" } : null),
          } as React.CSSProperties
        }
        {...props}
      >
        {loading && (
          <span className="prefix">
            <Spinner size={spinnerSize} />
          </span>
        )}
        {!loading && prefixIcon && <span className="prefix">{prefixIcon}</span>}
        {children && (
          <span className="content px-[var(--ds-button-content-padding)]">
            {children}
          </span>
        )}
        {!loading && suffixIcon && <span className="suffix">{suffixIcon}</span>}
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
      customColors,
      className = "",
      style: styleProp,
      ...props
    },
    ref,
  ) => {
    const baseClasses = `
      inline-flex items-center justify-center
      select-none
      transition-[border-color,background,color,transform,box-shadow] duration-[var(--ds-transition-duration)] ease-in-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-background-100)]
      no-underline
    `;

    const sizeClasses = getSizeClasses(size, shape);
    const shapeClasses = getRadiusClasses(size, shape);
    const variantClasses = customColors
      ? CUSTOM_COLOR_CLASSES
      : getVariantClasses(variant, false, false, shadow);

    const combinedClasses = `
      ${baseClasses}
      ${sizeClasses}
      ${shapeClasses}
      ${variantClasses}
      ${className}
    `
      .replace(/\s+/g, " ")
      .trim();

    const iconSize = getIconSize(size);

    return (
      <a
        ref={ref}
        className={combinedClasses}
        style={
          {
            "--ds-icon-size": iconSize,
            ...(customColors ? getCustomColorStyle(customColors) : null),
            ...styleProp,
          } as React.CSSProperties
        }
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
