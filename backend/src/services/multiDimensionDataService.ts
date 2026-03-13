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

// 科技数据
export async function fetchTechnologyData(): Promise<TechnologyData[]> {
  try {
    // 使用世界银行、WIPO 等数据源
    const demoData: TechnologyData[] = [
      {
        country: 'United States',
        innovation_index: 61.3,
        r_d_spending: 656,
        patents_filed: 592000,
        digital_economy_gdp_ratio: 45,
        ai_investment: 47.4
      },
      {
        country: 'China',
        innovation_index: 55.4,
        r_d_spending: 453,
        patents_filed: 1590000,
        digital_economy_gdp_ratio: 39,
        ai_investment: 11.8
      },
      {
        country: 'Japan',
        innovation_index: 56.2,
        r_d_spending: 179,
        patents_filed: 288000,
        digital_economy_gdp_ratio: 32,
        ai_investment: 3.2
      },
      {
        country: 'Germany',
        innovation_index: 51.9,
        r_d_spending: 116,
        patents_filed: 67000,
        digital_economy_gdp_ratio: 28,
        ai_investment: 2.1
      },
      {
        country: 'South Korea',
        innovation_index: 54.8,
        r_d_spending: 94,
        patents_filed: 223000,
        digital_economy_gdp_ratio: 35,
        ai_investment: 1.9
      },
      {
        country: 'United Kingdom',
        innovation_index: 49.3,
        r_d_spending: 49,
        patents_filed: 18000,
        digital_economy_gdp_ratio: 31,
        ai_investment: 2.8
      },
      {
        country: 'India',
        innovation_index: 36.4,
        r_d_spending: 71,
        patents_filed: 58000,
        digital_economy_gdp_ratio: 23,
        ai_investment: 1.2
      },
      {
        country: 'France',
        innovation_index: 48.7,
        r_d_spending: 44,
        patents_filed: 16000,
        digital_economy_gdp_ratio: 26,
        ai_investment: 1.5
      },
      {
        country: 'Israel',
        innovation_index: 53.2,
        r_d_spending: 20,
        patents_filed: 9000,
        digital_economy_gdp_ratio: 29,
        ai_investment: 1.8
      },
      {
        country: 'Singapore',
        innovation_index: 50.1,
        r_d_spending: 9,
        patents_filed: 3500,
        digital_economy_gdp_ratio: 33,
        ai_investment: 0.9
      }
    ]
    return demoData
  } catch (error) {
    console.error('Technology data fetch error:', error)
    return []
  }
}

// 环境数据
export async function fetchEnvironmentData(): Promise<EnvironmentData[]> {
  try {
    const demoData: EnvironmentData[] = [
      {
        country: 'China',
        co2_emissions: 11472,
        renewable_energy_ratio: 29.4,
        forest_coverage: 23.0,
        air_quality_index: 75,
        water_quality_index: 68
      },
      {
        country: 'United States',
        co2_emissions: 5416,
        renewable_energy_ratio: 20.1,
        forest_coverage: 33.9,
        air_quality_index: 42,
        water_quality_index: 82
      },
      {
        country: 'India',
        co2_emissions: 2654,
        renewable_energy_ratio: 21.8,
        forest_coverage: 24.6,
        air_quality_index: 121,
        water_quality_index: 54
      },
      {
        country: 'Germany',
        co2_emissions: 701,
        renewable_energy_ratio: 46.3,
        forest_coverage: 32.7,
        air_quality_index: 38,
        water_quality_index: 85
      },
      {
        country: 'Japan',
        co2_emissions: 1062,
        renewable_energy_ratio: 22.4,
        forest_coverage: 68.5,
        air_quality_index: 41,
        water_quality_index: 88
      },
      {
        country: 'Brazil',
        co2_emissions: 469,
        renewable_energy_ratio: 48.4,
        forest_coverage: 59.4,
        air_quality_index: 45,
        water_quality_index: 71
      },
      {
        country: 'France',
        co2_emissions: 330,
        renewable_energy_ratio: 19.2,
        forest_coverage: 31.0,
        air_quality_index: 46,
        water_quality_index: 79
      },
      {
        country: 'United Kingdom',
        co2_emissions: 351,
        renewable_energy_ratio: 43.1,
        forest_coverage: 13.2,
        air_quality_index: 44,
        water_quality_index: 77
      },
      {
        country: 'Canada',
        co2_emissions: 573,
        renewable_energy_ratio: 27.1,
        forest_coverage: 38.2,
        air_quality_index: 32,
        water_quality_index: 91
      },
      {
        country: 'Australia',
        co2_emissions: 417,
        renewable_energy_ratio: 24.8,
        forest_coverage: 17.4,
        air_quality_index: 36,
        water_quality_index: 86
      }
    ]
    return demoData
  } catch (error) {
    console.error('Environment data fetch error:', error)
    return []
  }
}

