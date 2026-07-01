# Plan 002: The `?f=dim:val` filter parser + matcher exist once, shared by both dashboards

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 69691a11..HEAD -- 'src/app/admin/(shell)/consent/data.ts' 'src/app/admin/(shell)/feedback/data.ts'`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: MED
- **Depends on**: plans/001-test-baseline.md (its tests are this refactor's safety net)
- **Category**: tech-debt
- **Planned at**: commit `69691a11`, 2026-07-01

## Why this matters

The consent and feedback dashboards each define their own `?f=dim:val`
parser and matcher, and the two parsers are **byte-for-byte identical except
the generic type parameter**. Any fix to the filter-parsing rules (e.g.
percent-encoding colons in values) currently has to be made and tested twice,
and a future third dashboard would copy it a third time. Extracting one generic
`parseFilterParams` + `matchesFilterParam` removes the duplication and gives a
single place to test and evolve the logic.

## Current state

`src/app/admin/(shell)/consent/data.ts:475`:

```ts
export function parseFilters(raw: string | string[] | undefined): ConsentFilter[] {
  if (raw == null) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  const byDim = new Map<ConsentDimKey, string>();
  for (const entry of list) {
    const idx = entry.indexOf(":");
    if (idx < 1) continue;
    const dim = entry.slice(0, idx);
    const val = entry.slice(idx + 1);
    if (!isConsentDimKey(dim) || !val) continue;
    byDim.set(dim, val);
  }
  return [...byDim.entries()].map(([dim, val]) => ({ dim, val }));
}
```

`src/app/admin/(shell)/feedback/data.ts:57` is the same body with
`FeedbackDimKey` / `isFeedbackDimKey` / `FeedbackBreakdownFilter` substituted.

Supporting definitions (do not move these — the generic references them via
its type parameter, supplied by each caller):
- consent: `type ConsentDimKey` (data.ts:314), `isConsentDimKey(x: string | undefined): x is ConsentDimKey` (347), `interface ConsentFilter { dim: ConsentDimKey; val: string }`.
- feedback: `type FeedbackDimKey = "pages" | "topics"` (data.ts:40), `isFeedbackDimKey(x): x is FeedbackDimKey` (44), `interface FeedbackBreakdownFilter { dim: FeedbackDimKey; val: string }`.

The matchers differ in HOW they read a row and MUST stay callable the same way:
- consent `matchesFilters(row, filters)` → `filters.every((f) => row.dims[f.dim] === f.val)`
- feedback `matchesFeedbackFilters(row, filters)` → `pages` reads `row.page_path`, `topics` reads `row.topic`

Because the matchers read different row shapes, **only the parser is trivially
shared**. The matcher can be shared as a higher-order helper but that is
optional — see Step 3.

**Convention**: shared admin utilities live in `src/components/admin/` (e.g.
`FilterBar.tsx`, `CopyPathButton.tsx`) and `src/lib/` for non-React helpers.
Put the new pure helper in `src/lib/` since it has no React dependency.

## Commands you will need

| Purpose   | Command                        | Expected on success |
|-----------|--------------------------------|---------------------|
| Install   | `npm install`                  | exit 0              |
| Typecheck | `npx tsc --noEmit`             | 5 pre-existing errors, none new (see Plan 001 note) |
| Tests     | `npm test`                     | all pass (incl. Plan 001's) |
| Lint      | `npm run lint`                 | exit 0              |

## Scope

**In scope**:
- `src/lib/filterParams.ts` (create — the generic parser)
- `src/app/admin/(shell)/consent/data.ts` (replace `parseFilters` body with a call to the generic)
- `src/app/admin/(shell)/feedback/data.ts` (replace `parseFeedbackFilters` body with a call to the generic)
- `src/lib/filterParams.test.ts` (create — test the generic directly)

**Out of scope**:
- The **public signatures** `parseFilters` / `parseFeedbackFilters` — keep them
  exported with identical names and return types; callers in the dashboards
  import them by name. This is an internal refactor only.
- The matchers, unless you do the optional Step 3 — and even then, keep
  `matchesFilters` / `matchesFeedbackFilters` exported by name.
- The `ConsentDimKey` / `FeedbackDimKey` types and validators — do not move them.

## Git workflow

- Branch: `advisor/002-dedupe-filter-parser`
- Commit style: `refactor(admin): extract shared ?f= filter parser`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Create the generic parser

Create `src/lib/filterParams.ts`:

```ts
/** One active filter: a validated dimension key + its selected value. */
export interface FilterParam<K extends string> {
  dim: K;
  val: string;
}

