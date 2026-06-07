import type { HTMLAttributes } from "react";

export interface MiddleTruncateProps extends HTMLAttributes<HTMLSpanElement> {
  /** The full string to display. */
  text: string;
  /**
   * Trailing characters always kept visible. The start ellipsizes to fit the
   * container, so the head and this tail both stay readable (e.g. long URLs:
   * `verylongdomain.com/…/deep/page`). Default 8.
   */
  endChars?: number;
}

/**
 * MiddleTruncate — truncates the *middle* of a string, keeping the start and a
 * fixed tail visible. Pure CSS + flex, so it tracks the container width with no
 * measuring (SSR-safe). Useful for URLs, file paths, and IDs where the end is
 * as meaningful as the start.
 *
 * @example
 * <MiddleTruncate text="distanzrunning.com/races/london-marathon" />
 */
export function MiddleTruncate({
  text,
  endChars = 8,
  className = "",
  ...rest
}: MiddleTruncateProps) {
  // Short enough that it can never overflow — render as-is.
  if (text.length <= endChars + 1) {
    return (
      <span className={className} {...rest}>
        {text}
      </span>
    );
  }

  const splitAt = text.length - endChars;
  const start = text.slice(0, splitAt);
  const end = text.slice(splitAt);

  return (
    <span className={`flex min-w-0 ${className}`} title={text} {...rest}>
      {/* head — shrinks and ellipsizes from its end */}
      <span className="min-w-0 truncate">{start}</span>
      {/* tail — always fully visible */}
      <span className="shrink-0 whitespace-pre">{end}</span>
    </span>
  );
}

export default MiddleTruncate;
