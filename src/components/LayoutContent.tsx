// src/components/LayoutContent.tsx
"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface LayoutContentProps {
  children: ReactNode;
  navbar: ReactNode;
  footer: ReactNode;
}

export default function LayoutContent({
  children,
  navbar,
  footer,
}: LayoutContentProps) {
  const pathname = usePathname();
  const isPreviewMode = process.env.NEXT_PUBLIC_PREVIEW_MODE === "true";

  // Hide navbar and footer on login page
  const isLoginPage = pathname === "/login";

  // Design system is a standalone SPA — no site navbar or footer
  const isDesignSystem = pathname?.startsWith("/design-system");

  // Hide footer on calendar page (fullscreen app-like view)
  const isCalendarPage = pathname === "/races/calendar";

  if (isPreviewMode || isLoginPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  if (isDesignSystem) {
    return (
      <div className="main-wrapper">
        <div className="main-bordered min-h-screen flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <div className="main-bordered min-h-screen flex flex-col">
        {navbar}
        {/* Navbar is sticky - no padding needed, scrolls naturally */}
        <main className="flex-1 bg-canvas">
          {children}
        </main>
        {!isCalendarPage && footer}
      </div>
    </div>
  );
}
