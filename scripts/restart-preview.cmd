@echo off
setlocal
cd /d "%~dp0.."
del /q preview-runtime.out.log preview-runtime.err.log 2>nul
start "" /min cmd /k ""C:\Program Files\nodejs\node.exe" scripts\preview-runtime-server.cjs --host 127.0.0.1 --port 4173 1>preview-runtime.out.log 2>preview-runtime.err.log"
