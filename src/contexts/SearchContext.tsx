"use client";

// src/contexts/SearchContext.tsx
//
// Global search modal — lifted out of SiteHeader so the
// trigger can fire from anywhere (the desktop header's icon
// button, the footer's button next to the theme switcher,
// the ⌘K keyboard shortcut, …) without each consumer owning
// its own Dialog state. The provider mounts a single Radix
// Dialog containing the Search component; consumers call
// useSearch().openSearch() to open it.
//
// The dialog opens as a full-viewport sheet (inset-0) so the
// search experience is consistent on mobile (where centered
// modals waste real estate) and on desktop (where the
// full-takeover reads as a deliberate "search mode").

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";

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
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 z-[60]"
            style={{
              backgroundColor: "var(--ds-overlay-backdrop-color)",
              opacity: "var(--ds-overlay-backdrop-opacity)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />
          {/* Full-viewport sheet: fixed inset-0 + h-dvh so the
              dialog covers everything on mobile (dvh handles the
              iOS Safari URL bar) and on desktop. */}
          <Dialog.Content className="fixed inset-0 z-[70] h-dvh w-screen p-0 focus:outline-none">
            <Dialog.Title className="sr-only">Search</Dialog.Title>
            <Dialog.Description className="sr-only">
              Search articles, gear and races
            </Dialog.Description>
            <Search isExpanded={open} onExpandChange={setOpen} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </SearchContext.Provider>
  );
}
