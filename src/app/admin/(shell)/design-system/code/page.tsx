import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import CodeComponent from "../components/content/CodeComponent";

export const metadata: Metadata = { title: "Code" };

export default function CodePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Code"
      pageSubtitle="Display a snippet of code with syntax highlighting."
      mainSectionId="code"
    >
      <CodeComponent />
    </ContentWithTOC>
  );
}
