// src/components/LayoutContent.tsx
"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import PageFrame from "./ui/PageFrame";

interface LayoutContentProps {
  children: ReactNode;
  navbar: ReactNode;
  /** New v0-style SiteHeader rendered on the homepage (temporary — other pages still use `navbar` while the rest of the site is being rebuilt). */
  header: ReactNode;
  footer: ReactNode;
}

export default function LayoutContent({
  children,
  navbar,
  header,
  footer,
}: LayoutContentProps) {
  const pathname = usePathname();
  const isPreviewMode = process.env.NEXT_PUBLIC_PREVIEW_MODE === "true";

  // Hide navbar and footer on login page
  const isLoginPage = pathname === "/login";

  // Admin (dashboard + design system) is a standalone SPA — no site navbar or footer
  const isAdmin = pathname?.startsWith("/admin");

  // Hide footer on calendar page (fullscreen app-like view)
  const isCalendarPage = pathname === "/races/calendar";

  // TEMPORARY: homepage is being rebuilt against the new PageFrame +
  // grid system. Render just the framed canvas while we sort the
  // shell, then re-enable navbar / footer / content in stages.
  const isHome = pathname === "/";

  // Design exploration routes — /designs is a compare page for
  // parallel homepage mocks. /designs/b is a self-contained Claude
  // Design port that owns its own navbar + footer, so it bypasses
  // LayoutContent chrome entirely. /designs and /designs/a use the
  // normal SiteHeader + PageFrame so they match the in-progress
  // homepage direction.
  const isDesignVariantBare = pathname === "/designs/b";
  const useSiteHeaderChrome =
    isHome ||
    pathname === "/designs" ||
    pathname === "/designs/a";

  if (isPreviewMode || isLoginPage || isAdmin || isDesignVariantBare) {
    return <main className="min-h-screen">{children}</main>;
  }

  // Chrome background (area outside the frame):
  //   light → bg-100 (#FFFFFF primary canvas)
  //   dark  → bg-200 (#000000 primary canvas)
  // Frame background (inside, see PageFrame) flips the other way so
  // each mode keeps the "canvas outside, elevated surface inside"
  // relationship rather than inverting it.
  const chromeClass =
    "flex min-h-screen flex-col bg-[var(--ds-background-100)] dark:bg-[var(--ds-background-200)]";

  if (useSiteHeaderChrome) {
    return (
      <div className={chromeClass}>
        {header}
        <PageFrame className="flex flex-1 flex-col">
          <main className="flex-1">{children}</main>
        </PageFrame>
      </div>
    );
  }

  return (
    <div className={chromeClass}>
      {navbar}
      <PageFrame className="flex flex-1 flex-col">
        <main className="flex-1">{children}</main>
      </PageFrame>
      {!isCalendarPage && footer}
    </div>
  );
}
