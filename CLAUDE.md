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
| EB Garamond | `--font-family-serif` | `font-serif` | **Editorial only**: featured article headlines, article page titles, pull quotes |
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

**Editorial heading scale** (always pair with `font-serif`):

| Class | Size / lh | Use for |
|---|---|---|
| `text-heading-48 font-serif` | 48 / 56 | Featured article headlines |
| `text-heading-40 font-serif` | 40 / 48 | Article page titles |
| `text-heading-32 font-serif` | 32 / 40 | Large article titles, pull quotes |
| `text-heading-24 font-serif` | 24 / 32 | Article subheadings, blockquotes |

**Anti-patterns to avoid**:
- Don't use `font-serif` for UI section titles. The DS Typography page explicitly forbids this.
- Don't write magic `clamp()` font sizes inline when `text-heading-*` covers the slot.
- Don't use `font-headline` (legacy alias) — use the `text-heading-*` scale and let Geist inherit.

---

## Color

Token namespace: `--ds-{hue}-{shade}`.

**Hues**: `gray`, `blue`, `red`, `amber`, `green`, `pink`, `purple`, `teal`. Shades 100–1000 (in steps of 100).

**Backgrounds** (separate from the hue scale): `--ds-background-100` (primary canvas, white in light) / `--ds-background-200` (secondary surface, FAFAFA in light). They flip in dark mode.

**Alpha tokens**: `--ds-gray-alpha-{100..1000}` for translucent overlays.

**RGB tuples** (for use inside `rgba()`): every token has a `-rgb` companion, e.g. `rgba(var(--ds-gray-1000-rgb), 0.04)`. The tuple flips with the theme automatically — preferred for theme-aware semi-transparent colors over a `dark:` override.

**Geist semantic system** (from ColourPalettes.tsx — applies to the gray scale):

| Shade range | Role |
|---|---|
| 100–300 | Component backgrounds |
| 400–600 | Borders |
| 700–800 | High-contrast backgrounds |
| 900–1000 | Text and icons |

So: borders = `var(--ds-gray-400)`, primary text = `var(--ds-gray-1000)`, subtle text = `var(--ds-gray-900)`, etc.

**Brand accent**: `electric-pink` (Tailwind class) — used for category indicators, brand moments, accent dividers. **Sparingly.**

**Anti-patterns**:
- Don't write raw hex / rgb values for semantic colors. Use a token.
- Don't use `bg-white` / `bg-black` / `text-neutral-*` etc. (Tailwind defaults). Use `--ds-background-100` and `--ds-gray-*`.
- For theme-flipping semi-transparent colors, prefer `rgba(var(--ds-X-rgb), N)` over a hardcoded rgba + `dark:` override.

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

---

## Iconography

- **Library**: `lucide-react`. Don't introduce alternative icon sets.
- **Sizes**: Small 16 px (`w-4 h-4`) inline / Medium 20 px (`w-5 h-5`) buttons / Large 24 px (`w-6 h-6`) prominent actions.
- **Stroke**: 1.5 default/inactive, 2.5 active/selected.
- **Color**: inherits via `currentColor` — apply Tailwind text utilities (e.g. `text-[color:var(--ds-gray-900)]`).

---

## Rules (horizontal dividers)

| Style | Tailwind | Use |
|---|---|---|
| Default | `border-t border-borderSubtle` | Subtle separation, list/table rows |
| Emphasised | `border-t border-textDefault` | After headings, distinct sections |
| Heavy | `border-t-4 border-textDefault` | Major page sections, page titles |
| Accent | `border-t-4 border-electric-pink` | Featured content, brand moments |

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
