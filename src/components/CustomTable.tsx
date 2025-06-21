// components/CustomTable.tsx

import React from 'react'

interface TableRow {
  cells: string[]
}

interface CustomTableProps {
  value: {
    title?: string
    headers: string[]
    rows: TableRow[]
    caption?: string
  }
}

export const CustomTable: React.FC<CustomTableProps> = ({ value }) => {
  const { title, headers, rows, caption } = value

  return (
    <div className="my-8">
      {title && (
        <h3 className="font-sans font-semibold text-xl mb-4 text-textDefault">
          {title}
        </h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 rounded-lg">
          {headers && headers.length > 0 && (
            <thead>
              <tr className="bg-gray-50">
                {headers.map((header: string, index: number) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-4 py-3 text-left font-semibold text-textDefault"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows?.map((row: TableRow, rowIndex: number) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.cells?.map((cell: string, cellIndex: number) => (
                  <td
                    key={cellIndex}
                    className="border border-gray-300 px-4 py-3 text-textDefault"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <p className="font-sans text-textSubtle font-normal text-sm text-center mt-2">
          {caption}
        </p>
      )}
    </div>
  )
}