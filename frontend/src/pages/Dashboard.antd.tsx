import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Tag, 
  Alert, 
  Tabs, 
  Select, 
  Space, 
  Button, 
  Badge, 
  Typography,
  Divider
} from 'antd'
import {
  GlobalOutlined,
  WarningOutlined,
  FileTextOutlined,
  RiseOutlined,
  BankOutlined,
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from 'recharts'
import dayjs from 'dayjs'
import { useWebSocket, useStatistics, useEvents, useNews, useRiskIndices } from '../hooks/useData'
import { useEconomicData } from '../hooks/useEconomicData'
import {
  useTechnologyData,
  useEnvironmentData,
  useEnergyData,
  useFoodData,
  usePopulationData,
  useComprehensivePowerIndex
} from '../hooks/useMultiDimensionData'
import { useLanguage, TranslationKey } from '../hooks/useLanguage'

const { Title, Text } = Typography

// Ant Design 蓝系配色
const ANT_COLORS = [
  '#1890ff', // 主蓝
  '#52c41a', // 绿
  '#faad14', // 黄
  '#f5222d', // 红
  '#722ed1', // 紫
  '#13c2c2', // 青
  '#eb2f96', // 粉
  '#fa541c', // 橙
  '#2f4554', // 深灰
  '#a0d911'  // 亮绿
]

// 严重程度颜色 - Ant Design 风格
const SEVERITY_COLORS: Record<number, string> = {
  1: '#52c41a', // success
  2: '#1890ff', // primary
  3: '#faad14', // warning
  4: '#f5222d'  // error
}

// 国家名翻译映射
const COUNTRY_NAMES: Record<string, Record<string, string>> = {
  zh: {
    'United States': '美国', 'China': '中国', 'Russia': '俄罗斯', 'United Kingdom': '英国',
    'Germany': '德国', 'France': '法国', 'Japan': '日本', 'India': '印度',
    'Brazil': '巴西', 'Canada': '加拿大', 'Australia': '澳大利亚', 'South Korea': '韩国',
    'Italy': '意大利', 'Spain': '西班牙', 'Mexico': '墨西哥', 'Indonesia': '印度尼西亚',
    'Saudi Arabia': '沙特阿拉伯', 'Turkey': '土耳其', 'Netherlands': '荷兰', 'Switzerland': '瑞士'
  },
  en: {
    '美国': 'United States', '中国': 'China', '俄罗斯': 'Russia', '英国': 'United Kingdom',
    '德国': 'Germany', '法国': 'France', '日本': 'Japan', '印度': 'India',
    '巴西': 'Brazil', '加拿大': 'Canada', '澳大利亚': 'Australia', '韩国': 'South Korea',
    '意大利': 'Italy', '西班牙': 'Spain', '墨西哥': 'Mexico', '印度尼西亚': 'Indonesia',
    '沙特阿拉伯': 'Saudi Arabia', '土耳其': 'Turkey', '荷兰': 'Netherlands', '瑞士': 'Switzerland'
  }
}

function Dashboard() {
  const { lang, t, changeLanguage, languages } = useLanguage()
  const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws'
  const { connected } = useWebSocket(WS_URL)
  const { stats, loading: statsLoading } = useStatistics()
  const { events, loading: eventsLoading } = useEvents(7)
  const { news, loading: newsLoading } = useNews(3)
  const { indices, loading: riskLoading } = useRiskIndices()
  const { data: economicData, loading: economicLoading } = useEconomicData()
  
  const { data: technologyData } = useTechnologyData()
  const { data: environmentData } = useEnvironmentData()
  const { data: energyData } = useEnergyData()
  const { data: foodData } = useFoodData()
  const { data: populationData } = usePopulationData()
  const { data: powerIndex } = useComprehensivePowerIndex()

  const [activeTab, setActiveTab] = useState('overview')
  const [economicTab, setEconomicTab] = useState('gdp')
  const [dimensionTab, setDimensionTab] = useState('technology')

  const translateCountry = (name: string): string => COUNTRY_NAMES[lang]?.[name] || name

  const riskData = indices.slice(0, 10).map((item) => ({
    name: translateCountry(item.country),
    value: item.risk_score,
    events: item.event_count
  }))

  const eventsByTypeData = stats?.eventsByType || []

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
          style={{ backgroundColor: SEVERITY_COLORS[severity], fontSize: '12px' }}
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

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 顶部栏 */}
      <Card style={{ marginBottom: 24, borderRadius: 8 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>{t('app_title')}</Title>
            <Text type="secondary">{t('app_subtitle')}</Text>
          </Col>
          <Col>
            <Space>
              <Select
                value={lang}
                onChange={changeLanguage}
                style={{ width: 120 }}
                options={languages.map(l => ({ value: l.code, label: l.name }))}
              />
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => window.location.reload()}
              >
                {t('refresh')}
              </Button>
            </Space>
          </Col>
        </Row>
        <Divider style={{ margin: '16px 0' }} />
        <Alert
          message={connected ? `${t('last_updated')}: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}` : t('network_error')}
          type={connected ? 'success' : 'warning'}
          showIcon
          style={{ margin: 0 }}
        />
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={statsLoading}>
            <Statistic
              title={t('total_events')}
              value={stats?.totalEvents || 0}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={statsLoading}>
            <Statistic
              title={t('countries_involved')}
              value={stats?.countriesInvolved || 0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={newsLoading}>
            <Statistic
              title={t('news_items')}
              value={stats?.totalNews || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={statsLoading}>
            <Statistic
              title={t('avg_severity')}
              value={(stats?.avgSeverity || 0).toFixed(2)}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主内容区 */}
      <Card style={{ borderRadius: 8 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
          <Tabs.TabPane tab={t('global_situation')} key="overview">
            {/* 单张地图 */}
            <Card 
              title={<Space><GlobalOutlined />{t('map_title')}</Space>}
              loading={statsLoading}
              style={{ marginBottom: 24 }}
            >
              <MapContainer
                center={[20, 0]}
                zoom={3}
                minZoom={2}
                maxZoom={8}
                style={{ height: 500 }}
                zoomControl={false}
                maxBounds={[[-70, -180], [80, 180]]}
                maxBoundsViscosity={1.0}
              >
                <ZoomControl position="bottomright" />
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  subdomains="abcd"
                  minZoom={0}
                  maxZoom={19}
                  tileSize={256}
                  updateWhenIdle={false}
                  updateWhenZooming={false}
                  keepBuffer={16}
                />
                {events.filter(event => event.latitude !== 0 && event.longitude !== 0).map((event) => (
                  <CircleMarker
                    key={event.event_id}
                    center={[event.latitude, event.longitude]}
                    radius={Math.min(20, event.severity * 5)}
                    pathOptions={{
                      color: SEVERITY_COLORS[event.severity],
                      fillColor: SEVERITY_COLORS[event.severity],
                      fillOpacity: 0.6,
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
                ))}
              </MapContainer>
            </Card>

            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title={<Space><WarningOutlined />{t('risk_index_top10')}</Space>} loading={riskLoading}>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={riskData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                      <RechartsTooltip />
                      <Bar dataKey="value" fill="#1890ff" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title={<Space><PieChartOutlined />{t('event_distribution')}</Space>}>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={eventsByTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        label={(entry: any) => entry.name}
                      >
                        {eventsByTypeData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={ANT_COLORS[index % ANT_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            <Card 
              title={<Space><FileTextOutlined />{t('event_list')}</Space>}
              loading={statsLoading}
              style={{ marginTop: 24 }}
            >
              <Table
                columns={eventColumns}
                dataSource={events.slice(0, 20)}
                rowKey="event_id"
                pagination={{ pageSize: 10, showSizeChanger: true }}
                scroll={{ x: 1000 }}
                size="middle"
              />
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane tab={t('multi_dimension')} key="multi_dimension">
            <Card>
              <Tabs activeKey={dimensionTab} onChange={setDimensionTab}>
                {[
                  { key: 'technology', title: t('dimension_technology'), icon: <AppstoreOutlined />, data: technologyData, metrics: ['innovation_index', 'r_d_spending', 'patents_filed'] },
                  { key: 'environment', title: t('dimension_environment'), icon: <EnvironmentOutlined />, data: environmentData, metrics: ['co2_emissions', 'renewable_energy_ratio', 'forest_coverage'] },
                  { key: 'energy', title: t('dimension_energy'), icon: <ThunderboltOutlined />, data: energyData, metrics: ['energy_production', 'energy_consumption', 'energy_independence_ratio'] },
                  { key: 'food', title: t('dimension_food'), icon: <HomeOutlined />, data: foodData, metrics: ['food_security_index', 'grain_production', 'import_dependency'] },
                  { key: 'population', title: t('dimension_population'), icon: <TeamOutlined />, data: populationData, metrics: ['population', 'life_expectancy', 'education_index'] }
                ].map((dim) => (
                  <Tabs.TabPane tab={<Space>{dim.icon}{dim.title}</Space>} key={dim.key}>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={(dim.data || []).slice(0, 15).map((d: any) => ({...d, country: translateCountry(d.country)}))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="country" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        {dim.metrics.map((metric, idx) => (
                          <Bar key={metric} dataKey={metric} name={t(metric as TranslationKey)} fill={ANT_COLORS[idx]} radius={[4, 4, 0, 0]} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </Tabs.TabPane>
                ))}
              </Tabs>
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane tab={t('economic_analysis')} key="economic">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title={<Space><PieChartOutlined />{t('gdp_distribution')}</Space>} loading={economicLoading}>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={economicData?.slice(0, 10).map(d => ({ name: translateCountry(d.country), value: d.gdp_usd_billions })) || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      >
                        {(economicData?.slice(0, 10) || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={ANT_COLORS[index % ANT_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value: any) => [Number(value).toLocaleString(), t('gdp_total')]} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title={<Space><RiseOutlined />{t('gdp_growth_ranking')}</Space>} loading={economicLoading}>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart 
                      data={(economicData || [])
                        .filter(d => d.gdp_growth_percent !== undefined && d.gdp_growth_percent !== 0)
                        .sort((a, b) => b.gdp_growth_percent - a.gdp_growth_percent)
                        .slice(0, 15)
                        .map(d => ({ country: translateCountry(d.country), growth: d.gdp_growth_percent }))
                      }
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="country" type="category" width={80} tick={{ fontSize: 11 }} />
                      <RechartsTooltip formatter={(value: any) => [`${Number(value).toFixed(1)}%`, t('gdp_growth')]} />
                      <Bar dataKey="growth" name={t('gdp_growth')} radius={[0, 4, 4, 0]}>
                        {(economicData || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.gdp_growth_percent > 0 ? '#52c41a' : '#f5222d'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title={<Space><WarningOutlined />{t('military_spending_ranking')}</Space>} loading={economicLoading}>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart 
                      data={(economicData || [])
                        .filter(d => d.military_spending_usd_billions !== undefined && d.military_spending_usd_billions > 0)
                        .sort((a, b) => b.military_spending_usd_billions - a.military_spending_usd_billions)
                        .slice(0, 15)
                        .map(d => ({ country: translateCountry(d.country), military: d.military_spending_usd_billions }))
                      }
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="country" type="category" width={80} tick={{ fontSize: 11 }} />
                      <RechartsTooltip formatter={(value: any) => [Number(value).toLocaleString(), t('military_spending')]} />
                      <Bar dataKey="military" name={t('military_spending')} fill="#f5222d" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title={<Space><BankOutlined />{t('political_stability_ranking')}</Space>} loading={economicLoading}>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart 
                      data={(economicData || [])
                        .filter(d => d.political_stability_percent !== undefined && d.political_stability_percent > 0)
                        .sort((a, b) => b.political_stability_percent - a.political_stability_percent)
                        .slice(0, 15)
                        .map(d => ({ country: translateCountry(d.country), stability: d.political_stability_percent }))
                      }
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <YAxis dataKey="country" type="category" width={80} tick={{ fontSize: 11 }} />
                      <RechartsTooltip formatter={(value: any) => [`${Number(value)}%`, t('political_stability')]} />
                      <Bar dataKey="stability" name={t('political_stability')} radius={[0, 4, 4, 0]}>
                        {(economicData || []).map((entry, index) => {
                          let color = '#f5222d'
                          if (entry.political_stability_percent >= 80) color = '#52c41a'
                          else if (entry.political_stability_percent >= 60) color = '#1890ff'
                          else if (entry.political_stability_percent >= 40) color = '#faad14'
                          return <Cell key={`cell-${index}`} fill={color} />
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col xs={24}>
                <Card title={<Space><BarChartOutlined />{t('top20_economic_power')}</Space>} loading={economicLoading}>
                  <Table
                    columns={[
                      { title: '#', dataIndex: 'rank', key: 'rank', width: 60 },
                      { title: t('country'), dataIndex: 'country', key: 'country', render: (text: string) => translateCountry(text) },
                      { title: `${t('gdp_total')}`, dataIndex: 'gdp_usd_billions', key: 'gdp', sorter: (a: any, b: any) => a.gdp_usd_billions - b.gdp_usd_billions, render: (v: number) => v?.toLocaleString() },
                      { title: `${t('gdp_growth')} (%)`, dataIndex: 'gdp_growth_percent', key: 'growth', sorter: (a: any, b: any) => a.gdp_growth_percent - b.gdp_growth_percent, render: (v: number) => <span style={{ color: v > 0 ? '#52c41a' : '#f5222d' }}>{v?.toFixed(1)}</span> },
                      { title: `${t('military_spending')}`, dataIndex: 'military_spending_usd_billions', key: 'military', sorter: (a: any, b: any) => a.military_spending_usd_billions - b.military_spending_usd_billions, render: (v: number) => v?.toLocaleString() },
                      { title: `${t('political_stability')} (%)`, dataIndex: 'political_stability_percent', key: 'stability', sorter: (a: any, b: any) => a.political_stability_percent - b.political_stability_percent, render: (v: number) => {
                        let color = '#f5222d'
                        if (v >= 80) color = '#52c41a'
                        else if (v >= 60) color = '#1890ff'
                        else if (v >= 40) color = '#faad14'
                        return <Tag color={color}>{v || '-'}</Tag>
                      }}
                    ]}
                    dataSource={(economicData || []).slice(0, 20).map((d, i) => ({ ...d, rank: i + 1, key: i }))}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          <Tabs.TabPane tab={t('global_news')} key="news">
            <Card loading={newsLoading}>
              <Table
                columns={newsColumns}
                dataSource={news}
                rowKey="id"
                pagination={{ pageSize: 20, showSizeChanger: true }}
                scroll={{ x: 1200 }}
                size="middle"
              />
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane tab={t('power_index')} key="power">
            <Card title={t('comprehensive_power')}>
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={(powerIndex || []).slice(0, 10).map((d: any) => ({...d, country: translateCountry(d.country)}))}>
                  <PolarGrid stroke="#f0f0f0" />
                  <PolarAngleAxis dataKey="country" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar name={t('comprehensive_power')} dataKey="overall_score" stroke="#1890ff" fill="#1890ff" fillOpacity={0.3} />
                  <Radar name={t('economic_power')} dataKey="economic_power" stroke="#52c41a" fill="#52c41a" fillOpacity={0.3} />
                  <Radar name={t('military_power')} dataKey="military_power" stroke="#f5222d" fill="#f5222d" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default Dashboard
