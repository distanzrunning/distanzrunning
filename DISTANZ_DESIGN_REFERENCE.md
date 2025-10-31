# Distanz Running Design System Reference

## Quick Reference Guide for Development

This document provides a practical reference for implementing the Distanz design system in code. The design system merges Quartr-inspired principles (tight typography, squared layouts) with Distanz's unique brand identity.

---

## Color Palette

### Brand Colors (Primary Use)

```tsx
// Tailwind classes
className="bg-electric-pink"     // #e43c81 - Primary CTA, links, interactive
className="text-electric-pink"   // Use for accents, buttons
className="border-electric-pink" // Use for focus states

className="bg-volt-green"        // #00D464 - Success, positive metrics
className="bg-signal-orange"     // #FF5722 - Breaking news, alerts
className="bg-pace-purple"       // #7C3AED - Premium/featured content
className="bg-trail-brown"       // #8B4513 - Trail running content
className="bg-track-red"         // #DC2626 - Track & field content
```

### Grayscale

```tsx
// Text colors
className="text-gray-900"  // #1A1A1A - Headlines
className="text-gray-800"  // #2D2D2D - Subheadings
className="text-gray-700"  // #404040 - Body text
className="text-gray-600"  // #595959 - Secondary text
className="text-gray-500"  // #737373 - Captions

// Background colors
className="bg-white"       // #FFFFFF - Cards, surfaces
className="bg-off-white"   // #FAFAF8 - Page backgrounds
className="bg-gray-100"    // #F5F5F5 - Subtle backgrounds
className="bg-gray-200"    // #E6E6E6 - Dividers

// Border colors
className="border-gray-300" // #D9D9D9 - Default borders
className="border-gray-200" // #E6E6E6 - Subtle borders
```

### Semantic Colors (CSS Variables)

```tsx
className="text-textDefault"   // Primary text
className="text-textSubtle"    // Secondary text
className="text-textSubtler"   // Tertiary text
className="text-textAccent"    // Electric pink accent
className="bg-surface"         // Card/surface backgrounds
className="bg-canvas"          // Page canvas
className="border-borderNeutral" // Default borders
```

---

## Typography

### Font Families

**Modern Editorial Stack (4 Fonts):**
- **Playfair Display** (serif) - Headlines, display text
- **Source Serif 4** (serif) - Article body text, long-form content
- **Inter Variable** (sans-serif) - UI, navigation, metadata
- **JetBrains Mono** (monospace) - Race times, statistics, data

```tsx
// Headlines (Playfair Display - serif)
className="font-playfair"  // Serif headlines
className="font-headline"  // Same as above

// Article body (Source Serif 4 - serif)
className="font-body"      // For article content, long-form text
className="font-serif"     // Same as font-body

// UI elements (Inter Variable - sans-serif)
className="font-sans"      // Navigation, buttons, metadata (default)

// Data/stats (JetBrains Mono - monospace)
className="font-mono"      // Race times, stats, numerical data
```

**Usage Examples:**
```tsx
<h1 className="font-playfair text-4xl font-semibold">Breaking Barriers</h1>
<p className="font-body text-lg leading-relaxed">The streets of Berlin...</p>
<nav className="font-sans">Navigation</nav>
<span className="font-mono text-sm">2:04:35</span>
```

### Pre-built Text Styles

```tsx
// Distanz-specific utility classes
className="text-title-distanz"      // Large headlines (35px/56px responsive)
className="text-h2-distanz"         // Section headers (30px)
className="text-h3-distanz"         // Sub-section headers (24px)
className="text-body-distanz"       // Article body text (17px/19px responsive)
className="text-intro-distanz"      // Lead paragraphs (21px/22px responsive)
className="text-meta-distanz"       // Metadata, captions (15px)
className="text-breadcrumb-distanz" // Navigation breadcrumbs

// With tight spacing
className="distanz-text-spacing"    // Apply to parent for proper vertical rhythm
```

### Font Sizes with Tight Line Heights

```tsx
// Tailwind size classes (with tight line-height)
className="text-xs"      // 11px, line-height: 1.25
className="text-sm"      // 13px, line-height: 1.25
className="text-base"    // 15px, line-height: 1.3
className="text-lg"      // 17px, line-height: 1.25
className="text-xl"      // 20px, line-height: 1.3
className="text-2xl"     // 24px, line-height: 1.15
className="text-3xl"     // 30px, line-height: 1.15
className="text-4xl"     // 48px, line-height: 1.1

// Exact pixel sizes (Quartr-inspired)
className="text-[17px]"  // 17px with 22px line-height
className="text-[19px]"  // 19px with 25px line-height
className="text-[21px]"  // 21px with 22px line-height
className="text-[22px]"  // 22px with 24px line-height
className="text-[35px]"  // 35px with 36px line-height
className="text-[56px]"  // 56px with 52px line-height
```

### Font Weights

```tsx
className="font-light"     // 300
className="font-regular"   // 400
className="font-medium"    // 500
className="font-semibold"  // 600 (primary weight for headlines)
className="font-bold"      // 600 (same as semibold)
```

### Line Heights

