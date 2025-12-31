# Distanz Running Design System Reference

## Quick Reference Guide for Development

This document provides a practical reference for implementing the Distanz design system in code. The design system uses a two-font pairing with Garvis Pro for display/headlines and Quasimoda for body/UI.

---

## Typography

### Font System Overview

**Distanz uses a streamlined two-font pairing:**
- **Garvis Pro** (sans-serif display) - Headlines, hero sections, pull quotes
- **Quasimoda** (sans-serif body) - Body text, UI, navigation, forms, metadata
- **JetBrains Mono** (monospace) - Race times, statistics, data (optional)

**Fonts are loaded via Adobe Fonts (Typekit):**
- Set up your Adobe Fonts project with Garvis Pro and Quasimoda
- Add the project ID to `layout.tsx` where indicated
- The fonts will be available globally as `garvis-pro` and `quasimoda`

### Font Families

```tsx
// Display/Headlines (Garvis Pro)
className="font-headline"  // Garvis Pro for H1-H3, hero sections
className="font-display"   // Same as headline
className="font-garvis"    // Direct font name

// Body/UI (Quasimoda)
className="font-body"      // Quasimoda for paragraphs, body text
className="font-ui"        // Quasimoda for navigation, buttons, forms
className="font-quasimoda" // Direct font name
className="font-sans"      // Default sans (maps to Quasimoda)

// Data/Stats (JetBrains Mono)
className="font-mono"      // Race times, statistics, code
```

### Font Weights

**Garvis Pro weights:**
- `font-normal` (400) - H3 subsections
- `font-semibold` (600) - H2 sections, stat callouts, newsletter headers
- `font-bold` (700) - H1 hero headlines

**Quasimoda weights:**
- `font-normal` (400) - Body text, lead paragraphs, captions
- `font-medium` (500) - Metadata, navigation, form labels, stat labels
- `font-semibold` (600) - H4-H6 headings, buttons/CTAs

### Heading Hierarchy

**H1 - Hero Headlines (Garvis Pro Bold)**
```tsx
className="text-h1-distanz"
// Mobile: 48px / 1.1 line-height / -0.02em letter-spacing
// Desktop: 64px / 1.05 line-height / -0.02em letter-spacing
// Use for: Article titles, marathon showcase headers, main page titles
```

**H2 - Major Sections (Garvis Pro SemiBold)**
```tsx
className="text-h2-distanz"
// Mobile: 32px / 1.25 line-height / -0.01em letter-spacing
// Desktop: 40px / 1.2 line-height / -0.01em letter-spacing
// Use for: Primary article sections, race review segments
```

**H3 - Subsections (Garvis Pro Regular)**
```tsx
className="text-h3-distanz"
// Mobile: 24px / 1.3 line-height
// Desktop: 28px / 1.3 line-height
// Use for: Sub-topics within sections
```

**H4-H6 - Minor Headings (Quasimoda SemiBold)**
```tsx
className="text-h4-distanz"  // 18-20px / 1.4 line-height
className="text-h5-distanz"  // 18-20px / 1.4 line-height
className="text-h6-distanz"  // 16-18px / 1.4 line-height
// Use for: Detailed breakdowns, FAQ items
```

### Body & Content Styles

**Body Text (Quasimoda Regular)**
```tsx
className="text-body-distanz"
// Mobile: 16px / 1.6 line-height
// Desktop: 18px / 1.7 line-height
// Use for: Article content, race descriptions

// Alternative: Use Tailwind sizes
className="text-body font-body"       // 16px / 1.6 line-height
className="text-body-lg font-body"    // 18px / 1.6 line-height
```

**Lead Paragraphs (Quasimoda Regular)**
```tsx
className="text-lead-distanz"
// Mobile: 20px / 1.5 line-height
// Desktop: 22px / 1.5 line-height
// Use for: Article introductions

// Alternative: Use Tailwind sizes
className="text-lead font-body"       // 20px / 1.5 line-height
className="text-lead-lg font-body"    // 22px / 1.5 line-height
```

**Captions (Quasimoda Regular)**
```tsx
className="text-caption-distanz"
// 14px / 1.5 line-height / 70% opacity
// Use for: Image captions, photo credits
```

### UI & Metadata Styles

**Metadata Bar (Quasimoda Medium, Uppercase)**
```tsx
className="text-meta-distanz"
// Mobile: 12px / 1.5 line-height / 0.08em letter-spacing / uppercase
// Desktop: 13px / 1.5 line-height
// Use for: "7 DEC 2025 | 5 MIN READ | MARATHON GUIDE"

// Alternative: Use Tailwind sizes
className="text-xs font-medium uppercase tracking-wide"
className="text-sm font-medium uppercase tracking-wide"
```

