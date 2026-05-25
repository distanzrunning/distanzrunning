import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildAccordionItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Accordion.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "accordion",
    type: "registry:ui",
    title: "Accordion",
    description:
      "Disclosure list built on Base UI's Accordion primitive (the same shadcn ships from), restyled with Distanz tokens. Single- or multi-panel open modes.",
    dependencies: ["react", "@base-ui/react", "lucide-react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Accordion.tsx",
        type: "registry:ui",
        target: "components/ui/Accordion.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["disclosure"] },
  };
}
