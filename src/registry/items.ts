import { buildAccordionItem } from "./items/accordion";
import { buildAdSlotItem } from "./items/ad-slot";
import { buildArticleCardItem } from "./items/article-card";
import { buildAvatarItem } from "./items/avatar";
import { buildBadgeItem } from "./items/badge";
import { buildBrowserItem } from "./items/browser";
import { buildButtonItem } from "./items/button";
import { buildCalendarItem } from "./items/calendar";
import { buildCardImageItem } from "./items/card-image";
import { buildCheckboxItem } from "./items/checkbox";
import { buildChoiceboxItem } from "./items/choicebox";
import { buildCodeBlockItem } from "./items/code-block";
import { buildCollapseItem } from "./items/collapse";
import { buildCollapsibleInputItem } from "./items/collapsible-input";
import { buildComboboxItem } from "./items/combobox";
import { buildCommandMenuItem } from "./items/command-menu";
import { buildConsentBannerItem } from "./items/consent-banner";
import { buildConsentContextItem } from "./items/consent-context";
import { buildContextCardItem } from "./items/context-card";
import { buildContextMenuItem } from "./items/context-menu";
import { buildDarkModeProviderItem } from "./items/dark-mode-provider";
import { buildDescriptionItem } from "./items/description";
import { buildDrawerItem } from "./items/drawer";
import { buildEmptyStateItem } from "./items/empty-state";
import { buildEntityItem } from "./items/entity";
import { buildErrorItem } from "./items/error";
import { buildFeedbackItem } from "./items/feedback";
import { buildFooterItem } from "./items/footer";
import { buildGaugeItem } from "./items/gauge";
import { buildGridItem } from "./items/grid";
import { buildIconButtonItem } from "./items/icon-button";
import { buildInputItem } from "./items/input";
import { buildKeyboardInputItem } from "./items/keyboard-input";
import { buildLoadingDotsItem } from "./items/loading-dots";
import { buildLoginItem } from "./items/login";
import { buildLogoItem } from "./items/logo";
import { buildMaterialItem } from "./items/material";
import { buildMenuItem } from "./items/menu";
import { buildMobileNavDrawerItem } from "./items/mobile-nav-drawer";
import { buildModalItem } from "./items/modal";
import { buildMultiSelectItem } from "./items/multi-select";
import { buildNewsletterModalItem } from "./items/newsletter-modal";
import { buildNewsletterSignupItem } from "./items/newsletter-signup";
import { buildNoteItem } from "./items/note";
import { buildPageFrameItem } from "./items/page-frame";
import { buildPaginationItem } from "./items/pagination";
import { buildPanelCardItem } from "./items/panel-card";
import { buildPhoneItem } from "./items/phone";
import { buildPopoverBackdropItem } from "./items/popover-backdrop";
import { buildProgressItem } from "./items/progress";
import { buildProjectBannerItem } from "./items/project-banner";
import { buildRaceCardItem } from "./items/race-card";
import { buildRadioItem } from "./items/radio";
import { buildRelativeTimeCardItem } from "./items/relative-time-card";
import { buildScrollerItem } from "./items/scroller";
import { buildSearchItem } from "./items/search";
import { buildSelectItem } from "./items/select";
import { buildSheetItem } from "./items/sheet";
import { buildShowMoreItem } from "./items/show-more";
import { buildSiteHeaderItem } from "./items/site-header";
import { buildSkeletonItem } from "./items/skeleton";
import { buildSliderItem } from "./items/slider";
import { buildSnippetItem } from "./items/snippet";
import { buildSpinnerItem } from "./items/spinner";
import { buildSplitButtonItem } from "./items/split-button";
import { buildStatCardItem } from "./items/stat-card";
import { buildStatusDotItem } from "./items/status-dot";
import { buildSwitchItem } from "./items/switch";
import { buildTableItem } from "./items/table";
import { buildTabsItem } from "./items/tabs";
import { buildTextareaItem } from "./items/textarea";
import { buildThemeSwitcherItem } from "./items/theme-switcher";
import { buildToastItem } from "./items/toast";
import { buildToggleItem } from "./items/toggle";
import { buildTokensItem } from "./items/tokens";
import { buildTooltipItem } from "./items/tooltip";
import { buildUnitsContextItem } from "./items/units-context";
import { buildWordmarkItem } from "./items/wordmark";
import type { RegistryItem } from "./schema";

// Index order: foundation, then atoms (documented + utility), then
// molecules (documented + utility), then organisms, then templates.
type Builder = () => Promise<RegistryItem>;

const BUILDERS: Record<string, Builder> = {
  // Foundation
  tokens: buildTokensItem,

  // Atoms — documented
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

  // Atoms — utility (not in DS sidebar but required by other items)
  "card-image": buildCardImageItem,
  "consent-context": buildConsentContextItem,
  "dark-mode-provider": buildDarkModeProviderItem,
  "icon-button": buildIconButtonItem,
  logo: buildLogoItem,
  "popover-backdrop": buildPopoverBackdropItem,
  "units-context": buildUnitsContextItem,
  wordmark: buildWordmarkItem,

  // Molecules — documented
  accordion: buildAccordionItem,
  "ad-slot": buildAdSlotItem,
  "article-card": buildArticleCardItem,
  browser: buildBrowserItem,
  calendar: buildCalendarItem,
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
  "race-card": buildRaceCardItem,
  "relative-time-card": buildRelativeTimeCardItem,
  scroller: buildScrollerItem,
  search: buildSearchItem,
  select: buildSelectItem,
  slider: buildSliderItem,
  snippet: buildSnippetItem,
  "split-button": buildSplitButtonItem,
  "stat-card": buildStatCardItem,
  tabs: buildTabsItem,
  "theme-switcher": buildThemeSwitcherItem,
  tooltip: buildTooltipItem,

  // Molecules — utility
  "mobile-nav-drawer": buildMobileNavDrawerItem,

  // Organisms
  "command-menu": buildCommandMenuItem,
  "consent-banner": buildConsentBannerItem,
  "context-menu": buildContextMenuItem,
  drawer: buildDrawerItem,
  feedback: buildFeedbackItem,
  footer: buildFooterItem,
  login: buildLoginItem,
  menu: buildMenuItem,
  modal: buildModalItem,
  "newsletter-modal": buildNewsletterModalItem,
  "newsletter-signup": buildNewsletterSignupItem,
  "project-banner": buildProjectBannerItem,
  sheet: buildSheetItem,
  "site-header": buildSiteHeaderItem,
  table: buildTableItem,
  toast: buildToastItem,

  // Templates
  "page-frame": buildPageFrameItem,
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
