import axios from 'axios'

interface NewsItem {
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

interface GeoEvent {
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

export async function fetchChinaNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get('https://api.tianapi.com/general/index', {
      params: {
        key: 'demo',
        num: 20,
        page: 1
      },
      timeout: 8000
    })
    
    if (response.data && response.data.newslist) {
      return response.data.newslist.map((item: any) => ({
        id: item.id || `CN_${Date.now()}_${Math.random()}`,
        source: item.source || '新华网',
        author: item.author || '',
        title: item.title || '',
        description: item.digest || item.description || '',
        url: item.url || '',
        image_url: item.picurl || item.image || '',
        published_at: item.ctime || new Date().toISOString(),
        country: 'CN',
        category: 'general',
        sentiment: 0
      }))
    }
    
    return []
  } catch (error: any) {
    console.error('China news fetch error:', error.message)
    return generateDemoNews()
  }
}

export async function fetchWorldNewsFromChina(): Promise<NewsItem[]> {
  try {
    const response = await axios.get('https://api.tianapi.com/world/index', {
      params: {
        key: 'demo',
        num: 20,
        page: 1
      },
      timeout: 8000
    })
    
    if (response.data && response.data.newslist) {
      return response.data.newslist.map((item: any) => ({
        id: item.id || `WORLD_${Date.now()}_${Math.random()}`,
        source: item.source || '国际新闻',
        author: item.author || '',
        title: item.title || '',
        description: item.digest || '',
        url: item.url || '',
        image_url: item.picurl || '',
        published_at: item.ctime || new Date().toISOString(),
        country: '',
        category: 'world',
        sentiment: 0
      }))
    }
    
    return []
  } catch (error: any) {
    console.error('World news fetch error:', error.message)
    return []
  }
}

export async function fetchMilitaryNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get('https://api.tianapi.com/military/index', {
      params: {
        key: 'demo',
        num: 15,
        page: 1
      },
      timeout: 8000
    })
    
    if (response.data && response.data.newslist) {
      return response.data.newslist.map((item: any) => ({
        id: item.id || `MIL_${Date.now()}_${Math.random()}`,
        source: item.source || '军事新闻',
        author: item.author || '',
        title: item.title || '',
        description: item.digest || '',
        url: item.url || '',
        image_url: item.picurl || '',
        published_at: item.ctime || new Date().toISOString(),
        country: '',
        category: 'military',
        sentiment: 0
      }))
    }
    
    return []
  } catch (error: any) {
    console.error('Military news fetch error:', error.message)
    return []
  }
}

export async function fetchUSNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get('https://api.tianapi.com/us/index', {
      params: {
        key: 'demo',
        num: 15,
        page: 1
      },
      timeout: 8000
    })
    
    if (response.data && response.data.newslist) {
      return response.data.newslist.map((item: any) => ({
        id: item.id || `US_${Date.now()}_${Math.random()}`,
        source: item.source || '美国新闻',
        author: item.author || '',
        title: item.title || '',
        description: item.digest || '',
        url: item.url || '',
        image_url: item.picurl || '',
        published_at: item.ctime || new Date().toISOString(),
        country: 'US',
        category: 'world',
        sentiment: 0
      }))
    }
    
    return []
  } catch (error: any) {
    console.error('US news fetch error:', error.message)
    return []
  }
}

export async function fetchEUNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get('https://api.tianapi.com/eu/index', {
      params: {
        key: 'demo',
        num: 15,
        page: 1
      },
      timeout: 8000
    })
    
    if (response.data && response.data.newslist) {
      return response.data.newslist.map((item: any) => ({
        id: item.id || `EU_${Date.now()}_${Math.random()}`,
        source: item.source || '欧洲新闻',
        author: item.author || '',
        title: item.title || '',
        description: item.digest || '',
        url: item.url || '',
        image_url: item.picurl || '',
        published_at: item.ctime || new Date().toISOString(),
        country: '',
        category: 'world',
        sentiment: 0
      }))
    }
    
    return []
  } catch (error: any) {
    console.error('EU news fetch error:', error.message)
    return []
  }
}

