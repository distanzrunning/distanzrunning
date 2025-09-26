// src/app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleTagManager } from '@next/third-parties/google';
import { headers } from 'next/headers';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap',
  adjustFontFallback: false,
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get hostname to check for staging domain
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const isStagingDomain = host === 'distanzrunning.vercel.app'
  
  const isPreviewMode = process.env.PREVIEW_MODE === 'true' || isStagingDomain;

  return (
    <html lang="en" className={`${playfair.variable}`}>
      <GoogleTagManager gtmId="GTM-K3W2LWHM" />
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className="font-sans antialiased bg-white text-textDefault min-h-screen flex flex-col quartr-font-features">
        {isPreviewMode ? (
          <main className="min-h-screen">{children}</main>
        ) : (
          <>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </>
        )}
        
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}