"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command, useCommandState } from "cmdk";
import {
  FileText,
  Layers,
  LogOut,
  Search as SearchIcon,
} from "lucide-react";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { logout } from "../login/actions";
import { navigation as dsNavigation } from "./design-system/components/DesignSystemSidebar";
import { isDesignSystemRoute } from "./AdminSidebar";

// ============================================================================
// Dynamic item — only visible when the user has typed something. Navigates to
// the consent lookup view with the query pre-filled.
// ============================================================================

function ConsentLookupItem({ onSelect }: { onSelect: () => void }) {
  const search = useCommandState((state) => state.search);
  const router = useRouter();
  if (!search) return null;
  return (
    <Command.Item
      value={`lookup-consent-id-${search}`}
      onSelect={() => {
        router.push(`/admin/consent?q=${encodeURIComponent(search)}`);
        onSelect();
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "var(--ds-gray-900)",
        }}
      >
        <SearchIcon className="w-4 h-4" />
      </span>
      <span style={{ flex: 1 }}>
        Look up consent ID:{" "}
        <span
          style={{ fontFamily: "var(--font-mono)", color: "var(--ds-gray-700)" }}
        >
          {search}
        </span>
      </span>
    </Command.Item>
  );
}

// ============================================================================
// Trigger button + menu
// ============================================================================

export default function AdminCommandMenu({ pathname }: { pathname: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const inDs = isDesignSystemRoute(pathname);

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 36,
          minWidth: 220,
          padding: "0 10px",
          borderRadius: 8,
          border: "1px solid var(--ds-gray-400)",
          background: "var(--ds-background-100)",
          color: "var(--ds-gray-700)",
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        <SearchIcon className="w-4 h-4" />
        <span style={{ flex: 1, textAlign: "left" }}>
          {inDs ? "Search design system…" : "Search admin…"}
        </span>
        <kbd
          style={{
            fontSize: 11,
            padding: "1px 6px",
            borderRadius: 4,
            color: "var(--ds-gray-700)",
            boxShadow:
              "var(--ds-gray-alpha-400) 0px 0px 0px 1px, var(--ds-gray-100) 0px 0px 0px 1px",
          }}
        >
          ⌘K
        </kbd>
      </button>

      <CommandMenu
        open={open}
        onClose={close}
        placeholder={
          inDs
            ? "Search design system pages or consent IDs…"
            : "Search admin or paste a consent ID…"
        }
      >
        <CommandMenu.Group heading="Go to">
          <CommandMenu.Item
            icon={<FileText className="w-4 h-4" />}
            onSelect={() => {
              router.push("/admin/consent");
              close();
            }}
          >
            Consent dashboard
          </CommandMenu.Item>
          <CommandMenu.Item
            icon={<Layers className="w-4 h-4" />}
            onSelect={() => {
              router.push("/admin/design-system");
              close();
            }}
          >
            Design system
          </CommandMenu.Item>
        </CommandMenu.Group>

        <CommandMenu.Group heading="Consent">
          <ConsentLookupItem onSelect={close} />
        </CommandMenu.Group>

        {dsNavigation.map((section) => (
          <CommandMenu.Group
            key={section.id}
            heading={`Design system · ${section.label}`}
          >
            {section.items
              .filter((item) => !item.locked)
              .map((item) => (
                <CommandMenu.Item
                  key={item.id}
                  icon={<Layers className="w-4 h-4" />}
                  onSelect={() => {
                    router.push(`/admin/design-system/${item.id}`);
                    close();
                  }}
                >
                  {item.label}
                </CommandMenu.Item>
              ))}
          </CommandMenu.Group>
        ))}

        <CommandMenu.Group heading="Actions">
          <CommandMenu.Item
            icon={<LogOut className="w-4 h-4" />}
            onSelect={() => {
              void logout();
              close();
            }}
          >
            Sign out
          </CommandMenu.Item>
        </CommandMenu.Group>
      </CommandMenu>
    </>
  );
}
