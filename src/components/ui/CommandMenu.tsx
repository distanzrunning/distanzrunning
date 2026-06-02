"use client";

import { Command, useCommandState } from "cmdk";
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

// ============================================================================
// Types
// ============================================================================

export interface CommandMenuProps {
  /** Whether the command menu is open */
  open: boolean;
  /** Called when the command menu should close */
  onClose: () => void;
  /** Command groups, items, and pages */
  children?: ReactNode;
  /** Placeholder for the root page's input */
  placeholder?: string;
  /** Additional CSS classes for the wrapper */
  className?: string;
  /** Custom item filter — return 0 to hide, >0 to show (higher ranks first) */
  filter?: (value: string, search: string, keywords?: string[]) => number;
  /**
   * Controlled input value. Pair with `onValueChange` to drive
   * the input from external state — used by the public-site
   * search to wire the input directly to Algolia's `refine`.
   */
  value?: string;
  /** Fired when the input value changes (typing). */
  onValueChange?: (value: string) => void;
  /**
   * Custom content for the empty state (shown when no items
   * render). Three modes:
   *   - omitted        → default "No results found." text
   *   - ReactNode      → renders that content inside
   *                      Command.Empty. Pass a sized wrapper if
   *                      you want a taller area.
   *   - explicit null  → suppresses Command.Empty entirely so
   *                      the result area collapses to its
   *                      padding, leaving just the input row
   *                      visible.
   */
  emptyState?: ReactNode | null;
  /**
   * When true, drops the divider below the input row and
   * removes the result list's padding so the menu collapses
   * to a flush input-only surface.
   */
  resultsHidden?: boolean;
}

interface CommandMenuGroupProps {
  /** Optional heading label for the group */
  heading?: string;
  /** Command items */
  children: ReactNode;
}

interface CommandMenuItemProps {
  /** Item label content */
  children: ReactNode;
  /** Called when the item is selected */
  onSelect?: () => void;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Optional icon rendered before the label */
  icon?: ReactNode;
  /** Optional keyboard shortcut label (e.g. "⌘K") */
  shortcut?: string;
  /** Optional secondary line (e.g. category / breadcrumb) */
  subtitle?: ReactNode;
  /** Explicit cmdk value used for filter matching */
  value?: string;
  /** Extra terms that should match this item (see cmdk filter) */
  keywords?: string[];
  /**
   * Push a sub-page onto the menu stack when the item is selected.
   * The matching `<CommandMenu.Page id="...">` becomes the active
   * page; the user can return to the previous page with Backspace at
   * an empty input. Mutually exclusive with `onSelect` — when both
   * are passed, `onSelect` fires first and then the page is pushed.
   */
  subPage?: string;
}

interface CommandMenuPageProps {
  /** Page identifier — matches the `subPage` value on the item that opens it */
  id: string;
  /** Title shown as a breadcrumb on the left of the input */
  label: string;
  /** Placeholder shown in the input while this page is active */
  placeholder?: string;
  /** Page-scoped groups + items */
  children: ReactNode;
}

// ============================================================================
// Page-stack context — drives the sub-page push/pop from anywhere inside
// the dialog. Consumed by CommandMenuItem when `subPage` is set.
// ============================================================================

interface CommandMenuStackContextValue {
  pushPage: (id: string) => void;
}

const CommandMenuStackContext =
  createContext<CommandMenuStackContextValue | null>(null);

// ============================================================================
// Styles — Geist computed values, scoped to .ds-cmdk-content
// ============================================================================

