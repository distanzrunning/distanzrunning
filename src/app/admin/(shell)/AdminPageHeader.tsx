"use client";

import { useContext, useTransition } from "react";
import { usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { DarkModeContext } from "@/components/DarkModeProvider";
import { Menu, MenuButton, MenuItem, MenuSeparator } from "@/components/ui/Menu";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { logout } from "../login/actions";
import { navigation as dsNavigation } from "./design-system/components/DesignSystemSidebar";

const HEADER_HEIGHT = 56;

function getPageTitle(pathname: string): string {
  if (pathname === "/admin" || pathname === "/admin/") return "Admin";
  if (pathname.startsWith("/admin/consent")) return "Consent";
  if (pathname === "/admin/design-system") return "Design System";
  const dsMatch = pathname.match(/^\/admin\/design-system\/([^/?#]+)/);
  if (dsMatch) {
    const slug = dsMatch[1];
    for (const section of dsNavigation) {
      const item = section.items.find((i) => i.id === slug);
      if (item) return item.label;
    }
  }
  return "Admin";
}

export default function AdminPageHeader() {
  const pathname = usePathname() ?? "";
  const title = getPageTitle(pathname);
  const { theme, setTheme } = useContext(DarkModeContext);
  const [, startTransition] = useTransition();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        height: HEADER_HEIGHT,
        background: "var(--ds-background-100)",
        borderBottom: "1px solid var(--ds-gray-400)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 16px",
      }}
    >
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center max-w-[50%]">
        <span
          className="flex items-center gap-0.5 truncate font-medium"
          style={{
            fontSize: 14,
            lineHeight: "20px",
            letterSpacing: "-0.28px",
            color: "var(--ds-gray-1000)",
          }}
        >
          <span className="min-w-0 truncate">{title}</span>
        </span>
      </div>

      <Menu position="bottom-end" width={240}>
        <MenuButton unstyled aria-label="More options">
          <span
            className="inline-flex items-center justify-center rounded-md transition-colors hover:bg-[var(--ds-gray-100)]"
            style={{
              width: 32,
              height: 32,
              color: "var(--ds-gray-900)",
            }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </span>
        </MenuButton>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 8px",
            height: 40,
            borderRadius: 6,
          }}
        >
          <span style={{ fontSize: 14, color: "var(--ds-gray-1000)" }}>
            Theme
          </span>
          <ThemeSwitcher
            showSystem={false}
            value={theme === "system" ? "light" : theme}
            onChange={setTheme}
          />
        </div>

        <MenuSeparator />

        <MenuItem onClick={() => startTransition(() => logout())}>
          Sign out
        </MenuItem>
      </Menu>
    </header>
  );
}
