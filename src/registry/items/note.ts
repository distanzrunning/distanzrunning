import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildNoteItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Note.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "note",
    type: "registry:ui",
    title: "Note",
    description:
      "Inline note with leading icon and optional dismiss. Tonal variants for info / warning / success.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Note.tsx",
        type: "registry:ui",
        target: "components/ui/Note.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["feedback"] },
  };
}
