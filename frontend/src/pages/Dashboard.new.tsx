import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, AttributionControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { 
  Card, Row, Col, Statistic, Table, Tag, Spin, Alert, Tabs, 
  Select, Space, Button, Badge, Avatar, Typography, Divider, 
  StatisticProps, theme as antdTheme, ConfigProvider, FloatButton, Tooltip
} from 'antd'
import {
  GlobalOutlined, WarningOutlined, FileTextOutlined, RiseOutlined,
  LineChartOutlined, BankOutlined, TechnologyOutlined, EnvironmentOutlined,
  RocketOutlined, ShopOutlined, UserOutlined, DashboardOutlined,
  ReloadOutlined, ThunderboltOutlined, FireOutlined, CloudOutlined,
  GoldOutlined, HomeOutlined, TeamOutlined, ClockCircleOutlined,
  CheckCircleOutlined, CloseCircleOutlined, PoweroffOutlined,
  AppstoreOutlined, SafetyOutlined
} from '@ant-design/icons'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts'
import dayjs from 'dayjs'
import { useWebSocket, useStatistics, useEvents, useNews, useRiskIndices } from '../hooks/useData'
import { useEconomicRankings } from '../hooks/useEconomicData'
import {
  useTechnologyData, useEnvironmentData, useEnergyData,
  useFoodData, usePopulationData, useComprehensivePowerIndex
} from '../hooks/useMultiDimensionData'
import { useLanguage, TranslationKey } from '../hooks/useLanguage'
import { gradients, shadows, colorSchemes, animations, borderRadius, spacing } from '../styles/theme'

const { TabPane } = Tabs
const { Option } = Select
const { Title, Text } = Typography

// 严重程度颜色映射
const SEVERITY_COLORS = colorSchemes.severity

// 图表颜色
const CHART_COLORS = colorSchemes.charts

// 维度图标映射
const dimensionIcons: Record<string, any> = {
  overview: <DashboardOutlined />,
  trend: <RiseOutlined />,
  economic: <BankOutlined />,
  news: <FileTextOutlined />,
  technology: <AppstoreOutlined />,
  environment: <EnvironmentOutlined />,
  energy: <ThunderboltOutlined />,
  food: <HomeOutlined />,
  population: <TeamOutlined />,
  power: <FireOutlined />
}

// 维度颜色映射
const dimensionColors: Record<string, string> = {
  overview: gradients.blue,
  trend: gradients.purple,
  economic: gradients.green,
  news: gradients.orange,
  technology: gradients.purple,
  environment: gradients.green,
  energy: gradients.warning,
  food: gradients.danger,
  population: gradients.info,
  power: gradients.primary
}

