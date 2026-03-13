export interface Language {
  code: 'zh' | 'en'
  name: string
}

export const languages: Language[] = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' }
]

export const translations = {
  zh: {
    // 导航和标题
    app_title: 'World Monitor - 全球态势感知',
    app_subtitle: '实时全球地缘政治态势感知仪表盘',
    global_situation: '全球态势',
    trend_analysis: '趋势分析',
    economic_data: '经济数据',
    global_news: '全球新闻',
    multi_dimension: '多维度',
    power_index: '国力指数',
    economic_analysis: '经济分析',
    gdp_distribution: 'GDP分布',
    gdp_growth_ranking: 'GDP增长率排名',
    military_spending_ranking: '军费开支排名',
    political_stability_ranking: '政治稳定性排名',
    top20_economic_power: '全球经济实力TOP20',
    
    // 统计卡片
    total_events: '总事件数',
    countries_involved: '涉及国家',
    news_items: '新闻条数',
    avg_severity: '平均严重程度',
    real_time_update: '实时更新',
    connected: '已连接',
    disconnected: '已断开',
    
    // 地图
    map_title: '全球实时事件分布',
    risk_index_top10: '国家风险指数 TOP10',
    country: '国家',
    risk_score: '风险指数',
    event_count: '事件数量',
    location: '地点',
    
    // 表格
    event_type: '事件类型',
    event_list: '事件列表',
    date: '日期',
    severity: '严重程度',
    title: '标题',
    source: '来源',
    description: '描述',
    participants: '参与方',
    impact: '影响',
    
    // 严重程度
    severity_low: '低',
    severity_medium: '中',
    severity_high: '高',
    severity_critical: '严重',
    
    // 趋势分析
    political_trend: '政治事件趋势',
    economic_trend: '经济事件趋势',
    military_trend: '军事冲突趋势',
    event_distribution: '事件类型分布',
    dimension_analysis: '多维度分析',
    time_range: '时间范围',
    last_7_days: '最近 7 天',
    last_30_days: '最近 30 天',
    
    // 经济数据
    gdp_total: 'GDP 总量',
    gdp_growth: 'GDP 增长率',
    military_spending: '军费开支',
    political_stability: '政治稳定性',
    unit_usd_billion: '十亿美元',
    unit_percent: '%',
    unit_million: '百万',
    rank: '排名',
    value: '数值',
    change: '变化',
    increase: '增长',
    decrease: '下降',
    
    // 新闻
    latest_news: '最新新闻',
    published_at: '发布时间',
    category: '类别',
    read_more: '阅读更多',
    hot_news: '热门新闻',
    breaking_news: '突发新闻',
    
    // 维度标签
    dimension_political: '政治',
    dimension_economic: '经济',
    dimension_military: '军事',
    dimension_diplomatic: '外交',
    dimension_social: '社会',
    dimension_technology: '科技',
    dimension_environment: '环境',
    dimension_energy: '能源',
    dimension_food: '粮食',
    dimension_population: '人口',
    
    // 科技维度
    innovation_index: '创新指数',
    r_d_spending: '研发投入',
    patents_filed: '专利申请',
    digital_economy_ratio: '数字经济占比',
    ai_investment: 'AI 投资',
    
    // 环境维度
    co2_emissions: 'CO2 排放',
    renewable_energy: '可再生能源',
    forest_coverage: '森林覆盖率',
    air_quality: '空气质量',
    water_quality: '水质',
    
    // 能源维度
    energy_production: '能源生产',
    energy_consumption: '能源消费',
    oil_reserves: '石油储量',
    gas_reserves: '天然气储量',
    energy_independence: '能源独立率',
    
    // 粮食维度
    food_security: '粮食安全',
    food_production: '粮食产量',
    import_dependency: '进口依赖度',
    agricultural_land: '农业用地',
    irrigation_coverage: '灌溉覆盖率',
    
    // 人口维度
    population_total: '人口总量',
    population_growth: '人口增长率',
    urbanization_rate: '城市化率',
    median_age: '中位年龄',
    education_index: '教育指数',
    life_expectancy: '预期寿命',
    
    // 国力指数
    comprehensive_power: '综合国力',
    economic_power: '经济权力',
    military_power: '军事权力',
    technological_power: '科技权力',
    diplomatic_power: '外交权力',
    soft_power: '软实力',
    
    // 加载中
    loading: '加载中...',
    no_data: '暂无数据',
    refresh: '刷新',
    last_updated: '最后更新',
    updating: '更新中...',
    
    // 错误提示
    error_loading: '加载失败',
    retry: '重试',
    network_error: '网络错误，请检查连接',
    server_error: '服务器错误',
    timeout_error: '请求超时',
    
    // 操作按钮
    export: '导出',
    import: '导入',
    filter: '筛选',
    sort: '排序',
    view: '查看',
    edit: '编辑',
    delete: '删除',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    search: '搜索',
    reset: '重置',
    
    // 提示信息
    success: '成功',
    failed: '失败',
    warning: '警告',
    info: '提示',
    delete_confirm: '确定要删除吗？',
    save_success: '保存成功',
    save_failed: '保存失败',
    
    // 时间相关
    today: '今天',
    yesterday: '昨天',
    this_week: '本周',
    last_week: '上周',
    this_month: '本月',
    last_month: '上月',
    this_year: '今年',
    last_year: '去年',
    
    // 其他
    overview: '概览',
    details: '详情',
    more: '更多',
    all: '全部',
    none: '无',
    select_all: '全选',
    deselect_all: '取消全选',
    expand: '展开',
    collapse: '收起',
    back: '返回',
    next: '下一个',
    previous: '上一个',
    close: '关闭',
    open: '打开',
    enable: '启用',
    disable: '禁用',
    yes: '是',
    no: '否',
    ok: '确定'
  },
  en: {
    // Navigation & Titles
    app_title: 'World Monitor - Global Situation Awareness',
    app_subtitle: 'Real-time Global Geopolitical Dashboard',
    global_situation: 'Global Situation',
    trend_analysis: 'Trend Analysis',
    economic_data: 'Economic Data',
    global_news: 'Global News',
    multi_dimension: 'Multi-dimension',
    power_index: 'Power Index',
    economic_analysis: 'Economic Analysis',
    gdp_distribution: 'GDP Distribution',
    gdp_growth_ranking: 'GDP Growth Ranking',
    military_spending_ranking: 'Military Spending Ranking',
    political_stability_ranking: 'Political Stability Ranking',
    top20_economic_power: 'Top 20 Economic Power',
    
    // Statistics Cards
    total_events: 'Total Events',
    countries_involved: 'Countries Involved',
    news_items: 'News Items',
    avg_severity: 'Avg Severity',
    real_time_update: 'Real-time Update',
    connected: 'Connected',
    disconnected: 'Disconnected',
    
    // Map
    map_title: 'Global Real-time Event Distribution',
    risk_index_top10: 'Country Risk Index TOP10',
    country: 'Country',
    risk_score: 'Risk Score',
    event_count: 'Event Count',
    location: 'Location',
    
    // Tables
    event_type: 'Event Type',
    event_list: 'Event List',
    date: 'Date',
    severity: 'Severity',
    title: 'Title',
    source: 'Source',
    description: 'Description',
    participants: 'Participants',
    impact: 'Impact',
    
    // Severity Levels
    severity_low: 'Low',
    severity_medium: 'Medium',
    severity_high: 'High',
    severity_critical: 'Critical',
    
    // Trend Analysis
    political_trend: 'Political Events Trend',
    economic_trend: 'Economic Events Trend',
    military_trend: 'Military Conflicts Trend',
    event_distribution: 'Event Type Distribution',
    dimension_analysis: 'Multi-dimension Analysis',
    time_range: 'Time Range',
    last_7_days: 'Last 7 Days',
    last_30_days: 'Last 30 Days',
    
    // Economic Data
    gdp_total: 'GDP Total',
    gdp_growth: 'GDP Growth Rate',
    military_spending: 'Military Spending',
    political_stability: 'Political Stability',
    unit_usd_billion: 'Billion USD',
    unit_percent: '%',
    unit_million: 'Million',
    rank: 'Rank',
    value: 'Value',
    change: 'Change',
    increase: 'Increase',
    decrease: 'Decrease',
    
    // News
    latest_news: 'Latest News',
    published_at: 'Published At',
    category: 'Category',
    read_more: 'Read More',
    hot_news: 'Hot News',
    breaking_news: 'Breaking News',
    
    // Dimension Labels
    dimension_political: 'Political',
    dimension_economic: 'Economic',
    dimension_military: 'Military',
    dimension_diplomatic: 'Diplomatic',
    dimension_social: 'Social',
    dimension_technology: 'Technology',
    dimension_environment: 'Environment',
    dimension_energy: 'Energy',
    dimension_food: 'Food',
    dimension_population: 'Population',
    
    // Technology Dimensions
    innovation_index: 'Innovation Index',
    r_d_spending: 'R&D Spending',
    patents_filed: 'Patents Filed',
    digital_economy_ratio: 'Digital Economy Ratio',
    ai_investment: 'AI Investment',
    
    // Environment Dimensions
    co2_emissions: 'CO2 Emissions',
    renewable_energy: 'Renewable Energy',
    forest_coverage: 'Forest Coverage',
    air_quality: 'Air Quality',
    water_quality: 'Water Quality',
    
    // Energy Dimensions
    energy_production: 'Energy Production',
    energy_consumption: 'Energy Consumption',
    oil_reserves: 'Oil Reserves',
    gas_reserves: 'Gas Reserves',
    energy_independence: 'Energy Independence',
    
    // Food Dimensions
    food_security: 'Food Security',
    food_production: 'Food Production',
    import_dependency: 'Import Dependency',
    agricultural_land: 'Agricultural Land',
    irrigation_coverage: 'Irrigation Coverage',
    
    // Population Dimensions
    population_total: 'Population Total',
    population_growth: 'Population Growth',
    urbanization_rate: 'Urbanization Rate',
    median_age: 'Median Age',
    education_index: 'Education Index',
    life_expectancy: 'Life Expectancy',
    
    // Power Index
    comprehensive_power: 'Comprehensive Power',
    economic_power: 'Economic Power',
    military_power: 'Military Power',
    technological_power: 'Technological Power',
    diplomatic_power: 'Diplomatic Power',
    soft_power: 'Soft Power',
    
    // Loading States
    loading: 'Loading...',
    no_data: 'No Data',
    refresh: 'Refresh',
    last_updated: 'Last Updated',
    updating: 'Updating...',
    
    // Error Messages
    error_loading: 'Load Failed',
    retry: 'Retry',
    network_error: 'Network Error, Please Check Connection',
    server_error: 'Server Error',
    timeout_error: 'Request Timeout',
    
    // Action Buttons
    export: 'Export',
    import: 'Import',
    filter: 'Filter',
    sort: 'Sort',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    search: 'Search',
    reset: 'Reset',
    
    // Messages
    success: 'Success',
    failed: 'Failed',
    warning: 'Warning',
    info: 'Info',
    delete_confirm: 'Are you sure to delete?',
    save_success: 'Save Success',
    save_failed: 'Save Failed',
    
    // Time Related
    today: 'Today',
    yesterday: 'Yesterday',
    this_week: 'This Week',
    last_week: 'Last Week',
    this_month: 'This Month',
    last_month: 'Last Month',
    this_year: 'This Year',
    last_year: 'Last Year',
    
    // Others
    overview: 'Overview',
    details: 'Details',
    more: 'More',
    all: 'All',
    none: 'None',
    select_all: 'Select All',
    deselect_all: 'Deselect All',
    expand: 'Expand',
    collapse: 'Collapse',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    open: 'Open',
    enable: 'Enable',
    disable: 'Disable',
    yes: 'Yes',
    no: 'No',
    ok: 'OK'
  }
}

export type TranslationKey = keyof typeof translations.zh

export function t(key: TranslationKey, lang: 'zh' | 'en' = 'zh'): string {
  return translations[lang][key] || translations['zh'][key] || key
}

export function useTranslation(lang: 'zh' | 'en' = 'zh') {
  return {
    t: (key: TranslationKey) => t(key, lang),
    lang,
    languages
  }
}
