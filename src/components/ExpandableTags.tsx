'use client'

import { useState } from 'react'
import { Ellipsis, X } from 'lucide-react'

interface ExpandableTagsProps {
  tags: string[]
}

export default function ExpandableTags({ tags }: ExpandableTagsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (tags.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* First tag - always visible */}
      <span className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-md hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-colors cursor-pointer">
        {tags[0]}
      </span>

      {/* Additional tags - shown when expanded */}
      {isExpanded && tags.slice(1).map((tag, index) => (
        <span
          key={index}
          className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-md hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-colors cursor-pointer animate-in fade-in slide-in-from-left-2 duration-200"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          {tag}
        </span>
      ))}

      {/* Toggle button - only show if there are more than 1 tag */}
      {tags.length > 1 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 w-5 h-5 rounded-full hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-all duration-200 flex items-center justify-center"
          aria-label={isExpanded ? 'Hide tags' : 'Show more tags'}
        >
          <span className={`absolute transition-all duration-200 ${isExpanded ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}>
            <Ellipsis size={12} strokeWidth={2} />
          </span>
          <span className={`absolute transition-all duration-200 ${isExpanded ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}>
            <X size={12} strokeWidth={2} />
          </span>
        </button>
      )}
    </div>
  )
}
