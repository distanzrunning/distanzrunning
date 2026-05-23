"use client";

import { useMemo } from "react";
import { navigation, type NavItem } from "./DesignSystemSidebar";
import { FeedbackInline } from "@/components/ui/Feedback";
import { Pagination } from "@/components/ui/Pagination";

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

  return (
    <Pagination
      previous={
        prevPage
          ? { title: prevPage.label, onClick: () => onNavigate(prevPage.id) }
          : undefined
      }
      next={
        nextPage
          ? { title: nextPage.label, onClick: () => onNavigate(nextPage.id) }
          : undefined
      }
      center={<FeedbackInline key={activeSlug} />}
    />
  );
}
