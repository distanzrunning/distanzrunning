"use client";

// ============================================================================
// NavigationMenu
// ============================================================================
//
// Shadcn-pattern primitive over @radix-ui/react-navigation-menu, styled
// against our DS tokens (ds-gray-*, ds-background-*, ds-focus-ring,
// radius-small) instead of shadcn's default (accent, popover, etc).
// Source transcribed from shadcn's navigation-menu.tsx (new-york-v4)
// and adapted — structure and data-slot attrs kept identical so v0
// reference classnames line up.

import * as React from "react";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  [
    // v0-anatomy: 28px tall, rounded-md, 14px medium / line-height 20.
    // Using arbitrary `text-[14px] leading-[20px]` rather than the
    // project's text-nav token because text-nav is custom and
    // tailwind-merge can't reconcile it against shadcn's baked-in
    // text-sm on NavigationMenuLink — arbitrary values are
    // unambiguously recognised as font-size utilities and win the
    // merge. Default text is gray-900 (medium grey); hover/focus/open
    // lift to gray-1000 (full contrast) so the active item reads
    // loudest, matching v0.
    // rounded-sm = 6px in this project's scale (not 2px like Tailwind
    // default). rounded-md here is 10px, which would overshoot v0.
    "group inline-flex h-7 w-max items-center justify-center rounded-sm px-2 py-1 text-[14px] leading-[20px] font-medium",
    "text-[color:var(--ds-gray-900)]",
    "bg-transparent",
    "transition-all duration-150 outline-none",
    "hover:bg-[color:var(--ds-gray-100)] hover:text-[color:var(--ds-gray-1000)]",
    "focus:bg-[color:var(--ds-gray-100)] focus:text-[color:var(--ds-gray-1000)]",
    "focus-visible:ring-[3px] focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:outline-1",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=open]:bg-[color:var(--ds-gray-100)] data-[state=open]:text-[color:var(--ds-gray-1000)]",
    "data-[active=true]:bg-transparent data-[active=true]:text-[color:var(--ds-gray-1000)]",
  ].join(" "),
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-150 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        // Shared motion props (used in both viewport + no-viewport modes)
        "top-0 left-0 w-full p-2 pr-2.5",
        "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52",
        "data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
        "data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in",
        "data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out",
        "md:absolute md:w-auto",
        // No-viewport mode: each content owns its own popup chrome
        "group-data-[viewport=false]/navigation-menu:top-full",
        "group-data-[viewport=false]/navigation-menu:mt-1.5",
        "group-data-[viewport=false]/navigation-menu:overflow-hidden",
        "group-data-[viewport=false]/navigation-menu:rounded-md",
        "group-data-[viewport=false]/navigation-menu:border",
        "group-data-[viewport=false]/navigation-menu:border-[color:var(--ds-gray-400)]",
        "group-data-[viewport=false]/navigation-menu:bg-[color:var(--ds-background-100)]",
        "group-data-[viewport=false]/navigation-menu:text-[color:var(--ds-gray-1000)]",
        "group-data-[viewport=false]/navigation-menu:shadow-[var(--ds-shadow-menu)]",
        "group-data-[viewport=false]/navigation-menu:duration-200",
        "**:data-[slot=navigation-menu-link]:focus:ring-0",
        "**:data-[slot=navigation-menu-link]:focus:outline-none",
        "group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out",
        "group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0",
        "group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95",
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in",
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0",
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      // left-1/2 + -translate-x-1/2 centres the viewport on the
      // NavigationMenu root (which sizes to its trigger row), so the
      // dropdown sits geometrically centred under all nav labels
      // regardless of which trigger opened it.
      className={cn(
        "absolute top-full left-1/2 -translate-x-1/2 isolate z-50 flex justify-center",
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden",
          // rounded-lg = 12px in this project's scale (matches v0's
          // rounded-xl which lands on 12px with Tailwind defaults).
          "rounded-lg border border-[color:var(--ds-gray-400)]",
          "bg-[color:var(--ds-background-100)] text-[color:var(--ds-gray-1000)]",
          "shadow-[var(--ds-shadow-menu)]",
          "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:zoom-in-90",
          "md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none",
        "text-[color:var(--ds-gray-900)]",
        "hover:bg-[color:var(--ds-gray-100)] hover:text-[color:var(--ds-gray-1000)]",
        "focus:bg-[color:var(--ds-gray-100)] focus:text-[color:var(--ds-gray-1000)]",
        "focus-visible:ring-[3px] focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:outline-1",
        "data-[active=true]:bg-[color:var(--ds-gray-100)] data-[active=true]:text-[color:var(--ds-gray-1000)]",
        "[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        "data-[state=hidden]:animate-out data-[state=hidden]:fade-out",
        "data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className,
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-[color:var(--ds-gray-400)] shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
