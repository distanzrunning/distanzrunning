"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ToastContainer } from "@/components/ui/Toast";
import {
  CommandMenuDialog,
  CommandMenuTrigger,
} from "./AdminCommandMenu";
import AdminPageHeader from "./AdminPageHeader";
import AdminSidebar from "./AdminSidebar";

const SIDEBAR_WIDTH = 260;

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
        background: "var(--ds-background-200)",
        color: "var(--ds-gray-1000)",
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
          borderRight: "1px solid var(--ds-gray-400)",
          background: "var(--ds-background-200)",
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
        {children}
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