const CMDK_CSS = `
  .ds-cmdk-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: var(--ds-overlay-backdrop-color);
    opacity: var(--ds-overlay-backdrop-opacity);
    /* Match the Modal + Mega-menu scrim: dim/lift + 8px frost so
       all three overlays read as the same product moment. */
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    animation: ds-cmdk-fade-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  }

  .ds-cmdk-content {
    position: fixed;
    top: 20vh;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    width: 640px;
    max-width: calc(100vw - 32px);
    border-radius: 12px;
    background: rgb(var(--color-surface));
    box-shadow: var(--ds-shadow-modal);
    color: var(--ds-gray-1000);
    overflow: hidden;
    outline: none;
    animation: ds-cmdk-scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  }

  @keyframes ds-cmdk-fade-in {
    from { opacity: 0; }
  }

  @keyframes ds-cmdk-scale-in {
    from {
      opacity: 0;
      transform: translateX(-50%) scale(0.98);
    }
  }

  .ds-cmdk-content [cmdk-input] {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 18px;
    color: var(--ds-gray-1000);
    padding: 0;
    font-family: inherit;
  }

  .ds-cmdk-content [cmdk-input]::placeholder {
    color: var(--ds-gray-700);
  }

  .ds-cmdk-content [cmdk-list] {
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 8px;
    max-height: 436px;
    background: rgb(var(--color-surface));
  }

  .ds-cmdk-content [cmdk-group-heading] {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 8px;
    font-size: 13px;
    color: var(--ds-gray-700);
    user-select: none;
  }

  .ds-cmdk-content [cmdk-item] {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 40px;
    min-height: 40px;
    padding: 0 8px;
    border-radius: 6px;
    font-size: 14px;
    color: var(--ds-gray-1000);
    cursor: pointer;
    scroll-margin: 8px 0;
    transition: background 0.1s ease;
    user-select: none;
  }

  .ds-cmdk-content [cmdk-item][data-selected="true"] {
    background: var(--ds-gray-alpha-200);
  }

  .ds-cmdk-content [cmdk-item][data-disabled="true"] {
    color: var(--ds-gray-600);
    cursor: default;
  }

  .ds-cmdk-content [cmdk-item].ds-cmdk-item-tall {
    height: 48px;
    min-height: 48px;
  }

  .ds-cmdk-content [cmdk-empty] {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 64px;
    font-size: 14px;
    color: var(--ds-gray-700);
    user-select: none;
  }

  .ds-cmdk-page-crumb {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 8px;
    border-radius: 6px;
    background: var(--ds-gray-100);
    color: var(--ds-gray-1000);
    font-size: 13px;
    font-weight: 500;
    flex-shrink: 0;
  }

  .ds-cmdk-esc-button {
    display: none;
    background: rgb(var(--color-surface));
  }

  @media (hover: hover) and (pointer: fine) {
    .ds-cmdk-esc-button {
      display: flex;
    }
    .ds-cmdk-esc-button:hover {
      background: var(--ds-gray-100) !important;
    }
  }
`;

// ============================================================================
// Result count announcer — sits inside Command.Dialog so it can read
// cmdk's filtered state. Renders a visually-hidden polite live region
// that says "3 results for 'X'" so screen readers hear the list narrow
// as the user types. Idle (no search) emits nothing.
// ============================================================================

function ResultCountAnnouncer() {
  const search = useCommandState((state) => state.search);
  const count = useCommandState((state) => state.filtered.count);

  const message = !search
    ? ""
    : count === 0
      ? `No results for "${search}"`
      : `${count} ${count === 1 ? "result" : "results"} for "${search}"`;

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  );
}

// ============================================================================
// Compound Components
// ============================================================================

function CommandMenuGroup({ heading, children }: CommandMenuGroupProps) {
  return <Command.Group heading={heading}>{children}</Command.Group>;
}

