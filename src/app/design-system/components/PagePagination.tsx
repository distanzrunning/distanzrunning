"use client";

import { useMemo } from "react";
import { navigation, type NavItem } from "./DesignSystemSidebar";

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
      <div className="flex justify-between items-start pt-8">
        {/* Previous page */}
        {prevPage ? (
          <button
            onClick={() => onNavigate(prevPage.id)}
            aria-label={`Go to previous page: ${prevPage.label}`}
            className="flex flex-col items-start py-1 text-[var(--ds-gray-900)] hover:text-black dark:hover:text-white transition-colors duration-200"
          >
            <span className="text-[0.8125rem] leading-[1.125rem] font-normal mb-0.5">
              Previous
            </span>
            <div className="flex items-center">
              <span className="text-[1rem] leading-[1.5rem] font-medium text-[var(--ds-gray-1000)]">
                {prevPage.label}
              </span>
              <span className="mt-0.5 ml-2">
                <ChevronLeftIcon />
              </span>
            </div>
          </button>
        ) : (
          <div />
        )}

        {/* Next page */}
        {nextPage ? (
          <button
            onClick={() => onNavigate(nextPage.id)}
            aria-label={`Go to next page: ${nextPage.label}`}
            className="flex flex-col items-end py-1 text-[var(--ds-gray-900)] hover:text-black dark:hover:text-white transition-colors duration-200"
          >
            <span className="text-[0.8125rem] leading-[1.125rem] font-normal mb-0.5">
              Next
            </span>
            <div className="flex items-center">
              <span className="text-[1rem] leading-[1.5rem] font-medium text-[var(--ds-gray-1000)] mr-2">
                {nextPage.label}
              </span>
              <span className="mt-0.5">
                <ChevronRightIcon />
              </span>
            </div>
          </button>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
