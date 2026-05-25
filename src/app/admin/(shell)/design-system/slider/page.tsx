import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SliderComponent from "../components/content/SliderComponent";

export const metadata: Metadata = { title: "Slider" };

export default function SliderPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Slider"
      pageSubtitle="Input to select a value from a given range."
      mainSectionId="slider"
    >
      <SliderComponent />
    </ContentWithTOC>
  );
}
