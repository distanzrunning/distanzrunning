"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export type AdSize =
  | "mpu"
  | "leaderboard"
  | "billboard"
  | "skyscraper"
  | "half-page"
  | "mobile-banner"
  | "square";

interface Dimensions {
  width: number;
  height: number;
}

const SIZE_PRESETS: Record<AdSize, Dimensions> = {
  mpu: { width: 300, height: 250 },
  leaderboard: { width: 728, height: 90 },
  billboard: { width: 970, height: 250 },
  skyscraper: { width: 160, height: 600 },
  "half-page": { width: 300, height: 600 }, // 404-style sidebar unit
  "mobile-banner": { width: 320, height: 50 },
  square: { width: 300, height: 300 },
};

/** Newsletter signup route — used by the upsell and the house Shakeout ad. */
const SIGNUP_HREF = "/signup";

export interface AdSlotProps {
  /** AdSense `data-ad-slot` ID from your AdSense dashboard. */
  slot: string;
  /** Size preset or explicit dimensions. */
  size: AdSize | Dimensions;
  /**
   * Show the "Advertisement" disclaimer row on the frame over a filled ad.
   * Default true. (No disclaimer over the house fallback — it isn't an ad.)
   */
  label?: boolean;
  /** Show the "Go ad free" upsell in the disclaimer row. Default true. */
  showUpsell?: boolean;
  /** Destination for "Go ad free". Default `/signup`. */
  upsellHref?: string;
  /**
   * Show a "Hide" control in the disclaimer that dismisses the unit. Pair with
   * `dismissKey` to remember the dismissal across visits (localStorage).
   */
  dismissible?: boolean;
  /** localStorage key under which a dismissal is remembered. */
  dismissKey?: string;
  /**
   * Wrap the unit in the bordered frame with the disclaimer on the top rule
   * (404-style). Default true. Turn off when the placement provides its own
   * card chrome (e.g. a custom fallback).
   */
  framed?: boolean;
  /** Vertical breathing room (margin) around the whole unit. Default true. */
  breathingRoom?: boolean;
  /**
   * Custom React content shown in place of the ad if AdSense returns no fill
   * (or the slot hasn't rendered within 1.5s). Defaults to the Shakeout
   * newsletter house ad.
   */
  fallback?: ReactNode;
  /** Lazy-load the ad script until the slot scrolls into view (default true). */
  lazy?: boolean;
  /**
   * Skip the AdSense call entirely and render the fallback immediately.
   * For placeholder pages where the slot ID isn't a real AdSense unit.
   */
  preview?: boolean;
  /**
   * Design-system demo only: render the disclaimer/frame over a neutral
   * placeholder creative (no AdSense, no house fallback).
   */
  mockAd?: boolean;
  /** Additional classes on the outer frame. */
  className?: string;
  "aria-label"?: string;
}

// ============================================================================
// Disclaimer row — "ADVERTISEMENT · GO AD FREE · HIDE"
// All caps, one size; the label/Hide are muted, the upsell is the link accent.
// ============================================================================

function AdDisclaimer({
  showUpsell,
  upsellHref,
  dismissible,
  onDismiss,
}: {
  showUpsell: boolean;
  upsellHref: string;
  dismissible: boolean;
  onDismiss: () => void;
}) {
  const Dot = () => (
    <span aria-hidden className="text-textSubtler">
      &middot;
    </span>
  );
  return (
    <span className="flex items-center justify-center gap-2 text-[11px] font-medium uppercase leading-none tracking-[0.08em]">
      <span className="text-textSubtler">Advertisement</span>
      {showUpsell && (
        <>
          <Dot />
          <a
            href={upsellHref}
            className="text-link transition-colors hover:text-textDefault"
          >
            Go ad free
          </a>
        </>
      )}
      {dismissible && (
        <>
          <Dot />
          <button
            type="button"
            onClick={onDismiss}
            className="text-textSubtler uppercase transition-colors hover:text-textDefault"
          >
            Hide
          </button>
        </>
      )}
    </span>
  );
}

// ============================================================================
// Mock creative — neutral placeholder for DS demos (mockAd).
// ============================================================================

function MockCreative({ width, height }: Dimensions) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-canvas">
      <span className="text-[12px] font-medium tabular-nums text-textSubtle">
        {width} &times; {height}
      </span>
    </div>
  );
}

// ============================================================================
// House fallback — the Shakeout newsletter ad. Shown when no ad fills.
// Borderless (the frame provides the border); adapts to the slot's shape.
// ============================================================================