```tsx
className="leading-tight"   // 1.15 - Headlines
className="leading-snug"    // 1.25 - UI text
className="leading-normal"  // 1.35 - Body text
className="leading-relaxed" // 1.5 - Long-form reading
```

---

## Layout & Containers

### Distanz Grid System

```tsx
// Main container (Quartr-inspired 18-column grid)
<div className="distanz-container">
  <div className="distanz-full-col">
    {/* Full width content */}
  </div>
</div>

// Article layout (centered content column)
<article className="distanz-article-container">
  <div className="distanz-article-col">
    {/* Article content - centered on desktop */}
  </div>
</article>

// Legacy Quartr classes (same behavior)
<div className="quartr-container">
  <div className="quartr-article-col">
    {/* Content */}
  </div>
</div>
```

### Max Widths

```tsx
className="max-w-text"     // 720px - Optimal article reading width
className="max-w-content"  // 1200px - Standard content
className="max-w-wide"     // 1440px - Wide layouts
className="max-w-distanz"  // 1042px - Distanz container width
```

### Spacing

```tsx
// 4px base unit system
className="space-y-1"  // 4px
className="space-y-2"  // 8px
className="space-y-3"  // 12px
className="space-y-4"  // 16px
className="space-y-6"  // 24px
className="space-y-8"  // 32px
className="space-y-12" // 48px
className="space-y-16" // 64px

// Padding/Margin
className="p-4"   // 16px padding
className="px-6"  // 24px horizontal padding
className="py-8"  // 32px vertical padding
className="mt-12" // 48px top margin
```

---

## Component Patterns

### Article Card

```tsx
<article className="hover:shadow-lg transition-shadow duration-200">
  <img className="w-full aspect-video object-cover" src="..." alt="..." />
  <div className="p-6">
    <span className="text-sm font-semibold text-electric-pink uppercase tracking-wider">
      Marathon
    </span>
    <h3 className="text-2xl font-semibold font-playfair mt-2 mb-3 leading-tight">
      Breaking Barriers in Berlin
    </h3>
    <p className="text-base text-gray-600 leading-relaxed">
      How Tigist Assefa shattered the women's world record...
    </p>
    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
      <span>Sarah Johnson</span>
      <span>•</span>
      <span>Oct 30, 2025</span>
      <span>•</span>
      <span>8 min read</span>
    </div>
  </div>
</article>
```

### Button Styles

```tsx
// Primary button
<button className="bg-electric-pink text-white font-semibold text-sm uppercase tracking-wider px-6 py-3 rounded hover:bg-opacity-90 transition-all">
  Discover More
</button>

// Ghost button
<button className="border-2 border-gray-900 text-gray-900 font-semibold text-sm uppercase tracking-wider px-6 py-3 rounded hover:bg-gray-900 hover:text-white transition-all">
  Learn More
</button>

// Text link
<a className="text-electric-pink hover:underline underline-offset-2 transition-all">
  Read article →
</a>
```

### Category Tags

```tsx
// Road running
<span className="inline-block bg-electric-pink text-white text-xs font-bold uppercase tracking-widest px-2 py-1 rounded">
  Road
</span>

// Trail running
<span className="inline-block bg-trail-brown text-white text-xs font-bold uppercase tracking-widest px-2 py-1 rounded">
  Trail
</span>

// Track & Field
<span className="inline-block bg-track-red text-white text-xs font-bold uppercase tracking-widest px-2 py-1 rounded">
  Track
</span>

// Breaking news
<span className="inline-block bg-signal-orange text-white text-xs font-bold uppercase tracking-widest px-2 py-1 rounded">
  Breaking
</span>
```

### Article Hero

```tsx
<section className="relative w-full h-screen">
  <img className="absolute inset-0 w-full h-full object-cover" src="..." alt="..." />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
  <div className="relative h-full flex items-end pb-20">
    <div className="distanz-container">
      <div className="distanz-article-col">
        <span className="text-sm font-bold text-white uppercase tracking-wider mb-4 block">
          Marathon
        </span>
        <h1 className="text-title-distanz text-white mb-6">
          Breaking Barriers in Berlin
        </h1>
        <p className="text-intro-distanz text-white/90 mb-6">
          How Tigist Assefa shattered the women's world record
        </p>
        <div className="flex items-center gap-4 text-sm text-white/80">
          <span>By Sarah Johnson</span>
          <span>•</span>
          <span>Oct 30, 2025</span>
          <span>•</span>
          <span>8 min read</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Article Body

```tsx
<article className="distanz-article-container distanz-text-spacing">
  <div className="distanz-article-col">
    <p className="text-body-distanz">
      The streets of Berlin witnessed history as Tigist Assefa...
    </p>

    <h2 className="text-h2-distanz">
      A Record-Breaking Performance
    </h2>

    <p className="text-body-distanz">
      From the starting gun, it was clear that this was going to be...
    </p>

    <h3 className="text-h3-distanz">
      Training and Preparation
    </h3>

    <p className="text-body-distanz">
      Assefa's journey to this moment began months earlier...
    </p>
  </div>
