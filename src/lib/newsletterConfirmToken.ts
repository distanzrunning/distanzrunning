import crypto from 'crypto'

// Stateless double-opt-in token for the newsletter confirmation link.
// The email travels INSIDE a signed, expiring token rather than as a
// separate query param backed by provider-side pending state — no
// contact exists anywhere until /api/confirm verifies the signature,
// so a re-subscribe can never mutate (or downgrade) an existing
// contact. Format: base64url(JSON{email, iat}) + "." + HMAC-SHA256.

/** Links stay valid for 7 days — long enough to dig the email out of
    a spam folder, short enough that a leaked link goes stale. */
export const CONFIRM_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

// Same format check the API routes apply to submitted addresses — a
// token that verifies must also carry an email the routes would accept.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sign(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url')
}

/**
 * Build a signed confirmation token for the given email. The email is
 * normalised (trimmed + lowercased) so the token, the send, and the
 * eventual Resend contact all agree on one canonical address.
 */
export function createConfirmToken(
  email: string,
  secret: string,
  now = Date.now()
): string {
  const normalised = email.trim().toLowerCase()
  const payload = Buffer.from(
    JSON.stringify({ email: normalised, iat: now })
  ).toString('base64url')
  return `${payload}.${sign(payload, secret)}`
}

/**
 * Verify a confirmation token. Returns the (normalised) email on
 * success, or null on ANY failure — bad shape, bad signature, expired,
 * future-dated, or an email that fails the shared format check. Never
 * throws: this runs on a public GET handler fed attacker-controlled
 * query strings.
 */
export function verifyConfirmToken(
  token: string,
  secret: string,
  now = Date.now()
): string | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const [payload, signature] = parts

    // Constant-time signature check. timingSafeEqual throws on length
    // mismatch, so guard lengths first (an early length reveal leaks
    // nothing — the expected length is public).
    const expected = Buffer.from(sign(payload, secret))
    const provided = Buffer.from(signature)
    if (expected.length !== provided.length) return null
    if (!crypto.timingSafeEqual(expected, provided)) return null

    const parsed: unknown = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    )
    if (typeof parsed !== 'object' || parsed === null) return null
    const { email, iat } = parsed as { email?: unknown; iat?: unknown }

    if (typeof iat !== 'number') return null
    if (iat > now) return null // future-dated — clock games or forgery
    if (now - iat > CONFIRM_TOKEN_TTL_MS) return null // expired

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) return null
    return email
  } catch {
    // Malformed base64 / JSON — treat exactly like a bad signature.
    return null
  }
}
