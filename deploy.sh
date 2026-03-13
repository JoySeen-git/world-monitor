#!/bin/bash

# World Monitor 快速部署脚本 for 阿里云

set -e

echo "🚀 开始部署 World Monitor..."

# 检查是否以 root 运行
if [ "$EUID" -ne 0 ]; then 
  echo "请使用 sudo 运行此脚本"
  exit 1
fi

# 更新系统
echo "📦 更新系统..."
apt update && apt upgrade -y

# 安装 Docker
echo "🐳 安装 Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# 安装 Docker Compose
echo "📦 安装 Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# 启动 Docker
echo "▶️  启动 Docker 服务..."
systemctl start docker
systemctl enable docker

# 构建并运行
echo "🔨 构建 Docker 镜像..."
docker-compose build

echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查状态
echo "📊 服务状态:"
docker-compose ps

echo ""
echo "✅ 部署完成！"
echo ""
echo "访问地址：http://$(hostname -I | awk '{print $1}'):3001"
echo ""
echo "常用命令:"
echo "  查看日志：docker-compose logs -f"
echo "  停止服务：docker-compose down"
echo "  重启服务：docker-compose restart"
echo "  查看状态：docker-compose ps"
