import express from 'express'
import cors from 'cors'
import { WebSocketServer } from 'ws'
import http from 'http'
import dotenv from 'dotenv'
import axios from 'axios'
import cron from 'node-cron'
import { JSONFilePreset } from 'lowdb/node'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { fetchRSSNews, NewsItem } from './services/rssService'
import { fetchACLEDData, fetchGTDData, fetchReliefWebData } from './services/geoEventService'
import { 
  fetchChinaNews, 
  fetchWorldNewsFromChina, 
  fetchMilitaryNews, 
  fetchUSNews, 
  fetchEUNews,
  generateDemoGeoEvents 
} from './services/freeNewsService'
import { getEconomicIndicators, CountryData } from './services/economicDataService'
import { fetchRealTimeEvents, fetchRealTimeNews, fetchLiveConflictData } from './services/enhancedDataService'
import {
  fetchTechnologyData,
  fetchEnvironmentData,
  fetchEnergyData,
  fetchFoodData,
  fetchPopulationData,
  fetchComprehensivePowerIndex
} from './services/multiDimensionDataService'
import {
  fetchComprehensiveEvents,
  fetchComprehensiveNews,
  fetchComprehensiveEconomicData,
  fetchComprehensiveRiskIndices,
  fetchComprehensiveMultiDimensionData,
  generateComprehensiveDemoData
} from './services/comprehensiveDataService'
import { fetchAllEconomicData } from './services/realDataService'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || 'localhost'

app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const wss = new WebSocketServer({ server, path: '/ws' })

const clients = new Set()

wss.on('connection', (ws: any) => {
  clients.add(ws)
  console.log('Client connected. Total clients:', clients.size)
  
  ws.on('close', () => {
    clients.delete(ws)
    console.log('Client disconnected. Total clients:', clients.size)
  })
})

function broadcast(data: any) {
  clients.forEach((client: any) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data))
    }
  })
}

const dbPath = process.env.DB_PATH || './data/db.json'
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
  military_score: number
  last_updated: number
}

type EconomicData = CountryData

type Database = {
  events: Event[]
  news: News[]
  risk_indices: RiskIndex[]
  economic_data: EconomicData[]
}

const defaultData: Database = {
  events: [],
  news: [],
  risk_indices: [],
  economic_data: []
}

const db = await JSONFilePreset<Database>(dbPath, defaultData)

function calculateSeverity(quadCategory: string): number {
  if (quadCategory.includes('Conflict')) return 4
  if (quadCategory.includes('Protest')) return 3
  if (quadCategory.includes('Riot')) return 3
  if (quadCategory.includes('Violence')) return 4
  if (quadCategory.includes('Cooperation')) return 1
  if (quadCategory.includes('Yield')) return 2
  return 2
}

async function fetchGDELTData() {
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)
    
    const params = {
      query: '(Language:"English")',
      timespan: 'FullDayRange',
      startdate: startDate.toISOString().split('T')[0],
      enddate: endDate.toISOString().split('T')[0],
      format: 'JSON',
      maxrecords: '100'
    }
    
    const response = await axios.get(process.env.GDELT_API_URL || 'https://api.gdeltproject.org/api/v2/doc/doc', {
      params,
      timeout: 30000
    })
    
    if (response.data && response.data.articles) {
      const newEvents: Event[] = []
      
      for (const article of response.data.articles) {
        try {
          const severity = calculateSeverity(article.QuadCategory || '')
          
          newEvents.push({
            id: article.EventId || `ARTICLE_${Date.now()}_${Math.random()}`,
            timestamp: Date.now(),
            date: article.Day || new Date().toISOString().split('T')[0],
            latitude: article.Latitude || 0,
            longitude: article.Longitude || 0,
            event_type: article.EventType || 'UNKNOWN',
            country: article.Country || 'UNKNOWN',
            actor1: article.Actor1Code || '',
            actor2: article.Actor2Code || '',
            source: 'GDELT',
            url: article.SourceUrl || '',
            title: article.ArticleTitle || '',
            severity
          })
        } catch (err) {
          console.error('Error processing GDELT event:', err)
        }
      }
      
      await db.data.events.unshift(...newEvents)
      db.data.events = db.data.events.slice(0, 1000)
      await db.write()
      
      console.log(`Inserted ${newEvents.length} GDELT events`)
      broadcast({ type: 'events_updated', count: newEvents.length })
    }
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.log('GDELT API 限流，使用缓存数据')
    } else {
      console.error('GDELT fetch error:', error.message)
    }
  }
}

