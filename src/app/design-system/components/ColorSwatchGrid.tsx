interface ColorSwatch {
  name: string;
  hex: string;
  textColor?: 'light' | 'dark';
}

interface ColorSwatchGridProps {
  swatches: ColorSwatch[];
}

export default function ColorSwatchGrid({ swatches }: ColorSwatchGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
      {swatches.map((swatch) => (
        <div
          key={swatch.name}
          className="flex flex-col"
        >
          <div
            className="aspect-square rounded-sm mb-2 flex items-end p-4"
            style={{ backgroundColor: swatch.hex }}
          >
            <span
              className={`text-sm font-sans ${
                swatch.textColor === 'light'
                  ? 'text-white'
                  : 'text-black'
              }`}
            >
              {swatch.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
