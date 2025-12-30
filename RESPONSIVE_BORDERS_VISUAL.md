# Responsive Bordered Layout - Visual Guide

## How the Layout Responds Across Screen Sizes

### Mobile (< 640px)
```
┌──────────────────────────────────────────────────┐
│                                                  │
│  [Content spans full width - 100%]              │
│  No borders, no side margins                    │
│                                                  │
└──────────────────────────────────────────────────┘
```
**Width:** 100% | **Borders:** None | **Margins:** 0%

---

### Small Tablet (≥ 640px)
```
┌──────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────┐     │
│  │ [Content - 96%]                        │     │
│  │ Slight inset, no borders yet           │     │
│  └────────────────────────────────────────┘     │
└──────────────────────────────────────────────────┘
   2%                                          2%
```
**Width:** 96% | **Borders:** None | **Margins:** 2% each side

---

### Tablet (≥ 768px) - **Borders Appear**
```
┌──────────────────────────────────────────────────┐
│   │                                          │   │
│   │  [Content - 94%]                         │   │
│   │  Side borders visible                    │   │
│   │                                          │   │
└───┴──────────────────────────────────────────┴───┘
  3%  Border                          Border   3%
```
**Width:** 94% | **Borders:** ✓ Yes | **Margins:** 3% each side

---

### Laptop (≥ 1024px)
```
┌──────────────────────────────────────────────────┐
│    │                                        │    │
│    │  [Content - 92%]                       │    │
│    │  Increased side margins                │    │
│    │                                        │    │
└────┴────────────────────────────────────────┴────┘
   4%  Border                        Border    4%
```
**Width:** 92% | **Borders:** ✓ Yes | **Margins:** 4% each side

---

### Desktop (≥ 1280px)
```
┌──────────────────────────────────────────────────┐
│     │                                      │     │
│     │  [Content - 90%]                     │     │
│     │  More breathing room                 │     │
│     │                                      │     │
└─────┴──────────────────────────────────────┴─────┘
    5%  Border                      Border     5%
```
**Width:** 90% | **Borders:** ✓ Yes | **Margins:** 5% each side

---

### Large Desktop (≥ 1536px)
```
┌──────────────────────────────────────────────────┐
│      │                                    │      │
│      │  [Content - 88%]                   │      │
│      │  Max comfort for reading           │      │
│      │                                    │      │
└──────┴────────────────────────────────────┴──────┘
     6%  Border                    Border      6%
```
**Width:** 88% (max 1600px) | **Borders:** ✓ Yes | **Margins:** 6% each side

---

## Live Example Animation

Imagine resizing your browser window:

```
Mobile → Tablet → Desktop

│ Full │  →  │ 96% │  →  │ 94% │  →  │ 92% │  →  │ 90% │  →  │ 88% │
│Width │     │ No  │     │  │  │     │  │  │     │  │  │     │  │  │
│      │     │ Brdr│     │  │  │     │  │  │     │  │  │     │  │  │
```

The margins automatically expand as the screen gets larger!

## Dark Mode Comparison

### Light Mode
```
Background:  White (#FFFFFF)
Border:      Light Gray (#e5e5e5)
Content:     Dark text on white

┌──────────────────────────────┐
│   │                      │   │  ← Subtle gray borders
│   │  Dark text           │   │
│   │  on white            │   │
└───┴──────────────────────┴───┘
```

### Dark Mode
```
Background:  Dark (#0c0c0d)
Border:      Dark Gray (#262626)
Content:     Light text on dark

┌──────────────────────────────┐
│   │                      │   │  ← Darker borders
│   │  Light text          │   │
│   │  on dark             │   │
└───┴──────────────────────┴───┘
```

## Real-World Screen Sizes

| Device | Screen Width | Applied Style |
|--------|--------------|---------------|
| iPhone SE | 375px | 100% width, no borders |
| iPhone 14 Pro | 430px | 100% width, no borders |
| iPad Mini | 768px | 94% width, **borders appear** |
| iPad Pro | 1024px | 92% width, borders |
| MacBook Air | 1280px | 90% width, borders |
| iMac 24" | 1920px | 88% width (capped at 1600px), borders |
| Pro Display XDR | 3008px | 88% width (capped at 1600px), centered |

## Margin Calculation

The margins are **automatic** - you don't calculate them:

```
Screen width: 1280px
Content width: 90% = 1152px
Remaining: 10% = 128px

Left margin: 64px (5%)
Right margin: 64px (5%)
```

CSS handles this automatically with `margin: 0 auto`!

## Code Implementation

```tsx
// Simple - just wrap your content
<div className="main-bordered">
  <YourContent />
</div>

// Result at 1024px:
// - Content width: 92%
// - Left margin: 4% (auto)
// - Right margin: 4% (auto)
// - Borders: Yes
```

## Comparison to Manual Approach

### Without .main-bordered (Manual)
```tsx
<div className="w-full md:w-[94%] lg:w-[92%] xl:w-[90%] 2xl:w-[88%]
     mx-auto border-l border-r border-neutral-200
     dark:border-neutral-800 max-w-[1600px]">
  {/* 😵 So many classes! */}
</div>
```

### With .main-bordered (Automatic)
```tsx
<div className="main-bordered">
  {/* 😊 Clean and simple! */}
</div>
```

## Testing Responsiveness

1. **Open DevTools** (F12)
2. **Toggle device toolbar** (Cmd+Shift+M on Mac)
3. **Resize the viewport** and watch:
   - Borders appear at 768px
   - Width percentage decreases
   - Margins increase automatically

## Visual Indicators

You can add temporary visual guides while developing:

```tsx
<div className="main-bordered border-red-500">
  {/* Red borders make it easy to see the layout */}
</div>
```