async function fetchNewsSources() {
  try {
    console.log('Fetching China news...')
    const chinaNews = await fetchChinaNews()
    const worldNews = await fetchWorldNewsFromChina()
    const militaryNews = await fetchMilitaryNews()
    const usNews = await fetchUSNews()
    const euNews = await fetchEUNews()
    
    const allNews = [...chinaNews, ...worldNews, ...militaryNews, ...usNews, ...euNews]
    
    if (allNews.length > 0) {
      for (const news of allNews) {
        try {
          const exists = db.data.news.find(n => n.url === news.url)
          if (!exists) {
            db.data.news.unshift(news)
          }
        } catch (err) {
          console.error('Error inserting news:', err)
        }
      }
      
      db.data.news = db.data.news.slice(0, 500)
      await db.write()
      console.log(`Inserted ${allNews.length} news items from free APIs`)
      broadcast({ type: 'news_updated', count: allNews.length })
    }
  } catch (error: any) {
    console.error('News fetch error:', error.message)
  }
}

async function fetchGeoEvents() {
  try {
    console.log('Generating demo geo events...')
    const demoEvents = await generateDemoGeoEvents()
    
    if (demoEvents.length > 0) {
      for (const event of demoEvents) {
        try {
          const exists = db.data.events.find(e => e.id === event.id)
          if (!exists) {
            db.data.events.unshift(event)
          }
        } catch (err) {
          console.error('Error inserting demo event:', err)
        }
      }
      
      db.data.events = db.data.events.slice(0, 1000)
      await db.write()
      console.log(`Inserted ${demoEvents.length} demo geo events`)
      broadcast({ type: 'events_updated', count: demoEvents.length })
    }
  } catch (error: any) {
    console.error('Demo events fetch error:', error.message)
  }
}

function calculateRiskIndices() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]
  
  const recentEvents = db.data.events.filter(e => e.date >= sevenDaysAgoStr)
  
  const countryStats = new Map<string, { total: number; severitySum: number; conflictCount: number }>()
  
  for (const event of recentEvents) {
    if (!countryStats.has(event.country)) {
      countryStats.set(event.country, { total: 0, severitySum: 0, conflictCount: 0 })
    }
    const stats = countryStats.get(event.country)!
    stats.total++
    stats.severitySum += event.severity
    if (event.event_type.includes('Conflict') || event.event_type.includes('Violence')) {
      stats.conflictCount++
    }
  }
  
  const newIndices: RiskIndex[] = []
  
  for (const [country, stats] of countryStats) {
    if (stats.total >= 1) {
      const conflictScore = Math.min(100, (stats.conflictCount / stats.total) * 100 * (stats.severitySum / stats.total / 4))
      const riskScore = conflictScore * 0.6 + (stats.total / 10) * 0.4
      
      newIndices.push({
        country,
        risk_score: Math.min(100, riskScore),
        conflict_score: Math.min(100, conflictScore),
        military_score: 50,
        economic_score: 50,
        political_score: 50,
        last_updated: Date.now()
      })
    }
  }
  
  db.data.risk_indices = newIndices
  db.write()
  
  console.log(`Calculated risk indices for ${newIndices.length} countries`)
  broadcast({ type: 'risk_indices_updated' })
}

app.get('/api/events', (req, res) => {
  const { days = 7, type, country, limit = 100 } = req.query
  
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - Number(days))
  const cutoffStr = cutoffDate.toISOString().split('T')[0]
  
  let filtered = db.data.events.filter(e => e.date >= cutoffStr)
  
  if (type) {
    filtered = filtered.filter(e => e.event_type.includes(type as string))
  }
  
  if (country) {
    filtered = filtered.filter(e => e.country === country)
  }
  
  filtered.sort((a, b) => b.timestamp - a.timestamp)
  filtered = filtered.slice(0, Number(limit))
  
  res.json(filtered)
})

