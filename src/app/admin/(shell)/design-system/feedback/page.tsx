import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import FeedbackComponent from "../components/content/FeedbackComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Feedback" };

export default function FeedbackPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Feedback"
      pageSubtitle="Gather text feedback with an associated emotion."
      mainSectionId="feedback"
      headerRight={<RegistryInstallButtons slug="feedback" />}
    >
      <FeedbackComponent />
    </ContentWithTOC>
  );
}
