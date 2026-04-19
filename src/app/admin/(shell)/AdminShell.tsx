"use client";

import type { ReactNode } from "react";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DarkModeContext } from "@/components/DarkModeProvider";
import Button from "@/components/ui/Button";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { logout } from "../login/actions";
import {
  CommandMenuDialog,
  CommandMenuTrigger,
} from "./AdminCommandMenu";
import AdminSidebar from "./AdminSidebar";

const SIDEBAR_WIDTH = 260;

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const { theme, setTheme } = useContext(DarkModeContext);
  const [cmdOpen, setCmdOpen] = useState(false);

  // Global ⌘K / Ctrl+K shortcut to toggle the command menu
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
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
          background: "var(--ds-background-100)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <AdminSidebar
          searchTrigger={
            <CommandMenuTrigger onOpen={() => setCmdOpen(true)} />
          }
          footer={
            <div
              style={{
                padding: 12,
                borderTop: "1px solid var(--ds-gray-400)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <ThemeSwitcher
                showSystem={false}
                value={theme === "system" ? "light" : theme}
                onChange={setTheme}
              />
              <form action={logout}>
                <Button type="submit" variant="secondary" size="small">
                  Sign out
                </Button>
              </form>
            </div>
          }
        />
      </aside>
      <main
        style={{
          marginLeft: SIDEBAR_WIDTH,
          minHeight: "100vh",
        }}
      >
        {children}
      </main>

      <CommandMenuDialog
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        pathname={pathname}
      />
    </div>
  );
}
