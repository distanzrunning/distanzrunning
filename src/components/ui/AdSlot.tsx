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
  "mobile-banner": { width: 320, height: 50 },
  square: { width: 300, height: 300 },
};

export interface AdSlotProps {
  /** AdSense `data-ad-slot` ID from your AdSense dashboard. */
  slot: string;
  /** Size preset or explicit dimensions. */
  size: AdSize | Dimensions;
  /** Show the "Advertisement" label above the slot when an ad renders. */
  label?: boolean;
  /**
   * Custom React content shown in place of the ad if AdSense returns no fill
   * (or the slot hasn't rendered within 1.5s). Defaults to the Distanz
   * "Write for us / advertise" card.
   */
  fallback?: ReactNode;
  /** Lazy-load the ad script until the slot scrolls into view (default true). */
  lazy?: boolean;
  /**
   * Skip the AdSense call entirely and render the fallback immediately.
   * Useful for design-system previews, placeholder pages, and Storybook
   * where the slot ID isn't a real AdSense ad unit.
   */
  preview?: boolean;
  /** Additional classes on the outer wrapper. */
  className?: string;
}

// ============================================================================
// Default fallback — Distanz "Write for us / advertise" card.
// Adapts to the slot's dimensions.
// ============================================================================

function DefaultFallback({ width, height }: Dimensions) {
  const frameStyle: React.CSSProperties = {
    borderColor: "var(--ds-gray-400)",
    // bg-100 (white in light, elevated dark in dark) so the
    // fallback reads as a card raised above the PageFrame
    // surface — bg-200 blended with the surface in light mode.
    background: "var(--ds-background-100)",
  };
  const ctaStyle: React.CSSProperties = {
    background: "var(--ds-gray-1000)",
    color: "var(--ds-background-100)",
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
          Advertise with us →
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

  // Tall + narrow (skyscraper 160×600) — compact stacked layout
  if (width < 240 && height > 400) {
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
          className="inline-flex w-full items-center justify-center gap-1 h-9 rounded-md font-sans text-[12px] font-semibold no-underline"
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
      <h4 className="text-[16px] font-semibold leading-tight text-textDefault">
        Want to reach runners?
      </h4>
      <p className="text-[13px] leading-snug text-textSubtle max-w-[80%]">
        Feature your brand, product, or story here.
      </p>
      <a
        href="mailto:brand@distanzrunning.com?subject=Advertising%20on%20Distanz%20Running"
        className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-md font-sans text-[13px] font-semibold no-underline transition-colors"
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
  fallback,
  lazy = true,
  preview = false,
  className = "",
}: AdSlotProps) {
  const dimensions: Dimensions =
    typeof size === "string" ? SIZE_PRESETS[size] : size;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const insRef = useRef<HTMLModElement | null>(null);

  // `inView` gates script injection when lazy.
  const [inView, setInView] = useState(!lazy);
  // `filled` flips true when we detect AdSense rendered content.
  // null = undecided, true = filled (show label), false = empty (show fallback).
  // In preview mode we force this to false on mount so the fallback renders
  // immediately without contacting AdSense.
  const [filled, setFilled] = useState<boolean | null>(preview ? false : null);

  // 1. IntersectionObserver for lazy loading.
  useEffect(() => {
    if (preview) return;
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
  }, [lazy, inView, preview]);

  // 2. Push the slot to adsbygoogle once in view.
  useEffect(() => {
    if (preview) return;
    if (!inView) return;
    if (typeof window === "undefined") return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Blocker, offline, or script not yet loaded — fallback check handles it.
    }
  }, [inView, preview]);

  // 3. After a short delay, inspect the ins element for fill state.
  useEffect(() => {
    if (preview) return;
    if (!inView) return;

    const timer = setTimeout(() => {
      const ins = insRef.current;
      if (!ins) {
        setFilled(false);
        return;
      }
      const status = ins.getAttribute("data-ad-status");
      // AdSense sets data-ad-status="filled" or "unfilled" once resolved.
      // If it's still null (blocked, offline, script failed), treat as unfilled.
      if (status === "filled" && ins.offsetHeight > 0) {
        setFilled(true);
      } else {
        setFilled(false);
      }
    }, FILL_CHECK_DELAY_MS);

    return () => clearTimeout(timer);
  }, [inView]);

  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: dimensions.width,
    // Reserve the exact slot size up front so the layout never shifts.
    minHeight: dimensions.height,
  };

  // While the ad is resolving we don't label or show fallback — just the
  // reserved empty frame. This matches AdSense's own behaviour (their script
  // renders directly into the <ins>).
  const showLabel = label && filled === true;
  const showFallback = filled === false;

  return (
    <div ref={containerRef} className={className} style={wrapperStyle}>
      {showLabel && (
        <div
          className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: "var(--ds-gray-700)" }}
        >
          Advertisement
        </div>
      )}

      {/* Reserved frame — same box whether the ad fills, is loading, or
          we swap in a fallback. */}
      <div
        style={{
          width: dimensions.width,
          height: dimensions.height,
          maxWidth: "100%",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {showFallback ? (
          fallback ?? <DefaultFallback {...dimensions} />
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
    </div>
  );
}

export default AdSlot;
