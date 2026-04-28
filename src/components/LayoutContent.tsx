// src/components/LayoutContent.tsx
//
// Server component. Reads the current pathname from the x-pathname
// header (set in middleware.ts) and picks the right chrome before
// the HTML ever leaves the server. Previously this was a client
// component using `usePathname()`, which returns null during static
// rendering — that caused the homepage to render with the legacy
// navbar HTML and only swap to the SiteHeader after hydration
// (visible as a brief flash on first load).

import { headers } from "next/headers";
import { ReactNode } from "react";
import PageFrame from "./ui/PageFrame";

interface LayoutContentProps {
  children: ReactNode;
  navbar: ReactNode;
  /** v0-style SiteHeader rendered on the homepage. Other pages still use the legacy `navbar` while the rest of the site is being rebuilt. */
  header: ReactNode;
  footer: ReactNode;
}

export default async function LayoutContent({
  children,
  navbar,
  header,
  footer,
}: LayoutContentProps) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/";

  const isPreviewMode = process.env.NEXT_PUBLIC_PREVIEW_MODE === "true";

  // Hide navbar and footer on login page
  const isLoginPage = pathname === "/login";

  // Admin (dashboard + design system + studio) is a standalone SPA — no site navbar or footer
  const isAdmin = pathname.startsWith("/admin");

  // Hide footer on calendar page (fullscreen app-like view)
  const isCalendarPage = pathname === "/races/calendar";

  // Homepage uses the new SiteHeader chrome.
  const isHome = pathname === "/";

  if (isPreviewMode || isLoginPage || isAdmin) {
    return <main className="min-h-screen">{children}</main>;
  }

  // Chrome background (area outside the frame):
  //   light → bg-100 (#FFFFFF primary canvas)
  //   dark  → bg-200 (#000000 primary canvas)
  const chromeClass =
    "flex min-h-screen flex-col bg-[var(--ds-background-100)] dark:bg-[var(--ds-background-200)]";

  if (isHome) {
    return (
      <div className={chromeClass}>
        {header}
        <PageFrame className="flex flex-1 flex-col">
          <main className="flex-1">{children}</main>
        </PageFrame>
        {footer}
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
