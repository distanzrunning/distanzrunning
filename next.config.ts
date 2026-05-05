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
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
    ];
  },
};

export default nextConfig;