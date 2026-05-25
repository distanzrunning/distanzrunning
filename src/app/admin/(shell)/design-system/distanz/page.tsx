import type { Metadata } from "next";
import PlaceholderContent from "../components/PlaceholderContent";

export const metadata: Metadata = { title: "Distanz" };

export default function DistanzPage() {
  return (
    <div className="p-12">
      <PlaceholderContent title="Brands" subsection="Distanz" />
    </div>
  );
}
