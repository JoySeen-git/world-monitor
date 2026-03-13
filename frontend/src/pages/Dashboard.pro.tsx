import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, AttributionControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Card, Row, Col, Statistic, Table, Tag, Spin, Alert, Tabs, Select, Space, Button, Typography, Badge } from 'antd'
import {
  GlobalOutlined,
  WarningOutlined,
  FileTextOutlined,
  RiseOutlined,
  BankOutlined,
  FireOutlined,
  ReloadOutlined,
  PieChartOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  TeamOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  LineChart,
  Line
} from 'recharts'
import dayjs from 'dayjs'
import { useWebSocket, useStatistics, useEvents, useNews, useRiskIndices } from '../hooks/useData'
import { useEconomicRankings } from '../hooks/useEconomicData'
import {
  useTechnologyData,
  useEnvironmentData,
  useEnergyData,
  useFoodData,
  usePopulationData,
  usePowerIndex
} from '../hooks/useMultiDimensionData'
import { useLanguage, TranslationKey } from '../hooks/useLanguage'

const { Title, Text } = Typography

// 专业配色方案（基于 IBM Carbon Design System）
const PROFESSIONAL_COLORS = [
  '#005DFF', // IBM Blue
  '#24A148', // IBM Green
  '#FF7E47', // IBM Orange
  '#EB3C96', // IBM Magenta
  '#8A3FFC', // IBM Purple
  '#00B8A9', // IBM Teal
  '#FFD166', // IBM Yellow
  '#EF476F', // IBM Red
  '#118AB2', // IBM Cyan
  '#073B4C'  // IBM Dark
]

// 渐变色配置
const GRADIENTS = {
  blue: { start: '#667eea', end: '#764ba2' },
  green: { start: '#0ba360', end: '#3cba92' },
  orange: { start: '#f093fb', end: '#f5576c' },
  red: { start: '#fa709a', end: '#fee140' },
  purple: { start: '#667eea', end: '#764ba2' }
}

// 严重程度配置
const SEVERITY_COLORS: Record<number, string> = {
  1: '#24A148',
  2: '#005DFF',
  3: '#FF7E47',
  4: '#EB3C96'
}

// 国家翻译映射
const COUNTRY_TRANSLCTIONS: Record<string, Record<string, string>> = {
  zh: {
    'United States': '美国',
    'China': '中国',
    'Russia': '俄罗斯',
    'United Kingdom': '英国',
    'Germany': '德国',
    'France': '法国',
    'Japan': '日本',
    'India': '印度',
    'Brazil': '巴西',
    'Canada': '加拿大',
    'Australia': '澳大利亚',
    'South Korea': '韩国',
    'Italy': '意大利',
    'Spain': '西班牙',
    'Mexico': '墨西哥',
    'Indonesia': '印度尼西亚',
    'Saudi Arabia': '沙特阿拉伯',
    'Turkey': '土耳其',
    'Netherlands': '荷兰',
    'Switzerland': '瑞士'
  },
  en: {
    '美国': 'United States',
    '中国': 'China',
    '俄罗斯': 'Russia',
    '英国': 'United Kingdom',
    '德国': 'Germany',
    '法国': 'France',
    '日本': 'Japan',
    '印度': 'India',
    '巴西': 'Brazil',
    '加拿大': 'Canada',
    '澳大利亚': 'Australia',
    '韩国': 'South Korea',
    '意大利': 'Italy',
    '西班牙': 'Spain',
    '墨西哥': 'Mexico',
    '印度尼西亚': 'Indonesia',
    '沙特阿拉伯': 'Saudi Arabia',
    '土耳其': 'Turkey',
    '荷兰': 'Netherlands',
    '瑞士': 'Switzerland'
  }
}

