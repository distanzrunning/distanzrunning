# Distanz Running - Figma Design System Guide

**Welcome to Figma!** This guide will walk you through building your first design system in Figma, step-by-step. We'll recreate all the design tokens from your codebase in a visual, organized way.

---

## 🎯 What We're Building

A complete design system that mirrors your website's design tokens:
- **Color System**: Brand colors, semantic colors, light/dark modes
- **Typography System**: Inter Variable + EB Garamond with all 60+ text styles
- **Spacing System**: Grid, containers, padding/margins
- **Component Library**: All 40+ React components as Figma components
- **Layout Patterns**: Bordered layouts, grids, templates

---

## 📋 Part 1: Figma Setup (15 minutes)

### Step 1: Create Your Figma Account & File

1. Go to [figma.com](https://figma.com) and sign up (free account is perfect)
2. Click "New design file" in the top left
3. Rename it: "Distanz Running - Design System"
4. Your canvas is now ready!

### Step 2: Install Adobe Fonts Plugin

Since we're using Adobe Fonts, we need to enable them in Figma:

1. In Figma, go to **Menu → Plugins → Browse plugins**
2. Search for "Adobe Fonts"
3. Install the Adobe Fonts plugin
4. Run the plugin and sign in with your Adobe account
5. This will sync your fonts (Inter Variable + EB Garamond)

**Alternative:** Figma has Inter and EB Garamond built-in, so you can use those if the plugin doesn't work.

### Step 3: Organize Your File Structure

Create pages in your file (left sidebar):
1. **Cover** - Title page with overview
2. **Foundation** - Colors, typography, spacing
3. **Components** - All UI components
4. **Patterns** - Layouts and templates
5. **Documentation** - Usage guidelines

---

## 🎨 Part 2: Foundation - Color System (30 minutes)

### Your Color Palette

#### Brand Colors (Primary)
```
Electric Pink    #e43c81   RGB(228, 60, 129)   - Primary brand color
Volt Green       #00D464   RGB(0, 212, 100)    - Accent
Signal Orange    #FF5722   RGB(255, 87, 34)    - Accent
Pace Purple      #7C3AED   RGB(124, 58, 237)   - Accent
Trail Brown      #8B4513   RGB(139, 69, 19)    - Accent
Track Red        #DC2626   RGB(220, 38, 38)    - Accent
```

#### Neutrals
```
Black         #0A0A0A   RGB(10, 10, 10)
White         #FFFFFF   RGB(255, 255, 255)
Off-White     #FAFAF8   RGB(250, 250, 248)

Gray 900      #1A1A1A   RGB(26, 26, 26)
Gray 800      #2D2D2D   RGB(45, 45, 45)
Gray 700      #404040   RGB(64, 64, 64)
Gray 600      #595959   RGB(89, 89, 89)
Gray 500      #737373   RGB(115, 115, 115)
Gray 400      #A6A6A6   RGB(166, 166, 166)
Gray 300      #D9D9D9   RGB(217, 217, 217)
Gray 200      #E6E6E6   RGB(230, 230, 230)
Gray 100      #F5F5F5   RGB(245, 245, 245)
```

#### Semantic Colors (Light Mode)
```
Text Default       RGB(17, 24, 39)      - Body text (dark gray)
Text Subtle        RGB(107, 114, 128)   - Secondary text
Text Subtler       RGB(172, 176, 184)   - Tertiary text
Text Accent        RGB(228, 60, 129)    - Electric Pink
Text Inverted      RGB(249, 250, 250)   - White text

Border Neutral     RGB(229, 229, 229)   - Default borders
Border Hover       RGB(204, 204, 204)   - Hover state
Border Subtle      RGB(231, 231, 231)   - Subtle dividers

Surface            RGB(255, 255, 255)   - Cards, containers
Canvas             RGB(247, 247, 247)   - Page background
```

#### Semantic Colors (Dark Mode)
```
Text Default       RGB(249, 250, 250)   - Body text (light)
Text Subtle        RGB(172, 176, 184)   - Secondary text
Text Subtler       RGB(107, 114, 128)   - Tertiary text
Text Inverted      RGB(17, 24, 39)      - Dark text

Surface            RGB(12, 12, 13)      - Cards
Canvas             RGB(10, 10, 10)      - Page background
```

### How to Create Color Styles in Figma

1. **Navigate to Foundation page**
2. **Create color swatches:**
   - Press `R` to create a rectangle
   - Make it 100×100px
   - Fill it with your first color (Electric Pink #e43c81)

3. **Create a color style:**
   - With rectangle selected, click the 4 dots next to "Fill" in right panel
   - Click the `+` button next to "Color styles"
   - Name it: `Brand/Electric Pink`
   - Description: "Primary brand color"
   - Click "Create style"

4. **Repeat for all colors**, using this naming convention:
   ```
   Brand/Electric Pink
   Brand/Volt Green
   Brand/Signal Orange

   Neutral/Black
   Neutral/White
   Neutral/Gray 900
   ... (etc)

   Semantic/Light/Text Default
   Semantic/Light/Text Subtle
   Semantic/Light/Border Neutral

   Semantic/Dark/Text Default
   Semantic/Dark/Text Subtle
   ```

**Pro Tip:** Use `/` in names to create folders/groups!

---

## ✍️ Part 3: Foundation - Typography System (45 minutes)

### Your Typography Setup

**Fonts:**
- **Sans-serif (Body/UI):** Inter Variable
- **Serif (Headings/Features):** EB Garamond

**Font Weights:**
- Light: 300
- Regular: 400
- Medium: 500
- Semi-bold: 550
- Bold: 600

### Typography Scales

#### News Typography (Inter Variable)
Used for: News articles, UI elements, navigation

| Style | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| News H1 | 68px (4.25rem) | 600 | 1.05 (71px) | -0.005em |
| News H2 | 58px (3.625rem) | 600 | 1.05 (61px) | -0.03em |
| News H3 | 44px (2.75rem) | 600 | 1.1 (48px) | -0.02em |
| News H4 | 38px (2.375rem) | 600 | 1.1 (42px) | -0.01em |
| News H5 | 28px (1.75rem) | 600 | 1.15 (32px) | -0.005em |
| News H6 | 24px (1.5rem) | 600 | 1.3 (31px) | 0 |
| News Body XL | 19px (1.1875rem) | 400 | 1.3 (25px) | 0 |
| News Body | 15px (0.9375rem) | 400 | 1.3 (20px) | 0.0025em |
| News Caption | 13px (0.8125rem) | 400 | 1.25 (16px) | 0.0025em |
| News Overline | 11px (0.6875rem) | 500 | 1.25 (14px) | 0.0025em |

#### Feature Typography (EB Garamond)
Used for: Feature articles, long-form content, quotes

| Style | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| Feature H1 | 72px (4.5rem) | 500 | 1.05 (76px) | -0.01em |
| Feature H2 | 56px (3.5rem) | 500 | 1.1 (62px) | -0.01em |
| Feature H3 | 40px (2.5rem) | 500 | 1.15 (46px) | -0.005em |
| Feature Body | 20px (1.25rem) | 400 | 1.5 (30px) | 0 |
| Feature Quote | 32px (2rem) | 400 italic | 1.3 (42px) | 0 |
| Feature Subhead | 24px (1.5rem) | 500 | 1.3 (31px) | 0 |

#### UI Typography (Inter Variable)
Used for: Buttons, forms, navigation

| Style | Size | Weight | Line Height |
|-------|------|--------|-------------|
| UI Button | 15px | 500 | 1.2 (18px) |
| UI Nav | 15px | 500 | 1.3 (20px) |
| UI Input | 15px | 400 | 1.3 (20px) |
| UI Tag | 13px | 500 | 1.2 (16px) |

### How to Create Text Styles in Figma

1. **Navigate to Foundation page**
2. **Create text sample:**
   - Press `T` to create text
   - Type "News H1" as placeholder

3. **Style the text:**
   - Font: Inter Variable
   - Size: 68px
   - Weight: Bold (600)
   - Line height: 71px (or 105%)
   - Letter spacing: -0.34px (or -0.5%)

4. **Create text style:**
   - With text selected, click 4 dots in "Text" section (right panel)
   - Click `+` button
   - Name it: `News/H1`
   - Description: "News headline - 68px/71px, Bold, -0.005em"
   - Click "Create style"

5. **Repeat for ALL text styles**, using naming:
   ```
   News/H1
   News/H2
   News/Body
   News/Caption

   Feature/H1
   Feature/H2
   Feature/Body
   Feature/Quote

   UI/Button
   UI/Nav
   UI/Input
   ```

**Important:** Make sure to set letter spacing in pixels, not %. Figma converts em to pixels automatically.

---

## 📐 Part 4: Foundation - Spacing & Grid (20 minutes)

### Your Spacing System

**Base unit:** 8px (0.5rem)

**Spacing scale:**
```
2px   (0.125rem)
4px   (0.25rem)
8px   (0.5rem)   ← Base unit
12px  (0.75rem)
16px  (1rem)
24px  (1.5rem)
32px  (2rem)
40px  (2.5rem)
48px  (3rem)
64px  (4rem)
80px  (5rem)
96px  (6rem)
128px (8rem)
```

### Grid System

**Mobile (< 768px):**
- Columns: 4
- Gutter: 16px
- Margin: 16px

**Tablet (768px - 1024px):**
- Columns: 12
- Gutter: 24px
- Margin: 32px

**Desktop (> 1024px):**
- Columns: 18
- Gutter: 24px
- Margin: auto
- Max width: 1585px

### How to Set Up Grids in Figma

1. **Create a frame:**
   - Press `F` for frame
   - Choose "Desktop" preset (1440×1024)

2. **Add layout grid:**
   - With frame selected, click `+` next to "Layout grid" (right panel)
   - Click the grid icon to open settings
   - Change "Grid" to "Columns"
   - Set:
     - Count: 18
     - Type: Center
     - Width: Auto
     - Gutter: 24
     - Margins: 0

3. **Save as reusable style:**
   - Click the 4 dots next to layout grid
   - Name it: `Grid/Desktop 18-col`

4. **Repeat for tablet and mobile**

---

## 🧩 Part 5: Components (2-3 hours)

This is where we recreate your React components as Figma components. I'll guide you through a few examples, then you can apply the pattern to the rest.

### Component List (40+ components)

**Navigation:**
- Navbar
- NavbarClient (with dropdown states)
- Footer

**Content Cards:**
- ArticleCard
- FeaturedArticle
- BreakingNewsCard
- FeatureShowcase

**Forms:**
- NewsletterSignup
- ContactForm
- Search

**UI Elements:**
- ExploreButton (CTA buttons)
- SocialLinks
- ScrollIndicator
- DarkModeToggle

**Race Components:**
- MarathonShowcase
- RaceStatsGrid
- ElevationChart
- RaceMapComponent

### Example: Creating a Button Component

1. **Create a frame for the button:**
   - Press `F`, create 120×40px frame
   - Name it: `Button/Primary`

2. **Add background:**
   - Select frame
   - Fill: Use color style `Brand/Electric Pink`
   - Corner radius: 6px

3. **Add text:**
   - Press `T`, add "Button Text"
   - Text style: `UI/Button`
   - Color: `Semantic/Light/Text Inverted`
   - Center it (use Auto Layout)

4. **Convert to Auto Layout:**
   - Select frame
   - Shift+A (or right-click → "Add auto layout")
   - Horizontal padding: 24px
   - Vertical padding: 12px
   - Gap: 8px

5. **Create component:**
   - Select frame
   - Cmd+Option+K (or top toolbar → Create Component)
   - Name: `Button/Primary`

6. **Add variants:**
   - With component selected, click `+` in Variants section
   - Create states: Default, Hover, Active, Disabled
   - Adjust colors for each state

7. **Publish to library:**
   - Click "Publish" in top right
   - Add description
   - Publish

### Component Creation Workflow

For each component:
1. **Analyze the code** - Look at the component's props, states, variants
2. **Create base frame** - Match dimensions from your website
3. **Add elements** - Text, icons, images using your styles
4. **Use Auto Layout** - Makes components responsive
5. **Create variants** - For different states (hover, active, disabled)
6. **Add properties** - For customizable parts (text, icons, colors)
7. **Document** - Add descriptions and usage notes

---

## 📝 Part 6: Documentation (1 hour)

### What to Document

1. **Overview page:**
   - Design principles
   - Brand guidelines
   - When to use Inter vs EB Garamond

2. **Color usage:**
   - Semantic color mapping
   - Accessibility guidelines (contrast ratios)
   - Dark mode rules

3. **Typography rules:**
   - When to use News vs Feature styles
   - Maximum line lengths
   - Hierarchy rules

4. **Component usage:**
   - When to use each component
   - Props and variants
   - Do's and don'ts

5. **Layout patterns:**
   - Grid usage
   - Spacing rules
   - Responsive breakpoints

---

## 🚀 Next Steps

Once you've built the foundation:

1. **Share with team** - Invite collaborators to view/edit
2. **Enable as library** - Others can use components in their files
3. **Export tokens** - Use plugins like "Design Tokens" to export to JSON
4. **Integrate with code** - Use Figma API to sync with Tailwind
5. **Maintain** - Update as website evolves

---

## 📚 Resources

**Figma Learning:**
- [Figma YouTube Channel](https://youtube.com/figma)
- [Figma Best Practices](https://help.figma.com/hc/en-us/categories/360002051613-Figma-design)

**Design System Examples:**
- [Material Design](https://m3.material.io/)
- [Atlassian Design System](https://atlassian.design/)
- [Shopify Polaris](https://polaris.shopify.com/)

**Figma Plugins:**
- Adobe Fonts - Sync Adobe typefaces
- Stark - Accessibility checker
- Iconify - Icon library
- Content Reel - Generate placeholder content
- Design Tokens - Export tokens as JSON

---

## ❓ Common Questions

**Q: Do I need to recreate EVERY component?**
A: Start with the most-used ones (Button, Card, Input, Navbar). Add others as needed.

**Q: How do I keep Figma and code in sync?**
A: Use design tokens. Export from Figma → import to Tailwind. Or use tools like Style Dictionary.

**Q: Can I use Figma for free?**
A: Yes! Free tier includes unlimited files, 3 projects, and unlimited cloud storage.

**Q: What if I get stuck?**
A: Just ask me! I'll guide you through each step.

---

## 🎯 Your Figma Design System Checklist

Foundation:
- [ ] Brand colors (6 colors)
- [ ] Neutral colors (13 grays)
- [ ] Semantic colors - Light mode (8 colors)
- [ ] Semantic colors - Dark mode (6 colors)
- [ ] News typography (10 styles)
- [ ] Feature typography (6 styles)
- [ ] UI typography (4 styles)
- [ ] Spacing scale (13 values)
- [ ] Grid layouts (3 breakpoints)

Components (Priority):
- [ ] Button (4 variants)
- [ ] Input field
- [ ] Card (article, feature, breaking news)
- [ ] Navbar
- [ ] Footer
- [ ] Newsletter signup
- [ ] Social links

Nice to Have:
- [ ] All 40+ components
- [ ] Dark mode variants
- [ ] Responsive versions
- [ ] Documentation pages
- [ ] Usage examples

---

Ready to start? Let's begin with Part 1: Setting up your Figma file!
