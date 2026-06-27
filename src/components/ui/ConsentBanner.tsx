"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Copy } from "lucide-react";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import Toggle from "@/components/ui/Toggle";
import {
  useConsentManager,
  useHeadlessConsentUI,
} from "@c15t/nextjs/headless";
import type { AllConsentNames } from "c15t";

// ============================================================================
// Category definitions — single source of truth for UI copy.
// Keys are c15t consent categories; labels stay user-facing.
// ============================================================================

interface CategoryDef {
  key: AllConsentNames;
  label: string;
  description: string;
  required?: boolean;
}

export const CONSENT_CATEGORIES: CategoryDef[] = [
  {
    key: "necessary",
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
    key: "measurement",
    label: "Analytics",
    description:
      "Analytics cookies and services are used for collecting statistical information about how visitors interact with a website. These technologies provide insights into website usage, visitor behaviour, and site performance to understand and improve the site and enhance user experience.",
  },
  {
    key: "functionality",
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
  cookiePolicyHref: "/privacy#cookies",
  privacyHref: "/privacy",
  dataRequestEmail: "info@distanzrunning.com",
} as const;

const {
  bannerTitle: BANNER_TITLE,
  bannerDescription: BANNER_DESCRIPTION,
  modalTitle: MODAL_TITLE,
  modalDescription: MODAL_DESCRIPTION,
  cookiePolicyHref: COOKIE_POLICY_HREF,
  privacyHref: PRIVACY_HREF,
  dataRequestEmail: DATA_REQUEST_EMAIL,
} = CONSENT_COPY;

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
  // Divider sits below the trigger whenever another element follows it — the
  // next row's title, or this row's own description when open.
  const triggerBorder = !isLast || open ? "border-b border-borderDefault" : "";

  return (
    <div>
      <div className={`flex items-center justify-between ${triggerBorder}`}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={contentId}
          className="flex flex-1 cursor-pointer items-center justify-between gap-3 border-none bg-transparent px-4 py-3 text-left outline-none"
        >
          <span className="flex items-center gap-2">
            <ChevronDown
              className={`h-3.5 w-3.5 text-textSubtle transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
            />
            <span className="text-copy-14 font-medium text-textDefault">
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
            labelPosition="left"
          >
            {value ? "On" : "Off"}
          </Toggle>
        </div>
      </div>
      <div
        id={contentId}
        hidden={!open}
        className={`px-4 pb-4 pt-3 text-copy-13 text-textSubtle ${isLast ? "" : "border-b border-borderDefault"}`}
      >
        {category.description}
      </div>
    </div>
  );
}

// ============================================================================
// Subject ID section — lets users copy their c15t subject ID for data requests
// ============================================================================

export function ConsentSubjectIdSection({
  subjectId,
}: {
  subjectId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!subjectId) return;
    try {
      await navigator.clipboard.writeText(subjectId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be blocked (e.g. insecure context); ignore.
    }
  };

  const mailtoHref = subjectId
    ? `mailto:${DATA_REQUEST_EMAIL}?subject=${encodeURIComponent(
        "Consent data request",
      )}&body=${encodeURIComponent(
        `Hi,\n\nPlease action a data request for my consent ID:\n\n${subjectId}\n\n`,
      )}`
    : `mailto:${DATA_REQUEST_EMAIL}`;

  return (
    <div className="mt-4 overflow-hidden rounded-md border border-borderDefault bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="consent-subject-id-body"
        className="flex w-full cursor-pointer items-center justify-between border-none bg-transparent px-4 py-3 text-left outline-none"
      >
        <span className="text-copy-14 font-medium text-textDefault">
          ID to request consent data
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-textSubtle transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
        />
      </button>
      <div
        id="consent-subject-id-body"
        hidden={!open}
        className="flex flex-col gap-3 border-t border-borderDefault px-4 pb-4"
      >
        <div className="mt-3 flex items-center gap-2 rounded-md border border-borderDefault bg-canvas px-3 py-2.5">
          <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-copy-13 text-textDefault">
            {subjectId ?? "—"}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!subjectId}
            aria-label={copied ? "Copied" : "Copy ID"}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-borderDefault bg-surface text-textSubtle outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <p className="text-copy-13 text-textSubtler">
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
// Consent Settings dialog (Stride Modal, driven by c15t hooks)
// ============================================================================

export function ConsentSettingsModal() {
  const {
    activeUI,
    setActiveUI,
    consentInfo,
    selectedConsents,
    setSelectedConsent,
    saveConsents,
  } = useConsentManager();

  const open = activeUI === "dialog";
  const close = () => setActiveUI("none");

  const handleSave = async () => {
    await saveConsents("custom", { uiSource: "dialog" });
    close();
  };
  const handleDeny = async () => {
    await saveConsents("necessary", { uiSource: "dialog" });
    close();
  };
  const handleAcceptAll = async () => {
    await saveConsents("all", { uiSource: "dialog" });
    close();
  };

  return (
    <Modal open={open} onClose={close}>
      <Modal.Title>{MODAL_TITLE}</Modal.Title>
      <Modal.P>{MODAL_DESCRIPTION}</Modal.P>
      <div className="mt-6 overflow-hidden rounded-md border border-borderDefault bg-surface">
        {CONSENT_CATEGORIES.map((cat, i) => (
          <ConsentCategoryRow
            key={cat.key}
            category={cat}
            value={cat.required ? true : (selectedConsents[cat.key] ?? false)}
            onChange={(next) => {
              if (cat.required) return;
              setSelectedConsent(cat.key, next);
            }}
            isLast={i === CONSENT_CATEGORIES.length - 1}
          />
        ))}
      </div>
      {/* Only shown once a decision exists — before that there's no subject
          id (and no consent record to request/delete), so the section would
          just read "—". */}
      {consentInfo?.subjectId && (
        <ConsentSubjectIdSection subjectId={consentInfo.subjectId} />
      )}
      <Modal.Footer>
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={handleDeny}>
              Deny
            </Button>
            <Button variant="secondary" onClick={handleAcceptAll}>
              Accept all
            </Button>
            <Button onClick={handleSave} className="ml-auto">
              Save
            </Button>
          </div>
          <p className="text-copy-13 text-textSubtler">
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
      </Modal.Footer>
    </Modal>
  );
}

// ============================================================================
// Bottom banner (Stride card, driven by c15t headless UI state)
// ============================================================================

function BottomBanner() {
  const { banner, openDialog, performBannerAction } = useHeadlessConsentUI();
  const [mounted, setMounted] = useState(false);

  // Portal only after mount so SSR and first client paint match (no flash).
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !banner.isVisible) return null;

  return createPortal(
    <>
      <style>{`
        @keyframes distanz-consent-in {
          from { opacity: 0; transform: translateY(calc(100% + 24px)); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        role="alertdialog"
        aria-labelledby="consent-banner-title"
        aria-modal="false"
        className="fixed bottom-4 left-4 right-4 z-[10000] sm:left-auto sm:max-w-[400px]"
        style={{
          animation:
            "distanz-consent-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
          willChange: "transform, opacity",
        }}
      >
        {/* No explicit border — --ds-shadow-menu opens with a hairline ring, so
            an extra border would double-paint (material double-border lesson). */}
        <div
          className="flex flex-col gap-4 rounded-xl bg-surface p-5"
          style={{ boxShadow: "var(--ds-shadow-menu)" }}
        >
          <div>
            <h2
              id="consent-banner-title"
              className="text-heading-16 leading-tight text-textDefault"
            >
              {BANNER_TITLE}
            </h2>
            <p className="mt-2 text-copy-13 text-textSubtle">
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
              onClick={() => performBannerAction("reject")}
            >
              Deny
            </Button>
            <Button
              variant="secondary"
              shape="rounded"
              size="small"
              onClick={() => performBannerAction("accept")}
            >
              Accept all
            </Button>
            <Button
              shape="rounded"
              size="small"
              onClick={openDialog}
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
// Single export — mount this once in the app root (inside ConsentManagerClient)
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
