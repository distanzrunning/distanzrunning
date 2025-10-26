# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Distanz Running is a Next.js 15 (App Router) running website featuring:
- Editorial content (articles, gear reviews, race guides) managed via Sanity CMS
- Interactive race database with AG Grid
- Newsletter subscription system
- Staging environment with password authentication

## Development Commands

### Essential Commands
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm start            # Run production build locally
npm run lint         # Run ESLint (note: ignoreDuringBuilds: true in next.config.ts)
```

### Build Notes
- TypeScript errors are ignored during builds (`ignoreBuildErrors: true`)
- ESLint errors are ignored during builds (`ignoreDuringBuilds: true`)
- This is intentional for rapid iteration but should be addressed before major releases

## Architecture

### Content Management (Sanity CMS)

**Sanity Client Configuration:**
- Unified client using `next-sanity` located in `/src/sanity/lib/client.ts`
- Environment configuration in `/src/sanity/env.ts`
- Image URL builder in `/src/sanity/lib/image.ts`
- Live preview support via `/src/sanity/lib/live.ts`

**Sanity Studio:**
- Accessible at `/studio` route (configured in `sanity.config.ts` with `basePath: '/studio'`)
- Schema types defined in `/src/sanity/schemaTypes/`
- Content structure customized in `/src/sanity/structure.ts`

**Content Types:**
- `post` - Blog articles
- `gearPost` - Gear reviews
- `raceGuide` - Race guides with interactive maps
- `category`, `gearCategory`, `raceCategory` - Taxonomies
- `author` - Author profiles
- `table` - Custom table blocks
- `customCodeBlock` - Code syntax highlighting

**Content Queries:**
- GROQ queries stored in `/src/sanity/queries/`
- Common patterns: featured content, category filtering, similar articles

### Routing Structure

**App Router Organization:**
- `/` - Homepage
- `/articles` - Article index
- `/articles/post/[postSlug]` - Individual articles
- `/articles/category/[categorySlug]` - Category filtered articles
- `/gear/[gearSlug]` - Individual gear reviews
- `/gear/category/[gearCategorySlug]` - Gear category pages
- `/races` - Race guides index
- `/races/[raceSlug]` - Individual race guides
- `/races/database` - Interactive race database (AG Grid)
- `/studio/[[...tool]]` - Sanity Studio (catch-all route)
- `/login` - Staging authentication

### Styling System

**Tailwind Configuration (`tailwind.config.js`):**
- Custom "Quartr" design system with precise typography
- CSS variables for colors (rgb(var(--color-*)))
- Custom utility classes: `.quartr-container`, `.quartr-article-container`, `.quartr-article-col`
- Custom font feature settings: `.quartr-font-features`
- Tight line heights (1.15-1.35) for professional, squared typography

**Typography:**
- Primary font: Playfair Display (serif, loaded via `next/font/google`)
- Sans-serif: Custom Inter variable font stack
- Extensive custom font sizes with pixel-perfect specifications (`[17px]`, `[56px]`, etc.)
- Material Symbols Outlined icons loaded from Google Fonts CDN

**Color System:**
- Primary: `#e43c81` (pink/red)
- Secondary: `#eeb6cd` (light pink)
- Dark/light mode via CSS variables defined in `globals.css`
- Brand colors defined in `/src/lib/constants.ts`

### Authentication System

**Staging Environment Protection:**
- Only enforced on `distanzrunning.vercel.app` domain
- Components: `AuthProtection` wrapper, `/api/auth` route, `/login` page
- Uses signed cookies with HMAC-SHA256 for security
- Password stored in `STAGING_PASSWORD` environment variable
- Auth secret in `AUTH_SECRET` environment variable
- Cookie verification prevents timing attacks using `crypto.timingSafeEqual`

**How It Works:**
1. `AuthProtection` component wraps all content in `layout.tsx`
2. Checks hostname - only protects staging URL
3. Verifies signed `staging-auth` cookie
4. Redirects to `/login` if not authenticated
5. Loading states use Framer Motion animations

