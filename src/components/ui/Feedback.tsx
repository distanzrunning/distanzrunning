"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";

// ============================================================================
// Types
// ============================================================================

export interface FeedbackProps {
  /** Text shown on the trigger button (default: "Feedback") */
  buttonLabel?: string;
  /** Callback when feedback is submitted */
  onSubmit?: (data: { emotion: string; feedback: string; metadata?: Record<string, string> }) => void;
  /** Optional metadata to include with the submission */
  metadata?: Record<string, string>;
  className?: string;
}

// ============================================================================
// Emoji Icons (Geist exact SVG paths)
// ============================================================================

function HateItIcon() {
  return (
    <svg width="16" height="16" strokeLinejoin="round" viewBox="0 0 16 16" style={{ color: "currentcolor" }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 9V16H5.5V9H4ZM12 9V16H10.5V9H12Z"
        fill="var(--ds-blue-700)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 9.57941 13.9367 11.0273 13 12.1536V14.2454C14.8289 12.7793 16 10.5264 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 10.5264 1.17107 12.7793 3 14.2454V12.1536C2.06332 11.0273 1.5 9.57941 1.5 8ZM8 14.5C8.51627 14.5 9.01848 14.4398 9.5 14.3261V15.8596C9.01412 15.9518 8.51269 16 8 16C7.48731 16 6.98588 15.9518 6.5 15.8596V14.3261C6.98152 14.4398 7.48373 14.5 8 14.5ZM3.78568 8.36533C4.15863 7.98474 4.67623 7.75 5.25 7.75C5.82377 7.75 6.34137 7.98474 6.71432 8.36533L7.78568 7.31548C7.14222 6.65884 6.24318 6.25 5.25 6.25C4.25682 6.25 3.35778 6.65884 2.71432 7.31548L3.78568 8.36533ZM10.75 7.75C10.1762 7.75 9.65863 7.98474 9.28568 8.36533L8.21432 7.31548C8.85778 6.65884 9.75682 6.25 10.75 6.25C11.7432 6.25 12.6422 6.65884 13.2857 7.31548L12.2143 8.36533C11.8414 7.98474 11.3238 7.75 10.75 7.75ZM6.25 12H9.75C9.75 11.0335 8.9665 10.25 8 10.25C7.0335 10.25 6.25 11.0335 6.25 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

function NotGreatIcon() {
  return (
    <svg width="16" height="16" strokeLinejoin="round" viewBox="0 0 16 16" style={{ color: "currentcolor" }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM5.75 7.75C6.30228 7.75 6.75 7.30228 6.75 6.75C6.75 6.19772 6.30228 5.75 5.75 5.75C5.19772 5.75 4.75 6.19772 4.75 6.75C4.75 7.30228 5.19772 7.75 5.75 7.75ZM11.25 6.75C11.25 7.30228 10.8023 7.75 10.25 7.75C9.69771 7.75 9.25 7.30228 9.25 6.75C9.25 6.19772 9.69771 5.75 10.25 5.75C10.8023 5.75 11.25 6.19772 11.25 6.75ZM11.5249 11.2622L11.8727 11.7814L10.8342 12.4771L10.4863 11.9578C9.94904 11.1557 9.0363 10.6298 8.00098 10.6298C6.96759 10.6298 6.05634 11.1537 5.51863 11.9533L5.16986 12.4719L4.13259 11.7744L4.48137 11.2558C5.2414 10.1256 6.53398 9.37982 8.00098 9.37982C9.47073 9.37982 10.7654 10.1284 11.5249 11.2622Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ItsOkayIcon() {
  return (
    <svg width="16" height="16" strokeLinejoin="round" viewBox="0 0 16 16" style={{ color: "currentcolor" }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM11.5249 10.8478L11.8727 10.3286L10.8342 9.6329L10.4863 10.1522C9.94904 10.9543 9.0363 11.4802 8.00098 11.4802C6.96759 11.4802 6.05634 10.9563 5.51863 10.1567L5.16986 9.63804L4.13259 10.3356L4.48137 10.8542C5.2414 11.9844 6.53398 12.7302 8.00098 12.7302C9.47073 12.7302 10.7654 11.9816 11.5249 10.8478ZM6.75 6.75C6.75 7.30228 6.30228 7.75 5.75 7.75C5.19772 7.75 4.75 7.30228 4.75 6.75C4.75 6.19772 5.19772 5.75 5.75 5.75C6.30228 5.75 6.75 6.19772 6.75 6.75ZM10.25 7.75C10.8023 7.75 11.25 7.30228 11.25 6.75C11.25 6.19772 10.8023 5.75 10.25 5.75C9.69771 5.75 9.25 6.19772 9.25 6.75C9.25 7.30228 9.69771 7.75 10.25 7.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LoveItIcon() {
  return (
    <svg width="16" height="16" strokeLinejoin="round" viewBox="0 0 16 16" style={{ color: "currentcolor" }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM4.5 8.97498H3.875V9.59998C3.875 11.4747 5.81046 12.8637 7.99817 12.8637C10.1879 12.8637 12.125 11.4832 12.125 9.59998V8.97498H11.5H4.5ZM7.99817 11.6137C6.59406 11.6137 5.63842 10.9482 5.28118 10.225H10.7202C10.3641 10.9504 9.40797 11.6137 7.99817 11.6137Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.15295 4.92093L5.375 3.5L4.59705 4.92093L3 5.21885L4.11625 6.39495L3.90717 8L5.375 7.30593L6.84283 8L6.63375 6.39495L7.75 5.21885L6.15295 4.92093ZM11.403 4.92093L10.625 3.5L9.84705 4.92093L8.25 5.21885L9.36625 6.39495L9.15717 8L10.625 7.30593L12.0928 8L11.8837 6.39495L13 5.21885L11.403 4.92093Z"
        fill="var(--ds-amber-800)"
      />
    </svg>
  );
}

function MarkdownIcon() {
  return (
    <svg fill="none" height="14" viewBox="0 0 22 14" width="22">
      <path
        clipRule="evenodd"
        d="M19.5 1.25H2.5C1.80964 1.25 1.25 1.80964 1.25 2.5V11.5C1.25 12.1904 1.80964 12.75 2.5 12.75H19.5C20.1904 12.75 20.75 12.1904 20.75 11.5V2.5C20.75 1.80964 20.1904 1.25 19.5 1.25ZM2.5 0C1.11929 0 0 1.11929 0 2.5V11.5C0 12.8807 1.11929 14 2.5 14H19.5C20.8807 14 22 12.8807 22 11.5V2.5C22 1.11929 20.8807 0 19.5 0H2.5ZM3 3.5H4H4.25H4.6899L4.98715 3.82428L7 6.02011L9.01285 3.82428L9.3101 3.5H9.75H10H11V4.5V10.5H9V6.79807L7.73715 8.17572L7 8.97989L6.26285 8.17572L5 6.79807V10.5H3V4.5V3.5ZM15 7V3.5H17V7H19.5L17 9.5L16 10.5L15 9.5L12.5 7H15Z"
        fill="var(--ds-gray-700)"
        fillRule="evenodd"
      />
    </svg>
  );
}

// ============================================================================
// Emoji options
// ============================================================================

interface EmojiOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const emojiOptions: EmojiOption[] = [
  { id: "hate", label: "Hate it", icon: <HateItIcon /> },
  { id: "not-great", label: "Not great", icon: <NotGreatIcon /> },
  { id: "okay", label: "It's okay", icon: <ItsOkayIcon /> },
  { id: "love", label: "Love it!", icon: <LoveItIcon /> },
];

// ============================================================================
// Feedback Component
// ============================================================================

// ============================================================================
// Popover direction helper
// ============================================================================

const POPOVER_HEIGHT_ESTIMATE = 320; // rough height of the popover content
const POPOVER_GAP = 8;

function usePopoverDirection(
  isOpen: boolean,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
) {
  const [direction, setDirection] = useState<"below" | "above">("below");

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - POPOVER_GAP;
    const spaceAbove = rect.top - POPOVER_GAP;
    setDirection(
      spaceBelow >= POPOVER_HEIGHT_ESTIMATE || spaceBelow >= spaceAbove
        ? "below"
        : "above",
    );
  }, [isOpen, triggerRef]);

  return direction;
}

// ============================================================================
// Inline Feedback Types
// ============================================================================

export interface FeedbackInlineProps {
  /** Text shown as the label (default: "Was this helpful?") */
  label?: string;
  /** Callback when feedback is submitted */
  onSubmit?: (data: { emotion: string; feedback: string }) => void;
  className?: string;
}

// ============================================================================
// Inline Feedback Component
// ============================================================================

export function FeedbackInline({
  label = "Was this helpful?",
  onSubmit,
  className,
}: FeedbackInlineProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedEmotion) {
        onSubmit?.({ emotion: selectedEmotion, feedback: feedbackText });
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setSelectedEmotion(null);
          setFeedbackText("");
        }, 2000);
      }
    },
    [selectedEmotion, feedbackText, onSubmit],
  );

  const isExpanded = selectedEmotion !== null && !submitted;

  useEffect(() => {
    if (isExpanded) {
      // Wait for the expand animation frame so the textarea is in the DOM
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }, [isExpanded]);

  return (
    <div className={`feedback-inline-wrapper ${isExpanded ? "feedback-inline-wrapper--expanded" : ""} ${className || ""}`}>
      {submitted ? (
        <div className="feedback-inline-trigger">
          <p
            style={{
              color: "var(--ds-gray-900)",
              fontSize: 14,
              lineHeight: "20px",
              fontWeight: 400,
              margin: 0,
            }}
          >
            Thank you for your feedback!
          </p>
        </div>
      ) : (
        <>
          {/* Trigger row: label + emojis */}
          <div className="feedback-inline-trigger">
            <p
              style={{
                color: "var(--ds-gray-900)",
                fontSize: 14,
                lineHeight: "20px",
                fontWeight: 400,
                margin: 0,
              }}
            >
              {label}
            </p>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji.id}
                  type="button"
                  role="radio"
                  className={`feedback-emoji${selectedEmotion === emoji.id ? " feedback-emoji--selected" : ""}`}
                  aria-checked={selectedEmotion === emoji.id}
                  aria-label={`Select ${emoji.label} emoji`}
                  onClick={() =>
                    setSelectedEmotion(
                      selectedEmotion === emoji.id ? null : emoji.id,
                    )
                  }
                >
                  {emoji.icon}
                </button>
              ))}
            </span>
          </div>

          {/* Expanded form — floats over the pill, bottom aligned with pill's bottom */}
          {isExpanded && (
            <div className="feedback-inline-expanded">
              <div className="feedback-inline-trigger">
                <p
                  style={{
                    color: "var(--ds-gray-900)",
                    fontSize: 14,
                    lineHeight: "20px",
                    fontWeight: 400,
                    margin: 0,
                  }}
                >
                  {label}
                </p>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji.id}
                      type="button"
                      role="radio"
                      className={`feedback-emoji${selectedEmotion === emoji.id ? " feedback-emoji--selected" : ""}`}
                      aria-checked={selectedEmotion === emoji.id}
                      aria-label={`Select ${emoji.label} emoji`}
                      onClick={() =>
                        setSelectedEmotion(
                          selectedEmotion === emoji.id ? null : emoji.id,
                        )
                      }
                    >
                      {emoji.icon}
                    </button>
                  ))}
                </span>
              </div>
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    padding: 8,
                  }}
                >
                  <label>
                    <div className="feedback-textarea-wrapper">
                      <textarea
                        ref={textareaRef}
                        id="feedback-textarea"
                        placeholder="Your feedback..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        style={{
                          display: "flex",
                          width: "100%",
                          height: 100,
                          borderRadius: 6,
                          border: "none",
                          padding: "10px 12px",
                          fontSize: 14,
                          lineHeight: "normal",
                          color: "var(--ds-gray-1000)",
                          background: "var(--ds-background-100)",
                          resize: "none",
                          outline: "none",
                          fontFamily: "inherit",
                          boxSizing: "border-box",
                          appearance: "none",
                        }}
                      />
                    </div>
                  </label>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 4,
                      fontSize: 12,
                      lineHeight: "16px",
                      fontWeight: 400,
                      color: "var(--ds-gray-900)",
                    }}
                  >
                    <MarkdownIcon />
                    <span>supported.</span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: 12,
                    background: "var(--ds-background-200)",
                    borderTop: "1px solid var(--ds-gray-200)",
                    borderRadius: "0 0 12px 12px",
                  }}
                >
                  <Button type="submit" size="small">
                    Send
                  </Button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      <style>{`
        .feedback-inline-wrapper {
          display: inline-flex;
          flex-direction: column;
          border-radius: 30px;
          border: 1px solid var(--ds-gray-200);
          background: var(--ds-background-100);
          position: relative;
        }
        :is(.dark, [data-theme="dark"]) .feedback-inline-wrapper {
          border-color: var(--ds-gray-400);
        }
        .feedback-inline-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          height: 48px;
          padding: 0 8px 0 20px;
        }
        .feedback-inline-expanded {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          background: var(--ds-background-100);
          border: 1px solid var(--ds-gray-200);
          border-radius: 24px;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.02),
            0 4px 12px rgba(0, 0, 0, 0.08),
            0 16px 32px rgba(0, 0, 0, 0.08);
          z-index: 50;
          overflow: hidden;
          transform-origin: bottom center;
          animation: feedbackInlineExpandIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        :is(.dark, [data-theme="dark"]) .feedback-inline-expanded {
          border-color: var(--ds-gray-400);
        }
        @keyframes feedbackInlineExpandIn {
          from {
            opacity: 0;
            transform: translateX(-50%) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
        }
        .feedback-inline-wrapper .feedback-emoji {
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
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .feedback-inline-wrapper .feedback-emoji--selected {
          background: var(--ds-gray-200);
        }
        @media (hover: hover) {
          .feedback-inline-wrapper .feedback-emoji:hover {
            background: var(--ds-pink-300);
            color: var(--ds-pink-800);
          }
        }
        .feedback-inline-wrapper .feedback-textarea-wrapper {
          display: flex;
          width: 100%;
          border-radius: 6px;
          background: var(--ds-background-100);
          box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);
          transition: box-shadow 0.15s ease;
        }
        @media (hover: hover) {
          .feedback-inline-wrapper .feedback-textarea-wrapper:hover {
            box-shadow: 0 0 0 1px var(--ds-gray-alpha-500);
          }
        }
        .feedback-inline-wrapper .feedback-textarea-wrapper:focus-within {
          box-shadow: 0 0 0 1px var(--ds-gray-alpha-600), 0px 0px 0px 4px rgba(0, 0, 0, 0.16);
        }
        .feedback-inline-wrapper .feedback-textarea-wrapper textarea::placeholder {
          color: var(--ds-gray-700);
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// Chevron Down Icon (for select)
// ============================================================================

function ChevronDownIcon() {
  return (
    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: "currentcolor" }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Feedback with Select Types
// ============================================================================

export interface SelectOption {
  label: string;
  value: string;
}

export interface FeedbackWithSelectProps {
  /** Text shown on the trigger button (default: "Feedback") */
  buttonLabel?: string;
  /** Placeholder for the select (default: "Select a topic...") */
  selectPlaceholder?: string;
  /** Options for the select dropdown */
  options: SelectOption[];
  /** Label for the select (for accessibility) */
  selectLabel?: string;
  /** Callback when feedback is submitted */
  onSubmit?: (data: { emotion: string; feedback: string; topic: string }) => void;
  className?: string;
}

// ============================================================================
// Feedback with Select Component
// ============================================================================

export function FeedbackWithSelect({
  buttonLabel = "Feedback",
  selectPlaceholder = "Select a topic...",
  options,
  selectLabel = "Product topic selection",
  onSubmit,
  className,
}: FeedbackWithSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const direction = usePopoverDirection(isOpen, triggerRef);

  // Focus the select when popover opens
  useEffect(() => {
    if (isOpen && !submitted && selectRef.current) {
      selectRef.current.focus();
    }
  }, [isOpen, submitted]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedEmotion) {
        onSubmit?.({ emotion: selectedEmotion, feedback: feedbackText, topic: selectedTopic });
        setSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setTimeout(() => {
            setSubmitted(false);
            setSelectedEmotion(null);
            setFeedbackText("");
            setSelectedTopic("");
          }, 200);
        }, 1500);
      }
    },
    [selectedEmotion, feedbackText, selectedTopic, onSubmit],
  );

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <div className={className} style={{ position: "relative", display: "inline-block" }}>
      <Button
        ref={triggerRef}
        type="button"
        size="small"
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {buttonLabel}
      </Button>

      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          style={{
            position: "absolute",
            ...(direction === "below"
              ? { top: "calc(100% + 8px)" }
              : { bottom: "calc(100% + 8px)" }),
            left: "50%",
            transform: "translateX(-50%)",
            width: 340,
            borderRadius: 12,
            background: "var(--ds-background-100)",
            boxShadow:
              "rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 4px 8px -4px, rgba(0, 0, 0, 0.06) 0px 16px 24px -8px, var(--ds-gray-100) 0px 0px 0px 1px",
            overflow: "hidden",
            zIndex: 101,
            animation: "feedbackFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {submitted ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                fontSize: 14,
                lineHeight: "20px",
                color: "var(--ds-gray-900)",
              }}
            >
              Thank you for your feedback!
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  padding: 8,
                }}
              >
                {/* Select dropdown */}
                <label htmlFor="feedback-select">
                  <div className="feedback-select-wrapper">
                    <select
                      ref={selectRef}
                      id="feedback-select"
                      className="feedback-select"
                      aria-labelledby={selectLabel}
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                    >
                      <option disabled value="">{selectPlaceholder}</option>
                      {options.map((opt) => (
                        <option key={opt.value} label={opt.label} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="feedback-select-suffix">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </label>

                {/* Textarea */}
                <label>
                  <div className="feedback-textarea-wrapper">
                    <textarea
                      id="feedback-textarea"
                      placeholder="Your feedback..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      style={{
                        display: "flex",
                        width: "100%",
                        height: 100,
                        borderRadius: 6,
                        border: "none",
                        padding: "10px 12px",
                        fontSize: 14,
                        lineHeight: "normal",
                        color: "var(--ds-gray-1000)",
                        background: "var(--ds-background-100)",
                        resize: "none",
                        outline: "none",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        appearance: "none",
                      }}
                    />
                  </div>
                </label>

                {/* Markdown tip */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 4,
                    fontSize: 12,
                    lineHeight: "16px",
                    fontWeight: 400,
                    color: "var(--ds-gray-900)",
                  }}
                >
                  <MarkdownIcon />
                  <span>supported.</span>
                </div>
              </div>

              {/* Actions bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 12,
                  background: "var(--ds-background-200)",
                  borderTop: "1px solid var(--ds-gray-200)",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji.id}
                      type="button"
                      role="radio"
                      className={`feedback-emoji${selectedEmotion === emoji.id ? " feedback-emoji--selected" : ""}`}
                      aria-checked={selectedEmotion === emoji.id}
                      aria-label={`Select ${emoji.label} emoji`}
                      onClick={() =>
                        setSelectedEmotion(
                          selectedEmotion === emoji.id ? null : emoji.id,
                        )
                      }
                    >
                      {emoji.icon}
                    </button>
                  ))}
                </span>

                <Button type="submit" size="small">
                  Send
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      <style>{`
        .feedback-select-wrapper {
          position: relative;
          border-radius: 6px;
          box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);
          overflow: hidden;
          transition: box-shadow 0.15s ease;
        }
        @media (hover: hover) {
          .feedback-select-wrapper:hover {
            box-shadow: 0 0 0 1px var(--ds-gray-alpha-500);
          }
        }
        .feedback-select-wrapper:focus-within {
          box-shadow: 0 0 0 1px var(--ds-gray-alpha-600), 0px 0px 0px 4px rgba(0, 0, 0, 0.16);
        }
        .feedback-select {
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
        .feedback-select:invalid,
        .feedback-select option[value=""][disabled] {
          color: var(--ds-gray-700);
        }
        .feedback-select option {
          color: var(--ds-gray-1000);
        }
        .feedback-select-suffix {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          display: flex;
          align-items: center;
          color: var(--ds-gray-900);
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// Feedback (Popover) Component
// ============================================================================

export function Feedback({
  buttonLabel = "Feedback",
  onSubmit,
  metadata,
  className,
}: FeedbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const direction = usePopoverDirection(isOpen, triggerRef);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedEmotion) {
        onSubmit?.({ emotion: selectedEmotion, feedback: feedbackText, metadata });
        setSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          // Reset after close animation
          setTimeout(() => {
            setSubmitted(false);
            setSelectedEmotion(null);
            setFeedbackText("");
          }, 200);
        }, 1500);
      }
    },
    [selectedEmotion, feedbackText, onSubmit],
  );

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <div className={className} style={{ position: "relative", display: "inline-block" }}>
      {/* Trigger button */}
      <Button
        ref={triggerRef}
        type="button"
        size="small"
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {buttonLabel}
      </Button>

      {/* Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          style={{
            position: "absolute",
            ...(direction === "below"
              ? { top: "calc(100% + 8px)" }
              : { bottom: "calc(100% + 8px)" }),
            left: "50%",
            transform: "translateX(-50%)",
            width: 340,
            borderRadius: 12,
            background: "var(--ds-background-100)",
            boxShadow:
              "rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 4px 8px -4px, rgba(0, 0, 0, 0.06) 0px 16px 24px -8px, var(--ds-gray-100) 0px 0px 0px 1px",
            overflow: "hidden",
            zIndex: 101,
            animation: "feedbackFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {submitted ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                fontSize: 14,
                lineHeight: "20px",
                color: "var(--ds-gray-900)",
              }}
            >
              Thank you for your feedback!
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Form content area */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  padding: 8,
                }}
              >
                {/* Textarea */}
                <label>
                  <div className="feedback-textarea-wrapper">
                    <textarea
                      autoFocus
                      placeholder="Your feedback..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      style={{
                        display: "flex",
                        width: "100%",
                        height: 100,
                        borderRadius: 6,
                        border: "none",
                        padding: "10px 12px",
                        fontSize: 14,
                        lineHeight: "normal",
                        color: "var(--ds-gray-1000)",
                        background: "var(--ds-background-100)",
                        resize: "none",
                        outline: "none",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        appearance: "none",
                      }}
                    />
                  </div>
                </label>

                {/* Markdown tip */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 4,
                    fontSize: 12,
                    lineHeight: "16px",
                    fontWeight: 400,
                    color: "var(--ds-gray-900)",
                  }}
                >
                  <MarkdownIcon />
                  <span>supported.</span>
                </div>
              </div>

              {/* Actions bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 12,
                  background: "var(--ds-background-200)",
                  borderTop: "1px solid var(--ds-gray-200)",
                }}
              >
                  {/* Emoji buttons */}
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji.id}
                        type="button"
                        role="radio"
                        className={`feedback-emoji${selectedEmotion === emoji.id ? " feedback-emoji--selected" : ""}`}
                        aria-checked={selectedEmotion === emoji.id}
                        aria-label={`Select ${emoji.label} emoji`}
                        onClick={() =>
                          setSelectedEmotion(
                            selectedEmotion === emoji.id ? null : emoji.id,
                          )
                        }
                      >
                        {emoji.icon}
                      </button>
                    ))}
                  </span>

                  {/* Send button */}
                  <Button type="submit" size="small">
                    Send
                  </Button>
                </div>
            </form>
          )}
        </div>
      )}

      {/* Styles */}
      <style>{`
        .feedback-textarea-wrapper {
          border-radius: 6px;
          box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);
          overflow: hidden;
          transition: box-shadow 0.15s ease;
        }
        @media (hover: hover) {
          .feedback-textarea-wrapper:hover {
            box-shadow: 0 0 0 1px var(--ds-gray-alpha-500);
          }
        }
        .feedback-textarea-wrapper:focus-within {
          box-shadow: 0 0 0 1px var(--ds-gray-alpha-600), 0px 0px 0px 4px rgba(0, 0, 0, 0.16);
        }
        .feedback-textarea-wrapper textarea::placeholder {
          color: var(--ds-gray-700);
        }
        .feedback-emoji {
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
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .feedback-emoji--selected {
          background: var(--ds-gray-200);
        }
        @media (hover: hover) {
          .feedback-emoji:hover {
            background: var(--ds-pink-300);
            color: var(--ds-pink-800);
          }
        }
        @keyframes feedbackFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
