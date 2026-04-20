"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteFeedbackRecord } from "./actions";

export default function DeleteFeedbackButton({
  id,
  snippet,
}: {
  id: number;
  snippet: string;
}) {
  const [pending, start] = useTransition();

  const handleClick = () => {
    const preview =
      snippet.length > 80 ? `${snippet.slice(0, 80).trim()}…` : snippet;
    const confirmed = window.confirm(
      `Delete this feedback?\n\n"${preview}"\n\nThis cannot be undone.`,
    );
    if (!confirmed) return;
    start(async () => {
      const fd = new FormData();
      fd.set("id", String(id));
      await deleteFeedbackRecord(fd);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={pending ? "Deleting feedback" : "Delete feedback"}
      title="Delete feedback"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 6,
        border: "1px solid var(--ds-gray-400)",
        background: "var(--ds-background-100)",
        color: pending ? "var(--ds-gray-700)" : "var(--ds-red-900)",
        cursor: pending ? "not-allowed" : "pointer",
        opacity: pending ? 0.6 : 1,
        transition: "background 0.15s ease, color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        if (pending) return;
        e.currentTarget.style.background = "var(--ds-red-100)";
      }}
      onMouseLeave={(e) => {
        if (pending) return;
        e.currentTarget.style.background = "var(--ds-background-100)";
      }}
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
