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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-8">
      {/* Main Content */}
      <article className="col-span-1 lg:col-span-7">{children}</article>

      {/* Table of Contents - Desktop Only */}
      <aside className="hidden lg:block lg:col-span-2">
        <div className="sticky top-40">
          <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
            <h4 className="text-sm font-medium text-textDefault mb-4">
              Contents
            </h4>
            <ol className="space-y-3">
              <li>
                {mainSectionId && (
                  <div className="relative pl-3 group">
                    <span
                      className={`absolute left-0 top-0 bottom-0 w-[2px] transition-opacity ${
                        activeId === mainSectionId
                          ? "bg-electric-pink opacity-100"
                          : "bg-borderNeutral opacity-0 group-hover:opacity-100"
                      }`}
                    />
                    <a
                      href={`#${mainSectionId}`}
                      onClick={() => handleClick(mainSectionId)}
                      className={`text-sm transition-colors block ${
                        activeId === mainSectionId
                          ? "text-textDefault"
                          : "text-textSubtle hover:text-textDefault"
                      }`}
                    >
                      {tocTitle}
                    </a>
                  </div>
                )}
                {!mainSectionId && (
                  <div className="pl-3">
                    <span className="text-sm text-textSubtle block">
                      {tocTitle}
                    </span>
                  </div>
                )}
                <ol
                  className={
                    mainSectionId ? "mt-2 ml-3 space-y-2" : "space-y-2"
                  }
                >
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <div className="relative pl-3 group">
                        <span
                          className={`absolute left-0 top-0 bottom-0 w-[2px] transition-opacity ${
                            activeId === item.id
                              ? "bg-electric-pink opacity-100"
                              : "bg-borderNeutral opacity-0 group-hover:opacity-100"
                          }`}
                        />
                        <a
                          href={`#${item.id}`}
                          onClick={() => handleClick(item.id)}
                          className={`text-sm transition-colors block ${
                            activeId === item.id
                              ? "text-textDefault"
                              : "text-textSubtle hover:text-textDefault"
                          }`}
                        >
                          {item.title}
                        </a>
                      </div>
                      {item.children && (
                        <ol className="mt-2 ml-4 space-y-2">
                          {item.children.map((child) => (
                            <li key={child.id} className="relative pl-3 group">
                              <span
                                className={`absolute left-0 top-0 bottom-0 w-[2px] transition-opacity ${
                                  activeId === child.id
                                    ? "bg-electric-pink opacity-100"
                                    : "bg-borderNeutral opacity-0 group-hover:opacity-100"
                                }`}
                              />
                              <a
                                href={`#${child.id}`}
                                onClick={() => handleClick(child.id)}
                                className={`text-xs transition-colors block ${
                                  activeId === child.id
                                    ? "text-textDefault"
                                    : "text-textSubtle hover:text-textDefault"
                                }`}
                              >
                                {child.title}
                              </a>
                            </li>
                          ))}
                        </ol>
                      )}
                    </li>
                  ))}
                </ol>
              </li>
            </ol>
          </div>
        </div>
      </aside>
    </div>
  );
}
