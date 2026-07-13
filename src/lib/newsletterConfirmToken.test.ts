import { describe, it, expect } from "vitest";
import crypto from "crypto";
import {
  createConfirmToken,
  verifyConfirmToken,
  CONFIRM_TOKEN_TTL_MS,
} from "./newsletterConfirmToken";

const SECRET = "test-secret-0123456789abcdef";
const EMAIL = "runner@example.com";

describe("createConfirmToken / verifyConfirmToken round-trip", () => {
  it("returns the email for a freshly created token", () => {
    const token = createConfirmToken(EMAIL, SECRET);
    expect(verifyConfirmToken(token, SECRET)).toBe(EMAIL);
  });

  it("normalises the email (trim + lowercase)", () => {
    const token = createConfirmToken("  Runner@Example.COM  ", SECRET);
    expect(verifyConfirmToken(token, SECRET)).toBe("runner@example.com");
  });

  it("produces a two-part dot-separated token", () => {
    const token = createConfirmToken(EMAIL, SECRET);
    expect(token.split(".")).toHaveLength(2);
  });
});

describe("verifyConfirmToken rejections", () => {
  it("rejects a tampered payload (signature no longer matches)", () => {
    const token = createConfirmToken(EMAIL, SECRET);
    const [, sig] = token.split(".");
    const forgedPayload = Buffer.from(
      JSON.stringify({ email: "attacker@evil.com", iat: Date.now() })
    ).toString("base64url");
    expect(verifyConfirmToken(`${forgedPayload}.${sig}`, SECRET)).toBeNull();
  });

  it("rejects a tampered signature", () => {
    const token = createConfirmToken(EMAIL, SECRET);
    const [payload, sig] = token.split(".");
    // Flip the first character of the signature (same length, wrong value).
    const flipped = (sig[0] === "A" ? "B" : "A") + sig.slice(1);
    expect(verifyConfirmToken(`${payload}.${flipped}`, SECRET)).toBeNull();
  });

  it("rejects a token signed with a different secret", () => {
    const token = createConfirmToken(EMAIL, "other-secret");
    expect(verifyConfirmToken(token, SECRET)).toBeNull();
  });

  it("rejects a token older than the 7-day TTL", () => {
    const eightDaysAgo = Date.now() - 8 * 86_400_000;
    const token = createConfirmToken(EMAIL, SECRET, eightDaysAgo);
    expect(verifyConfirmToken(token, SECRET)).toBeNull();
  });

  it("accepts a token just inside the TTL", () => {
    const now = Date.now();
    const justInside = now - (CONFIRM_TOKEN_TTL_MS - 60_000);
    const token = createConfirmToken(EMAIL, SECRET, justInside);
    expect(verifyConfirmToken(token, SECRET, now)).toBe(EMAIL);
  });

  it("rejects an iat in the future", () => {
    const token = createConfirmToken(EMAIL, SECRET, Date.now() + 60_000);
    expect(verifyConfirmToken(token, SECRET)).toBeNull();
  });

  it("rejects a payload without an iat", () => {
    const payload = Buffer.from(JSON.stringify({ email: EMAIL })).toString(
      "base64url"
    );
    // Sign correctly so only the missing iat causes rejection.
    const sig = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("base64url");
    expect(verifyConfirmToken(`${payload}.${sig}`, SECRET)).toBeNull();
  });

  it("rejects a correctly-signed payload without an email", () => {
    const payload = Buffer.from(
      JSON.stringify({ iat: Date.now() })
    ).toString("base64url");
    const sig = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("base64url");
    expect(verifyConfirmToken(`${payload}.${sig}`, SECRET)).toBeNull();
  });

  it("rejects a correctly-signed payload whose email fails the format check", () => {
    const payload = Buffer.from(
      JSON.stringify({ email: "not-an-email", iat: Date.now() })
    ).toString("base64url");
    const sig = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("base64url");
    expect(verifyConfirmToken(`${payload}.${sig}`, SECRET)).toBeNull();
  });

  it.each([
    ["empty string", ""],
    ["no dot", "justonepart"],
    ["three parts", "a.b.c"],
    ["non-base64 payload", "!!!not-base64!!!.signature"],
  ])("returns null (no throw) for malformed input: %s", (_label, input) => {
    expect(() => verifyConfirmToken(input, SECRET)).not.toThrow();
    expect(verifyConfirmToken(input, SECRET)).toBeNull();
  });

  it("returns null (no throw) for a signed non-JSON payload", () => {
    const payload = Buffer.from("not json at all").toString("base64url");
    const sig = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("base64url");
    const token = `${payload}.${sig}`;
    expect(() => verifyConfirmToken(token, SECRET)).not.toThrow();
    expect(verifyConfirmToken(token, SECRET)).toBeNull();
  });
});
