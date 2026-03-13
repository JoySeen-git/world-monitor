# 阿里云服务器部署指南

## 📋 部署前准备

### 1. 阿里云 ECS 配置要求
- **系统**: Ubuntu 20.04 / 22.04 LTS（推荐）或 CentOS 7+
- **CPU**: 2 核以上
- **内存**: 4GB 以上
- **存储**: 40GB 以上
- **网络**: 开放端口 80、443、3001

### 2. 安全组配置
在阿里云控制台开放以下端口：
- **80**: HTTP
- **443**: HTTPS
- **3001**: 应用端口

---

## 🚀 方式一：Docker 部署（推荐）

### 步骤 1：连接服务器

```bash
# SSH 连接到阿里云服务器
ssh root@你的服务器 IP
```

### 步骤 2：安装 Docker

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
```

### 步骤 3：上传项目

**方法 A：使用 Git**
```bash
# 克隆项目
git clone https://github.com/JoySeen-git/world-monitor.git
cd world-monitor
```

**方法 B：使用 SCP 从本地上传**
```bash
# 在本地执行（不是服务器）
# 在项目根目录执行
scp -r ./* root@你的服务器 IP:~/world-monitor
```

### 步骤 4：构建并运行

```bash
# 使用 Docker Compose 构建
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
```

### 步骤 5：验证部署

```bash
# 检查容器状态
docker ps

# 测试 API
curl http://localhost:3001/api/statistics
```

---

## 🔧 方式二：直接部署

### 步骤 1：安装 Node.js

```bash
# 安装 Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v
npm -v
```

### 步骤 2：安装 PM2

```bash
sudo npm install -g pm2
```

### 步骤 3：上传项目

```bash
# 方法同上（Git 或 SCP）
git clone https://github.com/JoySeen-git/world-monitor.git
cd world-monitor
```

### 步骤 4：安装依赖并构建

```bash
# 构建前端
cd frontend
npm install
npm run build
cd ..

# 构建后端
cd backend
npm install
npm run build
cd ..
```

### 步骤 5：启动服务

```bash
# 使用 PM2 启动
pm2 start ecosystem.config.cjs

# 设置开机自启
pm2 startup
pm2 save
```

### 步骤 6：管理命令

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs

# 重启
pm2 restart world-monitor

# 停止
pm2 stop world-monitor
```

---

## 🔒 配置 HTTPS（推荐）

### 使用 Nginx 反向代理

### 步骤 1：安装 Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 步骤 2：配置 Nginx

```bash
sudo nano /etc/nginx/sites-available/world-monitor
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name 你的域名;

    # 前端静态文件
    location / {
        root /app/world-monitor/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket 代理
    location /api/ws {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 步骤 3：启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/world-monitor /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 步骤 4：申请 SSL 证书（免费）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 申请证书
sudo certbot --nginx -d 你的域名

# 自动续期
sudo certbot renew --dry-run
```

---

## 📊 监控和维护

### 查看日志

```bash
# Docker 方式
docker-compose logs -f

# PM2 方式
pm2 logs
```

### 性能监控

```bash
# 安装 PM2 Plus（可选）
pm2 plus

# 系统监控
htop
```

### 备份数据

```bash
# 备份数据库
tar -czf backup-$(date +%Y%m%d).tar.gz backend/data/

# 定期备份（添加到 crontab）
0 2 * * * tar -czf /backup/world-monitor-$(date +\%Y\%m\%d).tar.gz /app/world-monitor/backend/data
```

---

## ⚠️ 常见问题

### 1. 端口被占用
```bash
# 查看端口占用
sudo lsof -i :3001

# 修改端口
# 编辑 ecosystem.config.cjs 中的 PORT
```

### 2. 内存不足
```bash
# 增加 swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 3. 无法访问
- 检查阿里云安全组是否开放端口
- 检查防火墙设置：`sudo ufw status`
- 检查服务状态：`docker ps` 或 `pm2 status`

---

## 📞 技术支持

- **Docker 文档**: https://docs.docker.com
- **PM2 文档**: https://pm2.keymetrics.io
- **Nginx 文档**: https://nginx.org

---

**部署完成后访问**: `http://你的服务器 IP:3001` 或 `https://你的域名`
