# Distanz Running Typography Design System

## Primary Typefaces
- **Archivo Black** - Headlines/Display
- **Bricolage Grotesque** - Body/UI
- **JetBrains Mono** - Data/Metadata

---

## TYPE SCALE & HIERARCHY

### H1 - Hero Headlines
```css
font-family: 'Archivo Black', sans-serif;
font-size: clamp(40px, 5vw + 1rem, 72px);
line-height: 0.95;
letter-spacing: -0.02em;
font-weight: 400; /* Archivo Black only has 400 */
```
- **Desktop:** 64-72px
- **Tablet:** 48-56px  
- **Mobile:** 40-44px
- **Use Cases:** Article heroes, marathon showcase headers

### H2 - Section Headers
```css
font-family: 'Archivo Black', sans-serif;
font-size: clamp(32px, 4vw + 0.5rem, 48px);
line-height: 1.0;
letter-spacing: -0.015em;
font-weight: 400;
```
- **Desktop:** 42-48px
- **Tablet:** 36-40px
- **Mobile:** 32-34px
- **Use Cases:** Major article sections

### H3 - Subsections
```css
font-family: 'Archivo Black', sans-serif;
font-size: clamp(24px, 3vw, 32px);
line-height: 1.1;
letter-spacing: -0.01em;
font-weight: 400;
```
- **Desktop:** 28-32px
- **Tablet:** 26-28px
- **Mobile:** 24px
- **Use Cases:** Subsections within articles

### H4-H6 - Minor Headings
```css
font-family: 'Bricolage Grotesque', sans-serif;
font-size: clamp(18px, 2vw, 24px);
line-height: 1.2;
letter-spacing: -0.005em;
font-weight: 700; /* or 800 for more impact */
```
- **Desktop:** 20-24px
- **Mobile:** 18-20px

---

## BODY & CONTENT

### Body Text
```css
font-family: 'Bricolage Grotesque', sans-serif;
font-size: 17px;
line-height: 1.65;
letter-spacing: -0.003em;
font-weight: 400;
max-width: 680px; /* Optimal reading width */
```
- **Desktop:** 17-18px
- **Mobile:** 16px
- **Paragraph spacing:** 1.2em

### Lead Paragraphs
```css
font-family: 'Bricolage Grotesque', sans-serif;
font-size: clamp(19px, 2vw, 22px);
line-height: 1.5;
letter-spacing: -0.005em;
font-weight: 450; /* Variable weight if supported */
```
- **Desktop:** 21-22px
- **Mobile:** 19-20px

### Small Text / Captions
```css
font-family: 'Bricolage Grotesque', sans-serif;
font-size: 14px;
line-height: 1.4;
letter-spacing: 0;
font-weight: 500;
opacity: 0.8;
```

---

## DATA & METADATA

### Date/Time Stamps
```css
font-family: 'JetBrains Mono', monospace;
font-size: 13px;
line-height: 1;
letter-spacing: 0.02em;
font-weight: 400;
text-transform: uppercase;
```
**Example:** `07 DEC 2024 | 5 MIN READ`

### Race Stats / Data Tables

#### Headers
```css
font-family: 'JetBrains Mono', monospace;
font-size: 12px;
font-weight: 600;
letter-spacing: 0.05em;
text-transform: uppercase;
```

#### Data
```css
font-family: 'JetBrains Mono', monospace;
font-size: 14px;
font-weight: 400;
letter-spacing: 0;
```

### Inline Data (in articles)
```css
font-family: 'JetBrains Mono', monospace;
font-size: 0.9em; /* Relative to body */
font-weight: 500;
letter-spacing: 0;
```
**Example:** "finished in `2:29:45`"

---

## UI ELEMENTS

### Navigation - Desktop
```css
font-family: 'Bricolage Grotesque', sans-serif;
font-size: 15px;
font-weight: 600;
letter-spacing: 0.01em;
text-transform: uppercase;
```

### Buttons/CTAs
```css
font-family: 'Bricolage Grotesque', sans-serif;
font-size: 15px;
font-weight: 700;
letter-spacing: 0.02em;
text-transform: uppercase;
padding: 14px 28px;
```

### Form Labels
```css
font-family: 'Bricolage Grotesque', sans-serif;
font-size: 13px;
font-weight: 600;
letter-spacing: 0.01em;
text-transform: uppercase;
margin-bottom: 6px;
```

### Form Inputs
```css
font-family: 'Bricolage Grotesque', sans-serif;
font-size: 16px; /* Prevents zoom on iOS */
font-weight: 400;
line-height: 1.4;
```

---

## SPECIAL ELEMENTS

### Pull Quotes
```css
font-family: 'Archivo Black', sans-serif;
font-size: clamp(24px, 3vw, 36px);
line-height: 1.15;
letter-spacing: -0.01em;
font-weight: 400;
```

### Stat Callouts

#### Number
```css
font-family: 'Archivo Black', sans-serif;
font-size: clamp(48px, 6vw, 96px);
line-height: 0.9;
letter-spacing: -0.03em;
```

#### Label
```css
font-family: 'JetBrains Mono', monospace;
font-size: 12px;
letter-spacing: 0.08em;
text-transform: uppercase;
font-weight: 500;
```

### Newsletter Headers
```css
font-family: 'Archivo Black', sans-serif;
font-size: clamp(32px, 4vw, 42px);
line-height: 1.0;
letter-spacing: -0.015em;
```

---

## SPACING SYSTEM