</article>
```

### Data Tables (Race Results)

```tsx
<div className="overflow-x-auto">
  <table className="w-full border-collapse">
    <thead className="bg-gray-100 border-b-2 border-gray-300">
      <tr>
        <th className="text-left py-3 px-4 font-semibold text-sm uppercase tracking-wider text-gray-700">
          Place
        </th>
        <th className="text-left py-3 px-4 font-semibold text-sm uppercase tracking-wider text-gray-700">
          Name
        </th>
        <th className="text-right py-3 px-4 font-semibold text-sm uppercase tracking-wider text-gray-700">
          Time
        </th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-gray-200 hover:bg-gray-50">
        <td className="py-3 px-4 font-mono text-gray-900">1</td>
        <td className="py-3 px-4 text-gray-900">Tigist Assefa</td>
        <td className="py-3 px-4 font-mono text-right text-gray-900">2:11:53</td>
      </tr>
      {/* More rows... */}
    </tbody>
  </table>
</div>
```

---

## Dark Mode Support

```tsx
// Dark mode classes (automatically switch with .dark parent)
className="bg-white dark:bg-gray-900"
className="text-gray-900 dark:text-white"
className="border-gray-300 dark:border-gray-700"

// Text colors (auto-adjust via CSS variables)
className="text-textDefault"   // Auto-adjusts for dark mode
className="text-textSubtle"    // Auto-adjusts for dark mode
```

---

## Transitions & Animations

```tsx
// Standard transitions
className="transition-all duration-200"     // Fast (150ms)
className="transition-all duration-300"     // Base (250ms)
className="transition-colors duration-200"  // Color changes only

// Hover effects
className="hover:scale-105 transition-transform"
className="hover:shadow-lg transition-shadow"
className="hover:-translate-y-1 transition-transform"

// Focus states
className="focus:outline-none focus:ring-2 focus:ring-electric-pink focus:ring-offset-2"
```

---

## Accessibility

```tsx
// Focus indicators (always visible)
className="focus-visible:outline-2 focus-visible:outline-electric-pink focus-visible:outline-offset-2"

// Screen reader text
<span className="sr-only">Navigate to homepage</span>

// Semantic HTML
<article>, <section>, <nav>, <header>, <footer>, <main>, <aside>

// ARIA labels
<button aria-label="Close menu">
  <span className="material-symbols-outlined">close</span>
</button>
```

---

## Content Category Treatments

### Road Running
- Primary color: Electric Pink
- Typography: Clean sans-serif heavy
- Aesthetic: Urban, modern, high-energy

### Trail Running
- Primary color: Trail Brown
- Typography: Mix of serif and sans
- Aesthetic: Organic, natural, adventurous

### Track & Field
- Primary color: Track Red
- Typography: Bold, data-heavy
- Aesthetic: High-contrast, performance-focused

### Features & Long Reads
- Typography: Playfair Display headlines
- Layout: Magazine-style, full-bleed images
- Aesthetic: Editorial, sophisticated

---

## Common Mistakes to Avoid

1. **Don't mix old Quartr references with new Distanz classes** - Use `distanz-*` classes for new components
2. **Don't forget tight line heights** - Use `leading-tight`, `leading-snug`, or pre-built text classes
3. **Don't use default Tailwind text sizes without modification** - Use Distanz text utilities or custom pixel sizes
4. **Don't forget the `distanz-font-features` class on Inter text** - Ensures proper OpenType features
5. **Don't use loose spacing** - Follow the 4px base unit system
6. **Don't forget hover/focus states** - All interactive elements need clear feedback

---

## Migration Guide (Quartr → Distanz)

| Old (Quartr) | New (Distanz) | Notes |
|--------------|---------------|-------|
| `.quartr-container` | `.distanz-container` | Same behavior, new naming |
| `.quartr-article-col` | `.distanz-article-col` | Same behavior |
| `.text-title-quartr` | `.text-title-distanz` | Updated brand colors |
| `.text-body-quartr` | `.text-body-distanz` | Same typography |
| `primary` color | `electric-pink` | More descriptive naming |

**Legacy classes still work** - No rush to migrate, but use new classes for new components.

---

## Resources

- **Design tokens**: `distanz-design-tokens.css`
- **Design guidelines**: `distanz-design-system.md`
- **Tailwind config**: `tailwind.config.js`
- **Global styles**: `src/app/globals.css`
- **Constants**: `src/lib/constants.ts`
- **Logo assets**: `public/images/Distanz_Logo_*`

---

## Quick Start Template

```tsx
import { BRAND } from '@/lib/constants'

export default function MyComponent() {
  return (
    <div className="distanz-container py-16">
      <div className="distanz-article-col">
        <h1 className="text-title-distanz mb-6">
          Welcome to Distanz Running
        </h1>
        <p className="text-body-distanz text-gray-700 mb-8">
          Your source for running journalism, training guides, and race coverage.
        </p>
        <button className="bg-electric-pink text-white font-semibold text-sm uppercase tracking-wider px-6 py-3 rounded hover:bg-opacity-90 transition-all">
          Get Started
        </button>
      </div>
    </div>
  )
}
```

---

**Last Updated**: October 2025
**Version**: 1.0 (Distanz Rebrand)
