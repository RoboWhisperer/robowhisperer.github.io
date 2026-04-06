# Installation Guide

## Table of Contents
1. [Download the Source Code](#1-download-the-source-code)
2. [Backend Setup](#2-backend-setup)
3. [Frontend Setup](#3-frontend-setup)
4. [Running in Development](#4-running-in-development)
5. [Building for Production](#5-building-for-production)

---

## 1. Download the Source Code

### Option A: Git Clone
```bash
git clone <your-repo-url> dravion-website
cd dravion-website
```

### Option B: Download ZIP
Download and extract the ZIP file, then navigate to the folder:
```bash
cd dravion-website
```

---

## 2. Backend Setup

### Navigate to Backend Directory
```bash
cd backend
```

### Create Virtual Environment (Recommended)
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# Linux/macOS:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit the .env file
nano .env
```

See [CONFIGURATION.md](./CONFIGURATION.md) for all environment variables.

### Verify Installation
```bash
# Start the server
uvicorn server:app --host 0.0.0.0 --port 8001

# Test the API (in another terminal)
curl http://localhost:8001/api/health
# Should return: {"status":"healthy","service":"dravion-landing"}
```

---

## 3. Frontend Setup

### Navigate to Frontend Directory
```bash
cd frontend
```

### Install Dependencies
```bash
# Using Yarn (recommended)
yarn install

# Or using npm
npm install
```

### Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit the .env file
nano .env
```

**Important:** Set `REACT_APP_BACKEND_URL` to your backend URL:
```env
# Development
REACT_APP_BACKEND_URL=http://localhost:8001

# Production
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

### Verify Installation
```bash
# Start development server
yarn start

# Opens browser at http://localhost:3000
```

---

## 4. Running in Development

### Start Both Servers

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # If using virtual environment
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
```

### Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8001
- **API Docs:** http://localhost:8001/docs

---

## 5. Building for Production

### Build Frontend
```bash
cd frontend

# Create production build
yarn build

# Output is in /frontend/build directory
```

### Production Files
After building, your production-ready files are:
- `frontend/build/` - Static frontend files
- `backend/server.py` - Backend application

### Serve Production Build Locally (Testing)
```bash
# Install serve globally
yarn global add serve

# Serve the build folder
serve -s build -l 3000
```

---

## Directory Structure After Setup

```
dravion-website/
├── backend/
│   ├── venv/              # Python virtual environment
│   ├── server.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── node_modules/      # Node.js dependencies
│   ├── build/             # Production build (after yarn build)
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env
└── docs/
```

---

## Common Installation Issues

### Node.js Version Mismatch
```bash
# Use nvm to manage Node.js versions
nvm install 18
nvm use 18
```

### Python Package Conflicts
```bash
# Always use a virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Permission Errors
```bash
# Linux/macOS - avoid using sudo with npm/yarn
# Instead, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 yarn start
```
