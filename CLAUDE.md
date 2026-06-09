# Distanz Running — project context

This file is auto-loaded into every Claude session for this repo. It captures the **Stride** design-system rules so design decisions stay consistent.

When adding/changing UI, **read the relevant DS page first** rather than inventing patterns. DS pages live at:

```
src/app/admin/(shell)/design-system/components/content/
```

Visit a deployed copy at `/admin/design-system/<slug>` (e.g. `/admin/design-system/typography`). Sidebar entries: see `DesignSystemSidebar.tsx`.

---

## Design principles (from DesignPrinciples.tsx)

1. **Less is more** — concise, unburdened by decoration. Iterate and reduce.
2. **Deliberate typography** — strong type, contrast via weights/letterforms, no arbitrary styles.
3. **Visual harmony** — symmetry, proximity, restrained palette, purposeful imagery.
4. **Clear wayfinding** — clear visual affordances; functions should be obvious.
5. **Performance and precision** — accuracy in data display, every element serves a purpose.
6. **Recognisable consistency** — same standard across all touchpoints.

## UX principles (from UXPrinciples.tsx)

User-centred, accessible to all, progressive disclosure, feedback and response, consistency and familiarity, respect time and attention.

---

## Typography

Two typefaces, two roles. **Don't mix them up.**

| Family | Token | Tailwind | Use for |
|---|---|---|---|
| EB Garamond | `--font-family-serif` | `font-serif` | **Editorial only — exactly two uses**: article page titles and pull quotes. Nothing else (not featured headlines, subheadings, blockquotes, or any UI). |
| Inter / Geist | `--font-family-sans` | `font-sans` | **UI**: section titles, card headings, navigation, body text |

The `text-heading-*` classes (defined in `tailwind.config.js`) carry size + line-height + letter-spacing + weight. They **don't set a font-family** — that's done separately. Default inheritance is Geist Sans, so omitting `font-serif` gives you UI styling.

**UI heading scale** (font-sans inferred):

| Class | Size / lh | Use for |
|---|---|---|
| `text-heading-32` | 32 / 40 / -0.02em / 600 | Page section titles |
| `text-heading-24` | 24 / 32 / -0.015em / 600 | Card titles, section headers |
| `text-heading-20` | 20 / 28 / -0.01em / 600 | Breaking news headings, subsections |
| `text-heading-16` | 16 / 24 / -0.01em / 600 | Small card titles, sidebar headers |
| `text-heading-14` | 14 / 20 / -0.006em / 600 | Mini headers, metadata labels |

**Editorial serif scale** — `font-serif` pairs with **only these two** slots; everything else (incl. featured headlines, subheadings, blockquotes) stays sans:

| Class | Size / lh | Use for |
|---|---|---|
| `text-heading-40 font-serif` | 40 / 48 | Article page titles |
| `text-heading-32 font-serif` | 32 / 40 | Pull quotes |

The typography classes deliberately carry **no `font-family`** (they inherit Geist Sans) — unlike Geist, which hardcodes `font-sans` on each. That omission is intentional: it's what lets `font-serif` cleanly override these two editorial slots. Hardcoding `font-sans` would make the heading class win the cascade over `font-serif` (our `addUtilities` classes are emitted *after* `font-serif`), forcing `!font-serif` everywhere. The bleed Geist guards against (a heading inheriting serif) can't occur here — headings are never nested inside the serif elements.

**Anti-patterns to avoid**:
- Don't use `font-serif` for UI section titles. The DS Typography page explicitly forbids this.
- Don't write magic `clamp()` font sizes inline when `text-heading-*` covers the slot.
- Don't use `font-headline` (legacy alias) — use the `text-heading-*` scale and let Geist inherit.

---

## Color

Token namespace: `--ds-{hue}-{shade}`.

**Hues**: `gray`, `blue`, `red`, `amber`, `green`, `pink`, `purple`, `teal`. Shades 100–1000 (in steps of 100).

**Backgrounds** (separate from the hue scale, values are **Geist-verbatim**): `--ds-background-100` (the dominant surface — `#FFFFFF` light / `#0A0A0A` dark) / `--ds-background-200` (the page/recessed tone — `#FAFAFA` light / `#000000` dark). Note the Geist convention: **bg-100 is brighter than bg-200 in *both* themes** (raised things sit on bg-100, the page sits on bg-200), so in dark mode bg-200 (`#000`) is *darker* than bg-100 (`#0A0A0A`) — not a lighter "elevated" lift.

