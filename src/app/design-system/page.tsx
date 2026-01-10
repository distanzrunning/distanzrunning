"use client";

import { useRouter } from "next/navigation";
import DesignSystemTopNav from "./components/DesignSystemTopNav";
import IntroductionShowcase from "./components/IntroductionShowcase";

export default function DesignSystemPage() {
  const router = useRouter();

  const handleSectionChange = (section: string | null) => {
    if (section) {
      router.push(`/design-system/${section}/overview`);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0c0c0d] min-h-screen">
      <DesignSystemTopNav
        activeSection={null}
        onSectionChange={handleSectionChange}
      />

      <div className="px-6 min-[1100px]:px-8 py-12">
        <IntroductionShowcase onSectionChange={handleSectionChange} />
      </div>
    </div>
  );
}
