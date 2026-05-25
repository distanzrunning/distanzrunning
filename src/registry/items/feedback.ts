import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildFeedbackItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/Feedback.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "feedback",
    type: "registry:ui",
    title: "Feedback",
    description:
      "Inline feedback widget — emoji rating plus optional message and email.",
    dependencies: ["react", "react-dom"],
    registryDependencies: ["tokens", "button"],
    files: [
      {
        path: "components/ui/Feedback.tsx",
        type: "registry:ui",
        target: "components/ui/Feedback.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["forms"] },
  };
}
