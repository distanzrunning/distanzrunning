# Typography System Specification
## Running News & Content Website

---

## Font Pairing Assessment

**Fonts:** Manrope + EB Garamond  
**Verdict:** Strong pairing ✓

| Factor | Analysis |
|--------|----------|
| **Contrast** | High — geometric sans vs old-style serif creates clear hierarchy |
| **X-height** | Compatible — both have generous x-heights for screen readability |
| **Character** | Complementary — Manrope (modern, athletic) vs EB Garamond (literary, refined) |
| **Era tension** | Productive — 16th-century roots meet 2019 design, feels fresh not jarring |
| **Use case fit** | Ideal — news energy (Manrope) + editorial depth (EB Garamond) matches content split |

---

## Scale Foundation

- **Scale ratio:** 1.25 (Major Third)
- **Grid:** 8px baseline
- **Approach:** Context-split — Manrope for News/UI, EB Garamond for Features/Essays

---

## MANROPE — News, UI & Navigation

### Content Styles

| Role | Size | Weight | Line Height | Tracking | Case |
|------|------|--------|-------------|----------|------|
| Display / Hero | 48px | 700 (Bold) | 1.1 (52px) | -0.02em | Sentence |
| Headline 1 | 36px | 700 (Bold) | 1.2 (44px) | -0.015em | Sentence |
| Headline 2 | 28px | 600 (SemiBold) | 1.25 (36px) | -0.01em | Sentence |
| Headline 3 | 22px | 600 (SemiBold) | 1.3 (28px) | 0 | Sentence |
| Body | 16px | 400 (Regular) | 1.5 (24px) | 0 | Sentence |
| Body Small | 14px | 400 (Regular) | 1.5 (20px) | 0 | Sentence |
| Overline | 12px | 600 (SemiBold) | 1.3 (16px) | +0.08em | UPPERCASE |
| Caption | 12px | 500 (Medium) | 1.4 (16px) | 0 | Sentence |
| Label / Meta | 11px | 500 (Medium) | 1.3 (14px) | +0.02em | Sentence |

### UI Components

| Element | Size | Weight | Line Height | Tracking | Case |
|---------|------|--------|-------------|----------|------|
| Button Large | 16px | 600 | 1.0 (16px) | +0.01em | Sentence |
| Button Default | 14px | 600 | 1.0 (14px) | +0.01em | Sentence |
| Button Small | 12px | 600 | 1.0 (12px) | +0.02em | Sentence |
| Nav Link | 14px | 500 | 1.0 | 0 | Sentence |
| Nav Link Active | 14px | 600 | 1.0 | 0 | Sentence |
| Input Text | 16px | 400 | 1.5 (24px) | 0 | Sentence |
| Input Label | 14px | 500 | 1.4 (20px) | 0 | Sentence |
| Tag / Badge | 11px | 600 | 1.0 | +0.03em | UPPERCASE |

---

## EB GARAMOND — Features & Essays

| Role | Size | Weight | Line Height | Tracking | Case / Style |
|------|------|--------|-------------|----------|--------------|
| Display / Hero | 52px | 400 (Regular) | 1.1 (56px) | -0.01em | Sentence / Italic |
| Headline 1 | 40px | 400 (Regular) | 1.15 (46px) | -0.01em | Sentence / Italic |
| Headline 2 | 30px | 500 (Medium) | 1.25 (38px) | 0 | Sentence |
| Headline 3 | 24px | 500 (Medium) | 1.3 (32px) | 0 | Sentence |
| Subhead / Deck | 22px | 400 (Regular) | 1.4 (30px) | 0 | Sentence / Italic |
| Body | 19px | 400 (Regular) | 1.6 (30px) | +0.01em | Sentence |
| Pull Quote | 26px | 400 (Regular) | 1.4 (36px) | 0 | Sentence / Italic |
| Caption | 14px | 400 (Regular) | 1.4 (20px) | +0.01em | Sentence / Italic |
| Footnote | 13px | 400 (Regular) | 1.5 (20px) | +0.01em | Sentence |

---

## Spacing System

| Property | News / UI (Manrope) | Features (EB Garamond) |
|----------|---------------------|------------------------|
| Paragraph spacing | 16px | 24px |
| Section spacing | 32px | 48px |
| List item spacing | 8px | 12px |
| Max line width | 680px | 620px |

---

## Responsive Adjustments

| Breakpoint | Display | H1 | Body |
|------------|---------|-----|------|
| **Desktop** (1200px+) | 48px / 52px | 36px / 40px | 16px / 19px |
| **Tablet** (768px) | 40px / 44px | 30px / 34px | 16px / 18px |
| **Mobile** (375px) | 32px / 36px | 26px / 30px | 16px / 18px |

*Format: Manrope size / EB Garamond size*

---

## Usage Guidelines

### When to Use Manrope (News & UI)
- Breaking news articles
- Race results and live updates
- Navigation and headers
- Buttons and form elements
- Cards and metadata
- Timestamps and tags

### When to Use EB Garamond (Features)
- Long-form feature articles
- Athlete profiles and interviews
- Opinion pieces and essays
- Training guides
- Editorial content
- Pull quotes