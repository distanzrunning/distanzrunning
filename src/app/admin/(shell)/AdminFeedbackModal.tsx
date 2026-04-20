"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { submitFeedback, type FeedbackEmotion } from "@/lib/feedback";

// ============================================================================
// Topics — one per admin top-level section + a catch-all
// ============================================================================

const TOPICS = [
  { label: "Overview", value: "Overview" },
  { label: "Consent", value: "Consent" },
  { label: "Feedback", value: "Feedback" },
  { label: "Design System", value: "Design System" },
  { label: "Other", value: "Other" },
];

function defaultTopicForPath(pathname: string): string {
  if (pathname.startsWith("/admin/consent")) return "Consent";
  if (pathname.startsWith("/admin/feedback")) return "Feedback";
  if (pathname.startsWith("/admin/design-system")) return "Design System";
  if (pathname === "/admin" || pathname === "/admin/") return "Overview";
  return "Other";
}

// ============================================================================
// Emoji icons (mirror @/components/ui/Feedback)
// ============================================================================

const EMOJI_OPTIONS: {
  id: FeedbackEmotion;
  label: string;
  path: string;
  accent?: string;
}[] = [
  {
    id: "hate",
    label: "Hate it",
    path: "M4 9V16H5.5V9H4ZM12 9V16H10.5V9H12Z",
    accent: "var(--ds-blue-700)",
  },
  {
    id: "not-great",
    label: "Not great",
    path: "M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM5.75 7.75C6.30228 7.75 6.75 7.30228 6.75 6.75C6.75 6.19772 6.30228 5.75 5.75 5.75C5.19772 5.75 4.75 6.19772 4.75 6.75C4.75 7.30228 5.19772 7.75 5.75 7.75ZM11.25 6.75C11.25 7.30228 10.8023 7.75 10.25 7.75C9.69771 7.75 9.25 7.30228 9.25 6.75C9.25 6.19772 9.69771 5.75 10.25 5.75C10.8023 5.75 11.25 6.19772 11.25 6.75ZM11.5249 11.2622L11.8727 11.7814L10.8342 12.4771L10.4863 11.9578C9.94904 11.1557 9.0363 10.6298 8.00098 10.6298C6.96759 10.6298 6.05634 11.1537 5.51863 11.9533L5.16986 12.4719L4.13259 11.7744L4.48137 11.2558C5.2414 10.1256 6.53398 9.37982 8.00098 9.37982C9.47073 9.37982 10.7654 10.1284 11.5249 11.2622Z",
  },
  {
    id: "okay",
    label: "It's okay",
    path: "M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM11.5249 10.8478L11.8727 10.3286L10.8342 9.6329L10.4863 10.1522C9.94904 10.9543 9.0363 11.4802 8.00098 11.4802C6.96759 11.4802 6.05634 10.9563 5.51863 10.1567L5.16986 9.63804L4.13259 10.3356L4.48137 10.8542C5.2414 11.9844 6.53398 12.7302 8.00098 12.7302C9.47073 12.7302 10.7654 11.9816 11.5249 10.8478ZM6.75 6.75C6.75 7.30228 6.30228 7.75 5.75 7.75C5.19772 7.75 4.75 7.30228 4.75 6.75C4.75 6.19772 5.19772 5.75 5.75 5.75C6.30228 5.75 6.75 6.19772 6.75 6.75ZM10.25 7.75C10.8023 7.75 11.25 7.30228 11.25 6.75C11.25 6.19772 10.8023 5.75 10.25 5.75C9.69771 5.75 9.25 6.19772 9.25 6.75C9.25 7.30228 9.69771 7.75 10.25 7.75Z",
  },
  {
    id: "love",
    label: "Love it",
    path: "M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM4.5 8.97498H3.875V9.59998C3.875 11.4747 5.81046 12.8637 7.99817 12.8637C10.1879 12.8637 12.125 11.4832 12.125 9.59998V8.97498H11.5H4.5ZM7.99817 11.6137C6.59406 11.6137 5.63842 10.9482 5.28118 10.225H10.7202C10.3641 10.9504 9.40797 11.6137 7.99817 11.6137Z",
    accent: "var(--ds-amber-800)",
  },
];

const LOVE_ACCENT_PATH =
  "M6.15295 4.92093L5.375 3.5L4.59705 4.92093L3 5.21885L4.11625 6.39495L3.90717 8L5.375 7.30593L6.84283 8L6.63375 6.39495L7.75 5.21885L6.15295 4.92093ZM11.403 4.92093L10.625 3.5L9.84705 4.92093L8.25 5.21885L9.36625 6.39495L9.15717 8L10.625 7.30593L12.0928 8L11.8837 6.39495L13 5.21885L11.403 4.92093Z";

