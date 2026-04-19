"use client";

import { useTransition } from "react";
import { deleteConsentRecordsByAnonId } from "./actions";

export default function DeleteIdButton({
  anonId,
  count,
}: {
  anonId: string;
  count: number;
}) {
  const [pending, start] = useTransition();

  const handleClick = () => {
    const confirmed = window.confirm(
      `Delete all ${count} consent record${count === 1 ? "" : "s"} for ID\n\n${anonId}\n\nThis cannot be undone.`,
    );
    if (!confirmed) return;
    start(async () => {
      const fd = new FormData();
      fd.set("anonId", anonId);
      await deleteConsentRecordsByAnonId(fd);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      style={{
        padding: "8px 12px",
        fontSize: 13,
        fontWeight: 500,
        borderRadius: 6,
        border: "1px solid var(--ds-red-900)",
        background: "var(--ds-red-900)",
        color: "#fff",
        cursor: pending ? "not-allowed" : "pointer",
        opacity: pending ? 0.7 : 1,
      }}
    >
      {pending ? "Deleting…" : `Delete ${count} record${count === 1 ? "" : "s"}`}
    </button>
  );
}
