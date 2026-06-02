import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ScrollerComponent from "../components/content/ScrollerComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Scroller" };

export default function ScrollerPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Scroller"
      pageSubtitle="Display an overflowing list of items."
      mainSectionId="scroller"
      headerRight={<RegistryInstallButtons slug="scroller" />}
    >
      <ScrollerComponent />
    </ContentWithTOC>
  );
}
