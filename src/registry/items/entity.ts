import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildEntityItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Entity.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "entity",
    type: "registry:ui",
    title: "Entity",
    description:
      "Avatar plus name plus optional secondary meta — the canonical mention row.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Entity.tsx",
        type: "registry:ui",
        target: "components/ui/Entity.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["display"] },
  };
}
