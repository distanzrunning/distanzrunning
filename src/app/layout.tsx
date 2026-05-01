// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { EB_Garamond } from "next/font/google";
import LayoutContent from "@/components/LayoutContent";
import NavbarAltWrapper from "@/components/NavbarAltWrapper";
import SiteHeaderWrapper from "@/components/SiteHeaderWrapper";
import Footer from "@/components/Footer";
import { DarkModeProvider } from "@/components/DarkModeProvider";
import ReCaptchaProvider from "@/components/ReCaptchaProvider";
import { ConsentProvider } from "@/contexts/ConsentContext";
import { UnitsProvider } from "@/contexts/UnitsContext";
import { ConsentBanner } from "@/components/ui/ConsentBanner";
import ConsentSync from "@/components/ConsentSync";
import { gcmDefaultsScript } from "@/lib/consent-gcm";
import { Analytics } from "@vercel/analytics/react";
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
        {/* Google Consent Mode v2 — must run before any tracking script so
            every Google product (Analytics, Ads, AdSense, GTM) and any
            custom GTM tags pick up the denied baseline. ConsentSync (in
            <body>) calls gtag('consent','update',…) once the user decides. */}
        <script
          id="gcm-defaults"
          dangerouslySetInnerHTML={{ __html: gcmDefaultsScript() }}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

              // List of blocked IPs (your personal IPs to exclude from tracking)
              var blockedIPs = ['91.180.214.205'];

              // PostHog defaults to OPT-OUT for every visitor; ConsentSync
              // flips this to opt-in once the user accepts the Analytics
              // category. Localhost stays opted out unconditionally.
              posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', {
                api_host:'${process.env.NEXT_PUBLIC_POSTHOG_HOST}',
                defaults:'2025-05-24',
                opt_out_capturing_by_default: true,
                loaded: function(posthog) {
                  // Localhost / dev — keep opted out regardless of consent.
                  if (window.location.host.includes('127.0.0.1') ||
                      window.location.host.includes('localhost')) {
                    posthog.opt_out_capturing();
                    return;
                  }

                  // Check user's IP and force opt-out if blocked
                  fetch('https://api.ipify.org?format=json')
                    .then(function(response) { return response.json(); })
                    .then(function(data) {
                      if (blockedIPs.indexOf(data.ip) !== -1) {
                        posthog.opt_out_capturing();
                        console.log('[PostHog] Tracking disabled for blocked IP:', data.ip);
                      }
                    })
                    .catch(function(err) {
                      console.log('[PostHog] Could not check IP:', err);
                    });
                }
              });
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-canvas text-textDefault min-h-screen flex flex-col distanz-font-features">
        <ReCaptchaProvider>
          <DarkModeProvider>
            <UnitsProvider>
            <ConsentProvider>
              <ConsentSync />
              <LayoutContent
                navbar={<NavbarAltWrapper />}
                header={<SiteHeaderWrapper newsletterSource="homepage" />}
                footer={<Footer />}
              >
                {children}
              </LayoutContent>
              <ConsentBanner />

              <Analytics />
              <SpeedInsights />
            </ConsentProvider>
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
