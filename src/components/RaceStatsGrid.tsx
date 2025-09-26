'use client'

import React, { useState } from 'react'

interface StatItem {
  title: string
  tooltip: string
  icon?: string
  metric?: string
  imperial?: string
  static?: string // For values that don't change between units
}

interface RaceStatsGridProps {
  title?: string
  stats: StatItem[]
}

export const RaceStatsGrid: React.FC<RaceStatsGridProps> = ({ 
  title = "Key Stats", 
  stats 
}) => {
  const [isMetric, setIsMetric] = useState(true)

  const toggleUnits = () => {
    setIsMetric(!isMetric)
  }

  // Check if any stats have both metric and imperial values
  const hasUnitToggle = stats.some(stat => stat.metric && stat.imperial)

  return (
    <div className="mt-14 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-sans font-semibold text-3xl capsize leading-tight text-textDefault">
          {title}
        </h3>
        {hasUnitToggle && (
          <button
            onClick={toggleUnits}
            className="w-24 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            title="Switch between Metric and Imperial units"
          >
            {isMetric ? 'Imperial' : 'Metric'}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-lg">
        {stats.map((stat, index) => {
          // Determine what value to show
          let displayValue = stat.static || ''
          if (stat.metric && stat.imperial) {
            displayValue = isMetric ? stat.metric : stat.imperial
          } else if (stat.metric) {
            displayValue = stat.metric
          } else if (stat.imperial) {
            displayValue = stat.imperial
          }

          return (
            <div 
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow" 
              title={stat.tooltip}
            >
              <span className="text-sm text-gray-600 mb-2 block font-medium">
                {stat.title}
              </span>
              <span className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                {stat.icon && (
                  <img 
                    src={stat.icon} 
                    alt={`${stat.title} icon`} 
                    className="w-5 h-5 flex-shrink-0" 
                  />
                )}
                {displayValue}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Example usage component with your marathon data
export const TokyoMarathonStats: React.FC = () => {
  const marathonStats: StatItem[] = [
    {
      title: "Distance",
      tooltip: "The official marathon distance",
      metric: "42.2 km",
      imperial: "26.2 miles"
    },
    {
      title: "Surface",
      tooltip: "The running surface for the majority of the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d6a647ebe75817fe6e64_TablerRoad.svg",
      static: "Road"
    },
    {
      title: "Profile",
      tooltip: "Flat indicates minimal elevation change",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772cda4af74ad84f1c170a4_IcOutlineTerrain.svg",
      static: "Flat"
    },
    {
      title: "Elevation Gain",
      tooltip: "The total elevation gain throughout the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772ceccfb2b021053bf1719_IcSharpArrowDropUp.svg",
      metric: "78m",
      imperial: "256ft"
    },
    {
      title: "When",
      tooltip: "The race typically occurs every year on the first Sunday of March",
      static: "March"
    },
    {
      title: "Entry Opens",
      tooltip: "The race registration usually opens in April",
      static: "April"
    },
    {
      title: "Average Temp (high)",
      tooltip: "Average high temperature on race day",
      metric: "15°C",
      imperial: "59°F"
    },
    {
      title: "Elevation Loss",
      tooltip: "The total elevation loss throughout the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d595582a68396e1373fc_IcSharpArrowDropDown.svg",
      metric: "79m",
      imperial: "259ft"
    },
    {
      title: "Men's Course Record",
      tooltip: "The men's course record is held by Benson Kipruto, KEN, 2024",
      static: "2:02:16"
    },
    {
      title: "Women's Course Record",
      tooltip: "The women's course record is held by Sutume Kebede, ETH, 2024",
      static: "2:13:44"
    },
    {
      title: "World Athletics Label",
      tooltip: "The Platinum Label is the highest distinction in the World Athletics Label Road Races program",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772da3ee14c20d7a1cd3aa6_WA%20Label%20Plat.svg",
      static: "Platinum"
    },
    {
      title: "Finishers (2024)",
      tooltip: "The estimated number of finishers in 2024",
      static: "37,000"
    }
  ]

  return <RaceStatsGrid title="Key Stats" stats={marathonStats} />
}

export const BerlinMarathonStats: React.FC = () => {
  const marathonStats: StatItem[] = [
    {
      title: "Distance",
      tooltip: "The official marathon distance",
      metric: "42.2 km",
      imperial: "26.2 miles"
    },
    {
      title: "Surface",
      tooltip: "The running surface for the majority of the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d6a647ebe75817fe6e64_TablerRoad.svg",
      static: "Road"
    },
    {
      title: "Profile",
      tooltip: "Flat indicates minimal elevation change",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772cda4af74ad84f1c170a4_IcOutlineTerrain.svg",
      static: "Flat"
    },
    {
      title: "Elevation Gain",
      tooltip: "The total elevation gain throughout the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772ceccfb2b021053bf1719_IcSharpArrowDropUp.svg",
      metric: "73m",
      imperial: "240ft"
    },
    {
      title: "When",
      tooltip: "The race typically occurs every year in September",
      static: "September"
    },
    {
      title: "Entry Opens",
      tooltip: "The race registration usually opens in October",
      static: "October"
    },
    {
      title: "Average Temp (high)",
      tooltip: "Average high temperature on race day",
      metric: "12°C",
      imperial: "54°F"
    },
    {
      title: "Elevation Loss",
      tooltip: "The total elevation loss throughout the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d595582a68396e1373fc_IcSharpArrowDropDown.svg",
      metric: "79m",
      imperial: "260ft"
    },
    {
      title: "Men's Course Record",
      tooltip: "The men's course record for the Berlin Marathon",
      static: "2:01:09"
    },
    {
      title: "Women's Course Record",
      tooltip: "The women's course record for the Berlin Marathon",
      static: "2:11:53"
    },
    {
      title: "World Athletics Label",
      tooltip: "The Platinum Label is the highest distinction in the World Athletics Label Road Races program",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772da3ee14c20d7a1cd3aa6_WA%20Label%20Plat.svg",
      static: "Platinum"
    },
    {
      title: "Finishers (2024)",
      tooltip: "The estimated number of finishers in 2024",
      static: "55,000"
    }
  ]

  return <RaceStatsGrid title="Key Stats" stats={marathonStats} />
}

export const BostonMarathonStats: React.FC = () => {
  const marathonStats: StatItem[] = [
    {
      title: "Distance",
      tooltip: "The official marathon distance",
      metric: "42.2 km",
      imperial: "26.2 miles"
    },
    {
      title: "Surface",
      tooltip: "The running surface for the majority of the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d6a647ebe75817fe6e64_TablerRoad.svg",
      static: "Road"
    },
    {
      title: "Profile",
      tooltip: "Flat indicates minimal elevation change",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772cda4af74ad84f1c170a4_IcOutlineTerrain.svg",
      static: "Flat"
    },
    {
      title: "Elevation Gain",
      tooltip: "The total elevation gain throughout the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772ceccfb2b021053bf1719_IcSharpArrowDropUp.svg",
      metric: "305m",
      imperial: "1,001ft"
    },
    {
      title: "When",
      tooltip: "The race typically occurs every year in April",
      static: "April"
    },
    {
      title: "Entry Opens",
      tooltip: "The race registration usually opens in September",
      static: "September"
    },
    {
      title: "Average Temp (high)",
      tooltip: "Average high temperature on race day",
      metric: "17°C",
      imperial: "63°F"
    },
    {
      title: "Elevation Loss",
      tooltip: "The total elevation loss throughout the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d595582a68396e1373fc_IcSharpArrowDropDown.svg",
      metric: "388m",
      imperial: "1,273ft"
    },
    {
      title: "Men's Course Record",
      tooltip: "The men's course record for the Boston Marathon",
      static: "2:03:02"
    },
    {
      title: "Women's Course Record",
      tooltip: "The women's course record for the Boston Marathon",
      static: "2:17:22"
    },
    {
      title: "World Athletics Label",
      tooltip: "The Platinum Label is the highest distinction in the World Athletics Label Road Races program",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772da3ee14c20d7a1cd3aa6_WA%20Label%20Plat.svg",
      static: "Platinum"
    },
    {
      title: "Finishers (2024)",
      tooltip: "The estimated number of finishers in 2024",
      static: "30,000"
    }
  ]

  return <RaceStatsGrid title="Key Stats" stats={marathonStats} />
}

export const LondonMarathonStats: React.FC = () => {
  const marathonStats: StatItem[] = [
    {
      title: "Distance",
      tooltip: "The official marathon distance",
      metric: "42.2 km",
      imperial: "26.2 miles"
    },
    {
      title: "Surface",
      tooltip: "The running surface for the majority of the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d6a647ebe75817fe6e64_TablerRoad.svg",
      static: "Road"
    },
    {
      title: "Profile",
      tooltip: "Flat indicates minimal elevation change",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772cda4af74ad84f1c170a4_IcOutlineTerrain.svg",
      static: "Flat"
    },
    {
      title: "Elevation Gain",
      tooltip: "The total elevation gain throughout the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772ceccfb2b021053bf1719_IcSharpArrowDropUp.svg",
      metric: "124m",
      imperial: "407ft"
    },
    {
      title: "When",
      tooltip: "The race typically occurs every year in April",
      static: "April"
    },
    {
      title: "Entry Opens",
      tooltip: "The race registration usually opens in April",
      static: "April"
    },
    {
      title: "Average Temp (high)",
      tooltip: "Average high temperature on race day",
      metric: "15°C",
      imperial: "59°F"
    },
    {
      title: "Elevation Loss",
      tooltip: "The total elevation loss throughout the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d595582a68396e1373fc_IcSharpArrowDropDown.svg",
      metric: "161m",
      imperial: "528ft"
    },
    {
      title: "Men's Course Record",
      tooltip: "The men's course record is held by Kelvin Kiptum, KEN, 2023",
      static: "2:01:25"
    },
    {
      title: "Women's Course Record",
      tooltip: "The women's course record for the London Marathon",
      static: "2:15:25"
    },
    {
      title: "World Athletics Label",
      tooltip: "The Platinum Label is the highest distinction in the World Athletics Label Road Races program",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772da3ee14c20d7a1cd3aa6_WA%20Label%20Plat.svg",
      static: "Platinum"
    },
    {
      title: "Finishers (2024)",
      tooltip: "The estimated number of finishers in 2024",
      static: "53,700"
    }
  ]

  return <RaceStatsGrid title="Key Stats" stats={marathonStats} />
}

export const ChicagoMarathonStats: React.FC = () => {
  const marathonStats: StatItem[] = [
    {
      title: "Distance",
      tooltip: "The official marathon distance",
      metric: "42.2 km",
      imperial: "26.2 miles"
    },
    {
      title: "Surface",
      tooltip: "The running surface for the majority of the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d6a647ebe75817fe6e64_TablerRoad.svg",
      static: "Road"
    },
    {
      title: "Profile",
      tooltip: "Flat indicates minimal elevation change",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772cda4af74ad84f1c170a4_IcOutlineTerrain.svg",
      static: "Flat"
    },
    {
      title: "Elevation Gain",
      tooltip: "The total elevation gain throughout the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772ceccfb2b021053bf1719_IcSharpArrowDropUp.svg",
      metric: "62m",
      imperial: "203ft"
    },
    {
      title: "When",
      tooltip: "The race typically occurs every year in October",
      static: "October"
    },
    {
      title: "Entry Opens",
      tooltip: "The race registration usually opens in October",
      static: "October"
    },
    {
      title: "Average Temp (high)",
      tooltip: "Average high temperature on race day",
      metric: "19°C",
      imperial: "66°F"
    },
    {
      title: "Elevation Loss",
      tooltip: "The total elevation loss throughout the race",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d595582a68396e1373fc_IcSharpArrowDropDown.svg",
      metric: "73m",
      imperial: "239ft"
    },
    {
      title: "Men's Course Record",
      tooltip: "The men's course record for the Chicago Marathon",
      static: "2:00:35"
    },
    {
      title: "Women's Course Record",
      tooltip: "The women's course record for the Chicago Marathon",
      static: "2:09:56"
    },
    {
      title: "World Athletics Label",
      tooltip: "The Platinum Label is the highest distinction in the World Athletics Label Road Races program",
      icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772da3ee14c20d7a1cd3aa6_WA%20Label%20Plat.svg",
      static: "Platinum"
    },
    {
      title: "Finishers (2024)",
      tooltip: "The estimated number of finishers in 2024",
      static: "52,000"
    }
  ]

  return <RaceStatsGrid title="Key Stats" stats={marathonStats} />
}