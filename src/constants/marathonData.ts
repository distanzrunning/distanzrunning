// Shared marathon data for World Marathon Majors
// Used by both desktop and mobile MarathonShowcase components

export interface StatItem {
  title: string
  tooltip: string
  icon?: string
  metric?: string
  imperial?: string
  static?: string
}

export interface PointOfInterest {
  name: string
  coordinates: [number, number]
  type: 'aid_station'
  description?: string | null
}

export interface MarathonData {
  id: string
  name: string
  location: string
  date: { month: string; day: string }
  icon: string
  logo: string
  gpxUrl: string
  center: [number, number]
  stats: StatItem[]
}

export const marathonData: MarathonData[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    location: 'Tokyo, Japan',
    date: { month: 'Mar', day: '01' },
    icon: '',
    logo: '/images/tokyo_marathon_logo.svg',
    gpxUrl: 'https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/tokyo_marathon_geo.json',
    center: [139.6917, 35.6895],
    stats: [
      { title: "Distance", tooltip: "The official marathon distance", metric: "42.2 km", imperial: "26.2 miles" },
      { title: "Surface", tooltip: "The running surface for the majority of the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d6a647ebe75817fe6e64_TablerRoad.svg", static: "Road" },
      { title: "Profile", tooltip: "Flat indicates minimal elevation change", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772cda4af74ad84f1c170a4_IcOutlineTerrain.svg", static: "Flat" },
      { title: "Elevation Gain", tooltip: "The total elevation gain throughout the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772ceccfb2b021053bf1719_IcSharpArrowDropUp.svg", metric: "78m", imperial: "256ft" },
      { title: "Average Temp (high)", tooltip: "Average high temperature on race day", metric: "15°C", imperial: "59°F" },
      { title: "Elevation Loss", tooltip: "The total elevation loss throughout the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d595582a68396e1373fc_IcSharpArrowDropDown.svg", metric: "79m", imperial: "259ft" },
      { title: "Men's Course Record", tooltip: "The men's course record is held by Benson Kipruto, KEN, 2024", static: "2:02:16" },
      { title: "Women's Course Record", tooltip: "The women's course record is held by Sutume Kebede, ETH, 2024", static: "2:13:44" },
      { title: "World Athletics Label", tooltip: "The Platinum Label is the highest distinction in the World Athletics Label Road Races program", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772da3ee14c20d7a1cd3aa6_WA%20Label%20Plat.svg", static: "Platinum" },
      { title: "Finishers (2024)", tooltip: "The estimated number of finishers in 2024", static: "37,000" }
    ]
  },
  {
    id: 'boston',
    name: 'Boston',
    location: 'Boston, Massachusetts',
    date: { month: 'Apr', day: '20' },
    icon: '',
    logo: '/images/boston_marathon_logo.svg',
    gpxUrl: 'https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/boston_marathon.json',
    center: [-71.0589, 42.3601],
    stats: [
      { title: "Distance", tooltip: "The official marathon distance", metric: "42.2 km", imperial: "26.2 miles" },
      { title: "Surface", tooltip: "The running surface for the majority of the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d6a647ebe75817fe6e64_TablerRoad.svg", static: "Road" },
      { title: "Profile", tooltip: "Different from flat, the Boston Marathon has significant elevation changes", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772cda4af74ad84f1c170a4_IcOutlineTerrain.svg", static: "Hilly" },
      { title: "Elevation Gain", tooltip: "The total elevation gain throughout the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772ceccfb2b021053bf1719_IcSharpArrowDropUp.svg", metric: "305m", imperial: "1,001ft" },
      { title: "Average Temp (high)", tooltip: "Average high temperature on race day", metric: "17°C", imperial: "63°F" },
      { title: "Elevation Loss", tooltip: "The total elevation loss throughout the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d595582a68396e1373fc_IcSharpArrowDropDown.svg", metric: "388m", imperial: "1,273ft" },
      { title: "Men's Course Record", tooltip: "The men's course record for the Boston Marathon", static: "2:03:02" },
      { title: "Women's Course Record", tooltip: "The women's course record for the Boston Marathon", static: "2:17:22" },
      { title: "World Athletics Label", tooltip: "The Platinum Label is the highest distinction in the World Athletics Label Road Races program", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772da3ee14c20d7a1cd3aa6_WA%20Label%20Plat.svg", static: "Platinum" },
      { title: "Finishers (2024)", tooltip: "The estimated number of finishers in 2024", static: "30,000" }
    ]
  },
  {
    id: 'london',
    name: 'London',
    location: 'London, England',
    date: { month: 'Apr', day: '26' },
    icon: '',
    logo: '/images/london_marathon_logo.svg',
    gpxUrl: 'https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/london_marathon_1.json',
    center: [0.0022, 51.4769],
    stats: [
      { title: "Distance", tooltip: "The official marathon distance", metric: "42.2 km", imperial: "26.2 miles" },
      { title: "Surface", tooltip: "The running surface for the majority of the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d6a647ebe75817fe6e64_TablerRoad.svg", static: "Road" },
      { title: "Profile", tooltip: "Flat indicates minimal elevation change", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772cda4af74ad84f1c170a4_IcOutlineTerrain.svg", static: "Flat" },
      { title: "Elevation Gain", tooltip: "The total elevation gain throughout the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772ceccfb2b021053bf1719_IcSharpArrowDropUp.svg", metric: "124m", imperial: "407ft" },
      { title: "Average Temp (high)", tooltip: "Average high temperature on race day", metric: "15°C", imperial: "59°F" },
      { title: "Elevation Loss", tooltip: "The total elevation loss throughout the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d595582a68396e1373fc_IcSharpArrowDropDown.svg", metric: "161m", imperial: "528ft" },
      { title: "Men's Course Record", tooltip: "The men's course record is held by Kelvin Kiptum, KEN, 2023", static: "2:01:25" },
      { title: "Women's Course Record", tooltip: "The women's course record for the London Marathon", static: "2:15:25" },
      { title: "World Athletics Label", tooltip: "The Platinum Label is the highest distinction in the World Athletics Label Road Races program", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772da3ee14c20d7a1cd3aa6_WA%20Label%20Plat.svg", static: "Platinum" },
      { title: "Finishers (2024)", tooltip: "The estimated number of finishers in 2024", static: "53,700" }
    ]
  },
  {
     id: 'sydney',
    name: 'Sydney',
    location: 'Sydney, Australia',
    date: { month: 'Aug', day: '30' },
    icon: '',
    logo: '/images/sydney_marathon_logo.svg',
    gpxUrl: 'https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/sydney_marathon.json',
    center: [151.2093, -33.8688],
    stats: [
      { title: "Distance", tooltip: "The official marathon distance", metric: "42.2 km", imperial: "26.2 miles" },
      { title: "Surface", tooltip: "The running surface for the majority of the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d6a647ebe75817fe6e64_TablerRoad.svg", static: "Road" },
      { title: "Profile", tooltip: "The Sydney Marathon has significant elevation changes", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772cda4af74ad84f1c170a4_IcOutlineTerrain.svg", static: "Hilly" },
      { title: "Elevation Gain", tooltip: "The total elevation gain throughout the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772ceccfb2b021053bf1719_IcSharpArrowDropUp.svg", metric: "317m", imperial: "1,040ft" },
      { title: "Average Temp (high)", tooltip: "Average high temperature on race day", metric: "20°C", imperial: "69°F" },
      { title: "Elevation Loss", tooltip: "The total elevation loss throughout the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d595582a68396e1373fc_IcSharpArrowDropDown.svg", metric: "400m", imperial: "1,312ft" },
      { title: "Men's Course Record", tooltip: "The men's course record for the Sydney Marathon", static: "2:06:18" },
      { title: "Women's Course Record", tooltip: "The women's course record for the Sydney Marathon", static: "2:21:41" },
      { title: "World Athletics Label", tooltip: "The Platinum Label is the highest distinction in the World Athletics Label Road Races program", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772da3ee14c20d7a1cd3aa6_WA%20Label%20Plat.svg", static: "Platinum" },
      { title: "Finishers (2024)", tooltip: "The estimated number of finishers in 2024", static: "38,000" }
    ]
  },
  {
    id: 'berlin',
    name: 'Berlin',
    location: 'Berlin, Germany',
    date: { month: 'Sep', day: '21' },
    icon: '',
    logo: '/images/berlin_marathon_logo.svg',
    gpxUrl: 'https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/berlin_marathon.json',
    center: [13.4050, 52.5200],
    stats: [
      { title: "Distance", tooltip: "The official marathon distance", metric: "42.2 km", imperial: "26.2 miles" },
      { title: "Surface", tooltip: "The running surface for the majority of the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d6a647ebe75817fe6e64_TablerRoad.svg", static: "Road" },
      { title: "Profile", tooltip: "Flat indicates minimal elevation change", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772cda4af74ad84f1c170a4_IcOutlineTerrain.svg", static: "Flat" },
      { title: "Elevation Gain", tooltip: "The total elevation gain throughout the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772ceccfb2b021053bf1719_IcSharpArrowDropUp.svg", metric: "73m", imperial: "240ft" },
      { title: "Average Temp (high)", tooltip: "Average high temperature on race day", metric: "12°C", imperial: "54°F" },
      { title: "Elevation Loss", tooltip: "The total elevation loss throughout the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d595582a68396e1373fc_IcSharpArrowDropDown.svg", metric: "79m", imperial: "260ft" },
      { title: "Men's Course Record", tooltip: "The men's course record for the Berlin Marathon", static: "2:01:09" },
      { title: "Women's Course Record", tooltip: "The women's course record for the Berlin Marathon", static: "2:11:53" },
      { title: "World Athletics Label", tooltip: "The Platinum Label is the highest distinction in the World Athletics Label Road Races program", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772da3ee14c20d7a1cd3aa6_WA%20Label%20Plat.svg", static: "Platinum" },
      { title: "Finishers (2024)", tooltip: "The estimated number of finishers in 2024", static: "55,000" }
    ]
  },
  {
    id: 'chicago',
    name: 'Chicago',
    location: 'Chicago, Illinois',
    date: { month: 'Oct', day: '12' },
    icon: '',
    logo: '/images/chicago_marathon_logo.svg',
    gpxUrl: 'https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/chicargo_marathon.json',
    center: [-87.6298, 41.8781],
    stats: [
      { title: "Distance", tooltip: "The official marathon distance", metric: "42.2 km", imperial: "26.2 miles" },
      { title: "Surface", tooltip: "The running surface for the majority of the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d6a647ebe75817fe6e64_TablerRoad.svg", static: "Road" },
      { title: "Profile", tooltip: "Flat indicates minimal elevation change", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772cda4af74ad84f1c170a4_IcOutlineTerrain.svg", static: "Flat" },
      { title: "Elevation Gain", tooltip: "The total elevation gain throughout the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772ceccfb2b021053bf1719_IcSharpArrowDropUp.svg", metric: "62m", imperial: "203ft" },
      { title: "Average Temp (high)", tooltip: "Average high temperature on race day", metric: "19°C", imperial: "66°F" },
      { title: "Elevation Loss", tooltip: "The total elevation loss throughout the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d595582a68396e1373fc_IcSharpArrowDropDown.svg", metric: "73m", imperial: "239ft" },
      { title: "Men's Course Record", tooltip: "The men's course record for the Chicago Marathon", static: "2:00:35" },
      { title: "Women's Course Record", tooltip: "The women's course record for the Chicago Marathon", static: "2:09:56" },
      { title: "World Athletics Label", tooltip: "The Platinum Label is the highest distinction in the World Athletics Label Road Races program", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772da3ee14c20d7a1cd3aa6_WA%20Label%20Plat.svg", static: "Platinum" },
      { title: "Finishers (2024)", tooltip: "The estimated number of finishers in 2024", static: "52,000" }
    ]
  },
  {
    id: 'nyc',
    name: 'New York City',
    location: 'New York, New York',
    date: { month: 'Nov', day: '02' },
    icon: '',
    logo: '/images/new_york_city_marathon.svg',
    gpxUrl: 'https://raw.githubusercontent.com/distanzrunning/gpx/refs/heads/main/new_york_city_marathon.json',
    center: [-74.0060, 40.7128],
    stats: [
      { title: "Distance", tooltip: "The official marathon distance", metric: "42.2 km", imperial: "26.2 miles" },
      { title: "Surface", tooltip: "The running surface for the majority of the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d6a647ebe75817fe6e64_TablerRoad.svg", static: "Road" },
      { title: "Profile", tooltip: "The NYC Marathon has moderate elevation changes including bridges", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772cda4af74ad84f1c170a4_IcOutlineTerrain.svg", static: "Rolling" },
      { title: "Elevation Gain", tooltip: "The total elevation gain throughout the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772ceccfb2b021053bf1719_IcSharpArrowDropUp.svg", metric: "180m", imperial: "590ft" },
      { title: "Average Temp (high)", tooltip: "Average high temperature on race day", metric: "16°C", imperial: "61°F" },
      { title: "Elevation Loss", tooltip: "The total elevation loss throughout the race", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772d595582a68396e1373fc_IcSharpArrowDropDown.svg", metric: "180m", imperial: "590ft" },
      { title: "Men's Course Record", tooltip: "The men's course record for the NYC Marathon", static: "2:05:05" },
      { title: "Women's Course Record", tooltip: "The women's course record for the NYC Marathon", static: "2:22:31" },
      { title: "World Athletics Label", tooltip: "The Platinum Label is the highest distinction in the World Athletics Label Road Races program", icon: "https://cdn.prod.website-files.com/67192759e7cd9e25b2c84df5/6772da3ee14c20d7a1cd3aa6_WA%20Label%20Plat.svg", static: "Platinum" },
      { title: "Finishers (2024)", tooltip: "The estimated number of finishers in 2024", static: "53,000" }
    ]
  }
]
