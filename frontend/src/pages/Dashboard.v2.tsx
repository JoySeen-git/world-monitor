import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Card, Row, Col, Statistic, Table, Tag, Alert, Tabs, Select, Space, Button, Badge, Typography } from 'antd'
import {
  GlobalOutlined,
  WarningOutlined,
  FileTextOutlined,
  RiseOutlined,
  BankOutlined,
  ReloadOutlined,
  PieChartOutlined,
  BarChartOutlined,
  FireOutlined,
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
  Legend
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
  useComprehensivePowerIndex
} from '../hooks/useMultiDimensionData'
import { useLanguage } from '../hooks/useLanguage'

const { Title, Text } = Typography
const { TabPane } = Tabs

// 柔和配色方案 - 低饱和度莫兰迪色系
const PRO_COLORS = [
  '#7B9E89', // 莫兰迪绿
  '#8FA3C0', // 莫兰迪蓝
  '#C9A9A6', // 莫兰迪粉
  '#D4C4A8', // 莫兰迪黄
  '#A8B5A0', // 莫兰迪青
  '#B8A9C9', // 莫兰迪紫
  '#D4A5A5', // 莫兰迪红
  '#9CB4CC', // 莫兰迪灰蓝
  '#C4B7A6', // 莫兰迪棕
  '#A5C4D4'  // 莫兰迪青蓝
]

// 柔和渐变色配置
// const GRADIENTS = [
//   { start: '#8FA3C0', end: '#A8B5A0', name: 'blue-green' },
//   { start: '#7B9E89', end: '#9CB4CC', name: 'green-blue' },
//   { start: '#C9A9A6', end: '#D4C4A8', name: 'pink-yellow' },
//   { start: '#B8A9C9', end: '#A5C4D4', name: 'purple-cyan' }
// ]

// 严重程度颜色 - 柔和版
const SEVERITY_COLORS: Record<number, string> = {
  1: '#7B9E89', // 柔和绿
  2: '#8FA3C0', // 柔和蓝
  3: '#D4C4A8', // 柔和黄
  4: '#C9A9A6'  // 柔和粉
}

// 国家名翻译映射
const COUNTRY_NAMES: Record<string, Record<string, string>> = {
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
    'Switzerland': '瑞士',
    'Poland': '波兰',
    'Sweden': '瑞典',
    'Belgium': '比利时',
    'Argentina': '阿根廷',
    'Thailand': '泰国',
    'Israel': '以色列',
    'Singapore': '新加坡',
    'Austria': '奥地利',
    'Norway': '挪威',
    'UAE': '阿联酋'
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
    '瑞士': 'Switzerland',
    '波兰': 'Poland',
    '瑞典': 'Sweden',
    '比利时': 'Belgium',
    '阿根廷': 'Argentina',
    '泰国': 'Thailand',
    '以色列': 'Israel',
    '新加坡': 'Singapore',
    '奥地利': 'Austria',
    '挪威': 'Norway',
    '阿联酋': 'UAE'
  }
}

