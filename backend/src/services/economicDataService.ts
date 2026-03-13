import axios from 'axios'

interface CountryData {
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

export async function fetchWorldBankData(): Promise<CountryData[]> {
  try {
    const indicators = [
      'NY.GDP.MKTP.CD',
      'NY.GDP.MKTP.KD.ZG',
      'FP.CPI.TOTL.ZG',
      'SL.UEM.TOTL.ZS',
      'MS.MIL.XPND.CD',
      'PV.EST',
      'CPI.A.IDX',
      'HD.HCI.OVRL'
    ]

    const response = await axios.get(
      `https://api.worldbank.org/v2/country/all/indicator/${indicators.join(';')}?format=json&per_page=300&date=2023`,
      { timeout: 15000 }
    )

    if (response.data && Array.isArray(response.data) && response.data.length > 1) {
      const data = response.data[1]
      const countryMap = new Map<string, CountryData>()

      data.forEach((item: any) => {
        const countryCode = item.countryiso3code
        const countryName = item.country.value

        if (!countryMap.has(countryCode)) {
          countryMap.set(countryCode, {
            country: countryName,
            code: countryCode,
            year: 2023
          })
        }

        const countryData = countryMap.get(countryCode)!

        switch (item.indicator.id) {
          case 'NY.GDP.MKTP.CD':
            countryData.gdp = item.value
            break
          case 'NY.GDP.MKTP.KD.ZG':
            countryData.gdp_growth = item.value
            break
          case 'FP.CPI.TOTL.ZG':
            countryData.inflation = item.value
            break
          case 'SL.UEM.TOTL.ZS':
            countryData.unemployment = item.value
            break
          case 'MS.MIL.XPND.CD':
            countryData.military_expenditure = item.value
            break
          case 'PV.EST':
            countryData.political_stability = item.value
            break
          case 'HD.HCI.OVRL':
            countryData.human_development = item.value
            break
        }
      })

      return Array.from(countryMap.values())
    }

    return []
  } catch (error: any) {
    console.error('World Bank fetch error:', error.message)
    return generateDemoEconomicData()
  }
}

export async function fetchUNDATA(): Promise<CountryData[]> {
  try {
    const response = await axios.get(
      'https://population.un.org/dataportalapi/api/v1/data/indicators/2/locations',
      { timeout: 15000 }
    )

    if (response.data && response.data.data) {
      return response.data.data.map((item: any) => ({
        country: item.location || 'Unknown',
        code: item.locationCode || 'UNK',
        population: item.value || 0,
        year: item.time || 2023
      }))
    }

    return []
  } catch (error: any) {
    console.error('UN Data fetch error:', error.message)
    return []
  }
}

export async function fetchTransparencyIndex(): Promise<CountryData[]> {
  try {
    const response = await axios.get(
      'https://api.transparency.org/api/countries/',
      { timeout: 15000 }
    )

    if (response.data && response.data.results) {
      return response.data.results.map((item: any) => ({
        country: item.name || 'Unknown',
        code: item.code || 'UNK',
        corruption_index: item.score || 0,
        year: 2023
      }))
    }

    return []
  } catch (error: any) {
    console.error('Transparency Index fetch error:', error.message)
    return []
  }
}

function generateDemoEconomicData(): CountryData[] {
  const demoData: CountryData[] = [
    {
      country: 'United States',
      code: 'USA',
      gdp: 27360935000000,
      gdp_growth: 2.5,
      inflation: 4.1,
      unemployment: 3.7,
      military_expenditure: 916000000000,
      political_stability: 0.25,
      human_development: 0.921,
      year: 2023
    },
    {
      country: 'China',
      code: 'CHN',
      gdp: 17734062645371,
      gdp_growth: 5.2,
      inflation: 0.2,
      unemployment: 5.2,
      military_expenditure: 292000000000,
      political_stability: -0.35,
      human_development: 0.788,
      year: 2023
    },
    {
      country: 'Japan',
      code: 'JPN',
      gdp: 4230862178297,
      gdp_growth: 1.9,
      inflation: 3.3,
      unemployment: 2.6,
      military_expenditure: 50000000000,
      political_stability: 0.55,
      human_development: 0.925,
      year: 2023
    },
    {
      country: 'Germany',
      code: 'DEU',
      gdp: 4456081000000,
      gdp_growth: -0.3,
      inflation: 6.1,
      unemployment: 3.0,
      military_expenditure: 65000000000,
      political_stability: 0.65,
      human_development: 0.950,
      year: 2023
    },
    {
      country: 'India',
      code: 'IND',
      gdp: 3730000000000,
      gdp_growth: 7.2,
      inflation: 5.4,
      unemployment: 7.8,
      military_expenditure: 81000000000,
      political_stability: -0.45,
      human_development: 0.644,
      year: 2023
    },
    {
      country: 'United Kingdom',
      code: 'GBR',
      gdp: 3340000000000,
      gdp_growth: 0.5,
      inflation: 7.3,
      unemployment: 4.2,
      military_expenditure: 68000000000,
      political_stability: 0.15,
      human_development: 0.929,
      year: 2023
    },
    {
      country: 'France',
      code: 'FRA',
      gdp: 3050000000000,
      gdp_growth: 0.9,
      inflation: 5.7,
      unemployment: 7.3,
      military_expenditure: 56000000000,
      political_stability: 0.35,
      human_development: 0.910,
      year: 2023
    },
    {
      country: 'Russia',
      code: 'RUS',
      gdp: 2060000000000,
      gdp_growth: 3.0,
      inflation: 5.9,
      unemployment: 3.0,
      military_expenditure: 109000000000,
      political_stability: -0.85,
      human_development: 0.822,
      year: 2023
    },
    {
      country: 'Brazil',
      code: 'BRA',
      gdp: 2170000000000,
      gdp_growth: 2.9,
      inflation: 4.6,
      unemployment: 8.0,
      military_expenditure: 20000000000,
      political_stability: -0.55,
      human_development: 0.760,
      year: 2023
    },
    {
      country: 'Israel',
      code: 'ISR',
      gdp: 525000000000,
      gdp_growth: 2.0,
      inflation: 3.0,
      unemployment: 3.4,
      military_expenditure: 24000000000,
      political_stability: -0.95,
      human_development: 0.919,
      year: 2023
    },
    {
      country: 'Ukraine',
      code: 'UKR',
      gdp: 160000000000,
      gdp_growth: 5.0,
      inflation: 26.0,
      unemployment: 22.0,
      military_expenditure: 55000000000,
      political_stability: -1.25,
      human_development: 0.779,
      year: 2023
    },
    {
      country: 'Syria',
      code: 'SYR',
      gdp: 40000000000,
      gdp_growth: -5.0,
      inflation: 139.0,
      unemployment: 50.0,
      military_expenditure: 5000000000,
      political_stability: -2.15,
      human_development: 0.567,
      year: 2023
    }
  ]

  return demoData
}

export async function getEconomicIndicators(): Promise<CountryData[]> {
  const [worldBank, unData, transparency] = await Promise.all([
    fetchWorldBankData(),
    fetchUNDATA(),
    fetchTransparencyIndex()
  ])

  const countryMap = new Map<string, CountryData>()

  worldBank.forEach(data => {
    countryMap.set(data.code, { ...data })
  })

  unData.forEach(data => {
    const existing = countryMap.get(data.code)
    if (existing) {
      existing.population = data.population
    } else {
      countryMap.set(data.code, data)
    }
  })

  transparency.forEach(data => {
    const existing = countryMap.get(data.code)
    if (existing) {
      existing.corruption_index = data.corruption_index
    } else {
      countryMap.set(data.code, data)
    }
  })

  const result = Array.from(countryMap.values())
  return result.length > 0 ? result : generateDemoEconomicData()
}
