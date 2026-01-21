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

export interface TOCItem {
  id: string;
  title: string;
  children?: TOCItem[];
}

interface ContentWithTOCProps {
  children: React.ReactNode;
  tocTitle: string;
  tocItems?: TOCItem[]; // Now optional - will auto-generate if not provided
  mainSectionId?: string; // Optional h2 id
  pageTitle?: string;
  pageSubtitle?: string;
}

// Hook to extract TOC items from DOM headings
function useAutoTOC(
  containerRef: React.RefObject<HTMLElement | null>,
  manualItems?: TOCItem[],
  mainSectionId?: string,
): TOCItem[] {
  const [autoItems, setAutoItems] = useState<TOCItem[]>([]);
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(
    null,
  );

  // Track when the ref is assigned
  useEffect(() => {
    // Poll for the ref to be set (handles initial mount timing)
    const checkRef = () => {
      if (containerRef.current && containerRef.current !== containerElement) {
        setContainerElement(containerRef.current);
      }
    };

    checkRef();
    // Also check after a frame in case ref is set after effect runs
    const frameId = requestAnimationFrame(checkRef);
    return () => cancelAnimationFrame(frameId);
  }, [containerRef, containerElement]);

  useEffect(() => {
    // If manual items are provided, don't auto-generate
    if (manualItems && manualItems.length > 0) {
      return;
    }

    if (!containerElement) return;

    const scanHeadings = () => {
      // Find all h2 and h3 elements with ids
      const headings = containerElement.querySelectorAll("h2[id], h3[id]");
      const items: TOCItem[] = [];
      let currentH2: TOCItem | null = null;

      headings.forEach((heading) => {
        const id = heading.id;
        // Skip the main section id as it's handled separately
        if (mainSectionId && id === mainSectionId) return;

        const title = heading.textContent?.trim() || id;
        const level = heading.tagName.toLowerCase();

        if (level === "h2") {
          currentH2 = { id, title, children: [] };
          items.push(currentH2);
        } else if (level === "h3" && currentH2) {
          currentH2.children = currentH2.children || [];
          currentH2.children.push({ id, title });
        } else if (level === "h3") {
          // h3 without a parent h2, add as top-level
          items.push({ id, title });
        }
      });

      // Clean up empty children arrays
      items.forEach((item) => {
        if (item.children && item.children.length === 0) {
          delete item.children;
        }
      });

      return items;
    };

    // Initial scan
    const items = scanHeadings();
    setAutoItems(items);

    // Also observe for DOM changes in case content loads asynchronously
    const observer = new MutationObserver(() => {
      const newItems = scanHeadings();
      setAutoItems(newItems);
    });

    observer.observe(containerElement, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [containerElement, manualItems, mainSectionId]);

  // Return manual items if provided, otherwise auto-generated
  return manualItems && manualItems.length > 0 ? manualItems : autoItems;
}

// Header height constant (matches top-28 = 112px)
const HEADER_HEIGHT = 112;
// Section padding (p-12 = 48px)
const SECTION_PADDING = 48;

export default function ContentWithTOC({
  children,
  tocTitle,
  tocItems: manualTocItems,
  mainSectionId,
  pageTitle,
  pageSubtitle,
}: ContentWithTOCProps) {
  const [activeId, setActiveId] = useState<string>("");
  const isClickScrolling = useRef(false);
  const activeIdRef = useRef(activeId);
  const contentRef = useRef<HTMLElement>(null);

  // Auto-generate TOC if not provided
  const tocItems = useAutoTOC(contentRef, manualTocItems, mainSectionId);

  // Keep ref in sync with state
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

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

    // Track which sections are currently visible (by id only, not position)
    const visibleSections = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        // Don't update during click-initiated scrolling
        if (isClickScrolling.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        // Find the topmost visible section by checking current positions
        if (visibleSections.size > 0) {
          let topmostId = "";
          let topmostPosition = Infinity;

          visibleSections.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
              const rect = element.getBoundingClientRect();
              if (rect.top < topmostPosition) {
                topmostPosition = rect.top;
                topmostId = id;
              }
            }
          });

          if (topmostId && topmostId !== activeIdRef.current) {
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
  }, [getAllIds]);

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

    // Re-enable intersection observer after scroll settles
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScrollEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isClickScrolling.current = false;
        window.removeEventListener("scroll", handleScrollEnd);
      }, 100);
    };
    window.addEventListener("scroll", handleScrollEnd, { passive: true });
    // Fallback in case scroll event doesn't fire (e.g., already at position)
    setTimeout(() => {
      if (isClickScrolling.current) {
        isClickScrolling.current = false;
        window.removeEventListener("scroll", handleScrollEnd);
      }
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
        <article ref={contentRef} className="flex-1">
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