**Surfaces — TWO roles, one rule. This is the whole system; there are no other surface tokens and no per-component exceptions.**

| Role | Class | Light | Dark | Use for |
|---|---|---|---|---|
| **Canvas** (down) | `bg-canvas` (= `bg-200`) | `#FAFAFA` | `#000000` | the page / `PageFrame` / app-shell wrappers, **and** recessed sub-areas *within* a surface: modal & drawer footers/sections |
| **Surface** (up) | `bg-surface` (= `bg-100`) | `#FFFFFF` | `#0A0A0A` | **everything raised, including all form controls**: cards, menus, popovers, dialogs, drawers, sheets, panels, toasts, badges, chips, filled/secondary buttons, **inputs, textareas, selects, date pickers**, checkbox/radio/switch boxes, the header pill |
| **Interaction** (on a surface) | `--ds-gray-100/200/300` (`bg-[var(--ds-gray-100)]` …) | `#F2F2F2 / #EBEBEB / #E6E6E6` | `#1A1A1A / #1F1F1F / #292929` | **hover / active / selected** states *on* a surface — one+ step above it so they read |

**The rule:** *Is it the page/shell, or a footer/section inside a surface? → `bg-canvas`. Otherwise (cards, menus, **and every control** — inputs, buttons, selects…) → `bg-surface`.* Controls are `surface` + a hairline border, so they sit flush-with-border inside a panel and lift off the page in a filter bar — and a filter row of inputs + dropdowns + buttons all share one tone. Floating things (menus/modals/popovers) add a `material-*` shadow — **extra depth = shadow, never more tones.**

**Elevation = border + shadow, not a lighter fill (Geist model).** `surface` *is* `bg-100`, so a raised card/menu is the same tone as other surfaces — it reads as raised via its hairline border and (when floating) a `material-*` shadow, the way Geist does it. The **hover/active/selected** tones `gray-100/200/300` are always one+ step *above* `surface` so a child state doesn't collapse into it (the ThemeSwitcher bug): light `#F2F2F2/#EBEBEB/#E6E6E6` (darker than white surface), dark `#1A1A1A/#1F1F1F/#292929` (lighter than the `#0A0A0A` surface). **Segmented controls** — two models, don't unify them. `Switch` follows Geist verbatim: a raised `bg-surface` (bg-100) container + `gray-alpha-400` hairline ring, with the **selected** segment a `gray-100` pill (text `gray-1000`; unselected `gray-900`, hover `gray-1000`). `ThemeSwitcher` **deliberately diverges** — a recessed `surfaceSubtle`/`bg-canvas` track with the selected thumb defined by fill alone (no ring). The divergence is intentional.

**Hard anti-pattern: never use `bg-[var(--ds-background-100)]` or `bg-[var(--ds-background-200)]` (or their inline/CSS forms) as a fill.** Those raw tokens only *feed* `canvas`/`surface` internally. Components always use `bg-canvas` / `bg-surface` — that's what guarantees conformity (no component "does its own thing"). Don't reach for `bg-white`/`bg-black`/`neutral-*` either. (The only legitimate non-token fills are deliberate translucent **glass** effects, e.g. `bg-white/15` + blur.)

**Alpha tokens**: `--ds-gray-alpha-{100..1000}` for translucent overlays.

**Token architecture (Geist two-layer model).** Each colour has a single source of truth — a `--ds-{hue}-{shade}-value` **HSL channel triplet** (e.g. `--ds-blue-700-value: 213, 100%, 48%;`, grays `0, 0%, 94%`). Only these triplets flip between themes (light in `:root,.light`, dark in `.dark`). The opaque token is resolved **once** in a shared block — `--ds-blue-700: hsl(var(--ds-blue-700-value))` — and never redeclared per theme. A `@media (color-gamut: p3) @supports (oklch)` block then overrides the resolved hue tokens with their exact **OKLCH**. **Both layers are copied verbatim from Geist and are independently authored — the HSL triplet is *not* a gamut-map of the OKLCH.** Geist's sRGB fallback is deliberately softer than the vivid P3 colour: e.g. `red-900` light ships `358, 66%, 48%` in sRGB and `oklch(54.99% .232 25.29)` on P3 — gamut-mapping that OKLCH would instead yield a harsher `351, 100%, 42%`, which is *not* what Geist uses. So treat the two layers as two source-of-truth values, both taken from Geist, never one derived from the other. Neutrals (gray/bg) carry no OKLCH layer — they're identical in both gamuts. This is Geist's exact structure (HSL base + OKLCH-P3).