app.get('/api/news', (req, res) => {
  const { days = 3, category, limit = 50 } = req.query
  
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - Number(days))
  
  let filtered = db.data.news.filter(n => new Date(n.published_at) >= cutoffDate)
  
  if (category) {
    filtered = filtered.filter(n => n.category === category)
  }
  
  filtered.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
  filtered = filtered.slice(0, Number(limit))
  
  res.json(filtered)
})

app.get('/api/risk-indices', (req, res) => {
  const indices = [...db.data.risk_indices].sort((a, b) => b.risk_score - a.risk_score)
  res.json(indices)
})

app.get('/api/economic-data', (req, res) => {
  res.json(db.data.economic_data)
})

// 多维度数据 API
app.get('/api/technology-data', async (req, res) => {
  const data = await fetchTechnologyData()
  res.json(data)
})

app.get('/api/environment-data', async (req, res) => {
  const data = await fetchEnvironmentData()
  res.json(data)
})

app.get('/api/energy-data', async (req, res) => {
  const data = await fetchEnergyData()
  res.json(data)
})

app.get('/api/food-data', async (req, res) => {
  const data = await fetchFoodData()
  res.json(data)
})

app.get('/api/population-data', async (req, res) => {
  const data = await fetchPopulationData()
  res.json(data)
})

app.get('/api/comprehensive-power-index', async (req, res) => {
  const data = await fetchComprehensivePowerIndex()
  res.json(data)
})

app.get('/api/statistics', (req, res) => {
  const totalEvents = db.data.events.length
  const countriesInvolved = new Set(db.data.events.map(e => e.country)).size
  const totalNews = db.data.news.length
  const avgSeverity = db.data.events.length > 0
    ? db.data.events.reduce((sum, e) => sum + e.severity, 0) / db.data.events.length
    : 0

  const eventsByType = db.data.events.reduce((acc, event) => {
    const type = event.event_type
    const found = acc.find(item => item.name === type)
    if (found) {
      found.count += 1
    } else {
      acc.push({ name: type, count: 1 })
    }
    return acc
  }, [] as Array<{ name: string; count: number }>)

  res.json({
    totalEvents,
    countriesInvolved,
    totalNews,
    avgSeverity,
    eventsByType
  })
})

async function fetchEconomicData() {
  try {
    console.log('Fetching economic indicators from World Bank, UN, etc...')
    const economicData = await getEconomicIndicators()
    
    if (economicData.length > 0) {
      db.data.economic_data = economicData
      await db.write()
      console.log(`Updated economic data for ${economicData.length} countries`)
      broadcast({ type: 'economic_data_updated', count: economicData.length })
    }
  } catch (error: any) {
    console.error('Economic data fetch error:', error.message)
  }
}

app.get('/api/statistics', (req, res) => {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]
  
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  
  const totalEvents = db.data.events.filter(e => e.date >= sevenDaysAgoStr).length
  const totalNews = db.data.news.filter(n => new Date(n.published_at) >= threeDaysAgo).length
  
  const countries = new Set(db.data.events.filter(e => e.date >= sevenDaysAgoStr).map(e => e.country))
  const countriesInvolved = countries.size
  
  const recentEvents = db.data.events.filter(e => e.date >= sevenDaysAgoStr)
  const avgSeverity = recentEvents.length > 0
    ? recentEvents.reduce((sum, e) => sum + e.severity, 0) / recentEvents.length
    : 0
  
  const typeCount = new Map<string, number>()
  for (const event of recentEvents) {
    typeCount.set(event.event_type, (typeCount.get(event.event_type) || 0) + 1)
  }
  
  const eventsByType = Array.from(typeCount.entries())
    .map(([event_type, count]) => ({ event_type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
  
  res.json({
    totalEvents,
    totalNews,
    countriesInvolved,
    avgSeverity,
    eventsByType
  })
})

app.get('/api/heatmap', (req, res) => {
  const { days = 7 } = req.query
  
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - Number(days))
  const cutoffStr = cutoffDate.toISOString().split('T')[0]
  
  const recentEvents = db.data.events.filter(e => 
    e.date >= cutoffStr && 
    e.latitude !== 0 && 
    e.longitude !== 0
  )
  
  const heatmapMap = new Map<string, { latitude: number; longitude: number; event_type: string; severity: number; intensity: number }>()
  
  for (const event of recentEvents) {
    const key = `${event.latitude.toFixed(2)},${event.longitude.toFixed(2)}`
    if (!heatmapMap.has(key)) {
      heatmapMap.set(key, {
        latitude: event.latitude,
        longitude: event.longitude,
        event_type: event.event_type,
        severity: event.severity,
        intensity: 0
      })
    }
    const entry = heatmapMap.get(key)!
    entry.intensity++
    entry.severity = Math.max(entry.severity, event.severity)
  }
  
  const heatmap = Array.from(heatmapMap.values())
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 500)
  
  res.json(heatmap)
})

