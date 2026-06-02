import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildButtonItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Button.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "button",
    type: "registry:ui",
    title: "Button",
    description:
      "Primary action element. Variants: default · secondary · tertiary · error · warning. Sizes: tiny · small · medium · large.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Button.tsx",
        type: "registry:ui",
        target: "components/ui/Button.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["forms", "actions"] },
  };
}