function CommandMenuItem({
  children,
  onSelect,
  disabled = false,
  icon,
  shortcut,
  subtitle,
  value,
  keywords,
  subPage,
}: CommandMenuItemProps) {
  const stack = useContext(CommandMenuStackContext);

  const handleSelect = useCallback(() => {
    onSelect?.();
    if (subPage && stack) {
      stack.pushPage(subPage);
    }
  }, [onSelect, subPage, stack]);

  return (
    <Command.Item
      onSelect={handleSelect}
      disabled={disabled}
      value={value}
      keywords={keywords}
      className={subtitle ? "ds-cmdk-item-tall" : undefined}
    >
      {icon && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            flexShrink: 0,
            color: disabled ? "var(--ds-gray-600)" : "var(--ds-gray-900)",
          }}
        >
          {icon}
        </span>
      )}
      {subtitle ? (
        <span
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <span
            style={{
              fontSize: 14,
              lineHeight: "18px",
              fontWeight: 500,
              color: "var(--ds-gray-1000)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {children}
          </span>
          <span
            style={{
              fontSize: 12,
              lineHeight: "16px",
              color: "var(--ds-gray-900)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {subtitle}
          </span>
        </span>
      ) : (
        <span style={{ flex: 1 }}>{children}</span>
      )}
      {shortcut && (
        <kbd
          style={{
            fontSize: 12,
            lineHeight: "16px",
            color: "var(--ds-gray-700)",
            fontFamily: "inherit",
          }}
        >
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}

/**
 * A sub-page within a CommandMenu. The matching item (rendered with
 * `subPage="<id>"`) pushes the user onto this page; Backspace at an
 * empty input pops back to the previous page.
 */
function CommandMenuPage(_props: CommandMenuPageProps) {
  // Page is a config carrier — its children are rendered by the
  // CommandMenu host once the page is active. Nothing to render here.
  return null;
}

// ============================================================================
// CommandMenu
// ============================================================================

export function CommandMenu({
  open,
  onClose,
  children,
  placeholder = "Search for actions...",
  className = "",
  filter,
  value,
  onValueChange,
  emptyState,
  resultsHidden = false,
}: CommandMenuProps) {
  // Split children into root content + page configs by element type.
  const { rootChildren, pages } = useMemo(() => {
    const rootChildren: ReactNode[] = [];
    const pages = new Map<
      string,
      { label: string; placeholder?: string; children: ReactNode }
    >();
    Children.forEach(children, (child) => {
      if (
        isValidElement(child) &&
        (child as ReactElement).type === CommandMenuPage
      ) {
        const props = (child as ReactElement<CommandMenuPageProps>).props;
        pages.set(props.id, {
          label: props.label,
          placeholder: props.placeholder,
          children: props.children,
        });
      } else {
        rootChildren.push(child);
      }
    });
    return { rootChildren, pages };
  }, [children]);

  // Page stack. Top of the stack is the active page; empty stack = root.
  const [pageStack, setPageStack] = useState<string[]>([]);
  const [internalSearch, setInternalSearch] = useState("");

  // Reset the stack and the search every time the dialog closes so the
  // next open lands on the root with a clean input.
  useEffect(() => {
    if (!open) {
      setPageStack([]);
      setInternalSearch("");
    }
  }, [open]);

  const activePageId = pageStack[pageStack.length - 1];
  const activePage = activePageId ? pages.get(activePageId) : undefined;

  const stackValue = useMemo(
    () => ({
      pushPage: (id: string) => {
        setPageStack((prev) => [...prev, id]);
        // Clear the search when entering a page so the page's own
        // results aren't filtered by the previous query.
        if (value === undefined) {
          setInternalSearch("");
        } else {
          onValueChange?.("");
        }
      },
    }),
    [value, onValueChange],
  );

  const popPage = useCallback(() => {
    setPageStack((prev) => prev.slice(0, -1));
  }, []);

  const isControlled = value !== undefined;
  const currentSearch = isControlled ? value : internalSearch;

  const handleValueChange = useCallback(
    (next: string) => {
      if (!isControlled) {
        setInternalSearch(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Backspace at empty input pops the page stack.
      if (
        event.key === "Backspace" &&
        !currentSearch &&
        pageStack.length > 0
      ) {
        event.preventDefault();
        popPage();
      }
    },
    [currentSearch, pageStack.length, popPage],
  );

  const effectivePlaceholder = activePage?.placeholder ?? placeholder;
  const visibleChildren = activePage ? activePage.children : rootChildren;

  return (
    <CommandMenuStackContext.Provider value={stackValue}>
      <style>{CMDK_CSS}</style>
      <Command.Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
        label="Command Menu"
        overlayClassName="ds-cmdk-overlay"
        contentClassName={`ds-cmdk-content ${className}`.trim()}
        filter={filter}
        onKeyDown={handleKeyDown}
        loop
      >
        {/* Top section — Geist: topSection */}
        <div
          style={{
            position: "relative",
            padding: 12,
            borderBottom: resultsHidden
              ? "none"
              : "1px solid var(--ds-gray-alpha-400)",
            background: "rgb(var(--color-surface))",
          }}
        >
          {/* Input wrapper — Geist: inputWrapper */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "0 4px",
            }}
          >
            {/* Breadcrumb crumb — shown only when a sub-page is active.
                Reads the active page's label so the user knows where
                they are; clicking it pops back. */}
            {activePage && (
              <button
                type="button"
                className="ds-cmdk-page-crumb"
                onClick={popPage}
                aria-label={`Back to previous page (currently in ${activePage.label})`}
              >
                {activePage.label}
              </button>
            )}
            <Command.Input
              placeholder={effectivePlaceholder}
              value={currentSearch}
              onValueChange={handleValueChange}
            />
            <button
              type="button"
              className="ds-cmdk-esc-button"
              onClick={onClose}
              style={{
                alignItems: "center",
                padding: "0 4px",
                height: 20,
                border: "none",
                borderRadius: 4,
                boxShadow:
                  "var(--ds-gray-alpha-400) 0px 0px 0px 1px, var(--ds-gray-100) 0px 0px 0px 1px",
                color: "var(--ds-gray-1000)",
                fontSize: 12,
                cursor: "pointer",
                transition: "background 0.2s ease",
                fontFamily: "inherit",
              }}
            >
              Esc
            </button>
          </div>
        </div>

        {/* Scrollable items — Geist: list. When the result area
            is hidden (idle search-as-you-type state), zero the
            padding so the list adds no vertical space — modal
            collapses to just the input row. */}
        <Command.List style={resultsHidden ? { padding: 0 } : undefined}>
          {emptyState !== null && (
            <Command.Empty>{emptyState ?? "No results found."}</Command.Empty>
          )}
          {visibleChildren}
        </Command.List>

        <ResultCountAnnouncer />
      </Command.Dialog>
    </CommandMenuStackContext.Provider>
  );
}

CommandMenu.Group = CommandMenuGroup;
CommandMenu.Item = CommandMenuItem;
CommandMenu.Page = CommandMenuPage;
