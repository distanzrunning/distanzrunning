/**
 * Distanz Running brand logo components.
 *
 * Usage:
 *   import { DistanzLogo, DistanzWordmark, DistanzMark } from '@/components/logos';
 *
 *   <DistanzLogo height={96} />      // Full logo with "RUNNING" below
 *   <DistanzWordmark height={64} />  // Wordmark only (Distanz with icon as z)
 *   <DistanzMark size={32} />        // Icon/symbol mark only
 */

interface LogoProps {
  /** Height in pixels */
  height?: number;
  /** Additional CSS class */
  className?: string;
}

interface MarkProps {
  /** Size in pixels (width = height) */
  size?: number;
  /** Additional CSS class */
  className?: string;
}

/**
 * Distanz Running full logo.
 * The primary brand lockup with "Distanz" + icon + "RUNNING" underneath.
 * Automatically switches between black and white variants based on theme.
 */
export function DistanzLogo({ height = 96, className = "" }: LogoProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Distanz_Logo_Full_Black_v3.svg"
        alt="Distanz Running"
        className={`dark:hidden ${className}`}
        style={{ height, width: "auto" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Distanz_Logo_Full_White_v3.svg"
        alt="Distanz Running"
        className={`hidden dark:block ${className}`}
        style={{ height, width: "auto" }}
      />
    </>
  );
}

/**
 * Distanz Running wordmark.
 * The simplified horizontal lockup: "Distanz" with icon as the z.
 * Automatically switches between black and white variants based on theme.
 */
export function DistanzWordmark({ height = 64, className = "" }: LogoProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Distanz_Logo_Black_v3.svg"
        alt="Distanz Running"
        className={`dark:hidden ${className}`}
        style={{ height, width: "auto" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Distanz_Logo_White_v3.svg"
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
export function DistanzMark({ size = 32, className = "" }: MarkProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/distanz_icon_black_v3.svg"
        alt="Distanz Running"
        className={`dark:hidden ${className}`}
        style={{ height: size, width: size }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/distanz_icon_white_v3.svg"
        alt="Distanz Running"
        className={`hidden dark:block ${className}`}
        style={{ height: size, width: size }}
      />
    </>
  );
}
