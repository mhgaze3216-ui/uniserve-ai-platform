@echo off
echo Starting UniServe AI Project...
echo.

echo Stopping any running processes...
taskkill /F /IM node.exe /T >nul 2>&1

echo.
echo Starting Backend Server...
start "Backend" cmd /k "cd /d %~dp0backend && set PORT=5001 && node server-simple.js"

echo.
echo Starting Frontend Server...
start "Frontend" cmd /k "cd /d %~dp0UNSER1 && npx serve . -p 3000"

echo.
echo Project is starting...
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5001
echo.
echo Please wait 10 seconds for servers to start...
timeout /t 10 /nobreak >nul

echo.
echo Opening project in browser...
start http://localhost:3000

echo.
echo Project is running! Check the opened browser window.
pause
