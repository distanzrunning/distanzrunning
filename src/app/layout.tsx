// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { EB_Garamond } from "next/font/google";
import LayoutContent from "@/components/LayoutContent";
import SiteHeaderWrapper from "@/components/SiteHeaderWrapper";
import Footer from "@/components/Footer";
import { DarkModeProvider } from "@/components/DarkModeProvider";
import ReCaptchaProvider from "@/components/ReCaptchaProvider";
import { C15tPrefetch } from "@c15t/nextjs";
import { ConsentManagerClient } from "@/components/consent/ConsentManagerClient";
import { UnitsProvider } from "@/contexts/UnitsContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { ConsentBanner } from "@/components/ui/ConsentBanner";
import { ConsentModeSync } from "@/components/consent/ConsentModeSync";
import { PostHogConsentSync } from "@/components/consent/PostHogConsentSync";
import { gcmDefaultsScript } from "@/lib/c15t/gcm";
import { ConsentedAnalytics } from "@/components/consent/ConsentedAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Distanz Typography System — all fonts self-hosted
// Body/UI: Geist Sans (`geist/font/sans`)
// Mono/Data: Geist Mono (`geist/font/mono`)
// Editorial headings: EB Garamond (Google Fonts via `next/font/google`)
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Distanz Running",
  description:
    "The latest running news, gear reviews, and interactive race guides.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://distanzrunning.com"),
  alternates: {
    canonical: "https://distanzrunning.com",
  },
  verification: {
    other: {
      "google-adsense-account": "ca-pub-8457173435004026",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`bg-canvas ${GeistSans.variable} ${GeistMono.variable} ${ebGaramond.variable}`}
    >
      <head>
        {/* Theme bootstrap — runs synchronously before first paint so
            users on system/dark don't see a flash of light. Reads
            localStorage for an explicit preference; if none (the
            default for new visitors) or set to "system", honours the
            OS via prefers-color-scheme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Mirrors --ds-background-200 in globals.css per
                // theme — the same token body uses for its
                // background-color. Setting it inline on <html>
                // before paint stops the browser-default white
                // canvas from flashing through on dark-mode reloads
                // (it'd otherwise paint white until the stylesheet
                // loaded the body bg rule).
                var darkBg = '#000000';
                var lightBg = '#FAFAFA';
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia
                    && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = stored === 'dark'
                    || ((!stored || stored === 'system') && prefersDark);
                  var root = document.documentElement;
                  if (isDark) {
                    root.classList.add('dark');
                    root.style.colorScheme = 'dark';
                    root.style.backgroundColor = darkBg;
                  } else {
                    root.classList.remove('dark');
                    root.style.colorScheme = 'light';
                    root.style.backgroundColor = lightBg;
                  }
                } catch (e) {
                  var fallbackDark = window.matchMedia
                    && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var fallbackRoot = document.documentElement;
                  if (fallbackDark) {
                    fallbackRoot.classList.add('dark');
                    fallbackRoot.style.colorScheme = 'dark';
                    fallbackRoot.style.backgroundColor = darkBg;
                  } else {
                    fallbackRoot.style.backgroundColor = lightBg;
                  }
                }
              })();
            `,
          }}
        />
        {/* Google Consent Mode v2 — must run before AdSense so it picks up the
            denied baseline. ConsentModeSync (in <body>) fires
            gtag('consent','update',…) once the user decides. PostHog is no
            longer inlined here — c15t loads it after `measurement` consent
            (see ConsentManagerClient). */}
        <script
          id="gcm-defaults"
          dangerouslySetInnerHTML={{ __html: gcmDefaultsScript() }}
        />
        {/* Start the c15t /init prefetch before hydration (jurisdiction +
            policy). Static-safe: an inline script, not next/headers, so it
            doesn't deopt SSG pages. The provider auto-consumes the matched
            prefetch (same backendURL), killing the banner flash + the lazy
            client /init waterfall. c15t's recommended init flow for static
            routes. */}
        <C15tPrefetch backendURL="/api/c15t" />
      </head>
      <body className="font-sans antialiased bg-canvas text-textDefault min-h-screen flex flex-col distanz-font-features">
        <ReCaptchaProvider>
          <DarkModeProvider>
            <UnitsProvider>
            <ConsentManagerClient>
              <SearchProvider>
                <ConsentModeSync />
                <PostHogConsentSync />
                <LayoutContent
                  header={<SiteHeaderWrapper newsletterSource="homepage" />}
                  footer={<Footer />}
                >
                  {children}
                </LayoutContent>
                <ConsentBanner />

                <ConsentedAnalytics />
                <SpeedInsights />
              </SearchProvider>
            </ConsentManagerClient>
            </UnitsProvider>
          </DarkModeProvider>
        </ReCaptchaProvider>

        {/* Google AdSense — loads once for the whole app. Individual ad units
            live in <AdSlot /> and push themselves to `adsbygoogle` once visible.
            Rendered as a raw <script> (rather than next/script) so AdSense
            doesn't log a warning about the data-nscript attribute. */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8457173435004026"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
