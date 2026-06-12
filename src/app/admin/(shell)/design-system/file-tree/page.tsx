import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import FileTreeComponent from "../components/content/FileTreeComponent";

export const metadata: Metadata = { title: "File Tree" };

export default function FileTreePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="File Tree"
      pageSubtitle="Display a hierarchical directory structure with expandable folders and files, useful for illustrating project layouts."
      mainSectionId="file-tree"
    >
      <FileTreeComponent />
    </ContentWithTOC>
  );
}
