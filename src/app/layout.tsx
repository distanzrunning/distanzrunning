// src/app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NavbarAlt from "@/components/NavbarAlt";
import Footer from "@/components/Footer";
import AuthProtection from "@/components/AuthProtection";
import { DarkModeProvider } from "@/components/DarkModeProvider";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Distanz headline font (serif) - used for article headlines and display text
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap',
  adjustFontFallback: false,
});

// Distanz body font (serif) - used for long-form articles and feature content
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"],
  display: 'swap',
});

// Distanz monospace font - used for race times, statistics, and data
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Distanz Running",
  description: "The latest running news, gear reviews, and interactive race guides.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  metadataBase: new URL('https://distanzrunning.com'),
  alternates: {
    canonical: 'https://distanzrunning.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isPreviewMode = process.env.PREVIEW_MODE === 'true';

  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Prevent flash of dark mode - ensure light mode by default */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                // Only apply dark mode if explicitly saved, otherwise ensure light mode
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
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

              // Check if we should opt out (localhost or development)
              var shouldOptOut = window.location.host.includes('127.0.0.1') ||
                                window.location.host.includes('localhost');

              posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', {
                api_host:'${process.env.NEXT_PUBLIC_POSTHOG_HOST}',
                defaults:'2025-05-24',
                opt_out_capturing_by_default: shouldOptOut,
                loaded: function(posthog) {
                  // Automatically opt out on localhost/development
                  if (shouldOptOut) {
                    posthog.opt_out_capturing();
                    return;
                  }

                  // Check user's IP and opt out if blocked
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
      <body className="font-sans antialiased bg-white text-textDefault min-h-screen flex flex-col distanz-font-features">
        <DarkModeProvider>
          <AuthProtection>
            {isPreviewMode ? (
              <main className="min-h-screen">{children}</main>
            ) : (
              <>
                <NavbarAlt />
                <main className="flex-grow">{children}</main>
                <Footer />
              </>
            )}
          </AuthProtection>

          <Analytics />
          <SpeedInsights />
        </DarkModeProvider>
      </body>
    </html>
  );
}