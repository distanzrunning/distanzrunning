"use client";

import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import posthog from "posthog-js";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type NewsletterSignupTheme = "auto" | "dark" | "light";

export interface NewsletterSignupProps {
  /**
   * Force a theme on the section.
   * - "auto" (default): inherits the page theme
   * - "dark": always dark surfaces (e.g. an inverted band on a light page)
   * - "light": always light surfaces (e.g. an inverted band on a dark page)
   */
  theme?: NewsletterSignupTheme;
  /**
   * Attribution tag passed to the PostHog signup event. Use this to
   * distinguish placements (footer vs sidebar vs in-article CTA, etc.).
   */
  source?: string;
}

export default function NewsletterSignup({
  theme = "auto",
  source = "newsletter_footer",
}: NewsletterSignupProps = {}) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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
      // reCAPTCHA token is best-effort: skip silently if the provider
      // isn't mounted (dev) or the script fails. The API still verifies
      // server-side when a token is present and no-ops otherwise.
      let recaptchaToken: string | undefined;
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha("newsletter_signup");
        } catch {
          // non-fatal
        }
      }
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          ...(recaptchaToken ? { recaptchaToken } : {}),
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
      setSubmitting(false);
    }
  };

  // .light / .dark on the wrapper re-resolves all --ds-* tokens (and
  // any semantic Tailwind tokens that map onto them) for this subtree,
  // overriding the page-level theme. "auto" leaves it inherited.
  const themeClass = theme === "auto" ? "" : theme;

  return (
    <div className={themeClass}>
      <div
        className="mx-auto max-w-2xl rounded-xl border border-borderSubtle px-6 py-8 sm:px-8"
        style={{ background: "var(--ds-background-100)" }}
      >
        <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          {/* Left: heading and description */}
          <div className="flex flex-col gap-2">
            <h2
              className="text-xl md:text-2xl font-headline font-bold text-textDefault"
              style={{ margin: 0 }}
            >
              Subscribe to the{" "}
              <i className="italic text-textDefault">Shakeout</i>
            </h2>
            <p className="text-base text-textSubtle max-w-[400px]" style={{ margin: 0 }}>
              A curated set of running stories, gear reviews, and race
              guides every other week.
            </p>
          </div>

          {/* Right: form (or success) */}
          <div className="flex w-full sm:max-w-md min-h-[160px] items-start">
            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg"
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
              <form
                onSubmit={handleSubmit}
                className="flex w-full flex-col gap-3"
              >
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
                    disabled={!email || submitting}
                    data-attr="newsletter-footer-submit"
                  >
                    {submitting ? "Subscribing…" : "Subscribe"}
                  </Button>
                </div>
                <p
                  className="text-xs"
                  style={{
                    margin: 0,
                    lineHeight: 1.5,
                    color: "var(--ds-gray-700)",
                  }}
                >
                  This site is protected by reCAPTCHA and the Google{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: "var(--ds-gray-900)" }}
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://policies.google.com/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: "var(--ds-gray-900)" }}
                  >
                    Terms of Service
                  </a>{" "}
                  apply.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
