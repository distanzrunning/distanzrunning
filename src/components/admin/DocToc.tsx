"use client";

import { useEffect, useState } from "react";

// Scroll-spy "On this page" list, styled to match the design-system docs TOC
// (border-l-2 active indicator). Highlights the section currently below the
// sticky admin header (56px) and smooth-scrolls on click.

const SCROLL_OFFSET = 88; // 56px sticky header + breathing room

export function DocToc({ items }: { items: { id: string; label: string }[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const compute = () => {
      let active = items[0]?.id ?? "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= SCROLL_OFFSET + 8) {
          active = item.id;
        }
      }
      setActiveId(active);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [items]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav className="flex flex-col">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={`flex border-l-2 border-solid py-1.5 pl-4 pr-4 text-sm no-underline transition-all duration-150 ease-out ${
              isActive
                ? "border-gray-1000 text-textDefault font-medium dark:border-gray-200"
                : "border-borderSubtle text-textSubtle hover:border-gray-800 hover:text-textDefault dark:hover:border-gray-600"
            }`}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
