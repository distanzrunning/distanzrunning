// src/app/admin/layout.tsx
//
// Lean admin tree — DarkModeProvider (theme) + the admin SPA. None of
// the public visitor machinery (consent, analytics, AdSense, Turnstile,
// site chrome) loads here; that all lives in the (public) route group.
import { ReactNode } from "react";

import { DarkModeProvider } from "@/components/DarkModeProvider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DarkModeProvider>
      {/* data-admin-shell keys the html:has() rule in globals.css that
          suppresses root overscroll bounce on admin only — it's an app
          shell under a fixed admin bar, unlike the public content pages
          which keep the native stretch. */}
      <main data-admin-shell className="min-h-screen">
        {children}
      </main>
    </DarkModeProvider>
  );
}
