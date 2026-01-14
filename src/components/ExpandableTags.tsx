"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ellipsis, X } from "lucide-react";

interface ExpandableTagsProps {
  tags: string[];
}

export default function ExpandableTags({ tags }: ExpandableTagsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (tags.length === 0) return null;

  return (
    <motion.ul
      className="flex items-center gap-2 flex-wrap"
      style={{ opacity: 1 }}
    >
      {/* First tag - always visible */}
      <motion.li style={{ opacity: 1 }}>
        <span className="border border-borderDefault text-textSubtle px-1.5 py-0.5 rounded-md hover:bg-asphalt-10 dark:hover:bg-asphalt-90 hover:text-textInverted hover:border-asphalt-10 dark:hover:border-asphalt-90 transition-colors cursor-pointer">
          {tags[0]}
        </span>
      </motion.li>

      {/* Additional tags - shown when expanded */}
      <AnimatePresence>
        {isExpanded &&
          tags.slice(1).map((tag, index) => (
            <motion.li
              key={tag}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut",
              }}
            >
              <span className="border border-borderDefault text-textSubtle px-1.5 py-0.5 rounded-md hover:bg-asphalt-10 dark:hover:bg-asphalt-90 hover:text-textInverted hover:border-asphalt-10 dark:hover:border-asphalt-90 transition-colors cursor-pointer">
                {tag}
              </span>
            </motion.li>
          ))}
      </AnimatePresence>

      {/* Toggle button - only show if there are more than 1 tag */}
      {tags.length > 1 && (
        <motion.li
          layout
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
            mass: 0.8,
          }}
        >
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Hide tags" : "View more tags"}
            className="border border-borderDefault text-textSubtle w-5 h-5 rounded-full hover:bg-asphalt-10 dark:hover:bg-asphalt-90 hover:text-textInverted hover:border-asphalt-10 dark:hover:border-asphalt-90 transition-all duration-200 flex items-center justify-center"
            aria-label={isExpanded ? "Hide tags" : "View more tags"}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={12} strokeWidth={2} />
                </motion.span>
              ) : (
                <motion.span
                  key="ellipsis"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Ellipsis size={12} strokeWidth={2} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.li>
      )}
    </motion.ul>
  );
}
