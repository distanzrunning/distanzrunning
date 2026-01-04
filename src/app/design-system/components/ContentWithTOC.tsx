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
  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Main Content */}
      <article className="col-span-12 lg:col-span-9">
        {children}
      </article>

      {/* Table of Contents - Desktop Only */}
      <aside className="hidden lg:block col-span-3">
        <div className="sticky top-40">
          <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
            <h4 className="text-sm font-medium text-textDefault mb-4">Contents</h4>
            <ol className="space-y-3">
              <li>
                <a
                  href={`#${tocItems[0]?.id.split('-').slice(0, -1).join('-') || 'section'}`}
                  className="text-sm text-textSubtle hover:text-textDefault transition-colors block"
                >
                  {tocTitle}
                </a>
                <ol className="mt-2 ml-4 space-y-2 border-l border-borderNeutral pl-3">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-sm text-textSubtle hover:text-textDefault transition-colors block"
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
