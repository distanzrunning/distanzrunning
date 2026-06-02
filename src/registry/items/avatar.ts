import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildAvatarItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Avatar.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "avatar",
    type: "registry:ui",
    title: "Avatar",
    description:
      "Display a user image with a fallback to initials, an icon, or a brand mark.",
    dependencies: ["react", "lucide-react", "react-icons"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Avatar.tsx",
        type: "registry:ui",
        target: "components/ui/Avatar.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["display"] },
  };
}
