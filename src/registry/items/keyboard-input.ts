import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildKeyboardInputItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Kbd.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "keyboard-input",
    type: "registry:ui",
    title: "Keyboard Input",
    description:
      "Stylised representation of a keyboard key. For shortcut hints and inline documentation.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Kbd.tsx",
        type: "registry:ui",
        target: "components/ui/Kbd.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["display"] },
  };
}
