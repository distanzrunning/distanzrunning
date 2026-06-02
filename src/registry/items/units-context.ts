import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildUnitsContextItem(): Promise<RegistryItem> {
  const source = await loadSource("src/contexts/UnitsContext.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "units-context",
    type: "registry:ui",
    title: "Units Context",
    description:
      "Metric / imperial preference provider + useUnits hook. Used by race-distance UI.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "contexts/UnitsContext.tsx",
        type: "registry:ui",
        target: "contexts/UnitsContext.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["context"] },
  };
}
