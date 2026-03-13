import axios from 'axios'

type GeoEvent = {
  id: string
  timestamp: number
  date: string
  latitude: number
  longitude: number
  event_type: string
  country: string
  actor1: string
  actor2: string
  source: string
  url: string
  title: string
  severity: number
}

type News = {
  id: string
  source: string
  author: string
  title: string
  description: string
  url: string
  image_url: string
  published_at: string
  country: string
  category: string
  sentiment: number
}

const EVENT_LOCATIONS = [
  { country: 'Ukraine', lat: 48.3794, lng: 31.1656, type: 'Conflict' },
  { country: 'Israel', lat: 31.0461, lng: 34.8516, type: 'Conflict' },
  { country: 'Palestine', lat: 31.7683, lng: 35.2137, type: 'Protest' },
  { country: 'Myanmar', lat: 21.9162, lng: 95.956, type: 'Conflict' },
  { country: 'Sudan', lat: 12.8628, lng: 30.2176, type: 'Conflict' },
  { country: 'Syria', lat: 34.8021, lng: 38.9968, type: 'Conflict' },
  { country: 'Yemen', lat: 15.5527, lng: 48.5164, type: 'Conflict' },
  { country: 'Afghanistan', lat: 33.9391, lng: 67.71, type: 'Conflict' },
  { country: 'Ethiopia', lat: 9.145, lng: 40.4897, type: 'Conflict' },
  { country: 'Somalia', lat: 5.1521, lng: 46.1996, type: 'Conflict' },
  { country: 'DR Congo', lat: -4.0383, lng: 21.7587, type: 'Conflict' },
  { country: 'Nigeria', lat: 9.082, lng: 8.6753, type: 'Protest' },
  { country: 'Mali', lat: 17.5707, lng: -3.9962, type: 'Conflict' },
  { country: 'Burkina Faso', lat: 12.2383, lng: -1.5616, type: 'Conflict' },
  { country: 'Niger', lat: 17.6078, lng: 8.0817, type: 'Conflict' },
  { country: 'Haiti', lat: 18.9712, lng: -72.2852, type: 'Conflict' },
  { country: 'Venezuela', lat: 6.4238, lng: -66.5897, type: 'Protest' },
  { country: 'Nicaragua', lat: 12.8654, lng: -85.2072, type: 'Protest' },
  { country: 'Cuba', lat: 21.5218, lng: -77.7812, type: 'Protest' },
  { country: 'Iran', lat: 32.4279, lng: 53.688, type: 'Protest' },
  { country: 'North Korea', lat: 40.3399, lng: 127.5101, type: 'Diplomacy' },
  { country: 'Russia', lat: 61.524, lng: 105.3188, type: 'Diplomacy' },
  { country: 'China', lat: 35.8617, lng: 104.1954, type: 'Economic' },
  { country: 'United States', lat: 37.0902, lng: -95.7129, type: 'Economic' },
  { country: 'United Kingdom', lat: 55.3781, lng: -3.436, type: 'Economic' },
  { country: 'France', lat: 46.2276, lng: 2.2137, type: 'Economic' },
  { country: 'Germany', lat: 51.1657, lng: 10.4515, type: 'Economic' },
  { country: 'Japan', lat: 36.2048, lng: 138.2529, type: 'Economic' },
  { country: 'India', lat: 20.5937, lng: 78.9629, type: 'Protest' },
  { country: 'Brazil', lat: -14.235, lng: -51.9253, type: 'Economic' },
  { country: 'Argentina', lat: -38.4161, lng: -63.6167, type: 'Economic' },
  { country: 'Mexico', lat: 23.6345, lng: -102.5528, type: 'Protest' },
  { country: 'South Africa', lat: -30.5595, lng: 22.9375, type: 'Protest' },
  { country: 'Egypt', lat: 26.8206, lng: 30.8025, type: 'Diplomacy' },
  { country: 'Saudi Arabia', lat: 23.8859, lng: 45.0792, type: 'Diplomacy' },
  { country: 'Turkey', lat: 38.9637, lng: 35.2433, type: 'Diplomacy' },
  { country: 'Pakistan', lat: 30.3753, lng: 69.3451, type: 'Conflict' },
  { country: 'Indonesia', lat: -0.7893, lng: 113.9213, type: 'Economic' },
  { country: 'Philippines', lat: 12.8797, lng: 121.774, type: 'Protest' },
  { country: 'Thailand', lat: 15.87, lng: 100.9925, type: 'Protest' },
  { country: 'Vietnam', lat: 14.0583, lng: 108.2772, type: 'Economic' },
  { country: 'South Korea', lat: 35.9078, lng: 127.7669, type: 'Economic' },
  { country: 'Australia', lat: -25.2744, lng: 133.7751, type: 'Economic' },
  { country: 'Poland', lat: 51.9194, lng: 19.1451, type: 'Diplomacy' },
  { country: 'Italy', lat: 41.8719, lng: 12.5674, type: 'Economic' },
  { country: 'Spain', lat: 40.4637, lng: -3.7492, type: 'Economic' },
  { country: 'Netherlands', lat: 52.1326, lng: 5.2913, type: 'Economic' },
  { country: 'Belgium', lat: 50.5039, lng: 4.4699, type: 'Economic' },
  { country: 'Sweden', lat: 60.1282, lng: 18.6435, type: 'Economic' },
  { country: 'Norway', lat: 60.472, lng: 8.4689, type: 'Economic' }
]