function generateDemoNews(): NewsItem[] {
  const demoNews: NewsItem[] = [
    {
      id: `DEMO_${Date.now()}_1`,
      source: 'Reuters',
      author: 'John Smith',
      title: 'Middle East tensions rise amid diplomatic talks',
      description: 'Regional powers meet to discuss ongoing conflicts and humanitarian crisis.',
      url: 'https://reuters.com/demo1',
      image_url: '',
      published_at: new Date().toISOString(),
      country: 'US',
      category: 'world',
      sentiment: -0.3
    },
    {
      id: `DEMO_${Date.now()}_2`,
      source: 'BBC',
      author: 'Jane Doe',
      title: 'UN Security Council convenes emergency session',
      description: 'Global leaders call for immediate ceasefire and diplomatic solution.',
      url: 'https://bbc.com/demo2',
      image_url: '',
      published_at: new Date(Date.now() - 3600000).toISOString(),
      country: 'UK',
      category: 'world',
      sentiment: 0.1
    },
    {
      id: `DEMO_${Date.now()}_3`,
      source: 'Al Jazeera',
      author: 'Ahmed Ali',
      title: 'Economic sanctions impact global markets',
      description: 'Stock markets worldwide react to new trade restrictions.',
      url: 'https://aljazeera.com/demo3',
      image_url: '',
      published_at: new Date(Date.now() - 7200000).toISOString(),
      country: 'QA',
      category: 'economy',
      sentiment: -0.5
    },
    {
      id: `DEMO_${Date.now()}_4`,
      source: 'Xinhua',
      author: 'Wang Li',
      title: 'China calls for peaceful resolution to regional conflicts',
      description: 'Foreign ministry emphasizes diplomacy and dialogue.',
      url: 'https://xinhua.com/demo4',
      image_url: '',
      published_at: new Date(Date.now() - 10800000).toISOString(),
      country: 'CN',
      category: 'world',
      sentiment: 0.2
    },
    {
      id: `DEMO_${Date.now()}_5`,
      source: 'AFP',
      author: 'Pierre Martin',
      title: 'European leaders discuss energy security',
      description: 'EU summit focuses on reducing dependence and finding alternatives.',
      url: 'https://afp.com/demo5',
      image_url: '',
      published_at: new Date(Date.now() - 14400000).toISOString(),
      country: 'FR',
      category: 'economy',
      sentiment: -0.1
    }
  ]
  
  return demoNews
}

export async function generateDemoGeoEvents(): Promise<GeoEvent[]> {
  const demoEvents: GeoEvent[] = [
    {
      id: `DEMO_EVT_${Date.now()}_1`,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      latitude: 33.5138,
      longitude: 36.2765,
      event_type: 'Conflict',
      country: 'Syria',
      actor1: 'SYR',
      actor2: 'OPP',
      source: 'Demo',
      url: '',
      title: 'Clashes reported in northern Syria',
      severity: 4
    },
    {
      id: `DEMO_EVT_${Date.now()}_2`,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      latitude: 48.3794,
      longitude: 31.1656,
      event_type: 'Conflict',
      country: 'Ukraine',
      actor1: 'UKR',
      actor2: 'RUS',
      source: 'Demo',
      url: '',
      title: 'Continued fighting in eastern Ukraine',
      severity: 4
    },
    {
      id: `DEMO_EVT_${Date.now()}_3`,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      latitude: 31.7683,
      longitude: 35.2137,
      event_type: 'Protest',
      country: 'Palestine',
      actor1: 'PSE',
      actor2: '',
      source: 'Demo',
      url: '',
      title: 'Protests in West Bank cities',
      severity: 3
    },
    {
      id: `DEMO_EVT_${Date.now()}_4`,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      latitude: 34.0479,
      longitude: -118.2584,
      event_type: 'Diplomacy',
      country: 'United States',
      actor1: 'USA',
      actor2: 'CHN',
      source: 'Demo',
      url: '',
      title: 'US-China diplomatic talks scheduled',
      severity: 1
    },
    {
      id: `DEMO_EVT_${Date.now()}_5`,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      latitude: 48.8566,
      longitude: 2.3522,
      event_type: 'Diplomacy',
      country: 'France',
      actor1: 'FRA',
      actor2: 'DEU',
      source: 'Demo',
      url: '',
      title: 'Franco-German summit on EU cooperation',
      severity: 1
    },
    {
      id: `DEMO_EVT_${Date.now()}_6`,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      latitude: 28.6139,
      longitude: 77.2090,
      event_type: 'Protest',
      country: 'India',
      actor1: 'IND',
      actor2: '',
      source: 'Demo',
      url: '',
      title: 'Farmers protest in New Delhi',
      severity: 2
    },
    {
      id: `DEMO_EVT_${Date.now()}_7`,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      latitude: 35.6762,
      longitude: 139.6503,
      event_type: 'Economic',
      country: 'Japan',
      actor1: 'JPN',
      actor2: 'KOR',
      source: 'Demo',
      url: '',
      title: 'Japan-South Korea trade agreement',
      severity: 1
    },
    {
      id: `DEMO_EVT_${Date.now()}_8`,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      latitude: -23.5505,
      longitude: -46.6333,
      event_type: 'Economic',
      country: 'Brazil',
      actor1: 'BRA',
      actor2: 'ARG',
      source: 'Demo',
      url: '',
      title: 'Brazil-Argentina economic partnership',
      severity: 1
    }
  ]
  
  return demoEvents
}
