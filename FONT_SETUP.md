# Distanz Running - Font Setup Guide

## Current Font Stack ✅

### Modern Editorial Combination

This is the **"Option 1: Modern Editorial"** from your free fonts guide - providing professional, editorial quality at zero cost.

### 1. Playfair Display (Serif - Headlines)
**Purpose**: Display headlines, article titles, hero text
**Loading**: `next/font/google` in `src/app/layout.tsx`
**CSS Variable**: `--font-playfair`
**Weights**: 400, 500, 600, 700, 800, 900
**Tailwind Classes**: `font-playfair`, `font-headline`

```tsx
// Usage
<h1 className="font-playfair text-4xl font-semibold">
  Breaking Barriers in Berlin
</h1>
```

**Why Playfair Display?**
- High contrast serif with editorial sophistication
- Dramatic, attention-grabbing headlines
- Athletic sharpness perfect for running content
- Extensive weight range for flexibility

---

### 2. Source Serif 4 (Serif - Article Body)
**Purpose**: Long-form articles, feature content, race guides
**Loading**: `next/font/google` in `src/app/layout.tsx`
**CSS Variable**: `--font-body`
**Weights**: 400, 600, 700
**Tailwind Classes**: `font-body`, `font-serif`

```tsx
// Usage for article content
<article>
  <p className="font-body text-lg leading-relaxed">
    The streets of Berlin witnessed history as Tigist Assefa...
  </p>
</article>
```

**Why Source Serif 4?**
- Designed specifically for digital reading
- Excellent readability in long-form content
- Modern serif feel (not stuffy or old-fashioned)
- Extensive weight range (200-900)
- Pairs beautifully with Playfair Display headlines

---

### 3. Inter Variable (Sans-serif - UI/Navigation)
**Purpose**: UI elements, navigation, buttons, metadata, captions
**Loading**: CDN via `@font-face` in `src/app/globals.css`
**Source**: https://rsms.me/inter/font-files/InterVariable.woff2
**CSS Variable**: `--base-font`
**Features**: OpenType features enabled (`cv02`, `cv03`, `cv04`, `cv11`)
**Tailwind Classes**: `font-sans`

```tsx
// Usage for UI elements
<nav className="font-sans">
  <button className="font-sans font-semibold">Subscribe</button>
</nav>
```

**Why Inter Variable?**
- Variable font = single file for all weights (100-900)
- Designed specifically for UI
- Excellent readability at small sizes
- Professional, modern aesthetic
- Clean contrast with serif body text

---

### 4. JetBrains Mono (Monospace - Data)
**Purpose**: Race times, statistics, numerical data, code
**Loading**: `next/font/google` in `src/app/layout.tsx`
**CSS Variable**: `--font-mono`
**Weights**: 400, 500, 700
**Tailwind Classes**: `font-mono`

```tsx
// Usage for race times and data
<span className="font-mono text-sm">
  2:04:35
</span>

<table>
  <td className="font-mono">1:02:17</td>
</table>
```

**Why JetBrains Mono?**
- Modern monospace with excellent number legibility
- Clear distinction between similar characters (0 vs O, 1 vs l)
- More contemporary feel than Roboto Mono
- Extensive weight range (100-800)

---

### 4. Material Symbols Outlined (Icons)
**Purpose**: UI icons
**Loading**: Google Fonts CDN via `<link>` in `src/app/layout.tsx`
**Usage**: Via class name with icon name

```tsx
// Usage
<span className="material-symbols-outlined">
  arrow_forward
</span>
```

---

## Font Loading Configuration

### File: `src/app/layout.tsx`

```tsx
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from "next/font/google";

// Headline font (serif)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap', // FOUT prevention
  adjustFontFallback: false,
});

// Body font (serif)
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"],
  display: 'swap',
});

// Monospace font
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: 'swap',
});

// Apply to HTML
<html className={`${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}>
  <body className="font-sans distanz-font-features">
    {children}
  </body>
