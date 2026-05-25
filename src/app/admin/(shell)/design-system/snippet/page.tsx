import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SnippetComponent from "../components/content/SnippetComponent";

export const metadata: Metadata = { title: "Snippet" };

export default function SnippetPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Snippet"
      pageSubtitle="Display a snippet of copyable code for the command line."
      mainSectionId="snippet"
    >
      <SnippetComponent />
    </ContentWithTOC>
  );
}
