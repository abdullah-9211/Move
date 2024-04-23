@echo off

REM Start backend server 
start cmd /k "python main.py"

REM Start frontend server
start cmd /k "cd frontend && npx expo start --reset-cache"