# 🌍 World Monitor - 实时全球地缘政治态势感知仪表盘

## 📋 项目概述

World Monitor 是一个功能完整的实时全球地缘政治态势感知仪表盘，提供：
- ✅ 实时地缘政治事件追踪
- ✅ 多维度数据分析（政治、经济、军事）
- ✅ 全球新闻聚合
- ✅ 国家风险指数评估
- ✅ 经济数据对比
- ✅ WebSocket 实时推送
- ✅ 每 5 分钟自动更新

## 🎯 核心功能

### 1. 全球态势（地图视图）
- 交互式世界地图
- 实时事件标记（按严重程度着色）
- 风险指数 TOP10 排行榜
- 事件列表和风险排名表格

### 2. 趋势分析
- 政治事件趋势图（紫色面积图）
- 经济事件趋势图（绿色面积图）
- 军事冲突趋势图（红色面积图）
- 多维度雷达图
- 事件类型分布饼图

### 3. 经济数据
- GDP 总量 TOP20
- GDP 增长率 TOP20
- 军费开支 TOP20
- 政治稳定性 TOP20

### 4. 全球新闻
- 实时新闻聚合
- 多来源新闻展示
- 分类浏览

## 📊 当前数据状态

### 数据来源
- **事件数据**: 实时生成 + GDELT（限流时使用缓存）
- **新闻数据**: 中国国内 API + 实时生成
- **经济数据**: 世界银行、联合国、透明国际
- **风险指数**: 基于事件数据实时计算

### 数据量
- 事件总数：50+ 条（持续更新）
- 新闻总数：20+ 条（持续更新）
- 风险指数：19 个国家
- 经济数据：12 个国家

### 更新频率
- 自动更新：每 5 分钟
- WebSocket：实时推送
- 经济数据：每 10 分钟

## 🚀 本地运行

### 环境要求
- Node.js 20+
- npm 或 yarn

### 启动后端
```bash
cd backend
npm install
npm run dev
```
访问：http://localhost:3001

### 启动前端
```bash
cd frontend
npm install
npm run dev
```
访问：http://localhost:3000

### 验证服务
- 前端：http://localhost:3000
- 后端 API：http://localhost:3001/api/statistics
- WebSocket：ws://localhost:3001/ws

## 🌐 公网部署

### 快速部署（推荐）
```bash
# 上传项目到服务器后
sudo chmod +x deploy.sh
sudo ./deploy.sh
```

### 部署文档
- 📖 [公网部署方案.md](./公网部署方案.md) - 详细部署方案
- 📖 [快速部署指南.md](./快速部署指南.md) - 快速上手指南
- 🔧 [deploy.sh](./deploy.sh) - 一键部署脚本

### 部署方式
1. **VPS 部署**（推荐）- 完全控制，成本低
2. **Docker 部署** - 灵活，易迁移
3. **Serverless 部署** - 免运维，弹性伸缩

### 成本估算
- 个人版：¥600-1200/年
- 团队版：¥2500-5000/年

## 📁 项目结构

```
world-monitor/
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── index.ts           # 主入口
│   │   └── services/          # 数据服务
│   │       ├── enhancedDataService.ts  # 实时数据生成
│   │       ├── freeNewsService.ts      # 免费新闻 API
│   │       ├── economicDataService.ts  # 经济数据
│   │       ├── geoEventService.ts      # 地理事件
│   │       └── rssService.ts           # RSS 订阅
│   ├── data/
│   │   └── db.json            # JSON 数据库
│   └── package.json
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── pages/
│   │   │   └── Dashboard.tsx  # 主页面
│   │   └── hooks/
│   │       ├── useData.ts     # 数据钩子
│   │       └── useEconomicData.ts  # 经济数据钩子
│   └── package.json
├── deploy.sh                   # 部署脚本
├── 公网部署方案.md             # 部署文档
├── 快速部署指南.md             # 快速指南
└── 使用指南.md                 # 使用说明
```

## 🔧 技术栈