cron.schedule('*/5 * * * *', async () => {
  console.log('Running scheduled comprehensive data update...')
  
  // 使用综合数据服务更新
  const newData = generateComprehensiveDemoData()
  
  // 保留历史数据，添加新数据
  db.data.events = [...newData.events, ...db.data.events].slice(0, 1000)
  db.data.news = [...newData.news, ...db.data.news].slice(0, 500)
  db.data.risk_indices = newData.riskIndices
  
  // 更新经济数据（尝试获取真实数据）
  try {
    const realEconomicData = await fetchAllEconomicData()
    if (realEconomicData && realEconomicData.length > 0) {
      db.data.economic_data = realEconomicData
      console.log('✅ Updated with real economic data')
    }
  } catch (error: any) {
    console.error('Error fetching real economic data:', error.message)
  }
  
  await db.write()
  
  broadcast({ 
    type: 'comprehensive_update', 
    events: db.data.events.length,
    news: db.data.news.length,
    risk_indices: db.data.risk_indices.length,
    economic_data: db.data.economic_data.length
  })
  
  console.log('✅ Comprehensive data update completed')
})

server.listen(Number(PORT), HOST, () => {
  console.log(`🌍 World Monitor Backend running at http://${HOST}:${PORT}`)
  console.log(`📡 WebSocket endpoint: ws://${HOST}:${PORT}/ws`)
  
  console.log('Initializing comprehensive data sources...')
  
  // 使用综合数据服务初始化
  const comprehensiveData = generateComprehensiveDemoData()
  
  // 初始化事件数据
  db.data.events = comprehensiveData.events
  db.data.news = comprehensiveData.news
  db.data.risk_indices = comprehensiveData.riskIndices
  
  // 使用真实经济数据
  console.log('Fetching real economic data from World Bank and other sources...')
  fetchAllEconomicData().then(realEconomicData => {
    if (realEconomicData && realEconomicData.length > 0) {
      db.data.economic_data = realEconomicData
      console.log(`✅ Loaded ${realEconomicData.length} real economic data points`)
    } else {
      db.data.economic_data = comprehensiveData.economicData as any
      console.log(`✅ Loaded ${comprehensiveData.economicData.length} demo economic data points`)
    }
    
    db.write()
    
    console.log(`✅ Loaded ${db.data.events.length} events`)
    console.log(`✅ Loaded ${db.data.news.length} news items`)
    console.log(`✅ Loaded ${db.data.risk_indices.length} risk indices`)
    console.log(`✅ Loaded ${db.data.economic_data.length} economic data points`)
    
    broadcast({ 
      type: 'data_initialized', 
      events: db.data.events.length,
      news: db.data.news.length,
      risk_indices: db.data.risk_indices.length,
      economic_data: db.data.economic_data.length
    })
    
    // 继续运行定时任务
    console.log('Starting scheduled data updates...')
  }).catch(error => {
    console.error('Error loading economic data:', error)
    db.data.economic_data = comprehensiveData.economicData as any
    db.write()
  })
})
