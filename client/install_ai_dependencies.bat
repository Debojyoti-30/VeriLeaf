@echo off
echo Installing VeriLeaf AI Pipeline Dependencies...
echo.

cd ai_pipeline
pip install -r requirements.txt

if %errorlevel% equ 0 (
    echo.
    echo Dependencies installed successfully!
    echo.
    echo To start the AI server, run:
    echo   python start_ai_server.py
    echo.
    echo Or use the batch file:
    echo   start_ai_server.bat
) else (
    echo.
    echo Installation failed. Please check the error messages above.
)

pause
