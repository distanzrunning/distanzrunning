// Client-side helper for posting feedback to /api/feedback. The UI
// components in @/components/ui/Feedback default to calling this when no
// custom onSubmit is provided.

export type FeedbackEmotion = "hate" | "not-great" | "okay" | "love";

export interface FeedbackPayload {
  /** One of the four emoji states — optional on the inline form. */
  emotion?: FeedbackEmotion;
  /** Free-form message. Required and trimmed; max 4000 chars. */
  feedback: string;
  /** Optional topic selection (FeedbackWithSelect). */
  topic?: string;
  /** Optional follow-up email. */
  email?: string;
  /** Path of the page where feedback was submitted. */
  pagePath?: string;
  /** Browser-scoped anonymous id. Defaults to the c15t consent subject id. */
  anonId?: string;
}

/**
 * Read the c15t subject id (sub_…) from the `c15t` consent cookie so feedback
 * links to the same subject as the user's consent record. Returns undefined if
 * the visitor hasn't interacted with consent yet (no subject exists).
 */
function readAnonId(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|;\s*)c15t=([^;]+)/);
  if (!match) return undefined;
  // Cookie value packs the subject id as `…,i.sid:sub_xxx,…`.
  const sid = decodeURIComponent(match[1]).match(/i\.sid:(sub_[A-Za-z0-9]+)/);
  return sid?.[1];
}

function readPagePath(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.location.pathname + window.location.search;
}

/**
 * POST feedback to /api/feedback. Fills in anonId and pagePath from the
 * current browser when not explicitly supplied. Returns true on 2xx.
 */
export async function submitFeedback(
  payload: FeedbackPayload,
): Promise<boolean> {
  const body = {
    ...payload,
    anonId: payload.anonId ?? readAnonId(),
    pagePath: payload.pagePath ?? readPagePath(),
  };
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}
