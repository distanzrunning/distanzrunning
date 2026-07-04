// src/app/admin/layout.tsx
//
// Lean admin tree — DarkModeProvider (theme) + the admin SPA. None of
// the public visitor machinery (consent, analytics, AdSense, reCAPTCHA,
// site chrome) loads here; that all lives in the (public) route group.
import { ReactNode } from "react";

import { DarkModeProvider } from "@/components/DarkModeProvider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DarkModeProvider>
      <main className="min-h-screen">{children}</main>
    </DarkModeProvider>
  );
}