**Navigation (Quasimoda Medium)**
```tsx
className="text-nav-distanz"
// Mobile: 14px / 1.5 line-height
// Desktop: 15px / 1.5 line-height
// Use for: Navigation menus

// Alternative: Use Tailwind sizes
className="text-base font-ui font-medium"   // 14px
className="text-md font-ui font-medium"     // 15px
```

**Buttons/CTAs (Quasimoda SemiBold, Uppercase)**
```tsx
className="text-button-distanz"
// Mobile: 14px / 1.5 line-height / uppercase
// Desktop: 16px / 1.5 line-height / uppercase
// Use for: "READ FULL REVIEW", "SUBSCRIBE NOW"

// Alternative: Use Tailwind sizes
className="text-base font-ui font-semibold uppercase"
```

**Form Labels (Quasimoda Medium)**
```tsx
className="text-label-distanz"
// 14px / 1.5 line-height
// Use for: Newsletter signup fields, form inputs
```

### Special Elements

**Pull Quotes (Garvis Pro Medium)**
```tsx
className="text-quote-distanz"
// Mobile: 24px / 1.4 line-height
// Desktop: 28px / 1.4 line-height
// Optional: Add color accent with text-electric-pink or similar

// Alternative: Use Tailwind sizes
className="text-quote font-headline font-medium"     // 24px
className="text-quote-lg font-headline font-medium"  // 28px
```

**Stat Callouts (Garvis Pro SemiBold)**
```tsx
// Large number
className="text-stat-distanz"
// Mobile: 32px / 1 line-height / -0.01em letter-spacing
// Desktop: 48px / 1 line-height / -0.02em letter-spacing

// Label below (Quasimoda Medium, Uppercase)
className="text-stat-label-distanz"
// 12px / 1.5 line-height / 0.08em letter-spacing / uppercase

// Example:
<div>
  <div className="text-stat-distanz">2:29:45</div>
  <div className="text-stat-label-distanz">COURSE RECORD</div>
</div>

// Alternative: Use Tailwind sizes
className="text-stat font-headline font-semibold"     // 32px
className="text-stat-lg font-headline font-semibold"  // 48px
```

**Race Quick Stats (Sidebar)**
```tsx
// Labels
className="text-stat-label-distanz"  // or text-xs font-medium uppercase

// Values
className="text-body-distanz"        // or text-body font-body

// Example:
<div>
  <div className="text-stat-label-distanz">DISTANCE</div>
  <div className="text-body-distanz">42.195km</div>
</div>
```

**Newsletter Signup Headers (Garvis Pro SemiBold)**
```tsx
className="text-newsletter-heading-distanz"
// Mobile: 28px / 1.3 line-height / -0.01em letter-spacing
// Desktop: 32px / 1.3 line-height

// Subtext
className="text-body-distanz"  // 16-18px regular
```

### Tailwind Typography Scale

**New semantic sizing system:**

```tsx
// Metadata & Small Text
className="text-xs"      // 12px / 1.5 / 0.08em tracking (uppercase metadata)
className="text-sm"      // 13px / 1.5 / 0.08em tracking (uppercase metadata)

// UI & Forms
className="text-base"    // 14px / 1.5 (form labels, buttons)
className="text-md"      // 15px / 1.5 (navigation)

// Body Content
className="text-body"    // 16px / 1.6 (body text)
className="text-body-lg" // 18px / 1.6 (body text desktop)

// Lead Paragraphs
className="text-lead"    // 20px / 1.5 (intro paragraphs)
className="text-lead-lg" // 22px / 1.5 (intro paragraphs desktop)

// Pull Quotes
className="text-quote"    // 24px / 1.4
className="text-quote-lg" // 28px / 1.4

// Headings
className="text-h6"      // 16px / 1.4 (Quasimoda SemiBold)
className="text-h5"      // 18px / 1.4 (Quasimoda SemiBold)
className="text-h4"      // 20px / 1.4 (Quasimoda SemiBold)
className="text-h3"      // 24px / 1.3 (Garvis Pro Regular)
className="text-h3-lg"   // 28px / 1.3
className="text-h2"      // 32px / 1.25 (Garvis Pro SemiBold)
className="text-h2-lg"   // 40px / 1.2
className="text-h1"      // 48px / 1.1 (Garvis Pro Bold)
className="text-h1-lg"   // 64px / 1.05

// Stat Callouts
className="text-stat"    // 32px / 1 (Garvis Pro SemiBold)
className="text-stat-lg" // 48px / 1

// Legacy Tailwind (still work)
className="text-xl"      // 20px / 1.5
className="text-2xl"     // 24px / 1.4
className="text-3xl"     // 30px / 1.3
className="text-4xl"     // 36px / 1.2
className="text-5xl"     // 48px / 1.1
```

