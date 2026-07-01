# Plan 001: A test runner exists and the dashboard filter/rank logic is characterization-tested

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 69691a11..HEAD -- 'src/app/admin/(shell)/consent/data.ts' 'src/app/admin/(shell)/feedback/data.ts' package.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `69691a11`, 2026-07-01

## Why this matters

This repo has **no test runner and zero tests** — the only verification gates
are `next build`, `next lint`, and `tsc --noEmit`, none of which catch logic
errors. The admin dashboards rely on a set of **pure functions** that parse the
`?f=dim:val` URL filter params, decide whether a row matches the active
filters, and rank breakdown rows into leaderboard bars. A regression in any of
these (e.g. mishandling a colon inside a value, or a tie in the ranking) would
ship silently and break dashboard scoping. This plan installs a lightweight
test runner and pins the **current** behaviour of those functions with
characterization tests, so later changes (notably Plan 002, which refactors
these functions) can be made with confidence. It also gives CI something real
to run.

## Current state

- `package.json` — scripts are `dev`/`build`/`start`/`lint`/`reindex`. **No
  `test` script, no test runner in devDependencies.** Framework is Next.js
  15.5.7, React 18, TypeScript 5.
- `src/app/admin/(shell)/consent/data.ts` — exports the pure functions to test:
  - `parseFilters(raw: string | string[] | undefined): ConsentFilter[]` (lines 475–490)
  - `matchesFilters(row: EnrichedConsent, filters: ConsentFilter[]): boolean` (lines 494–499)
  - `rankBreakdowns(rows: EnrichedConsent[]): ConsentBreakdowns` (from line 503)
  - Supporting: `type ConsentDimKey` (314), `CONSENT_DIM_KEYS` (324),
    `isConsentDimKey` (347), `interface EnrichedConsent` (351, has a
    `dims: Record<ConsentDimKey, string | null>` field).
- `src/app/admin/(shell)/feedback/data.ts` — the parallel functions:
  - `parseFeedbackFilters(raw): FeedbackBreakdownFilter[]` (lines 57–72)
  - `matchesFeedbackFilters(row: FeedbackRowRaw, filters): boolean` (lines 76–83)
  - Supporting: `type FeedbackDimKey = "pages" | "topics"` (40),
    `FEEDBACK_DIM_KEYS` (42), `isFeedbackDimKey` (44),
    `interface FeedbackRowRaw` (13, has `page_path` and `topic` fields).

Exact current behaviour of `parseFilters` (this is what the tests must pin):

```ts
// consent/data.ts:475
export function parseFilters(raw: string | string[] | undefined): ConsentFilter[] {
  if (raw == null) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  const byDim = new Map<ConsentDimKey, string>();
  for (const entry of list) {
    const idx = entry.indexOf(":");
    if (idx < 1) continue;                       // no colon, or colon at pos 0 → skip
    const dim = entry.slice(0, idx);
    const val = entry.slice(idx + 1);            // everything after FIRST colon
    if (!isConsentDimKey(dim) || !val) continue; // unknown dim or empty val → skip
    byDim.set(dim, val);                          // one per dim; LATER entry wins
  }
  return [...byDim.entries()].map(([dim, val]) => ({ dim, val }));
}
```

`matchesFilters` returns `filters.every((f) => row.dims[f.dim] === f.val)`
(AND across dimensions; a row whose `dims[f.dim]` is `null` never matches).
`matchesFeedbackFilters` maps `pages → row.page_path`, `topics → row.topic`.

**Repo conventions**: TypeScript strict, ES modules, path alias `@/` → `src/`.
There is no existing test to model after — this plan establishes the pattern.
Use Vitest (fast, ESM-native, zero-config with the existing `tsconfig.json`).

## Commands you will need

| Purpose   | Command                        | Expected on success |
|-----------|--------------------------------|---------------------|
| Install   | `npm install`                  | exit 0              |
| Typecheck | `npx tsc --noEmit`             | **5 PRE-EXISTING errors** (see note) |
| Lint      | `npm run lint`                 | exit 0              |
| Tests     | `npm test`                     | all pass            |

> **Typecheck note**: `npx tsc --noEmit` currently reports **5 pre-existing
> errors** unrelated to this plan (in `src/app/races/calendar/*` ×3,
> `src/components/ContactForm.tsx`, `src/components/ui/CopyButton.tsx`). Those
> are addressed by Plan 003. For THIS plan, success = "no *new* tsc errors in
> the files you touch"; the 5 pre-existing errors must remain exactly 5.

## Scope

**In scope** (the only files you should create/modify):
- `package.json` (add `test` script + Vitest devDependencies)
- `vitest.config.ts` (create)
- `src/app/admin/(shell)/consent/data.test.ts` (create)
- `src/app/admin/(shell)/feedback/data.test.ts` (create)

