"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { SiNike, SiAdidas, SiNewbalance } from "react-icons/si";

// ============================================================================
// Types
// ============================================================================

/** Brand options for AvatarBrand */
export type Brand = "nike" | "adidas" | "newbalance";

/** Props for the base Avatar component */
export interface AvatarProps {
  /** Image URL for the avatar */
  src?: string;
  /** Alt text for the avatar image */
  alt?: string;
  /** Size in pixels (default: 32) */
  size?: number;
  /** Text to generate initials from when no image */
  fallback?: string;
  /** Show placeholder with shimmer animation */
  placeholder?: boolean;
  /** Custom icon for placeholder (disables shimmer) */
  placeholderIcon?: React.ReactNode;
  /** Background color for the avatar */
  bgColor?: string;
}

/** Member object for AvatarGroup */
export interface AvatarGroupMember {
  /** Image URL for the avatar */
  src?: string;
  /** Alt text for the avatar */
  alt?: string;
  /** Force placeholder state */
  placeholder?: boolean;
  /** Custom icon rendered at 50% of avatar size (for brand marks/logos) */
  placeholderIcon?: React.ReactNode;
  /** Background color for the avatar */
  bgColor?: string;
  /** Border color for the avatar wrapper (overrides default) */
  borderColor?: string;
}

/** Props for AvatarGroup component */
export interface AvatarGroupProps {
  /** Array of avatar members to display */
  members: AvatarGroupMember[];
  /** Maximum visible avatars before showing +N */
  limit?: number;
  /** Size in pixels for all avatars (default: 32) */
  size?: number;
  /**
   * Accessible name for the group as a whole. Read once by screen
   * readers; the individual avatars are hidden from the SR so the
   * group doesn't announce N times. Defaults to "{N} avatars".
   */
  label?: string;
}

/** Props for AvatarBrand component */
export interface AvatarBrandProps extends Omit<AvatarProps, "shimmer"> {
  /** Brand for the badge */
  brand: Brand;
  /** Fixed badge size in pixels (overrides proportional sizing) */
  badgeSize?: number;
}

/** Props for AvatarGradient component */
export interface AvatarGradientProps {
  /** Size in pixels (default: 32) */
  size?: number;
  /** Array of colors for the gradient */
  colors: string[];
  /** Gradient angle in degrees (default: 135) */
  angle?: number;
}

/** Props for AvatarWithIcon component */
export interface AvatarWithIconProps extends Omit<AvatarProps, "shimmer"> {
  /** Icon to display in the badge */
  icon: React.ReactNode;
  /** Background color for the badge */
  iconBgColor?: string;
  /** Icon color */
  iconColor?: string;
  /** Use gradient background instead of image */
  gradient?: { colors: string[]; angle?: number };
  /** Fixed badge size in pixels (overrides proportional sizing) */
  badgeSize?: number;
}

// ============================================================================
// Avatar Component
// ============================================================================

/**
 * Base avatar component that displays a user image, initials, or placeholder.
 *
 * @example
 * <Avatar src="/user.jpg" alt="John Doe" size={40} />
 * <Avatar fallback="John Doe" size={32} />
 * <Avatar placeholder size={90} />
 */
