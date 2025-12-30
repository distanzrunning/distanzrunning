# Bordered Layout System Guide

## Overview

This layout system replicates the IEEE Spectrum style with responsive side borders and margins that automatically adjust based on screen width.

## How It Works

The `.main-bordered` class creates a centered container with:
- **Vertical borders** on left and right sides (hidden on mobile)
- **Responsive width** that changes with screen size
- **Auto margins** that expand/contract to center the content

## Responsive Breakpoints

| Screen Size | Width | Borders | Side Margins |
|------------|-------|---------|--------------|
| < 640px (Mobile) | 100% | None | 0% |
| ≥ 640px (sm) | 96% | None | 2% each side |
| ≥ 768px (md) | 94% | ✓ Yes | 3% each side |
| ≥ 1024px (lg) | 92% | ✓ Yes | 4% each side |
| ≥ 1280px (xl) | 90% | ✓ Yes | 5% each side |
| ≥ 1536px (2xl) | 88% | ✓ Yes | 6% each side |
| Max width | 1600px | ✓ Yes | Auto-centered |

## Usage

### Basic Implementation

```tsx
export default function MyPage() {
  return (
    <div className="main-bordered">
      {/* Your content here */}
      <section>
        <h1>Welcome</h1>
        <p>Content automatically respects the bordered container</p>
      </section>
    </div>
  );
}
```

### With Background Color

```tsx
<div className="min-h-screen bg-white dark:bg-[#0c0c0d]">
  <div className="main-bordered">
    {/* Content */}
  </div>
</div>
```

### Vertical Separator Only (No Width Constraint)

If you want borders without width changes:

```tsx
<div className="v-sep">
  {/* Content spans full width but has side borders */}
</div>
```

## Examples

### Homepage Implementation (Current)

```tsx
return (
  <DarkModeProvider>
    <div className="min-h-screen bg-white dark:bg-[#0c0c0d]">
      <div className="main-bordered">
        {/* All sections inside bordered wrapper */}
        <section>Featured Content</section>
        <section>Gear Reviews</section>
        <section>Race Guides</section>
      </div>
    </div>
  </DarkModeProvider>
);
```

### Article Page

```tsx
export default function ArticlePage() {
  return (
    <div className="main-bordered">
      <article className="distanz-article-container">
        <div className="distanz-article-col">
          <h1>Article Title</h1>
          <p>Content automatically respects margins</p>
        </div>
      </article>
    </div>
  );
}
```

## Customization

### Adjusting Width Percentages

Edit `globals.css` or `tailwind.config.js`:

```css
@media (min-width: 1024px) {
  .main-bordered {
    width: 85%; /* Change to your preference */
  }
}
```

### Changing Border Color

Borders use CSS variables that adapt to dark mode:

```css
/* Light mode */
--color-borderNeutral: 229, 229, 229; /* #e5e5e5 */

/* Dark mode */
--color-borderNeutral: 38, 38, 38; /* #262626 */
```

### Maximum Width

Currently set to 1600px for very large screens. Adjust in:

```css
@media (min-width: 1536px) {
  .main-bordered {
    max-width: 1800px; /* Your preference */
  }
}
```

## Benefits

1. **Progressive Enhancement**: Full width on mobile, bordered on desktop
2. **Responsive Margins**: Automatically adjust without manual calculations
3. **Dark Mode Support**: Border colors adapt automatically
4. **IEEE-Style Professional Look**: Clean, magazine-quality borders
5. **Easy to Implement**: Single class application

## Comparison to IEEE

| Feature | IEEE Spectrum | Distanz |
|---------|--------------|---------|
| Side borders | ✓ Yes | ✓ Yes |
| Responsive width | ✓ Yes | ✓ Yes |
| Auto margins | ✓ Yes | ✓ Yes |
| Dark mode | ✗ No | ✓ Yes |
| Mobile-first | ✗ No | ✓ Yes |

## Tips

1. **Apply once per page**: Usually at the top-level layout wrapper
2. **Don't nest**: Only use one `.main-bordered` per page
3. **Combine with sections**: Inner content can use full-width sections
4. **Responsive images**: Images inside will respect the container width

## Troubleshooting

**Borders not showing?**
- Check you're above 768px screen width
- Verify dark mode variables are set correctly

**Width not responsive?**
- Ensure no conflicting width styles on parent elements
- Check browser zoom level (should be 100%)

**Dark mode borders not visible?**
- Verify `dark` class is on a parent element
- Check CSS variable values in DevTools