**Out of scope** (do NOT touch):
- Any `data.ts` source — this plan only *characterizes* current behaviour, it
  does not change it. If a test reveals a bug, record it in your report and
  keep the test pinning the actual (buggy) behaviour; do not fix the source
  here.
- CI config — no `.github/workflows` exists; do not add one in this plan.
- Any component or page file.

## Git workflow

- Branch: `advisor/001-test-baseline`
- Commit style (match repo, e.g. `git log --oneline -5`): conventional-ish,
  lowercase scope prefix, e.g. `test(admin): add characterization tests for filter/rank logic`.
- Do NOT push or open a PR unless the operator instructs it.

## Steps

### Step 1: Install Vitest and add the test script

Run `npm install -D vitest@^2`. Then add to `package.json` scripts:
`"test": "vitest run"` and `"test:watch": "vitest"`.

**Verify**: `npm test` → exits 0 with "No test files found" (no tests yet) OR
create the config in Step 2 first. Confirm `vitest` appears in
`package.json` devDependencies.

### Step 2: Add `vitest.config.ts`

Create `vitest.config.ts` at repo root:

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

**Verify**: `npm test` → runs, reports 0 tests (or the tests from Step 3 if
already written).

### Step 3: Write `consent/data.test.ts`

Create `src/app/admin/(shell)/consent/data.test.ts`. Import the pure functions
from `./data`. Cover **at minimum** these cases for `parseFilters`:

- `undefined` input → `[]`
- `""` (empty string) → `[]`
- `"devices"` (no colon) → `[]`
- `":desktop"` (colon at position 0) → `[]`
- `"unknowndim:x"` (dim fails `isConsentDimKey`) → `[]`
- `"devices:"` (empty value) → `[]`
- `"devices:desktop"` → `[{ dim: "devices", val: "desktop" }]`
- `"geography:GB:extra"` (colon in value) → `[{ dim: "geography", val: "GB:extra" }]`
- Array `["devices:desktop", "geography:GB"]` → both filters present
- Array `["devices:desktop", "devices:mobile"]` (same dim twice) → **one**
  filter, `{ dim: "devices", val: "mobile" }` (later wins)

For `matchesFilters`: build a minimal `EnrichedConsent`-shaped object with a
`dims` record and assert AND semantics, including that a `null` bucket never
matches. For `rankBreakdowns`: feed a small fixed array and snapshot the
returned shape (use `expect(...).toMatchInlineSnapshot()`), plus an
empty-array case → assert it returns the empty breakdown shape without throwing.

**Verify**: `npm test` → all consent tests pass.

### Step 4: Write `feedback/data.test.ts`

Mirror Step 3 for `parseFeedbackFilters` (dims are `"pages"` / `"topics"`; test
a path value containing a colon, e.g. `"pages:/races/2026:preview"` →
`{ dim: "pages", val: "/races/2026:preview" }`) and `matchesFeedbackFilters`
(assert `pages` reads `row.page_path`, `topics` reads `row.topic`).

**Verify**: `npm test` → all tests pass; total count ≥ 20.

## Test plan

- New files: `consent/data.test.ts`, `feedback/data.test.ts`.
- Cases enumerated in Steps 3–4 (happy path, empty/malformed input,
  colon-in-value, duplicate-dim-last-wins, null bucket, ties in ranking).
- These are **characterization** tests: they lock current behaviour, they do
  not assert a desired-but-absent behaviour.
- Verification: `npm test` → all pass, ≥ 20 new tests.

## Done criteria

- [ ] `npm test` exits 0; ≥ 20 tests pass across the two new files
- [ ] `npx tsc --noEmit` still reports exactly the 5 pre-existing errors, none new
- [ ] `npm run lint` exits 0
- [ ] `vitest` is in `package.json` devDependencies and `npm test` is wired
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:
- The functions in `data.ts` don't match the "Current state" excerpts (drift).
- A characterization test reveals behaviour that looks like a real bug — pin
  the actual behaviour, note it in your report, and STOP before "fixing" it.
- `npx tsc --noEmit` reports more than 5 errors after your changes (you
  introduced a type error).
- Vitest can't resolve the `@/` alias or the `data.ts` imports pull in Next.js
  server-only modules that fail under the `node` test environment — report the
  import chain rather than stubbing half the module.

## Maintenance notes

- Plan 002 refactors `parseFilters`/`parseFeedbackFilters` into one shared
  generic. These tests are its safety net — they must stay green through that
  refactor, so keep them asserting behaviour via the public function names.
- When CI is later added, wire `npm test` in before `next build`.
- If `rankBreakdowns` output shape changes intentionally, update the inline
  snapshot in the same PR so the snapshot stays a record of intent.
