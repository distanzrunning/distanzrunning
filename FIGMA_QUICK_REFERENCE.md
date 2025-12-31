# Distanz Running - Figma Quick Reference

**Copy-paste this while building your design system!**

---

## 🎨 COLORS

### Brand Colors
```
Electric Pink    #e43c81
Volt Green       #00D464
Signal Orange    #FF5722
Pace Purple      #7C3AED
Trail Brown      #8B4513
Track Red        #DC2626
```

### Neutrals
```
Black         #0A0A0A
White         #FFFFFF
Off-White     #FAFAF8

Gray 900      #1A1A1A
Gray 800      #2D2D2D
Gray 700      #404040
Gray 600      #595959
Gray 500      #737373
Gray 400      #A6A6A6
Gray 300      #D9D9D9
Gray 200      #E6E6E6
Gray 100      #F5F5F5
```

### Semantic - Light Mode
```
Text Default       #111827
Text Subtle        #6B7280
Text Subtler       #ACB0B8
Text Accent        #e43c81
Text Inverted      #F9FAFA

Border Neutral     #E5E5E5
Border Hover       #CCCCCC
Border Subtle      #E7E7E7

Surface            #FFFFFF
Canvas             #F7F7F7
```

### Semantic - Dark Mode
```
Text Default       #F9FAFA
Text Subtle        #ACB0B8
Text Subtler       #6B7280
Text Inverted      #111827

Surface            #0C0C0D
Canvas             #0A0A0A
```

---

## ✍️ TYPOGRAPHY

### News Typography (Inter)

**News H1**
- Font: Inter
- Size: 68px
- Weight: Bold (600)
- Line height: 71px (105%)
- Letter spacing: -0.34px

**News H2**
- Font: Inter
- Size: 58px
- Weight: Bold (600)
- Line height: 61px (105%)
- Letter spacing: -1.74px

**News H3**
- Font: Inter
- Size: 44px
- Weight: Bold (600)
- Line height: 48px (110%)
- Letter spacing: -0.88px

**News H4**
- Font: Inter
- Size: 38px
- Weight: Bold (600)
- Line height: 42px (110%)
- Letter spacing: -0.38px

**News H5**
- Font: Inter
- Size: 28px
- Weight: Bold (600)
- Line height: 32px (115%)
- Letter spacing: -0.14px

**News H6**
- Font: Inter
- Size: 24px
- Weight: Bold (600)
- Line height: 31px (130%)
- Letter spacing: 0

**News Body XL**
- Font: Inter
- Size: 19px
- Weight: Regular (400)
- Line height: 25px (130%)
- Letter spacing: 0

**News Body**
- Font: Inter
- Size: 15px
- Weight: Regular (400)
- Line height: 20px (130%)
- Letter spacing: 0.04px

**News Caption**
- Font: Inter
- Size: 13px
- Weight: Regular (400)
- Line height: 16px (125%)
- Letter spacing: 0.03px

**News Overline**
- Font: Inter
- Size: 11px
- Weight: Medium (500)
- Line height: 14px (125%)
- Letter spacing: 0.03px

---

### Feature Typography (EB Garamond)

**Feature H1**
- Font: EB Garamond
- Size: 72px
- Weight: Medium (500)
- Line height: 76px (105%)
- Letter spacing: -0.72px

**Feature H2**
- Font: EB Garamond
- Size: 56px
- Weight: Medium (500)
- Line height: 62px (110%)
- Letter spacing: -0.56px

**Feature H3**
- Font: EB Garamond
- Size: 40px
- Weight: Medium (500)
- Line height: 46px (115%)
- Letter spacing: -0.2px

**Feature Body**
- Font: EB Garamond
- Size: 20px
- Weight: Regular (400)
- Line height: 30px (150%)
- Letter spacing: 0

**Feature Quote**
- Font: EB Garamond
- Size: 32px
- Weight: Regular Italic (400)
- Line height: 42px (130%)
- Letter spacing: 0

**Feature Subhead**
- Font: EB Garamond
- Size: 24px
- Weight: Medium (500)
- Line height: 31px (130%)
- Letter spacing: 0

---

### UI Typography (Inter)

