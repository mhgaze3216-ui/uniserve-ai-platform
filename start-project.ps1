Write-Host "Starting UniServe AI Project..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
cd "c:\Users\mghaz\Desktop\مشروع جامعة\UNSER1\backend"
$env:PORT=5001
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server-simple.js" -WindowStyle Minimized

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
cd "c:\Users\mghaz\Desktop\مشروع جامعة\UNSER1\UNSER1"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx serve . -p 3000" -WindowStyle Minimized

Write-Host ""
Write-Host "Project is starting..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
Read-Host
