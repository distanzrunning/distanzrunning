"use client";

import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  /** Visible label. */
  label: string;
  /** Optional link target — renders the crumb as an `<a>`. */
  href?: string;
  /** Marks the current page (`aria-current`); rendered in full-ink. */
  active?: boolean;
  /** Non-interactive crumb — muted and not clickable. */
  disabled?: boolean;
  /** Click handler when not navigating via `href`. */
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  /** Ordered crumbs, root first. */
  items: BreadcrumbItem[];
  /**
   * `text` (default) — inline crumbs separated by chevrons.
   * `menu` — bordered pill buttons (useful when crumbs can truncate).
   */
  variant?: "text" | "menu";
  className?: string;
}

// Per-crumb colour + cursor for the text variant. The chevron separator
// keeps its own `text-textSubtle` so it stays gray-900 regardless of the
// crumb's state (matches Geist's `[&_svg]:!text-gray-900`).
function textCrumbState(item: BreadcrumbItem) {
  if (item.disabled) return "text-textSubtler cursor-not-allowed";
  if (item.active) return "text-textDefault cursor-pointer";
  return "text-textSubtle cursor-pointer hover:text-textDefault";
}

function menuCrumbState(item: BreadcrumbItem) {
  if (item.disabled) return "text-textSubtler cursor-not-allowed";
  if (item.active)
    return "text-textDefault cursor-pointer hover:bg-[var(--ds-gray-200)] hover:border-[var(--ds-gray-alpha-500)]";
  return "text-textSubtle cursor-pointer hover:bg-[var(--ds-gray-200)] hover:border-[var(--ds-gray-alpha-500)] hover:text-textDefault";
}

// Geist text-link affordance: inherit colour, no underline, 2px focus
// radius + the blue focus ring (links are actionable). The trailing
// separator is omitted in JS rather than hidden via a stacked
// `last-of-type:[&_svg]:hidden` variant, which mis-compiles here and
// would hide every chevron.
const TEXT_ITEM_BASE =
  "text-copy-14 flex items-center gap-1.5 transition-colors duration-200 " +
  "[&_a]:text-inherit [&_a]:no-underline [&_a]:rounded-[2px] [&_a]:outline-none " +
  "[&_a]:focus-visible:shadow-[var(--ds-focus-ring)]";

const MENU_ITEM_BASE =
  "inline-block min-w-0 max-w-full truncate whitespace-nowrap rounded-[4px] " +
  "border border-[var(--ds-gray-alpha-400)] bg-canvas px-1.5 py-0.5 text-label-12 " +
  "transition-[color,border-color,background] duration-200 " +
  "focus-visible:outline-none focus-visible:shadow-[var(--ds-focus-ring)]";

export function Breadcrumbs({
  items,
  variant = "text",
  className = "",
}: BreadcrumbsProps) {
  if (variant === "menu") {
    return (
      <nav aria-label="Breadcrumb" className={className}>
        <div className="flex gap-2 max-sm:overflow-x-auto">
          {items.map((item, i) => {
            const cls = `${MENU_ITEM_BASE} ${menuCrumbState(item)}`;
            const aria = item.active ? ("page" as const) : undefined;
            return item.href && !item.disabled ? (
              <a key={i} href={item.href} onClick={item.onClick} className={cls} aria-current={aria}>
                {item.label}
              </a>
            ) : (
              <button
                key={i}
                type="button"
                disabled={item.disabled}
                onClick={item.onClick}
                className={cls}
                aria-current={aria}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex list-none gap-1.5 p-0">
        {items.map((item, i) => (
          <li
            key={i}
            aria-current={item.active ? "page" : undefined}
            className={`${TEXT_ITEM_BASE} ${textCrumbState(item)}`}
          >
            {item.href && !item.disabled ? (
              <a href={item.href} onClick={item.onClick}>
                {item.label}
              </a>
            ) : (
              item.label
            )}
            {i < items.length - 1 && (
              <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-textSubtle" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
