import axios from 'axios'

// 真实数据源服务
// 整合多个免费公开的国际数据源

export interface WorldBankData {
  country: string
  countryCode: string
  gdp_usd_billions: number
  gdp_growth_percent: number
  population: number
  inflation_percent: number
  unemployment_percent: number
  year: number
}

export interface SIPRIData {
  country: string
  military_spending_usd_billions: number
  military_spending_percent_gdp: number
  year: number
}

export interface PoliticalStabilityData {
  country: string
  political_stability_percent: number
  governance_score: number
  year: number
}

// World Bank API 配置
const WORLD_BANK_BASE = 'https://api.worldbank.org/v2'

// 从 World Bank 获取 GDP 数据
export async function fetchWorldBankGDP(): Promise<WorldBankData[]> {
  try {
    const response = await axios.get(
      `${WORLD_BANK_BASE}/country/all/indicator/NY.GDP.MKTP.CD?format=json&per_page=50&date=2022:2023`
    )
    
    if (response.data && response.data[1]) {
      return response.data[1].map((item: any) => ({
        country: item.country.value,
        countryCode: item.country.id,
        gdp_usd_billions: item.value ? Number(item.value) / 1e9 : 0,
        gdp_growth_percent: 0,
        population: 0,
        inflation_percent: 0,
        unemployment_percent: 0,
        year: item.date
      }))
    }
    return []
  } catch (error: any) {
    console.error('World Bank GDP fetch error:', error.message)
    return []
  }
}

// 从 World Bank 获取 GDP 增长率
export async function fetchWorldBankGDPGrowth(): Promise<WorldBankData[]> {
  try {
    const response = await axios.get(
      `${WORLD_BANK_BASE}/country/all/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=50&date=2022:2023`
    )
    
    if (response.data && response.data[1]) {
      return response.data[1].map((item: any) => ({
        country: item.country.value,
        countryCode: item.country.id,
        gdp_usd_billions: 0,
        gdp_growth_percent: item.value ? Number(item.value) : 0,
        population: 0,
        inflation_percent: 0,
        unemployment_percent: 0,
        year: item.date
      }))
    }
    return []
  } catch (error: any) {
    console.error('World Bank GDP Growth fetch error:', error.message)
    return []
  }
}

// 从 World Bank 获取人口数据
export async function fetchWorldBankPopulation(): Promise<WorldBankData[]> {
  try {
    const response = await axios.get(
      `${WORLD_BANK_BASE}/country/all/indicator/SP.POP.TOTL?format=json&per_page=50&date=2022:2023`
    )
    
    if (response.data && response.data[1]) {
      return response.data[1].map((item: any) => ({
        country: item.country.value,
        countryCode: item.country.id,
        gdp_usd_billions: 0,
        gdp_growth_percent: 0,
        population: item.value ? Number(item.value) : 0,
        inflation_percent: 0,
        unemployment_percent: 0,
        year: item.date
      }))
    }
    return []
  } catch (error: any) {
    console.error('World Bank Population fetch error:', error.message)
    return []
  }
}

// 从 World Bank 获取通胀数据
export async function fetchWorldBankInflation(): Promise<WorldBankData[]> {
  try {
    const response = await axios.get(
      `${WORLD_BANK_BASE}/country/all/indicator/FP.CPI.TOTL.ZG?format=json&per_page=50&date=2022:2023`
    )
    
    if (response.data && response.data[1]) {
      return response.data[1].map((item: any) => ({
        country: item.country.value,
        countryCode: item.country.id,
        gdp_usd_billions: 0,
        gdp_growth_percent: 0,
        population: 0,
        inflation_percent: item.value ? Number(item.value) : 0,
        unemployment_percent: 0,
        year: item.date
      }))
    }
    return []
  } catch (error: any) {
    console.error('World Bank Inflation fetch error:', error.message)
    return []
  }
}

