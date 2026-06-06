# Geist verbatim migration — plan

The working plan for making the Distanz **Stride** design system match Vercel's
**Geist** verbatim. Living document — tick items as they land. Source of truth
for component order is `DesignSystemSidebar.tsx`.

---

## Goal

Every Stride token, component, and DS page renders **identically to Geist**,
except the deliberate divergences below. "Verbatim" means **identical rendered
output**, not byte-identical class strings.

### Deliberate divergences (keep these)
- **EB Garamond serif** — only two slots: article page titles and pull quotes.
  Everything else is sans (Geist/Inter).
- **Brand is black & white** — no pink/brand hue. Accents that need a colour use
  **blue** (`--ds-blue-700`). Status/semantic hues exist for success/warn/error.
- **Our own grid / page width** — `--grid-*` system (1200px), not Geist's 1400px
  app shell. (Why `--ds-page-width` / `-with-margin` are intentionally skipped.)
- **Tailwind v3 for now** — v4 is a deferred, separate phase (see Phase 3).

---

## Standing rules (decided, apply everywhere)

1. **Tokens are the single source of truth** (`--ds-*` / `--color-*`). Never
   hardcode a hex/rgba/px when a token exists. Recolour via the `-value` triplet
   then regenerate (`node scripts/convert-tokens.mjs --emit`).
2. **"Verbatim" = rendered output, not class strings.** Copy a Geist class only
   when it encodes something real (e.g. the `rotate-[0.000001deg]` border
   anti-alias fix). Keep ours when it's equal-or-better and less fragile
   (e.g. explicit transition lists, `group-hover` over `peer-hover`).
3. **No Props tables** on any DS page.
4. **No registry install buttons for now.** Each component page shows an
   atomic-**type badge** (Atom / Molecule / Organism) in its header instead,
   auto-rendered from the slug via `componentTypeBySlug` in `ContentWithTOC`.
   Re-enable the `npx` install buttons per component in Phase 4.
7. **Sidebar is one flat, alphabetical "Components" section** (atoms/molecules/
   organisms merged). Keep `DesignSystemSidebar.tsx`'s `components` list sorted
   by label; each item carries a `type` that feeds the page badge.
5. **Two axes, both required:** token/value parity *and* markup-structure parity.
   Same tokens ≠ verbatim component (cf. the Button chevron-gap, a structural,
   not token, divergence).
6. Build: `FEEDBACK_IP_SALT=dummy CONSENT_IP_SALT=dummy npm run build`.
   Commit + push to `staging`; `gh auth switch --user distanzrunning` first.

---

## Per-component workflow

For each component, in `DesignSystemSidebar.tsx` order:

1. Paste the Geist reference (HTML/CSS).
2. **Diff** the component markup + the DS page against Geist.
3. **Fix** to verbatim (tokens + structure). Add components Geist has that we lack.
4. **Drop the Props table** if still present.
5. **Plan B** — fold that component's `.ds-*` CSS in `globals.css` into inline
   Tailwind utilities on the component (leave only what *must* be CSS: keyframes,
   `:has()`, pseudo-elements, styled-jsx).
6. Build → commit → push to `staging`.

---

## Phases

### Phase 1 — Component-by-component verbatim audit + Plan B  *(in progress, v3)*
Walk the sidebar. Each component: verbatim diff → fix → drop Props → CSS→utilities
→ build → commit. This is the main loop.

### Phase 2 — Cross-cutting sweeps  *(after the per-component pass)*
- Props tables: confirm none remain on any DS page.
- Serif: confirm `font-serif` only on article titles + pull quotes.
- Hardcoded values: grep for stray hex/rgba/`bg-white`/`neutral-*`; replace with tokens.
- `.ds-*` residue: whatever component CSS couldn't migrate — confirm it's justified
  (keyframes / complex selectors), document why.

### Phase 3 — Tailwind v4 migration  *(deferred; own branch)*
Only after the component audit settles, so visual diffs aren't ambiguous.
- `@import "tailwindcss"` + CSS-first `@theme`; let `@theme` absorb
  `distanz-tokens.css` and kill the `tailwind.config.js` ↔ CSS duplication.
