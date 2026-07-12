"use client";

import { useRef, useState } from "react";
import posthog from "posthog-js";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  TurnstileWidget,
  waitForToken,
  type TurnstileHandle,
} from "@/components/ui/Turnstile";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type NewsletterSignupTheme = "white" | "black" | "grey";

export interface NewsletterSignupProps {
  /**
   * Surface variant. Each forces its own colour treatment regardless
   * of the page theme.
   * - "white" (default): white card with a subtle top-down gradient.
   *   Uses light DS tokens for text + form controls.
   * - "black": near-black card with the inverse gradient. Uses dark
   *   DS tokens (white text, inverted button colours).
   * - "grey": solid mid-grey card with no gradient. Uses light DS
   *   tokens; useful as a quieter band that sits between fully
   *   white sections.
   *
   * Ignored when chrome="band" — the band inherits the page theme.
   */
  theme?: NewsletterSignupTheme;
  /**
   * Shell variant.
   * - "card" (default): self-contained rounded card — border, radius,
   *   forced theme surface, internal padding.
   * - "band": chromeless — just the heading/form row, transparent on
   *   the page canvas, no padding. For full-bleed placements where the
   *   surrounding section owns the borders and spacing (the pre-footer
   *   band).
   */
  chrome?: "card" | "band";
  /**
   * Attribution tag passed to the PostHog signup event. Use this to
   * distinguish placements (footer vs sidebar vs in-article CTA, etc.).
   */
  source?: string;
}

export default function NewsletterSignup({
  theme = "white",
  chrome = "card",
  source = "newsletter_footer",
}: NewsletterSignupProps = {}) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  // Turnstile delivers tokens via callback into a ref (no re-render
  // needed); tokens are single-use, so every submit ends with reset().
  const turnstileTokenRef = useRef<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address");
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      // Wait briefly for the Turnstile token if the user beat it to
      // the button (the invisible widget usually issues within ~1s of
      // mount). Null when unconfigured (dev) — the API only enforces
      // verification when its secret is set.
      const turnstileToken = await waitForToken(turnstileTokenRef);
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          ...(turnstileToken ? { turnstileToken } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: unknown;
        detail?: unknown;
        message?: unknown;
      };
      if (!res.ok) {
        const pick = (v: unknown): string | null =>
          typeof v === "string" && v.length > 0 ? v : null;
        setError(
          pick(data.error) ??
            pick(data.detail) ??
            pick(data.message) ??
            "Something went wrong. Please try again.",
        );
        return;
      }
      try {
        // PostHog is gated by the Analytics consent category via
        // ConsentSync — no-op until the visitor opts in.
        posthog.capture("newsletter_signup", {
          location: source,
          email_domain: trimmed.split("@")[1],
          source,
        });
      } catch {
        // PostHog may not be loaded yet
      }
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      // Tokens are single-use — refresh so a retry can verify again.
      turnstileRef.current?.reset();
      setSubmitting(false);
    }
  };

  // .light / .dark on the wrapper re-resolves all --ds-* tokens (and
  // any semantic Tailwind tokens that map onto them) for this subtree.
  // White and black both use --ds-background-100 — the wrapper class
  // decides which surface that resolves to. Grey is the lone outlier
  // pinned to a specific gray-scale step.
  const themeClass = theme === "black" ? "dark" : "light";
  const cardBackground =
    theme === "grey"
      ? "var(--ds-gray-200)"
      : "hsl(var(--color-surface))";

  const isBand = chrome === "band";

  return (
    // Band: no theme wrapper (inherits the page's), no card shell, no
    // internal padding — the placement's section owns all of that.
    <div className={isBand ? undefined : themeClass}>
      <div
        className={
          isBand
            ? undefined
            : "mx-auto w-full max-w-content overflow-hidden rounded-xl border border-borderSubtle"
        }
        style={isBand ? undefined : { background: cardBackground }}
      >
        <div
          className={
            isBand
              ? "flex flex-col justify-between gap-8 md:flex-row md:items-center md:gap-20"
              : "flex flex-col justify-between gap-8 p-6 sm:p-12 md:flex-row md:items-center md:gap-20 md:p-16"
          }
        >
          {/* Left: heading + description */}
          <div className="flex max-w-md flex-col gap-2">
            {/* Newsletter nameplate — EB Garamond with the title in
                italics (Quartr's "Sign up for <i>Edge</i>" move), on
                the DS serif pull-quote slot. A deliberate, user-
                sanctioned third serif use: the Shakeout nameplate is
                an editorial brand mark, not UI. */}
            <h2 className="text-heading-32 font-serif text-balance text-textDefault">
              Join the <i>Shakeout</i>
            </h2>
            <p
              className="text-balance"
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.4,
                fontWeight: 500,
                color: "hsl(var(--color-textDefault))",
                maxWidth: 448,
              }}
            >
              A curated set of running stories, gear reviews, and race
              guides every other week.
            </p>
          </div>

          {/* Right: form (or success) */}
          <div className="w-full md:max-w-md">
            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3"
                style={{
                  background: "var(--ds-green-100)",
                  border: "1px solid var(--ds-green-400)",
                  color: "var(--ds-green-900)",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM11.5303 6.53033L12.0607 6L11 4.93934L10.4697 5.46967L7 8.93934L5.53033 7.46967L5 6.93934L3.93934 8L4.46967 8.53033L6.46967 10.5303C6.76256 10.8232 7.23744 10.8232 7.53033 10.5303L11.5303 6.53033Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Check your email to confirm!
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex w-full flex-col">
                {/* No column gap on this form: the Turnstile container
                    below is zero-height while invisible (the common
                    case), and a flex gap would still reserve space
                    under the row — pushing the input off the vertical
                    centre line the wrapper's md:items-center
                    establishes against the title/description block. */}
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="flex-1">
                    <Input
                      type="email"
                      size="large"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      autoComplete="email"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      required
                      disabled={submitting}
                      error={!!error}
                      errorMessage={error || undefined}
                      aria-label="Email"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="large"
                    loading={submitting}
                    disabled={submitting}
                    data-attr="newsletter-footer-submit"
                  >
                    {submitting ? "Subscribing…" : "Subscribe"}
                  </Button>
                </div>
                {/* Invisible bot check (no attribution requirement,
                    unlike the reCAPTCHA notice this replaced) — only
                    materialises as a challenge box for suspicious
                    traffic. */}
                <TurnstileWidget
                  ref={turnstileRef}
                  action={source}
                  onToken={(t) => (turnstileTokenRef.current = t)}
                />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
