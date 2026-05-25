import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildDarkModeProviderItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/DarkModeProvider.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "dark-mode-provider",
    type: "registry:ui",
    title: "Dark Mode Provider",
    description:
      "Theme provider — manages light / dark / system preference with localStorage persistence.",
    dependencies: ["react", "react-dom", "lucide-react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/DarkModeProvider.tsx",
        type: "registry:ui",
        target: "components/DarkModeProvider.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["context"] },
  };
}
