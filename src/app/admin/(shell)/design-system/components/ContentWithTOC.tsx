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
import { Grid, GridCell } from "@/components/ui/Grid";
import { componentTypeBySlug } from "./DesignSystemSidebar";
import { ComponentTypeBadge } from "./ComponentTypeBadge";

// Context to allow sections to break out of padding
const SectionContext = createContext<boolean>(false);

// Section component for use within ContentWithTOC
// Uses Grid layout to match Geist design system inner content structure
export function Section({ children }: { children: React.ReactNode }) {
  const isInContentWithTOC = useContext(SectionContext);

  if (isInContentWithTOC) {
    return (
      <Grid
        columns={1}
        rows={1}
        showGuides={false}
        style={{ border: "none", borderBottom: "1px solid hsl(var(--color-borderDefault))" }}
      >
        <GridCell style={{ margin: 0, overflow: "visible" }}>
          {children}
        </GridCell>
      </Grid>
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
  /** Right-aligned slot in the page header — used for install /
      "Open in v0" buttons on components published to the registry. */
  headerRight?: React.ReactNode;
}

// Helper to scan headings from a container. Only the top-level section
// headings (h2, whether direct h2[id] or a wrapper[id] > h2) become TOC
// entries — h3 subheadings (e.g. the Best Practices parts: When to use /
// Behavior / Content / Accessibility) are intentionally excluded so the TOC
// stays a flat list of sections.
function scanHeadingsFromContainer(
  container: HTMLElement,
  mainSectionId?: string,
): TOCItem[] {
  const directHeadings = container.querySelectorAll("h2[id]");
  const wrappedHeadings = container.querySelectorAll("[id]:has(> h2)");

  const headingMap = new Map<string, { title: string; position: number }>();
  const allNodes = Array.from(container.querySelectorAll("*"));

  // Direct h2[id]
  directHeadings.forEach((heading) => {
    const id = heading.id;
    if (mainSectionId && id === mainSectionId) return;
    const title = heading.textContent?.trim() || id;
    headingMap.set(id, { title, position: allNodes.indexOf(heading) });
  });

  // Wrapped headings (e.g. button[id] > h2)
  wrappedHeadings.forEach((wrapper) => {
    const id = wrapper.id;
    if (mainSectionId && id === mainSectionId) return;
    if (headingMap.has(id)) return; // already found as a direct heading
    const h2 = wrapper.querySelector(":scope > h2");
    if (h2) {
      const title = h2.textContent?.trim() || id;
      headingMap.set(id, { title, position: allNodes.indexOf(wrapper) });
    }
  });

  return Array.from(headingMap.entries())
    .sort((a, b) => a[1].position - b[1].position)
    .map(([id, { title }]) => ({ id, title }));
}

// Stable signature of a TOC tree (ids + nesting) so we can skip no-op updates.
function tocSignature(items: TOCItem[]): string {
  return items
    .map(
      (i) =>
        i.id +
        (i.children?.length
          ? `(${i.children.map((c) => c.id).join(",")})`
          : ""),
    )
    .join("|");
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

      // Scan function — only commit when the heading set actually changed. DS
      // demos mutate the DOM constantly (show-code toggles, accordions); without
      // this guard every mutation would replace the TOC array, re-rendering and
      // re-attaching the scroll spy on each interaction (a source of jitter).
      const scan = () => {
        const items = scanHeadingsFromContainer(node, mainSectionId);
        setAutoItems((prev) =>
          tocSignature(prev) === tocSignature(items) ? prev : items,
        );
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
  headerRight,
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

  // Flatten TOC items to get all IDs (the section headings — the page title /
  // mainSectionId is no longer a TOC entry, so it's excluded here too).
  const getAllIds = useCallback(() => {
    const ids: string[] = [];
    tocItems.forEach((item) => {
      ids.push(item.id);
      if (item.children) {
        item.children.forEach((child) => ids.push(child.id));
      }
    });
    return ids;
  }, [tocItems]);

  // Scroll spy — deterministic position check, mirroring the consent/feedback
  // DocToc (which is noticeably more stable than the old IntersectionObserver
  // "visible band" here). On each scroll, the active section is simply the LAST
  // heading whose top has passed the offset line (sticky header + section
  // padding). This is monotonic and height-independent, so it can't flicker
  // between headings or go stale inside a tall section — unlike an IO band that
  // depends on each element's height and a 50%-viewport window.
  useEffect(() => {
    const ids = getAllIds();
    if (ids.length === 0) return;

    const OFFSET = HEADER_HEIGHT + SECTION_PADDING;
    const compute = () => {
      // Don't fight a click-initiated smooth scroll.
      if (isClickScrolling.current) return;
      let active = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= OFFSET + 8) {
          active = id;
        }
      }
      // Highlight only — don't write the hash on scroll (DocToc doesn't
      // either). Writing it would leave the URL at #first-section even at the
      // top of the page, so a reload / re-nav would scroll down to it instead
      // of opening at the top. The hash is only set on an explicit TOC click.
      if (active !== activeIdRef.current) {
        setActiveId(active);
      }
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
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
              ? "border-gray-1000 dark:border-gray-200 text-textDefault font-medium"
              : "border-borderSubtle text-textSubtle hover:text-textDefault hover:border-gray-800 dark:hover:border-gray-600"
          }
          ${isChild ? "text-xs pl-7" : "text-sm pl-4"}
        `}
      >
        {title}
      </a>
    );
  };

  return (
    <div className="flex flex-1 min-h-[calc(100vh-65px)]">
      {/* Main content column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Page Header Section — Grid with no borders, matching Geist */}
        {pageTitle && (
          <Grid
            columns={1}
            rows={1}
            showGuides={false}
            style={{ border: "none", borderBottom: "1px solid hsl(var(--color-borderDefault))" }}
          >
            <GridCell style={{ margin: 0, overflow: "visible" }}>
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {/* Title + the component's atomic-type badge, inline. */}
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <h1
                      id={mainSectionId}
                      className="text-[24px] md:text-[40px] leading-[1.2] font-semibold text-textDefault"
                    >
                      {pageTitle}
                    </h1>
                    {(() => {
                      const autoType = mainSectionId
                        ? componentTypeBySlug[mainSectionId]
                        : undefined;
                      return autoType ? (
                        <ComponentTypeBadge type={autoType} />
                      ) : null;
                    })()}
                  </div>
                  {pageSubtitle && (
                    <p
                      className="text-[16px] md:text-[20px] text-textSubtle"
                      style={{ lineHeight: 1.5 }}
                    >
                      {pageSubtitle}
                    </p>
                  )}
                </div>
                {/* Explicit override (rare) stays on the right. */}
                {headerRight && (
                  <div className="flex-shrink-0">{headerRight}</div>
                )}
              </div>
            </GridCell>
          </Grid>
        )}

        {/* Main Content */}
        <article ref={setContentRef}>
          <SectionContext.Provider value={true}>
            {children}
          </SectionContext.Provider>
        </article>

        {/* Page Pagination - flex-1 to fill remaining space, mt-auto pushes to bottom.
            Derives prev/next from usePathname() — no props needed. */}
        <div className="flex-1 flex flex-col justify-end px-12 pb-8">
          <PagePagination />
        </div>
      </div>

      {/* Table of Contents - Right Sidebar (≥1280px) */}
      <aside className="hidden xl:block w-[260px] flex-shrink-0 border-l border-borderSubtle">
        {tocItems.length > 0 && (
          <div className="sticky top-[65px] max-h-[calc(100vh-65px)] overflow-y-auto px-6 py-6">
            <h4 className="text-heading-14 text-textDefault mb-3">
              {tocTitle}
            </h4>
            <div className="flex flex-col">
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
        )}
      </aside>
    </div>
  );
}
