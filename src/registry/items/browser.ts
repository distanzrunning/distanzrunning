import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildBrowserItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Browser.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "browser",
    type: "registry:ui",
    title: "Browser",
    description:
      "Browser-window chrome wrapper. Frames content as if it lived inside an inset browser viewport.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Browser.tsx",
        type: "registry:ui",
        target: "components/ui/Browser.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["display"] },
  };
}
