import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildLogoItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/Logo.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "logo",
    type: "registry:ui",
    title: "Logo",
    description:
      "Inline SVG of the Distanz Running logo mark.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Logo.tsx",
        type: "registry:ui",
        target: "components/ui/Logo.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["brand"] },
  };
}
