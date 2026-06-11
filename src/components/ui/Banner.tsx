"use client";

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
  // Geist's exact chevron-right glyph (matches the Geist banner button's icon),
  // not lucide. The Button sizes it via --ds-icon-size; fill inherits the
  // button's text colour through currentColor.
  const arrow = (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m6.75 3.94.53.53 2.82 2.82a1 1 0 0 1 0 1.42l-2.82 2.82-.53.53L5.69 11l.53-.53L8.69 8 6.22 5.53 5.69 5z"
      />
    </svg>
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile: the entire message is one pill button.
          - boxShadow → Geist's raised `shadow-border-small` (the secondary
            variant's flat gray-400 ring is overridden here; inline wins).
          - !gap-0 → Geist's 6px text↔chevron (our flex gap would otherwise
            stack on the content padding and double it to 12px). */}
      <ButtonLink
        href={href}
        variant="secondary"
        size="small"
        shape="rounded"
        suffixIcon={arrow}
        className="!mx-auto !w-fit !gap-0 lg:!hidden"
        style={{ boxShadow: "var(--ds-shadow-border-small)" }}
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
          className="shrink-0 !gap-0"
          style={{ boxShadow: "var(--ds-shadow-border-small)" }}
        >
          {actionLabel}
        </ButtonLink>
      </div>
    </div>
  );
}

export default Banner;
