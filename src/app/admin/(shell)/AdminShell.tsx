"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { logout } from "../login/actions";
import AdminSidebar, { isDesignSystemRoute } from "./AdminSidebar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const inDs = isDesignSystemRoute(pathname);
  const title = inDs ? "Stride Design System" : "Stride Admin";

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
        <form action={logout}>
          <button
            type="submit"
            style={{
              padding: "8px 12px",
              fontSize: 13,
              border: "1px solid var(--ds-gray-400)",
              borderRadius: 6,
              background: "var(--ds-background-100)",
              color: "var(--ds-gray-1000)",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </form>
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
          <AdminSidebar />
        </aside>
        <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
      </div>
    </div>
  );
}
