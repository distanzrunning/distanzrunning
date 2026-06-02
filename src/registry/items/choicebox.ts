import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildChoiceboxItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Choicebox.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "choicebox",
    type: "registry:ui",
    title: "Choicebox",
    description:
      "Large card-style radio that pairs an option label with descriptive content.",
    dependencies: ["react"],
    registryDependencies: ["tokens", "checkbox"],
    files: [
      {
        path: "components/ui/Choicebox.tsx",
        type: "registry:ui",
        target: "components/ui/Choicebox.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["forms"] },
  };
}
