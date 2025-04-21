// src/app/studio/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout creates a clean environment for the studio without navbar/footer
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} fixed inset-0 h-screen bg-white z-[100]`}>
      {children}
    </div>
  );
}