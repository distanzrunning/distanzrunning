import type { Metadata } from "next";

import ContentWithTOC from "../components/ContentWithTOC";
import NumberTickerComponent from "../components/content/NumberTickerComponent";

export const metadata: Metadata = { title: "Number Ticker" };

export default function NumberTickerPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Number Ticker"
      pageSubtitle="Tweens between numeric values when the value prop changes. Used on dashboard tiles so swapping date ranges visibly ticks the counts up / down instead of flashing a skeleton."
      mainSectionId="number-ticker"
    >
      <NumberTickerComponent />
    </ContentWithTOC>
  );
}