function Dashboard() {
  const { lang, t, changeLanguage, languages } = useLanguage()
  const { useToken } = antdTheme
  const { token } = useToken()
  
  // WebSocket 和数据 hooks
  const { connected } = useWebSocket('ws://localhost:3001/ws')
  const { stats, loading: statsLoading } = useStatistics()
  const { events, loading: eventsLoading } = useEvents(7)
  const { news, loading: newsLoading } = useNews(3)
  const { indices, loading: riskLoading } = useRiskIndices()
  
  // 经济数据
  const { 
    gdpRanking, gdpGrowthRanking, militaryRanking,
    politicalStabilityRanking, loading: economicLoading 
  } = useEconomicRankings()
  
  // 多维度数据
  const { data: technologyData } = useTechnologyData()
  const { data: environmentData } = useEnvironmentData()
  const { data: energyData } = useEnergyData()
  const { data: foodData } = useFoodData()
  const { data: populationData } = usePopulationData()
  const { data: powerIndex } = useComprehensivePowerIndex()

  // 状态
  const [activeTab, setActiveTab] = useState('overview')
  const [economicTab, setEconomicTab] = useState('gdp')
  const [dimensionTab, setDimensionTab] = useState('technology')
  const [mapCenter] = useState<[number, number]>([20, 0])

  // 数据处理
  const eventsByTypeData = stats?.eventsByType || []
  
  const riskData = indices.slice(0, 10).map((item) => ({
    name: item.country,
    value: item.risk_score,
    fullMark: 100
  }))

  // 趋势数据
  const getTrendData = (types: string[]) => {
    return events
      .filter(e => types.includes(e.event_type))
      .reduce((acc: Array<{date: string; value: number}>, curr) => {
        const date = dayjs(curr.date).format('MM-DD')
        const found = acc.find(item => item.date === date)
        if (found) {
          found.value += 1
        } else {
          acc.push({ date, value: 1 })
        }
        return acc
      }, [])
      .slice(-7)
  }

  const politicalData = getTrendData(['Diplomacy', 'Political'])
  const economicData = getTrendData(['Economic', 'Trade'])
  const militaryData = getTrendData(['Conflict', 'Military'])

  // 统计卡片配置
  const statCards = [
    {
      title: t('total_events'),
      value: stats?.totalEvents || 0,
      icon: <GlobalOutlined />,
      gradient: gradients.blue,
      prefix: <GlobalOutlined />
    },
    {
      title: t('countries_involved'),
      value: stats?.countriesInvolved || 0,
      icon: <TeamOutlined />,
      gradient: gradients.green,
      prefix: <TeamOutlined />
    },
    {
      title: t('news_items'),
      value: stats?.totalNews || 0,
      icon: <FileTextOutlined />,
      gradient: gradients.purple,
      prefix: <FileTextOutlined />
    },
    {
      title: t('avg_severity'),
      value: stats?.avgSeverity?.toFixed(2) || 0,
      icon: <WarningOutlined />,
      gradient: gradients.orange,
      prefix: <WarningOutlined />
    }
  ]

  // 事件表格列
  const eventColumns = [
    {
      title: t('event_type'),
      dataIndex: 'event_type',
      key: 'event_type',
      render: (text: string) => (
        <Tag color="blue" style={{ borderRadius: borderRadius.sm }}>{text}</Tag>
      )
    },
    {
      title: t('country'),
      dataIndex: 'country',
      key: 'country'
    },
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => (
        <Space>
          <ClockCircleOutlined style={{ color: token.colorTextSecondary }} />
          {dayjs(text).format('YYYY-MM-DD')}
        </Space>
      )
    },
    {
      title: t('severity'),
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: number) => {
        const severityMap = {
          1: { color: SEVERITY_COLORS.low, text: t('severity_low') },
          2: { color: SEVERITY_COLORS.medium, text: t('severity_medium') },
          3: { color: SEVERITY_COLORS.high, text: t('severity_high') },
          4: { color: SEVERITY_COLORS.critical, text: t('severity_critical') }
        }
        const { color, text } = severityMap[severity as keyof typeof severityMap] || severityMap[2]
        return (
          <Tag color={color} style={{ borderRadius: borderRadius.sm, minWidth: 50 }}>
            {text}
          </Tag>
        )
      }
    },
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: { showTitle: false }
    }
  ]

  // 新闻表格列
  const newsColumns = [
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: { showTitle: false },
      render: (text: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.source}</Text>
        </Space>
      )
    },
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => (
        <Tag color="cyan" style={{ borderRadius: borderRadius.sm }}>{text}</Tag>
      )
    },
    {
      title: t('published_at'),
      dataIndex: 'published_at',
      key: 'published_at',
      render: (text: string) => (
        <Text type="secondary">{dayjs(text).format('MM-DD HH:mm')}</Text>
      )
    }
  ]

  // 渲染语言切换器
  const renderLanguageSwitcher = () => (
    <FloatButton.Group shape="circle" style={{ right: 24, top: 24 }}>
      <Select
        value={lang}
        onChange={changeLanguage}
        style={{ width: 120 }}
        options={languages.map(l => ({ value: l.code, label: l.name }))}
        size="large"
      />
    </FloatButton.Group>
  )

  // 渲染状态徽章
  const renderStatusBadge = () => (
    <Badge
      count={connected ? t('connected') : t('disconnected')}
      color={connected ? 'success' : 'error'}
      style={{ position: 'absolute', top: 16, left: 24, zIndex: 1000 }}
    />
  )

  // 渲染统计卡片
  const renderStatCards = () => (
    <Row gutter={[spacing.lg, spacing.lg]}>
      {statCards.map((card, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card
            hoverable
            style={{
              borderRadius: borderRadius.lg,
              boxShadow: shadows.medium,
              background: card.gradient,
              color: '#fff',
              height: '100%',
              transition: 'all 0.3s',
              transform: 'translateY(0)',
              animation: `${animations.slideUp} 0.5s ease-out ${index * 0.1}s both`
            }}
            bodyStyle={{ padding: spacing.lg }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>{card.title}</span>}
              value={card.value}
              prefix={card.prefix}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: typography.weights.bold }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  )

  // 渲染地图
  const renderMap = () => (
    <Card
      title={<Space><GlobalOutlined />{t('map_title')}</Space>}
      extra={<Button type="text" icon={<ReloadOutlined />} onClick={() => window.location.reload()} />}
      style={{ borderRadius: borderRadius.lg, boxShadow: shadows.medium }}
    >
      <MapContainer
        center={mapCenter}
        zoom={2}
        style={{ height: 540, borderRadius: borderRadius.lg, background: '#1a1f2e' }}
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
              radius={Math.min(20, event.severity * 5)}
              pathOptions={{
                color: SEVERITY_COLORS[event.severity as keyof typeof SEVERITY_COLORS],
                fillColor: SEVERITY_COLORS[event.severity as keyof typeof SEVERITY_COLORS],
                fillOpacity: 0.6,
                weight: 1
              }}
            >
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <strong>{event.event_type}</strong><br />
                  <span>{event.country}</span><br />
                  <span style={{ fontSize: 12, color: '#666' }}>{dayjs(event.date).format('YYYY-MM-DD')}</span>
                  {event.title && <><br /><span style={{ fontSize: 12 }}>{event.title}</span></>}
                </div>
              </Popup>
            </CircleMarker>
          )
        ))}
      </MapContainer>
    </Card>
  )

  // 渲染风险指数 TOP10
  const renderRiskIndex = () => (
    <Card
      title={<Space><WarningOutlined />{t('risk_index_top10')}</Space>}
      style={{ borderRadius: borderRadius.lg, boxShadow: shadows.medium, height: '100%' }}
    >
      <ResponsiveContainer width="100%" height={480}>
        <BarChart
          data={riskData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="name" type="category" width={100} />
          <RechartsTooltip 
            contentStyle={{ 
              borderRadius: borderRadius.md,
              boxShadow: shadows.medium 
            }}
          />
          <Bar dataKey="value" fill="#667eea" radius={[0, 4, 4, 0]} barSize={20}>
            {riskData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )

  // 渲染趋势图表
  const renderTrendCharts = () => (
    <Row gutter={[spacing.lg, spacing.lg]}>
      <Col xs={24} lg={12}>
        <Card
          title={<Space><RiseOutlined />{t('political_trend')}</Space>}
          style={{ borderRadius: borderRadius.lg, boxShadow: shadows.medium, height: '100%' }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={politicalData}>
              <defs>
                <linearGradient id="colorPolitical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Area type="monotone" dataKey="value" stroke="#667eea" fillOpacity={1} fill="url(#colorPolitical)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      
      <Col xs={24} lg={12}>
        <Card
          title={<Space><GoldOutlined />{t('economic_trend')}</Space>}
          style={{ borderRadius: borderRadius.lg, boxShadow: shadows.medium, height: '100%' }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={economicData}>
              <defs>
                <linearGradient id="colorEconomic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#43e97b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#43e97b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Area type="monotone" dataKey="value" stroke="#43e97b" fillOpacity={1} fill="url(#colorEconomic)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      
      <Col xs={24} lg={12}>
        <Card
          title={<Space><FireOutlined />{t('military_trend')}</Space>}
          style={{ borderRadius: borderRadius.lg, boxShadow: shadows.medium, height: '100%' }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={militaryData}>
              <defs>
                <linearGradient id="colorMilitary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fa709a" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#fa709a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Area type="monotone" dataKey="value" stroke="#fa709a" fillOpacity={1} fill="url(#colorMilitary)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      
      <Col xs={24} lg={12}>
        <Card
          title={<Space><LineChartOutlined />{t('event_distribution')}</Space>}
          style={{ borderRadius: borderRadius.lg, boxShadow: shadows.medium, height: '100%' }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={eventsByTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {eventsByTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  )

  // 渲染经济数据表格
  const renderEconomicTables = () => {
    const tableData = {
      gdp: gdpRanking,
      growth: gdpGrowthRanking,
      military: militaryRanking,
      stability: politicalStabilityRanking
    }
    
    const columns = [
      {
        title: t('rank'),
        dataIndex: 'rank',
        key: 'rank',
        width: 80,
        render: (rank: number) => (
          <Badge 
            count={rank} 
            style={{ 
              backgroundColor: rank <= 3 ? '#f5222d' : rank <= 10 ? '#faad14' : '#d9d9d9',
              borderRadius: borderRadius.sm
            }} 
          />
        )
      },
      {
        title: t('country'),
        dataIndex: 'country',
        key: 'country'
      }
    ]

    if (economicTab === 'gdp') {
      columns.push({
        title: t('gdp_total'),
        dataIndex: 'gdp',
        key: 'gdp',
        render: (value: number) => `${value.toFixed(2)} ${t('unit_usd_billion')}`,
        sorter: (a: any, b: any) => a.gdp - b.gdp
      })
    } else if (economicTab === 'growth') {
      columns.push({
        title: t('gdp_growth'),
        dataIndex: 'gdp_growth',
        key: 'gdp_growth',
        render: (value: number) => `${value.toFixed(2)}${t('unit_percent')}`,
        sorter: (a: any, b: any) => a.gdp_growth - b.gdp_growth
      })
    } else if (economicTab === 'military') {
      columns.push({
        title: t('military_spending'),
        dataIndex: 'military_spending',
        key: 'military_spending',
        render: (value: number) => `${value.toFixed(2)} ${t('unit_usd_billion')}`,
        sorter: (a: any, b: any) => a.military_spending - b.military_spending
      })
    } else {
      columns.push({
        title: t('political_stability'),
        dataIndex: 'political_stability',
        key: 'political_stability',
        render: (value: number) => value.toFixed(2),
        sorter: (a: any, b: any) => a.political_stability - b.political_stability
      })
    }

    return (
      <Card
        title={<Space><BankOutlined />{t('economic_data')}</Space>}
        extra={
          <Select
            value={economicTab}
            onChange={setEconomicTab}
            style={{ width: 150 }}
            options={[
              { value: 'gdp', label: t('gdp_total') },
              { value: 'growth', label: t('gdp_growth') },
              { value: 'military', label: t('military_spending') },
              { value: 'stability', label: t('political_stability') }
            ]}
          />
        }
        style={{ borderRadius: borderRadius.lg, boxShadow: shadows.medium }}
      >
        <Table
          columns={columns}
          dataSource={(tableData as any)[economicTab]?.slice(0, 20) || []}
          rowKey="country"
          pagination={{ pageSize: 20 }}
          size="small"
        />
      </Card>
    )
  }

  // 渲染多维度数据
  const renderMultiDimension = () => {
    const dimensionData: Record<string, any> = {
      technology: technologyData,
      environment: environmentData,
      energy: energyData,
      food: foodData,
      population: populationData
    }

    const dimensionConfigs: Record<string, any> = {
      technology: {
        icon: <TechnologyOutlined />,
        gradient: gradients.purple,
        metrics: [
          { key: 'innovation_index', label: t('innovation_index'), unit: '' },
          { key: 'r_d_spending', label: t('r_d_spending'), unit: t('unit_usd_billion') },
          { key: 'patents_filed', label: t('patents_filed'), unit: '' },
          { key: 'digital_economy_gdp_ratio', label: t('digital_economy_ratio'), unit: t('unit_percent') },
          { key: 'ai_investment', label: t('ai_investment'), unit: t('unit_usd_billion') }
        ]
      },
      environment: {
        icon: <EnvironmentOutlined />,
        gradient: gradients.green,
        metrics: [
          { key: 'co2_emissions', label: t('co2_emissions'), unit: '' },
          { key: 'renewable_energy_ratio', label: t('renewable_energy'), unit: t('unit_percent') },
          { key: 'forest_coverage', label: t('forest_coverage'), unit: t('unit_percent') },
          { key: 'air_quality_index', label: t('air_quality'), unit: '' },
          { key: 'water_quality_index', label: t('water_quality'), unit: '' }
        ]
      },
      energy: {
        icon: <ThunderboltOutlined />,
        gradient: gradients.warning,
        metrics: [
          { key: 'energy_production', label: t('energy_production'), unit: '' },
          { key: 'energy_consumption', label: t('energy_consumption'), unit: '' },
          { key: 'oil_reserves', label: t('oil_reserves'), unit: '' },
          { key: 'gas_reserves', label: t('gas_reserves'), unit: '' },
          { key: 'energy_independence', label: t('energy_independence'), unit: t('unit_percent') }
        ]
      },
      food: {
        icon: <HomeOutlined />,
        gradient: gradients.danger,
        metrics: [
          { key: 'food_security_index', label: t('food_security'), unit: '' },
          { key: 'food_production', label: t('food_production'), unit: '' },
          { key: 'import_dependency', label: t('import_dependency'), unit: t('unit_percent') },
          { key: 'agricultural_land', label: t('agricultural_land'), unit: t('unit_percent') },
          { key: 'irrigation_coverage', label: t('irrigation_coverage'), unit: t('unit_percent') }
        ]
      },
      population: {
        icon: <TeamOutlined />,
        gradient: gradients.info,
        metrics: [
          { key: 'population', label: t('population_total'), unit: '' },
          { key: 'population_growth', label: t('population_growth'), unit: t('unit_percent') },
          { key: 'urbanization_rate', label: t('urbanization_rate'), unit: t('unit_percent') },
          { key: 'median_age', label: t('median_age'), unit: '' },
          { key: 'education_index', label: t('education_index'), unit: '' },
          { key: 'life_expectancy', label: t('life_expectancy'), unit: '' }
        ]
      }
    }

    const currentData = dimensionData[dimensionTab] || []
    const config = dimensionConfigs[dimensionTab]

    return (
      <Card
        title={<Space>{config.icon}{t(`dimension_${dimensionTab}`)}</Space>}
        style={{ borderRadius: borderRadius.lg, boxShadow: shadows.medium }}
      >
        <Tabs
          activeKey={dimensionTab}
          onChange={setDimensionTab}
          items={Object.keys(dimensionConfigs).map(key => ({
            key,
            label: (
              <Space>
                {dimensionConfigs[key].icon}
                {t(`dimension_${key}`)}
              </Space>
            )
          }))}
        />
        
        <Divider style={{ margin: spacing.md }} />
        
        {currentData.length > 0 ? (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={currentData.slice(0, 15)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="country" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              {config.metrics.slice(0, 3).map((metric: any, index: number) => (
                <Bar
                  key={metric.key}
                  dataKey={metric.key}
                  name={metric.label}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Text type="secondary">{t('no_data')}</Text>
          </div>
        )}
      </Card>
    )
  }

  // 渲染国力指数
  const renderPowerIndex = () => {
    const powerData = powerIndex.length > 0 ? powerIndex[0] : null
    
    if (!powerData) {
      return (
        <Card style={{ borderRadius: borderRadius.lg, boxShadow: shadows.medium }}>
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Text type="secondary">{t('no_data')}</Text>
          </div>
        </Card>
      )
    }

    const radarData = [
      { subject: t('economic_power'), A: powerData.economic_power, fullMark: 100 },
      { subject: t('military_power'), A: powerData.military_power, fullMark: 100 },
      { subject: t('technological_power'), A: powerData.technological_power, fullMark: 100 },
      { subject: t('diplomatic_power'), A: powerData.diplomatic_power, fullMark: 100 },
      { subject: t('soft_power'), A: powerData.soft_power, fullMark: 100 }
    ]

    return (
      <Card
        title={<Space><FireOutlined />{t('comprehensive_power')}</Space>}
        style={{ borderRadius: borderRadius.lg, boxShadow: shadows.medium }}
      >
        <Row gutter={spacing.lg}>
          <Col span={12}>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name={powerData.country} dataKey="A" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
                <Legend />
                <RechartsTooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Col>
          <Col span={12}>
            <div style={{ padding: spacing.lg }}>
              <Title level={4}>{powerData.country}</Title>
              <Divider />
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Statistic
                  title={t('economic_power')}
                  value={powerData.economic_power}
                  precision={2}
                  suffix={t('unit_percent')}
                  valueStyle={{ color: '#667eea' }}
                />
                <Statistic
                  title={t('military_power')}
                  value={powerData.military_power}
                  precision={2}
                  suffix={t('unit_percent')}
                  valueStyle={{ color: '#fa709a' }}
                />
                <Statistic
                  title={t('technological_power')}
                  value={powerData.technological_power}
                  precision={2}
                  suffix={t('unit_percent')}
                  valueStyle={{ color: '#43e97b' }}
                />
                <Statistic
                  title={t('diplomatic_power')}
                  value={powerData.diplomatic_power}
                  precision={2}
                  suffix={t('unit_percent')}
                  valueStyle={{ color: '#4facfe' }}
                />
                <Statistic
                  title={t('soft_power')}
                  value={powerData.soft_power}
                  precision={2}
                  suffix={t('unit_percent')}
                  valueStyle={{ color: '#fdcbf1' }}
                />
              </Space>
            </div>
          </Col>
        </Row>
      </Card>
    )
  }

  // 主渲染
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#667eea',
          borderRadius: 8,
          fontFamily: typography.fontFamily
        }
      }}
    >
      <div style={{ 
        padding: spacing.lg, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        position: 'relative'
      }}>
        {renderLanguageSwitcher()}
        {renderStatusBadge()}
        
        {/* 标题 */}
        <div style={{ marginBottom: spacing.xl, textAlign: 'center' }}>
          <Title level={1} style={{ 
            background: gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: spacing.sm,
            fontSize: typography.sizes.xxxl,
            fontWeight: typography.weights.bold
          }}>
            {t('app_title')}
          </Title>
          <Text type="secondary" style={{ fontSize: typography.sizes.lg }}>
            {t('app_subtitle')}
          </Text>
        </div>

        {/* 加载中 */}
        {(statsLoading || eventsLoading) && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Spin size="large" tip={t('loading')} />
          </div>
        )}

        {/* 内容 */}
        {!statsLoading && !eventsLoading && (
          <>
            {/* 统计卡片 */}
            {renderStatCards()}

            <Divider style={{ margin: spacing.xl }} />

            {/* 标签页 */}
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              size="large"
              style={{ marginBottom: spacing.lg }}
              items={[
                {
                  key: 'overview',
                  label: <Space>{dimensionIcons.overview}{t('global_situation')}</Space>,
                  children: (
                    <Row gutter={[spacing.lg, spacing.lg]}>
                      <Col xs={24} lg={16}>
                        {renderMap()}
                      </Col>
                      <Col xs={24} lg={8}>
                        {renderRiskIndex()}
                      </Col>
                      <Col span={24}>
                        <Card
                          title={<Space><FileTextOutlined />{t('event_list')}</Space>}
                          style={{ borderRadius: borderRadius.lg, boxShadow: shadows.medium }}
                        >
                          <Table
                            columns={eventColumns}
                            dataSource={events.slice(0, 10)}
                            rowKey="event_id"
                            pagination={false}
                            size="small"
                            scroll={{ x: 800 }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  )
                },
                {
                  key: 'trend',
                  label: <Space>{dimensionIcons.trend}{t('trend_analysis')}</Space>,
                  children: renderTrendCharts()
                },
                {
                  key: 'economic',
                  label: <Space>{dimensionIcons.economic}{t('economic_data')}</Space>,
                  children: renderEconomicTables()
                },
                {
                  key: 'news',
                  label: <Space>{dimensionIcons.news}{t('global_news')}</Space>,
                  children: (
                    <Card
                      title={<Space><FileTextOutlined />{t('latest_news')}</Space>}
                      style={{ borderRadius: borderRadius.lg, boxShadow: shadows.medium }}
                    >
                      <Table
                        columns={newsColumns}
                        dataSource={news}
                        rowKey="news_id"
                        pagination={{ pageSize: 10 }}
                        size="small"
                        scroll={{ x: 800 }}
                      />
                    </Card>
                  )
                },
                {
                  key: 'multi_dimension',
                  label: <Space>{dimensionIcons.technology}{t('multi_dimension')}</Space>,
                  children: renderMultiDimension()
                },
                {
                  key: 'power',
                  label: <Space>{dimensionIcons.power}{t('power_index')}</Space>,
                  children: renderPowerIndex()
                }
              ]}
            />
          </>
        )}
      </div>
    </ConfigProvider>
  )
}

export default Dashboard