**There is no `-rgb` companion any more** (removed in the Geist-structure migration — the old hand-maintained `-rgb` tuples had drifted from the OKLCH values). For a theme-aware translucent colour use the `-value` triplet directly via **`hsla()`**: `hsla(var(--ds-gray-1000-value), 0.04)` (the triplet flips with the theme automatically). The semantic `--color-*` layer also holds HSL triplets and is consumed as **`hsl(var(--color-X))` / `hsla(var(--color-X), N)`** (Tailwind exposes them this way too) — never `rgb()`. **To recolour a token, set *both* layers from Geist** — the `-value` HSL triplet (sRGB fallback) **and** the matching OKLCH override (P3). They're independent values, so editing one without the other leaves the layers out of step (sRGB displays would see one colour, P3 displays another). `node scripts/convert-tokens.mjs` is a **same-hue sanity guard** (CI-friendly, exits 1) — it confirms the two layers share a hue, catching a wrong-colour paste; it does **not** regenerate one layer from the other (Geist's sRGB isn't a gamut-map of its OKLCH).

**Accessibility**: `textSubtle` (`gray-900`) is the readable secondary-text colour (Geist-verbatim `gray-900` is 30% L light / 63% L dark → ~7.8:1 light, ~6:1 dark — passes AA; note this is lower than the previously-tuned 20% L, a candidate tweak if you want AAA-grade secondary text). `textSubtler` (`gray-700`) is the **muted** tone for de-emphasised micro-text (line numbers, captions, tiny labels) — AA-Large in light, full AA in dark; still reserve it for non-essential text, prefer `textSubtle` for content. `textDisabled` (`gray-500`) is for disabled states only. An **increased-contrast mode** (`@media (prefers-contrast: more)` in `distanz-tokens.css`) automatically pushes the muted text + border tokens toward ink for users with the OS "Increase Contrast" setting — don't hand-roll your own; rely on the semantic tokens and it applies for free.

**Links**: inline text links use the `link` token (`text-link` / `--color-link` = `blue-700` light, `blue-900` dark — the accent blue). Always pair it with an **underline** (or other non-colour affordance) so links don't rely on colour alone (HIG) and stay legible on any surface. Don't invent a different link colour.

**Geist semantic system** (from ColourPalettes.tsx — applies to the gray scale):

| Shade range | Role |
|---|---|
| 100–300 | Component backgrounds |
| 400–600 | Borders |
| 700–800 | High-contrast backgrounds |
| 900–1000 | Text and icons |

So: borders = `var(--ds-gray-400)`, primary text = `var(--ds-gray-1000)`, subtle text = `var(--ds-gray-900)`, etc.

**No brand accent colour.** The brand is **black and white** — i.e. the neutral ink/canvas that already flips with light/dark mode (`textDefault` on `--ds-background-100`), mirroring the logo. There is deliberately **no** pink/brand hue. Don't reintroduce one (the old `electric-pink` / `#e43c81` / `#D11B5C` brand pink has been retired everywhere).

- **Accents that genuinely need a hue** — data-viz, race route lines, elevation charts, table/selection highlights, focus states — use **blue** (`--ds-blue-700` / `#0070F3`), matching the admin charts, Consent, and Feedback components. Don't invent a second accent hue.
- **Editorial emphasis** (pull quotes, blockquotes, featured dividers) uses **neutral ink** — `border-textDefault` / the `--rule-heavy` / `--rule-emphasised` rules, not a colour.
- The full hue scales (`blue`, `red`, `amber`, `green`, `pink`, `purple`, `teal`) still exist for **status/semantic** use (success, warning, error, info) — they are not brand colours.

