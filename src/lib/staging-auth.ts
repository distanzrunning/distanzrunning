// Shared staging auth helper. Runs in both Edge (middleware) and Node
// (API route) — uses the WebCrypto API only so the same code works
// everywhere without pulling in node:crypto.

export const STAGING_COOKIE = "staging-auth";
export const STAGING_COOKIE_MAX_AGE = 24 * 60 * 60; // 24 hours
export const STAGING_HOST = "distanzrunning.vercel.app";

const SIGNED_VALUE = "authenticated";

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message),
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Produce the signed cookie value `"authenticated.<hex-signature>"`. */
export async function signStagingCookie(secret: string): Promise<string> {
  const signature = await hmacSha256Hex(secret, SIGNED_VALUE);
  return `${SIGNED_VALUE}.${signature}`;
}

/** True iff the cookie is well-formed and its HMAC matches. */
export async function verifyStagingCookie(
  cookieValue: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!cookieValue) return false;
  const parts = cookieValue.split(".");
  if (parts.length !== 2) return false;
  const [value, signature] = parts;
  if (value !== SIGNED_VALUE) return false;
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = await hmacSha256Hex(secret, value);
  return constantTimeEqual(signature.toLowerCase(), expected);
}
