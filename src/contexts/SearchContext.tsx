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
          {/* Two presentations, switched at the lg breakpoint:
              - mobile / tablet: full-viewport sheet that starts
                below the 50 px SiteHeader so the header stays
                visible and tappable while search is open.
              - lg+: centered modal at top-24 (96 px from
                viewport top), max-w-xl wide. Reverts to the
                original desktop search behaviour — a full
                takeover on a 1440 px monitor was overkill for
                a type-two-words action. */}
          <Dialog.Content
            className="
              fixed inset-x-0 bottom-0 top-[50px] z-[70] p-0
              focus:outline-none
              md:bottom-auto md:left-1/2 md:right-auto md:top-24
              md:w-full md:max-w-xl md:-translate-x-1/2
            "
          >
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
