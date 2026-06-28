import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import LoadMoreButtonComponent from "../components/content/LoadMoreButtonComponent";

export const metadata: Metadata = { title: "Load More Button" };

export default function LoadMoreButtonPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Load More Button"
      pageSubtitle="A full-width button used to append more items to a paginated list, with loading and styling variants."
      mainSectionId="load-more-button"
    >
      <LoadMoreButtonComponent />
    </ContentWithTOC>
  );
}
