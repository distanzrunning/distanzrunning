// src/lib/readingTime.ts

/**
 * Calculate reading time from Portable Text content
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(body: any[]): number {
  if (!body || !Array.isArray(body)) {
    return 5; // Default fallback
  }

  let wordCount = 0;

  const countWords = (blocks: any[]): void => {
    blocks.forEach((block) => {
      if (block._type === 'block' && block.children) {
        block.children.forEach((child: any) => {
          if (child.text) {
            // Split by whitespace and filter empty strings
            const words = child.text.trim().split(/\s+/).filter((word: string) => word.length > 0);
            wordCount += words.length;
          }
        });
      }
      // Handle nested blocks (like lists, custom blocks, etc.)
      if (block.children && Array.isArray(block.children)) {
        countWords(block.children);
      }
    });
  };

  countWords(body);

  // Calculate minutes (200 words per minute), round up
  const minutes = Math.ceil(wordCount / 200);

  // Return at least 1 minute, cap at 60 for sanity
  return Math.max(1, Math.min(minutes, 60));
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} MIN READ`;
}
