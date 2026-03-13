import axios from 'axios'

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

export async function fetchACLEDData(): Promise<GeoEvent[]> {
  try {
    const response = await axios.get('https://api.acleddata.com/acled/read.json', {
      params: {
        key: 'demo',
        event_type: 'Battles',
        limit: 50
      },
      timeout: 15000
    })
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map((item: any) => ({
        id: `ACLED_${item.id || item.data_id || Math.random()}`,
        timestamp: Date.now(),
        date: item.event_date || new Date().toISOString().split('T')[0],
        latitude: item.latitude || 0,
        longitude: item.longitude || 0,
        event_type: mapEventType(item.event_type),
        country: item.country || 'Unknown',
        actor1: item.actor1 || '',
        actor2: item.actor2 || '',
        source: 'ACLED',
        url: item.source || '',
        title: `${item.event_type} in ${item.country}`,
        severity: calculateSeverity(item.event_type)
      }))
    }
    
    return []
  } catch (error: any) {
    console.error('ACLED fetch error:', error.message)
    return []
  }
}

export async function fetchGTDData(): Promise<GeoEvent[]> {
  try {
    const response = await axios.get('https://www.start.umd.edu/gtd/api/Summary.aspx', {
      params: {
        format: 'json',
        txtMonth: '0',
        txtYear: new Date().getFullYear(),
        txtSummaryType: 'All'
      },
      timeout: 15000
    })
    
    if (response.data && response.data.Records) {
      return response.data.Records.map((item: any) => ({
        id: `GTD_${item.eventid || Math.random()}`,
        timestamp: Date.now(),
        date: item.iyear ? `${item.iyear}-${item.imonth || '01'}-${item.iday || '01'}` : new Date().toISOString().split('T')[0],
        latitude: item.latitude || 0,
        longitude: item.longitude || 0,
        event_type: 'Attack',
        country: item.country || 'Unknown',
        actor1: '',
        actor2: '',
        source: 'GTD',
        url: '',
        title: item.summary || `Attack in ${item.country}`,
        severity: 4
      }))
    }
    
    return []
  } catch (error: any) {
    console.error('GTD fetch error:', error.message)
    return []
  }
}

export async function fetchReliefWebData(): Promise<GeoEvent[]> {
  try {
    const response = await axios.get('https://api.reliefweb.int/v1/disasters', {
      params: {
        appid: 'demo',
        format: 'json',
        limit: 50
      },
      timeout: 15000
    })
    
    if (response.data && response.data.data) {
      return response.data.data.map((item: any) => ({
        id: `RW_${item.id || Math.random()}`,
        timestamp: Date.now(),
        date: item.date?.created || new Date().toISOString().split('T')[0],
        latitude: item.location?.lat || 0,
        longitude: item.location?.lon || 0,
        event_type: 'Disaster',
        country: item.location?.country || 'Unknown',
        actor1: '',
        actor2: '',
        source: 'ReliefWeb',
        url: item.url || '',
        title: item.title || `Disaster in ${item.location?.country}`,
        severity: 3
      }))
    }
    
    return []
  } catch (error: any) {
    console.error('ReliefWeb fetch error:', error.message)
    return []
  }
}

function mapEventType(type: string): string {
  const typeMap: Record<string, string> = {
    'Battles': 'Conflict',
    'Explosions/Remote violence': 'Violence',
    'Violence against civilians': 'Violence',
    'Riots': 'Protest',
    'Protests': 'Protest',
    'Strategic developments': 'Diplomacy'
  }
  return typeMap[type] || type || 'Unknown'
}

function calculateSeverity(type: string): number {
  if (type.includes('Battles') || type.includes('Explosions')) return 4
  if (type.includes('Violence')) return 3
  if (type.includes('Riots')) return 3
  if (type.includes('Protests')) return 2
  return 2
}
