"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { navigation, type NavItem } from "./DesignSystemSidebar";
import { FeedbackInline } from "@/components/ui/Feedback";
import { Pagination } from "@/components/ui/Pagination";

function slugFromPathname(pathname: string | null): string | null {
  if (!pathname) return null;
  const match = pathname.match(/^\/admin\/design-system\/([^/?#]+)/);
  return match ? match[1] : null;
}

export default function PagePagination() {
  const pathname = usePathname();
  const activeSlug = slugFromPathname(pathname);

  const { prevPage, nextPage } = useMemo(() => {
    const allPages: NavItem[] = [];
    navigation.forEach((section) => {
      section.items.forEach((item) => {
        if (!item.locked) {
          allPages.push(item);
        }
      });
    });

    if (!activeSlug) return { prevPage: null, nextPage: null };
    const currentIndex = allPages.findIndex((page) => page.id === activeSlug);

    return {
      prevPage: currentIndex > 0 ? allPages[currentIndex - 1] : null,
      nextPage:
        currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null,
    };
  }, [activeSlug]);

  return (
    <Pagination
      className="pt-8"
      previous={
        prevPage
          ? {
              title: prevPage.label,
              href: `/admin/design-system/${prevPage.id}`,
            }
          : undefined
      }
      next={
        nextPage
          ? {
              title: nextPage.label,
              href: `/admin/design-system/${nextPage.id}`,
            }
          : undefined
      }
      center={<FeedbackInline key={activeSlug ?? "none"} />}
    />
  );
}