function EmojiIcon({ emotion }: { emotion: FeedbackEmotion }) {
  const opt = EMOJI_OPTIONS.find((o) => o.id === emotion)!;
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
    >
      {opt.accent && <path d={opt.path} fill={opt.accent} />}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={opt.path}
        fill="currentColor"
      />
      {emotion === "love" && (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={LOVE_ACCENT_PATH}
          fill="var(--ds-amber-800)"
        />
      )}
    </svg>
  );
}

// ============================================================================
// Email helpers (mirror @/components/ui/Feedback)
// ============================================================================

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateOptionalEmail(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return EMAIL_RE.test(trimmed) ? "" : "Please enter a valid email";
}

// ============================================================================
// Reusable success state
// ============================================================================

function SuccessBody() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "32px 8px 8px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "var(--ds-green-700)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
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
      <p
        style={{
          color: "var(--ds-gray-1000)",
          fontSize: 14,
          lineHeight: "20px",
          fontWeight: 600,
          margin: 0,
        }}
      >
        Your feedback has been received!
      </p>
      <p
        style={{
          color: "var(--ds-gray-700)",
          fontSize: 13,
          lineHeight: "18px",
          margin: 0,
        }}
      >
        Thank you for your help.
      </p>
    </div>
  );
}

// ============================================================================
// Modal
// ============================================================================

