// src/app/admin/studio/layout.tsx
//
// Layout for the integrated Sanity Studio at /admin/studio.
//
// Sits OUTSIDE the (shell) route group so the AdminSidebar doesn't
// wrap the Studio — Sanity Studio is dense, full-viewport UI and
// fights side-by-side chrome. We add a slim "Back to admin" top bar
// so users can get back to the sidebar-driven admin without using
// the browser back button.
//
// Auth: gated by the same isAdminAuthenticated cookie check as the
// rest of /admin/*. Sanity's own auth (Google / email) still happens
// inside the Studio component the first time — that's how the
// editor obtains a token to talk to api.sanity.io. After that the
// token persists in localStorage.

import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = {
  robots: { index: false, follow: false },
  title: "Sanity Studio · Distanz Admin",
};

export default async function StudioLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  // Studio expects full-viewport; fixed inset-0 + z-[100] gives it
  // a clean overlay above any inherited layout. Top bar stays
  // sticky inside the fixed container; the rest is Studio's canvas.
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: "var(--ds-background-100)" }}
    >
      <div
        className="flex h-10 shrink-0 items-center border-b px-3"
        style={{
          background: "var(--ds-background-200)",
          borderBottomColor: "var(--ds-gray-400)",
        }}
      >
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[13px] leading-5 transition-colors"
          style={{ color: "var(--ds-gray-900)" }}
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to admin
        </Link>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
