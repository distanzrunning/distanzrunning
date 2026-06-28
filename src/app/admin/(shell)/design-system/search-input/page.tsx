import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SearchInputComponent from "../components/content/SearchInputComponent";

export const metadata: Metadata = { title: "Search Input" };

export default function SearchInputPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Search Input"
      pageSubtitle="Pre-configured search input with a magnifying glass icon and clear button."
      mainSectionId="search-input"
    >
      <SearchInputComponent />
    </ContentWithTOC>
  );
}
