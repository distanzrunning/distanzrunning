"use client";

// ============================================================================
// Turnstile
// ============================================================================
//
// Cloudflare Turnstile widget — the site's bot check (replaced Google
// reCAPTCHA v3, 2026-07: no attribution notice required, free tier).
// Hand-rolled over the explicit-render API rather than a wrapper dep —
// the surface is one script + three functions.
//
// Managed mode with appearance "interaction-only": the widget stays
// invisible and issues a token via callback shortly after mount; it
// only materialises (a small challenge box) for suspicious traffic.
// Tokens are SINGLE-USE and expire (~5 min) — call reset() after every
// submit (success or failure) so a retry gets a fresh token, and use
// waitForToken() before posting in case the user beats the first
// token's arrival.
//
// Config: NEXT_PUBLIC_TURNSTILE_SITE_KEY (widget) +
// TURNSTILE_SECRET_KEY (server siteverify). Without the site key the
// widget renders nothing and forms submit tokenless — the API only
// enforces verification when its secret is configured, so dev and
// pre-key deploys keep working.

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type MutableRefObject,
} from "react";

type TurnstileRenderOptions = {
  sitekey: string;
  action?: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  theme?: "auto" | "light" | "dark";
  appearance?: "always" | "execute" | "interaction-only";
  "refresh-expired"?: "auto" | "manual" | "never";
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: TurnstileRenderOptions,
      ) => string | undefined;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Whether the widget is configured — forms use this to decide if a
    token is worth waiting for before submitting. */
export const turnstileEnabled = Boolean(SITE_KEY);

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Turnstile script failed to load"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/** Poll a token ref until Turnstile delivers (widgets usually issue
    within ~1s of mount). Resolves null on timeout or when the widget
    isn't configured — the form then submits tokenless and the server
    decides (it rejects only when its secret is set). */
export async function waitForToken(
  tokenRef: MutableRefObject<string | null>,
  timeoutMs = 5000,
): Promise<string | null> {
  if (!turnstileEnabled) return null;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (tokenRef.current) return tokenRef.current;
    await new Promise((r) => setTimeout(r, 100));
  }
  return tokenRef.current;
}

export interface TurnstileHandle {
  /** Invalidate the current (single-use) token and request a fresh
      one. Call after every submit. */
  reset: () => void;
}

export interface TurnstileWidgetProps {
  /** Analytics-style action label, visible in the Turnstile dashboard. */
  action?: string;
  /** Receives each fresh token; null when a token expires or errors. */
  onToken: (token: string | null) => void;
  className?: string;
}

export const TurnstileWidget = forwardRef<
  TurnstileHandle,
  TurnstileWidgetProps
>(function TurnstileWidget({ action, onToken, className }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  // Keep the latest onToken without re-rendering the widget when the
  // caller passes a fresh closure each render.
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useImperativeHandle(ref, () => ({
    reset: () => {
      onTokenRef.current(null);
      if (widgetIdRef.current !== undefined)
        window.turnstile?.reset(widgetIdRef.current);
    },
  }));

  useEffect(() => {
    if (!SITE_KEY) return;
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(el, {
          sitekey: SITE_KEY,
          action,
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
          theme: "auto",
          appearance: "interaction-only",
          "refresh-expired": "auto",
        });
      })
      .catch(() => {
        // Script blocked/failed — form falls back to a tokenless
        // submit; the server decides whether that's acceptable.
      });
    return () => {
      cancelled = true;
      if (widgetIdRef.current !== undefined) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, [action]);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} className={className} />;
});
