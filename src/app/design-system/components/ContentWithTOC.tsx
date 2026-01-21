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
  const clickedRef = useRef(false);
  const initialLoadRef = useRef(true);
  const activeIdRef = useRef<string>("");

  // Keep ref in sync with state for use in scroll handler
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

  // Initialize from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setActiveId(hash);
      // Scroll to the hash element after a brief delay to ensure DOM is ready
      requestAnimationFrame(() => {
        const element = document.getElementById(hash);
        if (element) {
          const elementRect = element.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.scrollY;
          const scrollTarget =
            absoluteElementTop - HEADER_HEIGHT - SECTION_PADDING;

          window.scrollTo({
            top: scrollTarget,
            behavior: "instant",
          });
        }
        // Enable scroll spy after scroll completes
        setTimeout(() => {
          initialLoadRef.current = false;
        }, 100);
      });
    } else {
      // Set first item as active by default
      const ids = getAllIds();
      if (ids.length > 0) {
        setActiveId(ids[0]);
      }
      initialLoadRef.current = false;
    }
  }, [getAllIds]);

  // Function to determine active section based on scroll position
  const updateActiveSection = useCallback(() => {
    const ids = getAllIds();
    if (ids.length === 0) return;

    // Use consistent offset that matches the click scroll target
    // This ensures scroll spy activates sections at the same point they scroll to when clicked
    const scrollOffset = HEADER_HEIGHT + SECTION_PADDING;

    // Check if we're at the bottom of the page
    const isAtBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 10;

    // If at bottom, activate the last section
    if (isAtBottom) {
      const lastId = ids[ids.length - 1];
      if (lastId !== activeIdRef.current) {
        setActiveId(lastId);
        window.history.replaceState(null, "", `#${lastId}`);
      }
      return;
    }

    // Find the current section by checking which section's top is above the scroll offset
    // We iterate through all sections and pick the last one that's above the threshold
    let currentId: string | null = null;

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) {
        // Use getBoundingClientRect for accurate position relative to viewport
        const rect = element.getBoundingClientRect();
        // Check if the element's top is at or above the scroll offset from viewport top
        if (rect.top <= scrollOffset) {
          currentId = id;
        }
      }
    }

    // If no section is above the threshold, use the first one
    if (!currentId) {
      currentId = ids[0];
    }

    if (currentId !== activeIdRef.current) {
      setActiveId(currentId);
      window.history.replaceState(null, "", `#${currentId}`);
    }
  }, [getAllIds]);

  // Scroll spy using scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (clickedRef.current || initialLoadRef.current) return;
      updateActiveSection();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateActiveSection]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveId(id);
    clickedRef.current = true;

    // Update URL
    window.history.pushState(null, "", `#${id}`);
    const element = document.getElementById(id);
    if (element) {
      // Calculate scroll position manually to ensure section top aligns with header bottom
      // Account for section padding above the title so the full section is visible
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.scrollY;
      const scrollTarget = absoluteElementTop - HEADER_HEIGHT - SECTION_PADDING;

      window.scrollTo({
        top: scrollTarget,
        behavior: "smooth",
      });
    }

    // Re-enable scroll spy after scroll completes
    // Use scrollend event if supported, otherwise fall back to timeout
    const enableScrollSpy = () => {
      clickedRef.current = false;
    };

    if ("onscrollend" in window) {
      window.addEventListener("scrollend", enableScrollSpy, { once: true });
      // Fallback timeout in case scrollend doesn't fire
      setTimeout(() => {
        window.removeEventListener("scrollend", enableScrollSpy);
        clickedRef.current = false;
      }, 2000);
    } else {
      // Fallback for browsers without scrollend support
      setTimeout(enableScrollSpy, 1000);
    }
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
