"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, FileText, Layers } from "lucide-react";
import { navigation as dsNavigation } from "./design-system/components/DesignSystemSidebar";

// ============================================================================
// Routing helpers
// ============================================================================

export function isDesignSystemRoute(pathname: string): boolean {
  return pathname.startsWith("/admin/design-system");
}

function dsSlugFrom(pathname: string): string | null {
  const match = pathname.match(/^\/admin\/design-system\/([^/?#]+)/);
  return match ? match[1] : null;
}

// ============================================================================
// Admin (top-level) nav
// ============================================================================

const ADMIN_NAV: { id: string; label: string; href: string; icon: React.ReactNode }[] = [
  {
    id: "consent",
    label: "Consent",
    href: "/admin/consent",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "design-system",
    label: "Design System",
    href: "/admin/design-system",
    icon: <Layers className="w-4 h-4" />,
  },
];

function AdminNav({ pathname }: { pathname: string }) {
  return (
    <nav style={{ padding: 16 }}>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        {ADMIN_NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex items-center gap-2.5 rounded-md outline-none transition-colors"
                style={{
                  height: 40,
                  padding: "0 12px",
                  fontSize: 14,
                  color: active ? "var(--ds-gray-1000)" : "var(--ds-gray-700)",
                  background: active ? "var(--ds-gray-200)" : "transparent",
                  fontWeight: active ? 500 : 400,
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ============================================================================
// Design-system nav (replaces admin nav while inside /admin/design-system)
// ============================================================================

function DesignSystemNav({ pathname }: { pathname: string }) {
  const activeSlug = dsSlugFrom(pathname);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--ds-gray-400)",
        }}
      >
        <Link
          href="/admin"
          className="flex items-center gap-2 outline-none"
          style={{
            fontSize: 13,
            color: "var(--ds-gray-700)",
            fontWeight: 500,
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>
      </div>

      <div style={{ padding: "16px 24px", overflowY: "auto", flex: 1 }}>
        <div className="space-y-4">
          {dsNavigation.map((section) => (
            <div key={section.id}>
              <p
                className="text-[14px] leading-[20px] font-medium mb-0.5 flex h-10 items-center gap-2 py-1.5 pl-1 text-black dark:text-white"
              >
                {section.label}
              </p>
              <ul
                className="relative space-y-0.5"
                style={{ width: "calc(100% + 8px)" }}
              >
                {section.items.map((item) => {
                  const isActive = activeSlug === item.id;
                  return (
                    <li
                      key={item.id}
                      className={section.id === "components" ? "py-[2px]" : ""}
                    >
                      {item.locked ? (
                        <button
                          type="button"
                          disabled
                          className="group relative -ml-2 flex h-[40px] w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-[14px] leading-[20px] outline-none transition-colors text-textSubtle cursor-not-allowed"
                        >
                          <span className="flex flex-row items-center gap-2">
                            {item.label}
                          </span>
                        </button>
                      ) : (
                        <Link
                          href={`/admin/design-system/${item.id}`}
                          className={`
                            group relative -ml-2 flex h-[40px] w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-[14px] leading-[20px] outline-none transition-colors
                            ${
                              isActive
                                ? "bg-black/[0.05] dark:bg-white/[0.1] text-black dark:text-white"
                                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            }
                          `}
                        >
                          <span className="flex flex-row items-center gap-2">
                            {item.label}
                          </span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Public component
// ============================================================================

export default function AdminSidebar() {
  const pathname = usePathname() ?? "";
  if (isDesignSystemRoute(pathname)) {
    return <DesignSystemNav pathname={pathname} />;
  }
  return <AdminNav pathname={pathname} />;
}
