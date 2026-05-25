import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import LineHeight from "../components/content/LineHeight";

export const metadata: Metadata = { title: "Line Height" };

export default function LineHeightPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <LineHeight />
    </ContentWithTOC>
  );
}
