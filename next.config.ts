// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    // Keep visited dynamic route segments in the client router cache for 30s
    // (Next 15 default is 0 = never). Switching between already-visited admin
    // dashboards then serves from cache instantly — no loading.tsx commit, so
    // no skeleton/blank flash on leave — while first visits + hard loads still
    // stream the loading fallback. 30s matches the server data-cache TTL, so
    // the cached view is never more stale than a fresh fetch would be.
    staleTimes: {
      dynamic: 30,
    },
  },
  productionBrowserSourceMaps: false,
  
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  
  // REMOVED: async headers() function that was blocking middleware
  // Move CORS handling to middleware instead
  
  // Disable Vercel toolbar completely
  env: {
    VERCEL_TOOLBAR: 'false',
  },
  
  eslint: {
    // TODO(advisor-003): 13 lint errors across 7 files to clear before we can
    // enable this gate (unused vars, prefer-const, a handful of `any`). The
    // type gate below has been restored; the lint gate is a follow-up. Until
    // then `next build` will not fail on lint errors.
    ignoreDuringBuilds: true,
  },
  // Type errors now fail the build again (backlog cleared in advisor-003).
  // Do NOT re-add `typescript.ignoreBuildErrors` — it silently ships type bugs.

  // The /r/* registry routes read component source from the repo at
  // request time. Vercel's deployment tracing won't include those
  // .tsx files by default because they're not statically imported,
  // so name them explicitly here.
  outputFileTracingIncludes: {
    "/r": [
      "./src/components/ui/*.tsx",
      "./src/components/*.tsx",
      "./src/contexts/*.tsx",
      "./src/registry/styles/*.css",
    ],
    "/r/*": [
      "./src/components/ui/*.tsx",
      "./src/components/*.tsx",
      "./src/contexts/*.tsx",
      "./src/registry/styles/*.css",
    ],
  },

  // Permanent redirects for the URL flattening — old paths
  // (/articles/category/X, /articles/post/X, /shoes/category/X,
  // /gear/category/X, /nutrition/category/X) now resolve at the
  // section root via a single dynamic handler that disambiguates
  // category vs post against Sanity.
  async redirects() {
    return [
      {
        source: "/articles/category/:slug",
        destination: "/articles/:slug",
        permanent: true,
      },
      {
        source: "/articles/post/:slug",
        destination: "/articles/:slug",
        permanent: true,
      },
      {
        source: "/shoes/category/:slug",
        destination: "/shoes/:slug",
        permanent: true,
      },
      {
        source: "/gear/category/:slug",
        destination: "/gear/:slug",
        permanent: true,
      },
      {
        source: "/nutrition/category/:slug",
        destination: "/nutrition/:slug",
        permanent: true,
      },
      // Runner's Guide articles merged into their raceGuide
      // counterparts (May 2026). Old article URLs stay
      // permanent-redirected to the race detail page so existing
      // links and search-engine indexing keep working.
      {
        source: "/articles/tokyo-marathon-runners-guide",
        destination: "/races/tokyo-marathon",
        permanent: true,
      },
      {
        source: "/articles/boston-marathon-runners-guide",
        destination: "/races/boston-marathon",
        permanent: true,
      },
      {
        source: "/articles/chicago-marathon-runners-guide",
        destination: "/races/chicago-marathon",
        permanent: true,
      },
      {
        source: "/articles/berlin-marathon-runners-guide",
        destination: "/races/berlin-marathon",
        permanent: true,
      },
      {
        source: "/articles/new-york-city-marathon-runners-guide",
        destination: "/races/new-york-city-marathon",
        permanent: true,
      },
      {
        source: "/articles/london-marathon-runners-guide",
        destination: "/races/london-marathon",
        permanent: true,
      },
      // London raceGuide originally shipped with a typo'd slug
      // ("london-matathon"). Slug corrected to "london-marathon"
      // — this redirect catches any inbound links / cached
      // search results still pointing at the old URL.
      {
        source: "/races/london-matathon",
        destination: "/races/london-marathon",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;