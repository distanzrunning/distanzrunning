import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildLoginItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/Login.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "login",
    type: "registry:ui",
    title: "Login",
    description:
      "Email + password login form block. Drop into a page or a modal.",
    dependencies: ["react", "lucide-react"],
    registryDependencies: ["tokens", "button", "input"],
    files: [
      {
        path: "components/ui/Login.tsx",
        type: "registry:ui",
        target: "components/ui/Login.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["forms"] },
  };
}
