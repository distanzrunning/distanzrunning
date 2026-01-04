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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
      {swatches.map((swatch) => (
        <div key={swatch.name} className="flex flex-col items-center">
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center ${
              swatch.hex === "#FFFFFF" ? "border border-borderNeutral" : ""
            }`}
            style={{ backgroundColor: swatch.hex }}
          >
            <span
              className={`text-sm font-sans text-center px-2 ${
                swatch.textColor === "light" ? "text-white" : "text-black"
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
