import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import BadgeComponent from "../components/content/BadgeComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Badge" };

export default function BadgePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Badge"
      pageSubtitle="Badges are used to highlight important information or status."
      mainSectionId="badge"
      headerRight={<RegistryInstallButtons slug="badge" />}
    >
      <BadgeComponent />
    </ContentWithTOC>
  );
}
