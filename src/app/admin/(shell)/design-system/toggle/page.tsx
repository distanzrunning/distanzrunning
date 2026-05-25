import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ToggleComponent from "../components/content/ToggleComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Toggle" };

export default function TogglePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Toggle"
      pageSubtitle="Displays a boolean value."
      mainSectionId="toggle"
      headerRight={<RegistryInstallButtons slug="toggle" />}
    >
      <ToggleComponent />
    </ContentWithTOC>
  );
}
