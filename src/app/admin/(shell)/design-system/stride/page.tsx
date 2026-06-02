import type { Metadata } from "next";
import PlaceholderContent from "../components/PlaceholderContent";

export const metadata: Metadata = { title: "Stride" };

export default function StridePage() {
  return (
    <div className="p-12">
      <PlaceholderContent title="Brands" subsection="Stride" />
    </div>
  );
}
