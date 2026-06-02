"use client";

// src/app/races/InitialLoadShell.tsx
//
// Cold-load gate. Renders the skeleton tree on first mount, then
// flips to the real page once the browser has finished loading
// initial-paint resources (priority images, fonts, etc) — or after
// a 1500 ms safety timeout if `load` never fires.
//
// This is the "whole-page skeleton on initial load" half of the
// flicker fix. The "cards-only skeleton on filter selection" half
// lives in FiltersShell with its own delayed-skeleton state.

import { useEffect, useState, type ReactNode } from "react";

interface InitialLoadShellProps {
  skeleton: ReactNode;
  children: ReactNode;
  /** Hard cap on how long the skeleton stays up. */
  timeoutMs?: number;
}

export default function InitialLoadShell({
  skeleton,
  children,
  timeoutMs = 1500,
}: InitialLoadShellProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Already-loaded edge case (cached navigations, dev fast
    // refresh) — don't show skeleton if the browser is already
    // past the load event.
    if (document.readyState === "complete") {
      setReady(true);
      return;
    }

    const onLoad = () => setReady(true);
    window.addEventListener("load", onLoad, { once: true });
    const t = setTimeout(() => setReady(true), timeoutMs);

    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(t);
    };
  }, [timeoutMs]);

  return <>{ready ? children : skeleton}</>;
}
