# Typography System Update Summary

## Overview

The Distanz Running website typography has been successfully updated from the Playfair Display + Inter system to the new **Garvis Pro + Quasimoda** two-font pairing system. All code changes have been implemented and are ready for deployment once you add your Adobe Fonts project ID.

---

## What Was Changed

### 1. Font Loading System

**File: `/src/app/layout.tsx`**

- ✅ Removed Google Fonts imports for Playfair Display and Inter
- ✅ Added Adobe Fonts (Typekit) integration
- ✅ Kept JetBrains Mono for monospace (race times/stats)
- ⚠️ **ACTION REQUIRED:** Replace `YOUR_PROJECT_ID` with your actual Adobe Fonts project ID on line 71

```tsx
{/* TODO: Replace 'YOUR_PROJECT_ID' with your actual Adobe Fonts project ID */}
<link rel="stylesheet" href="https://use.typekit.net/YOUR_PROJECT_ID.css" />
```

### 2. Tailwind Configuration

**File: `/tailwind.config.js`**

Updated font families to use new system:
```javascript
fontFamily: {
  headline: ['garvis-pro', 'system-ui', 'sans-serif'],  // Garvis Pro
  body: ['quasimoda', 'sans-serif'],                    // Quasimoda
  sans: ['quasimoda', 'sans-serif'],                    // Default
  mono: ['JetBrains Mono', 'monospace'],                // Stats/times
}
```

Added complete typography scale with semantic sizes:
- Metadata: `text-xs`, `text-sm` (12-13px, uppercase with tracking)
- UI/Forms: `text-base`, `text-md` (14-15px)
- Body: `text-body`, `text-body-lg` (16-18px, 1.6-1.7 line-height)
- Lead: `text-lead`, `text-lead-lg` (20-22px)
- Quotes: `text-quote`, `text-quote-lg` (24-28px)
- Headings: `text-h6` through `text-h1` (16px → 64px)
- Stats: `text-stat`, `text-stat-lg` (32-48px, line-height: 1)

### 3. Global Styles

**File: `/src/app/globals.css`**

Updated CSS variables:
```css
--headline-font: "garvis-pro", system-ui, sans-serif;
--body-font: "quasimoda", sans-serif;
--ui-font: "quasimoda", sans-serif;
```

Added comprehensive utility classes:
- `.text-h1-distanz` through `.text-h6-distanz` (responsive headings)
- `.text-body-distanz` (responsive 16-18px body text)
- `.text-lead-distanz` (responsive 20-22px intros)
- `.text-meta-distanz` (uppercase metadata bar)
- `.text-nav-distanz` (navigation links)
- `.text-button-distanz` (CTA buttons, uppercase)
- `.text-quote-distanz` (pull quotes)
- `.text-stat-distanz` + `.text-stat-label-distanz` (stat callouts)
- `.text-newsletter-heading-distanz` (newsletter headers)
- `.text-caption-distanz` (image captions)
- `.text-label-distanz` (form labels)

### 4. Typography Constants

**File: `/src/lib/constants.ts`**

Added detailed typography system configuration:
```typescript
typography: {
  fontFamilies: {
    display: 'garvis-pro',
    headline: 'garvis-pro',
    body: 'quasimoda',
    ui: 'quasimoda',
    mono: 'JetBrains Mono',
  },
  weights: {
    garvisRegular: 400,
    garvisSemiBold: 600,
    garvisBold: 700,
    quasimodaRegular: 400,
    quasimodaMedium: 500,
    quasimodaSemiBold: 600,
  },
  sizes: { /* Mobile and desktop sizes for all elements */ },
  lineHeights: { /* Optimized for readability */ },
}
```

### 5. Documentation

**File: `/DISTANZ_DESIGN_REFERENCE.md`**

Completely rewritten with:
- Font system overview with Adobe Fonts instructions
- Complete heading hierarchy (H1-H6) with usage examples
- Body & content styles (body text, lead paragraphs, captions)
- UI & metadata styles (metadata bar, navigation, buttons, form labels)
- Special elements (pull quotes, stat callouts, newsletter headers)
- Full Tailwind typography scale reference
- Responsive typography examples
- Component patterns (article cards, hero sections, stat displays)
- Migration guide from old system
- Quick start checklist

---

## Typography Hierarchy

### Garvis Pro (Display Font)