**Anti-patterns**:
- Don't write raw hex / rgb values for semantic colors. Use a token.
- Don't use `bg-white` / `bg-black` / `text-neutral-*` etc. (Tailwind defaults). Use `--ds-background-100` and `--ds-gray-*`.
- The legacy named aliases (`asphalt-*`, `pace-purple`, `volt-green`, `tech-cyan`, `track-red`, `trail-brown`, `signal-orange`, `electric-pink*`) have been **removed**. Don't reintroduce them — use the core `gray`/`--ds-gray-*` neutral scale and the `blue`/`green`/`amber`/`red`/`purple`/`teal` hue scales (for status/semantic) directly.
- For theme-flipping semi-transparent colors, use `hsla(var(--ds-X-value), N)` (or `hsla(var(--color-X), N)`) over a hardcoded rgba + `dark:` override. The `-value`/`--color-*` triplets are **HSL channels** — always wrap them in `hsl()`/`hsla()`, never `rgb()`. (The old `--ds-X-rgb` companions were removed — see the token-architecture note above.)
- To recolour a token, set **both** its `--ds-X-value` HSL triplet (sRGB) and its P3 OKLCH override, copying both from Geist — they're independent layers, not one derived from the other. Run `node scripts/convert-tokens.mjs` to confirm the two layers still share a hue (sanity guard).

---

## Spacing & grid (from GridSpacing.tsx)

**8 px base grid.** Tokens follow Tailwind: `spacing-{token}` where `px = token × 4`.

| Token | px | Common usage |
|---|---|---|
| `0.5` | 2 | Micro adjustments, icon gaps |
| `1` | 4 | Fine-tuning, tight spacing |
| `2` | 8 | Base unit, compact elements |
| `3` | 12 | Small gap (mobile) |
| `4` | 16 | Standard gap (desktop) |
| `6` | 24 | Medium spacing, gutter (mobile) |
| `8` | 32 | Large spacing, gutter (desktop) |
| `10` | 40 | Section padding |
| `12` | 48 | Component separation |
| `16` | 64 | Large section gaps |
| `20` | 80 | Major section spacing |
| `24` | 96 | Page section spacing |

**Grid system**:

| Variable | <960 px | ≥960 px |
|---|---|---|
| `--grid-gap` | 12 | 16 |
| `--grid-gutter` (2× gap) | 24 | 32 |
| `--grid-outside-gutter` | 24 | 32 |

Columns: 6 at ≥600 px, 12 at ≥960 px.

---

## Materials (radii + shadows, from Materials.tsx)

**Surface materials** (on the page):

| Class | Radius | Use |
|---|---|---|
| `material-base` | 6 px | Everyday surfaces |
| `material-small` | 6 px | Slightly raised |
| `material-medium` | 12 px | Further raised |
| `material-large` | 12 px | Further raised |

**Floating materials** (above the page):

| Class | Radius | Use |
|---|---|---|
| `material-tooltip` | 6 px | Tooltips (only floating element with a stem) |
| `material-menu` | 12 px | Menus / dropdowns |
| `material-modal` | 12 px | Modals |
| `material-fullscreen` | 16 px | Fullscreen overlays |

Prefer these classes over hand-rolling shadows.

Each `material-*` is **Geist-verbatim**: `background: --ds-background-100` + `box-shadow: var(--ds-shadow-border{,-small,-medium,-large} | --ds-shadow-{tooltip,menu,modal,fullscreen})` + `border-radius` — and **no `border`** (the hairline lives *inside* the shadow token). Don't add a `border` to a material (that was the old double-border bug). To put a material on a recessed tone, override only the fill (e.g. `material-small bg-canvas`), as `Browser` does.

---

## Iconography

- **Library**: `lucide-react` is the default for general UI icons. For components that must match Geist **class-for-class**, inlining Geist's exact SVG glyphs is allowed (e.g. `CopyButton`'s copy/check). Don't pull in a *third* icon library — lucide or Geist-verbatim inline SVGs only.
- **Sizes**: Small 16 px (`w-4 h-4`) inline / Medium 20 px (`w-5 h-5`) buttons / Large 24 px (`w-6 h-6`) prominent actions.
- **Stroke**: 1.5 default/inactive, 2.5 active/selected.
- **Color**: inherits via `currentColor` — apply Tailwind text utilities (e.g. `text-[color:var(--ds-gray-900)]`).

