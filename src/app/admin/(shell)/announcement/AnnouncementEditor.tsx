"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Check } from "lucide-react";

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
  const [buttonLabel, setButtonLabel] = useState(initial.buttonLabel);
  const [buttonHref, setButtonHref] = useState(initial.buttonHref ?? "");

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
      <input type="hidden" name="buttonLabel" value={buttonLabel} />
      <input type="hidden" name="buttonHref" value={buttonHref} />

      {/* Visibility */}
      <div className="flex items-center justify-between gap-4 rounded-sm border border-borderDefault bg-surface p-4">
        <div className="flex flex-col gap-1">
          <FieldLabel>Show banner</FieldLabel>
          <span className="text-copy-13 text-textSubtle">
            {enabled
              ? "Live — showing at the top of every page on the site."
              : "Off — hidden across the entire site."}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 text-copy-14 font-medium ${
              enabled ? "text-textDefault" : "text-textSubtle"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                enabled ? "bg-[var(--ds-green-700)]" : "bg-[var(--ds-gray-500)]"
              }`}
            />
            {enabled ? "On" : "Off"}
          </span>
          <Toggle
            checked={enabled}
            onChange={setEnabled}
            size="large"
            aria-label="Show banner"
          />
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Message</FieldLabel>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          minHeight={72}
          maxLength={300}
          placeholder="e.g. Subscribe to the Shakeout newsletter"
          aria-label="Message"
        />
      </div>

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
          Text colour is picked automatically for contrast. Canvas &amp; Ink
          follow the theme; White &amp; Black stay fixed.
        </span>
        <div className="mt-2 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {(
            Object.entries(ANNOUNCEMENT_COLORS) as [
              AnnouncementColorKey,
              (typeof ANNOUNCEMENT_COLORS)[AnnouncementColorKey],
            ][]
          ).map(([key, c]) => {
            const selected = color === key;
            return (
              <button
                type="button"
                key={key}
                onClick={() => setColor(key)}
                aria-pressed={selected}
                title={c.label}
                className={`relative flex flex-col items-center gap-2 rounded-lg border p-2 transition-colors ${
                  selected
                    ? "border-textDefault"
                    : "border-borderDefault hover:bg-[var(--ds-gray-100)]"
                }`}
              >
                <span
                  className="flex h-12 w-full items-center justify-center rounded-sm border border-borderSubtle"
                  style={{ background: c.bg, color: c.fg }}
                >
                  <span className="text-[18px] leading-none">
                    A<span className="font-serif italic">a</span>
                  </span>
                </span>
                <span
                  className={`text-copy-13 ${
                    selected
                      ? "font-medium text-textDefault"
                      : "text-textSubtle"
                  }`}
                >
                  {c.label}
                </span>
                {selected && (
                  <span className="absolute right-1.5 top-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-textDefault">
                    <Check
                      className="h-3 w-3"
                      strokeWidth={3}
                      style={{ color: "hsl(var(--color-surface))" }}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Link target */}
      <Input
        label="Link target"
        value={linkHref}
        onChange={(e) => setLinkHref(e.target.value)}
        placeholder="/races or https://…  — leave blank to open the newsletter signup"
      />

      {/* Button */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Button</FieldLabel>
        <span className="text-copy-13 text-textSubtle">
          Optional call-to-action. Blank label = no button; blank link = opens
          the newsletter. (The button becomes the click target when set.)
        </span>
        <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            value={buttonLabel}
            onChange={(e) => setButtonLabel(e.target.value)}
            placeholder="Label — e.g. Subscribe"
            maxLength={60}
            aria-label="Button label"
          />
          <Input
            value={buttonHref}
            onChange={(e) => setButtonHref(e.target.value)}
            placeholder="Link — /signup or https://…"
            aria-label="Button link"
          />
        </div>
      </div>

      {/* Live preview */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Preview</FieldLabel>
        <div className="border border-borderDefault">
          <AnnouncementBar
            text={text || "Your announcement…"}
            serifWordIndices={[...serif]}
            color={color}
            buttonLabel={buttonLabel || undefined}
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
