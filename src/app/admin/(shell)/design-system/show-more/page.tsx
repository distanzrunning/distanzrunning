import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ShowMoreComponent from "../components/content/ShowMoreComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Show More" };

export default function ShowMorePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Show more"
      pageSubtitle="Styling component to show expanded or collapsed content."
      mainSectionId="show-more"
      headerRight={<RegistryInstallButtons slug="show-more" />}
    >
      <ShowMoreComponent />
    </ContentWithTOC>
  );
}
