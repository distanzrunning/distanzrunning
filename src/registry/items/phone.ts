import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildPhoneItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Phone.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "phone",
    type: "registry:ui",
    title: "Phone",
    description:
      "Mobile-device chrome wrapper. Frames content as if it lived inside a phone viewport.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Phone.tsx",
        type: "registry:ui",
        target: "components/ui/Phone.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["display"] },
  };
}
