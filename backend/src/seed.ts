import { JSONFilePreset } from 'lowdb/node'
import { existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

const dbPath = './data/db.json'
const dbDir = dirname(dbPath)
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true })
}

type Event = {
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

type RiskIndex = {
  country: string
  risk_score: number
  conflict_score: number
  economic_score: number
  political_score: number
  last_updated: number
}

type Database = {
  events: Event[]
  news: News[]
  risk_indices: RiskIndex[]
}

const defaultData: Database = {
  events: [],
  news: [],
  risk_indices: []
}

const db = await JSONFilePreset<Database>(dbPath, defaultData)

const sampleEvents: Event[] = [
  {
    id: 'EVT_001',
    timestamp: Date.now(),
    date: new Date().toISOString().split('T')[0],
    latitude: 31.0461,
    longitude: 34.8516,
    event_type: 'Conflict',
    country: 'Israel',
    actor1: 'ISR',
    actor2: 'PSE',
    source: 'GDELT',
    url: 'https://example.com/news1',
    title: 'Middle East tensions escalate',
    severity: 4
  },
  {
    id: 'EVT_002',
    timestamp: Date.now() - 86400000,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    latitude: 48.8566,
    longitude: 2.3522,
    event_type: 'Diplomacy',
    country: 'France',
    actor1: 'FRA',
    actor2: 'DEU',
    source: 'GDELT',
    url: 'https://example.com/news2',
    title: 'Franco-German summit on EU cooperation',
    severity: 1
  },
  {
    id: 'EVT_003',
    timestamp: Date.now() - 172800000,
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    latitude: 35.6762,
    longitude: 139.6503,
    event_type: 'Economic',
    country: 'Japan',
    actor1: 'JPN',
    actor2: 'USA',
    source: 'GDELT',
    url: 'https://example.com/news3',
    title: 'Japan-US trade agreement signed',
    severity: 2
  },
  {
    id: 'EVT_004',
    timestamp: Date.now() - 259200000,
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    latitude: 55.7558,
    longitude: 37.6173,
    event_type: 'Protest',
    country: 'Russia',
    actor1: 'RUS',
    actor2: 'OPP',
    source: 'GDELT',
    url: 'https://example.com/news4',
    title: 'Opposition protests in Moscow',
    severity: 3
  },
  {
    id: 'EVT_005',
    timestamp: Date.now() - 345600000,
    date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
    latitude: -23.5505,
    longitude: -46.6333,
    event_type: 'Economic',
    country: 'Brazil',
    actor1: 'BRA',
    actor2: 'ARG',
    source: 'GDELT',
    url: 'https://example.com/news5',
    title: 'Brazil-Argentina economic partnership',
    severity: 1
  },
  {
    id: 'EVT_006',
    timestamp: Date.now() - 432000000,
    date: new Date(Date.now() - 432000000).toISOString().split('T')[0],
    latitude: 28.6139,
    longitude: 77.2090,
    event_type: 'Conflict',
    country: 'India',
    actor1: 'IND',
    actor2: 'PAK',
    source: 'GDELT',
    url: 'https://example.com/news6',
    title: 'India-Pakistan border tensions',
    severity: 4
  },
  {
    id: 'EVT_007',
    timestamp: Date.now() - 518400000,
    date: new Date(Date.now() - 518400000).toISOString().split('T')[0],
    latitude: 51.5074,
    longitude: -0.1278,
    event_type: 'Diplomacy',
    country: 'United Kingdom',
    actor1: 'GBR',
    actor2: 'USA',
    source: 'GDELT',
    url: 'https://example.com/news7',
    title: 'UK-US special relationship summit',
    severity: 1
  },
  {
    id: 'EVT_008',
    timestamp: Date.now() - 604800000,
    date: new Date(Date.now() - 604800000).toISOString().split('T')[0],
    latitude: 39.9042,
    longitude: 116.4074,
    event_type: 'Economic',
    country: 'China',
    actor1: 'CHN',
    actor2: 'KOR',
    source: 'GDELT',
    url: 'https://example.com/news8',
    title: 'China-South Korea trade talks',
    severity: 2
  }
]

const sampleNews: News[] = [
  {
    id: 'NEWS_001',
    source: 'Reuters',
    author: 'John Smith',
    title: 'Global markets react to geopolitical tensions',
    description: 'Stock markets worldwide showed volatility amid rising geopolitical concerns.',
    url: 'https://reuters.com/news1',
    image_url: 'https://example.com/image1.jpg',
    published_at: new Date().toISOString(),
    country: 'US',
    category: 'general',
    sentiment: -0.3
  },
  {
    id: 'NEWS_002',
    source: 'BBC',
    author: 'Jane Doe',
    title: 'UN calls for diplomatic solution to crisis',
    description: 'United Nations Secretary-General urges all parties to return to negotiations.',
    url: 'https://bbc.com/news2',
    image_url: 'https://example.com/image2.jpg',
    published_at: new Date(Date.now() - 3600000).toISOString(),
    country: 'UK',
    category: 'general',
    sentiment: 0.2
  },
  {
    id: 'NEWS_003',
    source: 'CNN',
    author: 'Mike Johnson',
    title: 'Economic sanctions announced against rogue state',
    description: 'Western allies coordinate new round of economic measures.',
    url: 'https://cnn.com/news3',
    image_url: 'https://example.com/image3.jpg',
    published_at: new Date(Date.now() - 7200000).toISOString(),
    country: 'US',
    category: 'general',
    sentiment: -0.5
  }
]

const sampleRiskIndices: RiskIndex[] = [
  { country: 'Israel', risk_score: 85.5, conflict_score: 92.3, economic_score: 45.0, political_score: 78.5, last_updated: Date.now() },
  { country: 'Russia', risk_score: 72.8, conflict_score: 68.5, economic_score: 55.0, political_score: 82.0, last_updated: Date.now() },
  { country: 'India', risk_score: 65.2, conflict_score: 70.1, economic_score: 40.0, political_score: 65.5, last_updated: Date.now() },
  { country: 'China', risk_score: 58.3, conflict_score: 45.2, economic_score: 65.0, political_score: 70.0, last_updated: Date.now() },
  { country: 'France', risk_score: 25.1, conflict_score: 15.3, economic_score: 30.0, political_score: 35.0, last_updated: Date.now() },
  { country: 'Japan', risk_score: 32.5, conflict_score: 25.8, economic_score: 20.0, political_score: 45.0, last_updated: Date.now() },
  { country: 'Brazil', risk_score: 45.7, conflict_score: 38.2, economic_score: 50.0, political_score: 55.0, last_updated: Date.now() },
  { country: 'United Kingdom', risk_score: 28.9, conflict_score: 20.5, economic_score: 25.0, political_score: 40.0, last_updated: Date.now() }
]

db.data.events = sampleEvents
db.data.news = sampleNews
db.data.risk_indices = sampleRiskIndices

await db.write()

console.log('✅ 演示数据初始化完成！')
console.log(`- 事件：${sampleEvents.length} 条`)
console.log(`- 新闻：${sampleNews.length} 条`)
console.log(`- 风险指数：${sampleRiskIndices.length} 个国家`)
