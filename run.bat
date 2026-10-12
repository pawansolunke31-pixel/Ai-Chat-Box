@echo off
title AI Chat Box Server
echo ========================================================
echo       AI Chat Box - Next-Gen Intelligence
echo ========================================================
echo Starting local web server on http://localhost:5500 ...
start "" http://localhost:5500
python -m http.server 5500
pause