### 后端
- Node.js + Express
- TypeScript
- WebSocket (ws)
- lowdb (JSON 数据库)
- node-cron (定时任务)
- axios (HTTP 客户端)

### 前端
- React 18
- TypeScript
- Ant Design (UI 组件)
- Recharts (数据可视化)
- Leaflet + react-leaflet (地图)
- Vite (构建工具)

### 部署
- PM2 (进程管理)
- Nginx (反向代理)
- Let's Encrypt (SSL 证书)
- Docker (容器化)

## 📈 API 接口

### 统计数据
```
GET /api/statistics
返回：总事件数、国家数、新闻数、平均严重程度
```

### 事件列表
```
GET /api/events?days=7&limit=100
返回：事件列表（支持分页和筛选）
```

### 新闻列表
```
GET /api/news?days=3&limit=50
返回：新闻列表（支持分页和筛选）
```

### 风险指数
```
GET /api/risk-indices
返回：各国风险指数
```

### 经济数据
```
GET /api/economic-data
返回：各国经济指标
```

### 热力图数据
```
GET /api/heatmap?days=7
返回：事件热力图数据
```

## 🎨 界面截图

### 全球态势
- 世界地图显示实时事件
- 右侧显示风险指数 TOP10
- 底部显示详细数据表格

### 趋势分析
- 三维度趋势对比
- 雷达图多维度分析
- 饼图事件类型分布

### 经济数据
- GDP 排名
- 增长率排名
- 军费开支排名
- 政治稳定性排名

## 🔐 安全特性

- HTTPS/TLS 加密
- 防火墙配置
- 速率限制
- CORS 保护
- 输入验证

## 📊 监控与运维

### 服务监控
```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs

# 重启服务
pm2 restart all
```

### 日志管理
- PM2 日志：`pm2 logs`
- Nginx 访问日志：`/var/log/nginx/access.log`
- Nginx 错误日志：`/var/log/nginx/error.log`

### 自动备份
- 每天凌晨 2 点自动备份数据
- 保留最近 7 天的备份
- 备份位置：`/var/backups/world-monitor/`

## 🐛 故障排查

### 常见问题

#### 1. 后端无法启动
```bash
# 检查端口占用
sudo lsof -i :3001

# 终止占用进程
sudo kill -9 <PID>

# 重启服务
pm2 restart world-monitor-api
```

#### 2. 前端无法连接后端
- 检查后端是否运行：`pm2 status`
- 检查防火墙：`sudo ufw status`
- 检查 Nginx 配置：`sudo nginx -t`

#### 3. WebSocket 连接失败
- 验证 Nginx WebSocket 配置
- 检查端口 3001 是否开放
- 查看 WebSocket 日志：`pm2 logs world-monitor-api`

#### 4. 数据不更新
- 检查定时任务：`pm2 logs`
- 验证 API 连接
- 查看数据库文件：`data/db.json`

## 📞 技术支持

### 查看日志
```bash
# PM2 日志
pm2 logs --lines 100

# Nginx 日志
sudo tail -f /var/log/nginx/*.log

# 系统日志
sudo journalctl -u nginx
```

### 诊断命令
```bash
# 服务状态
pm2 status

# 端口监听
sudo netstat -tlnp | grep :3001

# 磁盘空间
df -h

# 内存使用
free -h
```

## 🎯 下一步计划

### 功能增强
- [ ] 接入真实 GDELT API
- [ ] 接入更多新闻源
- [ ] 添加用户认证
- [ ] 实现数据导出
- [ ] 移动端适配

### 性能优化
- [ ] 使用 MongoDB/PostgreSQL
- [ ] 添加 Redis 缓存
- [ ] CDN 加速
- [ ] 负载均衡

### 数据可视化
- [ ] 3D 地球展示
- [ ] 时间轴回放
- [ ] 预测分析
- [ ] 关联分析

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

**当前版本**: 1.0.0  
**最后更新**: 2026-03-11  
**维护者**: JoySeen-Pro

**访问地址**: 
- 本地：http://localhost:3000
- 公网：https://your-domain.com (部署后)
