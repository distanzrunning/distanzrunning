"use client";

import { useEffect, useState, useRef } from "react";

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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const clickedRef = useRef(false);

  // Initialize from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove # from hash
    if (hash) {
      setActiveId(hash);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Don't update if user just clicked a link
        if (clickedRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            // Update URL hash without scrolling
            window.history.replaceState(null, "", `#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" },
    );

    observerRef.current = observer;

    // Observe all headings with IDs
    const headings = document.querySelectorAll("h2[id], h3[id]");
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    setActiveId(id);
    clickedRef.current = true;

    // Re-enable observer after scroll completes
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
        onClick={() => handleClick(id)}
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
