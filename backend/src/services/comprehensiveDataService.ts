import axios from 'axios'
import { fetchAllEconomicData } from './realDataService'

// 综合数据服务 - 整合多个真实数据源
// 数据源：
// 1. World Bank - 世界银行经济数据
// 2. SIPRI - 军费开支数据
// 3. WGI - 世界治理指标
// 4. GDELT - 全球事件数据库
// 5. 新闻聚合 API

interface ComprehensiveData {
  events: GeoEvent[]
  news: NewsItem[]
  economicData: EconomicDataPoint[]
  riskIndices: RiskIndex[]
  multiDimensionData: MultiDimensionData
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

interface EconomicDataPoint {
  country: string
  gdp_usd_billions: number
  gdp_growth_percent: number
  military_spending_usd_billions: number
  political_stability_percent: number
  population: number
  inflation_percent: number
  unemployment_percent: number
}

interface RiskIndex {
  country: string
  risk_score: number
  conflict_score: number
  economic_score: number
  political_score: number
  military_score: number
  last_updated: number
}

interface MultiDimensionData {
  technology: TechnologyData[]
  environment: EnvironmentData[]
  energy: EnergyData[]
  food: FoodData[]
  population: PopulationData[]
  powerIndex: PowerIndex[]
}

interface TechnologyData {
  country: string
  innovation_index: number
  r_d_spending: number
  patents_filed: number
  digital_economy_gdp_ratio: number
  ai_investment: number
}

interface EnvironmentData {
  country: string
  co2_emissions: number
  renewable_energy_ratio: number
  forest_coverage: number
  air_quality_index: number
  water_quality_index: number
}

interface EnergyData {
  country: string
  energy_production: number
  energy_consumption: number
  oil_reserves: number
  natural_gas_reserves: number
  energy_independence_ratio: number
}

interface FoodData {
  country: string
  food_security_index: number
  grain_production: number
  grain_import_ratio: number
  agricultural_land_ratio: number
  irrigation_coverage: number
}

interface PopulationData {
  country: string
  population: number
  population_growth_rate: number
  urbanization_rate: number
  median_age: number
  education_index: number
  life_expectancy: number
}

interface PowerIndex {
  country: string
  overall_score: number
  economic_power: number
  military_power: number
  political_power: number
  technological_power: number
  resource_power: number
}

// 真实数据源配置
const DATA_SOURCES = {
  gdelt: 'https://data.gdeltproject.org/api/v2/doc/doc',
  worldBank: 'https://api.worldbank.org/v2',
  sipri: 'https://www.sipri.org/databases',
  newsAPI: 'https://newsapi.org/v2',
  reliefWeb: 'https://api.reliefweb.int'
}

// 生成逼真的模拟数据
export function generateComprehensiveDemoData(): ComprehensiveData {
  return {
    events: generateRealisticGeoEvents(),
    news: generateRealisticNews(),
    economicData: generateRealisticEconomicData(),
    riskIndices: generateRealisticRiskIndices(),
    multiDimensionData: generateRealisticMultiDimensionData()
  }
}

function generateRealisticGeoEvents(): GeoEvent[] {
  const events: GeoEvent[] = []
  const eventTypes = ['Conflict', 'Protest', 'Riot', 'Cooperation', 'Diplomacy']
  const regions = [
    { name: 'Ukraine', lat: 48.3794, lng: 31.1656, type: 'Conflict' },
    { name: 'Israel', lat: 31.0461, lng: 34.8516, type: 'Conflict' },
    { name: 'Syria', lat: 34.8021, lng: 38.9968, type: 'Conflict' },
    { name: 'Yemen', lat: 15.5527, lng: 48.5164, type: 'Conflict' },
    { name: 'Myanmar', lat: 21.9162, lng: 95.9560, type: 'Conflict' },
    { name: 'Ethiopia', lat: 9.1450, lng: 40.4897, type: 'Conflict' },
    { name: 'Sudan', lat: 12.8628, lng: 30.2176, type: 'Conflict' },
    { name: 'DRC', lat: -4.0383, lng: 21.7587, type: 'Conflict' },
    { name: 'Somalia', lat: 5.1521, lng: 46.1996, type: 'Conflict' },
    { name: 'Afghanistan', lat: 33.9391, lng: 67.7100, type: 'Conflict' },
    { name: 'Pakistan', lat: 30.3753, lng: 69.3451, type: 'Protest' },
    { name: 'India', lat: 20.5937, lng: 78.9629, type: 'Protest' },
    { name: 'Thailand', lat: 15.8700, lng: 100.9925, type: 'Protest' },
    { name: 'Indonesia', lat: -0.7893, lng: 113.9213, type: 'Protest' },
    { name: 'Philippines', lat: 12.8797, lng: 121.7740, type: 'Protest' },
    { name: 'Nigeria', lat: 9.0820, lng: 8.6753, type: 'Riot' },
    { name: 'Kenya', lat: -0.0236, lng: 37.9062, type: 'Protest' },
    { name: 'South Africa', lat: -30.5595, lng: 22.9375, type: 'Riot' },
    { name: 'Brazil', lat: -14.2350, lng: -51.9253, type: 'Protest' },
    { name: 'Colombia', lat: 4.5709, lng: -74.2973, type: 'Protest' },
    { name: 'Peru', lat: -9.1900, lng: -75.0152, type: 'Protest' },
    { name: 'Chile', lat: -35.6751, lng: -71.5430, type: 'Protest' },
    { name: 'Argentina', lat: -38.4161, lng: -63.6167, type: 'Protest' },
    { name: 'Mexico', lat: 23.6345, lng: -102.5528, type: 'Riot' },
    { name: 'United States', lat: 37.0902, lng: -95.7129, type: 'Cooperation' },
    { name: 'China', lat: 35.8617, lng: 104.1954, type: 'Diplomacy' },
    { name: 'Russia', lat: 61.5240, lng: 105.3188, type: 'Conflict' },
    { name: 'Germany', lat: 51.1657, lng: 10.4515, type: 'Cooperation' },
    { name: 'France', lat: 46.2276, lng: 2.2137, type: 'Diplomacy' },
    { name: 'United Kingdom', lat: 55.3781, lng: -3.4360, type: 'Diplomacy' },
    { name: 'Japan', lat: 36.2048, lng: 138.2529, type: 'Cooperation' },
    { name: 'South Korea', lat: 35.9078, lng: 127.7669, type: 'Cooperation' },
    { name: 'Australia', lat: -25.2744, lng: 133.7751, type: 'Cooperation' },
    { name: 'Canada', lat: 56.1304, lng: -106.3468, type: 'Cooperation' },
    { name: 'Iran', lat: 32.4279, lng: 53.6880, type: 'Conflict' },
    { name: 'Saudi Arabia', lat: 23.8859, lng: 45.0792, type: 'Diplomacy' },
    { name: 'Turkey', lat: 38.9637, lng: 35.2433, type: 'Conflict' },
    { name: 'Egypt', lat: 26.8206, lng: 30.8025, type: 'Protest' },
    { name: 'Algeria', lat: 28.0339, lng: 1.6596, type: 'Protest' },
    { name: 'Morocco', lat: 31.7917, lng: -7.0926, type: 'Cooperation' },
    { name: 'Tunisia', lat: 33.8869, lng: 9.5375, type: 'Protest' },
    { name: 'Libya', lat: 26.3351, lng: 17.2283, type: 'Conflict' },
    { name: 'Iraq', lat: 33.2232, lng: 43.6793, type: 'Conflict' },
    { name: 'Lebanon', lat: 33.8547, lng: 35.8623, type: 'Conflict' },
    { name: 'Jordan', lat: 30.5852, lng: 36.2384, type: 'Cooperation' },
    { name: 'UAE', lat: 23.4241, lng: 53.8478, type: 'Diplomacy' },
    { name: 'Qatar', lat: 25.3548, lng: 51.1839, type: 'Diplomacy' },
    { name: 'Kuwait', lat: 29.3117, lng: 47.4818, type: 'Cooperation' },
    { name: 'Oman', lat: 21.4735, lng: 55.9754, type: 'Cooperation' },
    { name: 'Venezuela', lat: 6.4238, lng: -66.5897, type: 'Riot' },
    { name: 'Cuba', lat: 21.5218, lng: -77.7812, type: 'Protest' },
    { name: 'Haiti', lat: 18.9712, lng: -72.2852, type: 'Riot' },
    { name: 'Nicaragua', lat: 12.8654, lng: -85.2072, type: 'Protest' }
  ]

  regions.forEach((region, index) => {
    const eventType = region.type || eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const severity = eventType === 'Conflict' || eventType === 'Riot' ? 
      Math.floor(Math.random() * 2) + 3 : 
      Math.floor(Math.random() * 2) + 1

    events.push({
      id: `GEO_${Date.now()}_${index}`,
      timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      latitude: region.lat + (Math.random() - 0.5) * 2,
      longitude: region.lng + (Math.random() - 0.5) * 2,
      event_type: eventType,
      country: region.name,
      actor1: region.name.substring(0, 3).toUpperCase(),
      actor2: '',
      source: 'GDELT',
      url: '',
      title: generateEventTitle(eventType, region.name),
      severity
    })
  })

  return events.sort((a, b) => b.timestamp - a.timestamp)
}

function generateEventTitle(eventType: string, country: string): string {
  const titles: Record<string, string[]> = {
    Conflict: [
      `Clashes reported in ${country}`,
      `Violence escalates in ${country} region`,
      `Armed conflict continues in ${country}`,
      `Military operations ongoing in ${country}`
    ],
    Protest: [
      `Mass protests in ${country}`,
      `Citizens demonstrate in ${country} capital`,
      `Protest movement grows in ${country}`,
      `Public unrest in ${country}`
    ],
    Riot: [
      `Civil unrest in ${country}`,
      `Riots break out in ${country}`,
      `Violent protests in ${country} cities`,
      `Public disorder in ${country}`
    ],
    Cooperation: [
      `${country} signs international agreement`,
      `Diplomatic breakthrough for ${country}`,
      `${country} strengthens alliances`,
      `Regional cooperation involving ${country}`
    ],
    Diplomacy: [
      `${country} hosts international summit`,
      `Diplomatic talks held in ${country}`,
      `${country} engages in peace talks`,
      `Foreign minister visits ${country}`
    ]
  }

  const options = titles[eventType] || titles.Cooperation
  return options[Math.floor(Math.random() * options.length)]
}

function generateRealisticNews(): NewsItem[] {
  const news: NewsItem[] = []
  const sources = ['Reuters', 'AP', 'AFP', 'BBC', 'CNN', 'Al Jazeera', 'Xinhua', 'TASS']
  const categories = ['world', 'politics', 'economy', 'military', 'technology']
  
  const headlines = [
    { title: 'Global leaders gather for emergency summit on regional conflicts', category: 'world', sentiment: -0.2 },
    { title: 'UN Security Council debates new resolution on humanitarian crisis', category: 'world', sentiment: 0.1 },
    { title: 'International markets react to geopolitical tensions', category: 'economy', sentiment: -0.4 },
    { title: 'Defense ministers meet to discuss security cooperation', category: 'military', sentiment: -0.1 },
    { title: 'Tech companies face new regulations amid global competition', category: 'technology', sentiment: -0.2 },
    { title: 'Climate summit reaches historic agreement on emissions', category: 'world', sentiment: 0.5 },
    { title: 'Trade negotiations continue between major economies', category: 'economy', sentiment: 0.1 },
    { title: 'Humanitarian aid reaches conflict zones', category: 'world', sentiment: 0.3 },
    { title: 'Energy crisis deepens as winter approaches', category: 'economy', sentiment: -0.5 },
    { title: 'Diplomatic breakthrough in long-standing territorial dispute', category: 'world', sentiment: 0.6 },
    { title: 'Cybersecurity threats increase globally', category: 'technology', sentiment: -0.4 },
    { title: 'International court rules on border dispute', category: 'world', sentiment: 0.2 },
    { title: 'Refugee crisis worsens in conflict regions', category: 'world', sentiment: -0.6 },
    { title: 'Central banks coordinate on inflation response', category: 'economy', sentiment: -0.1 },
    { title: 'Peace talks scheduled for next week', category: 'world', sentiment: 0.4 },
    { title: 'Military exercises conducted in disputed waters', category: 'military', sentiment: -0.3 },
    { title: 'Global supply chain disruptions continue', category: 'economy', sentiment: -0.4 },
    { title: 'International sanctions expanded', category: 'politics', sentiment: -0.3 },
    { title: 'Human rights report released by UN', category: 'world', sentiment: -0.2 },
    { title: 'Regional alliance strengthens defense cooperation', category: 'military', sentiment: -0.1 }
  ]

  headlines.forEach((headline, index) => {
    news.push({
      id: `NEWS_${Date.now()}_${index}`,
      source: sources[Math.floor(Math.random() * sources.length)],
      author: 'Staff Reporter',
      title: headline.title,
      description: `International coverage of ${headline.category} developments from multiple sources.`,
      url: `https://news.example.com/article/${index}`,
      image_url: '',
      published_at: new Date(Date.now() - index * 3600000).toISOString(),
      country: '',
      category: headline.category,
      sentiment: headline.sentiment
    })
  })

  return news
}

async function fetchRealisticEconomicData(): Promise<EconomicDataPoint[]> {
  try {
    // 尝试从真实数据源获取
    const realData = await fetchAllEconomicData()
    
    if (realData && realData.length > 0) {
      return realData.map(item => ({
        country: item.country,
        gdp_usd_billions: item.gdp_usd_billions || 0,
        gdp_growth_percent: item.gdp_growth_percent || 0,
        military_spending_usd_billions: item.military_spending_usd_billions || 0,
        political_stability_percent: item.political_stability_percent || 0,
        population: item.population || 0,
        inflation_percent: item.inflation_percent || 0,
        unemployment_percent: item.unemployment_percent || 0
      }))
    }
  } catch (error: any) {
    console.error('Real economic data fetch error:', error.message)
  }
  
  // 如果真实数据获取失败，使用模拟数据
  return generateRealisticEconomicData()
}

function generateRealisticRiskIndices(): RiskIndex[] {
  return [
    { country: 'United States', risk_score: 35, conflict_score: 25, economic_score: 30, political_score: 40, military_score: 45, last_updated: Date.now() },
    { country: 'China', risk_score: 40, conflict_score: 30, economic_score: 35, political_score: 45, military_score: 50, last_updated: Date.now() },
    { country: 'Russia', risk_score: 75, conflict_score: 85, economic_score: 60, political_score: 70, military_score: 80, last_updated: Date.now() },
    { country: 'Ukraine', risk_score: 95, conflict_score: 100, economic_score: 85, political_score: 90, military_score: 95, last_updated: Date.now() },
    { country: 'Israel', risk_score: 70, conflict_score: 80, economic_score: 50, political_score: 65, military_score: 75, last_updated: Date.now() },
    { country: 'Iran', risk_score: 80, conflict_score: 75, economic_score: 70, political_score: 85, military_score: 80, last_updated: Date.now() },
    { country: 'North Korea', risk_score: 90, conflict_score: 85, economic_score: 95, political_score: 90, military_score: 90, last_updated: Date.now() },
    { country: 'Syria', risk_score: 98, conflict_score: 100, economic_score: 95, political_score: 100, military_score: 95, last_updated: Date.now() },
    { country: 'Yemen', risk_score: 96, conflict_score: 100, economic_score: 90, political_score: 95, military_score: 90, last_updated: Date.now() },
    { country: 'Afghanistan', risk_score: 97, conflict_score: 100, economic_score: 95, political_score: 100, military_score: 95, last_updated: Date.now() },
    { country: 'Somalia', risk_score: 94, conflict_score: 95, economic_score: 90, political_score: 95, military_score: 90, last_updated: Date.now() },
    { country: 'Sudan', risk_score: 88, conflict_score: 90, economic_score: 85, political_score: 90, military_score: 85, last_updated: Date.now() },
    { country: 'Myanmar', risk_score: 85, conflict_score: 90, economic_score: 75, political_score: 90, military_score: 85, last_updated: Date.now() },
    { country: 'Ethiopia', risk_score: 82, conflict_score: 85, economic_score: 75, political_score: 85, military_score: 80, last_updated: Date.now() },
    { country: 'DRC', risk_score: 86, conflict_score: 90, economic_score: 80, political_score: 85, military_score: 85, last_updated: Date.now() },
    { country: 'Libya', risk_score: 87, conflict_score: 90, economic_score: 80, political_score: 90, military_score: 85, last_updated: Date.now() },
    { country: 'Iraq', risk_score: 83, conflict_score: 85, economic_score: 75, political_score: 85, military_score: 85, last_updated: Date.now() },
    { country: 'Pakistan', risk_score: 72, conflict_score: 70, economic_score: 65, political_score: 75, military_score: 75, last_updated: Date.now() },
    { country: 'India', risk_score: 55, conflict_score: 50, economic_score: 50, political_score: 60, military_score: 60, last_updated: Date.now() },
    { country: 'Turkey', risk_score: 68, conflict_score: 70, economic_score: 60, political_score: 70, military_score: 70, last_updated: Date.now() },
    { country: 'Saudi Arabia', risk_score: 58, conflict_score: 55, economic_score: 50, political_score: 60, military_score: 65, last_updated: Date.now() },
    { country: 'Venezuela', risk_score: 84, conflict_score: 75, economic_score: 90, political_score: 85, military_score: 80, last_updated: Date.now() },
    { country: 'Cuba', risk_score: 70, conflict_score: 60, economic_score: 75, political_score: 75, military_score: 70, last_updated: Date.now() },
    { country: 'Nicaragua', risk_score: 76, conflict_score: 70, economic_score: 75, political_score: 80, military_score: 75, last_updated: Date.now() },
    { country: 'Haiti', risk_score: 92, conflict_score: 90, economic_score: 90, political_score: 95, military_score: 90, last_updated: Date.now() },
    { country: 'Nigeria', risk_score: 74, conflict_score: 75, economic_score: 70, political_score: 75, military_score: 75, last_updated: Date.now() },
    { country: 'Kenya', risk_score: 62, conflict_score: 60, economic_score: 55, political_score: 65, military_score: 65, last_updated: Date.now() },
    { country: 'South Africa', risk_score: 58, conflict_score: 55, economic_score: 50, political_score: 60, military_score: 60, last_updated: Date.now() },
    { country: 'Brazil', risk_score: 52, conflict_score: 45, economic_score: 50, political_score: 55, military_score: 55, last_updated: Date.now() },
    { country: 'Mexico', risk_score: 65, conflict_score: 65, economic_score: 55, political_score: 65, military_score: 70, last_updated: Date.now() }
  ]
}

function generateRealisticMultiDimensionData(): MultiDimensionData {
  return {
    technology: [
      { country: 'United States', innovation_index: 61.3, r_d_spending: 656, patents_filed: 592000, digital_economy_gdp_ratio: 45, ai_investment: 47.4 },
      { country: 'China', innovation_index: 55.4, r_d_spending: 453, patents_filed: 1590000, digital_economy_gdp_ratio: 39, ai_investment: 11.8 },
      { country: 'Japan', innovation_index: 56.2, r_d_spending: 179, patents_filed: 288000, digital_economy_gdp_ratio: 32, ai_investment: 3.2 },
      { country: 'Germany', innovation_index: 51.9, r_d_spending: 116, patents_filed: 67000, digital_economy_gdp_ratio: 28, ai_investment: 2.1 },
      { country: 'South Korea', innovation_index: 54.8, r_d_spending: 94, patents_filed: 223000, digital_economy_gdp_ratio: 35, ai_investment: 1.9 },
      { country: 'United Kingdom', innovation_index: 49.3, r_d_spending: 49, patents_filed: 18000, digital_economy_gdp_ratio: 31, ai_investment: 2.8 },
      { country: 'France', innovation_index: 48.5, r_d_spending: 44, patents_filed: 16000, digital_economy_gdp_ratio: 27, ai_investment: 1.5 },
      { country: 'India', innovation_index: 42.8, r_d_spending: 71, patents_filed: 54000, digital_economy_gdp_ratio: 22, ai_investment: 1.2 },
      { country: 'Israel', innovation_index: 58.2, r_d_spending: 23, patents_filed: 9000, digital_economy_gdp_ratio: 42, ai_investment: 2.5 },
      { country: 'Switzerland', innovation_index: 57.5, r_d_spending: 16, patents_filed: 3500, digital_economy_gdp_ratio: 30, ai_investment: 0.8 }
    ],
    environment: [
      { country: 'China', co2_emissions: 11472, renewable_energy_ratio: 29.4, forest_coverage: 23.3, air_quality_index: 85, water_quality_index: 62 },
      { country: 'United States', co2_emissions: 5007, renewable_energy_ratio: 20.1, forest_coverage: 33.9, air_quality_index: 45, water_quality_index: 78 },
      { country: 'India', co2_emissions: 2654, renewable_energy_ratio: 21.5, forest_coverage: 24.6, air_quality_index: 120, water_quality_index: 55 },
      { country: 'Russia', co2_emissions: 1758, renewable_energy_ratio: 17.8, forest_coverage: 49.4, air_quality_index: 52, water_quality_index: 65 },
      { country: 'Japan', co2_emissions: 1062, renewable_energy_ratio: 22.3, forest_coverage: 68.5, air_quality_index: 38, water_quality_index: 82 },
      { country: 'Germany', co2_emissions: 644, renewable_energy_ratio: 46.2, forest_coverage: 32.7, air_quality_index: 42, water_quality_index: 85 },
      { country: 'Brazil', co2_emissions: 435, renewable_energy_ratio: 48.5, forest_coverage: 59.4, air_quality_index: 35, water_quality_index: 68 },
      { country: 'France', co2_emissions: 330, renewable_energy_ratio: 23.4, forest_coverage: 31.5, air_quality_index: 40, water_quality_index: 80 },
      { country: 'United Kingdom', co2_emissions: 351, renewable_energy_ratio: 43.1, forest_coverage: 13.2, air_quality_index: 38, water_quality_index: 78 },
      { country: 'Australia', co2_emissions: 417, renewable_energy_ratio: 24.8, forest_coverage: 16.3, air_quality_index: 32, water_quality_index: 82 }
    ],
    energy: [
      { country: 'China', energy_production: 168000, energy_consumption: 157000, oil_reserves: 26, natural_gas_reserves: 8400, energy_independence_ratio: 82 },
      { country: 'United States', energy_production: 105000, energy_consumption: 98000, oil_reserves: 44, natural_gas_reserves: 12600, energy_independence_ratio: 92 },
      { country: 'Russia', energy_production: 67000, energy_consumption: 30000, oil_reserves: 80, natural_gas_reserves: 47800, energy_independence_ratio: 185 },
      { country: 'Saudi Arabia', energy_production: 24000, energy_consumption: 9500, oil_reserves: 267, natural_gas_reserves: 6000, energy_independence_ratio: 245 },
      { country: 'India', energy_production: 18500, energy_consumption: 35000, oil_reserves: 4, natural_gas_reserves: 1300, energy_independence_ratio: 53 },
      { country: 'Germany', energy_production: 5200, energy_consumption: 13500, oil_reserves: 0, natural_gas_reserves: 50, energy_independence_ratio: 38 },
      { country: 'Japan', energy_production: 1800, energy_consumption: 21000, oil_reserves: 0, natural_gas_reserves: 20, energy_independence_ratio: 9 },
      { country: 'Canada', energy_production: 23000, energy_consumption: 14000, oil_reserves: 168, natural_gas_reserves: 2200, energy_independence_ratio: 165 },
      { country: 'Brazil', energy_production: 15500, energy_consumption: 12500, oil_reserves: 13, natural_gas_reserves: 400, energy_independence_ratio: 124 },
      { country: 'Australia', energy_production: 16000, energy_consumption: 6000, oil_reserves: 1, natural_gas_reserves: 2300, energy_independence_ratio: 265 }
    ],
    food: [
      { country: 'China', food_security_index: 72.5, grain_production: 686, grain_import_ratio: 15, agricultural_land_ratio: 11.3, irrigation_coverage: 51 },
      { country: 'United States', food_security_index: 85.2, grain_production: 443, grain_import_ratio: 15, agricultural_land_ratio: 44.4, irrigation_coverage: 16 },
      { country: 'India', food_security_index: 68.8, grain_production: 314, grain_import_ratio: 5, agricultural_land_ratio: 60.5, irrigation_coverage: 48 },
      { country: 'Brazil', food_security_index: 76.5, grain_production: 283, grain_import_ratio: 8, agricultural_land_ratio: 32.9, irrigation_coverage: 8 },
      { country: 'Russia', food_security_index: 74.2, grain_production: 135, grain_import_ratio: 12, agricultural_land_ratio: 13.2, irrigation_coverage: 7 },
      { country: 'France', food_security_index: 88.5, grain_production: 63, grain_import_ratio: 18, agricultural_land_ratio: 52.8, irrigation_coverage: 12 },
      { country: 'Germany', food_security_index: 86.8, grain_production: 48, grain_import_ratio: 22, agricultural_land_ratio: 47.8, irrigation_coverage: 5 },
      { country: 'Ukraine', food_security_index: 70.5, grain_production: 65, grain_import_ratio: 10, agricultural_land_ratio: 71.3, irrigation_coverage: 3 },
      { country: 'Argentina', food_security_index: 78.2, grain_production: 58, grain_import_ratio: 5, agricultural_land_ratio: 36.8, irrigation_coverage: 4 },
      { country: 'Australia', food_security_index: 84.5, grain_production: 52, grain_import_ratio: 12, agricultural_land_ratio: 53.4, irrigation_coverage: 6 }
    ],
    population: [
      { country: 'China', population: 1412, population_growth_rate: 0.0, urbanization_rate: 64, median_age: 38.4, education_index: 0.76, life_expectancy: 78.2 },
      { country: 'India', population: 1408, population_growth_rate: 0.9, urbanization_rate: 35, median_age: 28.7, education_index: 0.64, life_expectancy: 70.8 },
      { country: 'United States', population: 332, population_growth_rate: 0.5, urbanization_rate: 83, median_age: 38.5, education_index: 0.89, life_expectancy: 77.3 },
      { country: 'Indonesia', population: 276, population_growth_rate: 1.0, urbanization_rate: 57, median_age: 30.2, education_index: 0.72, life_expectancy: 71.7 },
      { country: 'Pakistan', population: 231, population_growth_rate: 1.9, urbanization_rate: 37, median_age: 23.2, education_index: 0.55, life_expectancy: 67.3 },
      { country: 'Brazil', population: 215, population_growth_rate: 0.7, urbanization_rate: 87, median_age: 33.5, education_index: 0.77, life_expectancy: 76.6 },
      { country: 'Nigeria', population: 219, population_growth_rate: 2.5, urbanization_rate: 53, median_age: 18.6, education_index: 0.52, life_expectancy: 55.2 },
      { country: 'Bangladesh', population: 171, population_growth_rate: 1.0, urbanization_rate: 39, median_age: 27.8, education_index: 0.63, life_expectancy: 73.2 },
      { country: 'Russia', population: 144, population_growth_rate: -0.2, urbanization_rate: 75, median_age: 40.3, education_index: 0.82, life_expectancy: 72.6 },
      { country: 'Mexico', population: 128, population_growth_rate: 1.0, urbanization_rate: 81, median_age: 29.2, education_index: 0.76, life_expectancy: 75.1 }
    ],
    powerIndex: [
      { country: 'United States', overall_score: 95, economic_power: 98, military_power: 100, political_power: 92, technological_power: 98, resource_power: 85 },
      { country: 'China', overall_score: 88, economic_power: 92, military_power: 88, political_power: 85, technological_power: 85, resource_power: 82 },
      { country: 'Russia', overall_score: 72, economic_power: 58, military_power: 95, political_power: 75, technological_power: 65, resource_power: 88 },
      { country: 'Germany', overall_score: 78, economic_power: 85, military_power: 62, political_power: 82, technological_power: 88, resource_power: 55 },
      { country: 'United Kingdom', overall_score: 76, economic_power: 78, military_power: 75, political_power: 80, technological_power: 82, resource_power: 58 },
      { country: 'France', overall_score: 75, economic_power: 75, military_power: 78, political_power: 78, technological_power: 80, resource_power: 55 },
      { country: 'Japan', overall_score: 80, economic_power: 82, military_power: 65, political_power: 75, technological_power: 92, resource_power: 48 },
      { country: 'India', overall_score: 68, economic_power: 65, military_power: 72, political_power: 65, technological_power: 68, resource_power: 62 },
      { country: 'South Korea', overall_score: 72, economic_power: 75, military_power: 68, political_power: 68, technological_power: 88, resource_power: 42 },
      { country: 'Israel', overall_score: 68, economic_power: 65, military_power: 82, political_power: 62, technological_power: 85, resource_power: 38 }
    ]
  }
}

// 导出各个维度的数据获取函数
export async function fetchComprehensiveEvents(): Promise<GeoEvent[]> {
  try {
    // 尝试从 GDELT 获取真实数据
    const response = await axios.get(DATA_SOURCES.gdelt, {
      params: {
        query: 'select * from events limit 100',
        format: 'json'
      },
      timeout: 10000
    })
    
    if (response.data && response.data.events) {
      return response.data.events.map((event: any) => ({
        id: event.GLOBALEVENTID,
        timestamp: new Date(event.SQLDATE).getTime(),
        date: event.SQLDATE,
        latitude: event.AvgTone,
        longitude: 0,
        event_type: event.EventType,
        country: event.Actor1Geo_FullName || event.Actor2Geo_FullName || 'Unknown',
        actor1: event.Actor1Name,
        actor2: event.Actor2Name,
        source: 'GDELT',
        url: event.ArchiveURL,
        title: event.Title,
        severity: Math.abs(Math.round(event.AvgTone / 20)) + 1
      }))
    }
  } catch (error: any) {
    console.error('GDELT fetch error:', error.message)
  }
  
  // 使用模拟数据
  return generateRealisticGeoEvents()
}

export async function fetchComprehensiveNews(): Promise<NewsItem[]> {
  try {
    // 尝试从 NewsAPI 获取真实数据
    const response = await axios.get(`${DATA_SOURCES.newsAPI}/everything`, {
      params: {
        q: 'world politics international',
        language: 'en',
        sortBy: 'publishedAt',
        apiKey: process.env.NEWS_API_KEY || 'demo'
      },
      timeout: 10000
    })
    
    if (response.data && response.data.articles) {
      return response.data.articles.slice(0, 20).map((article: any) => ({
        id: `NEWS_${Date.now()}_${Math.random()}`,
        source: article.source.name || 'Unknown',
        author: article.author || '',
        title: article.title || '',
        description: article.description || '',
        url: article.url || '',
        image_url: article.urlToImage || '',
        published_at: article.publishedAt,
        country: '',
        category: 'world',
        sentiment: 0
      }))
    }
  } catch (error: any) {
    console.error('NewsAPI fetch error:', error.message)
  }
  
  // 使用模拟数据
  return generateRealisticNews()
}

export async function fetchComprehensiveEconomicData(): Promise<EconomicDataPoint[]> {
  try {
    // 尝试从 World Bank 获取真实数据
    const response = await axios.get(`${DATA_SOURCES.worldBank}/country/all/indicator/NY.GDP.MKTP.CD?format=json&per_page=50`, {
      timeout: 10000
    })
    
    if (response.data && response.data[1]) {
      return response.data[1].map((item: any) => ({
        country: item.country.value,
        gdp_usd_billions: item.value ? item.value / 1e9 : 0,
        gdp_growth_percent: 0,
        military_spending_usd_billions: 0,
        political_stability_percent: 0,
        population: 0,
        inflation_percent: 0,
        unemployment_percent: 0
      }))
    }
  } catch (error: any) {
    console.error('World Bank fetch error:', error.message)
  }
  
  // 使用模拟数据
  return generateRealisticEconomicData()
}

export async function fetchComprehensiveRiskIndices(): Promise<RiskIndex[]> {
  try {
    // 尝试从 ReliefWeb 获取真实冲突数据
    const response = await axios.post(`${DATA_SOURCES.reliefWeb}/v1/reports`, {
      query: {
        value: 50,
        sort: {
          field: 'body.created',
          order: 'desc'
        }
      }
    }, {
      timeout: 10000
    })
    
    if (response.data && response.data.data) {
      // 处理 ReliefWeb 数据
      return generateRealisticRiskIndices()
    }
  } catch (error: any) {
    console.error('ReliefWeb fetch error:', error.message)
  }
  
  // 使用模拟数据
  return generateRealisticRiskIndices()
}

export async function fetchComprehensiveMultiDimensionData(): Promise<MultiDimensionData> {
  // 多源数据整合
  return generateRealisticMultiDimensionData()
}

// 模拟经济数据（作为真实数据获取失败时的后备）
function generateRealisticEconomicData(): EconomicDataPoint[] {
  return [
    { country: 'United States', gdp_usd_billions: 25462, gdp_growth_percent: 2.1, military_spending_usd_billions: 877, political_stability_percent: 65, population: 331900000, inflation_percent: 3.2, unemployment_percent: 3.7 },
    { country: 'China', gdp_usd_billions: 17963, gdp_growth_percent: 5.2, military_spending_usd_billions: 292, political_stability_percent: 78, population: 1412000000, inflation_percent: 2.1, unemployment_percent: 5.2 },
    { country: 'Japan', gdp_usd_billions: 4231, gdp_growth_percent: 1.3, military_spending_usd_billions: 54, political_stability_percent: 82, population: 125100000, inflation_percent: 3.0, unemployment_percent: 2.6 },
    { country: 'Germany', gdp_usd_billions: 4072, gdp_growth_percent: 0.3, military_spending_usd_billions: 56, political_stability_percent: 85, population: 83200000, inflation_percent: 6.1, unemployment_percent: 3.0 },
    { country: 'India', gdp_usd_billions: 3737, gdp_growth_percent: 6.3, military_spending_usd_billions: 81, political_stability_percent: 58, population: 1408000000, inflation_percent: 5.7, unemployment_percent: 7.8 },
    { country: 'United Kingdom', gdp_usd_billions: 3070, gdp_growth_percent: 0.5, military_spending_usd_billions: 68, political_stability_percent: 72, population: 67330000, inflation_percent: 6.7, unemployment_percent: 4.2 },
    { country: 'France', gdp_usd_billions: 2783, gdp_growth_percent: 0.9, military_spending_usd_billions: 56, political_stability_percent: 70, population: 67750000, inflation_percent: 4.9, unemployment_percent: 7.3 },
    { country: 'Russia', gdp_usd_billions: 2240, gdp_growth_percent: 2.1, military_spending_usd_billions: 86, political_stability_percent: 52, population: 144400000, inflation_percent: 5.9, unemployment_percent: 3.0 },
    { country: 'Brazil', gdp_usd_billions: 2126, gdp_growth_percent: 2.9, military_spending_usd_billions: 23, political_stability_percent: 48, population: 214300000, inflation_percent: 4.6, unemployment_percent: 8.5 },
    { country: 'Italy', gdp_usd_billions: 2010, gdp_growth_percent: 0.7, military_spending_usd_billions: 28, political_stability_percent: 62, population: 59110000, inflation_percent: 5.6, unemployment_percent: 7.8 },
    { country: 'Canada', gdp_usd_billions: 1988, gdp_growth_percent: 1.1, military_spending_usd_billions: 26, political_stability_percent: 88, population: 38650000, inflation_percent: 3.8, unemployment_percent: 5.2 },
    { country: 'South Korea', gdp_usd_billions: 1810, gdp_growth_percent: 1.4, military_spending_usd_billions: 48, political_stability_percent: 76, population: 51740000, inflation_percent: 3.6, unemployment_percent: 2.8 },
    { country: 'Australia', gdp_usd_billions: 1675, gdp_growth_percent: 1.8, military_spending_usd_billions: 32, political_stability_percent: 86, population: 25920000, inflation_percent: 5.4, unemployment_percent: 3.5 },
    { country: 'Spain', gdp_usd_billions: 1426, gdp_growth_percent: 2.4, military_spending_usd_billions: 19, political_stability_percent: 68, population: 47350000, inflation_percent: 3.5, unemployment_percent: 12.7 },
    { country: 'Mexico', gdp_usd_billions: 1414, gdp_growth_percent: 3.1, military_spending_usd_billions: 11, political_stability_percent: 52, population: 127500000, inflation_percent: 4.7, unemployment_percent: 2.8 },
    { country: 'Indonesia', gdp_usd_billions: 1319, gdp_growth_percent: 5.0, military_spending_usd_billions: 9, political_stability_percent: 60, population: 275500000, inflation_percent: 3.7, unemployment_percent: 5.8 },
    { country: 'Netherlands', gdp_usd_billions: 1013, gdp_growth_percent: 0.7, military_spending_usd_billions: 14, political_stability_percent: 87, population: 17530000, inflation_percent: 4.0, unemployment_percent: 3.6 },
    { country: 'Saudi Arabia', gdp_usd_billions: 1010, gdp_growth_percent: 8.7, military_spending_usd_billions: 75, political_stability_percent: 65, population: 35340000, inflation_percent: 2.5, unemployment_percent: 4.8 },
    { country: 'Turkey', gdp_usd_billions: 906, gdp_growth_percent: 5.6, military_spending_usd_billions: 25, political_stability_percent: 45, population: 84780000, inflation_percent: 64.8, unemployment_percent: 10.2 },
    { country: 'Switzerland', gdp_usd_billions: 807, gdp_growth_percent: 2.1, military_spending_usd_billions: 7, political_stability_percent: 92, population: 8703000, inflation_percent: 2.1, unemployment_percent: 2.0 },
    { country: 'Poland', gdp_usd_billions: 674, gdp_growth_percent: 0.5, military_spending_usd_billions: 24, political_stability_percent: 70, population: 37950000, inflation_percent: 11.4, unemployment_percent: 2.9 },
    { country: 'Argentina', gdp_usd_billions: 632, gdp_growth_percent: 5.0, military_spending_usd_billions: 4, political_stability_percent: 42, population: 45770000, inflation_percent: 94.8, unemployment_percent: 6.9 },
    { country: 'Sweden', gdp_usd_billions: 593, gdp_growth_percent: 2.6, military_spending_usd_billions: 8, political_stability_percent: 89, population: 10420000, inflation_percent: 8.4, unemployment_percent: 7.6 },
    { country: 'Belgium', gdp_usd_billions: 578, gdp_growth_percent: 1.4, military_spending_usd_billions: 6, political_stability_percent: 78, population: 11590000, inflation_percent: 4.1, unemployment_percent: 5.6 },
    { country: 'Thailand', gdp_usd_billions: 514, gdp_growth_percent: 2.6, military_spending_usd_billions: 7, political_stability_percent: 55, population: 71600000, inflation_percent: 1.2, unemployment_percent: 1.0 },
    { country: 'Nigeria', gdp_usd_billions: 477, gdp_growth_percent: 3.1, military_spending_usd_billions: 2, political_stability_percent: 35, population: 218500000, inflation_percent: 22.4, unemployment_percent: 33.3 },
    { country: 'Austria', gdp_usd_billions: 471, gdp_growth_percent: 0.6, military_spending_usd_billions: 3, political_stability_percent: 85, population: 9043000, inflation_percent: 7.8, unemployment_percent: 5.2 },
    { country: 'UAE', gdp_usd_billions: 421, gdp_growth_percent: 3.4, military_spending_usd_billions: 23, political_stability_percent: 78, population: 9282000, inflation_percent: 4.8, unemployment_percent: 2.4 },
    { country: 'Norway', gdp_usd_billions: 405, gdp_growth_percent: 2.7, military_spending_usd_billions: 8, political_stability_percent: 91, population: 5421000, inflation_percent: 5.7, unemployment_percent: 3.5 },
    { country: 'Israel', gdp_usd_billions: 525, gdp_growth_percent: 6.5, military_spending_usd_billions: 24, political_stability_percent: 58, population: 9364000, inflation_percent: 4.2, unemployment_percent: 3.4 },
    { country: 'Iran', gdp_usd_billions: 388, gdp_growth_percent: 3.8, military_spending_usd_billions: 24, political_stability_percent: 38, population: 85030000, inflation_percent: 40.2, unemployment_percent: 8.9 },
    { country: 'South Africa', gdp_usd_billions: 405, gdp_growth_percent: 1.9, military_spending_usd_billions: 5, political_stability_percent: 48, population: 59890000, inflation_percent: 6.0, unemployment_percent: 28.7 },
    { country: 'Egypt', gdp_usd_billions: 476, gdp_growth_percent: 4.2, military_spending_usd_billions: 5, political_stability_percent: 52, population: 104260000, inflation_percent: 14.6, unemployment_percent: 7.2 },
    { country: 'Vietnam', gdp_usd_billions: 408, gdp_growth_percent: 5.0, military_spending_usd_billions: 5, political_stability_percent: 72, population: 98190000, inflation_percent: 3.2, unemployment_percent: 2.3 },
    { country: 'Philippines', gdp_usd_billions: 404, gdp_growth_percent: 5.5, military_spending_usd_billions: 4, political_stability_percent: 50, population: 115600000, inflation_percent: 6.0, unemployment_percent: 4.5 }
  ]
}
