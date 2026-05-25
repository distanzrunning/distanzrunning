import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ProgressComponent from "../components/content/ProgressComponent";

export const metadata: Metadata = { title: "Progress" };

export default function ProgressPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Progress"
      pageSubtitle="Display progress relative to a limit or related to a task."
      mainSectionId="progress"
    >
      <ProgressComponent />
    </ContentWithTOC>
  );
}