### Color & Weight Guidelines

**Text Color Opacity:**
```tsx
// Headlines: Full color
className="text-gray-900"  // or text-textDefault (100% opacity)

// Body text: Slightly muted
className="text-gray-700"  // or use opacity-90 (85-90% opacity)

// Metadata/Captions: More muted
className="text-gray-500"  // or text-textSubtle (70% opacity)
```

**Weight Usage Best Practices:**
- Never use more than 2 weights of Garvis in one view
- Quasimoda Regular (400) is your workhorse - use it most
- Quasimoda Medium (500) / SemiBold (600) for emphasis only
- Garvis Bold (700) reserved for H1 only
- Garvis SemiBold (600) for H2 and important callouts
- Garvis Regular (400) for H3

### Responsive Typography Examples

**Article Title:**
```tsx
<h1 className="text-h1-distanz">
  Boston Marathon 2025 Complete Guide
</h1>

// Or using Tailwind utilities:
<h1 className="font-headline font-bold text-h1 lg:text-h1-lg leading-tight">
  Boston Marathon 2025 Complete Guide
</h1>
```

**Article Section:**
```tsx
<h2 className="text-h2-distanz mt-8 mb-4">
  Course Breakdown
</h2>

<p className="text-body-distanz mb-4">
  The Boston Marathon course is known for its challenging hills...
</p>
```

**Metadata Bar:**
```tsx
<div className="text-meta-distanz">
  7 DEC 2025 | 5 MIN READ | MARATHON GUIDE
</div>

// Or using Tailwind utilities:
<div className="text-xs md:text-sm font-medium uppercase tracking-wide text-gray-500">
  7 DEC 2025 | 5 MIN READ | MARATHON GUIDE
</div>
```

**Stat Callout:**
```tsx
<div className="text-center">
  <div className="text-stat-distanz">2:29:45</div>
  <div className="text-stat-label-distanz">COURSE RECORD</div>
</div>
```

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

## Layout System

### Container System

```tsx
// Main grid container (4 cols mobile → 18 cols desktop)
className="distanz-container"
// Width: 95% max-width
// Columns: 4 (mobile) / 18 (desktop)
// Gap: 1.25rem (20px)
// Padding: 1.5rem (24px) left/right

// Article container with top padding
className="distanz-article-container"
// Same as distanz-container + 80px top padding

// Full-width column
className="distanz-full-col"
// Grid column: span full width (1 / -1)

// Article content column (centered, narrower)
className="distanz-article-col"
// Grid column: 1 / -1 (mobile)
// Grid column: 4 / 14 (desktop - 10 columns centered)
```

### Layout Examples

**Standard Page:**
```tsx
<div className="distanz-container py-12">
  <div className="distanz-full-col">
    {/* Full-width content */}
  </div>
</div>
```

**Article Page:**
```tsx
<div className="distanz-article-container">
  <article className="distanz-article-col">
    <h1 className="text-h1-distanz mb-6">Article Title</h1>
    <p className="text-lead-distanz mb-8">Lead paragraph...</p>
    <p className="text-body-distanz">Body content...</p>
  </article>
</div>
```

---

## Spacing System

**4px Base Unit:**
```tsx
className="space-y-1"    // 4px
className="space-y-2"    // 8px
className="space-y-3"    // 12px
className="space-y-4"    // 16px
className="space-y-6"    // 24px
className="space-y-8"    // 32px
className="space-y-12"   // 48px
className="space-y-16"   // 64px
```

**Recommended Spacing for Typography:**
```tsx
// Between sections
className="mb-8"  // 32px after H2

// Between paragraphs
className="mb-4"  // 16px after body text

// Between heading and paragraph
className="mb-3"  // 12px after H3
className="mb-4"  // 16px after H2
```

---

## Component Patterns

### Article Card

```tsx
<article className="bg-white border border-gray-200 hover:border-electric-pink transition-colors">
  <img src="..." alt="..." className="w-full aspect-[16/9] object-cover" />
  <div className="p-6">
    <div className="text-meta-distanz mb-3">
      MARATHON GUIDE | 5 MIN READ
    </div>
    <h3 className="text-h3-distanz mb-3">
      Boston Marathon 2025 Guide
    </h3>
    <p className="text-body-distanz text-gray-600">
      Everything you need to know about running Boston...
    </p>
  </div>
</article>
```

### Hero Section

