"use client";

import { X } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import {
  tokenize,
  ANNOUNCEMENT_COLORS,
  type AnnouncementColorKey,
} from "@/lib/announcement";

// Pure presentational announcement bar — the single source of visual truth,
// shared by the public banner and the admin live preview so they match exactly.
// Background + foreground come from the curated (theme-aware) palette; serif
// words render in EB Garamond italic; an optional CTA button auto-contrasts by
// inverting the bar's colours. When a button is present the message is plain
// text and the button is the action; otherwise the whole line can link.

export interface AnnouncementBarProps {
  text: string;
  serifWordIndices: number[];
  color: AnnouncementColorKey;
  /** Render the whole line as a link (only used when there's no button). */
  href?: string;
  /** Otherwise, a whole-line onClick (e.g. open the newsletter modal). */
  onActivate?: () => void;
  onActivateHover?: () => void;
  /** Optional CTA button. */
  buttonLabel?: string;
  buttonHref?: string;
  onButtonActivate?: () => void;
  onButtonActivateHover?: () => void;
  /** Show a dismiss button wired to this handler. */
  onClose?: () => void;
}

export function AnnouncementBar({
  text,
  serifWordIndices,
  color,
  href,
  onActivate,
  onActivateHover,
  buttonLabel,
  buttonHref,
  onButtonActivate,
  onButtonActivateHover,
  onClose,
}: AnnouncementBarProps) {
  const palette = ANNOUNCEMENT_COLORS[color] ?? ANNOUNCEMENT_COLORS.canvas;
  const serif = new Set(serifWordIndices);
  const hasButton = Boolean(buttonLabel && buttonLabel.trim());

  // On the canvas (blends with the page) use the DS borderSubtle token so the
  // rule matches the rest of the chrome; on distinctly-coloured bars use a
  // subtle tint of the text colour instead (a flat gray line would clash).
  const borderColor =
    color === "canvas"
      ? "hsl(var(--color-borderSubtle))"
      : `color-mix(in srgb, ${palette.fg} 18%, transparent)`;

  const content = tokenize(text).map((token, i) =>
    token.isWord && serif.has(token.wordIndex) ? (
      <span
        key={i}
        className="font-serif text-[1.28em] italic underline-offset-[3px] hover:underline"
      >
        {token.text}
      </span>
    ) : (
      <span key={i}>{token.text}</span>
    ),
  );

  const lineClass = "block w-full px-12 py-2.5 text-center text-copy-14";

  // Auto-contrast: invert the bar's colours for the button. Give it an explicit
  // hover (custom-colour buttons otherwise fall back to the base colour with no
  // hover change) — nudge the fill toward the bar's background so it reads on
  // any palette, mirroring the default button's lighten-on-hover.
  const buttonHoverFill = `color-mix(in srgb, ${palette.fg} 86%, ${palette.bg})`;
  const buttonColors = {
    fg: palette.bg,
    bg: palette.fg,
    bgHover: buttonHoverFill,
    borderHover: buttonHoverFill,
  };

  const button = hasButton ? (
    buttonHref ? (
      <ButtonLink
        href={buttonHref}
        size="small"
        customColors={buttonColors}
        onMouseEnter={onButtonActivateHover}
        onFocus={onButtonActivateHover}
      >
        {buttonLabel}
      </ButtonLink>
    ) : (
      <Button
        size="small"
        customColors={buttonColors}
        onClick={onButtonActivate}
        onMouseEnter={onButtonActivateHover}
        onFocus={onButtonActivateHover}
      >
        {buttonLabel}
      </Button>
    )
  ) : null;

  // With a button: plain message + the button (the button is the action).
  // Without: the whole line is the link / trigger / static text.
  const line = hasButton ? (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-12 py-2 text-center text-copy-14">
      <span>{content}</span>
      {button}
    </div>
  ) : href ? (
    <a
      href={href}
      className={`${lineClass} no-underline`}
      style={{ color: palette.fg }}
      onMouseEnter={onActivateHover}
      onFocus={onActivateHover}
    >
      {content}
    </a>
  ) : onActivate ? (
    <button
      type="button"
      onClick={onActivate}
      onMouseEnter={onActivateHover}
      onFocus={onActivateHover}
      className={lineClass}
    >
      {content}
    </button>
  ) : (
    <div className={`${lineClass} cursor-default`}>{content}</div>
  );

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="relative w-full"
      style={{
        background: palette.bg,
        color: palette.fg,
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      {line}

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss announcement"
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
