"use client";

import { type ReactNode, type ComponentProps } from "react";
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

interface DrawerHeaderProps {
  children: ReactNode;
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
    inset: 0;
    z-index: 50;
    background: var(--ds-overlay-backdrop-color);
    opacity: var(--ds-overlay-backdrop-opacity);
  }

  .ds-drawer-content {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background: var(--ds-background-100);
    outline: none;
  }

  .ds-drawer-handle-area {
    display: flex;
    justify-content: center;
    padding-top: 12px;
    padding-bottom: 12px;
    cursor: grab;
  }

  .ds-drawer-handle-area:active {
    cursor: grabbing;
  }

  .ds-drawer-handle {
    width: 48px;
    height: 6px;
    flex-shrink: 0;
    border-radius: 9999px;
    background: var(--ds-gray-300);
  }

  .ds-drawer-header {
    padding: 0 24px 16px;
  }

  .ds-drawer-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: var(--ds-gray-1000);
    margin: 0;
  }

  .ds-drawer-description {
    font-size: 14px;
    line-height: 20px;
    color: var(--ds-gray-900);
    margin: 4px 0 0;
  }

  .ds-drawer-body {
    padding: 0 24px 24px;
    overflow-y: auto;
    flex: 1;
  }

  .ds-drawer-footer {
    padding: 16px 24px;
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
        <div className="ds-drawer-handle-area">
          <div className="ds-drawer-handle" />
        </div>
        {children}
      </VaulDrawer.Content>
    </VaulDrawer.Portal>
  );
}

function DrawerHeader({ children }: DrawerHeaderProps) {
  return <div className="ds-drawer-header">{children}</div>;
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
Drawer.Header = DrawerHeader;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;
Drawer.Title = DrawerTitle;
Drawer.Description = DrawerDescription;
