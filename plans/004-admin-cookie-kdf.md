# Plan 004: The admin auth cookie is a salted KDF hash, not a forgeable plain SHA-256

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 69691a11..HEAD -- src/lib/admin-auth.ts src/app/admin/login/actions.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `69691a11`, 2026-07-01

## Why this matters

The admin area is gated by a single shared password. The auth **cookie value**
is a plain `SHA-256("${password}:distanz-admin")` — a fast, unsalted (fixed
literal salt), single-round hash. Two consequences: (1) anyone who learns the
password can compute the exact cookie value and forge a session offline; (2) if
the cookie value itself leaks, the password is brute-forceable at billions of
guesses/second because there's no key-derivation cost factor. Swapping the hash
for a proper password KDF (`scrypt`, built into Node's `crypto`) with a
per-deployment secret removes the offline brute-force path and makes the cookie
non-trivial to forge. This matters before the site opens publicly / gains real
multi-user auth (per the project's auth roadmap).

## Current state

`src/lib/admin-auth.ts` (entire file):

```ts
import { createHash } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "distanz-admin";

function expectedCookieValue(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(`${password}:distanz-admin`).digest("hex");
}

export function adminCookieValueFor(password: string): string {
  return createHash("sha256").update(`${password}:distanz-admin`).digest("hex");
}

export function passwordIsValid(password: string): boolean {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured || !password) return false;
  if (password.length !== configured.length) return false;
  let diff = 0;
  for (let i = 0; i < password.length; i++) {
    diff |= password.charCodeAt(i) ^ configured.charCodeAt(i);
  }
  return diff === 0;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = expectedCookieValue();
  if (!expected) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return token === expected;
}
```

Callers (there are many auth-gated routes — do NOT change these; they only call
`isAdminAuthenticated()`, whose signature is unchanged):
- Login sets the cookie: `src/app/admin/login/actions.ts:20` —
  `cookieStore.set(ADMIN_COOKIE_NAME, adminCookieValueFor(password), { ... })`,
  and validates via `passwordIsValid(password)` at line 16.
- Gate checks (unchanged by this plan): `src/app/admin/(shell)/layout.tsx:17`,
  `admin/studio/layout.tsx:35`, plus `consent/actions.ts`, `feedback/actions.ts`,
  `settings/actions.ts`, `races/date-review/actions.ts`, and the two export
  `route.ts` files — all `if (!(await isAdminAuthenticated())) …`.

Key property to preserve: `passwordIsValid` already does a **length-guarded
constant-time compare** of the submitted password against `ADMIN_PASSWORD` — good,
keep it. Only the **cookie value derivation** (`expectedCookieValue` +
`adminCookieValueFor`) is being upgraded.

## Commands you will need

| Purpose   | Command                        | Expected on success |
|-----------|--------------------------------|---------------------|
| Install   | `npm install`                  | exit 0              |
| Typecheck | `npx tsc --noEmit`             | no new errors (see Plan 001 note) |
| Tests     | `npm test`                     | all pass, incl. new auth tests |
| Build     | `npm run build`                | exit 0              |

## Scope

**In scope**:
- `src/lib/admin-auth.ts` (upgrade the two hash functions; make the cookie
  compare constant-time)
- `src/lib/admin-auth.test.ts` (create — requires Plan 001's Vitest setup)
- `.env.example` (create or update — document the new `ADMIN_AUTH_SECRET` var
  name and `ADMIN_PASSWORD`, **placeholder values only, never a real secret**)

**Out of scope**:
- Every `isAdminAuthenticated()` caller — its signature and semantics don't
  change, so those files must not be touched.
- `passwordIsValid` — already constant-time; leave it.
- The cookie flags in `login/actions.ts` (`httpOnly`, `sameSite`, `secure`,
  `path`) — audited as correct; do not change them.
- Any real secret value — never write an actual password or key into any file.

## Suggested executor toolkit

- Use Node's built-in `crypto.scryptSync` and `crypto.timingSafeEqual` — no new
  dependency required. Do not add `bcrypt`/`argon2` (native build headaches on
  Vercel) unless `scrypt` proves insufficient.

## Git workflow

- Branch: `advisor/004-admin-cookie-kdf`
- Commit style: `security(admin): derive auth cookie via scrypt with a per-deploy secret`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Introduce a per-deployment secret

Add a new env var `ADMIN_AUTH_SECRET` (a random 32+ byte hex string, set in
Vercel + local `.env.local`, **not committed**). In `admin-auth.ts`, read it:
`const secret = process.env.ADMIN_AUTH_SECRET`. If it is missing, treat auth as
disabled (return `null` / `false`) exactly as the code already does when
`ADMIN_PASSWORD` is missing — never fall back to a hardcoded salt.

**Verify**: `npx tsc --noEmit` → no new errors.

### Step 2: Replace the hash with scrypt

Rewrite `adminCookieValueFor` and `expectedCookieValue` to derive the cookie
value with `scryptSync(password, secret, 32).toString("hex")` (the `secret` is
the salt/pepper from Step 1). Both the login-time derivation and the
verify-time derivation must use the **same** function so they produce equal
values for the same password. Example shape:

```ts
import { scryptSync, timingSafeEqual } from "crypto";

function deriveCookie(password: string, secret: string): string {
  return scryptSync(password, secret, 32).toString("hex");
}
```

**Verify**: a scratch check — same password + secret → identical hex twice;
different password → different hex. (You can assert this in Step 4's test rather
than a throwaway script.)

### Step 3: Constant-time cookie comparison

In `isAdminAuthenticated`, compare the presented cookie to the expected value
with `timingSafeEqual` over equal-length `Buffer`s (guard unequal length first,
as `timingSafeEqual` throws on length mismatch), instead of `token === expected`.

**Verify**: `npx tsc --noEmit` → no new errors; `npm run build` → exit 0.

### Step 4: Tests

Create `src/lib/admin-auth.test.ts` (uses Plan 001's Vitest). Set
`process.env.ADMIN_PASSWORD` and `process.env.ADMIN_AUTH_SECRET` in the test,
and assert:
- `adminCookieValueFor(pw)` is deterministic for a fixed (pw, secret)
- it differs when the secret differs (proves the secret is actually mixed in)
- it is **not** equal to the old `sha256(`${pw}:distanz-admin`)` value (proves
  the scheme changed)
- `passwordIsValid` still returns true for the exact password, false otherwise

Do not test `isAdminAuthenticated` end-to-end if it requires the `next/headers`
`cookies()` runtime — test the pure derivation helpers instead and note the
boundary.

**Verify**: `npm test` → all pass.

### Step 5: Document the env var

Add `ADMIN_AUTH_SECRET` (and existing `ADMIN_PASSWORD`) to `.env.example` with
**placeholder** values and a one-line comment. Note in your report that
`ADMIN_AUTH_SECRET` must be set in Vercel before deploy.

**Verify**: `.env.example` contains the var names, no real values.

## Test plan

- New: `src/lib/admin-auth.test.ts` — determinism, secret-sensitivity,
  scheme-changed, and `passwordIsValid` correctness (cases above).
- Verification: `npm test` → all pass.

## Done criteria

- [ ] `admin-auth.ts` uses `scryptSync` + a `ADMIN_AUTH_SECRET` env secret; no `createHash("sha256")` remains (`grep -n "sha256" src/lib/admin-auth.ts` → no output)
- [ ] Cookie comparison uses `timingSafeEqual`
- [ ] Missing `ADMIN_AUTH_SECRET` disables auth (fails closed), never uses a hardcoded salt
- [ ] `isAdminAuthenticated()` signature unchanged; no caller file modified
- [ ] `npm test` passes incl. new auth tests; `npm run build` exits 0
- [ ] `.env.example` documents the new var (placeholders only)
- [ ] Only in-scope files modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:
- `admin-auth.ts` doesn't match the "Current state" excerpt (drift).
- Any change would require editing an `isAdminAuthenticated()` caller — that
  means the signature drifted; STOP.
- `scryptSync` is too slow in the Vercel runtime for the login path (>~200ms) —
  report and consider tuning the cost params rather than switching libraries.
- You cannot set `ADMIN_AUTH_SECRET` in the deploy environment — flag that this
  plan requires the operator to add the env var **before** merge, or existing
  admin sessions will break (which is expected: everyone re-logs-in once).

## Maintenance notes

- **Deployment note**: shipping this invalidates all existing admin cookies —
  every admin re-authenticates once. Expected and acceptable; call it out in the
  PR description.
- `ADMIN_AUTH_SECRET` must exist in every environment (Vercel prod/preview +
  local) or admin auth fails closed.
- This hardens the *shared-password* gate; it does not add per-user identity or
  audit logging — that's the separate "access-control model" direction item.
- Reviewer should confirm auth **fails closed** when either env var is absent.
