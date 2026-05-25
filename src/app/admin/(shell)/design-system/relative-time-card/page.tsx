import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import RelativeTimeCardComponent from "../components/content/RelativeTimeCardComponent";

export const metadata: Metadata = { title: "Relative Time Card" };

export default function RelativeTimeCardPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Relative Time Card"
      pageSubtitle="Popover to show a given date in local time."
      mainSectionId="relative-time-card"
    >
      <RelativeTimeCardComponent />
    </ContentWithTOC>
  );
}
