"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { Fieldset } from "@/components/ui/Fieldset";
import { Select } from "@/components/ui/Select";

import { saveTimezone } from "./actions";

export function SettingsForm({
  initialTimezone,
  timeZones,
}: {
  initialTimezone: string;
  timeZones: string[];
}) {
  const [tz, setTz] = useState(initialTimezone);
  const [savedTz, setSavedTz] = useState(initialTimezone);
  const [isPending, startTransition] = useTransition();
  const isDirty = tz !== savedTz;

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await saveTimezone(formData);
          // Action revalidates the route, but the client's optimistic
          // "what's saved" needs to advance too so the Save button
          // returns to disabled.
          setSavedTz(tz);
        });
      }}
    >
      <Fieldset
        id="timezone"
        title="Website timezone"
        subtitle="Used to bucket admin analytics by local website day. Charts on the consent dashboard re-bucket on the next page load."
        status={
          <span>
            Currently <code className="inline-code">{savedTz}</code>
          </span>
        }
        action={
          <Button
            type="submit"
            size="small"
            disabled={!isDirty || isPending}
            loading={isPending}
          >
            Save
          </Button>
        }
      >
        <Select
          name="timezone"
          label="IANA timezone"
          value={tz}
          onChange={(e) => setTz(e.target.value)}
        >
          {timeZones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </Select>
      </Fieldset>
    </form>
  );
}