---

## Rules (horizontal dividers)

| Style | Tailwind | Use |
|---|---|---|
| Default | `border-t border-borderSubtle` | Subtle separation, list/table rows |
| Emphasised | `border-t border-textDefault` | After headings, distinct sections |
| Heavy | `border-t-4 border-textDefault` | Major page sections, page titles, featured content |

---

## Components — prefer DS primitives over hand-rolled markup

The following live in `src/components/` (some in `src/components/ui/`). When introducing a new pattern, **check if one exists** — sidebar list:

`Article Card · Ad Slot · Avatar · Badge · Browser · Button · Calendar · Checkbox · Choicebox · Combobox · Code Block · Collapse · Command Menu · Consent Banner · Context Card · Context Menu · Description · Drawer · Empty State · Entity · Error · Feedback · Footer · Gauge · Grid · Input · Keyboard Input · Loading Dots · Login · Material · Menu · Modal · Multi Select · Newsletter Modal · Newsletter Signup · Page Frame · Note · Pagination · Phone · Progress · Project Banner · Radio · Relative Time Card · Scroller · Search · Select · Sheet · Show More · Site Header · Skeleton · Slider · Snippet · Spinner · Split Button · Status Dot · Switch · Table · Tabs · Textarea · Theme Switcher · Toast · Toggle · Tooltip`

**Buttons specifically** — use `Button` / `ButtonLink` from `src/components/ui/Button.tsx`. Variants: `default` (primary, black filled), `secondary` (hairline-bordered chip), `tertiary` (ghost), `error`, `warning`. Sizes: `tiny`, `small`, `medium`, `large`. Don't roll custom button styles for action elements.

**Carousels** — use the shared `Carousel` primitive at `src/components/ui/Carousel.tsx` (Embla-backed, includes the `embla-carousel-wheel-gestures` plugin so Mac trackpad horizontal swipes work natively).

**Page surface** — `PageFrame` in `src/components/ui/PageFrame.tsx` is the inset framed surface that wraps every public page's `<main>`. It carries `container-type: inline-size` + `container-name: page-frame` so descendants can use `@container/page-frame` queries.

---

## Conventions

- **Theme**: dark mode is via the `.dark` class on `<html>`. Token namespaces flip automatically; prefer relying on token semantics over `dark:` overrides where a token already does the right thing.
- **`text-balance`**: use on multi-line headings/leads so wraps don't orphan the last word.
- **Card-with-overlay-link**: where an entire card is clickable but the kicker / category needs its own link, the title's `<a>` carries `after:absolute after:inset-0` to span the card; the kicker's `<a>` sits with `relative z-10` to punch through. See `ArticleCard.tsx` for the canonical pattern.
- **Sanity image URLs**: resolve at the data layer with `urlFor(image).width(...).auto("format").url()`. Components like `ArticleCard` / `RaceCard` accept a pre-resolved `imageUrl` string + optional `blurDataURL`, not a raw `SanityImageSource`.
- **Hover affordances on cards**: image `scale-[1.04]` → `scale-100` on `group-hover` (settle-zoom) is the established pattern. Don't add hover underline to titles inside cards.

---

## When in doubt

1. Read the relevant DS page in `src/app/admin/(shell)/design-system/components/content/`.
2. Grep `globals.css` (`grep '\-\-ds-' src/app/globals.css`) for a token that fits.
3. Check `tailwind.config.js` for a custom utility (`text-heading-*`, `text-copy-*`, `material-*`).
4. Only fall back to magic numbers if no token / class fits — and flag it in the PR.

---

## DS docs page convention (when adding a new component page)

Every component page under `src/app/admin/(shell)/design-system/<slug>/page.tsx` follows the same shape. Use **`ModalComponent.tsx`** or **`AccordionComponent.tsx`** as the reference when copying.

**Page wrapper (`<slug>/page.tsx`):**
```tsx
<ContentWithTOC
  tocTitle="On this page"
  pageTitle="Name"
  pageSubtitle="One-line description in sentence case."
  mainSectionId="<slug>"
  headerRight={<RegistryInstallButtons slug="<slug>" />}  // if published
>
  <NameComponent />
</ContentWithTOC>
```

**Content (`components/content/<Name>Component.tsx`):**

