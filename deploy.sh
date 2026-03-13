#!/bin/bash

# World Monitor 阿里云部署脚本
# 使用方法: bash deploy.sh

echo "🚀 开始部署 World Monitor 到阿里云轻量应用服务器..."

# 更新系统包
sudo apt-get update

# 安装 Docker
if ! command -v docker &> /dev/null; then
    echo "🐳 安装 Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# 安装 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "📦 安装 Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# 检查项目文件
if [ ! -d "./backend" ] || [ ! -d "./frontend" ]; then
    echo "❌ 未找到 backend 或 frontend 目录"
    echo "请确保在项目根目录下运行此脚本"
    exit 1
fi

# 创建必要目录
mkdir -p nginx/ssl nginx/logs

# 构建并启动服务
echo "🏗️ 构建并启动 World Monitor..."
sudo docker-compose down
sudo docker-compose up -d --build

# 检查服务状态
sleep 10
sudo docker-compose ps

echo "✅ World Monitor 部署完成！"
echo ""
echo "🌐 访问地址:"
echo "   前端: http://$(curl -s ifconfig.me)"
echo "   API: http://$(curl -s ifconfig.me)/api/statistics"
echo ""
echo "🔧 服务管理命令:"
echo "   查看日志: sudo docker-compose logs -f"
echo "   重启服务: sudo docker-compose restart"
echo "   停止服务: sudo docker-compose down"
echo ""
echo "💡 注意事项:"
echo "   - 如需 HTTPS，将 SSL 证书放入 nginx/ssl 目录"
echo "   - 修改 nginx/nginx.conf 启用 HTTPS 配置"
echo "   - 安全组需开放 80/443 端口"
