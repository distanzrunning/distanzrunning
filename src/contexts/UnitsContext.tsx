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

export type UnitSystem = "imperial" | "metric";

export interface UnitsPreferences {
  units: UnitSystem;
  currency: string;
}

export interface UnitsContextValue extends UnitsPreferences {
  setUnits: (units: UnitSystem) => void;
  setCurrency: (currency: string) => void;
}

const STORAGE_KEY = "distanz:units";
const DEFAULT_UNITS: UnitSystem = "imperial";
const DEFAULT_CURRENCY = "USD";

const UnitsContext = createContext<UnitsContextValue>({
  units: DEFAULT_UNITS,
  currency: DEFAULT_CURRENCY,
  setUnits: () => {},
  setCurrency: () => {},
});

function readStoredPreferences(): UnitsPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UnitsPreferences>;
    const units: UnitSystem =
      parsed.units === "metric" ? "metric" : "imperial";
    const currency =
      typeof parsed.currency === "string" && parsed.currency.length > 0
        ? parsed.currency
        : DEFAULT_CURRENCY;
    return { units, currency };
  } catch {
    return null;
  }
}

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [units, setUnitsState] = useState<UnitSystem>(DEFAULT_UNITS);
  const [currency, setCurrencyState] = useState<string>(DEFAULT_CURRENCY);

  useEffect(() => {
    const stored = readStoredPreferences();
    if (stored) {
      setUnitsState(stored.units);
      setCurrencyState(stored.currency);
    }
  }, []);

  const persist = useCallback((next: UnitsPreferences) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage unavailable (private mode, quota) — fall through.
    }
  }, []);

  const setUnits = useCallback(
    (next: UnitSystem) => {
      setUnitsState(next);
      persist({ units: next, currency });
    },
    [currency, persist],
  );

  const setCurrency = useCallback(
    (next: string) => {
      setCurrencyState(next);
      persist({ units, currency: next });
    },
    [units, persist],
  );

  const value = useMemo<UnitsContextValue>(
    () => ({ units, currency, setUnits, setCurrency }),
    [units, currency, setUnits, setCurrency],
  );

  return (
    <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>
  );
}

export function useUnits(): UnitsContextValue {
  return useContext(UnitsContext);
}
