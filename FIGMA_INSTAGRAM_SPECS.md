# Instagram Post Specifications for Figma

## Canvas Setup

- **Frame Size**: 1080 x 1350px (4:5 ratio - Instagram standard)
- **Export**: 2x resolution (2160 x 2700px) for high quality

---

## Post 1: Map & Route

### Layout Structure

1. **Background Layer**: Full map screenshot (1080 x 1350px)
   - Take screenshot from your marathon showcase page
   - Or use Mapbox static API

2. **Top Overlay** (Gradient):
   - Position: Top 300px of canvas
   - Gradient: Linear, top to bottom
   - Color stops:
     - 0%: `rgba(0, 0, 0, 0.7)` (70% black)
     - 100%: `rgba(0, 0, 0, 0)` (transparent)

3. **Header Content** (Inside top overlay, padding: 48px from edges):

   **Logo Box (Left)**:
   - Size: 112 x 112px
   - Background: `#FFFFFF`
   - Border radius: 12px
   - Border: 1px solid `#E5E5E5`
   - Padding: 12px inside
   - Logo image: Centered, max-width/height maintaining aspect ratio

   **Marathon Name (Center)**:
   - Font: Inter (or Playfair Display for serif)
   - Size: 56px
   - Weight: 600 (Semibold)
   - Color: `#FFFFFF`
   - Line height: 64px (1.15)
   - Text: "{Marathon Name} Marathon"
   - Position: 24px from logo box
   - Font features: Enable stylistic sets cv02, cv03, cv04, cv11 (in Figma: Text → Details → OpenType features)

   **Location (Below name)**:
   - Font: Inter
   - Size: 28px
   - Weight: 400 (Regular)
   - Color: `#FFFFFF`
   - Line height: 35px (1.25)
   - Position: 4px below marathon name

   **Date Box (Right)**:
   - Size: 112 x 112px
   - Background: `#FFFFFF`
   - Border radius: 12px
   - Border: 1px solid `#E5E5E5`
   - Centered content:
     - Month (top):
       - Font: Inter
       - Size: 14px
       - Weight: 500 (Medium)
       - Color: `#737373` (neutral-600)
       - Uppercase
       - Letter spacing: 0.05em
     - Day (bottom):
       - Font: Inter
       - Size: 42px
       - Weight: 700 (Bold)
       - Color: `#171717` (neutral-900)
       - Line height: 42px (1.0)
       - Position: 4px below month

4. **Bottom Overlay** (Gradient):
   - Position: Bottom 200px of canvas
   - Gradient: Linear, bottom to top
   - Color stops:
     - 0%: `rgba(0, 0, 0, 0.8)` (80% black)
     - 100%: `rgba(0, 0, 0, 0)` (transparent)

5. **Footer Branding** (Inside bottom overlay, center aligned):
   - Position: 48px from bottom
   - Text alignment: Center

   **Brand Name**:
   - Text: "DISTANZ RUNNING"
   - Font: Inter
   - Size: 32px
   - Weight: 600 (Semibold)
   - Color: `#FFFFFF`
   - Line height: 38px
   - Letter spacing: 0.05em

   **Website (Below brand)**:
   - Text: "distanzrunning.com"
   - Font: Inter
   - Size: 22px
   - Weight: 400 (Regular)
   - Color: `#FFFFFF`
   - Line height: 27px
   - Position: 4px below brand name

---

## Post 2: Key Stats

### Layout Structure

1. **Background**: `#F5F5F5` (neutral-50)

2. **Header Section** (Padding: 64px from edges):

   **Top Row** (Horizontal layout):

   **Logo Box (Left)**:
   - Size: 112 x 112px
   - Background: `#FFFFFF`
   - Border radius: 12px
   - Border: 1px solid `#E5E5E5`
   - Padding: 12px inside
   - Logo: Centered

   **Marathon Info (Center, flex-grow)**:
   - Position: 24px from logo

   - Marathon Name:
     - Font: Inter
     - Size: 52px
     - Weight: 600 (Semibold)
     - Color: `#171717` (neutral-900)
     - Line height: 60px (1.15)
     - Font features: cv02, cv03, cv04, cv11

   - Location (Below name):
     - Font: Inter
     - Size: 26px
     - Weight: 400 (Regular)
     - Color: `#737373` (neutral-600)
     - Line height: 33px (1.25)
     - Position: 4px below name

   **Date Box (Right)**:
   - Same specs as Post 1 date box
   - Size: 112 x 112px
   - Background: `#FFFFFF`
   - Border radius: 12px
   - Border: 1px solid `#E5E5E5`

3. **Stats Grid** (8 stat cards, 2 columns):
   - Grid gap: 24px
   - Padding: 64px from left/right edges
   - Position: 48px below header

   **Each Stat Card**:
   - Background: `#FFFFFF`
   - Border radius: 12px
   - Border: 1px solid `#E5E5E5`
   - Padding: 32px
   - Height: Auto-layout

   **Card Layout** (Horizontal):

   Left side (Text):
   - Stat Title:
     - Font: Inter
     - Size: 18px
     - Weight: 500 (Medium)
     - Color: `#737373` (neutral-600)
     - Line height: 22px
     - Font features: cv02, cv03, cv04, cv11

   - Stat Value (8px below title):
     - Font: Inter
     - Size: 36px
     - Weight: 600 (Semibold)
     - Color: `#171717` (neutral-900)
     - Line height: 41px (1.15)
     - Font features: cv02, cv03, cv04, cv11

   Right side (Icon):
   - Position: 20px from text
   - Circle:
     - Size: 80 x 80px
     - Background: Linear gradient
       - From: `#F5F5F5` (neutral-100)
       - To: `#E5E5E5` (neutral-200)
     - Border: 1px solid `#D4D4D4` (neutral-300)
     - Centered icon (Material Symbols Outlined)
     - Icon size: 40px
     - Icon color: `#404040` (neutral-700)

