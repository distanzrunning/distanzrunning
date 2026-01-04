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
        <p className="text-lg text-textSubtle max-w-3xl mb-8">
          The visual language and interface components that define Distanz Running's brand and digital experience.
        </p>

        {/* Divider */}
        <div className="border-t border-borderNeutral mb-8"></div>

        {/* Section Links */}
        <ul className="flex flex-col gap-3 list-disc pl-6">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionChange(section.id)}
                className="text-left text-lg hover:text-electric-pink transition-colors underline"
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
