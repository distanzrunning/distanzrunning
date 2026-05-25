import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildPageFrameItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/PageFrame.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "page-frame",
    type: "registry:ui",
    title: "Page Frame",
    description:
      "Inset framed page surface. Wraps every public page main, exposes @container/page-frame queries.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/PageFrame.tsx",
        type: "registry:ui",
        target: "components/ui/PageFrame.tsx",
        content: source,
      },
    ],
    meta: { layer: "template", categories: ["layout"] },
  };
}