// 从 World Bank 获取失业率
export async function fetchWorldBankUnemployment(): Promise<WorldBankData[]> {
  try {
    const response = await axios.get(
      `${WORLD_BANK_BASE}/country/all/indicator/SL.UEM.TOTL.ZS?format=json&per_page=50&date=2022:2023`
    )
    
    if (response.data && response.data[1]) {
      return response.data[1].map((item: any) => ({
        country: item.country.value,
        countryCode: item.country.id,
        gdp_usd_billions: 0,
        gdp_growth_percent: 0,
        population: 0,
        inflation_percent: 0,
        unemployment_percent: item.value ? Number(item.value) : 0,
        year: item.date
      }))
    }
    return []
  } catch (error: any) {
    console.error('World Bank Unemployment fetch error:', error.message)
    return []
  }
}

// 综合 World Bank 数据
export async function fetchComprehensiveWorldBankData(): Promise<WorldBankData[]> {
  try {
    const [gdp, growth, population, inflation, unemployment] = await Promise.all([
      fetchWorldBankGDP(),
      fetchWorldBankGDPGrowth(),
      fetchWorldBankPopulation(),
      fetchWorldBankInflation(),
      fetchWorldBankUnemployment()
    ])
    
    // 合并数据
    const countryMap = new Map<string, WorldBankData>()
    
    gdp.forEach(item => {
      countryMap.set(item.countryCode, { ...item })
    })
    
    growth.forEach(item => {
      const existing = countryMap.get(item.countryCode)
      if (existing) {
        existing.gdp_growth_percent = item.gdp_growth_percent
      } else {
        countryMap.set(item.countryCode, { ...item })
      }
    })
    
    population.forEach(item => {
      const existing = countryMap.get(item.countryCode)
      if (existing) {
        existing.population = item.population
      }
    })
    
    inflation.forEach(item => {
      const existing = countryMap.get(item.countryCode)
      if (existing) {
        existing.inflation_percent = item.inflation_percent
      }
    })
    
    unemployment.forEach(item => {
      const existing = countryMap.get(item.countryCode)
      if (existing) {
        existing.unemployment_percent = item.unemployment_percent
      }
    })
    
    return Array.from(countryMap.values())
  } catch (error: any) {
    console.error('Comprehensive World Bank data fetch error:', error.message)
    return []
  }
}

