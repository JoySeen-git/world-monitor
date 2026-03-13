@echo off
chcp 65001 >nul
echo 🔍 检查并清理端口...

REM 查找占用 3001 端口的进程
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    echo ❌ 终止占用端口 3001 的进程：%%a
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

echo.
echo 🚀 启动 World Monitor...
echo.

echo 📡 启动后端服务器...
start "World Monitor - Backend" cmd /k "cd backend && npm run dev"

echo 等待后端启动...
timeout /t 5 /nobreak >nul

echo.
echo 🎨 启动前端界面...
start "World Monitor - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ World Monitor 启动完成！
echo.
echo 📍 访问地址：
echo    前端：http://localhost:3000
echo    后端：http://localhost:3001
echo.
echo 💡 提示：如果启动失败，请先关闭占用 3000 和 3001 端口的程序
echo.
pause
