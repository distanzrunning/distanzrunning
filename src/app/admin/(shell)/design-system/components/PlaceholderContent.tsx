interface PlaceholderContentProps {
  title: string;
  subsection?: string;
}

export default function PlaceholderContent({ title, subsection }: PlaceholderContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[40px] leading-[1.15] font-medium mb-4">
          {title}
        </h1>
        {subsection && (
          <p className="text-lg text-textSubtle">
            {subsection}
          </p>
        )}
      </div>

      <div className="bg-surface-subtle rounded-lg p-8 border border-borderNeutral">
        <p className="text-textSubtle">
          Content coming soon...
        </p>
      </div>
    </div>
  );
}
