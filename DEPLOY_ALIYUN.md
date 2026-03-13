# World Monitor 阿里云部署指南

## 📋 准备工作

### 1. 购买阿里云轻量应用服务器

**推荐配置**：
- **CPU**: 2 核
- **内存**: 2GB
- **硬盘**: 40GB SSD
- **带宽**: 3Mbps
- **价格**: 约 99 元/年

**操作系统**: Ubuntu 20.04 LTS 或 22.04 LTS

### 2. 配置安全组

在阿里云控制台开放以下端口：
- **80**: HTTP
- **443**: HTTPS（可选，如需 HTTPS）
- **22**: SSH

---

## 🚀 部署步骤

### 步骤 1: 连接服务器

```bash
# 使用 SSH 连接
ssh root@你的服务器 IP
```

### 步骤 2: 安装 Git

```bash
sudo apt-get update
sudo apt-get install -y git
```

### 步骤 3: 克隆项目

```bash
git clone https://github.com/JoySeen-git/world-monitor.git
cd world-monitor
```

### 步骤 4: 运行部署脚本

```bash
# 给脚本执行权限
chmod +x deploy.sh

# 运行部署
bash deploy.sh
```

部署过程大约需要 5-10 分钟，请耐心等待。

---

## ✅ 验证部署

### 检查服务状态

```bash
sudo docker-compose ps
```

应该看到 3 个服务都在运行：
- world-monitor-backend
- world-monitor-frontend
- world-monitor-nginx

### 访问网站

在浏览器中打开：

```
http://你的服务器 IP
```

### 测试 API

```bash
curl http://localhost/api/statistics
```

---

## 🔧 日常运维

### 查看日志

```bash
# 查看所有服务日志
sudo docker-compose logs -f

# 查看后端日志
sudo docker-compose logs -f backend

# 查看前端日志
sudo docker-compose logs -f frontend

# 查看 Nginx 日志
sudo docker-compose logs -f nginx
```

### 重启服务

```bash
# 重启所有服务
sudo docker-compose restart

# 重启单个服务
sudo docker-compose restart backend
```

### 更新代码

```bash
# 拉取最新代码
git pull origin main

# 重新构建并部署
sudo docker-compose down
sudo docker-compose up -d --build
```

### 停止服务

```bash
sudo docker-compose down
```

---

## 🔒 HTTPS 配置（可选）

### 方法一：使用 Let's Encrypt 免费证书

1. **安装 Certbot**

```bash
sudo apt-get install -y certbot
```

2. **获取证书**

```bash
sudo certbot certonly --standalone -d your-domain.com
```

3. **复制证书到项目目录**

```bash
mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/
```

4. **修改 nginx/nginx.conf**

取消 HTTPS 部分的注释，并修改域名。

5. **重启服务**

```bash
sudo docker-compose restart nginx
```

### 方法二：使用阿里云 SSL 证书

1. 在阿里云申请 SSL 证书
2. 下载证书文件
3. 将证书文件放入 `nginx/ssl` 目录
4. 修改 `nginx/nginx.conf` 启用 HTTPS

---

## 📊 性能优化建议

### 1. 配置域名

- 购买域名并解析到服务器 IP
- 使用 CDN 加速静态资源

### 2. 优化 Nginx

- 启用 Gzip 压缩（已配置）
- 配置浏览器缓存（已配置）
- 调整 worker 进程数

### 3. 数据库优化

- 定期清理旧数据
- 使用 SSD 硬盘

---

## ⚠️ 常见问题

### 1. 端口被占用

```bash
# 查看端口占用
sudo netstat -tulpn | grep :80

# 停止占用端口的服务
sudo systemctl stop apache2
```

### 2. Docker 服务未启动

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### 3. 内存不足

```bash
# 添加 swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 4. 访问速度慢

- 检查服务器带宽
- 使用 CDN 加速
- 优化图片和静态资源

---

## 💰 成本估算

| 项目 | 费用 | 备注 |
|------|------|------|
| 阿里云轻量服务器 | 99 元/年 | 2 核 2G 配置 |
| 域名（可选） | 60 元/年 | .com 域名 |
| SSL 证书 | 0 元 | Let's Encrypt 免费 |
| **总计** | **约 160 元/年** | 首年 |

---

## 📞 技术支持

遇到问题？

1. 查看日志：`sudo docker-compose logs -f`
2. 检查服务状态：`sudo docker-compose ps`
3. 重启服务：`sudo docker-compose restart`

---

**🎉 部署完成！享受你的 World Monitor 吧！**