4. **Footer Branding**:
   - Position: 64px from bottom, 64px from left/right
   - Background: `#171717` (neutral-900)
   - Border radius: 12px
   - Border: 1px solid `#262626` (neutral-800)
   - Padding: 32px vertical
   - Text alignment: Center

   **Brand Name**:
   - Text: "DISTANZ RUNNING"
   - Font: Inter
   - Size: 36px
   - Weight: 600 (Semibold)
   - Color: `#FFFFFF`
   - Line height: 43px
   - Letter spacing: 0.05em

   **Website**:
   - Text: "distanzrunning.com"
   - Font: Inter
   - Size: 22px
   - Weight: 400 (Regular)
   - Color: `#D4D4D4` (neutral-300)
   - Line height: 27px
   - Position: 4px below brand

---

## Stats to Display (in order):

1. **Distance**: "42.195 km" | Icon: `arrow_range`
2. **Surface**: "Road" | Icon: `road`
3. **Profile**: "Rolling" (or "Flat", "Hilly") | Icon: `elevation`
4. **Elevation Gain**: "XXX m" | Icon: `arrow_drop_up`
5. **Average Temp (high)**: "XX°C" | Icon: `device_thermostat`
6. **Elevation Loss**: "XXX m" | Icon: `arrow_drop_down`
7. **Men's Course Record**: "XX:XX:XX" | Icon: `male`
8. **Women's Course Record**: "XX:XX:XX" | Icon: `female`

---

## Marathon Data Reference

### New York City Marathon
- **Logo**: `/logos/nyc.svg`
- **Location**: "New York, New York"
- **Date**: "NOV 02"
- **Center**: -73.9712, 40.7831
- **Stats**:
  - Distance: 42.195 km
  - Surface: Road
  - Profile: Rolling
  - Elevation Gain: 264 m
  - Average Temp: 13°C
  - Elevation Loss: 264 m
  - Men's Record: 02:05:59
  - Women's Record: 02:22:31

### Other Marathons
Find data in: `/src/constants/marathonData.ts`

---

## Color Palette

```
Brand Colors:
- Primary: #e43c81 (pink/red - for route line)
- Secondary: #eeb6cd (light pink)

Neutrals:
- neutral-50: #F5F5F5
- neutral-100: #F5F5F5
- neutral-200: #E5E5E5
- neutral-300: #D4D4D4
- neutral-600: #737373
- neutral-700: #404040
- neutral-800: #262626
- neutral-900: #171717

Overlays:
- Black 70%: rgba(0, 0, 0, 0.7)
- Black 80%: rgba(0, 0, 0, 0.8)
```

---

## Fonts

**Primary**: Inter (Variable)
- Get from Google Fonts: https://fonts.google.com/specimen/Inter
- Enable OpenType features in Figma: cv02, cv03, cv04, cv11

**Alternative Serif** (if preferred): Playfair Display
- Get from Google Fonts: https://fonts.google.com/specimen/Playfair+Display

**Icons**: Material Symbols Outlined
- Download from: https://fonts.google.com/icons
- Use outlined style
- Size: 40px for stat cards

---

## Tips for Figma

1. **Use Auto Layout** for stat cards and text containers (easier to adjust)
2. **Create Components** for:
   - Logo box (reuse in both posts)
   - Date box (reuse in both posts)
   - Stat card (duplicate 8 times)
   - Footer branding (reuse in both posts)
3. **Use Constraints** so elements stay positioned when you resize
4. **Layer Organization**:
   - Name layers clearly ("Header Overlay", "Logo Box", "Marathon Name", etc.)
   - Group related elements ("Header Group", "Stats Grid", "Footer Group")
5. **Export Settings**:
   - Format: PNG
   - Scale: 2x
   - This gives you 2160 x 2700px final images for Instagram

---

## Workflow

1. Create Post 1 (Map) first
2. Export components (logo box, date box, footer) as components
3. Duplicate frame for Post 2 (Stats)
4. Replace map background with solid color (#F5F5F5)
5. Add stats grid using duplicated stat card component
6. Export both at 2x resolution
7. Upload to Instagram!

---

## Getting Map Screenshots

**Option 1**: Screenshot from your website
- Go to https://distanzrunning.vercel.app
- Navigate to marathon showcase
- Select the marathon you want
- Take a full-screen screenshot of the map
- Crop to fit 1080x1350px

**Option 2**: Mapbox Static Images API
- Use this URL format:
```
https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/[lng,lat,zoom]/[width]x[height]@2x?access_token=YOUR_TOKEN
```
- Example for NYC:
```
https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-73.9712,40.7831,11/1080x1350@2x?access_token=YOUR_MAPBOX_TOKEN
```

Then overlay the route line manually in Figma using the pen tool with your brand color (#e43c81).
