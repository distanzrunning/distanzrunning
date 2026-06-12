"use client";

import { type ReactElement, type ReactNode } from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";

// ============================================================================
// Types
// ============================================================================

type SwipeDir = "up" | "down" | "left" | "right";

export interface DrawerProps {
  children: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled initial open state */
  defaultOpen?: boolean;
  /**
   * Direction the drawer is swiped to dismiss. Geist's Drawer is a bottom
   * sheet, so this defaults to `bottom` (→ Base UI `swipeDirection="down"`).
   */
  direction?: "top" | "right" | "bottom" | "left";
  /** Trap focus within the drawer while open. Defaults to `true`. */
  modal?: boolean;
}

interface DrawerTriggerProps {
  children: ReactNode;
  /** Render the child element as the trigger (default) vs. a wrapping button. */
  asChild?: boolean;
}

interface DrawerContentProps {
  children: ReactNode;
  /** Custom height for the drawer. Defaults to auto (hugs content). */
  height?: string | number;
}

interface DrawerBodyProps {
  children: ReactNode;
}

interface DrawerFooterProps {
  children: ReactNode;
}

interface DrawerTitleProps {
  children: ReactNode;
}

interface DrawerDescriptionProps {
  children: ReactNode;
}

// Map our (vaul-era) `direction` names to Base UI's swipe directions.
const SWIPE_DIRECTION: Record<NonNullable<DrawerProps["direction"]>, SwipeDir> =
  {
    top: "up",
    bottom: "down",
    left: "left",
    right: "right",
  };

// ============================================================================
// Styles — Geist computed values on Base UI's data-attr / swipe-var model
// ============================================================================

const DRAWER_CSS = `
  /* Backdrop — Geist: bg-black/40, fades on open/close only (constant during
     swipe), 300ms cubic-bezier(0.32,0.72,0,1). */
  .ds-drawer-overlay {
    position: fixed;
    inset: 0;
    z-index: 4999;
    background-color: rgba(0, 0, 0, 0.4);
    transition: opacity 300ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  .ds-drawer-overlay[data-starting-style],
  .ds-drawer-overlay[data-ending-style] {
    opacity: 0;
  }
  .ds-drawer-overlay[data-swiping] {
    transition-duration: 0s;
  }

  /* Viewport — positions the popup at the bottom; empty area lets outside
     clicks fall through to the backdrop beneath (Geist parity). */
  .ds-drawer-viewport {
    position: fixed;
    inset: 0;
    z-index: 4999;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    pointer-events: none;
  }

  /* Popup — Geist: rounded-t-[10px], top hairline (gray-alpha-400), no shadow,
     max-h 90dvh, slides via --drawer-swipe-movement-y, 400ms cubic-bezier. */
  .ds-drawer-content {
    width: 100%;
    max-height: 90dvh;
    outline: none;
    pointer-events: auto;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-top: 1px solid var(--ds-gray-alpha-400);
    background-color: hsl(var(--color-surface));
    color: var(--ds-gray-1000);
    overflow-y: auto;
    overscroll-behavior: none;
    will-change: transform;
    transform: translateY(var(--drawer-swipe-movement-y, 0px));
    transition: transform 400ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  .ds-drawer-content[data-starting-style],
  .ds-drawer-content[data-ending-style] {
    transform: translateY(100%);
  }
  .ds-drawer-content[data-swiping] {
    transition-duration: 0s;
    user-select: none;
  }

  /* Content — Base UI's text-selectable region (selection doesn't start a
     swipe). Carries no box styling; the popup owns the frame. */
  .ds-drawer-inner {
    outline: none;
  }

  .ds-drawer-body {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: var(--ds-space-2x);
    flex: 0 1 auto;
    padding: var(--ds-space-large);
  }

  .ds-drawer-title {
    font-size: 18px;
    font-weight: 600;
    line-height: var(--ds-space-6x);
    color: var(--ds-gray-1000);
    text-align: center;
    margin: 0;
  }

  .ds-drawer-description {
    font-size: 14px;
    line-height: 20px;
    color: var(--ds-gray-1000);
    text-align: center;
    margin: 0;
  }

  .ds-drawer-footer {
    padding: var(--ds-space-4x) var(--ds-space-6x);
    border-top: 1px solid var(--ds-gray-alpha-400);
    background: hsl(var(--color-canvas));
  }
`;

// ============================================================================
// Compound Components
// ============================================================================

function DrawerTrigger({ children, asChild = true }: DrawerTriggerProps) {
  // asChild → adopt the supplied element (e.g. <Button>) as the trigger via
  // Base UI's `render` prop. Otherwise Base UI renders its own <button>.
  return asChild ? (
    <BaseDrawer.Trigger render={children as ReactElement} />
  ) : (
    <BaseDrawer.Trigger>{children}</BaseDrawer.Trigger>
  );
}

function DrawerContent({ children, height }: DrawerContentProps) {
  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop className="ds-drawer-overlay" />
      <BaseDrawer.Viewport className="ds-drawer-viewport">
        <BaseDrawer.Popup
          className="ds-drawer-content"
          style={height ? { height } : undefined}
        >
          <BaseDrawer.Content className="ds-drawer-inner">
            {children}
          </BaseDrawer.Content>
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
}

function DrawerBody({ children }: DrawerBodyProps) {
  return <div className="ds-drawer-body">{children}</div>;
}

function DrawerFooter({ children }: DrawerFooterProps) {
  return <div className="ds-drawer-footer">{children}</div>;
}

function DrawerTitle({ children }: DrawerTitleProps) {
  return (
    <BaseDrawer.Title className="ds-drawer-title">{children}</BaseDrawer.Title>
  );
}

function DrawerDescription({ children }: DrawerDescriptionProps) {
  return (
    <BaseDrawer.Description className="ds-drawer-description">
      {children}
    </BaseDrawer.Description>
  );
}

// ============================================================================
// Drawer
// ============================================================================

export function Drawer({
  children,
  open,
  onOpenChange,
  defaultOpen,
  direction = "bottom",
  modal,
}: DrawerProps) {
  return (
    <>
      <style>{DRAWER_CSS}</style>
      <BaseDrawer.Root
        open={open}
        onOpenChange={onOpenChange}
        defaultOpen={defaultOpen}
        swipeDirection={SWIPE_DIRECTION[direction]}
        modal={modal}
      >
        {children}
      </BaseDrawer.Root>
    </>
  );
}

Drawer.Trigger = DrawerTrigger;
Drawer.Content = DrawerContent;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;
Drawer.Title = DrawerTitle;
Drawer.Description = DrawerDescription;
