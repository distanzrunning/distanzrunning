"use client";

import { useRouter } from "next/navigation";
import { useCommandState } from "cmdk";
import {
  ArrowRight,
  LogOut,
  PanelsTopLeft,
  Search as SearchIcon,
  SquareCheckBig,
} from "lucide-react";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { logout } from "../login/actions";
import { navigation as dsNavigation } from "./design-system/components/DesignSystemSidebar";

function BrandItemIcon() {
  return (
    <span
      style={{
        position: "relative",
        display: "block",
        width: 16,
        height: 16,
        flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/icon-black.svg"
        alt=""
        className="dark:hidden"
        style={{ position: "absolute", inset: 0, width: 16, height: 16 }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/icon-white.svg"
        alt=""
        className="hidden dark:block"
        style={{ position: "absolute", inset: 0, width: 16, height: 16 }}
      />
    </span>
  );
}

// ============================================================================
// Trigger (rendered at the top of the sidebar, Vercel-style search pill)
// ============================================================================

export function CommandMenuTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Find"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: 36,
        padding: 0,
        borderRadius: 6,
        border: "1px solid var(--ds-gray-alpha-400)",
        background: "var(--ds-background-100)",
        color: "var(--ds-gray-1000)",
        cursor: "text",
        fontSize: 14,
        textAlign: "left",
        fontFamily: "inherit",
      }}
    >
      <span
        style={{
          display: "grid",
          placeItems: "center",
          width: 36,
          height: 36,
          paddingLeft: 4,
          color: "var(--ds-gray-900)",
          flexShrink: 0,
        }}
      >
        <SearchIcon className="w-4 h-4" />
      </span>
      <span
        style={{
          flex: 1,
          textAlign: "left",
          color: "var(--ds-gray-800)",
          paddingLeft: 2,
          fontSize: 14,
          lineHeight: "20px",
        }}
      >
        Find…
      </span>
      <span
        style={{
          display: "grid",
          placeItems: "center",
          width: 36,
          height: 36,
          flexShrink: 0,
        }}
      >
        <kbd
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 20,
            height: 20,
            padding: "0 4px",
            fontSize: 11,
            borderRadius: 4,
            boxShadow:
              "var(--ds-gray-alpha-400) 0px 0px 0px 1px, var(--ds-gray-100) 0px 0px 0px 1px",
            color: "var(--ds-gray-1000)",
            fontFamily: "inherit",
          }}
        >
          F
        </kbd>
      </span>
    </button>
  );
}

// ============================================================================
// Dynamic item — only visible when the user has typed something. Navigates to
// the consent lookup view with the query pre-filled.
// ============================================================================

function ConsentLookupItem({ onSelect }: { onSelect: () => void }) {
  const search = useCommandState((state) => state.search);
  const router = useRouter();
  if (!search) return null;
  return (
    <CommandMenu.Item
      value={`lookup-consent-id-${search}`}
      icon={<SearchIcon className="w-4 h-4" />}
      subtitle="Consent"
      onSelect={() => {
        router.push(`/admin/consent?q=${encodeURIComponent(search)}`);
        onSelect();
      }}
    >
      Look up consent ID:{" "}
      <span
        style={{ fontFamily: "var(--font-mono)", color: "var(--ds-gray-700)" }}
      >
        {search}
      </span>
    </CommandMenu.Item>
  );
}

// ============================================================================
// Dialog — rendered at the shell level, controlled open state
// ============================================================================

// Marker keyword for items that should always appear in the unfiltered list.
// Items without this keyword are only surfaced when the user is actively
// typing (see the filter function below).
const TOP_LEVEL = "__admin_toplevel__";

function adminFilter(value: string, search: string, keywords?: string[]) {
  const kw = keywords ?? [];
  const trimmed = search.trim();
  if (!trimmed) {
    return kw.includes(TOP_LEVEL) ? 1 : 0;
  }
  const needle = trimmed.toLowerCase();
  if (value.toLowerCase().includes(needle)) return 1;
  for (const k of kw) {
    if (k.toLowerCase().includes(needle)) return 1;
  }
  return 0;
}

export function CommandMenuDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <CommandMenu
      open={open}
      onClose={onClose}
      placeholder="Search..."
      filter={adminFilter}
    >
      <ConsentLookupItem onSelect={onClose} />

      <CommandMenu.Item
        icon={<SquareCheckBig className="w-4 h-4" />}
        subtitle="Admin"
        keywords={[TOP_LEVEL]}
        onSelect={() => {
          router.push("/admin/consent");
          onClose();
        }}
      >
        Consent
      </CommandMenu.Item>
      <CommandMenu.Item
        icon={<PanelsTopLeft className="w-4 h-4" />}
        subtitle="Admin"
        keywords={[TOP_LEVEL]}
        onSelect={() => {
          router.push("/admin/design-system");
          onClose();
        }}
      >
        Design system
      </CommandMenu.Item>

      {dsNavigation.flatMap((section) =>
        section.items
          .filter((item) => !item.locked)
          .map((item) => (
            <CommandMenu.Item
              key={`${section.id}-${item.id}`}
              icon={
                section.id === "brands" ? (
                  <BrandItemIcon />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )
              }
              subtitle={`Design System · ${section.label}`}
              keywords={[section.label]}
              onSelect={() => {
                router.push(`/admin/design-system/${item.id}`);
                onClose();
              }}
            >
              {item.label}
            </CommandMenu.Item>
          )),
      )}

      <CommandMenu.Group heading="Actions">
        <CommandMenu.Item
          icon={<LogOut className="w-4 h-4" />}
          keywords={[TOP_LEVEL]}
          onSelect={() => {
            void logout();
            onClose();
          }}
        >
          Sign out
        </CommandMenu.Item>
      </CommandMenu.Group>
    </CommandMenu>
  );
}