**UI Button**
- Font: Inter
- Size: 15px
- Weight: Medium (500)
- Line height: 18px (120%)
- Letter spacing: 0

**UI Nav**
- Font: Inter
- Size: 15px
- Weight: Medium (500)
- Line height: 20px (130%)
- Letter spacing: 0

**UI Input**
- Font: Inter
- Size: 15px
- Weight: Regular (400)
- Line height: 20px (130%)
- Letter spacing: 0

**UI Tag**
- Font: Inter
- Size: 13px
- Weight: Medium (500)
- Line height: 16px (120%)
- Letter spacing: 0

---

## 📐 SPACING SCALE

```
2px    (0.125rem)
4px    (0.25rem)
8px    (0.5rem)    ← Base unit
12px   (0.75rem)
16px   (1rem)
24px   (1.5rem)
32px   (2rem)
40px   (2.5rem)
48px   (3rem)
64px   (4rem)
80px   (5rem)
96px   (6rem)
128px  (8rem)
```

---

## 📱 GRIDS

### Mobile (< 768px)
- Columns: 4
- Gutter: 16px
- Margin: 16px

### Tablet (768px - 1024px)
- Columns: 12
- Gutter: 24px
- Margin: 32px

### Desktop (> 1024px)
- Columns: 18
- Gutter: 24px
- Max width: 1585px
- Margins: Auto

---

## 🎯 NAMING CONVENTIONS

### Color Styles
```
Brand/Electric Pink
Brand/Volt Green
Brand/Signal Orange
Brand/Pace Purple
Brand/Trail Brown
Brand/Track Red

Neutral/Black
Neutral/White
Neutral/Gray 900
... Gray 800 → Gray 100

Semantic/Light/Text Default
Semantic/Light/Text Subtle
Semantic/Light/Border Neutral
Semantic/Light/Surface
Semantic/Light/Canvas

Semantic/Dark/Text Default
Semantic/Dark/Text Subtle
Semantic/Dark/Surface
Semantic/Dark/Canvas
```

### Text Styles
```
News/H1
News/H2
News/H3
News/H4
News/H5
News/H6
News/Body XL
News/Body
News/Caption
News/Overline

Feature/H1
Feature/H2
Feature/H3
Feature/Body
Feature/Quote
Feature/Subhead

UI/Button
UI/Nav
UI/Input
UI/Tag
```

### Components
```
Button/Primary
Button/Secondary
Button/Ghost

Card/Article
Card/Feature
Card/Breaking News

Input/Text
Input/Email
Input/Search

Navigation/Navbar
Navigation/Footer
```

---

## 💡 QUICK TIPS

### Setting Letter Spacing in Figma
- Figma uses **pixels** or **percentages**, not em
- To convert from em to px: `em value × font size`
- Example: -0.005em at 68px = -0.005 × 68 = -0.34px
- You can enter negative values!

### Line Height
- Can be set as **pixels** (e.g., 71px) or **percentage** (e.g., 105%)
- Both work the same in Figma
- Percentage is more flexible for responsive designs

### Font Weights
- Figma shows: Thin, Light, Regular, Medium, Semi Bold, Bold, etc.
- Our weights:
  - 300 = Light
  - 400 = Regular
  - 500 = Medium
  - 550 = Semi Bold (may show as Medium or Bold depending on font)
  - 600 = Bold

### Creating Styles Fast
1. Style one text element perfectly
2. Select it → Create text style
3. Duplicate the text
4. Change size/weight → Update the style or create new one
5. Repeat!

---

## ✅ CHECKLIST

### Colors (30 total)
- [ ] 6 Brand colors
- [ ] 13 Neutral grays
- [ ] 11 Semantic colors (8 light + 3 shared)

### Typography (20 total)
- [ ] 10 News styles
- [ ] 6 Feature styles
- [ ] 4 UI styles

### Layout
- [ ] Mobile grid (4 columns)
- [ ] Tablet grid (12 columns)
- [ ] Desktop grid (18 columns)

### Components (Start with these 10)
- [ ] Button (Primary, Secondary, Ghost)
- [ ] Input (Text, Email, Search)
- [ ] Card (Article, Feature, Breaking News)
- [ ] Navbar

---

Ready to build! Start with **Part 2: Colors** in the main guide.