- Port the 43 `addUtilities` entries (`text-heading-*`, `text-copy-*`,
  `material-*`, the `text-sm`=12px override) to `@utility` directives.
- Run the v4 codemod, then a full visual-regression pass for the v4 renames
  (ring `3px→1px`, `shadow-sm→shadow-xs`, `outline-none→outline-hidden`, …).
- Merge only after the visual pass is clean.

### Phase 4 — Publish to the `@distanz` registry  *(ongoing, per component)*
As each component stabilises, publish `/r/<slug>.json` and re-enable its
`RegistryInstallButtons` header.

---

## Component checklist

Sidebar is now a single flat **Components** list (alphabetical); the Atom/
Molecule/Organism split below is kept only for *tracking* + the page badge.
**Footer** and **Page Frame** DS pages were removed (the underlying
`Footer.tsx` / `PageFrame.tsx` components stay). ✅ aligned · 🟡 touched · ☐ pending.

### Foundations / system
- ✅ Colours (two-layer HSL→OKLCH tokens)
- ✅ Typography (scale + serif limited to 2 slots)
- ✅ Materials (radii + shadows)
- ✅ Spacing (`--ds-space-*` verbatim) + grid
- ✅ Focus ring system (blue halo) + `--ds-focus-border`
- ✅ Motion tokens
- ☐ Icons (review)
- ✅ Resources group (Registry & MCP moved out of Foundations)

### Atoms
- ✅ Avatar · ✅ Badge · ✅ Button · ✅ Checkbox
- 🟡 Switch (earlier alignment — re-verify)
- ☐ Gauge · ☐ Input · ☐ Keyboard Input · ☐ Loading Dots · ☐ Material
- ☐ Number Ticker · ☐ Progress · ☐ Radio · ☐ Show More · ☐ Skeleton
- ☐ Spinner · ☐ Status Dot · ☐ Textarea · ☐ Toggle

### Molecules
- ✅ Banner *(new — added)*
- ☐ Accordion · ☐ Ad Slot · ☐ Article Card · ☐ Browser · ☐ Calendar
- ☐ Choicebox **(next)** · ☐ Code Block · ☐ Collapse · ☐ Collapsible Input
- ☐ Combobox · ☐ Context Card · ☐ Description · ☐ Empty State · ☐ Entity
- ☐ Error · ☐ Fieldset · ☐ Grid · ☐ Multi Select · ☐ Note · ☐ Pagination
- ☐ Panel Card · ☐ Phone · ☐ Race Card · ☐ Relative Time Card · ☐ Scroller
- ☐ Search · ☐ Select · ☐ Slider · ☐ Snippet · ☐ Split Button · ☐ Stat Tile
- ☐ Tabs · ☐ Theme Switcher · ☐ Tooltip · ☐ Trend Chart

### Organisms
- ☐ Command Menu · ☐ Consent Banner · ☐ Context Menu · ☐ Destructive Action Modal
- 🟡 Drawer (token refs updated) · 🟡 Feedback (focus-border dedup)
- ☐ Login · ☐ Menu · ☐ Modal · ☐ Newsletter Modal · ☐ Newsletter Signup
- ☐ Project Banner · ☐ Sheet · ☐ Site Header · ☐ Table · ☐ Toast
- ~~Footer~~, ~~Page Frame~~ — DS pages removed (components themselves stay)

### New components to add (Geist has, we lack) — add as encountered
- ✅ Banner · ☐ Book · …(log others as the audit surfaces them)

---

## Done — CSS structural cleanup (Plan A)
- Removed dead Kendo theme import + Material Symbols font (`@import` + `<link>`).
- Deduped Feedback focus rings → `--ds-focus-border`.
- Documented the `globals.css` cascade header.
- Backfilled missing tokens: `shadow-border-{small,medium,large}`,
  `--ds-focus-border`, `--ds-motion-*`.
