@echo off
chcp 65001 >nul
echo 🌍 启动 World Monitor...
echo.

echo 📡 启动后端服务器...
start "World Monitor - Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo 🎨 启动前端界面...
start "World Monitor - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ World Monitor 启动完成！
echo 后端：http://localhost:3001
echo 前端：http://localhost:3000
echo.
echo 按任意键退出此窗口...
pause >nul
