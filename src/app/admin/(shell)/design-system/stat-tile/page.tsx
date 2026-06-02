import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import StatTileComponent from "../components/content/StatTileComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Stat Tile" };

export default function StatTilePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Stat Tile"
      pageSubtitle="Dashboard surface for headline numbers — label, value, optional hint, optional trend chip. Standalone, packed in a Stat Tile Group, or used as a clickable tab."
      mainSectionId="stat-tile"
      headerRight={<RegistryInstallButtons slug="stat-tile" />}
    >
      <StatTileComponent />
    </ContentWithTOC>
  );
}
