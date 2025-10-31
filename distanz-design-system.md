# Distanz Running Design System
## Brand Identity & Web Typography Guide

---

## 1. Brand Philosophy

### Core Principles
- **Precision**: Clean, measured design reflecting the precision of athletic performance
- **Movement**: Dynamic typography and layout that suggests forward motion
- **Authority**: Professional, magazine-quality editorial design
- **Accessibility**: Clear hierarchy and readable at all sizes

### Visual Character
The Distanz logo's playful yet bold character—with its flowing 'S' curve mimicking a running path—should inform the entire design language. The website should feel both serious (for journalism) and energetic (for running culture).

---

## 2. Typography System

### Primary Typefaces

#### Display & Headlines
**Font Family**: "JG Jayagiri Sans" (for brand consistency with logo)
- Use for: Hero headlines, section headers, special features
- Fallback: "Helvetica Neue", "Arial", sans-serif
- Note: Limited use to maintain impact

#### Editorial Headlines
**Font Family**: "Tiempos Headline" or "GT Sectra Display"
- Use for: Article headlines, feature stories
- Character: Sharp serifs with athletic tension
- Weights: Light (300), Regular (400), Bold (700)
- Fallback: "Georgia", "Times New Roman", serif

#### Body Text
**Font Family**: "Tiempos Text" or "Source Serif Pro"
- Use for: Long-form articles, race guides, features
- Character: Highly readable with contemporary serifs
- Size: 18-20px on desktop, 16-18px on mobile
- Line height: 1.6-1.75
- Fallback: "Georgia", serif

#### Supporting Text
**Font Family**: "Inter" or "Source Sans Pro"
- Use for: Navigation, metadata, captions, UI elements
- Weights: Regular (400), Medium (500), Semi-Bold (600), Bold (700)
- Fallback: system-ui, -apple-system, sans-serif

#### Data & Statistics
**Font Family**: "Roboto Mono" or "JetBrains Mono"
- Use for: Race times, statistics, data tables
- Character: Monospaced for numerical alignment
- Fallback: "Courier New", monospace

### Type Scale (Desktop)

```css
--type-scale: {
  display: 72px,      /* Hero headlines */
  h1: 48px,           /* Main article headlines */
  h2: 36px,           /* Section headers */
  h3: 28px,           /* Sub-sections */
  h4: 24px,           /* Card titles */
  h5: 20px,           /* Smaller headers */
  body-large: 20px,   /* Lead paragraphs */
  body: 18px,         /* Article text */
  body-small: 16px,   /* Supporting text */
  caption: 14px,      /* Metadata, captions */
  micro: 12px         /* Labels, tags */
}
```

### Type Scale (Mobile)

```css
--type-scale-mobile: {
  display: 48px,
  h1: 36px,
  h2: 28px,
  h3: 24px,
  h4: 20px,
  h5: 18px,
  body-large: 18px,
  body: 16px,
  body-small: 14px,
  caption: 13px,
  micro: 11px
}
```

---

## 3. Color System

### Primary Palette

#### Core Colors
```css
--colors-primary: {
  black: #0A0A0A,        /* Primary black (slightly warmer) */
  white: #FFFFFF,        /* Pure white */
  off-white: #FAFAF8,    /* Background white */
  gray-900: #1A1A1A,     /* Headlines */
  gray-800: #2D2D2D,     /* Subheadings */
  gray-700: #404040,     /* Body text */
  gray-600: #595959,     /* Secondary text */
  gray-500: #737373,     /* Captions */
  gray-400: #A6A6A6,     /* Disabled */
  gray-300: #D9D9D9,     /* Borders */
  gray-200: #E6E6E6,     /* Dividers */
  gray-100: #F5F5F5      /* Backgrounds */
}
```

#### Accent Colors
```css
--colors-accent: {
  electric-pink: #e43c81,    /* Primary action, links */
  volt-green: #00D464,       /* Success, positive stats */
  signal-orange: #FF5722,    /* Breaking news, alerts */
  pace-purple: #7C3AED,      /* Premium content */
  trail-brown: #8B4513,      /* Trail running content */
  track-red: #DC2626         /* Track & field content */
}
```

#### Semantic Colors
```css
--colors-semantic: {
  breaking: #FF5722,         /* Breaking news */
  feature: #7C3AED,          /* Featured content */
  interactive: #e43c81,      /* Interactive elements */
  data-positive: #00D464,    /* Positive metrics */
  data-negative: #DC2626,    /* Negative metrics */
  warning: #F59E0B,          /* Warnings */
  info: #e43c81              /* Information */
}
```

### Dark Mode Palette
```css
--colors-dark: {
  background: #0A0A0A,
  surface: #1A1A1A,
  surface-raised: #2D2D2D,
  text-primary: #FAFAF8,
  text-secondary: #A6A6A6,
  border: #404040
}
```

---

## 4. Spacing System

### Base Unit: 4px

```css
--spacing: {
  0: 0,
  1: 4px,
  2: 8px,
  3: 12px,
  4: 16px,
  5: 20px,
  6: 24px,
  8: 32px,
  10: 40px,
  12: 48px,
  16: 64px,
  20: 80px,
  24: 96px,
  32: 128px
}
```

### Content Width
```css
--max-width: {
  text: 720px,          /* Long-form articles */
  content: 1200px,      /* Standard content */
  wide: 1440px,        /* Wide layouts */
  full: 1920px         /* Full-width sections */
}
```

---

## 5. Component Patterns

### Article Cards

#### Breaking News Card
- Bold sans-serif headline (Inter Bold)
- Red "BREAKING" label
- High contrast
- Time stamp prominent

#### Feature Card
- Serif headline (Tiempos Headline)
- Large hero image
- Author byline with avatar
- Reading time indicator

