// src/app/(public)/(bare)/layout.tsx
//
// Gate pages (/login staging gate, /coming-soon holding page) own their
// full-viewport layout — visitor machinery from (public), but no site
// chrome (no announcement banner, no Masthead).
import { ReactNode } from "react";

export default function BareLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-screen">{children}</main>;
}
