// src/components/ui/DestructiveActionModal.tsx
//
// Type-to-confirm modal for destructive actions: delete, revoke,
// disconnect, rotate, downgrade. Composes the canonical Modal
// surface — Modal.Header / Modal.Footer / etc. — and reuses the
// DS Note (error + fill) for the irreversibility band plus the DS
// Error component for the inline submit error.
//
// Note: no <form> wrapper. Modal.Footer is detected by Modal via
// React.Children, so it must be a direct child of <Modal>. Enter-
// to-submit lives on the input via onKeyDown instead.
//
// Behaviour:
//   - Input auto-focuses on open (via Modal's initialFocusRef).
//   - Confirm disabled until typed value === verificationPhrase.
//   - Enter inside the input fires onConfirm when the gate is open;
//     no-op otherwise.
//   - Cancel / Esc / outside-click dismiss (ignored while `loading`
//     so an in-flight API call isn't orphaned).
//   - Caller owns `open`. Don't self-dismiss from onConfirm; close
//     after the API call settles (or keep open on error so the
//     user can retry).

"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Error } from "@/components/ui/Error";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Note } from "@/components/ui/Note";

export interface DestructiveActionModalProps {
  /** Controlled open state. */
  open: boolean;
  /** Fires when the modal wants to close (Cancel / Esc / outside-click). */
  onOpenChange: (open: boolean) => void;
  /** Fires when the user submits a valid typed verification. */
  onConfirm: () => void;
  /** Title Case Verb + Noun statement — e.g. "Delete Project". */
  title: string;
  /** Sentence-case description naming the consequence. Bold the
   *  specific resource name where relevant. */
  description: ReactNode;
  /** Names the irreversible thing, ending with "cannot be undone."
   *  Omit the prop entirely for reversible actions — the absence is
   *  the signal, not a falsy value. */
  irreversibleDescription?: string;
  /** The exact string the user must type to unlock submit. */
  verificationPhrase: string;
  /** What the user is typing, e.g. "project name" — renders as part
   *  of the prompt: "To confirm, type the project name …". */
  verificationLabel?: string;
  /** Confirm button label. Must match the title 1:1 — "Delete Project". */
  confirmLabel: string;
  /** Disables both buttons and shows a spinner on the primary while
   *  the destructive API call is in flight. */
  loading?: boolean;
  /** Inline error rendered below the input. Modal stays open so the
   *  user can retry. Accepts a string or an Error. */
  error?: string | Error;
}

function errorText(error: string | Error | undefined): string | null {
  if (!error) return null;
  return typeof error === "string" ? error : error.message;
}

export function DestructiveActionModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  irreversibleDescription,
  verificationPhrase,
  verificationLabel,
  confirmLabel,
  loading,
  error,
}: DestructiveActionModalProps) {
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const ids = useId();
  const labelId = `${ids}-label`;
  const inputId = `${ids}-input`;

  // Reset the typed value every time the modal opens — stale text
  // from a previous attempt would re-enable submit instantly.
  useEffect(() => {
    if (open) setTyped("");
  }, [open]);

  const gateOpen =
    verificationPhrase.length > 0 && typed === verificationPhrase;

  const handleConfirm = () => {
    if (!gateOpen || loading) return;
    onConfirm();
  };

  const handleClose = () => {
    if (loading) return;
    onOpenChange(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleConfirm();
    }
  };

  const prompt = verificationLabel ? (
    <>
      To confirm, type the {verificationLabel}{" "}
      <strong
        className="font-semibold"
        style={{
          color: "var(--ds-gray-1000)",
          overflowWrap: "anywhere",
        }}
      >
        “{verificationPhrase}”
      </strong>
    </>
  ) : (
    <>
      To confirm, type{" "}
      <strong
        className="font-semibold"
        style={{
          color: "var(--ds-gray-1000)",
          overflowWrap: "anywhere",
        }}
      >
        “{verificationPhrase}”
      </strong>
    </>
  );

  const errMsg = errorText(error);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      initialFocusRef={inputRef}
      maxWidth={480}
    >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
        <Modal.P>{description}</Modal.P>
      </Modal.Header>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {irreversibleDescription && (
          <Note type="error" fill size="small">
            {irreversibleDescription}
          </Note>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label
            id={labelId}
            htmlFor={inputId}
            className="text-copy-14"
            style={{ color: "var(--ds-gray-1000)" }}
          >
            {prompt}
          </label>
          <Input
            id={inputId}
            ref={inputRef}
            type="text"
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            onKeyDown={handleKeyDown}
            aria-labelledby={labelId}
            aria-invalid={errMsg ? true : undefined}
            autoComplete="off"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            disabled={loading}
            translate="no"
          />
          {errMsg && (
            <div style={{ marginTop: 4 }}>
              <Error size="small" live="assertive">
                {errMsg}
              </Error>
            </div>
          )}
        </div>
      </div>

      <Modal.Footer>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 16,
          }}
        >
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="error"
            onClick={handleConfirm}
            disabled={!gateOpen || loading}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default DestructiveActionModal;
