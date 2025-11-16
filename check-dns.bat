@echo off
echo Checking DNS propagation for pronostika.com.mx...
echo.
echo =================================================
echo Checking pronostika.com.mx...
nslookup pronostika.com.mx
echo.
echo =================================================
echo Checking www.pronostika.com.mx...
nslookup www.pronostika.com.mx
echo.
echo =================================================
echo Testing HTTP access...
curl -I https://pronostika.com.mx 2>nul
if %errorlevel% equ 0 (
    echo ✅ pronostika.com.mx is working!
) else (
    echo ❌ pronostika.com.mx is not accessible yet
)

curl -I https://www.pronostika.com.mx 2>nul
if %errorlevel% equ 0 (
    echo ✅ www.pronostika.com.mx is working!
) else (
    echo ❌ www.pronostika.com.mx is not accessible yet
)
echo.
echo Press any key to check again or Ctrl+C to exit...
pause >nul
goto :start