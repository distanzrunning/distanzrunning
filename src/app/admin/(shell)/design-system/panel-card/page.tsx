import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import PanelCardComponent from "../components/content/PanelCardComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Panel Card" };

export default function PanelCardPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Panel Card"
      pageSubtitle="Generic bordered card with an optional title, action, and body."
      mainSectionId="panel-card"
      headerRight={<RegistryInstallButtons slug="panel-card" />}
    >
      <PanelCardComponent />
    </ContentWithTOC>
  );
}
