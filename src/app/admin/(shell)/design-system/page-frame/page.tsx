import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import PageFrameComponent from "../components/content/PageFrameComponent";

export const metadata: Metadata = { title: "Page Frame" };

export default function PageFramePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Page Frame"
      pageSubtitle="The inset framed surface that wraps the body of every public page. Sits between the navbar and the footer."
      mainSectionId="overview"
    >
      <PageFrameComponent />
    </ContentWithTOC>
  );
}
