"use client";

import { useEffect, useRef, useState } from "react";

// ============================================================================
// NumberTicker
// ============================================================================
// Animates between numeric values when the `value` prop changes —
// the displayed number tweens from its previous reading to the new
// one over `duration` ms. Used by the consent dashboard's stat tiles
// so swapping date ranges visibly ticks the counts up / down
// instead of flashing a skeleton.
//
// Implementation note: rAF + useState, not framer-motion. The
// re-renders per frame (~36 over a 600ms tween, per ticker) are
// cheap for leaf text nodes and avoid bringing motion infrastructure
// into a primitive that just needs an animated number.

export interface NumberTickerProps {
  /** Target value. The displayed number tweens whenever this changes. */
  value: number;
  /** Decimal places to render. Defaults to 0. */
  decimals?: number;
  /** Optional prefix (e.g. "$"). */
  prefix?: string;
  /** Optional suffix (e.g. "%"). */
  suffix?: string;
  /** Tween duration in ms. Defaults to 400. */
  duration?: number;
}

// Smooth ease-out — fast at the start, settles into the new value.
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function NumberTicker({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 400,
}: NumberTickerProps) {
  const [displayed, setDisplayed] = useState(value);
  // Snapshot the displayed value at the moment a new tween starts —
  // reading state from a ref inside the effect avoids a `displayed`
  // dep that would otherwise re-arm the effect every frame.
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);
  const displayedRef = useRef(value);
  displayedRef.current = displayed;

  useEffect(() => {
    if (value === displayedRef.current) return;
    fromRef.current = displayedRef.current;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const next = fromRef.current + (value - fromRef.current) * eased;
      setDisplayed(next);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  const rounded = Number(displayed.toFixed(decimals));
  const formatted = Number.isFinite(rounded)
    ? rounded.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : "0";

  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  );
}