/**
 * Parse repeated `?f=dim:val` params into validated filters — one per
 * dimension (later entry wins). Splits on the FIRST ":" (dim keys never
 * contain one; values may). `isDimKey` is the per-dashboard allowlist guard.
 */
export function parseFilterParams<K extends string>(
  raw: string | string[] | undefined,
  isDimKey: (x: string | undefined) => x is K,
): FilterParam<K>[] {
  if (raw == null) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  const byDim = new Map<K, string>();
  for (const entry of list) {
    const idx = entry.indexOf(":");
    if (idx < 1) continue;
    const dim = entry.slice(0, idx);
    const val = entry.slice(idx + 1);
    if (!isDimKey(dim) || !val) continue;
    byDim.set(dim, val);
  }
  return [...byDim.entries()].map(([dim, val]) => ({ dim, val }));
}
```

**Verify**: `npx tsc --noEmit` → no new errors in `filterParams.ts`.

### Step 2: Rewire both dashboards to the generic

In `consent/data.ts`, replace the `parseFilters` body so it delegates, keeping
the exported name and `ConsentFilter[]` return type:

```ts
import { parseFilterParams } from "@/lib/filterParams";
// ...
export function parseFilters(raw: string | string[] | undefined): ConsentFilter[] {
  return parseFilterParams(raw, isConsentDimKey);
}
```

Do the same in `feedback/data.ts` for `parseFeedbackFilters` with
`isFeedbackDimKey`. If `ConsentFilter` / `FeedbackBreakdownFilter` are
structurally `{ dim: K; val: string }`, the generic's `FilterParam<K>` is
assignable; if TS complains, alias them: `export type ConsentFilter = FilterParam<ConsentDimKey>`.

**Verify**: `npx tsc --noEmit` → still exactly 5 pre-existing errors, none new.
`npm test` → **Plan 001's parser tests still pass unchanged** (this is the
whole point — behaviour is identical).

### Step 3 (OPTIONAL — only if it stays clean): share the matcher

Only attempt if it does not force a cast. Add to `filterParams.ts`:

```ts
export function matchesFilterParams<Row, K extends string>(
  row: Row,
  filters: FilterParam<K>[],
  read: (row: Row, dim: K) => string | null,
): boolean {
  return filters.every((f) => read(row, f.dim) === f.val);
}
```

Then `matchesFilters` passes `(row, dim) => row.dims[dim]` and
`matchesFeedbackFilters` passes `(row, dim) => dim === "pages" ? row.page_path : row.topic`.
If this needs an `as` cast or fights the types, **skip Step 3** and leave the
matchers as-is — the parser dedup is the main win.

**Verify**: `npm test` → matcher tests from Plan 001 still pass.

### Step 4: Test the generic directly

Create `src/lib/filterParams.test.ts` porting Plan 001's `parseFilters` cases to
call `parseFilterParams` with a small local `isDimKey` (e.g. keys `["a","b"]`).
Keep Plan 001's dashboard-level tests too — they now prove the wiring.

**Verify**: `npm test` → all pass, including the new generic tests.

## Test plan

- New: `src/lib/filterParams.test.ts` — the same edge cases as Plan 001
  (undefined, empty, no-colon, colon-in-value, duplicate-dim-last-wins,
  unknown-dim), asserted against the generic with a synthetic validator.
- Existing Plan 001 tests are the regression guard — they must pass **without
  modification**.
- Verification: `npm test` → all green.

## Done criteria

- [ ] `src/lib/filterParams.ts` exists and both dashboards delegate to it
- [ ] `parseFilters` and `parseFeedbackFilters` remain exported with unchanged signatures
- [ ] `grep -n "new Map<ConsentDimKey\|new Map<FeedbackDimKey" src/app/admin` returns **no** matches (the duplicated bodies are gone)
- [ ] `npm test` exits 0; Plan 001's tests pass unmodified
- [ ] `npx tsc --noEmit` reports exactly the 5 pre-existing errors, none new
- [ ] `npm run lint` exits 0
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:
- Plan 001 is not yet DONE (its tests are the safety net — do not refactor blind).
- The `data.ts` parser bodies don't match the "Current state" excerpts (drift).
- Delegating forces a type cast on the parser (Step 2) — report the exact TS
  error; do not paper over it with `as`.
- Any Plan 001 test would need editing to pass — that means behaviour changed,
  which this refactor must NOT do. Stop.

## Maintenance notes

- Future filter-syntax changes (e.g. URL-encoding colons) now happen once in
  `filterParams.ts` + its test — that is the payoff; keep it that way.
- A third dashboard should call `parseFilterParams` with its own dim-key guard,
  not copy the loop.
- Reviewer should confirm the diff is behaviour-preserving: the public function
  names/signatures are unchanged and no test was edited to pass.
