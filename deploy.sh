#!/bin/bash

# World Monitor 一键部署脚本
# 适用于 Ubuntu 22.04 / Debian 11

set -e

echo "🌍 World Monitor 一键部署脚本"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否以 root 运行
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}请使用 sudo 运行此脚本${NC}"
  exit 1
fi

# 配置变量
DEPLOY_DIR="/var/www/world-monitor"
DOMAIN=""
EMAIL=""

# 函数：打印信息
print_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# 函数：询问用户输入
ask_input() {
  read -p "$1" $2
}

# 1. 系统更新
print_info "步骤 1: 更新系统..."
apt update && apt upgrade -y

# 2. 安装 Node.js
print_info "步骤 2: 安装 Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 验证 Node.js 版本
NODE_VERSION=$(node -v)
print_info "已安装 Node.js $NODE_VERSION"

# 3. 安装 PM2
print_info "步骤 3: 安装 PM2..."
npm install -g pm2

# 4. 安装 Nginx
print_info "步骤 4: 安装 Nginx..."
apt install nginx -y

# 5. 配置防火墙
print_info "步骤 5: 配置防火墙..."
if command -v ufw &> /dev/null; then
  ufw allow OpenSSH
  ufw allow 'Nginx Full'
  ufw --force enable
  print_info "防火墙配置完成"
else
  print_warning "未检测到 UFW，跳过防火墙配置"
fi

# 6. 创建部署目录
print_info "步骤 6: 创建部署目录..."
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR

# 7. 上传或克隆代码
print_info "步骤 7: 准备代码..."
if [ -d "backend" ] && [ -d "frontend" ]; then
  print_info "检测到现有代码，跳过上传步骤"
else
  print_warning "请手动上传代码到 $DEPLOY_DIR"
  print_info "上传完成后按回车继续..."
  read
fi

# 8. 安装依赖
print_info "步骤 8: 安装依赖..."

if [ -d "backend" ]; then
  cd backend
  print_info "安装后端依赖..."
  npm install
  cd ..
else
  print_error "未找到 backend 目录"
  exit 1
fi

if [ -d "frontend" ]; then
  cd frontend
  print_info "安装前端依赖..."
  npm install
  print_info "构建前端..."
  npm run build
  cd ..
else
  print_error "未找到 frontend 目录"
  exit 1
fi

# 9. 配置环境变量
print_info "步骤 9: 配置环境变量..."
cat > backend/.env << EOF
PORT=3001
HOST=0.0.0.0
NODE_ENV=production
DB_PATH=/var/www/world-monitor/backend/data/db.json
EOF

# 10. 启动服务
print_info "步骤 10: 启动服务..."

# 启动后端
cd backend
pm2 start npm --name "world-monitor-api" -- run dev
cd ..

# 启动前端
cd frontend
pm2 start npm --name "world-monitor-frontend" -- run dev
cd ..

# 保存 PM2 配置
pm2 save
pm2 startup | tail -1 | bash 2>/dev/null || true

print_info "服务已启动"

# 11. 配置 Nginx
print_info "步骤 11: 配置 Nginx..."

read -p "是否配置域名？(y/n) " configure_domain
if [ "$configure_domain" = "y" ]; then
  read -p "请输入域名 (例如：example.com): " DOMAIN
  read -p "请输入邮箱 (用于 SSL 证书): " EMAIL
  
  cat > /etc/nginx/sites-available/world-monitor << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
    
    location /ws {
        proxy_pass http://localhost:3001/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF
  
  ln -sf /etc/nginx/sites-available/world-monitor /etc/nginx/sites-enabled/
  nginx -t
  systemctl restart nginx
  
  # 安装 Certbot
  print_info "安装 Certbot..."
  apt install certbot python3-certbot-nginx -y
  
  # 获取 SSL 证书
  print_info "获取 SSL 证书..."
  certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL
  
  print_info "HTTPS 配置完成"
else
  # 仅配置 HTTP
  cat > /etc/nginx/sites-available/world-monitor << 'EOF'
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /ws {
        proxy_pass http://localhost:3001/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF
  
  ln -sf /etc/nginx/sites-available/world-monitor /etc/nginx/sites-enabled/
  nginx -t
  systemctl restart nginx
fi

# 12. 创建备份脚本
print_info "步骤 12: 创建备份脚本..."
mkdir -p /var/backups/world-monitor

cat > /var/www/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /var/backups/world-monitor/$DATE.tar.gz /var/www/world-monitor/backend/data
find /var/backups/world-monitor -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /var/www/backup.sh

# 添加定时任务
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/backup.sh") | crontab -

# 13. 显示状态
print_info "部署完成！"
echo ""
echo "================================"
echo "📊 服务状态"
echo "================================"
pm2 status
echo ""
echo "================================"
echo "🌐 访问地址"
echo "================================"
if [ -n "$DOMAIN" ]; then
  echo "HTTPS: https://$DOMAIN"
else
  echo "HTTP: http://$(curl -s ifconfig.me)"
fi
echo ""
echo "================================"
echo "📝 重要信息"
echo "================================"
echo "部署目录：$DEPLOY_DIR"
echo "后端端口：3001"
echo "前端端口：3000"
echo "Nginx 端口：80/443"
echo ""
echo "================================"
echo "🔧 常用命令"
echo "================================"
echo "查看日志：pm2 logs"
echo "重启服务：pm2 restart all"
echo "停止服务：pm2 stop all"
echo "Nginx 状态：systemctl status nginx"
echo ""
print_info "部署成功！"