### Data Loading Patterns

**Race Database (`/races/database`):**
- Fetches CSV from Google Sheets public export
- Uses PapaParse for CSV parsing
- AG Grid Community edition for table display
- Client-side only (entire page is `'use client'`)
- Metric/Imperial unit conversion on the fly
- Responsive column definitions based on viewport size

**Sanity Content:**
- Server-side fetching via `createClient` from `next-sanity`
- Queries use GROQ syntax
- Image URLs generated via `@sanity/image-url`
- Portable Text rendered with `@portabletext/react`

### Component Patterns

**Key Reusable Components:**
- `Navbar` / `NavbarClient` - Navigation with auth awareness
- `Footer` - Site footer
- `NewsletterSignup` / `NewsletterModal` - Subscription UI
- `AuthProtection` - Staging authentication wrapper
- `ArticleCard` - Article preview cards
- `FeaturedArticle` - Hero article display
- `TableOfContents` / `TableOfContentsWidget` - Article navigation
- `RaceMapComponent` - Interactive race route maps
- `CustomCodeBlock` - Syntax highlighted code blocks
- `CustomTable` - Styled tables for Portable Text

**State Management:**
- No global state library (Redux, Zustand, etc.)
- Component-level state with `useState`
- URL state for filters/search where applicable
- Dark mode via `DarkModeProvider` context

### API Routes

**Newsletter System:**
- `/api/subscribe` - POST: Subscribe to newsletter
- `/api/confirm` - Email confirmation endpoint

**Authentication:**
- `/api/auth` - POST: Login with password, GET: Check auth status

### Analytics & Tracking

**PostHog Web Analytics:**
- Initialized via JavaScript snippet in `/src/app/layout.tsx` (recommended approach)
- Also available via `/instrumentation-client.ts` for module-based usage
- Automatic pageview and pageleave tracking enabled
- Uses EU hosting at `https://eu.i.posthog.com`
- Configuration:
  - `defaults: '2025-05-24'` - Latest SDK defaults for automatic tracking
  - Automatically captures button clicks, form submissions, and other interactions
  - Automatically captures scroll depth and time on page

**Implementation:**
The PostHog snippet is loaded in the `<head>` of `layout.tsx` using `dangerouslySetInnerHTML`. This ensures PostHog is available globally as `window.posthog` on all pages.

**Usage:**
Access PostHog directly via `window.posthog` or import from `posthog-js`:
```typescript
// Option 1: Use window.posthog (available globally)
window.posthog.capture('button_clicked', { button_name: 'newsletter_signup' });

// Option 2: Import from posthog-js
import posthog from 'posthog-js';
posthog.capture('button_clicked', { button_name: 'newsletter_signup' });

// Identify users
posthog.identify('user_id', { email: 'user@example.com' });
```

**Custom Events Tracked:**
- `newsletter_signup` - Fired when user successfully subscribes to newsletter
  - Properties: `location` (modal/footer), `email_domain`, `source`
- `newsletter_modal_opened` - Fired when newsletter modal is opened
  - Properties: `location` (homepage)
- `explore_marathon_majors_clicked` - Fired when "Explore the Marathon Majors" button is clicked
  - Properties: `variant` (default/pink), `location` (homepage)

