"use client";

import { useContext, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, MoreHorizontal, SmilePlus } from "lucide-react";
import { DarkModeContext } from "@/components/DarkModeProvider";
import { FeedbackWithSelect } from "@/components/ui/Feedback";
import { Menu, MenuButton, MenuItem, MenuSeparator } from "@/components/ui/Menu";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { logout } from "../login/actions";
import { CONSENT_NAV, FEEDBACK_NAV } from "./AdminSidebar";
import { navigation as dsNavigation } from "./design-system/components/DesignSystemSidebar";

// Mirrors the admin section list — used as topic options in the feedback
// modal. Keep label === value so the topic stored in Supabase reads as
// the section name.
const ADMIN_FEEDBACK_TOPICS = [
  { label: "Overview", value: "Overview" },
  { label: "Consent", value: "Consent" },
  { label: "Feedback", value: "Feedback" },
  { label: "Design System", value: "Design System" },
  { label: "Other", value: "Other" },
];

function defaultAdminTopic(pathname: string): string {
  if (pathname.startsWith("/admin/consent")) return "Consent";
  if (pathname.startsWith("/admin/feedback")) return "Feedback";
  if (pathname.startsWith("/admin/design-system")) return "Design System";
  if (pathname === "/admin" || pathname === "/admin/") return "Overview";
  return "Other";
}

const HEADER_HEIGHT = 56;

type TitleParts = {
  section: { label: string; href: string } | null;
  page: string;
};

function getTitleParts(pathname: string): TitleParts {
  if (pathname === "/admin" || pathname === "/admin/") {
    return { section: null, page: "Overview" };
  }
  if (pathname === "/admin/consent" || pathname === "/admin/consent/") {
    return { section: null, page: "Consent" };
  }
  const consentMatch = pathname.match(/^\/admin\/consent\/([^/?#]+)/);
  if (consentMatch) {
    const slug = consentMatch[1];
    const item = CONSENT_NAV.find((i) => i.id === slug);
    if (item) {
      return {
        section: { label: "Consent", href: "/admin/consent" },
        page: item.label,
      };
    }
  }
  if (pathname === "/admin/feedback" || pathname === "/admin/feedback/") {
    return { section: null, page: "Feedback" };
  }
  const feedbackMatch = pathname.match(/^\/admin\/feedback\/([^/?#]+)/);
  if (feedbackMatch) {
    const slug = feedbackMatch[1];
    const item = FEEDBACK_NAV.find((i) => i.id === slug);
    if (item) {
      return {
        section: { label: "Feedback", href: "/admin/feedback" },
        page: item.label,
      };
    }
  }
  if (
    pathname === "/admin/design-system" ||
    pathname === "/admin/design-system/"
  ) {
    return { section: null, page: "Design System" };
  }
  const dsMatch = pathname.match(/^\/admin\/design-system\/([^/?#]+)/);
  if (dsMatch) {
    const slug = dsMatch[1];
    for (const section of dsNavigation) {
      const item = section.items.find((i) => i.id === slug);
      if (item) {
        return {
          section: { label: "Design System", href: "/admin/design-system" },
          page: item.label,
        };
      }
    }
  }
  return { section: null, page: "Admin" };
}

function SlashIcon() {
  return (
    <svg
      height="16"
      width="16"
      viewBox="0 0 16 16"
      fill="none"
      strokeLinejoin="round"
      style={{
        color: "var(--ds-gray-alpha-400)",
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.01526 15.3939L4.3107 14.7046L10.3107 0.704556L10.6061 0.0151978L11.9849 0.606077L11.6894 1.29544L5.68942 15.2954L5.39398 15.9848L4.01526 15.3939Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function AdminPageHeader() {
  const pathname = usePathname() ?? "";
  const { section, page } = getTitleParts(pathname);
  const { theme, setTheme } = useContext(DarkModeContext);
  const [, startTransition] = useTransition();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        height: HEADER_HEIGHT,
        background: "var(--ds-background-200)",
        borderBottom: "1px solid var(--ds-gray-400)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 16px",
      }}
    >
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center max-w-[50%]">
        {section && (
          <div className="hidden md:flex items-center gap-2 pr-2.5 min-w-0">
            <Link
              href={section.href}
              className="no-underline truncate min-w-0 hover:underline"
              style={{
                fontSize: 14,
                lineHeight: "20px",
                letterSpacing: "-0.28px",
                fontWeight: 500,
                color: "var(--ds-gray-800)",
              }}
            >
              {section.label}
            </Link>
            <SlashIcon />
          </div>
        )}
        <span
          className="flex items-center gap-0.5 truncate font-medium"
          style={{
            fontSize: 14,
            lineHeight: "20px",
            letterSpacing: "-0.28px",
            color: "var(--ds-gray-1000)",
          }}
        >
          <span className="min-w-0 truncate">{page}</span>
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

        <MenuItem
          onClick={() => setFeedbackOpen(true)}
          suffix={<SmilePlus className="w-4 h-4" />}
        >
          Give Feedback
        </MenuItem>

        <MenuItem
          onClick={() => startTransition(() => logout())}
          suffix={<LogOut className="w-4 h-4" />}
        >
          Sign out
        </MenuItem>
      </Menu>

      <FeedbackWithSelect
        centered
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        options={ADMIN_FEEDBACK_TOPICS}
        defaultTopic={defaultAdminTopic(pathname)}
        collectEmail
      />
    </header>
  );
}
