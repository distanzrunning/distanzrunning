"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import posthog from "posthog-js";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

// ============================================================================
// Types
// ============================================================================

export interface NewsletterModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Called when the modal should close */
  onClose: () => void;
  /**
   * Where the modal is being shown (e.g. "homepage", "navbar", "article").
   * Passed to the PostHog signup event for attribution.
   */
  source?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PANEL_MAX_WIDTH = 448;

// ============================================================================
// Success state
// ============================================================================

function NewsletterSuccess() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        padding: "32px 8px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "var(--ds-green-100)",
          color: "var(--ds-green-700)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <svg
          width="32"
          height="32"
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
      </div>
      <h3
        style={{
          margin: 0,
          fontSize: 18,
          lineHeight: "24px",
          fontWeight: 600,
          color: "var(--ds-gray-1000)",
        }}
      >
        Welcome to the team!
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: "20px",
          color: "var(--ds-gray-700)",
        }}
      >
        Check your inbox to confirm your subscription.
      </p>
    </div>
  );
}

// ============================================================================
// Modal
// ============================================================================

export function NewsletterModal({
  isOpen,
  onClose,
  source = "newsletter_modal",
}: NewsletterModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Reset state every time the modal opens so re-opens don't leak
  // previous input.
  useEffect(() => {
    if (!isOpen) return;
    setEmail("");
    setError("");
    setSubmitting(false);
    setSubmitted(false);
  }, [isOpen]);

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
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: unknown;
        detail?: unknown;
        message?: unknown;
      };
      if (!res.ok) {
        const pick = (v: unknown): string | null =>
          typeof v === "string" && v.length > 0 ? v : null;
        const msg =
          pick(data.error) ??
          pick(data.detail) ??
          pick(data.message) ??
          "Something went wrong. Please try again.";
        setError(msg);
        return;
      }
      try {
        // PostHog is gated by the Analytics consent category via ConsentSync,
        // so this is a no-op until the visitor opts in.
        posthog.capture("newsletter_signup", {
          location: source,
          email_domain: trimmed.split("@")[1],
          source,
        });
      } catch {
        // PostHog may not be loaded yet — don't block the success flow.
      }
      setSubmitted(true);
      setTimeout(onClose, 2400);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} maxWidth={PANEL_MAX_WIDTH}>
      {/* Hero — negative margins pull it flush to the panel's rounded
          corners, escaping Modal's built-in 24px body padding. */}
      <div
        style={{
          position: "relative",
          margin: "-24px -24px 0",
          height: 192,
          background: "var(--ds-gray-1000)",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images/berlin_cover.jpg"
          alt=""
          fill
          priority
          quality={85}
          sizes={`(max-width: ${PANEL_MAX_WIDTH}px) 100vw, ${PANEL_MAX_WIDTH}px`}
          style={{ objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
          }}
        >
          <Image
            src="/images/logo_white.svg"
            alt="Distanz Running"
            width={64}
            height={64}
            priority
            style={{ height: 56, width: "auto", maxWidth: "100%" }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 24, textAlign: "center" }}>
        {submitted ? (
          <NewsletterSuccess />
        ) : (
          <>
            <h2
              style={{
                margin: 0,
                fontSize: 24,
                lineHeight: "32px",
                fontWeight: 600,
                letterSpacing: "-0.47px",
                color: "var(--ds-gray-1000)",
              }}
            >
              Stay in the Loop
            </h2>
            <p
              style={{
                marginTop: 8,
                marginBottom: 20,
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--ds-gray-700)",
              }}
            >
              A curated set of running stories, gear reviews, and race
              guides every other week.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                textAlign: "left",
              }}
            >
              <Input
                type="email"
                size="large"
                placeholder="Email Address"
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
              />
              <Button
                type="submit"
                size="large"
                loading={submitting}
                data-attr="newsletter-modal-submit"
                style={{ width: "100%" }}
              >
                {submitting ? "Subscribing…" : "Subscribe"}
              </Button>
            </form>

            <p
              style={{
                marginTop: 16,
                marginBottom: 0,
                fontSize: 12,
                lineHeight: 1.5,
                color: "var(--ds-gray-700)",
                textAlign: "center",
              }}
            >
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--ds-gray-900)",
                  textDecoration: "underline",
                }}
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--ds-gray-900)",
                  textDecoration: "underline",
                }}
              >
                Terms of Service
              </a>{" "}
              apply.
            </p>

            <p
              style={{
                marginTop: 16,
                marginBottom: 0,
                fontSize: 12,
                color: "var(--ds-gray-700)",
              }}
            >
              No spam, ever. Unsubscribe at any time.
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}

// ============================================================================
// Trigger helper
// ============================================================================

export interface NewsletterButtonProps {
  label?: string;
  /** Passed to the PostHog "newsletter_modal_opened" + signup events. */
  source?: string;
  className?: string;
}

export function NewsletterButton({
  label = "Newsletter",
  source = "newsletter_button",
  className,
}: NewsletterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    try {
      posthog.capture("newsletter_modal_opened", { location: source });
    } catch {
      // ignore
    }
    setIsOpen(true);
  };
  return (
    <>
      <Button
        onClick={handleOpen}
        size="large"
        data-attr="newsletter-modal-open"
        className={className}
      >
        {label}
      </Button>
      <NewsletterModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        source={source}
      />
    </>
  );
}

export default NewsletterModal;
