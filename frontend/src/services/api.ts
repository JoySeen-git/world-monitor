import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export interface Event {
  id: number
  event_id: string
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

export interface News {
  id: number
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

export interface RiskIndex {
  id: number
  country: string
  risk_score: number
  conflict_score: number
  economic_score: number
  political_score: number
  last_updated: number
}

export interface Statistics {
  totalEvents: number
  totalNews: number
  countriesInvolved: number
  avgSeverity: number
  eventsByType: Array<{ event_type: string; count: number }>
}

export const api = {
  getEvents: (days = 7, type?: string, country?: string, limit = 100) =>
    axios.get<Event[]>(`${API_BASE}/events`, { params: { days, type, country, limit } }),

  getNews: (days = 3, category?: string, limit = 50) =>
    axios.get<News[]>(`${API_BASE}/news`, { params: { days, category, limit } }),

  getRiskIndices: () =>
    axios.get<RiskIndex[]>(`${API_BASE}/risk-indices`),

  getStatistics: () =>
    axios.get<Statistics>(`${API_BASE}/statistics`),

  getHeatmap: (days = 7) =>
    axios.get<Array<{ latitude: number; longitude: number; event_type: string; severity: number; intensity: number }>>(
      `${API_BASE}/heatmap`,
      { params: { days } }
    )
}
