import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import type { ComponentType } from "./DesignSystemSidebar";

/** A distinct subtle hue per atomic tier (smallest → largest). */
const TYPE_VARIANT: Record<ComponentType, BadgeVariant> = {
  Atom: "blue-subtle",
  Molecule: "purple-subtle",
  Organism: "amber-subtle",
};

/**
 * The atomic-design classification badge shown in a component page's header.
 * Replaces the per-page registry install buttons now that the sidebar is a
 * single flat Components list.
 */
export function ComponentTypeBadge({ type }: { type: ComponentType }) {
  return (
    <Badge variant={TYPE_VARIANT[type]} size="lg">
      {type}
    </Badge>
  );
}
