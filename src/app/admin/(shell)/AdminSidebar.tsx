"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  Home,
  Map,
  MessageSquare,
  PanelsTopLeft,
  SquareCheckBig,
} from "lucide-react";
import { navigation as dsNavigation } from "./design-system/components/DesignSystemSidebar";

// ============================================================================
// Routing helpers
// ============================================================================

export function isDesignSystemRoute(pathname: string): boolean {
  return pathname.startsWith("/admin/design-system");
}

export function isConsentRoute(pathname: string): boolean {
  return pathname === "/admin/consent" || pathname.startsWith("/admin/consent/");
}

export function isFeedbackRoute(pathname: string): boolean {
  return (
    pathname === "/admin/feedback" || pathname.startsWith("/admin/feedback/")
  );
}

export function isRacesRoute(pathname: string): boolean {
  return pathname === "/admin/races" || pathname.startsWith("/admin/races/");
}

function dsSlugFrom(pathname: string): string | null {
  const match = pathname.match(/^\/admin\/design-system\/([^/?#]+)/);
  return match ? match[1] : null;
}

// ============================================================================
// Sidebar view state — decoupled from the URL.
//
// The sidebar can show one of five "levels" (admin top-level, or a
// specific section's submenu). The level is derived from the URL on
// mount and on URL changes, but the user can also navigate the sidebar
// up/down without changing the URL — e.g. clicking the back button
// shows the admin top-level nav while the page content stays put.
// ============================================================================

type SidebarLevel =
  | "admin"
  | "design-system"
  | "consent"
  | "feedback"
  | "races";

function levelFromPathname(pathname: string): SidebarLevel {
  if (isDesignSystemRoute(pathname)) return "design-system";
  if (isConsentRoute(pathname)) return "consent";
  if (isFeedbackRoute(pathname)) return "feedback";
  if (isRacesRoute(pathname)) return "races";
  return "admin";
}

export const CONSENT_NAV: { id: string; label: string; href: string }[] = [
  { id: "dashboard", label: "Dashboard", href: "/admin/consent" },
  {
    id: "how-it-works",
    label: "How it works",
    href: "/admin/consent/how-it-works",
  },
];

export const FEEDBACK_NAV: { id: string; label: string; href: string }[] = [
  { id: "dashboard", label: "Dashboard", href: "/admin/feedback" },
  {
    id: "how-it-works",
    label: "How it works",
    href: "/admin/feedback/how-it-works",
  },
];

export const RACES_NAV: { id: string; label: string; href: string }[] = [
  { id: "date-review", label: "Date review", href: "/admin/races/date-review" },
];

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
  onClick,
  ariaLabel,
}: {
  leftSlot: ReactNode;
  label: string;
  onClick: () => void;
  ariaLabel?: string;
}) {
  return (
    <div style={{ padding: "12px 8px 4px" }}>
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel ?? label}
        className="flex items-center justify-between w-full h-9 rounded-md outline-none transition-colors gap-1 text-[var(--ds-gray-900)] hover:text-[var(--ds-gray-1000)] hover:bg-[var(--ds-gray-100)] active:bg-[var(--ds-gray-200)] focus-visible:text-[var(--ds-gray-1000)] focus-visible:bg-[var(--ds-gray-100)] bg-transparent border-0 cursor-pointer"
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
      </button>
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
  /** Match the route exactly — used by Overview so it doesn't stay
      active on every nested admin page. */
  exact?: boolean;
}[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/admin",
    icon: <Home className="w-4 h-4" />,
    exact: true,
  },
  {
    id: "consent",
    label: "Consent",
    href: "/admin/consent",
    icon: <SquareCheckBig className="w-4 h-4" />,
    hasSubmenu: true,
  },
  {
    id: "feedback",
    label: "Feedback",
    href: "/admin/feedback",
    icon: <MessageSquare className="w-4 h-4" />,
    hasSubmenu: true,
  },
  {
    id: "races",
    label: "Races",
    href: "/admin/races",
    icon: <Map className="w-4 h-4" />,
    hasSubmenu: true,
  },
  {
    id: "design-system",
    label: "Design System",
    href: "/admin/design-system",
    icon: <PanelsTopLeft className="w-4 h-4" />,
    hasSubmenu: true,
  },
  {
    id: "studio",
    label: "Sanity Studio",
    href: "/admin/studio",
    icon: <Database className="w-4 h-4" />,
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
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
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

function DistanzBrandIcon() {
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

function DesignSystemNav({ pathname }: { pathname: string }) {
  const activeSlug = dsSlugFrom(pathname);

  return (
    <nav style={{ padding: 16, paddingTop: 8 }}>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {dsNavigation.map((section) => (
          <li key={section.id}>
            <p
              className="flex items-center font-medium text-[var(--ds-gray-1000)]"
              style={{
                margin: 0,
                height: 36,
                paddingLeft: 12,
                fontSize: 14,
                lineHeight: "20px",
              }}
            >
              {section.label}
            </p>
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
              {section.items.map((item) => {
                const isActive = activeSlug === item.id;
                const showBrandIcon = section.id === "brands";
                const baseClasses =
                  "group flex items-center rounded-md outline-none transition-colors";
                const stateClasses = isActive
                  ? "bg-[var(--ds-gray-200)] text-[var(--ds-gray-1000)] font-medium hover:bg-[var(--ds-gray-200)]"
                  : "text-[var(--ds-gray-900)] hover:bg-[var(--ds-gray-100)] hover:text-[var(--ds-gray-1000)] focus-visible:bg-[var(--ds-gray-100)] focus-visible:text-[var(--ds-gray-1000)]";
                const rowStyle = {
                  height: 36,
                  paddingLeft: 12,
                  paddingRight: 12,
                  fontSize: 14,
                } as const;
                const labelContent = (
                  <span className="flex-1 flex items-center gap-2.5 min-w-0">
                    {showBrandIcon && <DistanzBrandIcon />}
                    <span className="truncate">{item.label}</span>
                  </span>
                );
                return (
                  <li key={item.id}>
                    {item.locked ? (
                      <button
                        type="button"
                        disabled
                        className={`${baseClasses} w-full text-[var(--ds-gray-700)] cursor-not-allowed`}
                        style={rowStyle}
                      >
                        {labelContent}
                      </button>
                    ) : (
                      <Link
                        href={`/admin/design-system/${item.id}`}
                        aria-current={isActive ? "page" : undefined}
                        className={`${baseClasses} ${stateClasses}`}
                        style={rowStyle}
                      >
                        {labelContent}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ============================================================================
// Consent nav (replaces admin nav while inside /admin/consent)
// ============================================================================

function ConsentNav({ pathname }: { pathname: string }) {
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
        {CONSENT_NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin/consent" &&
              pathname.startsWith(`${item.href}/`));
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
                  paddingRight: 12,
                  fontSize: 14,
                }}
              >
                <span className="flex-1 flex items-center min-w-0">
                  <span className="truncate">{item.label}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ============================================================================
// Feedback nav (replaces admin nav while inside /admin/feedback)
// ============================================================================

function FeedbackNav({ pathname }: { pathname: string }) {
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
        {FEEDBACK_NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin/feedback" &&
              pathname.startsWith(`${item.href}/`));
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
                  paddingRight: 12,
                  fontSize: 14,
                }}
              >
                <span className="flex-1 flex items-center min-w-0">
                  <span className="truncate">{item.label}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ============================================================================
// Races nav (replaces admin nav while inside /admin/races)
// ============================================================================

function RacesNav({ pathname }: { pathname: string }) {
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
        {RACES_NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin/races" &&
              pathname.startsWith(`${item.href}/`));
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
                  paddingRight: 12,
                  fontSize: 14,
                }}
              >
                <span className="flex-1 flex items-center min-w-0">
                  <span className="truncate">{item.label}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
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
  const [level, setLevel] = useState<SidebarLevel>(() =>
    levelFromPathname(pathname),
  );

  // Re-sync sidebar level when the URL changes externally (leaf-click
  // navigation, browser back/forward, address-bar edit). The setter
  // remains free to override this for back-button / submenu-expand
  // interactions that intentionally leave the URL alone.
  useEffect(() => {
    setLevel(levelFromPathname(pathname));
  }, [pathname]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <BrandHeader />
      {searchTrigger && (
        <div style={{ position: "relative", padding: "0 16px 8px" }}>
          {searchTrigger}
          {/* Soft fade attached to the bottom of the search area —
              extends downward over the scroll so nav rows fade out
              as they approach the fixed search instead of hard
              cutting at the padding edge. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              height: 16,
              background:
                "linear-gradient(to bottom, var(--ds-background-200), transparent)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        </div>
      )}
      <div style={{ flex: 1, minHeight: 0 }}>
        <div style={{ height: "100%", overflowY: "auto" }}>
          {level === "design-system" && (
            <BackHeader
              leftSlot={<ChevronLeft className="w-4 h-4" />}
              label="Design System"
              onClick={() => setLevel("admin")}
              ariaLabel="Back to admin"
            />
          )}
          {level === "consent" && (
            <BackHeader
              leftSlot={<ChevronLeft className="w-4 h-4" />}
              label="Consent"
              onClick={() => setLevel("admin")}
              ariaLabel="Back to admin"
            />
          )}
          {level === "feedback" && (
            <BackHeader
              leftSlot={<ChevronLeft className="w-4 h-4" />}
              label="Feedback"
              onClick={() => setLevel("admin")}
              ariaLabel="Back to admin"
            />
          )}
          {level === "races" && (
            <BackHeader
              leftSlot={<ChevronLeft className="w-4 h-4" />}
              label="Races"
              onClick={() => setLevel("admin")}
              ariaLabel="Back to admin"
            />
          )}
          {level === "design-system" ? (
            <DesignSystemNav pathname={pathname} />
          ) : level === "consent" ? (
            <ConsentNav pathname={pathname} />
          ) : level === "feedback" ? (
            <FeedbackNav pathname={pathname} />
          ) : level === "races" ? (
            <RacesNav pathname={pathname} />
          ) : (
            <AdminNav pathname={pathname} />
          )}
        </div>
      </div>
    </div>
  );
}
