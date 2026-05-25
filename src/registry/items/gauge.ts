import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildGaugeItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Gauge.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "gauge",
    type: "registry:ui",
    title: "Gauge",
    description:
      "Circular value indicator. Shows progress in a constrained range with optional thresholds.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Gauge.tsx",
        type: "registry:ui",
        target: "components/ui/Gauge.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["display"] },
  };
}
