interface IntroductionShowcaseProps {
  onSectionChange: (section: string) => void;
}

export default function IntroductionShowcase({ onSectionChange }: IntroductionShowcaseProps) {
  const sections = [
    { id: 'foundations', label: 'Foundations' },
    { id: 'components', label: 'Components' },
    { id: 'patterns', label: 'Patterns' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div>
        <h1 className="font-serif text-[52px] leading-[1.1] font-medium mb-6">
          Stride Design System
        </h1>
        <p className="text-lg text-textSubtle max-w-3xl mb-12">
          The visual language and interface components that define the experience of Distanz Running's digital products.
        </p>

        {/* Section Links */}
        <div className="flex flex-col gap-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className="text-left text-lg hover:text-electric-pink transition-colors underline"
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
