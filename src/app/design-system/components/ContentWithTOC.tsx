'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  title: string;
}

interface ContentWithTOCProps {
  children: React.ReactNode;
  tocTitle: string;
  tocItems: TOCItem[];
}

export default function ContentWithTOC({ children, tocTitle, tocItems }: ContentWithTOCProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    // Observe all headings with IDs
    const headings = document.querySelectorAll('h2[id], h3[id]');
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  const mainSectionId = tocItems[0]?.id.split('-').slice(0, -1).join('-') || 'section';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-8">
      {/* Main Content */}
      <article className="col-span-1 lg:col-span-7">
        {children}
      </article>

      {/* Table of Contents - Desktop Only */}
      <aside className="hidden lg:block lg:col-span-2">
        <div className="sticky top-40">
          <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
            <h4 className="text-sm font-medium text-textDefault mb-4">Contents</h4>
            <ol className="space-y-3">
              <li>
                <a
                  href={`#${mainSectionId}`}
                  className="text-sm text-textSubtle hover:text-textDefault transition-colors block"
                >
                  {tocTitle}
                </a>
                <ol className="mt-2 space-y-2">
                  {tocItems.map((item) => (
                    <li key={item.id} className="relative pl-3 group">
                      <span
                        className={`absolute left-0 top-0 bottom-0 w-[2px] transition-opacity ${
                          activeId === item.id ? 'bg-accent opacity-100' : 'bg-borderNeutral opacity-0 group-hover:opacity-100'
                        }`}
                      />
                      <a
                        href={`#${item.id}`}
                        className={`text-sm transition-colors block ${
                          activeId === item.id
                            ? 'text-textDefault'
                            : 'text-textSubtle hover:text-textDefault'
                        }`}
                      >
                        {item.title}
                      </a>
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
