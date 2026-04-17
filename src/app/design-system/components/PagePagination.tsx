"use client";

import { useMemo } from "react";
import { navigation, type NavItem } from "./DesignSystemSidebar";
import { FeedbackInline } from "@/components/ui/Feedback";

// Chevron left icon
function ChevronLeftIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ width: 20, height: 20, color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 14.0607L9.96966 13.5303L5.14644 8.7071C4.75592 8.31658 4.75592 7.68341 5.14644 7.29289L9.96966 2.46966L10.5 1.93933L11.5607 2.99999L11.0303 3.53032L6.56065 7.99999L11.0303 12.4697L11.5607 13L10.5 14.0607Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Chevron right icon
function ChevronRightIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ width: 20, height: 20, color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface PagePaginationProps {
  activeSlug: string;
  onNavigate: (slug: string) => void;
}

export default function PagePagination({
  activeSlug,
  onNavigate,
}: PagePaginationProps) {
  // Flatten navigation to get ordered list of all pages
  const { prevPage, nextPage } = useMemo(() => {
    const allPages: NavItem[] = [];
    navigation.forEach((section) => {
      section.items.forEach((item) => {
        if (!item.locked) {
          allPages.push(item);
        }
      });
    });

    const currentIndex = allPages.findIndex((page) => page.id === activeSlug);

    return {
      prevPage: currentIndex > 0 ? allPages[currentIndex - 1] : null,
      nextPage:
        currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null,
    };
  }, [activeSlug]);

  if (!prevPage && !nextPage) return null;

  return (
    <nav aria-label="pagination">
      <div className="flex items-start pt-8 gap-4">
        {/* Previous page */}
        <div className="flex-1 min-w-0">
          {prevPage && (
            <button
              onClick={() => onNavigate(prevPage.id)}
              aria-label={`Go to previous page: ${prevPage.label}`}
              className="block py-1 pl-7 pr-2 text-left text-[var(--ds-gray-900)] hover:text-black dark:hover:text-white transition-colors duration-200"
            >
              <span className="block text-[0.8125rem] leading-[1.125rem] font-normal mb-0.5">
                Previous
              </span>
              <div className="relative flex items-center">
                <span className="text-[1rem] leading-[1.5rem] font-medium text-[var(--ds-gray-1000)]">
                  {prevPage.label}
                </span>
                <span className="absolute left-[-26px] mt-0.5">
                  <ChevronLeftIcon />
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Center: Was this helpful? */}
        <div className="hidden md:flex flex-1 min-w-0 justify-center">
          <FeedbackInline />
        </div>

        {/* Next page */}
        <div className="flex-1 min-w-0 flex justify-end">
          {nextPage && (
            <button
              onClick={() => onNavigate(nextPage.id)}
              aria-label={`Go to next page: ${nextPage.label}`}
              className="block py-1 pl-2 pr-7 text-left text-[var(--ds-gray-900)] hover:text-black dark:hover:text-white transition-colors duration-200"
            >
              <span className="block text-[0.8125rem] leading-[1.125rem] font-normal mb-0.5">
                Next
              </span>
              <div className="relative flex items-center">
                <span className="text-[1rem] leading-[1.5rem] font-medium text-[var(--ds-gray-1000)]">
                  {nextPage.label}
                </span>
                <span className="absolute right-[-26px] mt-0.5">
                  <ChevronRightIcon />
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