**Weights needed in Adobe Fonts:**
- Regular (400) - H3 subsections
- SemiBold (600) - H2 sections, stat callouts, newsletter headers
- Bold (700) - H1 hero headlines

**Usage:**
- **H1** - 48-64px, Bold, tight line-height (1.05-1.1)
- **H2** - 32-40px, SemiBold, snug line-height (1.2-1.25)
- **H3** - 24-28px, Regular, normal line-height (1.3)
- **Pull Quotes** - 24-28px, Medium (if available, otherwise SemiBold)
- **Stat Numbers** - 32-48px, SemiBold, tight line-height (1.0)

### Quasimoda (Body/UI Font)

**Weights needed in Adobe Fonts:**
- Regular (400) - Body text, lead paragraphs, captions
- Medium (500) - Metadata, navigation, form labels
- SemiBold (600) - H4-H6, buttons/CTAs

**Usage:**
- **Body Text** - 16-18px, Regular, loose line-height (1.6-1.7)
- **Lead Paragraphs** - 20-22px, Regular, relaxed line-height (1.5)
- **Metadata Bar** - 12-13px, Medium, uppercase, wide tracking (0.08em)
- **Navigation** - 14-15px, Medium
- **Buttons/CTAs** - 14-16px, SemiBold, uppercase
- **H4-H6** - 16-20px, SemiBold
- **Form Labels** - 14px, Medium
- **Captions** - 14px, Regular, 70% opacity

---

## Implementation Steps

### Step 1: Set Up Adobe Fonts ⚠️ ACTION REQUIRED

