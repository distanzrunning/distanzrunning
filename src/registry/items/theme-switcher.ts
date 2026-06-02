import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildThemeSwitcherItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("ThemeSwitcher.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "theme-switcher",
    type: "registry:ui",
    title: "Theme Switcher",
    description:
      "Light / dark / system theme selector that persists the choice across sessions.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/ThemeSwitcher.tsx",
        type: "registry:ui",
        target: "components/ui/ThemeSwitcher.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["actions"] },
  };
}
