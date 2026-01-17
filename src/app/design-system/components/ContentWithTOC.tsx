"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface TOCItem {
  id: string;
  title: string;
  children?: TOCItem[];
}

interface ContentWithTOCProps {
  children: React.ReactNode;
  tocTitle: string;
  tocItems: TOCItem[];
  mainSectionId?: string; // Optional h2 id
}

export default function ContentWithTOC({
  children,
  tocTitle,
  tocItems,
  mainSectionId,
}: ContentWithTOCProps) {
  const [activeId, setActiveId] = useState<string>("");
  const clickedRef = useRef(false);

  // Flatten TOC items to get all IDs
  const getAllIds = useCallback(() => {
    const ids: string[] = [];
    if (mainSectionId) ids.push(mainSectionId);
    tocItems.forEach((item) => {
      ids.push(item.id);
      if (item.children) {
        item.children.forEach((child) => ids.push(child.id));
      }
    });
    return ids;
  }, [tocItems, mainSectionId]);

  // Initialize from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setActiveId(hash);
    } else {
      // Set first item as active by default
      const ids = getAllIds();
      if (ids.length > 0) {
        setActiveId(ids[0]);
      }
    }
  }, [getAllIds]);

  // Scroll spy using scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (clickedRef.current) return;

      const ids = getAllIds();
      const scrollPosition = window.scrollY + 150; // Offset for header

      let currentId = ids[0];

      for (const id of ids) {
        const element = document.getElementById(id);
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            currentId = id;
          }
        }
      }

      if (currentId && currentId !== activeId) {
        setActiveId(currentId);
        window.history.replaceState(null, "", `#${currentId}`);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeId, getAllIds]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveId(id);
    clickedRef.current = true;

    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 140; // Account for sticky header + gap above section
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      window.history.pushState(null, "", `#${id}`);
    }

    // Re-enable scroll spy after scroll completes
    setTimeout(() => {
      clickedRef.current = false;
    }, 1000);
  };

  // Helper to render a TOC link with left border indicator
  const renderTOCLink = (
    id: string,
    title: string,
    isChild: boolean = false,
  ) => {
    const isActive = activeId === id;
    return (
      <a
        href={`#${id}`}
        onClick={(e) => handleClick(e, id)}
        className={`
          flex border-l-2 border-solid py-1.5 pr-4 no-underline transition-colors
          ${
            isActive
              ? "border-asphalt-10 dark:border-asphalt-95 text-textDefault font-medium"
              : "border-borderSubtle text-textSubtle hover:text-textDefault hover:border-asphalt-40 dark:hover:border-asphalt-60"
          }
          ${isChild ? "text-xs pl-7" : "text-sm pl-4"}
        `}
      >
        {title}
      </a>
    );
  };

  return (
    <div className="grid grid-cols-1 min-[960px]:grid-cols-9 gap-8">
      {/* Main Content */}
      <article className="col-span-1 min-[960px]:col-span-7">
        {children}
      </article>

      {/* Table of Contents - Desktop Only (≥960px) */}
      <aside className="hidden min-[960px]:block min-[960px]:col-span-2">
        <div className="sticky top-40">
          <nav className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <h4 className="text-sm font-medium text-textDefault mb-3 px-4">
              {tocTitle}
            </h4>
            <div className="flex flex-col">
              {mainSectionId && renderTOCLink(mainSectionId, tocTitle)}
              {tocItems.map((item) => (
                <div key={item.id}>
                  {renderTOCLink(item.id, item.title)}
                  {item.children &&
                    item.children.map((child) => (
                      <div key={child.id}>
                        {renderTOCLink(child.id, child.title, true)}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
}
