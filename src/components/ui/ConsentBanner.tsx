"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Copy } from "lucide-react";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import Toggle from "@/components/ui/Toggle";
import {
  useConsent,
  type ConsentCategory,
  type ConsentPreferences,
} from "@/contexts/ConsentContext";

// ============================================================================
// Category definitions — single source of truth for UI copy
// ============================================================================

interface CategoryDef {
  key: ConsentCategory;
  label: string;
  description: string;
  required?: boolean;
}

export const CONSENT_CATEGORIES: CategoryDef[] = [
  {
    key: "essential",
    label: "Essential",
    description:
      "Essential cookies and services are used to enable core website features, such as ensuring the security of the website.",
    required: true,
  },
  {
    key: "marketing",
    label: "Marketing",
    description:
      "Marketing cookies and services are used to deliver personalised advertisements, promotions, and offers. These technologies enable targeted advertising and marketing campaigns by collecting information about users' interests, preferences, and online activities.",
  },
  {
    key: "analytics",
    label: "Analytics",
    description:
      "Analytics cookies and services are used for collecting statistical information about how visitors interact with a website. These technologies provide insights into website usage, visitor behaviour, and site performance to understand and improve the site and enhance user experience.",
  },
  {
    key: "functional",
    label: "Functional",
    description:
      "Functional cookies and services are used to offer enhanced and personalised functionalities. These technologies provide additional features and improved user experiences, such as remembering your language preferences, font sizes, region selections, and customised layouts. Opting out of these cookies may render certain services or functionality of the website unavailable.",
  },
];

export const CONSENT_COPY = {
  bannerTitle: "We use cookies",
  bannerDescription:
    "We use cookies to improve your experience, show you personalised content, and analyse our traffic. For more information, see our",
  modalTitle: "Privacy Settings",
  modalDescription:
    "We use cookies to personalise content and ads, to provide essential features and to analyse our traffic. You may opt in or opt out of the use of these technologies.",
  cookiePolicyHref: "/legal/cookie-policy",
  privacyHref: "/legal/privacy-policy",
  dataRequestEmail: "info@distanzrunning.com",
} as const;

const BANNER_TITLE = CONSENT_COPY.bannerTitle;
const BANNER_DESCRIPTION = CONSENT_COPY.bannerDescription;
const MODAL_TITLE = CONSENT_COPY.modalTitle;
const MODAL_DESCRIPTION = CONSENT_COPY.modalDescription;
const COOKIE_POLICY_HREF = CONSENT_COPY.cookiePolicyHref;
const PRIVACY_HREF = CONSENT_COPY.privacyHref;
const DATA_REQUEST_EMAIL = CONSENT_COPY.dataRequestEmail;

// ============================================================================
// Category row — name + description with a toggle on the right
// ============================================================================

