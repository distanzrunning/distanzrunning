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
import AdminSidebar, { isDesignSystemRoute } from "./AdminSidebar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const inDs = isDesignSystemRoute(pathname);
  const title = inDs ? "Stride Design System" : "Stride Admin";
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
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "var(--ds-background-100)",
          borderBottom: "1px solid var(--ds-gray-400)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/stride_icon_black.svg"
            alt="Stride"
            className="dark:hidden"
            style={{ width: 24, height: 24 }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/stride_icon_white.svg"
            alt="Stride"
            className="hidden dark:block"
            style={{ width: 24, height: 24 }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "-0.32px",
            }}
          >
            {title}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
      </header>

      <div style={{ display: "flex", alignItems: "stretch" }}>
        <aside
          style={{
            width: 260,
            minWidth: 260,
            height: "calc(100vh - 64px)",
            position: "sticky",
            top: 64,
            borderRight: "1px solid var(--ds-gray-400)",
            background: "var(--ds-background-100)",
            overflowY: "auto",
          }}
        >
          <AdminSidebar
            searchTrigger={
              <CommandMenuTrigger onOpen={() => setCmdOpen(true)} />
            }
          />
        </aside>
        <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
      </div>

      <CommandMenuDialog
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        pathname={pathname}
      />
    </div>
  );
}
