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

  // Show shimmer placeholder when no src and placeholder is true (without custom icon)
  if (placeholder && !placeholderIcon && !fallback && !src) {
    return (
      <div
        className="rounded-full overflow-hidden flex-shrink-0 animate-shimmer"
        style={{
          width: size,
          height: size,
          background:
            "linear-gradient(90deg, var(--ds-gray-300) 0%, var(--ds-gray-200) 50%, var(--ds-gray-300) 100%)",
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

  return (
    <div
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
          className="flex items-center justify-center text-textSubtle"
          style={{ width: size * 0.5, height: size * 0.5 }}
        >
          {placeholderIcon}
        </span>
      ) : fallback ? (
        <span className="font-medium text-textSubtle" style={{ fontSize }}>
          {getInitials(fallback)}
        </span>
      ) : (
        <User
          className="text-textSubtle"
          style={{ width: size * 0.5, height: size * 0.5 }}
        />
      )}
    </div>
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
export function AvatarGroup({ members, limit, size = 32 }: AvatarGroupProps) {
  const visibleMembers = limit ? members.slice(0, limit) : members;
  const remainingCount = limit ? Math.max(0, members.length - limit) : 0;

  const borderWidth = 2;
  const innerSize = size;
  const outerSize = size + borderWidth * 2;
  const fontSize = Math.round(innerSize * 0.35);
  const overlap = outerSize * 0.25;

  return (
    <div className="flex items-center">
      {visibleMembers.map((member, index) => (
        <div
          key={index}
          className="relative rounded-full"
          style={{
            marginLeft: index === 0 ? 0 : -overlap,
            width: outerSize,
            height: outerSize,
            padding: borderWidth,
            backgroundColor: member.borderColor || "var(--ds-background-100)",
          }}
        >
          <Avatar
            src={member.src}
            alt={member.alt || `Avatar ${index + 1}`}
            size={innerSize}
            placeholder={member.placeholder}
            bgColor={member.bgColor}
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className="relative rounded-full"
          style={{
            marginLeft: -overlap,
            width: outerSize,
            height: outerSize,
            padding: borderWidth,
            backgroundColor: "var(--ds-background-100)",
          }}
        >
          <div
            className="flex items-center justify-center rounded-full bg-[var(--ds-gray-300)] text-textDefault font-semibold"
            style={{
              width: innerSize,
              height: innerSize,
              fontSize,
            }}
          >
            +{remainingCount}
          </div>
        </div>
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
  iconBgColor = "var(--ds-blue-600)",
  iconColor = "white",
  gradient,
}: AvatarWithIconProps) {
  const badgeSize = Math.round(size * 0.55);

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