#### Standard News Card
- Balanced image-to-text ratio
- Category tag (color-coded)
- Headline + standfirst
- Metadata in gray-500

### Navigation

#### Primary Navigation
- Sans-serif (Inter Medium)
- All caps, letter-spacing: 0.05em
- Sticky header with blur backdrop
- Mobile: Hamburger to full-screen overlay

#### Section Navigation
- Horizontal scroll on mobile
- Pill-shaped active states
- Category color accents

### Article Layout

#### Hero Section
- Full-width image or video
- Overlay gradient for text legibility
- Display headline over image
- Scroll indicator animation

#### Article Body
- Max-width: 720px centered
- Generous white space
- Pull quotes in larger serif
- Inline images with captions
- Related articles sidebar

### Data Visualization

#### Race Results Tables
- Monospace for times
- Alternating row colors
- Sortable columns
- Responsive horizontal scroll

#### Performance Charts
- Clean, minimal style
- Brand accent colors
- Interactive tooltips
- Mobile-optimized

---

## 6. Interactive Elements

### Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--electric-pink);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
}
```

#### Ghost Button
```css
.btn-ghost {
  border: 2px solid currentColor;
  background: transparent;
  padding: 10px 22px;
  /* Similar typography as primary */
}
```

### Links
- Default: Electric pink, no underline
- Hover: Underline appears with transition
- Visited: Darker pink (#c22d66)
- Article links: Inherit color, underline on hover

### Form Elements
- Minimal borders (1px gray-300)
- Focus state: 2px electric-pink outline
- Labels: Inter Medium, gray-700
- Helper text: Inter Regular, gray-500

---

## 7. Motion & Animation

### Principles
- Performance-focused (60fps)
- Subtle, not distracting
- Enhance content hierarchy
- Mobile-first performance

### Standard Transitions
```css
--transition: {
  fast: 150ms ease,
  base: 250ms ease,
  slow: 350ms ease,
  lazy: 500ms ease
}
```

### Scroll Animations
- Parallax on hero images (subtle)
- Fade-in for article images
- Progress indicator for long reads
- Sticky elements with opacity transitions

---

## 8. Responsive Breakpoints

```css
--breakpoints: {
  mobile: 320px,
  mobile-l: 425px,
  tablet: 768px,
  desktop: 1024px,
  desktop-l: 1440px,
  desktop-xl: 1920px
}
```

---

## 9. Implementation Guidelines

### Next.js Configuration

#### Font Loading Strategy
```javascript
// Use next/font for optimal loading
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const jayagiri = localFont({
  src: './fonts/JGJayagiriSans.woff2',
  variable: '--font-jayagiri'
})
```

### CSS Architecture
- CSS Modules for component styles
- CSS Variables for design tokens
- Tailwind CSS for utilities (optional)
- PostCSS for optimizations

### Performance Considerations
- Lazy load below-the-fold images
- Preload critical fonts
- Use WebP/AVIF for images
- Implement responsive images
- Cache typography CSS

### Accessibility
- WCAG AAA contrast ratios for body text
- Focus indicators on all interactive elements
- Semantic HTML structure
- Skip navigation links
- Alt text for all images
- Readable font sizes (min 16px)

---

## 10. Content Categories & Visual Treatment

### Road Running
- Clean, urban aesthetic
- Pink accent color
- Sans-serif heavy

### Trail Running
- Organic, natural feel
- Earth tones (browns, greens)
- More photographic

### Track & Field
- Bold, high-contrast
- Red accent color
- Data-heavy layouts

### Features & Long Reads
- Magazine-style layouts
- Large typography
- Full-bleed images
- Drop caps for articles

### Breaking News
- High urgency design
- Red accents
- Sans-serif headlines
- Prominent timestamps

---

## 11. Example Component Structures

### Article Hero Component
```jsx
<article className="article-hero">
  <div className="hero-image">
    {/* Full-width image with gradient overlay */}
  </div>
  <div className="hero-content">
    <span className="category">MARATHON</span>
    <h1 className="headline-display">
      Breaking Barriers in Berlin
    </h1>
    <p className="standfirst">
      How Tigist Assefa shattered the women's world record
    </p>
    <div className="metadata">
      <span className="author">By Sarah Johnson</span>
      <span className="date">Oct 30, 2025</span>
      <span className="read-time">8 min read</span>
    </div>
  </div>
</article>
```

### Race Guide Component
```jsx
<div className="race-guide">
  <header className="guide-header">
    <h2>Boston Marathon 2026</h2>
    <div className="quick-stats">
      <stat>26.2 miles</stat>
      <stat>30,000 runners</stat>
      <stat>April 21, 2026</stat>
    </div>
  </header>
  {/* Interactive course map */}
  {/* Elevation profile */}
  {/* Key information cards */}
</div>
```

---

## 12. Brand Voice in UI

### Tone Attributes
- **Authoritative** but approachable
- **Precise** but not clinical
- **Energetic** but not hyperbolic
- **Inclusive** of all running levels

### Microcopy Examples
- CTA: "DISCOVER MORE" not "Click here"
- Loading: "Tracking your pace..." not "Loading..."
- Error: "We've hit the wall" not "Error 404"
- Subscribe: "Join the pack" not "Subscribe"

---

## Summary

This design system balances the playful energy of your Distanz brand with the sophistication needed for serious running journalism. The typography mixing—bold sans for impact, elegant serifs for long reads, and monospace for data—creates visual variety while maintaining coherence. The color system uses restraint with strategic pops of energy, perfect for a sport that's both meditative and explosive.

The key is maintaining this balance: professional enough for serious athletes and journalists, accessible enough for casual runners, and dynamic enough to capture the sport's inherent energy.