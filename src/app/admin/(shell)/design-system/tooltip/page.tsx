import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import TooltipComponent from "../components/content/TooltipComponent";

export const metadata: Metadata = { title: "Tooltip" };

export default function TooltipPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <TooltipComponent />
    </ContentWithTOC>
  );
}
