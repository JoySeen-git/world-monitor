# 🚀 World Monitor 部署指南

## 免费部署方案
- **后端**: Railway (https://railway.app) - 免费额度：$5/月
- **前端**: Vercel (https://vercel.com) - 免费额度：100GB/月

---

## 第一步：准备代码

### 1.1 创建 GitHub 仓库
```bash
# 在 GitHub 创建新仓库 world-monitor
# 然后推送代码：
cd world-monitor
git init
git add .
git commit -m "World Monitor Dashboard"
git branch -M main
git remote add origin https://github.com/你的用户名/world-monitor.git
git push -u origin main
```

---

## 第二步：部署后端 (Railway)

### 2.1 创建 Railway 项目
1. 访问 https://railway.app
2. 使用 GitHub 登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择 `world-monitor` 仓库
5. 选择 `backend` 文件夹作为根目录

### 2.2 配置环境变量
在 Railway 项目设置中添加：
```
NODE_ENV=production
PORT=3001
```

### 2.3 部署后端
- 点击 "Deploy" 按钮
- 等待部署完成
- 复制后端 URL（例如：`https://world-monitor-backend.railway.app`）

---

## 第三步：部署前端 (Vercel)

### 3.1 创建 Vercel 项目
1. 访问 https://vercel.com
2. 使用 GitHub 登录
3. 点击 "Add New..." → "Project"
4. 选择 `world-monitor` 仓库
5. 选择 `frontend` 文件夹作为根目录

### 3.2 配置环境变量
在 Vercel 项目设置中添加：
```
VITE_API_URL=https://你的后端-railway-app.railway.app
VITE_WS_URL=wss://你的后端-railway-app.railway.app/ws
```

### 3.3 部署前端
- 点击 "Deploy" 按钮
- 等待部署完成
- 获得前端 URL（例如：`https://world-monitor.vercel.app`）

---

## 第四步：测试

1. 打开前端 URL
2. 检查数据是否正常加载
3. 检查 WebSocket 连接状态

---

## 费用说明

| 服务 | 免费额度 | 超出费用 |
|------|---------|---------|
| Railway | $5/月 | $0.50/容器小时 |
| Vercel | 100GB/月 | $0.01/GB |

对于个人使用和朋友分享，免费额度完全足够！

---

## 常见问题

### Q: 为什么地图不显示？
A: 检查后端是否正常运行，数据是否加载成功

### Q: WebSocket 连接失败？
A: 确保 VITE_WS_URL 使用 wss:// 而不是 https://

### Q: 如何更新部署？
A: 推送到 GitHub 后，Railway 和 Vercel 会自动部署

---

## 项目结构
```
world-monitor/
├── backend/          # 后端 (Railway)
│   ├── src/
│   ├── railway.json
│   └── package.json
├── frontend/        # 前端 (Vercel)
│   ├── src/
│   ├── vercel.json
│   └── package.json
└── README.md
```
