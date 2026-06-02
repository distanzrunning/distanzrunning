import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import PullQuoteComponent from "../components/content/PullQuoteComponent";

export const metadata: Metadata = { title: "Pull Quote" };

export default function PullQuotePage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <PullQuoteComponent />
    </ContentWithTOC>
  );
}
