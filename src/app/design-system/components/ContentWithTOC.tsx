"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";

// Context to allow sections to break out of padding
const SectionContext = createContext<boolean>(false);

// Section component for use within ContentWithTOC
export function Section({ children }: { children: React.ReactNode }) {
  const isInContentWithTOC = useContext(SectionContext);

  if (isInContentWithTOC) {
    // Section with padding, followed by divider below
    return (
      <>
        <div className="p-12">{children}</div>
        <hr className="border-t border-borderNeutral" />
      </>
    );
  }

  // Fallback if used outside ContentWithTOC
  return <div className="py-12">{children}</div>;
}

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
  pageTitle?: string;
  pageSubtitle?: string;
}

// Header height constant (matches top-28 = 112px)
const HEADER_HEIGHT = 112;
// Section padding (p-12 = 48px)
const SECTION_PADDING = 48;

export default function ContentWithTOC({
  children,
  tocTitle,
  tocItems,
  mainSectionId,
  pageTitle,
  pageSubtitle,
}: ContentWithTOCProps) {
  const [activeId, setActiveId] = useState<string>("");
  const isClickScrolling = useRef(false);

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

  // Scroll spy using Intersection Observer
  useEffect(() => {
    const ids = getAllIds();
    if (ids.length === 0) return;

    // Track which sections are currently visible
    const visibleSections = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        // Don't update during click-initiated scrolling
        if (isClickScrolling.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        // Find the topmost visible section
        if (visibleSections.size > 0) {
          let topmostId = "";
          let topmostPosition = Infinity;

          visibleSections.forEach((top, id) => {
            if (top < topmostPosition) {
              topmostPosition = top;
              topmostId = id;
            }
          });

          if (topmostId && topmostId !== activeId) {
            setActiveId(topmostId);
            window.history.replaceState(null, "", `#${topmostId}`);
          }
        }
      },
      {
        rootMargin: `-${HEADER_HEIGHT + SECTION_PADDING}px 0px -50% 0px`,
        threshold: 0,
      },
    );

    // Observe all section elements
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [getAllIds, activeId]);

  // Initialize from URL hash or set first item as active
  useEffect(() => {
    const ids = getAllIds();
    const hash = window.location.hash.slice(1);

    if (hash && ids.includes(hash)) {
      setActiveId(hash);
      // Scroll to the hash element
      requestAnimationFrame(() => {
        const element = document.getElementById(hash);
        if (element) {
          const rect = element.getBoundingClientRect();
          const scrollTarget =
            rect.top + window.scrollY - HEADER_HEIGHT - SECTION_PADDING;
          window.scrollTo({ top: scrollTarget, behavior: "instant" });
        }
      });
    } else if (ids.length > 0) {
      setActiveId(ids[0]);
    }
  }, [getAllIds]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveId(id);
    isClickScrolling.current = true;

    // Update URL
    window.history.pushState(null, "", `#${id}`);

    const element = document.getElementById(id);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTarget =
        rect.top + window.scrollY - HEADER_HEIGHT - SECTION_PADDING;

      window.scrollTo({
        top: scrollTarget,
        behavior: "smooth",
      });
    }

    // Re-enable intersection observer after scroll completes
    setTimeout(() => {
      isClickScrolling.current = false;
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
          flex border-l-2 border-solid py-1.5 pr-4 no-underline transition-all duration-150 ease-out
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
    <div className="flex -m-12">
      {/* Main content column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Page Header Section */}
        {pageTitle && (
          <>
            <div className="p-12">
              <h1
                id={mainSectionId}
                className="text-[24px] md:text-[40px] leading-[1.2] font-semibold text-textDefault mb-3"
              >
                {pageTitle}
              </h1>
              {pageSubtitle && (
                <p
                  className="text-[16px] md:text-[20px] text-textSubtle"
                  style={{ lineHeight: 1.5 }}
                >
                  {pageSubtitle}
                </p>
              )}
            </div>
            {/* Divider below title */}
            <hr className="border-t border-borderNeutral" />
          </>
        )}

        {/* Main Content */}
        <article className="flex-1">
          <SectionContext.Provider value={true}>
            {children}
          </SectionContext.Provider>
        </article>
      </div>

      {/* Table of Contents - Right Sidebar (≥1280px) */}
      <aside className="hidden xl:block w-[260px] flex-shrink-0 border-l border-borderSubtle">
        <div className="sticky top-28 max-h-[calc(100vh-112px)] overflow-y-auto px-6 py-6">
          <h4 className="text-[14px] leading-[20px] font-medium text-textDefault mb-3">
            {tocTitle}
          </h4>
          <div className="flex flex-col">
            {mainSectionId && renderTOCLink(mainSectionId, "Intro")}
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
        </div>
      </aside>
    </div>
  );
}
