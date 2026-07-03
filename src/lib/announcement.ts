import { unstable_cache } from "next/cache";

import { getSupabaseAdmin } from "./supabase/server";

// Announcement banner — admin-managed, site-wide promo bar.
// Content model: plain `text` + the set of word indices rendered in the serif
// (EB Garamond) face; a curated background colour key; an optional link target.
// Shared between the admin editor and the public banner so word-splitting and
// colours stay identical on both sides.

export const ANNOUNCEMENT_CACHE_TAG = "announcement-banner";

// Curated background palette. Foreground is derived from the background — the
// editor never picks it. Three flavours:
//   • theme-aware: Canvas / Ink use --color-* tokens that FLIP with light/dark.
//   • fixed:       White / Black are absolute — they stay put through the theme
//                  switch (intentional raw hex, not tokens).
//   • hues:        DS hue tokens (stable across themes) with a readable fg.
export const ANNOUNCEMENT_COLORS = {
  canvas: {
    label: "Canvas",
    bg: "hsl(var(--color-canvas))",
    fg: "hsl(var(--color-textDefault))",
  },
  ink: {
    label: "Ink",
    bg: "hsl(var(--color-textDefault))",
    fg: "hsl(var(--color-surface))",
  },
  white: { label: "White", bg: "#ffffff", fg: "#0a0a0a" },
  black: { label: "Black", bg: "#0a0a0a", fg: "#ffffff" },
  blue: { label: "Blue", bg: "var(--ds-blue-700)", fg: "#ffffff" },
  green: { label: "Green", bg: "var(--ds-green-700)", fg: "#ffffff" },
  amber: { label: "Amber", bg: "var(--ds-amber-800)", fg: "#0a0a0a" },
  red: { label: "Red", bg: "var(--ds-red-800)", fg: "#ffffff" },
  purple: { label: "Purple", bg: "var(--ds-purple-700)", fg: "#ffffff" },
} as const;

export type AnnouncementColorKey = keyof typeof ANNOUNCEMENT_COLORS;

export function isAnnouncementColor(x: unknown): x is AnnouncementColorKey {
  return typeof x === "string" && x in ANNOUNCEMENT_COLORS;
}

export interface AnnouncementConfig {
  enabled: boolean;
  text: string;
  /** Word indices (0-based, over the tokenized words) shown in the serif face. */
  serifWordIndices: number[];
  color: AnnouncementColorKey;
  /** Where the bar links to; null / empty = not clickable. */
  linkHref: string | null;
  /** Optional CTA button label; empty = no button. */
  buttonLabel: string;
  /** Button link; null/empty (with a label) = opens the newsletter modal. */
  buttonHref: string | null;
  /** ISO timestamp of the last save — used as the dismissal version so edits
   *  re-show the bar to users who dismissed a previous version. */
  updatedAt: string;
}

export interface WordToken {
  text: string;
  isWord: boolean;
  /** Position among words (whitespace tokens excluded); -1 for whitespace. */
  wordIndex: number;
}

/** Split text into word + whitespace tokens, tagging each word with its index.
 *  Used identically by the editor (to render per-word toggles) and the public
 *  banner (to apply the serif face), so indices always line up. */
export function tokenize(text: string): WordToken[] {
  let wordIndex = 0;
  return text
    .split(/(\s+)/)
    .filter((part) => part.length > 0)
    .map((part) => {
      const isWord = !/^\s+$/.test(part);
      const token: WordToken = {
        text: part,
        isWord,
        wordIndex: isWord ? wordIndex : -1,
      };
      if (isWord) wordIndex += 1;
      return token;
    });
}

/** Uncached read of the singleton row — used by the admin editor so it always
 *  edits the latest saved value. Returns null if unset/unavailable. */
export async function getAnnouncementFresh(): Promise<AnnouncementConfig | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("announcement_banner")
    .select(
      "enabled, text, serif_word_indices, color, link_href, button_label, button_href, updated_at",
    )
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("[announcement] read failed", error.message);
    return null;
  }
  if (!data) return null;

  return {
    enabled: Boolean(data.enabled),
    text: data.text ?? "",
    serifWordIndices: Array.isArray(data.serif_word_indices)
      ? data.serif_word_indices
      : [],
    color: isAnnouncementColor(data.color) ? data.color : "canvas",
    linkHref: data.link_href || null,
    buttonLabel: data.button_label ?? "",
    buttonHref: data.button_href || null,
    updatedAt: data.updated_at ?? "",
  };
}

/** Site-wide cached reader for the public banner. Cached across requests
 *  (revalidated on admin save via ANNOUNCEMENT_CACHE_TAG) so the banner isn't a
 *  per-request DB hit. */
export const getAnnouncement = unstable_cache(getAnnouncementFresh, [
  "announcement-banner",
], { revalidate: 60, tags: [ANNOUNCEMENT_CACHE_TAG] });