1. Go to [Adobe Fonts](https://fonts.adobe.com)
2. Sign in with your Adobe account
3. Click "Create a new web project"
4. Give your project a name (e.g., "Distanz Running")
5. Add fonts to your project:
   - Search for "Garvis Pro"
   - Select weights: **Regular 400, SemiBold 600, Bold 700**
   - Click "Add to Web Project"
   - Search for "Quasimoda"
   - Select weights: **Regular 400, Medium 500, SemiBold 600**
   - Click "Add to Web Project"
6. Copy your project ID (it will look like `abc1234` or similar)
7. Update `/src/app/layout.tsx` line 71:
   ```tsx
   {/* Replace YOUR_PROJECT_ID with your actual Adobe Fonts project ID */}
   <link rel="stylesheet" href="https://use.typekit.net/YOUR_PROJECT_ID.css" />
   ```

### Step 2: Test the Typography

1. Run your development server:
   ```bash
   npm run dev
   ```

2. Open browser DevTools (F12)

3. Inspect any heading element

4. Verify computed font-family shows `garvis-pro` or `quasimoda`

5. If fonts don't load:
   - Check Adobe Fonts project is published
   - Verify project ID is correct
   - Check browser console for errors
   - Ensure domains are authorized in Adobe Fonts project settings

### Step 3: Update Existing Components (Gradual Migration)

The system is **backwards compatible** with legacy classes, so your existing site will continue to work. You can migrate components gradually:

**Before:**
```tsx
<h1 className="font-playfair text-4xl font-semibold">
  Boston Marathon 2025
</h1>
```

**After (Option 1 - Pre-built utility):**
```tsx
<h1 className="text-h1-distanz">
  Boston Marathon 2025
</h1>
```

**After (Option 2 - Tailwind utilities):**
```tsx
<h1 className="font-headline font-bold text-h1 lg:text-h1-lg">
  Boston Marathon 2025
</h1>
```

### Step 4: Deploy

Once you've tested locally and verified fonts load correctly:

1. Commit changes:
   ```bash
   git add .
   git commit -m "Update typography system to Garvis Pro + Quasimoda"
   ```

2. Push to your repository:
   ```bash
   git push origin staging
   ```

3. Deploy to Vercel (if not automatic)

---

## Files Modified

### Core Implementation Files
- ✅ `/src/app/layout.tsx` - Font loading (Adobe Fonts)
- ✅ `/tailwind.config.js` - Font families & typography scale
- ✅ `/src/app/globals.css` - CSS variables & utility classes
- ✅ `/src/lib/constants.ts` - Typography constants

### Documentation Files
- ✅ `/DISTANZ_DESIGN_REFERENCE.md` - Complete rewrite with new system
- ✅ `/TYPOGRAPHY_UPDATE_SUMMARY.md` - This file (implementation guide)

### Files NOT Modified (Unchanged)
- ✅ Color system - No changes
- ✅ Layout system (`.distanz-container`, etc.) - No changes
- ✅ Spacing system (4px base unit) - No changes
- ✅ All React components - Still work with new system

---

## Key Differences from Old System

### Font Families

| Element | Old (Playfair + Inter) | New (Garvis + Quasimoda) |
|---------|------------------------|--------------------------|
| Headlines (H1-H3) | Playfair Display (serif) | Garvis Pro (sans-serif) |
| Body text | Inter (sans-serif) | Quasimoda (sans-serif) |
| UI/Navigation | Inter (sans-serif) | Quasimoda (sans-serif) |
| Metadata | Inter (sans-serif) | Quasimoda (sans-serif) |
| Race times/stats | JetBrains Mono | JetBrains Mono (unchanged) |

### Typography Characteristics

**Old System:**
- Serif headlines (Playfair) gave elegant, editorial feel
- Sans-serif body (Inter) for clean readability
- Mixed serif/sans-serif pairing

**New System:**
- **All sans-serif** for modern, clean, professional look
- Garvis Pro: Strong, bold display font for impact
- Quasimoda: Highly readable body font optimized for long-form content
- Better line-height system for improved readability (1.6-1.7 for body)
- Uppercase metadata with increased letter-spacing (0.08em)
- Tighter line-heights for headlines (1.05-1.1) for visual impact

### Weight Usage

**Garvis Pro (3 weights):**
- Regular (400) - H3 only
- SemiBold (600) - H2, stats, newsletter headers
- Bold (700) - H1 only

**Quasimoda (3 weights):**
- Regular (400) - Body, leads, captions (workhorse)
- Medium (500) - Metadata, nav, labels
- SemiBold (600) - H4-H6, buttons

### Best Practices

1. **Never use more than 2 Garvis weights in one view**
2. **Quasimoda Regular is your workhorse** - Use it for most content
3. **Reserve Garvis Bold for H1 only** - One bold statement per page
4. **Use proper hierarchy** - H1 → H2 → H3, skip levels carefully
5. **Uppercase sparingly** - Metadata and buttons only

---

## Common Use Cases

### Article Page

```tsx
<div className="distanz-article-container">
  <article className="distanz-article-col">
    {/* Metadata */}
    <div className="text-meta-distanz mb-4">
      7 DEC 2025 | 5 MIN READ | MARATHON GUIDE
    </div>

    {/* Title */}
    <h1 className="text-h1-distanz mb-6">
      Boston Marathon 2025 Complete Guide
    </h1>

    {/* Lead paragraph */}
    <p className="text-lead-distanz text-gray-600 mb-8">
      Everything you need to know about running the world's oldest annual marathon.
    </p>

    {/* Body content */}
    <div className="space-y-4">
      <p className="text-body-distanz">
        The Boston Marathon has been a rite of passage for distance runners since 1897...
      </p>

      <h2 className="text-h2-distanz mt-8 mb-4">
        Course Breakdown
      </h2>

      <p className="text-body-distanz">
        The point-to-point course starts in Hopkinton and finishes on Boylston Street...
      </p>

      <h3 className="text-h3-distanz mt-6 mb-3">
        Miles 13-20: The Newton Hills
      </h3>

      <p className="text-body-distanz">
        This section includes the infamous Heartbreak Hill at mile 20...
      </p>
    </div>
  </article>
</div>
```

### Stat Callout

```tsx
<div className="bg-white border border-gray-200 p-8 rounded-lg">
  <div className="grid grid-cols-3 gap-8 text-center">
    <div>
      <div className="text-stat-distanz text-electric-pink mb-2">
        2:29:45
      </div>
      <div className="text-stat-label-distanz">
        COURSE RECORD
      </div>
    </div>
    <div>
      <div className="text-stat-distanz text-volt-green mb-2">
        28,342
      </div>
      <div className="text-stat-label-distanz">
        FINISHERS
      </div>
    </div>
    <div>
      <div className="text-stat-distanz mb-2">
        42.195km
      </div>
      <div className="text-stat-label-distanz">
        DISTANCE
      </div>
    </div>
  </div>
</div>
```

### Newsletter Signup

```tsx
<div className="bg-electric-pink text-white p-12 rounded-lg text-center">
  <h2 className="text-newsletter-heading-distanz mb-4">
    Stay Updated on Marathon News
  </h2>
  <p className="text-lead-distanz mb-8 opacity-90">
    Get weekly race guides, training tips, and gear reviews delivered to your inbox.
  </p>
  <form className="max-w-md mx-auto">
    <label className="text-label-distanz block mb-2 text-left">
      Email Address
    </label>
    <input
      type="email"
      className="w-full px-4 py-3 rounded text-body-distanz text-gray-900"
      placeholder="you@example.com"
    />
    <button className="text-button-distanz bg-white text-electric-pink w-full mt-4 px-6 py-3 rounded">
      Subscribe Now
    </button>
  </form>
</div>
```

---

## Troubleshooting

### Fonts Not Loading

**Problem:** Fonts still showing as system fonts (Arial, etc.)

**Solutions:**
1. Verify Adobe Fonts project ID is correct in `layout.tsx`
2. Check Adobe Fonts project is **published** (not draft)
3. Ensure authorized domains include your local/staging/production URLs
4. Clear browser cache and hard reload (Cmd/Ctrl + Shift + R)
5. Check browser console for 404 errors from `use.typekit.net`

### Incorrect Font Weights

**Problem:** All text looks the same weight

**Solutions:**
1. Verify you added the correct weights in Adobe Fonts:
   - Garvis Pro: 400, 600, 700
   - Quasimoda: 400, 500, 600
2. Check `font-weight` CSS is being applied (inspect in DevTools)
3. Some fonts may have limited weights - verify font availability

### Typography Too Large/Small

**Problem:** Responsive sizing not working

**Solutions:**
1. Check breakpoints are correct (`md:`, `lg:` prefixes)
2. Verify Tailwind is processing responsive classes
3. Test at different screen sizes (Chrome DevTools device mode)
4. Use `.text-*-distanz` classes which include responsive sizing

### Layout Breaking

**Problem:** Text overflowing or misaligned

**Solutions:**
1. Check `.distanz-container` and `.distanz-article-col` are applied correctly
2. Verify parent containers have proper width constraints
3. Add `overflow-wrap: break-word` for long words
4. Check for conflicting CSS from other sources

---

## Next Steps

### Immediate (Required)
- [ ] Set up Adobe Fonts project
- [ ] Add Garvis Pro (weights: 400, 600, 700)
- [ ] Add Quasimoda (weights: 400, 500, 600)
- [ ] Copy project ID to `layout.tsx`
- [ ] Test locally

### Short Term (Recommended)
- [ ] Update homepage to use new typography classes
- [ ] Update article pages to use new heading styles
- [ ] Update navigation to use `.text-nav-distanz`
- [ ] Update buttons/CTAs to use `.text-button-distanz`
- [ ] Test on staging environment

### Long Term (Optional)
- [ ] Audit all components for typography consistency
- [ ] Create Storybook or component library with examples
- [ ] Add font-display: swap for better performance
- [ ] Consider self-hosting fonts if Adobe Fonts subscription lapses
- [ ] Update any remaining `font-playfair` or `font-inter` references

---

## Support & Resources

**Documentation:**
- `DISTANZ_DESIGN_REFERENCE.md` - Complete design system reference
- `distanz-design-system.md` - Detailed design guidelines
- `CLAUDE.md` - Project conventions and development guide

**Code Reference:**
- `/src/app/globals.css` - All utility classes
- `/tailwind.config.js` - Typography scale and font configuration
- `/src/lib/constants.ts` - Programmatic typography access

**External Resources:**
- [Adobe Fonts](https://fonts.adobe.com) - Font management
- [Garvis Pro](https://fonts.adobe.com/fonts/garvis-pro) - Display font details
- [Quasimoda](https://fonts.adobe.com/fonts/quasimoda) - Body font details
- [Tailwind Typography](https://tailwindcss.com/docs/font-size) - Tailwind docs

---

## Summary

✅ **Code Changes Complete** - All files updated and ready
⚠️ **Action Required** - Add Adobe Fonts project ID to `/src/app/layout.tsx`
📚 **Documentation Updated** - Complete design reference available
🔄 **Backwards Compatible** - Existing site will continue to work
🎨 **New Typography System** - Garvis Pro + Quasimoda ready to use

The typography system has been successfully modernized to use Garvis Pro for impactful headlines and Quasimoda for highly readable body content. Once you add your Adobe Fonts project ID, the new typography will be live across your site.

**Estimated Time to Complete Setup:** 15-30 minutes (Adobe Fonts setup + testing)

Good luck with your typography update! 🏃‍♂️
