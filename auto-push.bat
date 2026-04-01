@echo off
REM Auto Push Script for Video Player MMT
REM Mỗi khi code xong, chạy script này để push tự động

echo ========================================
echo   Video Player MMT - Auto Push Script
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Checking for changes...
git status

echo.
echo [2/4] Adding all changes...
git add .

echo.
echo [3/4] Committing changes...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" (
    set commit_msg=Update: Auto-push on %date% %time%
)
git commit -m "%commit_msg%"

echo.
echo [4/4] Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo   Push completed successfully!
echo   Repo: https://github.com/ghostminhtoan/Video-player-MMT
echo ========================================
echo.
pause
