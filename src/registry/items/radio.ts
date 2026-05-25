import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildRadioItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Radio.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "radio",
    type: "registry:ui",
    title: "Radio",
    description:
      "Single-select form input from a group of options. Ships with an accessible RadioGroup container.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Radio.tsx",
        type: "registry:ui",
        target: "components/ui/Radio.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["forms"] },
  };
}