export function Avatar({
  src,
  alt = "",
  size = 32,
  fallback,
  placeholder = false,
  placeholderIcon,
  bgColor,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Show shimmer placeholder when no src and placeholder is true (without
  // custom icon). Geist's loading shell shimmers gray-100 → gray-200 with no
  // visible ring — the shimmer is the whole visual (the hairline ring is
  // reserved for resolved avatars; matching Geist's live render).
  if (placeholder && !placeholderIcon && !fallback && !src) {
    return (
      <div
        className="rounded-full overflow-hidden flex-shrink-0 animate-shimmer"
        style={{
          width: size,
          height: size,
          background:
            "linear-gradient(90deg, var(--ds-gray-100) 0%, var(--ds-gray-200) 50%, var(--ds-gray-100) 100%)",
          backgroundSize: "200% 100%",
        }}
      />
    );
  }

  const showFallback = !src || imageError || placeholder;

  // Get initials from fallback text
  const getInitials = (text: string) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length === 1) {
      return text.substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const fontSize = Math.round(size * 0.4);
  const initials = fallback ? getInitials(fallback) : "";

  // Accessible name: image avatars use the <img alt>; initials avatars
  // get an explicit aria-label so screen readers announce "Avatar with
  // initials: XX" rather than reading the bare letterforms; placeholder
  // shells fall back to the provided alt or a generic "Avatar".
  const ariaLabel = !showFallback
    ? undefined // alt on the <img> below carries the SR text
    : placeholderIcon
      ? alt || undefined
      : fallback
        ? `Avatar with initials: ${initials}`
        : alt || "Avatar";

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="relative inline-flex items-center justify-center rounded-full text-textSubtle overflow-hidden flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor || "var(--ds-gray-300)",
      }}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : placeholderIcon ? (
        <span
          aria-hidden="true"
          className="flex items-center justify-center text-textSubtle"
          style={{ width: size * 0.5, height: size * 0.5 }}
        >
          {placeholderIcon}
        </span>
      ) : fallback ? (
        <span
          aria-hidden="true"
          className="font-medium text-textSubtle"
          style={{ fontSize }}
        >
          {initials}
        </span>
      ) : (
        <User
          aria-hidden="true"
          className="text-textSubtle"
          style={{ width: size * 0.5, height: size * 0.5 }}
        />
      )}
      <AvatarRing />
    </div>
  );
}

// Geist puts a 1px gray-alpha-400 hairline ring on every avatar (the avatar
// `:after`). It sits above the image, so it's a positioned overlay rather
// than a border on the clipped container.
function AvatarRing() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-full"
      style={{ border: "1px solid var(--ds-gray-alpha-400)" }}
    />
  );
}

// ============================================================================
// AvatarGroup Component
// ============================================================================

/**
 * Displays multiple avatars stacked together with optional +N overflow indicator.
 *
 * @example
 * <AvatarGroup
 *   members={[{ src: '/user1.jpg' }, { src: '/user2.jpg' }]}
 *   limit={3}
 *   size={32}
 * />
 */
export function AvatarGroup({
  members,
  limit,
  size = 32,
  label,
}: AvatarGroupProps) {
  const visibleMembers = limit ? members.slice(0, limit) : members;
  const remainingCount = limit ? Math.max(0, members.length - limit) : 0;

  // Geist stacking: each avatar carries a 1px ring in the page-background
  // colour (the separator) and overlaps the previous by 10px (at 32px). No
  // notch/mask — the bg-coloured ring is what reads as the gap.
  const overlap = Math.round(size * 0.3125); // 10px at size 32

  const groupLabel =
    label ?? `${members.length} avatar${members.length === 1 ? "" : "s"}`;

  return (
    <div role="img" aria-label={groupLabel} className="flex items-center">
      {visibleMembers.map((member, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="relative inline-flex rounded-full"
          style={{
            marginLeft: index === 0 ? 0 : -overlap,
            boxShadow: `0 0 0 1px ${member.borderColor || "hsl(var(--color-surface))"}`,
          }}
        >
          <Avatar
            src={member.src}
            alt={member.alt || `Avatar ${index + 1}`}
            size={size}
            placeholder={member.placeholder}
            placeholderIcon={member.placeholderIcon}
            bgColor={member.bgColor}
          />
        </span>
      ))}
      {remainingCount > 0 && (
        <span
          aria-hidden="true"
          className="relative inline-flex rounded-full"
          style={{
            marginLeft: -overlap,
            boxShadow: "0 0 0 1px hsl(var(--color-surface))",
          }}
        >
          {/* Geist's +N note: a gray-100 pill with a gray-400 hairline over
              the slot, gray-1000 text at 10px / 600. */}
          <span
            className="flex items-center justify-center rounded-full"
            style={{
              width: size,
              height: size,
              background: "var(--ds-gray-100)",
              border: "1px solid var(--ds-gray-400)",
              color: "var(--ds-gray-1000)",
              fontSize: 10,
              lineHeight: "12px",
              fontWeight: 600,
              // Geist scales the note 1% to cover the slot edge cleanly.
              transform: "scale(1.01)",
            }}
          >
            +{remainingCount}
          </span>
        </span>
      )}
    </div>
  );
}