export default function AdminFeedbackModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname() ?? "";
  const initialTopic = defaultTopicForPath(pathname);

  const [emotion, setEmotion] = useState<FeedbackEmotion | null>(null);
  const [feedback, setFeedback] = useState("");
  const [topic, setTopic] = useState(initialTopic);
  const [step, setStep] = useState<"form" | "email">("form");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  // Reset state when the modal opens (so re-opens don't leak previous input).
  useEffect(() => {
    if (!open) return;
    setEmotion(null);
    setFeedback("");
    setTopic(defaultTopicForPath(pathname));
    setStep("form");
    setEmail("");
    setEmailError("");
    setSubmitted(false);
    setSending(false);
  }, [open, pathname]);

  // Focus the email input on step transition.
  useEffect(() => {
    if (step === "email" && open) {
      requestAnimationFrame(() => emailRef.current?.focus());
    }
  }, [step, open]);

  const finalise = useCallback(
    async (emailValue: string) => {
      setSending(true);
      const ok = await submitFeedback({
        emotion: emotion ?? undefined,
        feedback,
        topic: topic || undefined,
        email: emailValue.trim() || undefined,
      });
      setSending(false);
      if (ok) {
        setSubmitted(true);
        setTimeout(onClose, 1800);
      }
    },
    [emotion, feedback, topic, onClose],
  );

  const handleStep1Submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!emotion || !feedback.trim() || sending) return;
      setStep("email");
    },
    [emotion, feedback, sending],
  );

  const handleStep2Submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (sending) return;
      const err = validateOptionalEmail(email);
      if (err) {
        setEmailError(err);
        return;
      }
      void finalise(email);
    },
    [email, sending, finalise],
  );

  const canAdvance = !!emotion && feedback.trim().length > 0 && !sending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Give Feedback"
      subtitle="Help us improve Stride Admin. Pick a section, leave a note, and tell us how you feel."
      footer={
        submitted ? null : step === "form" ? (
          <form
            id="admin-feedback-form"
            onSubmit={handleStep1Submit}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 12,
              gap: 12,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 1 }}>
              {EMOJI_OPTIONS.map((opt) => {
                const active = emotion === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={`Select ${opt.label}`}
                    onClick={() =>
                      setEmotion((cur) => (cur === opt.id ? null : opt.id))
                    }
                    className="admin-feedback-emoji"
                    data-active={active || undefined}
                  >
                    <EmojiIcon emotion={opt.id} />
                  </button>
                );
              })}
            </span>
            <Button type="submit" size="small" disabled={!canAdvance}>
              Next
            </Button>
            <style>{`
              .admin-feedback-emoji {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: none;
                cursor: pointer;
                padding: 0;
                background: transparent;
                color: var(--ds-gray-900);
                transition: background 0.2s ease, color 0.2s ease;
              }
              .admin-feedback-emoji[data-active] {
                background: var(--ds-pink-300);
                color: var(--ds-pink-800);
              }
              @media (hover: hover) {
                .admin-feedback-emoji:hover {
                  background: var(--ds-pink-300);
                  color: var(--ds-pink-800);
                }
              }
            `}</style>
          </form>
        ) : (
          <form
            onSubmit={handleStep2Submit}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: 12,
            }}
          >
            <Button type="submit" size="small" disabled={sending}>
              {sending ? "Sending" : "Send"}
            </Button>
          </form>
        )
      }
    >
      {submitted ? (
        <SuccessBody />
      ) : step === "form" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label
            htmlFor="admin-feedback-topic"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ds-gray-1000)",
            }}
          >
            Section
            <div className="admin-feedback-select-wrapper">
              <select
                id="admin-feedback-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="admin-feedback-select"
              >
                {TOPICS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <span className="admin-feedback-select-suffix">
                <ChevronDown className="w-4 h-4" />
              </span>
            </div>
          </label>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ds-gray-1000)",
            }}
          >
            Message
            <div className="admin-feedback-textarea-wrapper">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What's working, what's broken, what's missing…"
                rows={5}
                style={{
                  display: "block",
                  width: "100%",
                  minHeight: 120,
                  padding: "10px 12px",
                  fontSize: 14,
                  lineHeight: 1.5,
                  borderRadius: 6,
                  border: "none",
                  background: "var(--ds-background-100)",
                  color: "var(--ds-gray-1000)",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </label>

          <p
            style={{
              fontSize: 12,
              color: "var(--ds-gray-700)",
              margin: 0,
            }}
          >
            Pick how you feel using the icons below, then click Next.
          </p>

          <style>{`
            .admin-feedback-select-wrapper {
              position: relative;
              border-radius: 6px;
              box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);
              overflow: hidden;
              transition: box-shadow 0.15s ease;
            }
            .admin-feedback-select-wrapper:focus-within {
              box-shadow:
                0 0 0 1px var(--ds-gray-alpha-600),
                0 0 0 4px var(--ds-focus-ring);
            }
            .admin-feedback-select {
              display: flex;
              width: 100%;
              height: 40px;
              border-radius: 6px;
              border: none;
              padding: 0 36px 0 12px;
              font-size: 14px;
              line-height: 20px;
              color: var(--ds-gray-1000);
              background: var(--ds-background-100);
              outline: none;
              font-family: inherit;
              box-sizing: border-box;
              appearance: none;
              -webkit-appearance: none;
              cursor: pointer;
            }
            .admin-feedback-select-suffix {
              position: absolute;
              right: 10px;
              top: 50%;
              transform: translateY(-50%);
              pointer-events: none;
              display: flex;
              align-items: center;
              color: var(--ds-gray-900);
            }
            .admin-feedback-textarea-wrapper {
              border-radius: 6px;
              box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);
              overflow: hidden;
              transition: box-shadow 0.15s ease;
            }
            .admin-feedback-textarea-wrapper:focus-within {
              box-shadow:
                0 0 0 1px var(--ds-gray-alpha-600),
                0 0 0 4px var(--ds-focus-ring);
            }
            .admin-feedback-textarea-wrapper textarea::placeholder {
              color: var(--ds-gray-700);
            }
          `}</style>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ds-gray-1000)",
            }}
          >
            Email (optional)
            <div className="admin-feedback-textarea-wrapper">
              <input
                ref={emailRef}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) {
                    setEmailError(validateOptionalEmail(e.target.value));
                  }
                }}
                onBlur={() => setEmailError(validateOptionalEmail(email))}
                autoCapitalize="off"
                autoComplete="email"
                autoCorrect="off"
                spellCheck={false}
                style={{
                  display: "block",
                  width: "100%",
                  height: 40,
                  borderRadius: 6,
                  border: "none",
                  padding: "0 12px",
                  fontSize: 14,
                  lineHeight: "20px",
                  color: "var(--ds-gray-1000)",
                  background: "var(--ds-background-100)",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </label>
          <p
            style={{
              fontSize: 12,
              lineHeight: "16px",
              margin: 0,
              color: emailError
                ? "var(--ds-red-900)"
                : "var(--ds-gray-700)",
            }}
          >
            {emailError ||
              "Leave it blank to stay anonymous, or share it so we can follow up."}
          </p>
          <style>{`
            .admin-feedback-textarea-wrapper {
              border-radius: 6px;
              box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);
              overflow: hidden;
              transition: box-shadow 0.15s ease;
            }
            .admin-feedback-textarea-wrapper:focus-within {
              box-shadow:
                0 0 0 1px var(--ds-gray-alpha-600),
                0 0 0 4px var(--ds-focus-ring);
            }
          `}</style>
        </div>
      )}
    </Modal>
  );
}
