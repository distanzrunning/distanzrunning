"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, FileText, Layers } from "lucide-react";
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
// Sidebar headers — brand logo (root) and back-button (subsection)
// ============================================================================

function StrideIcon() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/stride_icon_black.svg"
        alt=""
        className="dark:hidden"
        style={{ width: 20, height: 20 }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/stride_icon_white.svg"
        alt=""
        className="hidden dark:block"
        style={{ width: 20, height: 20 }}
      />
    </>
  );
}

function BrandHeader() {
  return (
    <div style={{ padding: "12px 8px 4px" }}>
      <Link
        href="/admin"
        aria-label="Stride Admin"
        className="flex items-center justify-center w-full h-9 gap-2 outline-none no-underline text-[var(--ds-gray-1000)]"
      >
        <StrideIcon />
        <span
          style={{
            fontSize: 14,
            lineHeight: "20px",
            fontWeight: 500,
            letterSpacing: "-0.28px",
          }}
        >
          Stride Admin
        </span>
      </Link>
    </div>
  );
}

function BackHeader({
  leftSlot,
  label,
  href,
  ariaLabel,
}: {
  leftSlot: ReactNode;
  label: string;
  href: string;
  ariaLabel?: string;
}) {
  return (
    <div style={{ padding: "12px 8px 4px" }}>
      <Link
        href={href}
        aria-label={ariaLabel ?? label}
        className="flex items-center justify-between w-full h-9 rounded-md outline-none transition-colors gap-1 text-[var(--ds-gray-900)] hover:text-[var(--ds-gray-1000)] hover:bg-[var(--ds-gray-100)] active:bg-[var(--ds-gray-200)] focus-visible:text-[var(--ds-gray-1000)] focus-visible:bg-[var(--ds-gray-100)]"
      >
        <span
          className="grid place-content-center"
          style={{ width: 36, height: 36, flexShrink: 0 }}
        >
          {leftSlot}
        </span>
        <span
          className="flex-1 font-medium text-center"
          style={{ fontSize: 14, lineHeight: "20px" }}
        >
          {label}
        </span>
        <span style={{ width: 36, height: 36, flexShrink: 0 }} />
      </Link>
    </div>
  );
}

// ============================================================================
// Admin (top-level) nav
// ============================================================================

const ADMIN_NAV: {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  hasSubmenu?: boolean;
}[] = [
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
    hasSubmenu: true,
  },
];

function AdminNav({ pathname }: { pathname: string }) {
  return (
    <nav style={{ padding: 16, paddingTop: 8 }}>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {ADMIN_NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const baseClasses =
            "group flex items-center rounded-md outline-none transition-colors";
          const stateClasses = active
            ? "bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] font-medium hover:bg-[var(--ds-gray-200)]"
            : "text-[var(--ds-gray-900)] hover:bg-[var(--ds-gray-100)] hover:text-[var(--ds-gray-1000)] focus-visible:bg-[var(--ds-gray-100)] focus-visible:text-[var(--ds-gray-1000)]";
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`${baseClasses} ${stateClasses}`}
                style={{
                  height: 36,
                  paddingLeft: 12,
                  paddingRight: item.hasSubmenu ? 8 : 12,
                  fontSize: 14,
                }}
              >
                <span className="flex-1 flex items-center gap-2.5 min-w-0">
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </span>
                {item.hasSubmenu && (
                  <span
                    className="flex-none grid place-content-center rounded-sm transition-colors group-hover:bg-[var(--ds-gray-alpha-100)] group-active:bg-[var(--ds-gray-alpha-300)]"
                    style={{ width: 24, height: 24 }}
                    aria-hidden="true"
                  >
                    <ChevronRight style={{ width: 12, height: 12 }} />
                  </span>
                )}
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
    <div style={{ padding: "8px 24px 16px" }}>
      <div className="space-y-4">
        {dsNavigation.map((section) => (
          <div key={section.id}>
            <p className="text-[14px] leading-[20px] font-medium mb-0.5 flex h-10 items-center gap-2 py-1.5 pl-1 text-[var(--ds-gray-1000)]">
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
                        className="group relative -ml-2 flex h-9 w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-[14px] leading-[20px] outline-none transition-colors text-[var(--ds-gray-700)] cursor-not-allowed"
                      >
                        <span className="flex flex-row items-center gap-2">
                          {item.label}
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={`/admin/design-system/${item.id}`}
                        className={`
                            group relative -ml-2 flex h-9 w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-[14px] leading-[20px] outline-none transition-colors
                            ${
                              isActive
                                ? "bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] font-medium"
                                : "text-[var(--ds-gray-900)] hover:bg-[var(--ds-gray-100)] hover:text-[var(--ds-gray-1000)] focus-visible:bg-[var(--ds-gray-100)] focus-visible:text-[var(--ds-gray-1000)]"
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
  );
}

// ============================================================================
// Public component — owns the full-height layout
// ============================================================================

export default function AdminSidebar({
  searchTrigger,
}: {
  searchTrigger?: ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const inDs = isDesignSystemRoute(pathname);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <BrandHeader />
      {searchTrigger && (
        <div style={{ padding: "0 16px 8px" }}>{searchTrigger}</div>
      )}
      {inDs && (
        <BackHeader
          leftSlot={<ChevronLeft className="w-4 h-4" />}
          label="Design System"
          href="/admin"
          ariaLabel="Back to admin"
        />
      )}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {inDs ? (
          <DesignSystemNav pathname={pathname} />
        ) : (
          <AdminNav pathname={pathname} />
        )}
      </div>
    </div>
  );
}
