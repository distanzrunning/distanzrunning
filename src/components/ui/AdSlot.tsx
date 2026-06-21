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

export interface AdSlotProps {
  /** AdSense `data-ad-slot` ID from your AdSense dashboard. */
  slot: string;
  /** Size preset or explicit dimensions. */
  size: AdSize | Dimensions;
  /**
   * Show the "Advertisement" disclaimer row above a filled ad. Default true.
   * (No disclaimer is shown over the house fallback — that isn't an ad.)
   */
  label?: boolean;
  /** Show the "Go ad free" upsell link in the disclaimer row. Default true. */
  showUpsell?: boolean;
  /** Destination for "Go ad free". Default "/membership" (route TBD). */
  upsellHref?: string;
  /**
   * Show a "Hide" control in the disclaimer that dismisses the unit. Pair with
   * `dismissKey` to remember the dismissal across visits (localStorage).
   */
  dismissible?: boolean;
  /** localStorage key under which a dismissal is remembered. */
  dismissKey?: string;
  /** Vertical breathing room (margin) around the whole unit. Default true. */
  breathingRoom?: boolean;
  /**
   * Custom React content shown in place of the ad if AdSense returns no fill
   * (or the slot hasn't rendered within 1.5s). Defaults to the Distanz
   * "advertise with us" card.
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
   * Design-system demo only: render the full disclaimer chrome over a neutral
   * placeholder creative (no AdSense, no house fallback). Documents the unit;
   * real pages use `preview` or live AdSense.
   */
  mockAd?: boolean;
  /** Additional classes on the outer wrapper. */
  className?: string;
  "aria-label"?: string;
}

// ============================================================================
// Disclaimer row — "Advertisement • Go ad free • Hide" (404media-style)
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
    <div className="ds-ad__disclaimer mb-2 flex items-center justify-center gap-2 text-[11px] leading-none">
      <span className="font-medium uppercase tracking-[0.06em] text-textSubtler">
        Advertisement
      </span>
      {showUpsell && (
        <>
          <Dot />
          <a
            href={upsellHref}
            className="text-link underline decoration-1 underline-offset-2 hover:opacity-80"
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
            className="text-textSubtle underline decoration-1 underline-offset-2 transition-colors hover:text-textDefault"
          >
            Hide
          </button>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Mock creative — neutral placeholder for DS demos (mockAd).
// ============================================================================

function MockCreative({ width, height }: Dimensions) {
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-lg border border-dashed bg-canvas"
      style={{ borderColor: "hsl(var(--color-borderDefault))" }}
    >
      <span className="text-[12px] font-medium tabular-nums text-textSubtle">
        {width} &times; {height}
      </span>
    </div>
  );
}

// ============================================================================
// Default fallback — Distanz "advertise with us" card. Adapts to dimensions.
// ============================================================================

function DefaultFallback({ width, height }: Dimensions) {
  const frameStyle: React.CSSProperties = {
    borderColor: "hsl(var(--color-borderDefault))",
    background: "hsl(var(--color-surface))",
  };
  const ctaStyle: React.CSSProperties = {
    background: "hsl(var(--color-textDefault))",
    color: "hsl(var(--color-textInverted))",
  };

  // Very small mobile banner (≤ 60px tall) — just an inline link
  if (height <= 60) {
    return (
      <div
        className="flex h-full w-full items-center justify-center rounded-lg border px-4"
        style={frameStyle}
      >
        <a
          href="mailto:brand@distanzrunning.com?subject=Advertising%20on%20Distanz%20Running"
          className="text-[12px] font-semibold text-textDefault no-underline hover:underline"
        >
          Advertise with us &rarr;
        </a>
      </div>
    );
  }

  // Short + wide (leaderboard 728×90) — single horizontal row
  if (height < 100) {
    return (
      <div
        className="flex h-full w-full items-center justify-center gap-3 rounded-lg border px-6 text-center"
        style={frameStyle}
      >
        <span className="text-[13px] font-medium text-textDefault">
          Advertise with Distanz Running
        </span>
        <a
          href="mailto:brand@distanzrunning.com?subject=Advertising%20on%20Distanz%20Running"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-textDefault no-underline hover:underline"
        >
          Get in touch
          <ChevronRight className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  // Tall + narrow (skyscraper / half-page) — compact stacked layout
  if (width < 320 && height > 400) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-between rounded-lg border p-4 text-center"
        style={frameStyle}
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-textSubtle">
            Distanz Running
          </div>
          <h4 className="text-[15px] font-semibold leading-tight text-textDefault">
            Advertise here
          </h4>
          <p className="text-[12px] leading-snug text-textSubtle">
            Reach runners where they plan, train, and race.
          </p>
        </div>
        <a
          href="mailto:brand@distanzrunning.com?subject=Advertising%20on%20Distanz%20Running"
          className="inline-flex h-9 w-full items-center justify-center gap-1 rounded-md font-sans text-[12px] font-semibold no-underline"
          style={ctaStyle}
        >
          Get in touch
          <ChevronRight className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  // Default — square / MPU / billboard
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border p-6 text-center"
      style={frameStyle}
    >
      <h4 className="text-heading-16 text-textDefault">Want to reach runners?</h4>
      <p className="max-w-[80%] text-[13px] leading-snug text-textSubtle">
        Feature your brand, product, or story here.
      </p>
      <a
        href="mailto:brand@distanzrunning.com?subject=Advertising%20on%20Distanz%20Running"
        className="inline-flex h-9 items-center gap-1.5 rounded-md px-3.5 font-sans text-[13px] font-semibold no-underline transition-colors"
        style={ctaStyle}
      >
        Get in touch
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
  upsellHref = "/membership",
  dismissible = false,
  dismissKey,
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

  const containerRef = useRef<HTMLElement | null>(null);
  const insRef = useRef<HTMLModElement | null>(null);

  // Skip all AdSense work in preview/mock modes.
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
    const node = containerRef.current;
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

  return (
    <figure
      ref={containerRef as React.RefObject<HTMLElement>}
      aria-label={ariaLabel}
      className={`ds-ad mx-auto ${breathingRoom ? "my-8" : ""} ${className}`}
      style={{
        width: "100%",
        maxWidth: dimensions.width,
        // Reserve the slot height up front so the layout never shifts.
        minHeight: dimensions.height,
      }}
    >
      {showDisclaimer && (
        <AdDisclaimer
          showUpsell={showUpsell}
          upsellHref={upsellHref}
          dismissible={dismissible}
          onDismiss={handleDismiss}
        />
      )}

      {/* Reserved frame — same box whether the ad fills, is loading, mock, or
          we swap in the house fallback. */}
      <div
        style={{
          width: dimensions.width,
          height: dimensions.height,
          maxWidth: "100%",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {mockAd ? (
          <MockCreative {...dimensions} />
        ) : showFallback ? (
          (fallback ?? <DefaultFallback {...dimensions} />)
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
        )}
      </div>
    </figure>
  );
}

export default AdSlot;
