import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SwitchComponent from "../components/content/SwitchComponent";

export const metadata: Metadata = { title: "Switch" };

export default function SwitchPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <SwitchComponent />
    </ContentWithTOC>
  );
}
