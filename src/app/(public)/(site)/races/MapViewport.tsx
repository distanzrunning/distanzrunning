"use client";

// src/app/races/MapViewport.tsx
//
// Sizes the map-view section to end EXACTLY at the viewport bottom.
// A static calc(100dvh - <header>) can't do it: the dismissible
// announcement banner above the masthead is client-state (localStorage),
// so any server-side constant is wrong whenever the banner shows —
// on staging it pushed the section (and the map's corner zoom
// controls) 44px below the fold.
//
// Measures the section's document-space top and sets height =
// viewport bottom − top. Children (the Mapbox island) render only
// after the measure, so the map initialises at its final size and
// fitGlobe sees correct geometry — no post-mount resize/refit dance.
// The SSR frame is the recessed gray at the fallback height for one
// paint; the map's own load fade covers the rest. Remeasures on
// resize; a mid-session banner dismiss corrects on the next resize.

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function MapViewport({
  panel,
  children,
}: {
  /** The floating chrome — renders immediately (SSR included): it's
   *  the page header, and fitGlobe measures its bottom edge, so it
   *  must be in the DOM before the map initialises. */
  panel: ReactNode;
  /** The Mapbox island — gated until the measure so it initialises
   *  at its final size. */
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      // Document-space top → stable regardless of current scroll.
      const docTop = el.getBoundingClientRect().top + window.scrollY;
      setHeight(Math.max(520, window.innerHeight - docTop));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full bg-[color:var(--ds-gray-100)]"
      style={{
        height: height ?? "calc(100dvh - 113px)",
      }}
    >
      {height !== null && children}
      {panel}
    </div>
  );
}
