"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function DesignSystemPage() {
  const router = useRouter();

  const handleSectionClick = (section: string) => {
    router.push(`/design-system/${section}/overview`);
  };

  const sections = [
    {
      id: "foundations",
      title: "Foundations",
      description:
        "Core design principles, colours, typography, spacing, and grid systems that form the foundation of the Stride design language.",
    },
    {
      id: "brand",
      title: "Brand",
      description:
        "Logo usage, wordmarks, and brand identity guidelines for consistent representation across all touchpoints.",
    },
    {
      id: "components",
      title: "Components",
      description:
        "Reusable UI components including buttons, forms, navigation, and feedback elements built on our design foundations.",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#0c0c0d] min-h-screen">
      {/* Hero Section */}
      <div className="px-6 md:px-12 lg:px-16 py-16 md:py-24 max-w-[1200px] mx-auto">
        {/* Logo and title */}
        <div className="flex items-center gap-4 mb-8">
          <Image
            src="/images/distanz_icon_black_round.png"
            alt="Distanz Running"
            width={48}
            height={48}
            className="dark:invert"
          />
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-textDefault">
            Stride Design System
          </h1>
        </div>

        {/* Introduction */}
        <p className="text-lg md:text-xl text-textSubtle max-w-[720px] mb-16">
          A comprehensive design system for building consistent, accessible, and
          beautiful experiences across Distanz Running products.
        </p>

        {/* Section Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className="group text-left p-6 rounded-lg border border-borderSubtle hover:border-borderDefault bg-surfaceSubtle hover:bg-surface transition-all"
            >
              <h2 className="text-xl font-medium text-textDefault mb-2 flex items-center gap-2">
                {section.title}
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h2>
              <p className="text-sm text-textSubtle leading-relaxed">
                {section.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
