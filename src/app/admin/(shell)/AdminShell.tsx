"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { ToastContainer } from "@/components/ui/Toast";
import {
  CommandMenuDialog,
  CommandMenuTrigger,
} from "./AdminCommandMenu";
import AdminPageHeader from "./AdminPageHeader";
import AdminSidebar from "./AdminSidebar";

const SIDEBAR_WIDTH = 260;
// Mirrors AdminPageHeader's HEADER_HEIGHT — used to size the content
// Suspense fallback so its spinner centres in the area below the header.
const HEADER_HEIGHT = 56;

export default function AdminShell({ children }: { children: ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);

  // Global "F" shortcut to toggle the command menu
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "f") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const tag = target.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }
      e.preventDefault();
      setCmdOpen((v) => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "hsl(var(--color-canvas))",
        color: "hsl(var(--color-textDefault))",
      }}
    >
      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: SIDEBAR_WIDTH,
          height: "100vh",
          zIndex: 40,
          borderRight: "1px solid hsl(var(--color-borderDefault))",
          background: "hsl(var(--color-canvas))",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <AdminSidebar
          searchTrigger={
            <CommandMenuTrigger onOpen={() => setCmdOpen(true)} />
          }
        />
      </aside>
      <main
        style={{
          marginLeft: SIDEBAR_WIDTH,
          minHeight: "100vh",
        }}
      >
        <AdminPageHeader />
        {/* Stable Suspense boundary living in the persistent shell. On hard
            load it streams the fallback so the sidebar + header paint fast
            (good FCP). On client navigation it does NOT flash the fallback:
            because the boundary is stable (the shell survives navigation) and
            Link navigations are React transitions, React keeps the current
            page visible and only swaps when the destination is ready — no
            skeleton/blank flash on leave. Replaces the per-route loading.tsx,
            which committed instantly on every nav and so always flashed. */}
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
                color: "hsl(var(--color-textSubtle))",
              }}
            >
              <Spinner size={24} />
            </div>
          }
        >
          {children}
        </Suspense>
      </main>

      <CommandMenuDialog
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
      />

      {/* Global toast surface for any admin page — race-date-review
          uses it to surface scan progress + result. */}
      <ToastContainer />
    </div>
  );
}
