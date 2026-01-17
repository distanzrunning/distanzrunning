interface ColorRow {
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  token: string;
}

interface ColorTableProps {
  colors: ColorRow[];
}

export default function ColorTable({ colors }: ColorTableProps) {
  return (
    <div className="overflow-x-auto mb-12">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-400">
            <th
              scope="col"
              className="text-left py-3 px-4 font-sans font-medium text-sm"
            >
              Name
            </th>
            <th
              scope="col"
              className="text-left py-3 px-4 font-sans font-medium text-sm"
            >
              Hex
            </th>
            <th
              scope="col"
              className="text-left py-3 px-4 font-sans font-medium text-sm"
            >
              RGB
            </th>
            <th
              scope="col"
              className="text-left py-3 px-4 font-sans font-medium text-sm"
            >
              HSL
            </th>
            <th
              scope="col"
              className="text-left py-3 px-4 font-sans font-medium text-sm"
            >
              Token
            </th>
          </tr>
        </thead>
        <tbody>
          {colors.map((color, index) => (
            <tr
              key={index}
              className="border-b border-gray-300 hover:bg-neutralBgSubtle transition-colors"
            >
              <td className="py-3 px-4 font-sans text-sm whitespace-nowrap">
                {color.name}
              </td>
              <td className="py-3 px-4 font-mono text-sm whitespace-nowrap">
                {color.hex}
              </td>
              <td className="py-3 px-4 font-mono text-sm whitespace-nowrap">
                {color.rgb}
              </td>
              <td className="py-3 px-4 font-mono text-sm whitespace-nowrap">
                {color.hsl}
              </td>
              <td className="py-3 px-4 font-mono text-sm whitespace-nowrap text-gray-900">
                {color.token}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
