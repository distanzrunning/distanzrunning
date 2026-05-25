import { buildAvatarItem } from "./items/avatar";
import { buildBadgeItem } from "./items/badge";
import { buildButtonItem } from "./items/button";
import { buildCheckboxItem } from "./items/checkbox";
import { buildGaugeItem } from "./items/gauge";
import { buildInputItem } from "./items/input";
import { buildKeyboardInputItem } from "./items/keyboard-input";
import { buildLoadingDotsItem } from "./items/loading-dots";
import { buildMaterialItem } from "./items/material";
import { buildProgressItem } from "./items/progress";
import { buildRadioItem } from "./items/radio";
import { buildShowMoreItem } from "./items/show-more";
import { buildSkeletonItem } from "./items/skeleton";
import { buildSpinnerItem } from "./items/spinner";
import { buildStatusDotItem } from "./items/status-dot";
import { buildTextareaItem } from "./items/textarea";
import { buildToggleItem } from "./items/toggle";
import { buildTokensItem } from "./items/tokens";
import type { RegistryItem } from "./schema";

// Order matters for the registry index — tokens first, then atoms
// roughly alphabetical, then molecules / organisms as they're added.
//
// Switch is intentionally absent until Tooltip (a molecule) ships,
// since src/components/ui/Switch.tsx imports it.
type Builder = () => Promise<RegistryItem>;

const BUILDERS: Record<string, Builder> = {
  tokens: buildTokensItem,
  avatar: buildAvatarItem,
  badge: buildBadgeItem,
  button: buildButtonItem,
  checkbox: buildCheckboxItem,
  gauge: buildGaugeItem,
  input: buildInputItem,
  "keyboard-input": buildKeyboardInputItem,
  "loading-dots": buildLoadingDotsItem,
  material: buildMaterialItem,
  progress: buildProgressItem,
  radio: buildRadioItem,
  "show-more": buildShowMoreItem,
  skeleton: buildSkeletonItem,
  spinner: buildSpinnerItem,
  "status-dot": buildStatusDotItem,
  textarea: buildTextareaItem,
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
