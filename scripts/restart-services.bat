@echo off
echo Restarting all services with updated configuration...

REM Navigate to project directory
cd /d "C:\Nutri 4.0"

REM Stop all running services
echo Stopping all services...
docker-compose -f docker-compose.vps.yml down

REM Start all services with updated configuration
echo Starting all services...
docker-compose -f docker-compose.vps.yml up -d

if %ERRORLEVEL% == 0 (
    echo All services restarted successfully!
    echo Waiting for services to become healthy...
    timeout /t 30
) else (
    echo Error restarting services
    pause
    exit /b %ERRORLEVEL%
)

echo Checking service status...
docker-compose -f docker-compose.vps.yml ps