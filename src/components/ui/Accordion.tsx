"use client";

// Built on Base UI's Accordion primitive (shadcn install), restyled
// with Distanz tokens. Base UI handles focus, keyboard nav, and
// ARIA wiring; we control the visual treatment.

import { ChevronDown } from "lucide-react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";

import { cn } from "@/lib/utils";

function Accordion({
  className,
  ...props
}: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "border-b border-[color:var(--ds-gray-400)] last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          // Layout
          "group/accordion-trigger flex flex-1 items-center justify-between gap-3 py-4 text-left outline-none cursor-pointer bg-transparent border-0",
          // Type
          "text-button-14 text-[color:var(--ds-gray-1000)]",
          // Hover / focus
          "transition-colors hover:text-[color:var(--ds-gray-900)] focus-visible:text-[color:var(--ds-gray-1000)]",
          // Disabled
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <span className="flex-1">{children}</span>
        <ChevronDown
          data-slot="accordion-trigger-icon"
          aria-hidden="true"
          className="shrink-0 transition-transform duration-200 ease-out text-[color:var(--ds-gray-900)] group-aria-expanded/accordion-trigger:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      // Base UI exposes the natural panel height as --accordion-panel-height.
      // We animate that variable via the inline transition below — Tailwind v3
      // doesn't have data-open utilities so we keep the styling inline + scoped.
      className="overflow-hidden transition-[height] duration-200 ease-out"
      style={{
        height: "var(--accordion-panel-height, 0)",
      }}
      {...props}
    >
      <div
        className={cn(
          "pb-4 text-copy-14 text-[color:var(--ds-gray-900)]",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
};
