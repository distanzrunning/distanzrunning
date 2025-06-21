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
  description: "The latest running news, marathon guides and gear reviews.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if we're in preview mode
  const isPreviewMode = process.env.PREVIEW_MODE === 'true' || 
                       process.env.NODE_ENV === 'production';

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