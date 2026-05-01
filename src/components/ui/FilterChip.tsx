"use client";

// src/components/ui/FilterChip.tsx
//
// Trigger + popover wrapper for filter affordances that don't have
// their own DS primitive (Calendar owns its trigger; this is for
// everything else — Distance, Country, Surface, Elevation,
// Temperature, Price). Renders a 32 px chip styled identically to
// the Calendar trigger so the filter row reads as one cohesive set.
//
// Two visual states:
//   - default: shows `label` + chevron-down icon. Click opens.
//   - active:  shows `activeLabel` + X clear-button. Click on the
//              text opens the popover; click on X fires onClear.
//
// Body is rendered via render-prop or static node. Render-prop
// receives a `close` helper so the body can dismiss the popover
// after committing values:
//
//   <FilterChip label="Distance" activeLabel={...} onClear={...}>
//     {({ close }) => (
//       <Panel onApply={() => { commit(); close(); }} />
//     )}
//   </FilterChip>

import { useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, X } from "lucide-react";

interface FilterChipProps {
  /** Default chip label, shown when no value is active. */
  label: string;
  /** When set, the chip switches to the active style and shows
   *  this string instead of the label. */
  activeLabel?: string;
  /** Called when the user clicks the X on an active chip. */
  onClear?: () => void;
  /** Called when the popover open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Render-prop or static body. Render-prop receives a `close`
   *  helper so the body can close the popover after committing. */
  children: ReactNode | ((helpers: { close: () => void }) => ReactNode);
  /** Width of the popover panel in pixels. Defaults to 280. */
  panelWidth?: number;
}

export default function FilterChip({
  label,
  activeLabel,
  onClear,
  onOpenChange,
  children,
  panelWidth = 280,
}: FilterChipProps) {
  const [open, setOpen] = useState(false);
  const isActive = Boolean(activeLabel);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  const handleClearClick = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClear?.();
  };

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-sm bg-[color:var(--ds-background-100)] pl-3 pr-1.5 text-[14px] font-normal leading-[20px] text-[color:var(--ds-gray-1000)] transition-colors hover:bg-[color:var(--ds-gray-100)] [box-shadow:var(--ds-gray-400)_0_0_0_1px] hover:[box-shadow:var(--ds-gray-500)_0_0_0_1px]"
        >
          <span>{isActive && activeLabel ? activeLabel : label}</span>
          {isActive && onClear ? (
            <span
              role="button"
              tabIndex={0}
              aria-label={`Clear ${label}`}
              onClick={(e) => handleClearClick(e)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClearClick(e);
                }
              }}
              className="flex size-5 items-center justify-center rounded text-[color:var(--ds-gray-1000)] transition-colors hover:bg-[color:var(--ds-gray-200)]"
            >
              <X className="size-3.5" />
            </span>
          ) : (
            <ChevronDown className="size-4 text-[color:var(--ds-gray-900)]" />
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="material-menu z-[2001]"
          // material-menu sets both `border: 1px solid` and a
          // box-shadow whose first stop is also a 1 px ring — the
          // two stack and read as a doubled edge. Drop the border
          // and let the shadow ring define the silhouette.
          style={{ width: panelWidth, padding: 16, border: "none" }}
        >
          {typeof children === "function"
            ? children({ close: () => handleOpenChange(false) })
            : children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
