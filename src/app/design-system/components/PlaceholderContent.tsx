interface PlaceholderContentProps {
  title: string;
  subsection?: string;
}

export default function PlaceholderContent({
  title,
  subsection,
}: PlaceholderContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[40px] leading-[1.15] font-medium mb-4">
          {title}
        </h1>
        {subsection && <p className="text-lg text-gray-900">{subsection}</p>}
      </div>

      <div className="[background:var(--ds-gray-100)] rounded-lg p-8 border border-gray-400">
        <p className="text-gray-900">Content coming soon...</p>
      </div>
    </div>
  );
}
