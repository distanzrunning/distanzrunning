"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
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
    <Button
      variant="error"
      size="small"
      onClick={handleClick}
      loading={pending}
      prefixIcon={<Trash2 className="w-4 h-4" />}
    >
      {pending
        ? "Deleting…"
        : `Delete ${count} record${count === 1 ? "" : "s"}`}
    </Button>
  );
}