**Creating Conversion Goals in PostHog:**
1. Go to [Web Analytics Dashboard](https://eu.i.posthog.com/web)
2. Click **Add conversion goal** (next to filters)
3. Search and select event: `newsletter_signup`
4. This adds conversion metrics to your dashboard:
   - Total conversions
   - Unique conversions
   - Conversion rate (% of visitors who subscribe)
5. Use filters to segment by location (modal vs footer)

**Alternative: Create Action First (Optional)**
1. Go to **Data Management** → **Actions** → **New Action**
2. Name: "Newsletter Signup"
3. Match event: `newsletter_signup`
4. Then add this action as a conversion goal in Web Analytics

**Google Tag Manager:**
- Configured in main layout
- GTM ID: GTM-K3W2LWHM

## Environment Variables

Environment variables are managed in Vercel (not stored in local `.env` files):

```
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION

# Authentication
STAGING_PASSWORD
AUTH_SECRET

# Analytics
GTM_ID (Google Tag Manager, referenced in layout.tsx)
NEXT_PUBLIC_POSTHOG_KEY (PostHog project API key)
NEXT_PUBLIC_POSTHOG_HOST (PostHog host URL - EU: https://eu.i.posthog.com)

# Preview Mode
PREVIEW_MODE (set to 'true' to disable navbar/footer)
```

**Note:** For local development, you may need to create a `.env.local` file with these variables or pull them from Vercel using `vercel env pull`. A `.env.example` file is provided in the root directory as a template.

## Important Conventions

### TypeScript Usage
- Project uses TypeScript but type errors don't block builds
- Type safety is aspirational rather than enforced
- Consider running `tsc --noEmit` manually to check types

### Image Optimization
- All Sanity images go through Next.js Image optimization
- Remote pattern configured for `cdn.sanity.io`
- Custom device sizes and image sizes defined in `next.config.ts`
- Helper utilities in `/src/lib/image.ts` and `/lib/image.ts`

### Performance Optimizations
- `experimental.optimizeCss: true` - CSS optimization enabled
- `experimental.optimizeServerReact: true` - Server component optimizations
- Vercel Analytics and Speed Insights integrated
- Google Tag Manager (GTM-K3W2LWHM)
- PostHog Web Analytics integrated via `instrumentation-client.ts`

### Git Workflow
- Main branch: `main`
- Staging branch: `staging` (current branch)
- Clean working tree at conversation start

### Instagram Post Generator

**Instagram Post Component:**
- Located in `/src/components/InstagramPost.tsx`
- Generates 1080x1080px Instagram-ready posts
- Two types: `map` (route + logo) and `stats` (key statistics)
- View at `/instagram-post` route

**Generating Posts:**
1. Navigate to `http://localhost:3000/instagram-post`
2. Posts are displayed at exact Instagram dimensions (1080x1080)
3. Screenshot or save images to use on Instagram
4. Edit `/src/app/instagram-post/page.tsx` to change marathon or post type

**Customization:**
```typescript
const marathonId = 'nyc' // tokyo, boston, london, berlin, chicago, nyc, sydney
const postType: 'map' | 'stats' = 'map' // or 'stats'
```

## Common Tasks

### Adding a New Sanity Schema Type
1. Create schema in `/src/sanity/schemaTypes/[name]Type.ts`
2. Export from `/src/sanity/schemaTypes/index.ts`
3. Add to structure in `/src/sanity/structure.ts` if it needs custom organization
4. Create query in `/src/sanity/queries/` if needed

### Adding a New Page
1. Create route in `/src/app/[path]/page.tsx`
2. Export metadata for SEO
3. Follow existing typography/layout patterns with Quartr containers
4. Add to navbar in `/src/components/Navbar.tsx` or `/src/components/NavbarClient.tsx`

### Working with the Race Database
- CSV source: Google Sheets public export URL in `/src/app/races/database/page.tsx`
- To modify columns: Update `getColumnDefs` function
- To add filters: Use AG Grid's built-in filter components
- Unit conversions: See `metricToImperial` helper functions

### Styling New Components
- Use Tailwind utility classes with Quartr design tokens
- For article content, use `.quartr-article-container` and `.quartr-article-col`
- Follow tight line-height patterns (1.15-1.35)
- Reference brand colors from `/src/lib/constants.ts` or Tailwind theme
- Font feature settings: Add `.quartr-font-features` class for proper Inter rendering

## Known Issues

- Build errors are suppressed - technical debt
- No automated testing infrastructure
- Navbar comment mentions CORS/middleware changes to watch for

## Recent Improvements

- ✅ Consolidated Sanity client configuration (removed duplicate clients)
- ✅ Added `.env.example` file for environment variable documentation
- ✅ Cleaned up duplicate CSS rules in `globals.css`
