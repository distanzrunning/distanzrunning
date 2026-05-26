"use client";

// Shared filter state for the consent dashboard. Provides an
// instantly-applied client-side filter string consumed by the
// RecentDecisionsTable, and written by the ConsentFilterRow's search
// input. Kept tiny because it spans a Suspense boundary — the
// provider lives in page.tsx (outside Suspense) so the filter row
// stays mounted while the dashboard is streaming.

import { createContext, useContext, useState, type ReactNode } from "react";

interface ConsentFilterContextValue {
  filterText: string;
  setFilterText: (s: string) => void;
}

const ConsentFilterContext = createContext<ConsentFilterContextValue>({
  filterText: "",
  setFilterText: () => {},
});

export function ConsentFilterShell({ children }: { children: ReactNode }) {
  const [filterText, setFilterText] = useState("");
  return (
    <ConsentFilterContext.Provider value={{ filterText, setFilterText }}>
      {children}
    </ConsentFilterContext.Provider>
  );
}

export function useConsentFilter() {
  return useContext(ConsentFilterContext);
}
