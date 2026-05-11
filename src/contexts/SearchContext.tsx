"use client";

// src/contexts/SearchContext.tsx
//
// Global search modal — lifted out of SiteHeader so the
// trigger can fire from anywhere (the desktop header's icon
// button, the mobile drawer footer's Search button, the ⌘K
// keyboard shortcut, …) without each consumer owning its own
// Dialog state.
//
// Renders the original SearchModal (centered card, top-24,
// max-w-xl) on every viewport. Dialog.Content's
// `w-[calc(100%-1rem)] md:max-w-xl` already handles mobile vs
// desktop sizing — same as the pre-refactor SiteHeader Dialog.

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

import { SearchModal } from "@/components/Search";

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
          {/* Overlay styling is hardcoded — not reading the
              --ds-overlay-backdrop-* tokens — because the search
              modal predates the recent token changes (grayer
              tint + blur) that were added for the Newsletter
              modal. Restoring the original black-on-black scrim
              keeps the desktop search visually identical to the
              pre-refactor version the user signed off on. Other
              modals (Newsletter, the generic Modal primitive)
              keep using the tokens. */}
          <Dialog.Overlay
            className="fixed inset-0 z-[60]"
            style={{
              backgroundColor: "rgb(0, 0, 0)",
              opacity: 0.8,
            }}
          />
          <Dialog.Content className="fixed left-1/2 top-24 z-[70] w-[calc(100%-1rem)] -translate-x-1/2 p-0 focus:outline-none md:w-full md:max-w-xl">
            <Dialog.Title className="sr-only">Search</Dialog.Title>
            <Dialog.Description className="sr-only">
              Search articles, gear and races
            </Dialog.Description>
            <SearchModal isExpanded={open} onExpandChange={setOpen} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </SearchContext.Provider>
  );
}
