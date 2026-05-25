import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildPopoverBackdropItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/PopoverBackdrop.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "popover-backdrop",
    type: "registry:ui",
    title: "Popover Backdrop",
    description:
      "Translucent backdrop portalled behind floating popovers / menus / calendars.",
    dependencies: ["react", "react-dom"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/PopoverBackdrop.tsx",
        type: "registry:ui",
        target: "components/ui/PopoverBackdrop.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["overlay"] },
  };
}
