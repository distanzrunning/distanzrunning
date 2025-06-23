import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  // Google-specific optimizations
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
  // Check if we're in preview mode
  const isPreviewMode = process.env.PREVIEW_MODE === 'true';

  if (isPreviewMode) {
    // Preview mode: no navbar/footer
    return (
      <html lang="en" className={`${playfair.variable}`}>
        <body className="font-sans antialiased bg-white text-textDefault min-h-screen quartr-font-features">
          <main className="min-h-screen">{children}</main>
        </body>
      </html>
    );
  }

  // Development mode: full layout with navbar/footer
  return (
    <html lang="en" className={`${playfair.variable}`}>
      <body className="font-sans antialiased bg-white text-textDefault min-h-screen flex flex-col quartr-font-features">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}