"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// ============================================================================
// Types
// ============================================================================

export type ConsentCategory =
  | "essential"
  | "marketing"
  | "analytics"
  | "functional";

export interface ConsentPreferences {
  /** Always true — required for the site to function. */
  essential: true;
  marketing: boolean;
  analytics: boolean;
  functional: boolean;
}

interface StoredConsent extends ConsentPreferences {
  /** ISO timestamp of the last user decision. */
  decidedAt: string;
  /** Schema version so we can prompt for re-consent if categories change. */
  version: number;
}

export interface ConsentContextValue {
  /** Current preferences, or null if the user hasn't decided yet. */
  preferences: ConsentPreferences | null;
  /** Shortcut: has the user ever made a decision? */
  isDecided: boolean;
  /** Accept every optional category. */
  acceptAll: () => void;
  /** Decline every optional category. */
  rejectAll: () => void;
  /** Persist a custom combination. Essential is always forced to true. */
  save: (prefs: Partial<Omit<ConsentPreferences, "essential">>) => void;
  /** Clear the stored decision — useful for development / "Reset" links. */
  reset: () => void;
  /** Open the consent settings modal. */
  openSettings: () => void;
  /** Whether the settings modal is currently open. */
  settingsOpen: boolean;
  /** Close the settings modal. */
  closeSettings: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = "distanz-consent";
const ANON_ID_KEY = "distanz-consent-anon-id";
const CONSENT_VERSION = 1;
const CONSENT_API = "/api/consent";

const DEFAULT_PREFERENCES: ConsentPreferences = {
  essential: true,
  marketing: false,
  analytics: false,
  functional: false,
};

const ALL_ON: ConsentPreferences = {
  essential: true,
  marketing: true,
  analytics: true,
  functional: true,
};

// ============================================================================
// Context
// ============================================================================

const ConsentContext = createContext<ConsentContextValue | null>(null);

// ============================================================================
// Helpers
// ============================================================================

function readStored(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed?.version !== CONSENT_VERSION) return null;
    return {
      essential: true,
      marketing: !!parsed.marketing,
      analytics: !!parsed.analytics,
      functional: !!parsed.functional,
    };
  } catch {
    return null;
  }
}

function writeStored(prefs: ConsentPreferences) {
  if (typeof window === "undefined") return;
  const payload: StoredConsent = {
    ...prefs,
    decidedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  // Broadcast so other tabs / scripts can react
  window.dispatchEvent(
    new CustomEvent<ConsentPreferences>("distanz-consent-change", {
      detail: prefs,
    }),
  );
}

function clearStored() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("distanz-consent-change"));
}

function getOrCreateAnonId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
}

type Decision = "accept_all" | "reject_all" | "custom";

function classifyDecision(prefs: ConsentPreferences): Decision {
  const { marketing, analytics, functional } = prefs;
  if (marketing && analytics && functional) return "accept_all";
  if (!marketing && !analytics && !functional) return "reject_all";
  return "custom";
}

async function reportDecision(prefs: ConsentPreferences, decision: Decision) {
  if (typeof window === "undefined") return;
  const anonId = getOrCreateAnonId();
  try {
    await fetch(CONSENT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anonId,
        marketing: prefs.marketing,
        analytics: prefs.analytics,
        functional: prefs.functional,
        decision,
        version: CONSENT_VERSION,
      }),
      keepalive: true,
    });
  } catch {
    // Silent — localStorage is still the source of truth for the UI.
  }
}

// ============================================================================
// Provider
// ============================================================================

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(
    null,
  );
  const [hydrated, setHydrated] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Hydrate from localStorage on mount. Keep preferences null on server
  // render so SSR and the first client paint match (the banner stays hidden
  // until hydration resolves, no flash).
  useEffect(() => {
    setPreferences(readStored());
    setHydrated(true);
  }, []);

  const persist = useCallback(
    (prefs: ConsentPreferences, decision: Decision) => {
      writeStored(prefs);
      setPreferences(prefs);
      void reportDecision(prefs, decision);
    },
    [],
  );

  const acceptAll = useCallback(() => {
    persist(ALL_ON, "accept_all");
    setSettingsOpen(false);
  }, [persist]);

  const rejectAll = useCallback(() => {
    persist(DEFAULT_PREFERENCES, "reject_all");
    setSettingsOpen(false);
  }, [persist]);

  const save = useCallback(
    (next: Partial<Omit<ConsentPreferences, "essential">>) => {
      const base = preferences ?? DEFAULT_PREFERENCES;
      const merged: ConsentPreferences = {
        essential: true,
        marketing: next.marketing ?? base.marketing,
        analytics: next.analytics ?? base.analytics,
        functional: next.functional ?? base.functional,
      };
      persist(merged, classifyDecision(merged));
      setSettingsOpen(false);
    },
    [preferences, persist],
  );

  const reset = useCallback(() => {
    clearStored();
    setPreferences(null);
    setSettingsOpen(false);
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      preferences: hydrated ? preferences : null,
      isDecided: hydrated && preferences !== null,
      acceptAll,
      rejectAll,
      save,
      reset,
      openSettings,
      settingsOpen,
      closeSettings,
    }),
    [
      hydrated,
      preferences,
      acceptAll,
      rejectAll,
      save,
      reset,
      openSettings,
      settingsOpen,
      closeSettings,
    ],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used inside <ConsentProvider>");
  }
  return ctx;
}

export function useConsentCategory(category: ConsentCategory): boolean {
  const { preferences } = useConsent();
  if (!preferences) return category === "essential";
  return preferences[category] === true;
}