</html>
```

### File: `src/app/globals.css`

```css
/* Inter Variable from CDN */
@font-face {
  font-display: swap;
  font-family: 'InterVariable';
  font-style: normal;
  font-weight: 100 900;
  src: url('https://rsms.me/inter/font-files/InterVariable.woff2?v=4.0') format('woff2');
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
}

/* CSS Variables */
:root {
  --base-font: "InterVariable", "Inter", sans-serif;
  --brand-font: var(--font-playfair), "Playfair Display", Georgia, serif;
  --body-font: var(--font-body), "Source Serif 4", Georgia, serif;
  --mono-font: var(--font-mono), "JetBrains Mono", "Courier New", monospace;
}
```

---

## Tailwind Configuration

### File: `tailwind.config.js`

```js
fontFamily: {
  sans: ['var(--base-font)', 'InterVariable', 'Inter', 'system-ui', 'sans-serif'],
  playfair: ['var(--font-playfair)', 'Playfair Display', 'serif'],
  headline: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
  body: ['var(--font-body)', 'Source Serif 4', 'Georgia', 'serif'],
  serif: ['var(--font-body)', 'Source Serif 4', 'Georgia', 'serif'],
  mono: ['var(--font-mono)', 'JetBrains Mono', 'Courier New', 'monospace'],
}
```

---

## Pre-built Text Utilities

These classes combine font family, size, weight, and line-height:

```tsx
// Display headlines (35px/56px responsive)
className="text-title-distanz"

// Section headers (30px)
className="text-h2-distanz"

// Sub-section headers (24px)
className="text-h3-distanz"

// Article body (17px/19px responsive)
className="text-body-distanz"

// Lead paragraphs (21px/22px responsive)
className="text-intro-distanz"

// Metadata/captions (15px)
className="text-meta-distanz"
```

---

## Font Usage Guidelines

### When to Use Each Font

**Playfair Display (Serif - Headlines)**
- ✅ Article headlines (`<h1>`, `<h2>`)
- ✅ Hero section titles
- ✅ Feature article displays
- ✅ Large pull quotes
- ❌ Body paragraphs (too dramatic)
- ❌ UI elements (not designed for UI)
- ❌ Small text (readability issues)

**Source Serif 4 (Serif - Body)**
- ✅ Long-form article body text
- ✅ Feature story content
- ✅ Race guide descriptions
- ✅ Editorial content
- ✅ Any readable paragraph text
- ❌ Navigation (use Inter instead)
- ❌ Buttons/UI (use Inter instead)
- ❌ Small metadata (use Inter instead)

**Inter Variable (Sans-serif - UI)**
- ✅ Navigation
- ✅ Buttons
- ✅ Forms
- ✅ Cards
- ✅ Metadata (author, date, read time)
- ✅ Captions
- ✅ Category tags
- ✅ All UI elements
- ❌ Article body (use Source Serif 4 instead)

**JetBrains Mono (Monospace - Data)**
- ✅ Race times (2:04:35)
- ✅ Statistics tables
- ✅ Pace displays (5:45/km)
- ✅ Numerical data that needs alignment
- ✅ Code blocks
- ❌ Headlines
- ❌ Body text

---

## Performance Optimizations

### Current Setup Benefits

1. **Next.js Font Optimization**
   - Automatic self-hosting (Playfair, Roboto Mono)
   - Zero layout shift
   - Optimal font loading strategy
   - `font-display: swap` for FOUT prevention

2. **Inter Variable CDN**
   - Single file for all weights (saves bandwidth)
   - Fast CDN delivery (rsms.me)
   - Variable font technology

3. **Preload Critical Fonts**
   - Next.js automatically preloads fonts in `<head>`
   - Reduced time to first contentful paint

### Font Loading Timeline

```
1. HTML loads → CSS loads
2. Inter Variable loads from CDN (fast, lightweight)
3. Playfair & Roboto Mono load from Next.js optimization
4. Fallback fonts displayed during load (system fonts)
5. Fonts swap in when ready (font-display: swap)
```

---

## Troubleshooting

### Fonts Not Loading?

1. **Check CSS variables are applied**
   ```tsx
   <html className={`${playfair.variable} ${robotoMono.variable}`}>
   ```

2. **Verify Inter CDN is accessible**
   - Check network tab for `InterVariable.woff2`
   - Should load from `https://rsms.me/inter/...`