```css
/* Base unit: 4px */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 96px;

/* Component spacing */
--section-padding: clamp(48px, 8vw, 96px);
--article-margin: clamp(24px, 4vw, 40px);
--paragraph-margin: 1.2em;
```

---

## COLOR & CONTRAST

### Light Mode
```css
--text-primary: rgba(0, 0, 0, 0.95);
--text-secondary: rgba(0, 0, 0, 0.75);
--text-tertiary: rgba(0, 0, 0, 0.60);
--text-disabled: rgba(0, 0, 0, 0.40);
```

### Dark Mode
```css
--text-primary-dark: rgba(255, 255, 255, 0.95);
--text-secondary-dark: rgba(255, 255, 255, 0.80);
--text-tertiary-dark: rgba(255, 255, 255, 0.65);
--text-disabled-dark: rgba(255, 255, 255, 0.40);
```

---

## RESPONSIVE BREAKPOINTS

```css
/* Container widths */
--container-xs: 100%;
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;

/* Article content max-width */
--content-width: 680px;
--wide-content: 960px;

/* Breakpoint values */
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;
```

---

## IMPLEMENTATION

### HTML Font Loading
```html
<!-- Preconnect to Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Load Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### CSS Font Stack with Fallbacks
```css
:root {
  --font-display: 'Archivo Black', 'Arial Black', sans-serif;
  --font-body: 'Bricolage Grotesque', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
}
```

### Font Display Strategy
```css
/* Critical fonts - swap immediately */
@font-face {
  font-family: 'Bricolage Grotesque';
  font-display: swap;
}

/* Display fonts - optional loading */
@font-face {
  font-family: 'Archivo Black';
  font-display: optional;
}

/* Data fonts - fallback loading */
@font-face {
  font-family: 'JetBrains Mono';
  font-display: fallback;
}
```

---

## PERFORMANCE OPTIMIZATION

### Critical CSS
Include in `<head>` for above-fold content:
```css
/* Critical font definitions */
.h1 {
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(40px, 5vw + 1rem, 72px);
  line-height: 0.95;
}

.body-text {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 17px;
  line-height: 1.65;
}
```

### Font Subsetting
For JetBrains Mono (if only using for numbers/dates):
```
0123456789:|-JANFEBMRPYULGSTOCVD
```

### Variable Font Option
Consider using Bricolage Grotesque variable font for smaller file size:
```css
@font-face {
  font-family: 'Bricolage Grotesque';
  src: url('BricolageGrotesque[opsz,wght].woff2') format('woff2-variations');
  font-weight: 300 800;
  font-optical-sizing: 12 96;
}
```

---

## USAGE EXAMPLES

### Article Header
```html
<article>
  <header>
    <time class="metadata">07 DEC 2024 | 5 MIN READ</time>
    <h1 class="hero-headline">Boston Marathon 2025: The Ultimate Guide</h1>
    <p class="lead">Everything you need to know about qualifying, training, and conquering Heartbreak Hill.</p>
  </header>
</article>
```

### Race Stats Component
```html
<div class="race-stats">
  <div class="stat">
    <span class="stat-number">2:29:45</span>
    <span class="stat-label">COURSE RECORD</span>
  </div>
  <div class="stat">
    <span class="stat-number">28,342</span>
    <span class="stat-label">FINISHERS 2024</span>
  </div>
</div>
```

### Data Table
```html
<table class="split-times">
  <thead>
    <tr>
      <th>SPLIT</th>
      <th>TIME</th>
      <th>PACE</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>5K</td>
      <td>17:45</td>
      <td>5:43/mi</td>
    </tr>
  </tbody>
</table>
```

---

## ACCESSIBILITY NOTES

1. **Minimum font sizes:**
   - Body text: Never below 16px
   - Captions: Never below 14px
   - Data: Never below 12px

2. **Line height considerations:**
   - Body text: Minimum 1.5 for accessibility
   - Headlines can be tighter but test for readability

3. **Color contrast:**
   - Ensure all text meets WCAG AA standards
   - Test JetBrains Mono at smaller sizes for contrast

4. **Font weight considerations:**
   - Bricolage 300 weight only for larger sizes (20px+)
   - Prefer 400-600 weights for body text

---

## BRAND VOICE NOTES

- **Archivo Black:** Use sparingly for maximum impact. Don't overuse on a single page.
- **Bricolage weights:** Vary weights to create hierarchy without changing size.
- **JetBrains Mono:** Keep uppercase for labels, use normal case for longer data strings.
- **Spacing:** Generous white space enhances the bold typography.
- **Alignment:** Consider centering hero headlines for race pages, left-align for articles.

---

## QUICK REFERENCE

| Element | Font | Size | Weight | Line Height | Letter Spacing |
|---------|------|------|--------|-------------|----------------|
| H1 | Archivo Black | 64-72px | 400 | 0.95 | -0.02em |
| H2 | Archivo Black | 42-48px | 400 | 1.0 | -0.015em |
| H3 | Archivo Black | 28-32px | 400 | 1.1 | -0.01em |
| Body | Bricolage | 17px | 400 | 1.65 | -0.003em |
| Lead | Bricolage | 21-22px | 450 | 1.5 | -0.005em |
| Metadata | JetBrains Mono | 13px | 400 | 1.0 | 0.02em |
| Button | Bricolage | 15px | 700 | 1.0 | 0.02em |
| Caption | Bricolage | 14px | 500 | 1.4 | 0 |

---

*Last updated: December 2024*
*Version: 1.0*