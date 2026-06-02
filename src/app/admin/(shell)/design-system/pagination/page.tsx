import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import PaginationComponent from "../components/content/PaginationComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Pagination" };

export default function PaginationPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Pagination"
      pageSubtitle="Navigate between pages with previous and next links."
      mainSectionId="pagination"
      headerRight={<RegistryInstallButtons slug="pagination" />}
    >
      <PaginationComponent />
    </ContentWithTOC>
  );
}