3. **Check Tailwind classes**
   - Use `font-playfair` for headlines
   - Use `font-sans` for body (default)
   - Use `font-mono` for data

### Font Looks Wrong?

1. **Apply font features class**
   ```tsx
   className="distanz-font-features"
   ```
   This enables OpenType features for Inter

2. **Check line heights**
   - Distanz uses tight line-heights (1.15-1.35)
   - Use pre-built text utilities for consistency

3. **Verify font weight**
   - Headlines: `font-semibold` (600)
   - Body: `font-regular` (400)
   - Bold: `font-semibold` or `font-bold` (600)

---

## Future Enhancements (Optional)

If you want to add premium fonts in the future:

1. **JG Jayagiri Sans** (Display)
   - For brand-specific display text
   - Would need to purchase license
   - Self-host via `next/font/local`

2. **Tiempos Headline** (Editorial Serif)
   - Premium alternative to Playfair
   - Commercial license required
   - Self-host via `next/font/local`

3. **GT Sectra Display** (Editorial Serif)
   - Another premium headline option
   - Commercial license required
   - Self-host via `next/font/local`

### How to Add Local Fonts

```tsx
import localFont from 'next/font/local'

const jayagiri = localFont({
  src: './fonts/JGJayagiriSans.woff2',
  variable: '--font-jayagiri',
  display: 'swap',
})
```

---

## Quick Reference

| Use Case | Font | Tailwind Class | Example |
|----------|------|----------------|---------|
| Article headline | Playfair Display | `font-playfair text-4xl font-semibold` | `<h1 className="font-playfair text-4xl">` |
| Article body | Source Serif 4 | `font-body text-lg leading-relaxed` | `<p className="font-body text-lg">` |
| Navigation | Inter Variable | `font-sans font-medium` | `<nav className="font-sans">` |
| Button text | Inter Variable | `font-sans font-semibold uppercase` | `<button className="font-sans font-semibold">` |
| Race time | JetBrains Mono | `font-mono text-sm` | `<span className="font-mono">2:04:35</span>` |
| Metadata | Inter Variable | `font-sans text-sm text-gray-500` | `<span className="font-sans text-sm">` |
| Hero title | Playfair Display | `text-title-distanz` (pre-built) | `<h1 className="text-title-distanz">` |
| Article body | Source Serif 4 | `text-body-distanz` (pre-built) | `<p className="text-body-distanz">` |

---

## Summary

✅ **Modern Editorial Font Stack (4 Fonts)**
- **Playfair Display** (serif) - Headlines
- **Source Serif 4** (serif) - Article body text
- **Inter Variable** (sans-serif) - UI/Navigation
- **JetBrains Mono** (monospace) - Data/Stats

✅ **Strategic Font Pairing**
- Serif headlines + Serif body = Editorial sophistication
- Sans-serif UI = Clean, modern contrast
- Monospace data = Clear, professional statistics
- This is the "Modern Editorial" combination from your free fonts guide

✅ **Optimized Loading**
- Next.js font optimization for Playfair, Source Serif, & JetBrains Mono
- CDN delivery for Inter Variable (variable font)
- `font-display: swap` strategy on all fonts
- Zero licensing costs (all Google Fonts)

✅ **Full Tailwind Integration**
- All fonts available as utility classes (`font-playfair`, `font-body`, `font-sans`, `font-mono`)
- Pre-built text utilities for common patterns (`.text-body-distanz`, etc.)
- CSS variables for flexibility (`--font-playfair`, `--font-body`, `--base-font`, `--font-mono`)

✅ **Performance-First**
- Self-hosting via Next.js (no Google Fonts render-blocking)
- Variable font technology (Inter)
- Optimal font loading strategy
- Minimal font files loaded

---

**Last Updated**: October 2025
**Version**: 1.0 (Distanz Rebrand)