1. **Page chrome** — inline these helpers at the top of the file: `Toast`, `LinkIcon`, `SectionHeader`, `CopyIconButton`, `RenderShikiToken`, `CodePreview`. Copy verbatim from `AccordionComponent.tsx` — they're identical across pages. *(TODO: extract into a shared module once we touch more than one of these in a single PR.)*

2. **Each example** lives inside a `<CodePreview componentCode={…}>` card so the reader gets a Show-code toggle plus a Shiki-highlighted snippet with line numbers + copy button. Pair every demo component with a code string constant — the string is what the user sees in the panel.

3. **`SectionHeader`** on every `<Section>` — hover surfaces a link icon, click copies the URL + smooth-scrolls. Pass `onCopyLink={showToast}` so the copy fires the toast.

4. **Best Practices** section is required. **Match Geist's BP for that specific
   page** (per-page convention — Geist isn't uniform, so don't force one style).
   The common/default shape (Checkbox, Banner, Browser, …):
   - `<h3 id="when-to-use" className="text-heading-20 text-textDefault mt-8 scroll-mt-32">When to use</h3>`
   - `<h3 id="behavior">Behavior</h3>` · `<h3 id="content">Content</h3>` · `<h3 id="accessibility">Accessibility</h3>`
   - each followed by `<ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">`

   But some pages differ — e.g. **Materials** uses denser BP chrome (`<h4 className="text-label-16 …">` subheadings in `mb-6 last:mb-0` wrappers, lists `text-copy-14 … pl-5 space-y-1.5`) and **omits Content**. Reproduce whatever that page does in Geist rather than the default.

5. **Inline references in body copy:**
   - Component cross-refs → `<ComponentRef name="Modal" />` (from `../ComponentRef`) — never plain text like "Modal".
   - Code literals (prop names, variant names, string examples) → `<code className="inline-code">…</code>` — `.inline-code` is defined in `globals.css`, gives the gray-100 pill treatment with mono font.
   - Italic for example sentences (toast strings, label copy) → `<em>…</em>`.

The same convention applies whether the component is hand-rolled, derived from Base UI via `npx shadcn add`, or wrapping a Radix primitive. The docs page reads identically; only the component source differs.

---

## Registry & MCP (for AI-assisted work in this repo)

`components.json` registers two shadcn registries:
- `@shadcn` (implicit) — the public ui.shadcn.com primitives
- `@distanz` — our own registry at `distanzrunning.com/r/{name}.json`

**Per-developer setup (run each once on your machine, not committed):**

```bash
# 1. Let AI tools search / install components from either registry via MCP
npx shadcn mcp init --client claude   # or cursor / vscode / codex / opencode
# → writes .mcp.json (gitignored — may carry per-dev secrets for other servers)

# 2. Inject project setup (installed components, primitive in use, aliases)
#    into your AI assistant's context so it stops fighting you on shadcn calls
npx skills add shadcn/ui              # or pnpm dlx / yarn dlx / bun x
```

Step 1 (MCP) tells the AI **what could be installed**. Step 2 (the skill) tells the AI **what's already there and how the project is configured** — reads `shadcn info --json`. Together they remove the most common class of "AI invents the wrong API" failure mode. See `/admin/design-system/registry-mcp` for the full registry setup notes.

### Primitives policy: Base UI vs Radix

- **New components → Base UI.** That's what `npx shadcn add <name>` produces today (style `base-nova`), and it matches our registry-first posture: composable, render-prop based, fewer fighting-the-library moments for consumers.
- **Existing Radix-based molecules** *(Combobox, ContextCard, Description, Sheet, Calendar)* → **leave alone**. They work, they're shipped, the migration is manual. No "let's modernise" sweep.
- **Migrate opportunistically.** If an existing Radix molecule needs an unrelated update or a bug fix Radix is slow to ship, re-derive it from the Base UI equivalent at that point. Amortise the migration cost into work you'd be doing anyway.
- **Rationale**: Radix dev has slowed post-WorkOS; Base UI ships actively (~7 engineers) and has components Radix doesn't (Combobox / Autocomplete). One real Base UI tradeoff today: less AI training data, so first-time prompts may need hand-holding. Our registry largely neutralises that — once a component is in `@distanz`, the AI installs *our restyled source* instead of authoring fresh.
