"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import { DestructiveActionModal } from "@/components/ui/DestructiveActionModal";

import { deleteFeedbackRecord } from "./actions";

export default function DeleteFeedbackButton({
  id,
  snippet,
}: {
  id: number;
  snippet: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pending, start] = useTransition();

  const preview =
    snippet.length > 100 ? `${snippet.slice(0, 100).trim()}…` : snippet;

  const handleConfirm = () => {
    setError(undefined);
    start(async () => {
      try {
        const fd = new FormData();
        fd.set("id", String(id));
        await deleteFeedbackRecord(fd);
        setOpen(false);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Couldn't delete the feedback. Try again.",
        );
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Delete feedback"
        title="Delete feedback"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          borderRadius: 6,
          border: "1px solid rgb(var(--color-borderDefault))",
          background: "var(--ds-background-100)",
          color: "var(--ds-red-900)",
          cursor: "pointer",
          transition: "background 0.15s ease, color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--ds-red-100)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--ds-background-100)";
        }}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
      <DestructiveActionModal
        open={open}
        onOpenChange={(next) => {
          if (!next) setError(undefined);
          setOpen(next);
        }}
        onConfirm={handleConfirm}
        title="Delete Feedback"
        description={
          <>
            The feedback message{" "}
            <strong className="font-semibold">
              &ldquo;{preview}&rdquo;
            </strong>{" "}
            will be permanently deleted.
          </>
        }
        irreversibleDescription="Deleting this feedback cannot be undone."
        verificationPhrase="delete feedback"
        confirmLabel="Delete Feedback"
        loading={pending}
        error={error}
      />
    </>
  );
}
