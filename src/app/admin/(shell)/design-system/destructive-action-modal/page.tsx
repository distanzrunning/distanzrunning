import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import DestructiveActionModalComponent from "../components/content/DestructiveActionModalComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Destructive Action Modal" };

export default function DestructiveActionModalPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Destructive Action Modal"
      pageSubtitle="Confirm destructive actions with a required type-to-confirm gate and an optional irreversibility band."
      mainSectionId="destructive-action-modal"
      headerRight={<RegistryInstallButtons slug="destructive-action-modal" />}
    >
      <DestructiveActionModalComponent />
    </ContentWithTOC>
  );
}