// ============================================================================
// AvatarBrand Component
// ============================================================================

/** Brand colors and icons */
const brandConfig = {
  nike: {
    icon: SiNike,
    color: "#111111",
  },
  adidas: {
    icon: SiAdidas,
    color: "#000000",
  },
  newbalance: {
    icon: SiNewbalance,
    color: "#CF0A2C",
  },
};

/**
 * Avatar with a brand badge (Nike, Adidas, New Balance).
 *
 * @example
 * <AvatarBrand src="/user.jpg" brand="nike" size={32} />
 */
export function AvatarBrand({
  src,
  alt,
  size = 32,
  fallback,
  brand,
  badgeSize: customBadgeSize,
}: AvatarBrandProps) {
  const badgeSize = customBadgeSize || Math.round(size * 0.55);
  const iconSize = Math.round(badgeSize * 0.6);

  const config = brandConfig[brand];
  const BrandIcon = config.icon;

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <Avatar src={src} alt={alt} size={size} fallback={fallback} />
      <div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: badgeSize,
          height: badgeSize,
          backgroundColor: config.color,
          bottom: -5,
          left: -3,
        }}
      >
        <BrandIcon
          style={{ width: iconSize, height: iconSize, color: "white" }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// AvatarGradient Component
// ============================================================================

/**
 * Gradient-only avatar with smooth blended colors.
 *
 * @example
 * <AvatarGradient colors={['#ff6b6b', '#feca57', '#48dbfb']} angle={135} size={32} />
 */
export function AvatarGradient({
  size = 32,
  colors,
  angle = 135,
}: AvatarGradientProps) {
  const gradient = `linear-gradient(${angle}deg, ${colors.join(", ")})`;
  return (
    <div
      className="rounded-full flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: gradient,
      }}
    />
  );
}

// ============================================================================
// AvatarWithIcon Component
// ============================================================================

/**
 * Avatar with a custom icon badge for status, role, or other indicators.
 *
 * @example
 * <AvatarWithIcon
 *   src="/user.jpg"
 *   icon={<Check size={12} />}
 *   iconBgColor="var(--ds-green-600)"
 *   size={32}
 * />
 *
 * // With gradient background
 * <AvatarWithIcon
 *   gradient={{ colors: ['#ff6b6b', '#feca57'], angle: 135 }}
 *   icon={<Star size={12} />}
 *   size={32}
 * />
 */
export function AvatarWithIcon({
  src,
  alt,
  size = 32,
  fallback,
  icon,
  // Geist's custom-icon badge (icon `data-background`) is a page-bg circle
  // (white / #0A0A0A dark) carrying a gray-900 icon — not a coloured fill.
  iconBgColor = "hsl(var(--color-surface))",
  iconColor = "var(--ds-gray-900)",
  gradient,
  badgeSize: customBadgeSize,
}: AvatarWithIconProps) {
  const badgeSize = customBadgeSize || Math.round(size * 0.55);

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      {gradient ? (
        <AvatarGradient
          size={size}
          colors={gradient.colors}
          angle={gradient.angle}
        />
      ) : (
        <Avatar src={src} alt={alt} size={size} fallback={fallback} />
      )}
      <div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: badgeSize,
          height: badgeSize,
          backgroundColor: iconBgColor,
          color: iconColor,
          // Geist extends the badge circle 1px in its own bg colour so it
          // punches cleanly over the avatar edge (the `border: 1px solid #fff`).
          boxShadow: `0 0 0 1px ${iconBgColor}`,
          bottom: -5,
          left: -3,
        }}
      >
        <span
          style={{ width: badgeSize * 0.6, height: badgeSize * 0.6 }}
          className="flex items-center justify-center"
        >
          {icon}
        </span>
      </div>
    </div>
  );
}

// Default export for convenience
export default Avatar;
