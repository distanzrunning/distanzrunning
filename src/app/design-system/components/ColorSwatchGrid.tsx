interface ColorSwatch {
  name: string;
  hex: string;
  textColor?: "light" | "dark";
}

interface ColorSwatchGridProps {
  swatches: ColorSwatch[];
}

export default function ColorSwatchGrid({ swatches }: ColorSwatchGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
      {swatches.map((swatch) => (
        <div key={swatch.name} className="flex flex-col items-center">
          <div
            className="w-24 h-24 rounded-full mb-3 flex items-center justify-center"
            style={{ backgroundColor: swatch.hex }}
          ></div>
          <span className="text-xs font-sans text-center text-textDefault">
            {swatch.name}
          </span>
        </div>
      ))}
    </div>
  );
}
