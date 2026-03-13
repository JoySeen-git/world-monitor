import { useEffect, useState, useCallback } from 'react'
import { api, Event, News, RiskIndex, Statistics } from '../services/api'

export function useWebSocket(url: string) {
  const [connected, setConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<any>(null)

  useEffect(() => {
    const ws = new WebSocket(url)

    ws.onopen = () => {
      console.log('WebSocket connected')
      setConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastMessage(data)
      } catch (err) {
        console.error('WebSocket message parse error:', err)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setConnected(false)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      ws.close()
    }
  }, [url])

  return { connected, lastMessage }
}

export function useStatistics() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.getStatistics()
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return { stats, loading, refresh: fetchStats }
}

export function useEvents(days = 7) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = useCallback(async () => {
    try {
      const response = await api.getEvents(days)
      setEvents(response.data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    fetchEvents()
    const interval = setInterval(fetchEvents, 300000)
    return () => clearInterval(interval)
  }, [fetchEvents])

  return { events, loading, refresh: fetchEvents }
}

export function useNews(days = 3) {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNews = useCallback(async () => {
    try {
      const response = await api.getNews(days)
      setNews(response.data)
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, 180000)
    return () => clearInterval(interval)
  }, [fetchNews])

  return { news, loading, refresh: fetchNews }
}

export function useRiskIndices() {
  const [indices, setIndices] = useState<RiskIndex[]>([])
  const [loading, setLoading] = useState(true)

  const fetchIndices = useCallback(async () => {
    try {
      const response = await api.getRiskIndices()
      setIndices(response.data)
    } catch (error) {
      console.error('Failed to fetch risk indices:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIndices()
    const interval = setInterval(fetchIndices, 300000)
    return () => clearInterval(interval)
  }, [fetchIndices])

  return { indices, loading, refresh: fetchIndices }
}
