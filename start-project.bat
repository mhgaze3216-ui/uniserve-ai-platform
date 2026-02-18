@echo off
echo Starting UniServe AI Project...
echo.

echo Starting Backend Server...
cd "c:\Users\mghaz\Desktop\مشروع جامعة\UNSER1\backend"
set PORT=5001
start "Backend" cmd /k "node server-simple.js"

echo.
echo Starting Frontend Server...
cd "c:\Users\mghaz\Desktop\مشروع جامعة\UNSER1\UNSER1"
start "Frontend" cmd /k "npx serve . -p 3000"

echo.
echo Project is starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5001
echo.
pause
