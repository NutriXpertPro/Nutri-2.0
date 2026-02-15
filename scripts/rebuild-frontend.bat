@echo off
echo Rebuilding frontend container with updated environment variables...

REM Navigate to project directory
cd /d "C:\Nutri 4.0"

REM Building frontend container with updated environment
echo Building frontend container...
docker-compose -f docker-compose.vps.yml build --no-cache frontend

if %ERRORLEVEL% == 0 (
    echo Frontend container rebuilt successfully!
) else (
    echo Error building frontend container
    pause
    exit /b %ERRORLEVEL%
)