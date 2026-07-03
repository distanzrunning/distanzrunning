"use client";

import { X } from "lucide-react";
import {
  tokenize,
  ANNOUNCEMENT_COLORS,
  type AnnouncementColorKey,
} from "@/lib/announcement";

// Pure presentational announcement bar — the single source of visual truth,
// shared by the public banner and the admin live preview so they match exactly.
// Background + foreground come from the curated (theme-aware) palette; serif
// words render in EB Garamond italic, a touch larger (serif reads small).

export interface AnnouncementBarProps {
  text: string;
  serifWordIndices: number[];
  color: AnnouncementColorKey;
  /** Render the line as a link to this href. */
  href?: string;
  /** Otherwise, an onClick action (e.g. open the newsletter modal). */
  onActivate?: () => void;
  /** Show a dismiss button wired to this handler. */
  onClose?: () => void;
  onActivateHover?: () => void;
}

export function AnnouncementBar({
  text,
  serifWordIndices,
  color,
  href,
  onActivate,
  onClose,
  onActivateHover,
}: AnnouncementBarProps) {
  const palette = ANNOUNCEMENT_COLORS[color] ?? ANNOUNCEMENT_COLORS.canvas;
  const serif = new Set(serifWordIndices);

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
      {href ? (
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
      )}

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
