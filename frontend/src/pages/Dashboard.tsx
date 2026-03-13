import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, AttributionControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Card, Row, Col, Statistic, Table, Tag, Spin, Alert, Tabs, Select, Space, Button } from 'antd'
import {
  GlobalOutlined,
  WarningOutlined,
  FileTextOutlined,
  RiseOutlined,
  LineChartOutlined,
  BankOutlined,
  ReloadOutlined,
  PieChartOutlined,
  BarChartOutlined,
  FireOutlined
} from '@ant-design/icons'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
import { useLanguage, TranslationKey } from '../hooks/useLanguage'

const { TabPane } = Tabs

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

const SEVERITY_COLORS: Record<number, string> = {
  1: '#52c41a',
  2: '#1890ff',
  3: '#faad14',
  4: '#f5222d'
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
    politicalStabilityRanking
  } = useEconomicRankings()
  
  // 多维度数据
  const { data: technologyData } = useTechnologyData()
  const { data: environmentData } = useEnvironmentData()
  const { data: energyData } = useEnergyData()
  const { data: foodData } = useFoodData()
  const { data: populationData } = usePopulationData()
  const { data: powerIndex } = useComprehensivePowerIndex()

  const [mapCenter] = useState<[number, number]>([20, 0])
  const [activeTab, setActiveTab] = useState('overview')

  const eventsByTypeData = stats?.eventsByType || []
  const riskData = indices.slice(0, 10).map((item) => ({
    name: item.country,
    value: item.risk_score
  }))

  const politicalData = events
    .filter(e => ['Diplomacy', 'Political'].includes(e.event_type))
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

  const economicData = events
    .filter(e => ['Economic', 'Trade'].includes(e.event_type))
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

  const militaryData = events
    .filter(e => ['Conflict', 'Military'].includes(e.event_type))
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

  const eventColumns = [
    {
      title: t('event_type'),
      dataIndex: 'event_type',
      key: 'event_type',
      render: (text: string) => <Tag color="blue">{text}</Tag>
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
      render: (text: string) => dayjs(text).format('YYYY-MM-DD')
    },
    {
      title: t('severity'),
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: number) => (
        <Tag color={SEVERITY_COLORS[severity]}>
          {t(`severity_${severity === 1 ? 'low' : severity === 2 ? 'medium' : severity === 3 ? 'high' : 'critical'}` as TranslationKey)}
        </Tag>
      )
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
      key: 'source'
    },
    {
      title: t('published_at'),
      dataIndex: 'published_at',
      key: 'published_at',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm')
    },
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <Tag>{text}</Tag>
    }
  ]

  const renderLanguageSwitcher = () => (
    <Space style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
      <Select
        value={lang}
        onChange={changeLanguage}
        style={{ width: 120 }}
        options={languages.map(l => ({ value: l.code, label: l.name }))}
      />
    </Space>
  )

  return (
    <div style={{ padding: '24px 32px', background: '#f0f2f5', minHeight: '100vh', position: 'relative' }}>
      {renderLanguageSwitcher()}
      
      {/* 标题区域 */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>{t('app_title')}</h1>
        <p style={{ margin: '8px 0 0', color: '#666', fontSize: '14px' }}>{t('app_subtitle')}</p>
      </div>

      {/* 警告提示 */}
      <Alert
        message={connected ? `${t('last_updated')}: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}` : t('network_error')}
        type={connected ? 'success' : 'warning'}
        showIcon
        style={{ marginBottom: 16 }}
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

      {/* 统计卡片 - 更紧凑的布局 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card loading={statsLoading} hoverable style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic
              title={<span style={{ fontSize: '14px', color: '#666' }}>{t('total_events')}</span>}
              value={stats?.totalEvents || 0}
              prefix={<GlobalOutlined style={{ color: '#1890ff', fontSize: '20px' }} />}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={statsLoading} hoverable style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic
              title={<span style={{ fontSize: '14px', color: '#666' }}>{t('countries_involved')}</span>}
              value={stats?.countriesInvolved || 0}
              prefix={<RiseOutlined style={{ color: '#52c41a', fontSize: '20px' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={newsLoading} hoverable style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic
              title={<span style={{ fontSize: '14px', color: '#666' }}>{t('news_items')}</span>}
              value={stats?.totalNews || 0}
              prefix={<FileTextOutlined style={{ color: '#722ed1', fontSize: '20px' }} />}
              valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={statsLoading} hoverable style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic
              title={<span style={{ fontSize: '14px', color: '#666' }}>{t('avg_severity')}</span>}
              value={(stats?.avgSeverity || 0).toFixed(2)}
              prefix={<WarningOutlined style={{ color: '#faad14', fontSize: '20px' }} />}
              valueStyle={{ color: '#faad14', fontSize: '24px', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        size="large"
        style={{ background: '#fff', borderRadius: 8, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        <TabPane tab={t('global_situation')} key="overview">
          {/* 地图和风险指数 */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={18}>
              <Card 
                title={<Space><GlobalOutlined />{t('map_title')}</Space>} 
                loading={eventsLoading}
                hoverable
                style={{ borderRadius: 8, minHeight: '600px' }}
              >
                <MapContainer
                  center={mapCenter}
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
                        radius={Math.min(20, event.severity * 5)}
                        pathOptions={{
                          color: SEVERITY_COLORS[event.severity],
                          fillColor: SEVERITY_COLORS[event.severity],
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
            </Col>
            <Col xs={24} lg={6}>
              <Card 
                title={<Space><WarningOutlined />{t('risk_index_top10')}</Space>} 
                loading={riskLoading}
                hoverable
                style={{ borderRadius: 8, height: '600px' }}
              >
                <ResponsiveContainer width="100%" height={520}>
                  <BarChart data={riskData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ff6b6b" radius={[0, 4, 4, 0]} barSize={18} />
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
                loading={eventsLoading}
                hoverable
                style={{ borderRadius: 8 }}
              >
                <Table
                  columns={eventColumns}
                  dataSource={events.slice(0, 20)}
                  rowKey="event_id"
                  pagination={{ 
                    pageSize: 20,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条`
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
                style={{ borderRadius: 8, height: '360px' }}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={politicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card 
                title={<Space><BankOutlined />{t('economic_trend')}</Space>}
                hoverable
                style={{ borderRadius: 8, height: '360px' }}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={economicData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card 
                title={<Space><FireOutlined />{t('military_trend')}</Space>}
                hoverable
                style={{ borderRadius: 8, height: '360px' }}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={militaryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#ff6b6b" fill="#ff6b6b" fillOpacity={0.3} strokeWidth={2} />
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
                style={{ borderRadius: 8, height: '360px' }}
              >
                <ResponsiveContainer width="100%" height={280}>
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
                      innerRadius={40}
                    >
                      {eventsByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={<Space><BarChartOutlined />{t('dimension_analysis')}</Space>}
                hoverable
                style={{ borderRadius: 8, height: '360px' }}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                    { subject: t('dimension_political'), A: 80, fullMark: 100 },
                    { subject: t('dimension_economic'), A: 75, fullMark: 100 },
                    { subject: t('dimension_military'), A: 65, fullMark: 100 },
                    { subject: t('dimension_technology'), A: 85, fullMark: 100 },
                    { subject: t('dimension_environment'), A: 70, fullMark: 100 },
                    { subject: t('dimension_energy'), A: 60, fullMark: 100 }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name={t('dimension_analysis')} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} strokeWidth={2} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab={t('economic_data')} key="economic">
          <Card>
            <Tabs activeKey={economicTab} onChange={setEconomicTab}>
              <TabPane tab={t('gdp_total')} key="gdp">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={gdpRanking.slice(0, 20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} />
                    <YAxis label={{ value: t('unit_usd_billion'), angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="gdp_usd_billions" fill="#1890ff" name={t('gdp_total')} />
                  </BarChart>
                </ResponsiveContainer>
              </TabPane>
              <TabPane tab={t('gdp_growth')} key="growth">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={gdpGrowthRanking.slice(0, 20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} />
                    <YAxis label={{ value: t('unit_percent'), angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="gdp_growth_percent" fill="#52c41a" name={t('gdp_growth')} />
                  </BarChart>
                </ResponsiveContainer>
              </TabPane>
              <TabPane tab={t('military_spending')} key="military">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={militaryRanking.slice(0, 20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} />
                    <YAxis label={{ value: t('unit_usd_billion'), angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="military_spending_usd_billions" fill="#f5222d" name={t('military_spending')} />
                  </BarChart>
                </ResponsiveContainer>
              </TabPane>
              <TabPane tab={t('political_stability')} key="stability">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={politicalStabilityRanking.slice(0, 20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} />
                    <YAxis label={{ value: t('unit_percent'), angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="political_stability_percent" fill="#722ed1" name={t('political_stability')} />
                  </BarChart>
                </ResponsiveContainer>
              </TabPane>
            </Tabs>
          </Card>
        </TabPane>

        <TabPane tab={t('dimension_technology')} key="technology">
          <Card title={t('dimension_technology')}>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={technologyData.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="innovation_index" fill="#8884d8" name={t('innovation_index')} />
                <Bar yAxisId="right" dataKey="r_d_spending" fill="#82ca9d" name={t('r_d_spending')} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>

        <TabPane tab={t('dimension_environment')} key="environment">
          <Card title={t('dimension_environment')}>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={environmentData.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="co2_emissions" fill="#8884d8" name={t('co2_emissions')} />
                <Bar yAxisId="right" dataKey="renewable_energy_ratio" fill="#82ca9d" name={t('renewable_energy')} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>

        <TabPane tab={t('dimension_energy')} key="energy">
          <Card title={t('dimension_energy')}>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={energyData.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="energy_production" fill="#8884d8" name={t('energy_production')} />
                <Bar yAxisId="right" dataKey="energy_independence_ratio" fill="#82ca9d" name={t('energy_independence')} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>

        <TabPane tab={t('dimension_food')} key="food">
          <Card title={t('dimension_food')}>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={foodData.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="food_security_index" fill="#8884d8" name={t('food_security')} />
                <Bar yAxisId="right" dataKey="grain_production" fill="#82ca9d" name={t('food_production')} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>

        <TabPane tab={t('dimension_population')} key="population">
          <Card title={t('dimension_population')}>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={populationData.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="population" fill="#8884d8" name={t('population_total')} />
                <Bar yAxisId="right" dataKey="life_expectancy" fill="#82ca9d" name={t('life_expectancy')} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>

        <TabPane tab={t('global_news')} key="news">
          <Card loading={newsLoading}>
            <Table
              columns={newsColumns}
              dataSource={news.slice(0, 50)}
              rowKey="id"
              pagination={{ pageSize: 50 }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>

        <TabPane tab={t('power_index')} key="power">
          <Card title={t('comprehensive_power')}>
            <ResponsiveContainer width="100%" height={500}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={powerIndex.slice(0, 10)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="country" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name={t('comprehensive_power')} dataKey="overall_score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name={t('economic_power')} dataKey="economic_power" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Radar name={t('military_power')} dataKey="military_power" stroke="#ff6b6b" fill="#ff6b6b" fillOpacity={0.6} />
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
