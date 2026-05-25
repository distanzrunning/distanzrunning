import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ContextCardComponent from "../components/content/ContextCardComponent";

export const metadata: Metadata = { title: "Context Card" };

export default function ContextCardPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Context Card"
      pageSubtitle="Tooltip"
      mainSectionId="context-card"
    >
      <ContextCardComponent />
    </ContentWithTOC>
  );
}
