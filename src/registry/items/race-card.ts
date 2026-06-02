import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildRaceCardItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/RaceCard.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "race-card",
    type: "registry:ui",
    title: "Race Card",
    description:
      "Race summary card — image + title + location + date. Distance auto-formats via units-context.",
    dependencies: ["react", "next", "date-fns"],
    registryDependencies: ["tokens", "badge", "card-image", "units-context"],
    files: [
      {
        path: "components/RaceCard.tsx",
        type: "registry:ui",
        target: "components/RaceCard.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["display"] },
  };
}
