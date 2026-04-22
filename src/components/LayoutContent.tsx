// src/components/LayoutContent.tsx
"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import PageFrame from "./ui/PageFrame";

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

  // Admin (dashboard + design system) is a standalone SPA — no site navbar or footer
  const isAdmin = pathname?.startsWith("/admin");

  // Hide footer on calendar page (fullscreen app-like view)
  const isCalendarPage = pathname === "/races/calendar";

  // TEMPORARY: homepage is being rebuilt against the new PageFrame +
  // grid system. Render just the framed canvas while we sort the
  // shell, then re-enable navbar / footer / content in stages.
  const isHome = pathname === "/";

  if (isPreviewMode || isLoginPage || isAdmin) {
    return <main className="min-h-screen">{children}</main>;
  }

  if (isHome) {
    return (
      <div
        className="flex min-h-screen flex-col"
        style={{ background: "var(--ds-background-100)" }}
      >
        <PageFrame className="flex flex-1 flex-col">
          <main className="flex-1">{children}</main>
        </PageFrame>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "var(--ds-background-100)" }}
    >
      {navbar}
      <PageFrame className="flex flex-1 flex-col">
        <main className="flex-1">{children}</main>
      </PageFrame>
      {!isCalendarPage && footer}
    </div>
  );
}