// 能源数据
export async function fetchEnergyData(): Promise<EnergyData[]> {
  try {
    const demoData: EnergyData[] = [
      {
        country: 'China',
        energy_production: 145.5,
        energy_consumption: 157.3,
        oil_reserves: 25.6,
        natural_gas_reserves: 8.4,
        energy_independence_ratio: 81
      },
      {
        country: 'United States',
        energy_production: 102.8,
        energy_consumption: 95.7,
        oil_reserves: 68.8,
        natural_gas_reserves: 12.6,
        energy_independence_ratio: 108
      },
      {
        country: 'Russia',
        energy_production: 68.4,
        energy_consumption: 30.2,
        oil_reserves: 80.0,
        natural_gas_reserves: 47.8,
        energy_independence_ratio: 226
      },
      {
        country: 'Saudi Arabia',
        energy_production: 27.8,
        energy_consumption: 11.2,
        oil_reserves: 297.5,
        natural_gas_reserves: 8.5,
        energy_independence_ratio: 248
      },
      {
        country: 'India',
        energy_production: 28.5,
        energy_consumption: 35.7,
        oil_reserves: 4.6,
        natural_gas_reserves: 1.3,
        energy_independence_ratio: 62
      },
      {
        country: 'Germany',
        energy_production: 14.2,
        energy_consumption: 13.5,
        oil_reserves: 0.2,
        natural_gas_reserves: 0.05,
        energy_independence_ratio: 65
      },
      {
        country: 'Japan',
        energy_production: 4.8,
        energy_consumption: 18.5,
        oil_reserves: 0.0,
        natural_gas_reserves: 0.02,
        energy_independence_ratio: 12
      },
      {
        country: 'Canada',
        energy_production: 32.4,
        energy_consumption: 14.2,
        oil_reserves: 168.1,
        natural_gas_reserves: 1.8,
        energy_independence_ratio: 228
      },
      {
        country: 'Brazil',
        energy_production: 15.8,
        energy_consumption: 12.4,
        oil_reserves: 12.8,
        natural_gas_reserves: 0.4,
        energy_independence_ratio: 127
      },
      {
        country: 'Iran',
        energy_production: 23.5,
        energy_consumption: 10.8,
        oil_reserves: 155.6,
        natural_gas_reserves: 33.2,
        energy_independence_ratio: 217
      }
    ]
    return demoData
  } catch (error) {
    console.error('Energy data fetch error:', error)
    return []
  }
}

// 粮食安全数据
export async function fetchFoodData(): Promise<FoodData[]> {
  try {
    const demoData: FoodData[] = [
      {
        country: 'China',
        food_security_index: 71.5,
        grain_production: 686.5,
        grain_import_ratio: 15,
        agricultural_land_ratio: 54.8,
        irrigation_coverage: 51
      },
      {
        country: 'United States',
        food_security_index: 77.3,
        grain_production: 444.2,
        grain_import_ratio: 5,
        agricultural_land_ratio: 44.3,
        irrigation_coverage: 15
      },
      {
        country: 'India',
        food_security_index: 57.2,
        grain_production: 315.7,
        grain_import_ratio: 3,
        agricultural_land_ratio: 60.5,
        irrigation_coverage: 48
      },
      {
        country: 'Brazil',
        food_security_index: 66.8,
        grain_production: 268.5,
        grain_import_ratio: 8,
        agricultural_land_ratio: 32.9,
        irrigation_coverage: 7
      },
      {
        country: 'Russia',
        food_security_index: 64.3,
        grain_production: 133.5,
        grain_import_ratio: 12,
        agricultural_land_ratio: 13.2,
        irrigation_coverage: 5
      },
      {
        country: 'France',
        food_security_index: 75.1,
        grain_production: 65.8,
        grain_import_ratio: 10,
        agricultural_land_ratio: 52.3,
        irrigation_coverage: 11
      },
      {
        country: 'Germany',
        food_security_index: 78.4,
        grain_production: 44.4,
        grain_import_ratio: 18,
        agricultural_land_ratio: 47.8,
        irrigation_coverage: 4
      },
      {
        country: 'Indonesia',
        food_security_index: 61.5,
        grain_production: 54.6,
        grain_import_ratio: 22,
        agricultural_land_ratio: 41.2,
        irrigation_coverage: 56
      },
      {
        country: 'Argentina',
        food_security_index: 69.2,
        grain_production: 53.8,
        grain_import_ratio: 4,
        agricultural_land_ratio: 36.8,
        irrigation_coverage: 3
      },
      {
        country: 'Nigeria',
        food_security_index: 42.8,
        grain_production: 28.5,
        grain_import_ratio: 35,
        agricultural_land_ratio: 71.5,
        irrigation_coverage: 1
      }
    ]
    return demoData
  } catch (error) {
    console.error('Food data fetch error:', error)
    return []
  }
}