function ShakeoutAd({ width, height }: Dimensions) {
  const kicker = (
    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-link">
      The Shakeout
    </span>
  );
  const ctaStyle: React.CSSProperties = {
    background: "hsl(var(--color-textDefault))",
    color: "hsl(var(--color-textInverted))",
  };

  // Very small mobile banner (≤ 60px tall) — single inline line.
  if (height <= 60) {
    return (
      <a
        href={SIGNUP_HREF}
        className="flex h-full w-full items-center justify-center gap-2 rounded-md bg-canvas px-4 no-underline"
      >
        <span className="text-[12px] font-semibold text-textDefault">
          The Shakeout &mdash; our weekly running newsletter
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-textSubtle" />
      </a>
    );
  }

  // Short + wide (leaderboard 728×90) — kicker + line + CTA in a row.
  if (height < 100) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-4 rounded-md bg-canvas px-6 text-center">
        <div className="flex flex-col items-start gap-0.5 text-left">
          {kicker}
          <span className="text-[13px] font-medium text-textDefault">
            Weekly running stories, gear, and race news.
          </span>
        </div>
        <a
          href={SIGNUP_HREF}
          className="inline-flex h-9 shrink-0 items-center gap-1 rounded-md px-3.5 font-sans text-[13px] font-semibold no-underline"
          style={ctaStyle}
        >
          Subscribe
          <ChevronRight className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  // Tall + narrow (skyscraper / half-page) — stacked.
  if (width < 320 && height > 400) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-between rounded-md bg-canvas p-5 text-center">
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          {kicker}
          <h4 className="text-[16px] font-semibold leading-tight text-textDefault">
            Don&apos;t miss a beat
          </h4>
          <p className="text-[12px] leading-snug text-textSubtle">
            Weekly running stories, gear, and race news &mdash; straight to your
            inbox.
          </p>
        </div>
        <a
          href={SIGNUP_HREF}
          className="inline-flex h-9 w-full items-center justify-center gap-1 rounded-md font-sans text-[12px] font-semibold no-underline"
          style={ctaStyle}
        >
          Subscribe
          <ChevronRight className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  // Default — square / MPU / billboard.
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2.5 rounded-md bg-canvas p-6 text-center">
      {kicker}
      <h4 className="text-heading-16 text-textDefault">Get the Shakeout</h4>
      <p className="max-w-[85%] text-[13px] leading-snug text-textSubtle">
        Weekly running stories, gear, and race news.
      </p>
      <a
        href={SIGNUP_HREF}
        className="mt-1 inline-flex h-9 items-center gap-1.5 rounded-md px-3.5 font-sans text-[13px] font-semibold no-underline transition-colors"
        style={ctaStyle}
      >
        Subscribe
        <ChevronRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

// ============================================================================
// AdSlot
// ============================================================================

const ADSENSE_CLIENT = "ca-pub-8457173435004026";
const FILL_CHECK_DELAY_MS = 1500;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({
  slot,
  size,
  label = true,
  showUpsell = true,
  upsellHref = SIGNUP_HREF,
  dismissible = false,
  dismissKey,
  framed = true,
  breathingRoom = true,
  fallback,
  lazy = true,
  preview = false,
  mockAd = false,
  className = "",
  "aria-label": ariaLabel = "Advertisement",
}: AdSlotProps) {
  const dimensions: Dimensions =
    typeof size === "string" ? SIZE_PRESETS[size] : size;

  const frameRef = useRef<HTMLFieldSetElement | null>(null);
  const insRef = useRef<HTMLModElement | null>(null);

  const inert = preview || mockAd;
  const [inView, setInView] = useState(!lazy);
  const [filled, setFilled] = useState<boolean | null>(inert ? false : null);

  // Remembered dismissal.
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (!dismissible || !dismissKey || typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem(`ds-ad-dismissed:${dismissKey}`) === "1") {
        setDismissed(true);
      }
    } catch {
      // localStorage unavailable — just don't persist.
    }
  }, [dismissible, dismissKey]);

  const handleDismiss = () => {
    setDismissed(true);
    if (dismissKey && typeof window !== "undefined") {
      try {
        window.localStorage.setItem(`ds-ad-dismissed:${dismissKey}`, "1");
      } catch {
        // ignore
      }
    }
  };

  // 1. IntersectionObserver for lazy loading.
  useEffect(() => {
    if (inert) return;
    if (!lazy || inView) return;
    const node = frameRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            return;
          }
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [lazy, inView, inert]);

  // 2. Push the slot to adsbygoogle once in view.
  useEffect(() => {
    if (inert) return;
    if (!inView) return;
    if (typeof window === "undefined") return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Blocker, offline, or script not yet loaded — fallback check handles it.
    }
  }, [inView, inert]);

  // 3. After a short delay, inspect the ins element for fill state.
  useEffect(() => {
    if (inert) return;
    if (!inView) return;

    const timer = setTimeout(() => {
      const ins = insRef.current;
      if (!ins) {
        setFilled(false);
        return;
      }
      const status = ins.getAttribute("data-ad-status");
      if (status === "filled" && ins.offsetHeight > 0) {
        setFilled(true);
      } else {
        setFilled(false);
      }
    }, FILL_CHECK_DELAY_MS);

    return () => clearTimeout(timer);
  }, [inView, inert]);

  if (dismissed) return null;

  // Disclaimer shows over a real (or mock) ad, never over the house fallback.
  const showDisclaimer = label && (mockAd || filled === true);
  const showFallback = !mockAd && filled === false;

  const creative = mockAd ? (
    <MockCreative {...dimensions} />
  ) : showFallback ? (
    (fallback ?? <ShakeoutAd {...dimensions} />)
  ) : (
    <ins
      ref={insRef}
      className="adsbygoogle"
      style={{
        display: "block",
        width: dimensions.width,
        height: dimensions.height,
      }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
    />
  );

  return (
    <fieldset
      ref={frameRef}
      aria-label={ariaLabel}
      className={[
        "ds-ad mx-auto",
        framed ? "rounded-lg border border-borderSubtle px-4 pb-4 pt-2.5" : "",
        breathingRoom ? "my-8" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        minWidth: 0,
        // Framed: shrink to the creative + padding. Unframed: cap at the size.
        width: framed ? "fit-content" : "100%",
        maxWidth: framed ? "100%" : dimensions.width,
      }}
    >
      {showDisclaimer && (
        <legend className="ds-ad__disclaimer">
          <AdDisclaimer
            showUpsell={showUpsell}
            upsellHref={upsellHref}
            dismissible={dismissible}
            onDismiss={handleDismiss}
          />
        </legend>
      )}

      {/* Reserved frame — same box whether the ad fills, is loading, mock, or
          we swap in the house fallback. */}
      <div
        className="relative mx-auto"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          maxWidth: "100%",
          minHeight: dimensions.height,
        }}
      >
        {creative}
      </div>
    </fieldset>
  );
}

export default AdSlot;
