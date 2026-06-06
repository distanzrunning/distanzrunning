"use client";

import { ChevronRight } from "lucide-react";
import { ButtonLink } from "./Button";

export interface BannerProps {
  /**
   * The announcement message. Wrap the emphasised lead in `<strong>` —
   * it renders as gray-1000 semibold on desktop (Geist's `[&_b]` treatment).
   */
  children: React.ReactNode;
  /** Link target for the action (and for the whole pill on mobile). */
  href?: string;
  /** Desktop action button label. Defaults to "Read more". */
  actionLabel?: string;
  /** Additional CSS classes on the banner container. */
  className?: string;
}

/**
 * Banner — a prominent, full-width message that announces important
 * information. Follows Geist's responsive model:
 *
 * - **Desktop (≥lg)**: a centered message (`text-copy-16`, gray-900, with the
 *   `<strong>` lead lifted to gray-1000 semibold) beside a "Read more" pill.
 * - **Mobile (<lg)**: the whole message collapses into a single pill button
 *   with a trailing arrow.
 *
 * The pill is the DS `secondary` button at `size=small`, `shape=rounded`.
 *
 * @example
 * <Banner href="/changelog">
 *   <strong>Big News</strong> – New components finally available
 * </Banner>
 */
export function Banner({
  children,
  href = "#",
  actionLabel = "Read more",
  className = "",
}: BannerProps) {
  const arrow = <ChevronRight aria-hidden="true" />;

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile: the entire message is one pill button */}
      <ButtonLink
        href={href}
        variant="secondary"
        size="small"
        shape="rounded"
        suffixIcon={arrow}
        className="!mx-auto !w-fit lg:!hidden"
      >
        {children}
      </ButtonLink>

      {/* Desktop: centered message + a Read more pill */}
      <div className="mx-auto hidden w-full max-w-[1080px] items-center justify-center gap-3 p-4 lg:flex [&_b]:font-semibold [&_b]:text-textDefault [&_strong]:font-semibold [&_strong]:text-textDefault">
        <p className="text-copy-16 text-textSubtle">{children}</p>
        <ButtonLink
          href={href}
          variant="secondary"
          size="small"
          shape="rounded"
          suffixIcon={arrow}
          className="shrink-0"
        >
          {actionLabel}
        </ButtonLink>
      </div>
    </div>
  );
}

export default Banner;
