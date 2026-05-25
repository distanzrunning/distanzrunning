import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildMobileNavDrawerItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/MobileNavDrawer.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "mobile-nav-drawer",
    type: "registry:ui",
    title: "Mobile Nav Drawer",
    description:
      "Off-canvas mobile navigation drawer with Sanity-backed menu items.",
    dependencies: ["react", "next", "@radix-ui/react-dialog", "@sanity/image-url"],
    registryDependencies: ["tokens", "dark-mode-provider"],
    files: [
      {
        path: "components/ui/MobileNavDrawer.tsx",
        type: "registry:ui",
        target: "components/ui/MobileNavDrawer.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["navigation"] },
  };
}
