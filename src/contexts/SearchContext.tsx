"use client";

// src/contexts/SearchContext.tsx
//
// Global search modal — lifted out of SiteHeader so the
// trigger can fire from anywhere (the desktop header's icon
// button, the mobile drawer footer's Search button, the ⌘K
// keyboard shortcut, …) without each consumer owning its own
// Dialog state.
//
// Renders one of two distinct presentation components based on
// viewport, switched via matchMedia:
//   - md+      → <SearchModal /> inside a centered Dialog.Content
//                (the original SiteHeader modal — verbatim).
//   - < md     → <SearchSheet /> inside a full-viewport
//                Dialog.Content pinned below the 50 px header.
//
// Only one is mounted at any moment, so we don't get duplicate
// InstantSearch instances.

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

import { SearchModal, SearchSheet } from "@/components/Search";

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

  // Viewport tracking — matchMedia (min-width: 768px) matches
  // Tailwind's md breakpoint. SSR returns true so server-
  // rendered HTML matches a desktop client; mobile clients
  // re-render once the effect resolves. The modal isn't
  // visible at first paint anyway (open starts false), so the
  // re-render is invisible to the user.
  const [isMdUp, setIsMdUp] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 768px)").matches;
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMdUp(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

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
          {isMdUp ? (
            <Dialog.Content className="fixed left-1/2 top-24 z-[70] w-[calc(100%-1rem)] -translate-x-1/2 p-0 focus:outline-none md:w-full md:max-w-xl">
              <Dialog.Title className="sr-only">Search</Dialog.Title>
              <Dialog.Description className="sr-only">
                Search articles, gear and races
              </Dialog.Description>
              <SearchModal isExpanded={open} onExpandChange={setOpen} />
            </Dialog.Content>
          ) : (
            <Dialog.Content className="fixed inset-x-0 bottom-0 top-[50px] z-[70] p-0 focus:outline-none">
              <Dialog.Title className="sr-only">Search</Dialog.Title>
              <Dialog.Description className="sr-only">
                Search articles, gear and races
              </Dialog.Description>
              <SearchSheet isExpanded={open} onExpandChange={setOpen} />
            </Dialog.Content>
          )}
        </Dialog.Portal>
      </Dialog.Root>
    </SearchContext.Provider>
  );
}
