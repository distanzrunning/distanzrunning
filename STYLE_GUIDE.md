# Distanz Running - Style Guide

**Version:** 1.0
**Last Updated:** 2025
**Design System:** Distanz

This is your source of truth for building consistent UIs across the Distanz Running website.

---

## 📚 Table of Contents

1. [Design Principles](#design-principles)
2. [Typography](#typography)
3. [Colors](#colors)
4. [Spacing](#spacing)
5. [Layout & Grid](#layout--grid)
6. [Components](#components)
7. [Dark Mode](#dark-mode)
8. [Best Practices](#best-practices)

---

## 🎯 Design Principles

### 1. **Editorial First**
Clean, readable typography inspired by premium publishing. Think Bloomberg, The Atlantic, IEEE Spectrum.

### 2. **Data-Driven Design**
Emphasize data visualization, stats, and performance metrics for runners.

### 3. **Performance Obsessed**
Fast loading, optimized fonts (Adobe Fonts), minimal animations.

### 4. **Accessibility**
WCAG 2.1 AA compliance. Proper contrast ratios, semantic HTML, keyboard navigation.

### 5. **Mobile-First**
Design for mobile, enhance for desktop.

---

## ✍️ Typography

### Font Stack

**Sans-serif (Inter Variable)** - Body, UI, Navigation
- Family: `inter-variable`, Inter, system fallback
- Weights: 300, 400, 500, 550, 600
- Use for: News articles, UI components, navigation, body text

**Serif (EB Garamond)** - Headlines, Features
- Family: `eb-garamond`, EB Garamond, Georgia fallback
- Weights: 400, 500, 600 + italics
- Use for: Feature articles, quotes, display headlines

**Monospace** - Code, Data
- Family: SF Mono, Menlo, Courier
- Use for: Code blocks, technical data (sparingly)

### Type Scales

We have two distinct typography systems:

#### News Typography (Inter)
Clean, modern, for news articles and UI:

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| News H1 | 68px | Bold (600) | 1.05 | Page titles |
| News H2 | 58px | Bold (600) | 1.05 | Section headers |
| News H3 | 44px | Bold (600) | 1.1 | Subsections |
| News H4 | 38px | Bold (600) | 1.1 | Subsections |
| News H5 | 28px | Bold (600) | 1.15 | Card titles |
| News H6 | 24px | Bold (600) | 1.3 | Small headings |
| Body XL | 19px | Regular (400) | 1.3 | Lead paragraphs |
| Body | 15px | Regular (400) | 1.3 | Body text |
| Caption | 13px | Regular (400) | 1.25 | Image captions |
| Overline | 11px | Medium (500) | 1.25 | Labels, tags |

**Tailwind Classes:**
```html
<h1 className="text-[68px] leading-[1.05] font-bold">News H1</h1>
<p className="text-[15px] leading-[1.3]">Body text</p>
```

#### Feature Typography (EB Garamond)
Elegant, classic, for long-form content:

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Feature H1 | 72px | Medium (500) | 1.05 | Feature titles |
| Feature H2 | 56px | Medium (500) | 1.1 | Feature sections |
| Feature H3 | 40px | Medium (500) | 1.15 | Feature subsections |
| Feature Body | 20px | Regular (400) | 1.5 | Article body |
| Feature Quote | 32px | Italic (400) | 1.3 | Pull quotes |
| Feature Subhead | 24px | Medium (500) | 1.3 | Subheadings |

**Tailwind Classes:**
```html
<h1 className="font-serif text-[72px] leading-[1.05] font-medium">Feature H1</h1>
<p className="font-serif text-[20px] leading-[1.5]">Feature body</p>
<blockquote className="font-serif text-[32px] leading-[1.3] italic">Quote</blockquote>
```

### Typography Rules

**DO:**
- Use News typography for: News articles, breaking news, race results, gear reviews
- Use Feature typography for: Long-form essays, training guides, interview features
- Use Inter for all UI elements (buttons, nav, forms)
- Keep line lengths between 60-75 characters for readability
- Use proper heading hierarchy (h1 → h2 → h3, no skipping)

**DON'T:**
- Mix News and Feature typography in the same article
- Use more than 3 font weights on a single page
- Use font sizes not in the scale
- Use monospace for anything except code

---

## 🎨 Colors

### Brand Colors

**Primary:**
- **Electric Pink** `#e43c81` - Primary brand color, CTAs, links
- Use for: Buttons, links, highlights, brand moments

**Accents:**
- **Volt Green** `#00D464` - Success, achievements
- **Signal Orange** `#FF5722` - Alerts, warnings
- **Pace Purple** `#7C3AED` - Premium features
- **Trail Brown** `#8B4513` - Trail running content
- **Track Red** `#DC2626` - Track racing content

### Neutrals

Grayscale from Black (#0A0A0A) to White (#FFFFFF):
- Gray 900-100 for backgrounds, borders, subtle UI elements
- Off-White (#FAFAF8) for warm backgrounds

### Semantic Colors

**Light Mode:**
```css
Text Default:   rgb(17, 24, 39)   /* Body text */
Text Subtle:    rgb(107, 114, 128) /* Secondary text */
Text Subtler:   rgb(172, 176, 184) /* Tertiary text */
Text Accent:    rgb(228, 60, 129)  /* Electric Pink */

Border Neutral: rgb(229, 229, 229) /* Dividers */
Surface:        rgb(255, 255, 255) /* Cards */
Canvas:         rgb(247, 247, 247) /* Page bg */
```

**Dark Mode:**
```css
Text Default:   rgb(249, 250, 250) /* Body text */
Text Subtle:    rgb(172, 176, 184) /* Secondary */
Text Subtler:   rgb(107, 114, 128) /* Tertiary */

Surface:        rgb(12, 12, 13)    /* Cards */
Canvas:         rgb(10, 10, 10)    /* Page bg */
```

### Color Usage

**DO:**
- Use semantic colors (`text-textDefault`, `bg-surface`) not hardcoded values
- Maintain 4.5:1 contrast ratio for text
- Use brand colors sparingly for emphasis
- Test in both light and dark modes

**DON'T:**
- Use pure black (#000000) or pure white (#FFFFFF) for text
- Mix warm and cool grays
- Use more than 2 brand colors per component

---

## 📐 Spacing

### Scale
Base unit: **8px** (0.5rem)

```
2px   (0.125rem) - Hairline borders
4px   (0.25rem)  - Tight spacing
8px   (0.5rem)   - Base unit
12px  (0.75rem)  - Small gaps
16px  (1rem)     - Standard gap
24px  (1.5rem)   - Medium gap
32px  (2rem)     - Large gap
48px  (3rem)     - Section spacing
64px  (4rem)     - Major sections
96px  (6rem)     - Page margins
```

### Usage

**Component Padding:**
- Button: 12px vertical, 24px horizontal
- Card: 24px all sides
- Input: 12px vertical, 16px horizontal

**Vertical Rhythm:**
- Paragraph spacing: 16px
- Section spacing: 48px-64px
- Page margins: 96px top/bottom

**Tailwind Classes:**
```html
<div className="p-6">Card content</div> <!-- 24px padding -->
<div className="space-y-4">Multiple items</div> <!-- 16px gaps -->
```

---

## 📱 Layout & Grid

### Breakpoints

```
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
Wide:    > 1280px
```

### Grid System

**Mobile (< 768px):**
- 4 columns
- 16px gutter
- 16px margin

**Tablet (768px - 1024px):**
- 12 columns
- 24px gutter
- 32px margin

**Desktop (> 1024px):**
- 18 columns
- 24px gutter
- Max width: 1585px
- Auto margins

### Container Classes

```html
<!-- Main bordered wrapper -->
<div className="main-wrapper">
  <div className="main-bordered">
    <!-- Content with side borders on tablet+ -->
  </div>
</div>

<!-- Distanz grid container -->
<div className="distanz-container">
  <!-- 18-column grid on desktop -->
</div>

<!-- Article container -->
<div className="distanz-article-container">
  <div className="distanz-article-col">
    <!-- Centered article column -->
  </div>
</div>
```

---

## 🧩 Components

### Buttons

**Primary Button:**
```html
<button className="px-6 py-3 bg-electric-pink text-white rounded-md font-medium hover:bg-opacity-90 transition-colors">
  Primary Action
</button>
```

**Secondary Button:**
```html
<button className="px-6 py-3 border-2 border-electric-pink text-electric-pink rounded-md font-medium hover:bg-electric-pink hover:text-white transition-colors">
  Secondary Action
</button>
```

**Ghost Button:**
```html
<button className="px-6 py-3 text-electric-pink font-medium hover:bg-gray-100 rounded-md transition-colors">
  Tertiary Action
</button>
```

### Cards

**Article Card:**
```html
<div className="bg-surface rounded-lg overflow-hidden border border-borderNeutral hover:shadow-lg transition-shadow">
  <img src="..." className="w-full h-48 object-cover" />
  <div className="p-6">
    <h3 className="font-bold text-xl mb-2">Title</h3>
    <p className="text-textSubtle text-sm">Description</p>
  </div>
</div>
```

### Forms

**Input Field:**
```html
<input
  type="text"
  className="w-full px-4 py-3 border border-borderNeutral rounded-md focus:border-electric-pink focus:ring-1 focus:ring-electric-pink outline-none transition-colors"
  placeholder="Enter text"
/>
```

---

## 🌙 Dark Mode

### Implementation

Dark mode is class-based using `dark:` prefix:

```html
<div className="bg-white dark:bg-[#0c0c0d] text-textDefault transition-colors">
  <!-- Automatically switches in dark mode -->
</div>
```

### Rules

**DO:**
- Use semantic color variables (automatically switch)
- Test every component in both modes
- Ensure 4.5:1 contrast in both modes
- Use `transition-colors` for smooth switching

**DON'T:**
- Hardcode colors
- Forget to test dark mode
- Use opacity to fake dark mode

---

## ✅ Best Practices

### Code Style

**Use Tailwind-First:**
```html
<!-- ✅ Good -->
<div className="p-6 bg-surface rounded-lg">

<!-- ❌ Bad - custom CSS for common patterns -->
<div className="my-custom-card">
```

**Use Semantic Classes:**
```html
<!-- ✅ Good -->
<p className="text-textSubtle">

<!-- ❌ Bad - hardcoded color -->
<p className="text-gray-500">
```

**Component Organization:**
```tsx
// ✅ Good - props, state, render
export function Button({ variant = 'primary', children, ...props }) {
  const baseStyles = "px-6 py-3 rounded-md font-medium transition-colors";
  const variantStyles = variant === 'primary'
    ? "bg-electric-pink text-white hover:bg-opacity-90"
    : "border-2 border-electric-pink text-electric-pink hover:bg-electric-pink hover:text-white";

  return <button className={`${baseStyles} ${variantStyles}`} {...props}>{children}</button>;
}
```

### Performance

- Use Adobe Fonts (already configured)
- Lazy load images with Next.js Image component
- Minimize custom CSS - prefer Tailwind
- Use CSS variables for theme switching
- Avoid layout shifts with proper sizing

### Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<article>`)
- Include proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper heading hierarchy

---

## 🔧 Design Tokens

All design decisions are centralized in `/src/styles/design-tokens.ts`.

**Import and use:**
```typescript
import { colors, typography, spacing } from '@/styles/design-tokens';

// Use in components
const buttonColor = colors.brand.electricPink;
const headingSize = typography.fontSize.h1;
```

**This ensures:**
- Single source of truth
- Easy global updates
- Type safety with TypeScript
- Consistency across codebase

---

## 📝 Quick Reference

### Common Patterns

**Page Layout:**
```tsx
<div className="min-h-screen bg-canvas dark:bg-[#0a0a0a]">
  <Navbar />
  <main className="distanz-container py-16">
    <!-- Content -->
  </main>
  <Footer />
</div>
```

**Article Header:**
```tsx
<header className="mb-8">
  <h1 className="font-serif text-[72px] leading-[1.05] font-medium mb-4">
    Article Title
  </h1>
  <div className="flex items-center gap-4 text-textSubtle text-sm">
    <span>{date}</span>
    <span>•</span>
    <span>{readTime} min read</span>
  </div>
</header>
```

**Responsive Image:**
```tsx
<Image
  src="/path/to/image.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={630}
  className="w-full h-auto rounded-lg"
  priority={isAboveFold}
/>
```

---

## 🚀 Getting Started

1. **Read this guide** - Understand the system
2. **Check `/src/styles/design-tokens.ts`** - See all available tokens
3. **Look at existing components** - Follow established patterns
4. **Use Tailwind classes** - Avoid custom CSS
5. **Test in both modes** - Light and dark
6. **Ask questions** - When in doubt, ask!

---

## 📚 Resources

- **Design Tokens:** `/src/styles/design-tokens.ts`
- **Tailwind Config:** `/tailwind.config.js`
- **Global Styles:** `/src/app/globals.css`
- **Components:** `/src/components/`

**External:**
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Image](https://nextjs.org/docs/api-reference/next/image)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Questions?** Check the code or ask the team!

Built with ❤️ for runners, by runners.
