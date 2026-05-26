import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildChartItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Chart.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "chart",
    type: "registry:ui",
    title: "Chart",
    description:
      "Recharts wrapper from shadcn restyled with Distanz tokens. Provides ChartContainer / ChartTooltip / ChartLegend primitives — drop any Recharts shape (Bar, Line, Area, Pie) inside the container and theming + responsive sizing comes for free.",
    dependencies: ["react", "recharts"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Chart.tsx",
        type: "registry:ui",
        target: "components/ui/Chart.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["data", "display"] },
  };
}
