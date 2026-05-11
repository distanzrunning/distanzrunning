"use client";

// src/contexts/SearchContext.tsx
//
// Global search modal — lifted out of SiteHeader so the
// trigger can fire from anywhere (the desktop header's icon
// button, the mobile drawer footer's Search button, the ⌘K
// keyboard shortcut, …) without each consumer owning its own
// open state.
//
// Rendering is delegated to the design-system `CommandMenu`
// primitive via <Search />. CommandMenu manages its own
// Dialog + overlay + positioning — see the DS spec at
// /admin/design-system/search.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import Search from "@/components/Search";

interface SearchContextValue {
  open: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within <SearchProvider>");
  return ctx;
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);

  // ⌘K / Ctrl+K toggles the modal — matches Vercel, Linear,
  // GitHub. Listener lives in the provider so the shortcut
  // works no matter which page is mounted.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo<SearchContextValue>(
    () => ({ open, openSearch, closeSearch }),
    [open, openSearch, closeSearch],
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
      <Search isExpanded={open} onExpandChange={setOpen} />
    </SearchContext.Provider>
  );
}
