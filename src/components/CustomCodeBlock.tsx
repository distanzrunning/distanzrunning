// components/CustomCodeBlock.tsx

import React from 'react'
import { TokyoMarathonStats, BerlinMarathonStats, BostonMarathonStats, LondonMarathonStats, ChicagoMarathonStats } from './RaceStatsGrid'
import { TokyoMarathonRaceMap, BerlinMarathonRaceMap, BostonMarathonRaceMap, LondonMarathonRaceMap, ChicagoMarathonRaceMap, NewYorkCityMarathonRaceMap } from './RaceMapComponent'

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

    if (content === 'london-marathon-stats' || 
        htmlContent.includes('london-marathon-stats')) {
      return <LondonMarathonStats />
    }

    if (content === 'chicago-marathon-stats' || 
        htmlContent.includes('chicago-marathon-stats')) {
      return <ChicagoMarathonStats />
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

    // London Marathon map
    if (content === 'london-race-map' || 
        content === 'london-marathon-map' ||
        htmlContent.includes('london-race-map') ||
        htmlContent.includes('london-marathon-map')) {
      return <LondonMarathonRaceMap />
    }

    // Chicago Marathon map
    if (content === 'chicago-race-map' || 
        content === 'chicago-marathon-map' ||
        htmlContent.includes('chicago-race-map') ||
        htmlContent.includes('chicago-marathon-map')) {
      return <ChicagoMarathonRaceMap />
    }

    // New York City Marathon map
    if (content === 'nyc-race-map' || 
        content === 'nyc-marathon-map' ||
        content === 'new-york-race-map' || 
        content === 'new-york-marathon-map' ||
        content === 'newyork-race-map' || 
        content === 'newyork-marathon-map' ||
        htmlContent.includes('nyc-race-map') ||
        htmlContent.includes('nyc-marathon-map') ||
        htmlContent.includes('new-york-race-map') ||
        htmlContent.includes('new-york-marathon-map') ||
        htmlContent.includes('newyork-race-map') ||
        htmlContent.includes('newyork-marathon-map')) {
      return <NewYorkCityMarathonRaceMap />
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