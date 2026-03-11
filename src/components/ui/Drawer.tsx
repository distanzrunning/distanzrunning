"use client";

import { type ReactNode } from "react";
import { Drawer as VaulDrawer } from "vaul";

// ============================================================================
// Types
// ============================================================================

export interface DrawerProps {
  children: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether to scale background when drawer opens */
  shouldScaleBackground?: boolean;
  /** Direction from which the drawer slides in */
  direction?: "top" | "right" | "bottom" | "left";
}

interface DrawerTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

interface DrawerContentProps {
  children: ReactNode;
  /** Custom height for the drawer. Defaults to auto. */
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

// ============================================================================
// Styles — Geist computed values, scoped to .ds-drawer-*
// ============================================================================

const DRAWER_CSS = `
  .ds-drawer-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 4999;
    background-color: rgba(0, 0, 0, 0.4);
    pointer-events: none;
    animation: ds-drawer-overlay-fadeIn 400ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
  }

  .ds-drawer-overlay[data-state="closed"] {
    animation: ds-drawer-overlay-fadeOut 400ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
  }

  @keyframes ds-drawer-overlay-fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes ds-drawer-overlay-fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  .ds-drawer-content {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 4999;
    display: flex;
    flex-direction: column;
    border-top-left-radius: var(--ds-radius-small);
    border-top-right-radius: var(--ds-radius-small);
    border: none;
    background-color: var(--ds-background-100);
    color: var(--ds-gray-1000);
    box-shadow: var(--ds-shadow-menu), var(--ds-gray-100) 0px 0px 0px 1px;
    max-width: 100%;
    max-height: 80vh;
    min-height: 31px;
    outline: none;
    pointer-events: auto;
    user-select: none;
    will-change: transform;
    touch-action: none;
    overscroll-behavior: none;
    transition: transform 500ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  .ds-drawer-inner {
    background-color: var(--ds-background-100);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow-y: auto;
    overscroll-behavior: none;
    user-select: none;
    pointer-events: auto;
    z-index: 1;
    outline: none;
  }

  .ds-drawer-body {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: var(--ds-space-2x);
    flex: 0 1 auto;
    padding: var(--ds-space-12x);
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
    background: var(--ds-background-200);
  }
`;

// ============================================================================
// Compound Components
// ============================================================================

function DrawerTrigger({ children, asChild = true }: DrawerTriggerProps) {
  return <VaulDrawer.Trigger asChild={asChild}>{children}</VaulDrawer.Trigger>;
}

function DrawerContent({ children, height }: DrawerContentProps) {
  return (
    <VaulDrawer.Portal>
      <VaulDrawer.Overlay className="ds-drawer-overlay" />
      <VaulDrawer.Content
        className="ds-drawer-content"
        style={height ? { height } : undefined}
      >
        <div className="ds-drawer-inner">
          {children}
        </div>
      </VaulDrawer.Content>
    </VaulDrawer.Portal>
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
    <VaulDrawer.Title className="ds-drawer-title">{children}</VaulDrawer.Title>
  );
}

function DrawerDescription({ children }: DrawerDescriptionProps) {
  return (
    <VaulDrawer.Description className="ds-drawer-description">
      {children}
    </VaulDrawer.Description>
  );
}

// ============================================================================
// Drawer
// ============================================================================

export function Drawer({
  children,
  open,
  onOpenChange,
  shouldScaleBackground,
  direction,
}: DrawerProps) {
  return (
    <>
      <style>{DRAWER_CSS}</style>
      <VaulDrawer.Root
        open={open}
        onOpenChange={onOpenChange}
        shouldScaleBackground={shouldScaleBackground}
        direction={direction}
      >
        {children}
      </VaulDrawer.Root>
    </>
  );
}

Drawer.Trigger = DrawerTrigger;
Drawer.Content = DrawerContent;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;
Drawer.Title = DrawerTitle;
Drawer.Description = DrawerDescription;
