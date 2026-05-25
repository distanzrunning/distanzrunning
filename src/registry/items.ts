import { buildBadgeItem } from "./items/badge";
import { buildButtonItem } from "./items/button";
import { buildInputItem } from "./items/input";
import { buildSkeletonItem } from "./items/skeleton";
import { buildSpinnerItem } from "./items/spinner";
import { buildToggleItem } from "./items/toggle";
import { buildTokensItem } from "./items/tokens";
import type { RegistryItem } from "./schema";

// Order matters for the registry index — keep tokens first so the
// dependency story reads top-down (everything else needs tokens).
type Builder = () => Promise<RegistryItem>;

const BUILDERS: Record<string, Builder> = {
  tokens: buildTokensItem,
  button: buildButtonItem,
  input: buildInputItem,
  badge: buildBadgeItem,
  spinner: buildSpinnerItem,
  skeleton: buildSkeletonItem,
  toggle: buildToggleItem,
};

export function listRegistryItemNames(): string[] {
  return Object.keys(BUILDERS);
}

export function listRegistryItems(): Promise<RegistryItem[]> {
  return Promise.all(Object.values(BUILDERS).map((build) => build()));
}

export async function getRegistryItem(
  name: string,
): Promise<RegistryItem | undefined> {
  const build = BUILDERS[name];
  return build ? build() : undefined;
}
