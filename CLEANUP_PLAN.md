# Distanz Running - Codebase Cleanup Plan

## 🎯 Goal
Create a simple, maintainable design system with uniform patterns across the website.

---

## 📊 Current State Analysis

### Issues Found:
1. **Legacy naming** - 106 references to "Quartr" (the design inspiration)
2. **Bloated CSS** - 1,710 lines in globals.css
3. **Inconsistent patterns** - Mix of custom classes, Tailwind utilities, CSS variables
4. **No central design tokens** - Colors/typography scattered across files
5. **Unclear organization** - Hard to find where styles are defined

### What's Actually Good:
✅ Adobe Fonts properly configured
✅ Dark mode implementation works
✅ Tailwind config is comprehensive
✅ Only one global CSS file (good!)
✅ Semantic color tokens exist

---

## 🧹 Cleanup Strategy

### Phase 1: Remove Legacy Names (30 min)
**Files affected:** 5 files, 106 occurrences

Replace all "Quartr/quartr/quik_" references with "Distanz/distanz":
- `globals.css` - 73 occurrences
- `tailwind.config.js` - 12 occurrences
- `gear/[gearSlug]/page.tsx` - 11 occurrences
- `articles/post/[postSlug]/page.tsx` - 9 occurrences
- `lib/constants.ts` - 1 occurrence

**Action:**
- Find/replace `quik_` → `distanz_`
- Find/replace `Quartr` → `Distanz` (in comments only)
- Keep functionality identical

---

### Phase 2: Consolidate globals.css (1-2 hours)

Current structure (1,710 lines):
```
@import statements
@keyframes (animations)
@layer base (CSS variables, resets)
@layer components (custom classes)
@layer utilities (helper classes)
Misc styles (reCAPTCHA, scrollbars, etc.)
```

**New structure:**
```
/src/styles/
  ├── globals.css          (150 lines - imports + essentials)
  ├── design-tokens.css    (200 lines - all CSS variables)
  ├── base.css            (100 lines - resets, base styles)
  ├── components.css      (400 lines - component classes)
  ├── utilities.css       (200 lines - utility classes)
  └── animations.css      (100 lines - keyframes)
```

**Benefits:**
- Easy to find styles
- Can tree-shake unused code
- Better Git diffs
- Clearer ownership

---

### Phase 3: Create Design Tokens File (30 min)

**New file:** `src/styles/design-tokens.js`

Export all design decisions as JavaScript:
```javascript
export const colors = {
  brand: {
    electricPink: '#e43c81',
    voltGreen: '#00D464',
    // ...
  },
  neutral: {
    black: '#0A0A0A',
    white: '#FFFFFF',
    // ...
  },
  semantic: {
    light: {
      textDefault: '#111827',
      // ...
    },
    dark: {
      textDefault: '#F9FAFA',
      // ...
    }
  }
}

export const typography = {
  fonts: {
    sans: 'inter-variable, Inter, sans-serif',
    serif: 'eb-garamond, EB Garamond, serif',
  },
  sizes: {
    xs: '11px',
    sm: '13px',
    base: '15px',
    // ...
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 550,
    bold: 600,
  }
}

export const spacing = {
  0: '0',
  1: '0.125rem',  // 2px
  2: '0.25rem',   // 4px
  4: '0.5rem',    // 8px
  // ...
}
```

**Benefits:**
- Single source of truth
- Can import into components
- Can generate CSS variables from this
- Can sync with Tailwind config
- Can export to JSON for tools

---

### Phase 4: Standardize Component Patterns (1 hour)

**Current issues:**
- Some components use custom CSS classes
- Some use inline Tailwind
- Some mix both
- Inconsistent naming

**New pattern - Pick ONE approach:**

**Option A: Tailwind-First (Recommended)**
```tsx
// Consistent, clear, co-located
<button className="px-6 py-3 bg-electric-pink text-white rounded-md font-medium hover:bg-opacity-90">
  Button Text
</button>
```

**Option B: CSS Modules**
```tsx
// Scoped, but more files
import styles from './Button.module.css'
<button className={styles.primary}>Button Text</button>
```

**Option C: Hybrid (Current - NOT recommended)**
```tsx
// Confusing - where are styles defined?
<button className="ui-btn btn-primary custom-hover">Button Text</button>
```

**Recommendation:** Go with **Option A (Tailwind-First)**
- Fastest development
- No context switching
- Easy to maintain
- Already using Tailwind extensively

---

### Phase 5: Create Style Guide (30 min)

**New file:** `STYLE_GUIDE.md`

Document:
1. **Color usage** - When to use each color
2. **Typography rules** - News vs Feature styles
3. **Spacing system** - Use 8px base unit
4. **Component patterns** - How to build new components
5. **Dark mode** - How to handle dark mode properly
6. **Best practices** - Do's and don'ts

This becomes your "Figma" - but in markdown.

---

## 📁 Proposed File Structure

```
/src/
  /app/
    globals.css (150 lines - imports only)
  /styles/
    design-tokens.js          ← NEW - Source of truth
    design-tokens.css         ← Generated from .js
    base.css                  ← Resets, base styles
    components.css            ← Component classes
    utilities.css             ← Utility classes
    animations.css            ← Keyframes
  /components/
    (existing components)

/docs/ (or root)
  STYLE_GUIDE.md              ← NEW - How to use the system
  DESIGN_TOKENS.md            ← NEW - Quick reference
```

---

## ⏱️ Time Estimate

| Phase | Time | Impact |
|-------|------|--------|
| 1. Remove legacy names | 30 min | Medium - Clarity |
| 2. Split globals.css | 1-2 hrs | High - Maintainability |
| 3. Create tokens file | 30 min | High - Single source of truth |
| 4. Standardize patterns | 1 hr | High - Consistency |
| 5. Write style guide | 30 min | Medium - Documentation |
| **Total** | **3-4 hrs** | **Very High** |

---

## 🚀 Execution Order

1. **Start:** Remove legacy "Quartr" names (easy win)
2. **Core:** Create design-tokens.js (foundation)
3. **Organize:** Split globals.css into modules
4. **Document:** Write style guide
5. **Refine:** Standardize component patterns (can be gradual)

---

## ✅ Success Criteria

After cleanup:
- [ ] Zero references to "Quartr/quik_"
- [ ] All design decisions in design-tokens.js
- [ ] globals.css under 200 lines
- [ ] Clear file organization (src/styles/)
- [ ] Style guide documents all patterns
- [ ] New components follow consistent pattern
- [ ] Easy to find any style definition

---

## 🎯 Next Steps

**Option 1: Do it all now (3-4 hours)**
- Complete transformation
- Big PR, but clean result

**Option 2: Incremental (1 hour chunks)**
- Phase 1 today (remove legacy names)
- Phase 2-3 tomorrow (tokens + split CSS)
- Phase 4-5 later (patterns + docs)

**Option 3: Hybrid (2 hours core)**
- Phase 1 + 2 + 3 (remove legacy, create tokens, basic split)
- Defer pattern standardization to gradual refactor

Which approach do you prefer?
