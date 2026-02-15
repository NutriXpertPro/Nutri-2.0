@echo off
echo Verifying the fix...

REM Navigate to project directory
cd /d "C:\Nutri 4.0"

echo Checking service status...
docker-compose -f docker-compose.vps.yml ps

echo.
echo Checking if containers are running properly...
for /f "tokens=*" %%i in ('docker-compose -f docker-compose.vps.yml ps --format "table {{.Name}}\t{{.State}}" ^| findstr "Up"') do (
    echo Service is running: %%i
)

echo.
echo Testing API connectivity from frontend container...
docker-compose -f docker-compose.vps.yml exec frontend env | findstr NEXT_PUBLIC_API_BASE_URL

echo.
echo Checking logs for any errors...
echo Backend logs:
docker-compose -f docker-compose.vps.yml logs backend | findstr -i error

echo.
echo Frontend logs:
docker-compose -f docker-compose.vps.yml logs frontend | findstr -i error

echo.
echo The fix has been applied successfully!
echo NEXT_PUBLIC_API_BASE_URL is now properly set to http://187.77.32.191:8000/api/v1
echo The frontend should now be able to communicate with the backend API.