function Dashboard() {
  const { lang, t, changeLanguage, languages } = useLanguage()
  const { connected } = useWebSocket('ws://localhost:3001/ws')
  const { stats, loading: statsLoading } = useStatistics()
  const { events, loading: eventsLoading } = useEvents(7)
  const { news, loading: newsLoading } = useNews(3)
  const { indices, loading: riskLoading } = useRiskIndices()
  const { 
    gdpRanking, 
    gdpGrowthRanking, 
    militaryRanking,
    politicalStabilityRanking,
  } = useEconomicRankings()
  
  const { data: technologyData } = useTechnologyData()
  const { data: environmentData } = useEnvironmentData()
  const { data: energyData } = useEnergyData()
  const { data: foodData } = useFoodData()
  const { data: populationData } = usePopulationData()
  const { data: powerIndex } = useComprehensivePowerIndex()

  const [activeTab, setActiveTab] = useState('overview')
  const [economicTab, setEconomicTab] = useState('gdp')
  const [dimensionTab, setDimensionTab] = useState('technology')

  // 翻译国家名
  const translateCountry = (name: string): string => {
    return COUNTRY_NAMES[lang]?.[name] || name
  }

  // 风险数据
  const riskData = indices.slice(0, 10).map((item) => ({
    name: translateCountry(item.country),
    value: item.risk_score,
    events: item.event_count || 0
  }))

  // 事件类型统计
  const eventsByTypeData = stats?.eventsByType || []

  // 趋势数据
  const trendData = events.slice(0, 30).reduce((acc: any[], event) => {
    const date = dayjs(event.date).format('MM-DD')
    const existing = acc.find(item => item.date === date)
    if (existing) {
      existing[event.event_type] = (existing[event.event_type] || 0) + 1
    } else {
      acc.push({ date, [event.event_type]: 1 })
    }
    return acc
  }, [])

  // 事件表格列
  const eventColumns = [
    {
      title: t('event_type'),
      dataIndex: 'event_type',
      key: 'event_type',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
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
            fontSize: '12px'
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
      ellipsis: true
    }
  ]

  // 新闻表格列
  const newsColumns = [
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: true
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

  // 渲染统计卡片 - 柔和白色背景
  const renderStatCards = () => (
    <Row gutter={[20, 20]}>
      {[
        { 
          title: t('total_events'), 
          value: stats?.totalEvents || 0, 
          icon: <GlobalOutlined style={{ color: '#7B9E89' }} />,
          color: '#7B9E89',
          loading: statsLoading
        },
        { 
          title: t('countries_involved'), 
          value: stats?.countriesInvolved || 0, 
          icon: <RiseOutlined style={{ color: '#8FA3C0' }} />,
          color: '#8FA3C0',
          loading: statsLoading
        },
        { 
          title: t('news_items'), 
          value: stats?.totalNews || 0, 
          icon: <FileTextOutlined style={{ color: '#C9A9A6' }} />,
          color: '#C9A9A6',
          loading: newsLoading
        },
        { 
          title: t('avg_severity'), 
          value: (stats?.avgSeverity || 0).toFixed(2), 
          icon: <WarningOutlined style={{ color: '#D4C4A8' }} />,
          color: '#D4C4A8',
          loading: statsLoading
        }
      ].map((item, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card 
            loading={item.loading}
            hoverable 
            style={{ 
              borderRadius: 12, 
              border: '1px solid #f0f0f0',
              background: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <Statistic
              title={<span style={{ color: '#666', fontSize: '14px' }}>{item.title}</span>}
              value={item.value}
              prefix={item.icon}
              valueStyle={{ color: item.color, fontSize: '28px', fontWeight: 600 }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  )

  return (
    <div style={{ padding: '24px 32px', background: '#f5f7fa', minHeight: '100vh', position: 'relative' }}>
      {/* 语言切换器 */}
      <Space style={{ position: 'absolute', top: 24, right: 32, zIndex: 1000 }}>
        <Select
          value={lang}
          onChange={changeLanguage}
          style={{ width: 120 }}
          options={languages.map(l => ({ value: l.code, label: l.name }))}
        />
      </Space>
      
      {/* 标题区域 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>{t('app_title')}</Title>
        <Text type="secondary">{t('app_subtitle')}</Text>
      </div>

      {/* 连接状态 */}
      <Alert
        message={connected ? `${t('last_updated')}: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}` : t('network_error')}
        type={connected ? 'success' : 'warning'}
        showIcon
        style={{ marginBottom: 16, borderRadius: 8 }}
        action={
          <Button size="small" icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
            {t('refresh')}
          </Button>
        }
      />

      {/* 统计卡片 */}
      {renderStatCards()}

      {/* 主内容区 */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        size="large"
        style={{ 
          marginTop: 24,
          background: '#fff', 
          borderRadius: 12, 
          padding: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}
      >
        <TabPane tab={t('global_situation')} key="overview">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={18}>
              <Card 
                title={<Space><GlobalOutlined />{t('map_title')}</Space>}
                loading={eventsLoading}
                hoverable
                style={{ borderRadius: 12 }}
              >
                <MapContainer
                  center={[20, 0]}
                  zoom={2}
                  style={{ height: 560, borderRadius: 8, background: '#1a1f2e' }}
                  zoomControl={false}
                  attributionControl={false}
                >
                  <ZoomControl position="bottomright" />
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution=''
                    subdomains="abcd"
                    maxZoom={19}
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
                          <div style={{ minWidth: 200 }}>
                            <strong style={{ color: '#1890ff' }}>{event.event_type}</strong><br />
                            <span>{translateCountry(event.country)}</span><br />
                            <span style={{ fontSize: '12px', color: '#666' }}>
                              {dayjs(event.date).format('YYYY-MM-DD')}
                            </span>
                            {event.title && (
                              <div style={{ marginTop: 8, fontSize: '12px' }}>{event.title}</div>
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
                loading={riskLoading}
                hoverable
                style={{ borderRadius: 12, height: '100%' }}
              >
                <ResponsiveContainer width="100%" height={520}>
                  <BarChart data={riskData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PRO_COLORS[index % PRO_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card 
                title={<Space><FileTextOutlined />{t('event_list')}</Space>}
                loading={eventsLoading}
                hoverable
                style={{ borderRadius: 12 }}
              >
                <Table
                  columns={eventColumns}
                  dataSource={events.slice(0, 20)}
                  rowKey="event_id"
                  pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
                  scroll={{ x: 1000 }}
                  size="middle"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab={t('trend_analysis')} key="trends">
          <Row gutter={[24, 24]}>
            {[
              { title: t('political_trend'), color: '#8FA3C0', data: 'Political' },
              { title: t('economic_trend'), color: '#7B9E89', data: 'Economic' },
              { title: t('military_trend'), color: '#C9A9A6', data: 'Military' }
            ].map((item, index) => (
              <Col xs={24} md={8} key={index}>
                <Card 
                  title={<Space>{index === 0 ? <RiseOutlined /> : index === 1 ? <BankOutlined /> : <FireOutlined />}{item.title}</Space>}
                  hoverable
                  style={{ borderRadius: 12, height: 380 }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={item.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={item.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
                      <Area type="monotone" dataKey={item.data} stroke={item.color} fill={`url(#color${index})`} strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={12}>
              <Card 
                title={<Space><PieChartOutlined />{t('event_distribution')}</Space>}
                hoverable
                style={{ borderRadius: 12, height: 380 }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={eventsByTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.name}: ${entry.count}`}
                      outerRadius={100}
                      innerRadius={50}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {eventsByTypeData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={PRO_COLORS[index % PRO_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={<Space><BarChartOutlined />{t('dimension_analysis')}</Space>}
                hoverable
                style={{ borderRadius: 12, height: 380 }}
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
                    <Radar name={t('dimension_analysis')} dataKey="A" stroke="#8FA3C0" fill="#8FA3C0" fillOpacity={0.4} strokeWidth={2} />
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
              {[
                { key: 'gdp', title: t('gdp_total'), data: gdpRanking, dataKey: 'gdp_usd_billions', unit: t('unit_usd_billion') },
                { key: 'growth', title: t('gdp_growth'), data: gdpGrowthRanking, dataKey: 'gdp_growth_percent', unit: t('unit_percent') },
                { key: 'military', title: t('military_spending'), data: militaryRanking, dataKey: 'military_spending_usd_billions', unit: t('unit_usd_billion') },
                { key: 'stability', title: t('political_stability'), data: politicalStabilityRanking, dataKey: 'political_stability_percent', unit: t('unit_percent') }
              ].map((item) => (
                <TabPane tab={item.title} key={item.key}>
                  <ResponsiveContainer width="100%" height={450}>
                    <BarChart data={item.data.slice(0, 20)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis 
                        dataKey="country" 
                        angle={-45} 
                        textAnchor="end" 
                        height={100} 
                        tick={{ fontSize: 11 }} 
                        tickFormatter={(value) => translateCountry(value)}
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <YAxis 
                        label={{ value: item.unit, angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                        formatter={(value: any) => [value, item.title]}
                      />
                      <Bar dataKey={item.dataKey} name={item.title} radius={[4, 4, 0, 0]}>
                        {item.data.slice(0, 20).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={PRO_COLORS[index % PRO_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </TabPane>
              ))}
            </Tabs>
          </Card>
        </TabPane>

        <TabPane tab={t('multi_dimension')} key="multi_dimension">
          <Card style={{ borderRadius: 12 }}>
            <Tabs activeKey={dimensionTab} onChange={setDimensionTab} size="large">
              {[
                { key: 'technology', title: t('dimension_technology'), icon: <AppstoreOutlined />, data: technologyData, metrics: ['innovation_index', 'r_d_spending', 'patents_filed'] },
                { key: 'environment', title: t('dimension_environment'), icon: <EnvironmentOutlined />, data: environmentData, metrics: ['co2_emissions', 'renewable_energy_ratio', 'forest_coverage'] },
                { key: 'energy', title: t('dimension_energy'), icon: <ThunderboltOutlined />, data: energyData, metrics: ['energy_production', 'energy_consumption', 'energy_independence_ratio'] },
                { key: 'food', title: t('dimension_food'), icon: <HomeOutlined />, data: foodData, metrics: ['food_security_index', 'grain_production', 'import_dependency'] },
                { key: 'population', title: t('dimension_population'), icon: <TeamOutlined />, data: populationData, metrics: ['population', 'life_expectancy', 'education_index'] }
              ].map((dim) => (
                <TabPane tab={<Space>{dim.icon}{dim.title}</Space>} key={dim.key}>
                  <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={(dim.data || []).slice(0, 15).map((d: any) => ({...d, country: translateCountry(d.country)}))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
                      <Legend />
                      {dim.metrics.map((metric, idx) => (
                        <Bar key={metric} dataKey={metric} name={t(metric as TranslationKey)} fill={PRO_COLORS[idx]} radius={[4, 4, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </TabPane>
              ))}
            </Tabs>
          </Card>
        </TabPane>

        <TabPane tab={t('global_news')} key="news">
          <Card loading={newsLoading} style={{ borderRadius: 12 }}>
            <Table
              columns={newsColumns}
              dataSource={news}
              rowKey="id"
              pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
              scroll={{ x: 1200 }}
              size="middle"
            />
          </Card>
        </TabPane>

        <TabPane tab={t('power_index')} key="power">
          <Card title={t('comprehensive_power')} style={{ borderRadius: 12 }}>
            <ResponsiveContainer width="100%" height={550}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={(powerIndex || []).slice(0, 10).map((d: any) => ({...d, country: translateCountry(d.country)}))}>
                <PolarGrid stroke="#f0f0f0" />
                <PolarAngleAxis dataKey="country" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name={t('comprehensive_power')} dataKey="overall_score" stroke="#8FA3C0" fill="#8FA3C0" fillOpacity={0.3} strokeWidth={2} />
                <Radar name={t('economic_power')} dataKey="economic_power" stroke="#7B9E89" fill="#7B9E89" fillOpacity={0.3} strokeWidth={2} />
                <Radar name={t('military_power')} dataKey="military_power" stroke="#C9A9A6" fill="#C9A9A6" fillOpacity={0.3} strokeWidth={2} />
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
