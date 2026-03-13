import { useState, useEffect } from 'react'
import axios from 'axios'

export interface TechnologyData {
  country: string
  innovation_index: number
  r_d_spending: number
  patents_filed: number
  digital_economy_gdp_ratio: number
  ai_investment: number
}

export interface EnvironmentData {
  country: string
  co2_emissions: number
  renewable_energy_ratio: number
  forest_coverage: number
  air_quality_index: number
  water_quality_index: number
}

export interface EnergyData {
  country: string
  energy_production: number
  energy_consumption: number
  oil_reserves: number
  natural_gas_reserves: number
  energy_independence_ratio: number
}

export interface FoodData {
  country: string
  food_security_index: number
  grain_production: number
  grain_import_ratio: number
  agricultural_land_ratio: number
  irrigation_coverage: number
}

export interface PopulationData {
  country: string
  population: number
  population_growth_rate: number
  urbanization_rate: number
  median_age: number
  education_index: number
  life_expectancy: number
}

export interface ComprehensivePowerIndex {
  country: string
  overall_score: number
  economic_power: number
  military_power: number
  technological_power: number
  diplomatic_power: number
  soft_power: number
}

export function useTechnologyData() {
  const [data, setData] = useState<TechnologyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/technology-data')
        setData(response.data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useEnvironmentData() {
  const [data, setData] = useState<EnvironmentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/environment-data')
        setData(response.data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useEnergyData() {
  const [data, setData] = useState<EnergyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/energy-data')
        setData(response.data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useFoodData() {
  const [data, setData] = useState<FoodData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/food-data')
        setData(response.data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function usePopulationData() {
  const [data, setData] = useState<PopulationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/population-data')
        setData(response.data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useComprehensivePowerIndex() {
  const [data, setData] = useState<ComprehensivePowerIndex[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/comprehensive-power-index')
        setData(response.data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