export function ConsentCategoryRow({
  category,
  value,
  onChange,
  isLast,
}: {
  category: CategoryDef;
  value: boolean;
  onChange: (next: boolean) => void;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);
  const contentId = `consent-cat-${category.key}`;

  return (
    <div>
      <div
        className="flex items-center justify-between"
        style={{
          // Divider sits below the trigger row whenever another element
          // follows it — either the next row's title, or this row's own
          // description when it's open.
          borderBottom:
            !isLast || open ? "1px solid var(--ds-gray-400)" : "none",
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={contentId}
          className="flex flex-1 items-center justify-between gap-3 outline-none"
          style={{
            padding: "12px 16px",
            textAlign: "left",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span className="flex items-center gap-2">
            <ChevronDown
              className={`w-3.5 h-3.5 text-textSubtle transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
            />
            <span className="text-[14px] font-medium text-textDefault">
              {category.label}
            </span>
          </span>
        </button>
        <div className="pr-4">
          <Toggle
            size="large"
            checked={value}
            disabled={category.required}
            onChange={onChange}
            label={value ? "On" : "Off"}
            labelPosition="left"
          />
        </div>
      </div>
      <div
        id={contentId}
        hidden={!open}
        className="text-[13px] leading-[1.55] text-textSubtle"
        style={{
          padding: "12px 16px 16px",
          borderBottom: isLast ? "none" : "1px solid var(--ds-gray-400)",
        }}
      >
        {category.description}
      </div>
    </div>
  );
}

// ============================================================================
// Anonymous ID section — lets users copy their ID for data requests
// ============================================================================

export function ConsentAnonIdSection({ anonId }: { anonId: string | null }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!anonId) return;
    try {
      await navigator.clipboard.writeText(anonId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be blocked (e.g. insecure context); ignore.
    }
  };

  const mailtoHref = anonId
    ? `mailto:${DATA_REQUEST_EMAIL}?subject=${encodeURIComponent(
        "Consent data request",
      )}&body=${encodeURIComponent(
        `Hi,\n\nPlease action a data request for my consent ID:\n\n${anonId}\n\n`,
      )}`
    : `mailto:${DATA_REQUEST_EMAIL}`;

  return (
    <div
      className="overflow-hidden"
      style={{
        marginTop: 16,
        border: "1px solid var(--ds-gray-400)",
        borderRadius: 6,
        background: "var(--ds-background-100)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="consent-anon-id-body"
        className="flex w-full items-center justify-between outline-none"
        style={{
          padding: "12px 16px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span className="text-[14px] font-medium text-textDefault">
          ID to request consent data
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-textSubtle transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
        />
      </button>
      <div
        id="consent-anon-id-body"
        hidden={!open}
        style={{
          padding: "0 16px 16px",
          borderTop: "1px solid var(--ds-gray-400)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            borderRadius: 6,
            background: "var(--ds-background-200)",
            border: "1px solid var(--ds-gray-400)",
          }}
        >
          <span
            className="text-[13px] text-textDefault"
            style={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-mono)",
            }}
          >
            {anonId ?? "—"}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!anonId}
            aria-label={copied ? "Copied" : "Copy ID"}
            className="flex items-center justify-center outline-none"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "1px solid var(--ds-gray-400)",
              background: "var(--ds-background-100)",
              color: "var(--ds-gray-900)",
              cursor: anonId ? "pointer" : "not-allowed",
              opacity: anonId ? 1 : 0.5,
              flexShrink: 0,
            }}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p
          className="text-[12px] leading-[1.55]"
          style={{ color: "var(--ds-gray-700)", margin: 0 }}
        >
          Email{" "}
          <a
            href={mailtoHref}
            className="text-textDefault underline hover:opacity-80"
          >
            {DATA_REQUEST_EMAIL}
          </a>{" "}
          with this ID to request access to or deletion of your consent data.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Consent Settings Modal
// ============================================================================

function ConsentSettingsModal() {
  const {
    preferences,
    anonId,
    settingsOpen,
    closeSettings,
    save,
    acceptAll,
    rejectAll,
  } = useConsent();

  // Local draft of the toggles while the modal is open.
  const [draft, setDraft] = useState<ConsentPreferences>({
    essential: true,
    marketing: preferences?.marketing ?? false,
    analytics: preferences?.analytics ?? false,
    functional: preferences?.functional ?? false,
  });

  // Re-sync the draft every time the modal opens so it reflects the latest
  // saved preferences.
  useEffect(() => {
    if (settingsOpen) {
      setDraft({
        essential: true,
        marketing: preferences?.marketing ?? false,
        analytics: preferences?.analytics ?? false,
        functional: preferences?.functional ?? false,
      });
    }
  }, [settingsOpen, preferences]);

  const handleSave = () => {
    save({
      marketing: draft.marketing,
      analytics: draft.analytics,
      functional: draft.functional,
    });
  };

  return (
    <Modal
      open={settingsOpen}
      onClose={closeSettings}
      title={MODAL_TITLE}
      subtitle={MODAL_DESCRIPTION}
      footer={
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={rejectAll}>
              Deny
            </Button>
            <Button variant="secondary" onClick={acceptAll}>
              Accept all
            </Button>
            <Button onClick={handleSave} className="ml-auto">
              Save
            </Button>
          </div>
          <p
            className="text-[12px] leading-[1.6]"
            style={{ color: "var(--ds-gray-700)", margin: 0 }}
          >
            For more information, see our{" "}
            <a
              href={COOKIE_POLICY_HREF}
              className="text-textDefault underline hover:opacity-80"
            >
              Cookie Policy
            </a>{" "}
            and{" "}
            <a
              href={PRIVACY_HREF}
              className="text-textDefault underline hover:opacity-80"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      }
    >
      <div
        className="overflow-hidden"
        style={{
          border: "1px solid var(--ds-gray-400)",
          borderRadius: 6,
          background: "var(--ds-background-100)",
        }}
      >
        {CONSENT_CATEGORIES.map((cat, i) => (
          <ConsentCategoryRow
            key={cat.key}
            category={cat}
            value={draft[cat.key]}
            onChange={(next) => {
              if (cat.required) return;
              setDraft((d) => ({ ...d, [cat.key]: next }));
            }}
            isLast={i === CONSENT_CATEGORIES.length - 1}
          />
        ))}
      </div>
      <ConsentAnonIdSection anonId={anonId} />
    </Modal>
  );
}

// ============================================================================
// Bottom banner
// ============================================================================

function BottomBanner() {
  const { isDecided, settingsOpen, acceptAll, rejectAll, openSettings } =
    useConsent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isDecided || settingsOpen || !mounted) return null;

  return createPortal(
    <>
      <style>{`
        @keyframes distanz-consent-in {
          from {
            opacity: 0;
            transform: translateY(calc(100% + 24px));
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div
        role="alertdialog"
        aria-labelledby="consent-banner-title"
        aria-modal="false"
        className="fixed bottom-4 left-4 right-4 z-[10000] sm:right-auto sm:max-w-[400px]"
        style={{
          animation:
            "distanz-consent-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
          willChange: "transform, opacity",
        }}
      >
        <div
          className="flex flex-col gap-4 rounded-xl p-5"
          style={{
            background: "var(--ds-background-100)",
            border: "1px solid var(--ds-gray-400)",
            boxShadow: "var(--ds-shadow-menu)",
          }}
        >
          <div>
            <h2
              id="consent-banner-title"
              className="text-[16px] font-semibold text-textDefault leading-tight"
            >
              {BANNER_TITLE}
            </h2>
            <p className="mt-2 text-[13px] leading-[1.55] text-textSubtle">
              {BANNER_DESCRIPTION}{" "}
              <a
                href={COOKIE_POLICY_HREF}
                className="text-textDefault underline hover:opacity-80"
              >
                Cookie Policy
              </a>{" "}
              and{" "}
              <a
                href={PRIVACY_HREF}
                className="text-textDefault underline hover:opacity-80"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              shape="rounded"
              size="small"
              onClick={rejectAll}
            >
              Deny
            </Button>
            <Button
              variant="secondary"
              shape="rounded"
              size="small"
              onClick={acceptAll}
            >
              Accept all
            </Button>
            <Button
              shape="rounded"
              size="small"
              onClick={openSettings}
              className="ml-auto"
            >
              Customise
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

// ============================================================================
// Single export — mount this once in the app root
// ============================================================================

export function ConsentBanner() {
  return (
    <>
      <BottomBanner />
      <ConsentSettingsModal />
    </>
  );
}

export default ConsentBanner;
