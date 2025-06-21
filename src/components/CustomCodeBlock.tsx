// components/CustomCodeBlock.tsx

import React from 'react'
import { TokyoMarathonStats, BerlinMarathonStats, BostonMarathonStats } from './RaceStatsGrid'
import { TokyoMarathonRaceMap, BerlinMarathonRaceMap, BostonMarathonRaceMap } from './RaceMapComponent'

interface CustomCodeBlockProps {
  value: {
    title?: string
    blockType: string
    htmlContent: string
    notes?: string
  }
}

export const CustomCodeBlock: React.FC<CustomCodeBlockProps> = ({ value }) => {
  const { title, blockType, htmlContent } = value

  // If no content, don't render anything
  if (!htmlContent) {
    return null
  }

  // Special handling for race stats components
  if (blockType === 'stats') {
    const content = htmlContent.trim()
    
    // Check for specific component identifiers
    if (content === 'tokyo-marathon-stats' || 
        htmlContent.includes('tokyo-marathon-stats') || 
        htmlContent.includes('Key Stats') ||
        htmlContent.includes('stats-grid')) {
      return <TokyoMarathonStats />
    }
    
    if (content === 'berlin-marathon-stats' || 
        htmlContent.includes('berlin-marathon-stats')) {
      return <BerlinMarathonStats />
    }
    
    if (content === 'boston-marathon-stats' || 
        htmlContent.includes('boston-marathon-stats')) {
      return <BostonMarathonStats />
    }
  }

  // Special handling for race maps
  if (blockType === 'map') {
    const content = htmlContent.trim()
    
    // Tokyo Marathon map
    if (content === 'tokyo-race-map' || 
        content === 'tokyo-marathon-map' ||
        htmlContent.includes('tokyo-race-map') || 
        htmlContent.includes('test-map') ||
        htmlContent.includes('tokyo-marathon-map') ||
        htmlContent.includes('interactive-map') ||
        htmlContent.includes('course-map')) {
      return <TokyoMarathonRaceMap />
    }
    
    // Berlin Marathon map
    if (content === 'berlin-race-map' || 
        content === 'berlin-marathon-map' ||
        htmlContent.includes('berlin-race-map') ||
        htmlContent.includes('berlin-marathon-map')) {
      return <BerlinMarathonRaceMap />
    }
    
    // Boston Marathon map
    if (content === 'boston-race-map' || 
        content === 'boston-marathon-map' ||
        htmlContent.includes('boston-race-map') ||
        htmlContent.includes('boston-marathon-map')) {
      return <BostonMarathonRaceMap />
    }
  }

  // Check if the content contains a table - break out to full width
  const isTable = htmlContent.includes('<table') || htmlContent.includes('table-container');
  
  if (isTable) {
    return (
      <div className="relative -mx-6 md:-mx-8 lg:-mx-12 xl:-mx-24 my-8">
        <div className="px-6 md:px-8 lg:px-12 xl:px-24">
          {title && (
            <h3 className="font-sans font-semibold text-xl mb-4 text-textDefault">
              {title}
            </h3>
          )}
          <div 
            className="w-full"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    );
  }

  // Default: render HTML content within article column
  return (
    <div className="my-8">
      {title && (
        <h3 className="font-sans font-semibold text-xl mb-4 text-textDefault">
          {title}
        </h3>
      )}
      <div 
        className="custom-content-block"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  )
}