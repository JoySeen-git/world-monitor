# 多阶段构建 - 前端
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# 多阶段构建 - 后端
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./
RUN npm run build

# 生产环境
FROM node:20-alpine

WORKDIR /app

# 安装 PM2 全局
RUN npm install -g pm2

# 复制后端
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/data ./backend/data

# 复制前端构建产物
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# 安装后端依赖
WORKDIR /app/backend
RUN npm install --production

WORKDIR /app

# 复制 PM2 配置
COPY ecosystem.config.cjs ./

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["pm2-runtime", "ecosystem.config.cjs"]
