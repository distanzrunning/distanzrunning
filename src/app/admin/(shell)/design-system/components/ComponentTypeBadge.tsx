import { Badge } from "@/components/ui/Badge";
import type { ComponentType } from "./DesignSystemSidebar";

/**
 * The atomic-design classification badge shown in a component page's header.
 * Replaces the per-page registry install buttons now that the sidebar is a
 * single flat Components list.
 */
export function ComponentTypeBadge({ type }: { type: ComponentType }) {
  return (
    <Badge variant="gray-subtle" size="sm">
      {type}
    </Badge>
  );
}
