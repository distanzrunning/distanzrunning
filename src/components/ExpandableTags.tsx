'use client'

import { useState } from 'react'

interface ExpandableTagsProps {
  tags: string[]
}

export default function ExpandableTags({ tags }: ExpandableTagsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (tags.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* First tag - always visible */}
      <span className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-md">
        {tags[0]}
      </span>

      {/* Additional tags - shown when expanded */}
      {isExpanded && tags.slice(1).map((tag, index) => (
        <span
          key={index}
          className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-md"
        >
          {tag}
        </span>
      ))}

      {/* Toggle button - only show if there are more than 1 tag */}
      {tags.length > 1 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 w-5 h-5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
          aria-label={isExpanded ? 'Hide tags' : 'Show more tags'}
        >
          {isExpanded ? (
            <span className="text-[10px] leading-none font-medium flex items-center justify-center">×</span>
          ) : (
            <span className="text-[10px] leading-none font-medium flex items-center justify-center -mt-[1px]">...</span>
          )}
        </button>
      )}
    </div>
  )
}
