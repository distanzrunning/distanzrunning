import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildCalendarItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/Calendar.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "calendar",
    type: "registry:ui",
    title: "Calendar",
    description:
      "Date picker with month / year navigation. Built on Radix Popover.",
    dependencies: ["react", "@radix-ui/react-popover"],
    registryDependencies: ["tokens", "switch", "popover-backdrop"],
    files: [
      {
        path: "components/ui/Calendar.tsx",
        type: "registry:ui",
        target: "components/ui/Calendar.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["forms"] },
  };
}
