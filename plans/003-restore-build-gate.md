# Plan 003: `next build` fails on type and lint errors again

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 69691a11..HEAD -- next.config.ts src/app/races/calendar src/components/ContactForm.tsx src/components/ui/CopyButton.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `69691a11`, 2026-07-01

## Why this matters

`next.config.ts` sets **both** `typescript.ignoreBuildErrors: true` and
`eslint.ignoreDuringBuilds: true`. That means `next build` (what Vercel runs on
every deploy) will **not fail on type errors or lint errors** — the primary CI
gate for the whole project is effectively off. A contributor can ship a real
type error and the deploy still goes green. The backlog these flags were hiding
is small — **exactly 5 TypeScript errors** — so this is fixable now rather than
deferred. This plan fixes those 5 errors and turns the type gate back on. The
lint gate is handled cautiously (Step 4) because the size of the lint backlog is
unknown until measured.

## Current state

`next.config.ts:45-50`:

```ts
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
```

`npx tsc --noEmit` currently reports **5 errors** (measured at `69691a11`):

1. `src/app/races/calendar/page.tsx(5,15)` — `TS2614`: Module `"../page"` has
   no exported member `RaceGuide`. Uses a **named** import of a **default**
   export.
2. `src/app/races/calendar/RaceCalendarClient.tsx(9,15)` — same `TS2614` for `RaceGuide`.
3. `src/app/races/calendar/RaceEventPopup.tsx(6,15)` — same `TS2614` for `RaceGuide`.
4. `src/components/ContactForm.tsx(175,44)` — `TS2367`: a comparison between
   `'"error" | "idle"'` and `'"success"'` that "have no overlap" (a status-state
   value is being compared against a state it can never hold at that point).
5. `src/components/ui/CopyButton.tsx(61,18)` — `TS2430`: `interface
   CopyButtonProps` extends `Omit<ButtonHTMLAttributes<…>, "value" | "onClick">`
   but its `onCopy: (value: string) => void` clashes with the inherited
   `onCopy: ClipboardEventHandler`. The prop name `onCopy` collides with the
   native handler and must also be `Omit`ted.

Errors 1–3 share one root cause (fix `../page`'s export or the import site).
Errors 4 and 5 are independent, one file each.

## Commands you will need

| Purpose   | Command                        | Expected on success |
|-----------|--------------------------------|---------------------|
| Install   | `npm install`                  | exit 0              |
| Typecheck | `npx tsc --noEmit`             | **exit 0, 0 errors** (the goal) |
| Lint      | `npm run lint`                 | see Step 4          |
| Build     | `npm run build`                | exit 0              |

## Scope

**In scope**:
- `src/app/races/calendar/page.tsx`, `RaceCalendarClient.tsx`, `RaceEventPopup.tsx`
  (or the file that defines/exports `RaceGuide` — whichever fix is minimal, see Step 1)
- `src/components/ContactForm.tsx`
- `src/components/ui/CopyButton.tsx`
- `next.config.ts`

**Out of scope**:
- Any behavioural change. Every fix here is a **type-only** correction — do not
  alter runtime behaviour, rename props consumers rely on, or change component
  output. If a "fix" would change what a component renders or emits, STOP.
- Turning off the `eslint` flag is conditional — see Step 4; do not remove it
  blindly.

## Git workflow

- Branch: `advisor/003-restore-build-gate`
- Commit style: one commit per error cluster, e.g.
  `fix(types): RaceGuide is a default export`, then
  `chore(build): stop ignoring TypeScript errors in next build`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Fix the `RaceGuide` import errors (1–3)

Open `src/app/races/page.tsx` and check how `RaceGuide` is exported. If it's a
`export default` (the TS2614 hint says so), change the three importers from
`import { RaceGuide } from "../page"` to `import RaceGuide from "../page"`.
Prefer fixing the **three import sites** over changing the export, unless
`RaceGuide` is meant to be a shared named export (if other files already import
it as a named export, add `export` to its declaration instead). Pick the option
that makes `tsc` happy with the fewest touched files.

**Verify**: `npx tsc --noEmit 2>&1 | grep RaceGuide` → no output.

### Step 2: Fix `ContactForm.tsx:175` (error 4)

Read the surrounding code (~lines 150–185). The comparison is unreachable
because the state variable's type at that point excludes `"success"`. Correct
the **type** so the state union actually includes every value the code assigns
(likely the state setter is called with `"success"` elsewhere but the declared
type omits it, or the comparison is dead code). Fix the type to match reality;
do not delete a branch that runs at runtime.

**Verify**: `npx tsc --noEmit 2>&1 | grep ContactForm` → no output.

### Step 3: Fix `CopyButton.tsx:61` (error 5)

The custom `onCopy: (value: string) => void` collides with the native
`ClipboardEventHandler` inherited from `ButtonHTMLAttributes`. Add `"onCopy"` to
the existing `Omit<…, "value" | "onClick">` so it becomes
`Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onClick" | "onCopy">`.

**Verify**: `npx tsc --noEmit 2>&1 | grep CopyButton` → no output.

### Step 4: Turn the gates back on

First confirm all type errors are gone: `npx tsc --noEmit` → **exit 0**.
Then edit `next.config.ts`: **remove** `typescript.ignoreBuildErrors: true`
(delete the `typescript` block).

For ESLint: run `npm run lint` and count the errors. If it is **clean or only
warnings**, also remove the `eslint.ignoreDuringBuilds` block. If it reports
**hard errors**, do NOT remove that flag in this plan — instead leave it, and
add a code comment above it: `// TODO(advisor-003): N lint errors to clear before enabling — see plans/`
with the real N, and note the count in your report. Type-gate is the priority;
lint-gate can be a follow-up.

**Verify**: `npm run build` → exit 0 (now genuinely type-checked).

## Test plan

- No new unit tests (these are type + config fixes). The verification is the
  compiler: `npx tsc --noEmit` exits 0.
- If Plan 001 has landed, `npm test` must still pass (the fixes are type-only).

## Done criteria

- [ ] `npx tsc --noEmit` exits 0 with **0 errors**
- [ ] `next.config.ts` no longer contains `ignoreBuildErrors`
- [ ] `eslint.ignoreDuringBuilds` is removed **OR** annotated with the measured lint-error count and a TODO
- [ ] `npm run build` exits 0
- [ ] No runtime/behavioural change (`git diff` shows only type annotations, imports, and config)
- [ ] Only in-scope files modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:
- After Steps 1–3, `npx tsc --noEmit` still reports errors you can't fix with a
  type-only change (a fix would require altering runtime behaviour).
- The `RaceGuide` export turns out to be genuinely ambiguous (some files import
  it named, some default) — report both usages rather than guessing.
- Removing `ignoreBuildErrors` surfaces *new* errors not in the list of 5 (the
  codebase drifted) — report the new list and STOP.
- The lint backlog is large (say > 20 errors) — leave the eslint flag, annotate,
  and report; do not attempt a mass lint fix in this plan.

## Maintenance notes

- Once the type gate is on, every future PR is genuinely type-checked by
  `next build` on Vercel — the point of this plan. Keep it on.
- The deferred lint gate (if Step 4 left it) is a good candidate for a
  follow-up `improve` plan.
- Reviewer should confirm the diff is type-only: no JSX/output changes, no
  renamed public props.