const Dashboard = () => {
  const { t, language } = useLanguage()
  const { connected } = useWebSocket('ws://localhost:3001/ws')
  const stats = useStatistics()
  const events = useEvents()
  const news = useNews()
  const riskIndices = useRiskIndices()
  const economicRankings = useEconomicRankings()
  const technologyData = useTechnologyData()
  const environmentData = useEnvironmentData()
  const energyData = useEnergyData()
  const foodData = useFoodData()
  const populationData = usePopulationData()
  const powerIndex = usePowerIndex()

  const [activeTab, setActiveTab] = useState('overview')
  const [economicTab, setEconomicTab] = useState('gdp')
  const [dimensionTab, setDimensionTab] = useState('technology')
  const [timeRange, setTimeRange] = useState('7d')

  // 翻译国家名
  const translateCountry = (country: string) => {
    if (language === 'zh') {
      return COUNTRY_TRANSLCTIONS.zh[country] || country
    }
    return COUNTRY_TRANSLCTIONS.en[country] || country
  }

  // 风险数据
  const riskData = riskIndices.slice(0, 10).map(item => ({
    name: translateCountry(item.country),
    value: item.risk_score,
    events: item.event_count
  }))

  // 事件类型统计
  const eventsByTypeData = Object.entries(
    events.reduce((acc, curr) => {
      acc[curr.event_type] = (acc[curr.event_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({ name, count }))

  // 政治事件趋势
  const politicalData = events
    .filter(e => ['Diplomacy', 'Political'].includes(e.event_type))
    .reduce((acc: any[], curr) => {
      const date = dayjs(curr.date).format('MM-DD')
      const existing = acc.find(item => item.date === date)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ date, value: 1 })
      }
      return acc
    }, [])
    .slice(-30)

  // 经济事件趋势
  const economicData = events
    .filter(e => ['Economic', 'Trade'].includes(e.event_type))
    .reduce((acc: any[], curr) => {
      const date = dayjs(curr.date).format('MM-DD')
      const existing = acc.find(item => item.date === date)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ date, value: 1 })
      }
      return acc
    }, [])
    .slice(-30)

  // 军事事件趋势
  const militaryData = events
    .filter(e => ['Conflict', 'Military'].includes(e.event_type))
    .reduce((acc: any[], curr) => {
      const date = dayjs(curr.date).format('MM-DD')
      const existing = acc.find(item => item.date === date)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ date, value: 1 })
      }
      return acc
    }, [])
    .slice(-30)

  // 经济数据
  const gdpRanking = economicRankings.gdp.slice(0, 20).map(item => ({
    country: translateCountry(item.country),
    gdp_usd_billions: item.gdp_usd_billions,
    rank: item.rank
  }))

  const gdpGrowthRanking = economicRankings.gdpGrowth.slice(0, 20).map(item => ({
    country: translateCountry(item.country),
    gdp_growth_percent: item.gdp_growth_percent,
    rank: item.rank
  }))

  const militaryRanking = economicRankings.militarySpending.slice(0, 20).map(item => ({
    country: translateCountry(item.country),
    military_spending_usd_billions: item.military_spending_usd_billions,
    rank: item.rank
  }))

  const politicalStabilityRanking = economicRankings.politicalStability.slice(0, 20).map(item => ({
    country: translateCountry(item.country),
    political_stability_percent: item.political_stability_percent,
    rank: item.rank
  }))

  // 多维度数据
  const dimensionData = {
    technology: technologyData.map(item => ({
      country: translateCountry(item.country),
      innovation_index: item.innovation_index,
      r_d_spending: item.r_d_spending,
      patents_filed: item.patents_filed,
      digital_economy_ratio: item.digital_economy_ratio
    })),
    environment: environmentData.map(item => ({
      country: translateCountry(item.country),
      co2_emissions: item.co2_emissions,
      renewable_energy_ratio: item.renewable_energy_ratio,
      forest_coverage: item.forest_coverage
    })),
    energy: energyData.map(item => ({
      country: translateCountry(item.country),
      energy_production: item.energy_production,
      energy_consumption: item.energy_consumption,
      energy_independence_ratio: item.energy_independence_ratio,
      oil_reserves: item.oil_reserves
    })),
    food: foodData.map(item => ({
      country: translateCountry(item.country),
      food_security_index: item.food_security_index,
      grain_production: item.grain_production,
      import_dependency: item.import_dependency
    })),
    population: populationData.map(item => ({
      country: translateCountry(item.country),
      population: item.population,
      life_expectancy: item.life_expectancy,
      urbanization_rate: item.urbanization_rate,
      education_index: item.education_index
    }))
  }

  const dimensionConfigs: Record<string, { icon: any; metrics: string[] }> = {
    technology: {
      icon: <AppstoreOutlined />,
      metrics: ['innovation_index', 'r_d_spending', 'patents_filed']
    },
    environment: {
      icon: <EnvironmentOutlined />,
      metrics: ['co2_emissions', 'renewable_energy_ratio', 'forest_coverage']
    },
    energy: {
      icon: <ThunderboltOutlined />,
      metrics: ['energy_production', 'energy_independence_ratio', 'oil_reserves']
    },
    food: {
      icon: <HomeOutlined />,
      metrics: ['food_security_index', 'grain_production', 'import_dependency']
    },
    population: {
      icon: <TeamOutlined />,
      metrics: ['population', 'life_expectancy', 'education_index']
    }
  }

  // 事件表格列
  const eventColumns = [
    {
      title: t('event_type'),
      dataIndex: 'event_type',
      key: 'event_type',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
      fixed: 'left' as const,
      width: 120
    },
    {
      title: t('country'),
      dataIndex: 'country',
      key: 'country',
      render: (text: string) => translateCountry(text),
      width: 120
    },
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
      width: 110,
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    },
    {
      title: t('severity'),
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: number) => (
        <Badge
          count={t(`severity_${severity === 1 ? 'low' : severity === 2 ? 'medium' : severity === 3 ? 'high' : 'critical'}` as TranslationKey)}
          style={{
            backgroundColor: SEVERITY_COLORS[severity],
            fontSize: '12px',
            padding: '0 8px'
          }}
        />
      ),
      width: 100,
      filters: [
        { text: t('severity_low'), value: 1 },
        { text: t('severity_medium'), value: 2 },
        { text: t('severity_high'), value: 3 },
        { text: t('severity_critical'), value: 4 }
      ],
      onFilter: (value: any, record: any) => record.severity === value
    },
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      minWidth: 250
    }
  ]

  // 新闻表格列
  const newsColumns = [
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      minWidth: 300
    },
    {
      title: t('source'),
      dataIndex: 'source',
      key: 'source',
      width: 150
    },
    {
      title: t('published_at'),
      dataIndex: 'published_at',
      key: 'published_at',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      width: 160,
      sorter: (a: any, b: any) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
    },
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <Tag color="purple">{text}</Tag>,
      width: 100
    }
  ]

  // 渲染语言切换器
  const renderLanguageSwitcher = () => (
    <Space style={{ position: 'absolute', top: 24, right: 32, zIndex: 1000 }}>
      <Select
        value={language}
        onChange={() => {}}
        options={[
          { value: 'zh', label: '🇨🇳 中文' },
          { value: 'en', label: '🇺🇸 English' }
        ]}
        style={{ width: 120 }}
        size="small"
      />
    </Space>
  )

  // 渲染统计卡片
  const renderStatCards = () => (
    <Row gutter={[20, 20]}>
      <Col xs={24} sm={12} lg={6}>
        <Card 
          hoverable 
          style={{ 
            borderRadius: 12, 
            height: '100%',
            background: `linear-gradient(135deg, ${GRADIENTS.blue.start}, ${GRADIENTS.blue.end})`,
            border: 'none',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>{t('total_events')}</span>}
            value={stats?.totalEvents || 0}
            prefix={<GlobalOutlined style={{ color: 'white', fontSize: '24px' }} />}
            valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 700 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card 
          hoverable 
          style={{ 
            borderRadius: 12, 
            height: '100%',
            background: `linear-gradient(135deg, ${GRADIENTS.green.start}, ${GRADIENTS.green.end})`,
            border: 'none',
            boxShadow: '0 4px 16px rgba(11, 163, 96, 0.3)'
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>{t('countries_involved')}</span>}
            value={stats?.countriesInvolved || 0}
            prefix={<RiseOutlined style={{ color: 'white', fontSize: '24px' }} />}
            valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 700 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card 
          hoverable 
          style={{ 
            borderRadius: 12, 
            height: '100%',
            background: `linear-gradient(135deg, ${GRADIENTS.purple.start}, ${GRADIENTS.purple.end})`,
            border: 'none',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>{t('news_items')}</span>}
            value={stats?.totalNews || 0}
            prefix={<FileTextOutlined style={{ color: 'white', fontSize: '24px' }} />}
            valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 700 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card 
          hoverable 
          style={{ 
            borderRadius: 12, 
            height: '100%',
            background: `linear-gradient(135deg, ${GRADIENTS.orange.start}, ${GRADIENTS.orange.end})`,
            border: 'none',
            boxShadow: '0 4px 16px rgba(240, 147, 251, 0.3)'
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>{t('avg_severity')}</span>}
            value={(stats?.avgSeverity || 0).toFixed(2)}
            prefix={<WarningOutlined style={{ color: 'white', fontSize: '24px' }} />}
            valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 700 }}
          />
        </Card>
      </Col>
    </Row>
  )

  return (
    <div style={{ padding: '24px 32px', background: '#f0f2f5', minHeight: '100vh', position: 'relative' }}>
      {renderLanguageSwitcher()}
      
      {/* 标题区域 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>{t('app_title')}</Title>
        <Text type="secondary" style={{ fontSize: '14px' }}>{t('app_subtitle')}</Text>
      </div>

      {/* 警告提示 */}
      <Alert
        message={connected ? `${t('last_updated')}: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}` : t('network_error')}
        type={connected ? 'success' : 'warning'}
        showIcon
        style={{ marginBottom: 16, borderRadius: 8 }}
        action={
          <Button 
            size="small" 
            icon={<ReloadOutlined />} 
            onClick={() => window.location.reload()}
          >
            {t('refresh')}
          </Button>
        }
      />

      {/* 统计卡片 */}
      {renderStatCards()}

      {/* 主标签页 */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        size="large"
        style={{ 
          marginTop: 24,
          background: '#fff', 
          borderRadius: 12, 
          padding: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}
      >
        <TabPane tab={t('global_situation')} key="overview">
          {/* 地图和风险指数 */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={18}>
              <Card 
                title={<Space><GlobalOutlined />{t('map_title')}</Space>} 
                loading={events.length === 0}
                hoverable
                style={{ borderRadius: 12, minHeight: '600px' }}
              >
                <MapContainer
                  center={[20, 0]}
                  zoom={2}
                  style={{ height: 560, borderRadius: 8, background: '#1a1f2e' }}
                  zoomControl={false}
                  attributionControl={true}
                  preferCanvas={true}
                >
                  <ZoomControl position="bottomright" />
                  <AttributionControl position="bottomright" prefix="" />
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap & CARTO'
                    subdomains="abcd"
                    maxZoom={19}
                    updateWhenIdle={true}
                    updateWhenZooming={false}
                  />
                  {events.slice(0, 200).map((event) => (
                    event.latitude !== 0 && event.longitude !== 0 && (
                      <CircleMarker
                        key={event.event_id}
                        center={[event.latitude, event.longitude]}
                        radius={Math.min(25, event.severity * 6)}
                        pathOptions={{
                          color: SEVERITY_COLORS[event.severity],
                          fillColor: SEVERITY_COLORS[event.severity],
                          fillOpacity: 0.7,
                          weight: 2
                        }}
                      >
                        <Popup>
                          <div style={{ minWidth: 220 }}>
                            <strong style={{ fontSize: '14px', color: '#1890ff' }}>{event.event_type}</strong><br />
                            <span style={{ fontSize: '13px' }}>{translateCountry(event.country)}</span><br />
                            <span style={{ fontSize: '12px', color: '#666' }}>{dayjs(event.date).format('YYYY-MM-DD')}</span>
                            {event.title && (
                              <div style={{ marginTop: 8, fontSize: '12px', color: '#333' }}>{event.title}</div>
                            )}
                          </div>
                        </Popup>
                      </CircleMarker>
                    )
                  ))}
                </MapContainer>
              </Card>
            </Col>
            <Col xs={24} lg={6}>
              <Card 
                title={<Space><WarningOutlined />{t('risk_index_top10')}</Space>} 
                loading={riskIndices.length === 0}
                hoverable
                style={{ borderRadius: 12, height: '600px' }}
              >
                <ResponsiveContainer width="100%" height={520}>
                  <BarChart data={riskData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: 'none'
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* 事件列表 */}
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card 
                title={<Space><FileTextOutlined />{t('event_list')}</Space>} 
                loading={events.length === 0}
                hoverable
                style={{ borderRadius: 12 }}
              >
                <Table
                  columns={eventColumns}
                  dataSource={events.slice(0, 20)}
                  rowKey="event_id"
                  pagination={{ 
                    pageSize: 20,
                    showSizeChanger: true,
                    showTotal: (total) => `${t('total')}: ${total}`
                  }}
                  scroll={{ x: 1000 }}
                  size="middle"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab={t('trend_analysis')} key="trends">
          {/* 趋势图表 */}
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card 
                title={<Space><RiseOutlined />{t('political_trend')}</Space>}
                hoverable
                style={{ borderRadius: 12, height: '380px' }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={politicalData}>
                    <defs>
                      <linearGradient id="colorPolitical" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: 'none'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      fill="url(#colorPolitical)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card 
                title={<Space><BankOutlined />{t('economic_trend')}</Space>}
                hoverable
                style={{ borderRadius: 12, height: '380px' }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={economicData}>
                    <defs>
                      <linearGradient id="colorEconomic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: 'none'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#82ca9d" 
                      fill="url(#colorEconomic)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card 
                title={<Space><FireOutlined />{t('military_trend')}</Space>}
                hoverable
                style={{ borderRadius: 12, height: '380px' }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={militaryData}>
                    <defs>
                      <linearGradient id="colorMilitary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: 'none'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#ff6b6b" 
                      fill="url(#colorMilitary)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* 分布和维度分析 */}
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={12}>
              <Card 
                title={<Space><PieChartOutlined />{t('event_distribution')}</Space>}
                hoverable
                style={{ borderRadius: 12, height: '380px' }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={eventsByTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.count}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      innerRadius={50}
                    >
                      {eventsByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ 
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: 'none'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={<Space><BarChartOutlined />{t('dimension_analysis')}</Space>}
                hoverable
                style={{ borderRadius: 12, height: '380px' }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                    { subject: t('dimension_political'), A: 80, fullMark: 100 },
                    { subject: t('dimension_economic'), A: 75, fullMark: 100 },
                    { subject: t('dimension_military'), A: 65, fullMark: 100 },
                    { subject: t('dimension_technology'), A: 85, fullMark: 100 },
                    { subject: t('dimension_environment'), A: 70, fullMark: 100 },
                    { subject: t('dimension_energy'), A: 60, fullMark: 100 }
                  ]}>
                    <PolarGrid stroke="#f0f0f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    <Radar name={t('dimension_analysis')} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} strokeWidth={3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab={t('economic_data')} key="economic">
          <Card style={{ borderRadius: 12 }}>
            <Tabs activeKey={economicTab} onChange={setEconomicTab} size="large">
              <TabPane tab={t('gdp_total')} key="gdp">
                <ResponsiveContainer width="100%" height={450}>
                  <BarChart data={gdpRanking}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis label={{ value: t('unit_usd_billion'), angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: 'none'
                      }}
                    />
                    <Bar dataKey="gdp_usd_billions" name={t('gdp_total')} fill="#1890ff" radius={[4, 4, 0, 0]}>
                      {gdpRanking.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </TabPane>
              <TabPane tab={t('gdp_growth')} key="growth">
                <ResponsiveContainer width="100%" height={450}>
                  <BarChart data={gdpGrowthRanking}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis label={{ value: t('unit_percent'), angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: 'none'
                      }}
                    />
                    <Bar dataKey="gdp_growth_percent" name={t('gdp_growth')} fill="#52c41a" radius={[4, 4, 0, 0]}>
                      {gdpGrowthRanking.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </TabPane>
              <TabPane tab={t('military_spending')} key="military">
                <ResponsiveContainer width="100%" height={450}>
                  <BarChart data={militaryRanking}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis label={{ value: t('unit_usd_billion'), angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: 'none'
                      }}
                    />
                    <Bar dataKey="military_spending_usd_billions" name={t('military_spending')} fill="#f5222d" radius={[4, 4, 0, 0]}>
                      {militaryRanking.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </TabPane>
              <TabPane tab={t('political_stability')} key="stability">
                <ResponsiveContainer width="100%" height={450}>
                  <BarChart data={politicalStabilityRanking}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis label={{ value: t('unit_percent'), angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: 'none'
                      }}
                    />
                    <Bar dataKey="political_stability_percent" name={t('political_stability')} fill="#722ed1" radius={[4, 4, 0, 0]}>
                      {politicalStabilityRanking.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </TabPane>
            </Tabs>
          </Card>
        </TabPane>

        <TabPane tab={t('multi_dimension')} key="multi_dimension">
          <Card style={{ borderRadius: 12 }}>
            <Tabs activeKey={dimensionTab} onChange={setDimensionTab} size="large">
              {Object.keys(dimensionConfigs).map(key => (
                <TabPane 
                  tab={<Space>{dimensionConfigs[key].icon}{t(`dimension_${key}`)}</Space>} 
                  key={key}
                >
                  <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={dimensionData[key as keyof typeof dimensionData].slice(0, 15)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ 
                          borderRadius: 8,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          border: 'none'
                        }}
                      />
                      <Legend />
                      {dimensionConfigs[key].metrics.slice(0, 3).map((metric, index) => (
                        <Bar
                          key={metric}
                          dataKey={metric}
                          name={t(metric as TranslationKey)}
                          fill={PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length]}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </TabPane>
              ))}
            </Tabs>
          </Card>
        </TabPane>

        <TabPane tab={t('global_news')} key="news">
          <Card loading={news.length === 0} style={{ borderRadius: 12 }}>
            <Table
              columns={newsColumns}
              dataSource={news.slice(0, 50)}
              rowKey="id"
              pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (total) => `${t('total')}: ${total}` }}
              scroll={{ x: 1200 }}
              size="middle"
            />
          </Card>
        </TabPane>

        <TabPane tab={t('power_index')} key="power">
          <Card title={t('comprehensive_power')} style={{ borderRadius: 12 }}>
            <ResponsiveContainer width="100%" height={550}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={powerIndex.slice(0, 10)}>
                <PolarGrid stroke="#f0f0f0" />
                <PolarAngleAxis dataKey="country" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name={t('comprehensive_power')} dataKey="overall_score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} strokeWidth={3} />
                <Radar name={t('economic_power')} dataKey="economic_power" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} strokeWidth={3} />
                <Radar name={t('military_power')} dataKey="military_power" stroke="#ff6b6b" fill="#ff6b6b" fillOpacity={0.6} strokeWidth={3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Dashboard
