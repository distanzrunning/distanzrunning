"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { DestructiveActionModal } from "@/components/ui/DestructiveActionModal";

import { deleteConsentRecordsByAnonId } from "./actions";

export default function DeleteIdButton({
  anonId,
  count,
}: {
  anonId: string;
  count: number;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pending, start] = useTransition();

  const handleConfirm = () => {
    setError(undefined);
    start(async () => {
      try {
        const fd = new FormData();
        fd.set("anonId", anonId);
        await deleteConsentRecordsByAnonId(fd);
        setOpen(false);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Couldn't delete the consent records. Try again.",
        );
      }
    });
  };

  const recordWord = count === 1 ? "record" : "records";

  return (
    <>
      <Button
        variant="error"
        size="small"
        onClick={() => setOpen(true)}
        prefixIcon={<Trash2 className="w-4 h-4" />}
      >
        Delete Record
      </Button>
      <DestructiveActionModal
        open={open}
        onOpenChange={(next) => {
          if (!next) setError(undefined);
          setOpen(next);
        }}
        onConfirm={handleConfirm}
        title="Delete Record"
        description={
          <>
            All {count} consent {recordWord} for{" "}
            <strong
              className="font-semibold font-mono"
              style={{ overflowWrap: "anywhere" }}
            >
              {anonId}
            </strong>{" "}
            will be permanently deleted.
          </>
        }
        irreversibleDescription={`Deleting these ${count} ${recordWord} cannot be undone.`}
        verificationPhrase={anonId}
        verificationLabel="anonymous ID"
        confirmLabel="Delete Record"
        loading={pending}
        error={error}
      />
    </>
  );
}
