'use client';

import { typography, fonts, fontWeights } from '@/styles/design-tokens';

interface TypeSpecProps {
  label: string;
  size: string;
  weight: string;
  lineHeight: string;
  letterSpacing?: string;
}

function TypeSpec({ label, size, weight, lineHeight, letterSpacing }: TypeSpecProps) {
  return (
    <div className="flex items-baseline gap-4 text-xs text-textSubtler font-mono border-t border-borderNeutralSubtle pt-2 mt-2">
      <span className="w-20">{size}</span>
      <span className="w-20">{weight}</span>
      <span className="w-20">{lineHeight}</span>
      {letterSpacing && <span>{letterSpacing}</span>}
    </div>
  );
}

export default function TypographyShowcase() {
  return (
    <div className="space-y-16">
      {/* Font Families */}
      <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
        <h3 className="text-lg font-semibold mb-4">Font Families</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-textSubtle mb-2">Sans-serif (Inter Variable)</p>
            <p className="text-2xl font-sans">The quick brown fox jumps over the lazy dog</p>
            <code className="text-xs text-textSubtler font-mono">{fonts.sans}</code>
          </div>
          <div>
            <p className="text-sm text-textSubtle mb-2">Serif (EB Garamond)</p>
            <p className="text-2xl font-serif">The quick brown fox jumps over the lazy dog</p>
            <code className="text-xs text-textSubtler font-mono">{fonts.serif}</code>
          </div>
        </div>
      </div>

      {/* News Typography (Inter) */}
      <div>
        <h3 className="text-xl font-semibold mb-6">News Typography - Inter Variable</h3>
        <p className="text-textSubtle mb-8">Used for news articles, UI elements, and navigation</p>

        <div className="space-y-8">
          <div>
            <h1 className="text-[68px] leading-[1.05] font-bold mb-2">News H1</h1>
            <TypeSpec label="News H1" size="68px" weight="600" lineHeight="1.05" letterSpacing="-0.005em" />
          </div>

          <div>
            <h2 className="text-[58px] leading-[1.05] font-bold mb-2">News H2</h2>
            <TypeSpec label="News H2" size="58px" weight="600" lineHeight="1.05" letterSpacing="-0.03em" />
          </div>

          <div>
            <h3 className="text-[44px] leading-[1.1] font-bold mb-2">News H3</h3>
            <TypeSpec label="News H3" size="44px" weight="600" lineHeight="1.1" letterSpacing="-0.02em" />
          </div>

          <div>
            <h4 className="text-[38px] leading-[1.1] font-bold mb-2">News H4</h4>
            <TypeSpec label="News H4" size="38px" weight="600" lineHeight="1.1" letterSpacing="-0.01em" />
          </div>

          <div>
            <h5 className="text-[28px] leading-[1.15] font-bold mb-2">News H5</h5>
            <TypeSpec label="News H5" size="28px" weight="600" lineHeight="1.15" />
          </div>

          <div>
            <h6 className="text-[24px] leading-[1.3] font-bold mb-2">News H6</h6>
            <TypeSpec label="News H6" size="24px" weight="600" lineHeight="1.3" />
          </div>

          <div>
            <p className="text-[19px] leading-[1.3] mb-2">News Body XL - Lead paragraph text that introduces the article with slightly larger sizing for emphasis and readability.</p>
            <TypeSpec label="Body XL" size="19px" weight="400" lineHeight="1.3" />
          </div>

          <div>
            <p className="text-[15px] leading-[1.3] mb-2">News Body - The standard body text used throughout news articles. Perfect for paragraphs, lists, and general content. Optimized for readability at this size with proper line height.</p>
            <TypeSpec label="Body" size="15px" weight="400" lineHeight="1.3" />
          </div>

          <div>
            <p className="text-[13px] leading-[1.25] mb-2">News Caption - Used for image captions, photo credits, and supplementary information.</p>
            <TypeSpec label="Caption" size="13px" weight="400" lineHeight="1.25" />
          </div>

          <div>
            <p className="text-[11px] leading-[1.25] font-medium uppercase tracking-wide mb-2">News Overline - Labels, Tags, Category Names</p>
            <TypeSpec label="Overline" size="11px" weight="500" lineHeight="1.25" />
          </div>
        </div>
      </div>

      {/* Feature Typography (EB Garamond) */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Feature Typography - EB Garamond</h3>
        <p className="text-textSubtle mb-8">Used for long-form content, essays, and feature articles</p>

        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-[72px] leading-[1.05] font-medium mb-2">Feature H1</h1>
            <TypeSpec label="Feature H1" size="72px" weight="500" lineHeight="1.05" letterSpacing="-0.01em" />
          </div>

          <div>
            <h2 className="font-serif text-[56px] leading-[1.1] font-medium mb-2">Feature H2</h2>
            <TypeSpec label="Feature H2" size="56px" weight="500" lineHeight="1.1" letterSpacing="-0.01em" />
          </div>

          <div>
            <h3 className="font-serif text-[40px] leading-[1.15] font-medium mb-2">Feature H3</h3>
            <TypeSpec label="Feature H3" size="40px" weight="500" lineHeight="1.15" />
          </div>

          <div>
            <p className="font-serif text-[20px] leading-[1.5] mb-2">
              Feature Body - Perfect for long-form reading. This classic serif typeface provides excellent readability for extended articles, essays, and editorial content. The generous line height ensures comfortable reading over multiple paragraphs.
            </p>
            <TypeSpec label="Feature Body" size="20px" weight="400" lineHeight="1.5" />
          </div>

          <div>
            <blockquote className="font-serif text-[32px] leading-[1.3] italic mb-2 pl-6 border-l-4 border-electric-pink">
              "Feature Quote - Used for pull quotes and emphasized statements within articles."
            </blockquote>
            <TypeSpec label="Feature Quote" size="32px" weight="400 Italic" lineHeight="1.3" />
          </div>

          <div>
            <h4 className="font-serif text-[24px] leading-[1.3] font-medium mb-2">Feature Subhead</h4>
            <TypeSpec label="Feature Subhead" size="24px" weight="500" lineHeight="1.3" />
          </div>
        </div>
      </div>

      {/* Font Weights */}
      <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
        <h3 className="text-lg font-semibold mb-4">Font Weights</h3>
        <div className="space-y-3">
          {Object.entries(fontWeights).map(([name, value]) => (
            <div key={name} className="flex items-center gap-4">
              <span className="w-32 text-sm text-textSubtle capitalize">{name}</span>
              <span className="w-16 text-sm font-mono text-textSubtler">{value}</span>
              <span className="text-2xl" style={{ fontWeight: value }}>
                The quick brown fox
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
