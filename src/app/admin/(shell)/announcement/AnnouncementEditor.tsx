"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import {
  tokenize,
  ANNOUNCEMENT_COLORS,
  type AnnouncementColorKey,
  type AnnouncementConfig,
} from "@/lib/announcement";
import { saveAnnouncement } from "./actions";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="medium" loading={pending}>
      Save &amp; publish
    </Button>
  );
}

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-heading-14 text-textDefault">{children}</span>
);

export function AnnouncementEditor({ initial }: { initial: AnnouncementConfig }) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [text, setText] = useState(initial.text);
  const [serif, setSerif] = useState<Set<number>>(
    new Set(initial.serifWordIndices),
  );
  const [color, setColor] = useState<AnnouncementColorKey>(initial.color);
  const [linkHref, setLinkHref] = useState(initial.linkHref ?? "");

  const words = tokenize(text).filter((t) => t.isWord);

  const toggleWord = (i: number) =>
    setSerif((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <form action={saveAnnouncement} className="flex flex-col gap-8">
      {/* state carried to the server action */}
      <input type="hidden" name="enabled" value={String(enabled)} />
      <input type="hidden" name="text" value={text} />
      <input
        type="hidden"
        name="serifWordIndices"
        value={JSON.stringify([...serif])}
      />
      <input type="hidden" name="color" value={color} />
      <input type="hidden" name="linkHref" value={linkHref} />

      {/* Enabled */}
      <div className="flex items-center justify-between rounded-lg border border-borderDefault bg-surface p-4">
        <div className="flex flex-col gap-0.5">
          <FieldLabel>Show banner</FieldLabel>
          <span className="text-copy-13 text-textSubtle">
            When off, the banner is hidden across the whole site.
          </span>
        </div>
        <Toggle checked={enabled} onChange={setEnabled} />
      </div>

      {/* Message */}
      <Textarea
        label="Message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        minHeight={72}
        maxLength={300}
        placeholder="e.g. Subscribe to the Shakeout newsletter"
      />

      {/* Per-word font */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Fonts</FieldLabel>
        <span className="text-copy-13 text-textSubtle">
          Click a word to switch it to the serif (EB Garamond) face.
        </span>
        <div className="mt-1 flex flex-wrap gap-2">
          {words.length === 0 && (
            <span className="text-copy-14 text-textSubtler">
              Type a message above.
            </span>
          )}
          {words.map((w) => {
            const on = serif.has(w.wordIndex);
            return (
              <button
                type="button"
                key={w.wordIndex}
                onClick={() => toggleWord(w.wordIndex)}
                aria-pressed={on}
                className={`rounded-sm border px-2.5 py-1 text-copy-14 transition-colors ${
                  on
                    ? "border-textDefault bg-[var(--ds-gray-100)] text-textDefault"
                    : "border-borderDefault bg-surface text-textSubtle hover:bg-[var(--ds-gray-100)]"
                }`}
              >
                <span className={on ? "font-serif text-[16px] italic" : ""}>
                  {w.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Background colour */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Background</FieldLabel>
        <span className="text-copy-13 text-textSubtle">
          Text colour is set automatically for contrast (light &amp; dark).
        </span>
        <div className="mt-1 flex flex-wrap gap-2">
          {(
            Object.entries(ANNOUNCEMENT_COLORS) as [
              AnnouncementColorKey,
              (typeof ANNOUNCEMENT_COLORS)[AnnouncementColorKey],
            ][]
          ).map(([key, c]) => (
            <button
              type="button"
              key={key}
              onClick={() => setColor(key)}
              aria-pressed={color === key}
              className={`inline-flex items-center gap-2 rounded-sm border px-2.5 py-1.5 text-copy-14 transition-colors ${
                color === key
                  ? "border-textDefault text-textDefault"
                  : "border-borderDefault text-textSubtle hover:bg-[var(--ds-gray-100)]"
              }`}
            >
              <span
                className="h-4 w-4 rounded-full border border-borderSubtle"
                style={{ background: c.bg }}
              />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Link target */}
      <Input
        label="Link target"
        value={linkHref}
        onChange={(e) => setLinkHref(e.target.value)}
        placeholder="/races or https://…  — leave blank to open the newsletter signup"
      />

      {/* Live preview */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Preview</FieldLabel>
        <div className="border border-borderDefault">
          <AnnouncementBar
            text={text || "Your announcement…"}
            serifWordIndices={[...serif]}
            color={color}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SaveButton />
        <span className="text-copy-13 text-textSubtle">
          Publishes live across the site immediately.
        </span>
      </div>
    </form>
  );
}
