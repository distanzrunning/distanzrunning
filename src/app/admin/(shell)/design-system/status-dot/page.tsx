import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import StatusDotComponent from "../components/content/StatusDotComponent";

export const metadata: Metadata = { title: "Status Dot" };

export default function StatusDotPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Status Dot"
      pageSubtitle="Display an indicator of deployment status."
      mainSectionId="status-dot"
    >
      <StatusDotComponent />
    </ContentWithTOC>
  );
}
