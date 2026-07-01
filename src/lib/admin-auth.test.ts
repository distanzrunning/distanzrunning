import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createHash } from "crypto";
import {
  adminCookieValueFor,
  passwordIsValid,
} from "./admin-auth";

// Verifies the scrypt-derived admin cookie: deterministic, secret-sensitive,
// and no longer the old forgeable plain-SHA256 value.

const PW = "correct-horse-battery-staple";
const SECRET = "a".repeat(64);

const OLD_SHA256 = createHash("sha256")
  .update(`${PW}:distanz-admin`)
  .digest("hex");

describe("adminCookieValueFor (scrypt)", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = PW;
    process.env.ADMIN_AUTH_SECRET = SECRET;
  });
  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_AUTH_SECRET;
  });

  it("is deterministic for a fixed (password, secret)", () => {
    expect(adminCookieValueFor(PW)).toBe(adminCookieValueFor(PW));
  });

  it("produces a 64-hex-char (32-byte) value", () => {
    expect(adminCookieValueFor(PW)).toMatch(/^[0-9a-f]{64}$/);
  });

  it("changes when the secret changes (secret is actually mixed in)", () => {
    const a = adminCookieValueFor(PW);
    process.env.ADMIN_AUTH_SECRET = "b".repeat(64);
    const b = adminCookieValueFor(PW);
    expect(a).not.toBe(b);
  });

  it("is NOT the old plain-SHA256 scheme", () => {
    expect(adminCookieValueFor(PW)).not.toBe(OLD_SHA256);
  });

  it("throws when ADMIN_AUTH_SECRET is missing (fails closed at login)", () => {
    delete process.env.ADMIN_AUTH_SECRET;
    expect(() => adminCookieValueFor(PW)).toThrow(/ADMIN_AUTH_SECRET/);
  });
});

describe("passwordIsValid", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = PW;
  });
  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
  });

  it("accepts the exact password", () => {
    expect(passwordIsValid(PW)).toBe(true);
  });

  it("rejects a wrong password", () => {
    expect(passwordIsValid("nope")).toBe(false);
  });

  it("rejects an empty password", () => {
    expect(passwordIsValid("")).toBe(false);
  });

  it("returns false when ADMIN_PASSWORD is unset", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(passwordIsValid(PW)).toBe(false);
  });
});
