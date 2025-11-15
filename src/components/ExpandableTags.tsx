'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      <AnimatePresence>
        {isExpanded && tags.slice(1).map((tag, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.8, x: -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -8 }}
            transition={{
              duration: 0.2,
              delay: index * 0.03,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-md hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-colors cursor-pointer"
          >
            {tag}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Toggle button - only show if there are more than 1 tag */}
      {tags.length > 1 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 w-5 h-5 rounded-full hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-all duration-200 flex items-center justify-center relative"
          aria-label={isExpanded ? 'Hide tags' : 'Show more tags'}
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.span
                key="x"
                initial={{ opacity: 0, rotate: -90, scale: 0 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <X size={12} strokeWidth={2} />
              </motion.span>
            ) : (
              <motion.span
                key="ellipsis"
                initial={{ opacity: 0, rotate: -90, scale: 0 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <Ellipsis size={12} strokeWidth={2} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      )}
    </div>
  )
}
