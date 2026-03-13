// 渐变色定义
export const gradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
  warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  danger: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  blue: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  green: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  orange: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  card: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  dark: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
}

// 卡片阴影
export const shadows = {
  light: '0 2px 8px rgba(0, 0, 0, 0.08)',
  medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
  heavy: '0 8px 32px rgba(0, 0, 0, 0.16)',
  hover: '0 8px 24px rgba(0, 0, 0, 0.12)',
  float: '0 -4px 16px rgba(0, 0, 0, 0.08)'
}

// 配色方案
export const colorSchemes = {
  severity: {
    low: '#52c41a',
    medium: '#1890ff',
    high: '#faad14',
    critical: '#f5222d'
  },
  dimensions: {
    political: '#667eea',
    economic: '#43e97b',
    military: '#fa709a',
    diplomatic: '#4facfe',
    social: '#a8edea',
    technology: '#fdcbf1',
    environment: '#38f9d7',
    energy: '#fee140',
    food: '#f093fb',
    population: '#a18cd1'
  },
  charts: [
    '#667eea', '#43e97b', '#fa709a', '#4facfe', '#fdcbf1',
    '#38f9d7', '#fee140', '#f093fb', '#a18cd1', '#fbc2eb'
  ]
}

// 动画
export const animations = {
  fadeIn: 'fadeIn 0.5s ease-in-out',
  slideUp: 'slideUp 0.4s ease-out',
  scale: 'scale 0.3s ease-in-out',
  pulse: 'pulse 2s infinite',
  rotate: 'rotate 3s linear infinite'
}

// 响应式断点
export const breakpoints = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px'
}

// 间距
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
}

// 圆角
export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  round: '50%'
}

// 字体
export const typography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  sizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px'
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
}
