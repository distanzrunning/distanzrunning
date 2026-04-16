/**
 * Distanz Running brand logo components.
 *
 * Usage:
 *   import { DistanzWordmark } from '@/components/logos';
 *
 *   <DistanzWordmark height={64} />
 */

interface LogoProps {
  /** Height in pixels */
  height?: number;
  /** Additional CSS class */
  className?: string;
}

/**
 * Distanz Running wordmark logo.
 * Automatically switches between black and white variants based on theme.
 */
export function DistanzWordmark({ height = 64, className = "" }: LogoProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Distanz_Logo_1600_600_Black.svg"
        alt="Distanz Running"
        className={`dark:hidden ${className}`}
        style={{ height, width: "auto" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Distanz_Logo_1600_600_White.svg"
        alt="Distanz Running"
        className={`hidden dark:block ${className}`}
        style={{ height, width: "auto" }}
      />
    </>
  );
}

/**
 * Distanz Running icon/symbol mark.
 * Automatically switches between black and white variants based on theme.
 */
export function DistanzMark({ height = 32, className = "" }: LogoProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/distanz_icon_black.svg"
        alt="Distanz Running"
        className={`dark:hidden ${className}`}
        style={{ height, width: "auto" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/distanz_icon_white.svg"
        alt="Distanz Running"
        className={`hidden dark:block ${className}`}
        style={{ height, width: "auto" }}
      />
    </>
  );
}
