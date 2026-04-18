"use client";

import React, { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
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

const CATEGORIES: CategoryDef[] = [
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

const TITLE = "Your Privacy";
const DESCRIPTION =
  "This site uses tracking technologies. You may opt in or opt out of the use of these technologies.";
const PRIVACY_HREF = "/legal/privacy-policy";

// ============================================================================
// Category row — toggle + collapsible description
// ============================================================================

function CategoryRow({
  category,
  value,
  onChange,
}: {
  category: CategoryDef;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const contentId = `consent-cat-${category.key}`;

  return (
    <div className="py-3">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={contentId}
          className="flex flex-1 items-center gap-2 text-left outline-none"
        >
          <ChevronDown
            className={`w-4 h-4 text-textSubtle transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
          />
          <span className="text-[14px] font-medium text-textDefault">
            {category.label}
          </span>
          {category.required && (
            <span
              className="text-[11px] uppercase tracking-wider"
              style={{ color: "var(--ds-gray-700)" }}
            >
              Always on
            </span>
          )}
        </button>
        <Toggle
          checked={value}
          disabled={category.required}
          onChange={onChange}
          label={category.required ? "Always on" : value ? "On" : "Off"}
          labelPosition="left"
        />
      </div>
      <div
        id={contentId}
        hidden={!open}
        className="mt-2 pl-6 text-[13px] leading-[1.55] text-textSubtle"
      >
        {category.description}
      </div>
    </div>
  );
}

// ============================================================================
// Consent Settings Modal
// ============================================================================

function ConsentSettingsModal() {
  const { preferences, settingsOpen, closeSettings, save, acceptAll, rejectAll } =
    useConsent();

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
      title={TITLE}
      subtitle={DESCRIPTION}
      footer={
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="secondary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="secondary" onClick={rejectAll}>
              Deny
            </Button>
            <Button onClick={acceptAll}>Accept all</Button>
          </div>
          <div className="text-right text-[12px]">
            <a
              href={PRIVACY_HREF}
              className="text-textSubtle hover:text-textDefault no-underline hover:underline"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      }
    >
      <div className="divide-y divide-borderSubtle">
        {CATEGORIES.map((cat) => (
          <CategoryRow
            key={cat.key}
            category={cat}
            value={draft[cat.key]}
            onChange={(next) => {
              if (cat.required) return;
              setDraft((d) => ({ ...d, [cat.key]: next }));
            }}
          />
        ))}
      </div>
    </Modal>
  );
}

// ============================================================================
// Bottom banner
// ============================================================================

function BottomBanner() {
  const { isDecided, acceptAll, rejectAll, openSettings } = useConsent();

  if (isDecided) return null;

  return (
    <div
      role="alertdialog"
      aria-labelledby="consent-banner-title"
      aria-modal="false"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div
        className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl p-5 sm:p-6"
        style={{
          background: "var(--ds-background-100)",
          border: "1px solid var(--ds-gray-400)",
          boxShadow: "var(--ds-shadow-menu)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2
              id="consent-banner-title"
              className="text-[16px] font-semibold text-textDefault leading-tight"
            >
              {TITLE}
            </h2>
            <p className="mt-2 text-[13px] leading-[1.55] text-textSubtle">
              {DESCRIPTION}
            </p>
          </div>
          <button
            type="button"
            onClick={rejectAll}
            aria-label="Close banner and deny consent"
            className="p-1 rounded hover:bg-surfaceSubtle transition-colors"
          >
            <X className="w-4 h-4 text-textSubtle" />
          </button>
        </div>

        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-4 sm:justify-start">
            <button
              type="button"
              onClick={openSettings}
              className="text-[13px] font-medium text-textDefault no-underline hover:underline"
            >
              Consent Settings
            </button>
            <a
              href={PRIVACY_HREF}
              className="text-[13px] text-textSubtle hover:text-textDefault no-underline hover:underline"
            >
              Privacy Policy
            </a>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={rejectAll}
              className="flex-1 sm:flex-none"
            >
              Deny
            </Button>
            <Button onClick={acceptAll} className="flex-1 sm:flex-none">
              Accept all
            </Button>
          </div>
        </div>
      </div>
    </div>
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
