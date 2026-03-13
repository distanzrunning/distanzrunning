"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import PagePagination from "./PagePagination";

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
  activeSlug?: string;
  onNavigate?: (slug: string) => void;
}

// Helper to scan headings from a container
function scanHeadingsFromContainer(
  container: HTMLElement,
  mainSectionId?: string,
): TOCItem[] {
  // Find h2/h3 with IDs directly, OR elements with IDs that contain h2/h3
  const directHeadings = container.querySelectorAll("h2[id], h3[id]");
  const wrappedHeadings = container.querySelectorAll(
    "[id]:has(> h2), [id]:has(> h3)",
  );

  // Build a map of id -> {element, level, title} to avoid duplicates
  const headingMap = new Map<
    string,
    { level: string; title: string; position: number }
  >();

  // Process direct headings (h2[id], h3[id])
  directHeadings.forEach((heading) => {
    const id = heading.id;
    if (mainSectionId && id === mainSectionId) return;

    const title = heading.textContent?.trim() || id;
    const level = heading.tagName.toLowerCase();
    // Use element's position in document for ordering
    const position = Array.from(container.querySelectorAll("*")).indexOf(
      heading,
    );
    headingMap.set(id, { level, title, position });
  });

  // Process wrapped headings (button[id] > h2, etc.)
  wrappedHeadings.forEach((wrapper) => {
    const id = wrapper.id;
    if (mainSectionId && id === mainSectionId) return;
    if (headingMap.has(id)) return; // Already found as direct heading

    const h2 = wrapper.querySelector(":scope > h2");
    const h3 = wrapper.querySelector(":scope > h3");
    const heading = h2 || h3;

    if (heading) {
      const title = heading.textContent?.trim() || id;
      const level = heading.tagName.toLowerCase();
      const position = Array.from(container.querySelectorAll("*")).indexOf(
        wrapper,
      );
      headingMap.set(id, { level, title, position });
    }
  });

  // Sort by document position and build TOC structure
  const sortedEntries = Array.from(headingMap.entries()).sort(
    (a, b) => a[1].position - b[1].position,
  );

  const items: TOCItem[] = [];
  let currentH2: TOCItem | null = null;

  sortedEntries.forEach(([id, { level, title }]) => {
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
}

// Hook to extract TOC items from DOM headings using callback ref
function useAutoTOC(
  manualItems?: TOCItem[],
  mainSectionId?: string,
): [TOCItem[], (node: HTMLElement | null) => void] {
  const [autoItems, setAutoItems] = useState<TOCItem[]>([]);
  const observerRef = useRef<MutationObserver | null>(null);

  const callbackRef = useCallback(
    (node: HTMLElement | null) => {
      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      // If manual items are provided, don't auto-generate
      if (manualItems && manualItems.length > 0) {
        return;
      }

      if (!node) return;

      // Scan function
      const scan = () => {
        const items = scanHeadingsFromContainer(node, mainSectionId);
        setAutoItems(items);
      };

      // Initial scan
      scan();

      // Observe for changes
      observerRef.current = new MutationObserver(scan);
      observerRef.current.observe(node, {
        childList: true,
        subtree: true,
      });
    },
    [manualItems, mainSectionId],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Return manual items if provided, otherwise auto-generated
  const items = manualItems && manualItems.length > 0 ? manualItems : autoItems;
  return [items, callbackRef];
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
  activeSlug,
  onNavigate,
}: ContentWithTOCProps) {
  const [activeId, setActiveId] = useState<string>("");
  const isClickScrolling = useRef(false);
  const activeIdRef = useRef(activeId);
  const contentRef = useRef<HTMLElement | null>(null);
  const hasInitializedFromHash = useRef(false);

  // Auto-generate TOC if not provided
  const [tocItems, tocCallbackRef] = useAutoTOC(manualTocItems, mainSectionId);

  // Combined ref callback
  const setContentRef = useCallback(
    (node: HTMLElement | null) => {
      contentRef.current = node;
      tocCallbackRef(node);
    },
    [tocCallbackRef],
  );

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

    const observer = new IntersectionObserver(
      (entries) => {
        // Don't update during click-initiated scrolling
        if (isClickScrolling.current) return;

        // Build fresh set of currently visible sections from all observed elements
        const visibleSections = new Set<string>();

        // Check all observed elements, not just the ones in this callback
        ids.forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
            const rect = element.getBoundingClientRect();
            const topBoundary = HEADER_HEIGHT + SECTION_PADDING;
            const bottomBoundary = window.innerHeight * 0.5;

            // Element is visible if its top is below header and above 50% viewport
            if (
              rect.top >= topBoundary - rect.height &&
              rect.top < bottomBoundary
            ) {
              visibleSections.add(id);
            }
          }
        });

        // Find the topmost visible section
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

  // Initialize from URL hash or set first item as active (only once)
  useEffect(() => {
    // Only initialize once to prevent jumping when accordions open
    if (hasInitializedFromHash.current) return;

    const ids = getAllIds();
    if (ids.length === 0) return; // Wait for IDs to be available

    const hash = window.location.hash.slice(1);

    if (hash && ids.includes(hash)) {
      setActiveId(hash);
      hasInitializedFromHash.current = true;
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
      hasInitializedFromHash.current = true;
    }
  }, [getAllIds]);

  // Ref to track scroll end handler for cleanup
  const scrollEndHandlerRef = useRef<(() => void) | null>(null);
  const scrollEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const fallbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveId(id);
    isClickScrolling.current = true;

    // Clean up any previous scroll handlers
    if (scrollEndHandlerRef.current) {
      window.removeEventListener("scroll", scrollEndHandlerRef.current);
    }
    if (scrollEndTimeoutRef.current) {
      clearTimeout(scrollEndTimeoutRef.current);
    }
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
    }

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
    const handleScrollEnd = () => {
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current);
      }
      scrollEndTimeoutRef.current = setTimeout(() => {
        isClickScrolling.current = false;
        if (scrollEndHandlerRef.current) {
          window.removeEventListener("scroll", scrollEndHandlerRef.current);
          scrollEndHandlerRef.current = null;
        }
      }, 150);
    };

    scrollEndHandlerRef.current = handleScrollEnd;
    window.addEventListener("scroll", handleScrollEnd, { passive: true });

    // Fallback in case scroll event doesn't fire (e.g., already at position)
    fallbackTimeoutRef.current = setTimeout(() => {
      if (isClickScrolling.current) {
        isClickScrolling.current = false;
        if (scrollEndHandlerRef.current) {
          window.removeEventListener("scroll", scrollEndHandlerRef.current);
          scrollEndHandlerRef.current = null;
        }
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
    <div className="relative flex-1 min-h-[calc(100vh-65px)]">
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
        <article ref={setContentRef}>
          <SectionContext.Provider value={true}>
            {children}
          </SectionContext.Provider>
        </article>

        {/* Page Pagination - flex-1 to fill remaining space, mt-auto pushes to bottom */}
        {activeSlug && onNavigate && (
          <div className="flex-1 flex flex-col justify-end px-12 pb-8">
            <PagePagination activeSlug={activeSlug} onNavigate={onNavigate} />
          </div>
        )}
      </div>

      {/* Table of Contents - fixed overlay on right (≥1280px) */}
      <aside className="hidden xl:block absolute top-0 right-0 w-[260px] h-full border-l border-borderSubtle">
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