// 人口数据
export async function fetchPopulationData(): Promise<PopulationData[]> {
  try {
    const demoData: PopulationData[] = [
      {
        country: 'China',
        population: 1425,
        population_growth_rate: -0.02,
        urbanization_rate: 65.2,
        median_age: 38.4,
        education_index: 0.768,
        life_expectancy: 78.2
      },
      {
        country: 'India',
        population: 1428,
        population_growth_rate: 0.81,
        urbanization_rate: 35.9,
        median_age: 28.7,
        education_index: 0.645,
        life_expectancy: 70.8
      },
      {
        country: 'United States',
        population: 339,
        population_growth_rate: 0.50,
        urbanization_rate: 83.1,
        median_age: 38.5,
        education_index: 0.892,
        life_expectancy: 77.5
      },
      {
        country: 'Indonesia',
        population: 277,
        population_growth_rate: 0.74,
        urbanization_rate: 57.3,
        median_age: 30.2,
        education_index: 0.713,
        life_expectancy: 71.7
      },
      {
        country: 'Brazil',
        population: 216,
        population_growth_rate: 0.52,
        urbanization_rate: 87.6,
        median_age: 33.5,
        education_index: 0.754,
        life_expectancy: 76.0
      },
      {
        country: 'Nigeria',
        population: 223,
        population_growth_rate: 2.41,
        urbanization_rate: 53.5,
        median_age: 18.6,
        education_index: 0.528,
        life_expectancy: 55.2
      },
      {
        country: 'Japan',
        population: 123,
        population_growth_rate: -0.53,
        urbanization_rate: 92.0,
        median_age: 49.5,
        education_index: 0.919,
        life_expectancy: 84.6
      },
      {
        country: 'Germany',
        population: 84,
        population_growth_rate: -0.09,
        urbanization_rate: 77.5,
        median_age: 45.2,
        education_index: 0.888,
        life_expectancy: 81.3
      },
      {
        country: 'Russia',
        population: 144,
        population_growth_rate: -0.19,
        urbanization_rate: 74.8,
        median_age: 40.3,
        education_index: 0.822,
        life_expectancy: 72.6
      },
      {
        country: 'United Kingdom',
        population: 67,
        population_growth_rate: 0.34,
        urbanization_rate: 84.4,
        median_age: 40.5,
        education_index: 0.891,
        life_expectancy: 81.2
      }
    ]
    return demoData
  } catch (error) {
    console.error('Population data fetch error:', error)
    return []
  }
}

// 综合国力指数
export interface ComprehensivePowerIndex {
  country: string
  overall_score: number
  economic_power: number
  military_power: number
  technological_power: number
  diplomatic_power: number
  soft_power: number
}

export async function fetchComprehensivePowerIndex(): Promise<ComprehensivePowerIndex[]> {
  try {
    const demoData: ComprehensivePowerIndex[] = [
      {
        country: 'United States',
        overall_score: 92.5,
        economic_power: 95,
        military_power: 98,
        technological_power: 96,
        diplomatic_power: 90,
        soft_power: 88
      },
      {
        country: 'China',
        overall_score: 85.3,
        economic_power: 92,
        military_power: 88,
        technological_power: 85,
        diplomatic_power: 78,
        soft_power: 68
      },
      {
        country: 'Russia',
        overall_score: 68.7,
        economic_power: 52,
        military_power: 95,
        technological_power: 65,
        diplomatic_power: 72,
        soft_power: 58
      },
      {
        country: 'Germany',
        overall_score: 72.4,
        economic_power: 78,
        military_power: 52,
        technological_power: 82,
        diplomatic_power: 75,
        soft_power: 85
      },
      {
        country: 'Japan',
        overall_score: 71.8,
        economic_power: 75,
        military_power: 58,
        technological_power: 88,
        diplomatic_power: 68,
        soft_power: 82
      },
      {
        country: 'United Kingdom',
        overall_score: 70.2,
        economic_power: 72,
        military_power: 68,
        technological_power: 75,
        diplomatic_power: 78,
        soft_power: 86
      },
      {
        country: 'France',
        overall_score: 68.5,
        economic_power: 68,
        military_power: 72,
        technological_power: 72,
        diplomatic_power: 75,
        soft_power: 84
      },
      {
        country: 'India',
        overall_score: 62.3,
        economic_power: 65,
        military_power: 68,
        technological_power: 58,
        diplomatic_power: 62,
        soft_power: 58
      },
      {
        country: 'South Korea',
        overall_score: 58.7,
        economic_power: 62,
        military_power: 55,
        technological_power: 78,
        diplomatic_power: 52,
        soft_power: 72
      },
      {
        country: 'Israel',
        overall_score: 52.4,
        economic_power: 48,
        military_power: 72,
        technological_power: 82,
        diplomatic_power: 42,
        soft_power: 45
      }
    ]
    return demoData
  } catch (error) {
    console.error('Comprehensive power index fetch error:', error)
    return []
  }
}
