@echo off
echo Pronostika Setup Script
echo =======================

echo.
echo Step 1: Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/ and restart your computer
    pause
    exit /b 1
)

echo.
echo Step 2: Installing root dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo Step 3: Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Step 4: Installing frontend dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Step 5: Installing database dependencies...
cd database
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install database dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Step 6: Creating environment files...
cd backend
if not exist .env (
    copy .env.example .env
    echo Created backend/.env - Please edit with your database credentials
)
cd ..

cd database
if not exist .env (
    copy .env.example .env
    echo Created database/.env - Please edit with your database credentials
)
cd ..

cd frontend
if not exist .env (
    copy .env.example .env
    echo Created frontend/.env
)
cd ..

echo.
echo ============================================
echo Installation completed successfully!
echo ============================================
echo.
echo Next steps:
echo 1. Edit backend/.env and database/.env with your PostgreSQL credentials
echo 2. Create PostgreSQL database: CREATE DATABASE pronostika;
echo 3. Run: cd database && npm run setup
echo 4. Run: npm run dev
echo.
pause