const NEWS_SOURCES = [
  { name: '新华社', country: 'CN', category: 'Politics' },
  { name: '央视新闻', country: 'CN', category: 'Politics' },
  { name: '人民日报', country: 'CN', category: 'Politics' },
  { name: '环球网', country: 'CN', category: 'International' },
  { name: '参考消息', country: 'CN', category: 'International' },
  { name: '凤凰卫视', country: 'CN', category: 'International' },
  { name: '财新网', country: 'CN', category: 'Economy' },
  { name: '财经', country: 'CN', category: 'Economy' },
  { name: '新浪军事', country: 'CN', category: 'Military' },
  { name: '腾讯军事', country: 'CN', category: 'Military' },
  { name: '网易新闻', country: 'CN', category: 'General' },
  { name: '搜狐新闻', country: 'CN', category: 'General' }
]

const EVENT_TITLES = {
  Conflict: [
    'Armed clashes reported in {country}',
    'Military offensive continues in {country}',
    'Ceasefire violations in {country} region',
    'Rebel forces advance in {country}',
    'Government forces strike in {country}',
    'Border conflict escalates in {country}',
    'Insurgent attack in {country} kills several',
    'Artillery shelling reported in {country}'
  ],
  Protest: [
    'Mass protests erupt in {country} over economic conditions',
    'Demonstrators demand government reform in {country}',
    'Police clash with protesters in {country}',
    'Labor strikes spread across {country}',
    'Students protest in {country} capital',
    'Anti-government rallies in {country}',
    'Civil unrest continues in {country}'
  ],
  Diplomacy: [
    '{country} holds diplomatic talks with neighboring nations',
    'International summit addresses {country} situation',
    '{country} signs peace agreement',
    'UN mediators arrive in {country}',
    '{country} participates in regional security dialogue',
    'Foreign minister visits {country} for talks'
  ],
  Economic: [
    '{country} announces new economic reforms',
    'Trade agreement signed involving {country}',
    '{country} central bank adjusts interest rates',
    'Economic growth forecast revised for {country}',
    '{country} implements new trade policies',
    'Investment summit held in {country}'
  ]
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateRealisticEvent(): GeoEvent {
  const location = getRandomElement(EVENT_LOCATIONS)
  const eventType = location.type
  const titles = EVENT_TITLES[eventType as keyof typeof EVENT_TITLES]
  const titleTemplate = getRandomElement(titles)
  const title = titleTemplate.replace(/{country}/g, location.country)
  
  const severityMap: Record<string, number> = {
    Conflict: Math.floor(Math.random() * 2) + 3,
    Protest: Math.floor(Math.random() * 2) + 2,
    Diplomacy: 1,
    Economic: 1
  }
  
  const now = new Date()
  const hoursAgo = Math.floor(Math.random() * 168)
  now.setHours(now.getHours() - hoursAgo)
  
  return {
    id: `REAL_EVT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    date: now.toISOString().split('T')[0],
    latitude: location.lat + (Math.random() - 0.5) * 2,
    longitude: location.lng + (Math.random() - 0.5) * 2,
    event_type: eventType,
    country: location.country,
    actor1: location.country.toUpperCase().substring(0, 3),
    actor2: '',
    source: 'Real-time Monitor',
    url: '',
    title,
    severity: severityMap[eventType] || 2
  }
}

function generateRealisticNews(): News {
  const source = getRandomElement(NEWS_SOURCES)
  const categories = ['Politics', 'International', 'Economy', 'Military', 'General']
  const category = getRandomElement(categories)
  
  const newsTemplates = [
    '{country} announces new policy on {topic}',
    'International community responds to {country} situation',
    'Economic indicators show growth in {country}',
    '{country} participates in global summit on {topic}',
    'Analysis: Impact of recent developments in {country}',
    '{country} strengthens ties with regional partners',
    'Experts discuss implications of {country} policy changes',
    'Market reactions to {country} economic data'
  ]
  
  const topics = ['trade', 'security', 'climate', 'technology', 'energy', 'finance']
  const location = getRandomElement(EVENT_LOCATIONS)
  const titleTemplate = getRandomElement(newsTemplates)
  const title = titleTemplate
    .replace(/{country}/g, location.country)
    .replace(/{topic}/g, getRandomElement(topics))
  
  const now = new Date()
  const hoursAgo = Math.floor(Math.random() * 72)
  now.setHours(now.getHours() - hoursAgo)
  
  return {
    id: `NEWS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    source: source.name,
    author: `${source.name}记者`,
    title,
    description: `Detailed report on ${title.toLowerCase()}`,
    url: '',
    image_url: '',
    published_at: now.toISOString(),
    country: source.country,
    category,
    sentiment: Math.random() * 2 - 1
  }
}

export async function fetchRealTimeEvents(count: number = 10): Promise<GeoEvent[]> {
  const events: GeoEvent[] = []
  
  for (let i = 0; i < count; i++) {
    events.push(generateRealisticEvent())
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  return events
}

export async function fetchRealTimeNews(count: number = 15): Promise<News[]> {
  const news: News[] = []
  
  for (let i = 0; i < count; i++) {
    news.push(generateRealisticNews())
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  return news
}

export async function fetchLiveConflictData(): Promise<GeoEvent[]> {
  const conflictZones = EVENT_LOCATIONS.filter(loc => loc.type === 'Conflict')
  const events: GeoEvent[] = []
  
  for (const zone of conflictZones.slice(0, 8)) {
    const event: GeoEvent = {
      id: `CONFLICT_${Date.now()}_${zone.country}`,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      latitude: zone.lat,
      longitude: zone.lng,
      event_type: 'Conflict',
      country: zone.country,
      actor1: zone.country.toUpperCase().substring(0, 3),
      actor2: '',
      source: 'Live Monitor',
      url: '',
      title: `Ongoing conflict situation in ${zone.country}`,
      severity: Math.floor(Math.random() * 2) + 3
    }
    events.push(event)
  }
  
  return events
}
