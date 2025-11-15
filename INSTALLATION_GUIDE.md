# Pronostika Installation Guide

## Step 1: Verify Node.js Installation

Since Node.js doesn't seem to be recognized, please follow these steps:

### Option A: Reinstall Node.js (Recommended)
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (currently Node.js 18.x or 20.x)
3. Run the installer as **Administrator**
4. Make sure to check "Add to PATH" during installation
5. **Restart your computer** after installation

### Option B: Check if Node.js is installed but not in PATH
1. Open File Explorer
2. Navigate to `C:\Program Files\nodejs\` or `C:\Program Files (x86)\nodejs\`
3. If you see `node.exe` there, Node.js is installed but not in PATH

### Verify Installation
After installation/restart, open a **new** PowerShell window and run:
```powershell
node --version
npm --version
```

You should see version numbers like:
```
v18.18.0
9.8.1
```

## Step 2: Install Project Dependencies

Once Node.js is working, run these commands **one at a time**:

```powershell
# 1. Install root dependencies
npm install

# 2. Install backend dependencies
cd backend
npm install
cd ..

# 3. Install frontend dependencies
cd frontend
npm install
cd ..

# 4. Install database dependencies
cd database
npm install
cd ..
```

## Step 3: Set Up Environment Variables

### Backend Environment (.env)
1. Copy the example file:
   ```powershell
   cd backend
   copy .env.example .env
   ```

2. Edit `backend\.env` with your database credentials:
   ```
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=YOUR_POSTGRES_PASSWORD
   DB_NAME=pronostika
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3000
   ```

### Database Environment (.env)
1. Copy the example file:
   ```powershell
   cd database
   copy .env.example .env
   ```

2. Edit `database\.env` with the same database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=YOUR_POSTGRES_PASSWORD
   DB_NAME=pronostika
   ```

### Frontend Environment (.env)
1. Copy the example file:
   ```powershell
   cd frontend
   copy .env.example .env
   ```

## Step 4: Create PostgreSQL Database

1. **Open PostgreSQL command line** (psql) or pgAdmin
2. **Create the database**:
   ```sql
   CREATE DATABASE pronostika;
   ```

## Step 5: Initialize Database Schema

From the project root directory:
```powershell
cd database
npm run setup
```

This will create all the tables and insert sample data.

## Step 6: Start the Application

From the project root directory:
```powershell
# Start both frontend and backend
npm run dev
```

Or start them separately:
```powershell
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend  
npm run frontend:dev
```

## Step 7: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Test Login Credentials
- **Admin**: admin@pronostika.com / admin123
- **User**: user1@example.com / user123

## Troubleshooting

### Issue: "node is not recognized"
- **Solution**: Restart your computer after Node.js installation
- **Alternative**: Add Node.js to PATH manually

### Issue: "npm run install:all" fails
- **Solution**: Run installation commands individually as shown in Step 2

### Issue: Database connection errors
- **Solution**: 
  1. Make sure PostgreSQL is running
  2. Check your database credentials in .env files
  3. Ensure the database "pronostika" exists

### Issue: Port already in use
- **Solution**: Change ports in the configuration files or stop other applications using ports 3000/5000

## Next Steps After Setup

1. Open http://localhost:3000 in your browser
2. Register a new account or use the test credentials
3. Explore the betting interface
4. If you're an admin, access the admin panel

---

**Need Help?** If you encounter any issues, please share the exact error message you're seeing.