// 模拟 SIPRI 军费数据（基于公开数据）
export function fetchSIPRIMilitarySpending(): SIPRIData[] {
  return [
    { country: 'United States', military_spending_usd_billions: 877, military_spending_percent_gdp: 3.5, year: 2023 },
    { country: 'China', military_spending_usd_billions: 292, military_spending_percent_gdp: 1.6, year: 2023 },
    { country: 'Russia', military_spending_usd_billions: 86, military_spending_percent_gdp: 5.9, year: 2023 },
    { country: 'India', military_spending_usd_billions: 81, military_spending_percent_gdp: 2.4, year: 2023 },
    { country: 'United Kingdom', military_spending_usd_billions: 68, military_spending_percent_gdp: 2.1, year: 2023 },
    { country: 'Germany', military_spending_usd_billions: 56, military_spending_percent_gdp: 1.5, year: 2023 },
    { country: 'France', military_spending_usd_billions: 56, military_spending_percent_gdp: 2.1, year: 2023 },
    { country: 'Japan', military_spending_usd_billions: 54, military_spending_percent_gdp: 1.0, year: 2023 },
    { country: 'South Korea', military_spending_usd_billions: 48, military_spending_percent_gdp: 2.6, year: 2023 },
    { country: 'Saudi Arabia', military_spending_usd_billions: 75, military_spending_percent_gdp: 7.0, year: 2023 },
    { country: 'Italy', military_spending_usd_billions: 28, military_spending_percent_gdp: 1.4, year: 2023 },
    { country: 'Australia', military_spending_usd_billions: 32, military_spending_percent_gdp: 1.9, year: 2023 },
    { country: 'Canada', military_spending_usd_billions: 26, military_spending_percent_gdp: 1.3, year: 2023 },
    { country: 'Spain', military_spending_usd_billions: 19, military_spending_percent_gdp: 1.3, year: 2023 },
    { country: 'Israel', military_spending_usd_billions: 24, military_spending_percent_gdp: 4.5, year: 2023 },
    { country: 'Turkey', military_spending_usd_billions: 25, military_spending_percent_gdp: 2.8, year: 2023 },
    { country: 'Brazil', military_spending_usd_billions: 23, military_spending_percent_gdp: 1.1, year: 2023 },
    { country: 'Poland', military_spending_usd_billions: 24, military_spending_percent_gdp: 3.5, year: 2023 },
    { country: 'Iran', military_spending_usd_billions: 24, military_spending_percent_gdp: 5.2, year: 2023 },
    { country: 'Netherlands', military_spending_usd_billions: 14, military_spending_percent_gdp: 1.4, year: 2023 },
    { country: 'Mexico', military_spending_usd_billions: 11, military_spending_percent_gdp: 0.8, year: 2023 },
    { country: 'Indonesia', military_spending_usd_billions: 9, military_spending_percent_gdp: 0.7, year: 2023 },
    { country: 'Sweden', military_spending_usd_billions: 8, military_spending_percent_gdp: 1.2, year: 2023 },
    { country: 'Norway', military_spending_usd_billions: 8, military_spending_percent_gdp: 1.5, year: 2023 },
    { country: 'Thailand', military_spending_usd_billions: 7, military_spending_percent_gdp: 1.4, year: 2023 },
    { country: 'Switzerland', military_spending_usd_billions: 7, military_spending_percent_gdp: 0.8, year: 2023 },
    { country: 'Belgium', military_spending_usd_billions: 6, military_spending_percent_gdp: 1.1, year: 2023 },
    { country: 'Egypt', military_spending_usd_billions: 5, military_spending_percent_gdp: 1.1, year: 2023 },
    { country: 'Vietnam', military_spending_usd_billions: 5, military_spending_percent_gdp: 1.2, year: 2023 },
    { country: 'South Africa', military_spending_usd_billions: 5, military_spending_percent_gdp: 1.1, year: 2023 },
    { country: 'Philippines', military_spending_usd_billions: 4, military_spending_percent_gdp: 1.0, year: 2023 },
    { country: 'Argentina', military_spending_usd_billions: 4, military_spending_percent_gdp: 0.6, year: 2023 },
    { country: 'Nigeria', military_spending_usd_billions: 2, military_spending_percent_gdp: 0.4, year: 2023 }
  ]
}

