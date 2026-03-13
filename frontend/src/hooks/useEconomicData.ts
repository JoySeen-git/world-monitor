import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = 'http://localhost:3001/api'

export interface EconomicData {
  country: string
  code: string
  population?: number
  gdp?: number
  gdp_growth?: number
  inflation?: number
  unemployment?: number
  military_expenditure?: number
  political_stability?: number
  corruption_index?: number
  human_development?: number
  year: number
}

export function useEconomicData() {
  const [data, setData] = useState<EconomicData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE}/economic-data`)
        setData(response.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useEconomicRankings() {
  const { data, loading, error } = useEconomicData()

  const gdpRanking = [...data]
    .filter(item => (item as any).gdp_usd_billions !== undefined)
    .sort((a, b) => ((a as any).gdp_usd_billions || 0) - ((b as any).gdp_usd_billions || 0))
    .map(item => ({
      country: item.country,
      gdp: (item as any).gdp_usd_billions
    }))
    .slice(0, 20)

  const gdpGrowthRanking = [...data]
    .filter(item => (item as any).gdp_growth_percent !== undefined)
    .sort((a, b) => ((a as any).gdp_growth_percent || 0) - ((b as any).gdp_growth_percent || 0))
    .map(item => ({
      country: item.country,
      gdp_growth: (item as any).gdp_growth_percent
    }))
    .slice(0, 20)

  const militaryRanking = [...data]
    .filter(item => (item as any).military_spending_usd_billions !== undefined)
    .sort((a, b) => ((a as any).military_spending_usd_billions || 0) - ((b as any).military_spending_usd_billions || 0))
    .map(item => ({
      country: item.country,
      military_expenditure: (item as any).military_spending_usd_billions
    }))
    .slice(0, 20)

  const politicalStabilityRanking = [...data]
    .filter(item => (item as any).political_stability_percent !== undefined)
    .sort((a, b) => ((a as any).political_stability_percent || 0) - ((b as any).political_stability_percent || 0))
    .map(item => ({
      country: item.country,
      political_stability: (item as any).political_stability_percent
    }))
    .slice(0, 20)

  const corruptionRanking = [...data]
    .filter(item => (item as any).corruption_index !== undefined)
    .sort((a, b) => ((a as any).corruption_index || 0) - ((b as any).corruption_index || 0))
    .slice(0, 20)

  return {
    gdpRanking,
    gdpGrowthRanking,
    militaryRanking,
    politicalStabilityRanking,
    corruptionRanking,
    loading,
    error
  }
}
