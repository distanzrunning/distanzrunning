import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SearchComponent from "../components/content/SearchComponent";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Search"
      pageSubtitle="A header trigger paired with a modal for navigating between pages."
      mainSectionId="search"
    >
      <SearchComponent />
    </ContentWithTOC>
  );
}
