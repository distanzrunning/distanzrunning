import { buildAdSlotItem } from "./items/ad-slot";
import { buildAvatarItem } from "./items/avatar";
import { buildBadgeItem } from "./items/badge";
import { buildBrowserItem } from "./items/browser";
import { buildButtonItem } from "./items/button";
import { buildCheckboxItem } from "./items/checkbox";
import { buildChoiceboxItem } from "./items/choicebox";
import { buildCodeBlockItem } from "./items/code-block";
import { buildCollapseItem } from "./items/collapse";
import { buildCollapsibleInputItem } from "./items/collapsible-input";
import { buildComboboxItem } from "./items/combobox";
import { buildContextCardItem } from "./items/context-card";
import { buildDescriptionItem } from "./items/description";
import { buildEmptyStateItem } from "./items/empty-state";
import { buildEntityItem } from "./items/entity";
import { buildErrorItem } from "./items/error";
import { buildGaugeItem } from "./items/gauge";
import { buildGridItem } from "./items/grid";
import { buildInputItem } from "./items/input";
import { buildKeyboardInputItem } from "./items/keyboard-input";
import { buildLoadingDotsItem } from "./items/loading-dots";
import { buildMaterialItem } from "./items/material";
import { buildMultiSelectItem } from "./items/multi-select";
import { buildNoteItem } from "./items/note";
import { buildPaginationItem } from "./items/pagination";
import { buildPanelCardItem } from "./items/panel-card";
import { buildPhoneItem } from "./items/phone";
import { buildProgressItem } from "./items/progress";
import { buildRadioItem } from "./items/radio";
import { buildRelativeTimeCardItem } from "./items/relative-time-card";
import { buildScrollerItem } from "./items/scroller";
import { buildSelectItem } from "./items/select";
import { buildShowMoreItem } from "./items/show-more";
import { buildSkeletonItem } from "./items/skeleton";
import { buildSliderItem } from "./items/slider";
import { buildSnippetItem } from "./items/snippet";
import { buildSpinnerItem } from "./items/spinner";
import { buildSplitButtonItem } from "./items/split-button";
import { buildStatCardItem } from "./items/stat-card";
import { buildStatusDotItem } from "./items/status-dot";
import { buildSwitchItem } from "./items/switch";
import { buildTabsItem } from "./items/tabs";
import { buildTextareaItem } from "./items/textarea";
import { buildThemeSwitcherItem } from "./items/theme-switcher";
import { buildToggleItem } from "./items/toggle";
import { buildTokensItem } from "./items/tokens";
import { buildTooltipItem } from "./items/tooltip";
import type { RegistryItem } from "./schema";

// Holdouts (not yet in BUILDERS):
//   article-card / race-card — depend on internal CardImage atom +
//     (RaceCard) UnitsContext, not yet adapted for standalone install.
//   calendar — depends on Switch + PopoverBackdrop; the latter isn't
//     part of the documented DS yet.
//   search — no canonical Search.tsx component yet.
type Builder = () => Promise<RegistryItem>;

const BUILDERS: Record<string, Builder> = {
  tokens: buildTokensItem,
  // Atoms
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
  switch: buildSwitchItem,
  textarea: buildTextareaItem,
  toggle: buildToggleItem,
  // Molecules
  "ad-slot": buildAdSlotItem,
  browser: buildBrowserItem,
  choicebox: buildChoiceboxItem,
  "code-block": buildCodeBlockItem,
  collapse: buildCollapseItem,
  "collapsible-input": buildCollapsibleInputItem,
  combobox: buildComboboxItem,
  "context-card": buildContextCardItem,
  description: buildDescriptionItem,
  "empty-state": buildEmptyStateItem,
  entity: buildEntityItem,
  error: buildErrorItem,
  grid: buildGridItem,
  "multi-select": buildMultiSelectItem,
  note: buildNoteItem,
  pagination: buildPaginationItem,
  "panel-card": buildPanelCardItem,
  phone: buildPhoneItem,
  "relative-time-card": buildRelativeTimeCardItem,
  scroller: buildScrollerItem,
  select: buildSelectItem,
  slider: buildSliderItem,
  snippet: buildSnippetItem,
  "split-button": buildSplitButtonItem,
  "stat-card": buildStatCardItem,
  tabs: buildTabsItem,
  "theme-switcher": buildThemeSwitcherItem,
  tooltip: buildTooltipItem,
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