```tsx
<section className="distanz-container py-16">
  <div className="distanz-full-col max-w-4xl">
    <h1 className="text-h1-distanz mb-6">
      Breaking Barriers
    </h1>
    <p className="text-lead-distanz text-gray-600 mb-8">
      The story of how Eliud Kipchoge became the first person to run a marathon under two hours.
    </p>
    <button className="text-button-distanz bg-electric-pink text-white px-6 py-3 hover:bg-opacity-90">
      Read Full Story
    </button>
  </div>
</section>
```

### Stat Display

```tsx
<div className="grid grid-cols-3 gap-8 text-center">
  <div>
    <div className="text-stat-distanz text-electric-pink">2:29:45</div>
    <div className="text-stat-label-distanz">Course Record</div>
  </div>
  <div>
    <div className="text-stat-distanz text-volt-green">28,342</div>
    <div className="text-stat-label-distanz">Finishers</div>
  </div>
  <div>
    <div className="text-stat-distanz">42.195km</div>
    <div className="text-stat-label-distanz">Distance</div>
  </div>
</div>
```

---

## Best Practices

### Typography Hierarchy
1. **Use one H1 per page** (Garvis Pro Bold)
2. **Limit Garvis Pro usage** - Headlines and special elements only
3. **Quasimoda is your workhorse** - Use for most content
4. **Maintain weight consistency** - Don't mix too many weights

### Responsive Design
1. **Mobile-first approach** - Start with mobile sizes
2. **Use responsive utilities** - `text-h1` vs `lg:text-h1-lg`
3. **Test at breakpoints** - 640px, 768px, 1024px, 1280px

### Performance
1. **Use pre-built utilities** - `.text-h1-distanz` instead of multiple classes
2. **Limit font weights** - Only load necessary weights
3. **Font loading** - Adobe Fonts loads asynchronously with FOUT prevention

### Accessibility
1. **Maintain contrast** - 4.5:1 minimum for body text
2. **Semantic HTML** - Use proper heading hierarchy (H1→H2→H3)
3. **Focus states** - Use `focus:ring-2 focus:ring-electric-pink`

---

## Migration from Old System

If you're updating from the previous Playfair Display + Inter system:

**Font Family Changes:**
```tsx
// Old → New
font-playfair    → font-headline (now Garvis Pro)
font-inter       → font-body (now Quasimoda)
font-body        → font-body (still works, now Quasimoda)
font-serif       → font-headline (now Garvis Pro sans-serif)
```

**Utility Class Changes:**
- All `.text-*-distanz` classes have been updated to match new specs
- Line heights adjusted for better readability (1.6-1.7 for body)
- Metadata now uses uppercase by default with increased tracking
- Stat callouts now use tighter line-heights (1.0)

**What Stays the Same:**
- Container system (`.distanz-container`, etc.)
- Color palette (all brand colors unchanged)
- Spacing system (4px base unit)
- Semantic color variables

---

## Quick Start Checklist

### Setting Up Adobe Fonts

1. Go to [Adobe Fonts](https://fonts.adobe.com)
2. Create a new web project
3. Add **Garvis Pro** (weights: 400, 600, 700)
4. Add **Quasimoda** (weights: 400, 500, 600)
5. Copy your project ID
6. Update `/src/app/layout.tsx` - replace `YOUR_PROJECT_ID` with your actual ID
7. Verify fonts load by inspecting computed styles in browser DevTools

### Common Tasks

**Creating a new article page:**
```tsx
<div className="distanz-article-container">
  <article className="distanz-article-col">
    <div className="text-meta-distanz mb-4">
      {date} | {readTime} | {category}
    </div>
    <h1 className="text-h1-distanz mb-6">{title}</h1>
    <p className="text-lead-distanz text-gray-600 mb-8">{intro}</p>
    <div className="prose">
      {/* Body content with text-body-distanz */}
    </div>
  </article>
</div>
```

**Adding a CTA button:**
```tsx
<button className="text-button-distanz bg-electric-pink text-white px-6 py-3 rounded hover:bg-opacity-90 transition-all">
  Subscribe Now
</button>
```

**Creating a stat card:**
```tsx
<div className="bg-white border border-gray-200 p-8 text-center">
  <div className="text-stat-distanz text-electric-pink mb-2">2:04:35</div>
  <div className="text-stat-label-distanz mb-4">World Record</div>
  <p className="text-body-distanz text-gray-600">Set by Eliud Kipchoge</p>
</div>
```

---

## Need Help?

- **Design System Docs:** See `distanz-design-system.md` for detailed guidelines
- **Project Instructions:** See `CLAUDE.md` for development conventions
- **Typography Constants:** Check `/src/lib/constants.ts` for programmatic access
- **CSS Variables:** See `globals.css` for all CSS custom properties