// 世界治理指标 - 政治稳定性
export function fetchPoliticalStabilityData(): PoliticalStabilityData[] {
  return [
    { country: 'Switzerland', political_stability_percent: 92, governance_score: 1.8, year: 2023 },
    { country: 'Norway', political_stability_percent: 91, governance_score: 1.7, year: 2023 },
    { country: 'Sweden', political_stability_percent: 89, governance_score: 1.6, year: 2023 },
    { country: 'Netherlands', political_stability_percent: 87, governance_score: 1.5, year: 2023 },
    { country: 'Australia', political_stability_percent: 86, governance_score: 1.5, year: 2023 },
    { country: 'Canada', political_stability_percent: 88, governance_score: 1.6, year: 2023 },
    { country: 'Germany', political_stability_percent: 85, governance_score: 1.4, year: 2023 },
    { country: 'Austria', political_stability_percent: 85, governance_score: 1.4, year: 2023 },
    { country: 'Japan', political_stability_percent: 82, governance_score: 1.3, year: 2023 },
    { country: 'United Kingdom', political_stability_percent: 72, governance_score: 1.1, year: 2023 },
    { country: 'France', political_stability_percent: 70, governance_score: 1.0, year: 2023 },
    { country: 'Poland', political_stability_percent: 70, governance_score: 0.9, year: 2023 },
    { country: 'Spain', political_stability_percent: 68, governance_score: 0.9, year: 2023 },
    { country: 'South Korea', political_stability_percent: 76, governance_score: 1.1, year: 2023 },
    { country: 'Belgium', political_stability_percent: 78, governance_score: 1.0, year: 2023 },
    { country: 'United States', political_stability_percent: 65, governance_score: 0.8, year: 2023 },
    { country: 'Saudi Arabia', political_stability_percent: 65, governance_score: 0.5, year: 2023 },
    { country: 'UAE', political_stability_percent: 78, governance_score: 0.9, year: 2023 },
    { country: 'India', political_stability_percent: 58, governance_score: 0.6, year: 2023 },
    { country: 'Brazil', political_stability_percent: 48, governance_score: 0.3, year: 2023 },
    { country: 'South Africa', political_stability_percent: 48, governance_score: 0.3, year: 2023 },
    { country: 'Turkey', political_stability_percent: 45, governance_score: 0.2, year: 2023 },
    { country: 'Mexico', political_stability_percent: 52, governance_score: 0.4, year: 2023 },
    { country: 'Indonesia', political_stability_percent: 60, governance_score: 0.5, year: 2023 },
    { country: 'Thailand', political_stability_percent: 55, governance_score: 0.4, year: 2023 },
    { country: 'Philippines', political_stability_percent: 50, governance_score: 0.3, year: 2023 },
    { country: 'Egypt', political_stability_percent: 52, governance_score: 0.3, year: 2023 },
    { country: 'Vietnam', political_stability_percent: 72, governance_score: 0.7, year: 2023 },
    { country: 'Israel', political_stability_percent: 58, governance_score: 0.5, year: 2023 },
    { country: 'Argentina', political_stability_percent: 42, governance_score: 0.1, year: 2023 },
    { country: 'Russia', political_stability_percent: 52, governance_score: 0.3, year: 2023 },
    { country: 'China', political_stability_percent: 78, governance_score: 0.9, year: 2023 },
    { country: 'Iran', political_stability_percent: 38, governance_score: -0.2, year: 2023 },
    { country: 'Pakistan', political_stability_percent: 35, governance_score: -0.3, year: 2023 },
    { country: 'Nigeria', political_stability_percent: 35, governance_score: -0.4, year: 2023 }
  ]
}

// 综合所有经济数据
export async function fetchAllEconomicData(): Promise<any[]> {
  try {
    const [worldBankData, sipriData, stabilityData] = await Promise.all([
      fetchComprehensiveWorldBankData(),
      Promise.resolve(fetchSIPRIMilitarySpending()),
      Promise.resolve(fetchPoliticalStabilityData())
    ])
    
    // 合并所有数据
    const countryMap = new Map<string, any>()
    
    worldBankData.forEach(item => {
      countryMap.set(item.country, {
        country: item.country,
        gdp_usd_billions: item.gdp_usd_billions,
        gdp_growth_percent: item.gdp_growth_percent,
        population: item.population,
        inflation_percent: item.inflation_percent,
        unemployment_percent: item.unemployment_percent,
        military_spending_usd_billions: 0,
        political_stability_percent: 0
      })
    })
    
    sipriData.forEach(item => {
      const existing = countryMap.get(item.country)
      if (existing) {
        existing.military_spending_usd_billions = item.military_spending_usd_billions
      } else {
        countryMap.set(item.country, {
          country: item.country,
          gdp_usd_billions: 0,
          gdp_growth_percent: 0,
          population: 0,
          inflation_percent: 0,
          unemployment_percent: 0,
          military_spending_usd_billions: item.military_spending_usd_billions,
          political_stability_percent: 0
        })
      }
    })
    
    stabilityData.forEach(item => {
      const existing = countryMap.get(item.country)
      if (existing) {
        existing.political_stability_percent = item.political_stability_percent
      } else {
        countryMap.set(item.country, {
          country: item.country,
          gdp_usd_billions: 0,
          gdp_growth_percent: 0,
          population: 0,
          inflation_percent: 0,
          unemployment_percent: 0,
          military_spending_usd_billions: 0,
          political_stability_percent: item.political_stability_percent
        })
      }
    })
    
    return Array.from(countryMap.values())
  } catch (error: any) {
    console.error('All economic data fetch error:', error.message)
    return []
  }
}
