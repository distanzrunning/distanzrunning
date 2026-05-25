import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import PaginationComponent from "../components/content/PaginationComponent";

export const metadata: Metadata = { title: "Pagination" };

export default function PaginationPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Pagination"
      pageSubtitle="Navigate between pages with previous and next links."
      mainSectionId="pagination"
    >
      <PaginationComponent />
    </ContentWithTOC>
  );
}
