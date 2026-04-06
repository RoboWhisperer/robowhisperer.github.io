# Deployment Guide

This guide covers multiple deployment options for the Dravion website.

## Table of Contents
1. [VPS/Dedicated Server (Nginx + PM2)](#1-vpsdedicated-server)
2. [Docker Deployment](#2-docker-deployment)
3. [Vercel (Frontend) + Railway (Backend)](#3-vercel--railway)
4. [DigitalOcean App Platform](#4-digitalocean-app-platform)
5. [AWS (EC2 + S3 + CloudFront)](#5-aws-deployment)

---

## 1. VPS/Dedicated Server

### Prerequisites
- Ubuntu 20.04+ or Debian 11+
- Root or sudo access
- Domain name pointed to your server

### Step 1: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Yarn
npm install -g yarn

# Install Python
sudo apt install -y python3 python3-pip python3-venv

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
npm install -g pm2

# Install Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Setup Application

```bash
# Create app directory
sudo mkdir -p /var/www/dravion
sudo chown $USER:$USER /var/www/dravion

# Clone/Upload your code
cd /var/www/dravion
git clone <your-repo> .

# Setup Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup Frontend
cd ../frontend
yarn install
yarn build
```

### Step 3: Configure Environment

```bash
# Backend .env
cat > /var/www/dravion/backend/.env << EOF
HOST=0.0.0.0
PORT=8001
ENVIRONMENT=production
EOF

# Frontend was built with production URL
# Ensure REACT_APP_BACKEND_URL was set before building
```

### Step 4: Setup PM2 Process Manager

```bash
# Create PM2 ecosystem file
cat > /var/www/dravion/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'dravion-backend',
      cwd: '/var/www/dravion/backend',
      script: 'venv/bin/uvicorn',
      args: 'server:app --host 0.0.0.0 --port 8001',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOF

# Start the backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 5: Configure Nginx

```bash
# Create Nginx config
sudo cat > /etc/nginx/sites-available/dravion << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (Static files)
    location / {
        root /var/www/dravion/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/dravion /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Setup SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is automatic with certbot
```

---

## 2. Docker Deployment

### Create Dockerfiles

**Backend Dockerfile** (`/backend/Dockerfile`):
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

**Frontend Dockerfile** (`/frontend/Dockerfile`):
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

RUN yarn build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Frontend Nginx Config** (`/frontend/nginx.conf`):
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Docker Compose** (`/docker-compose.yml`):
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: dravion-backend
    ports:
      - "8001:8001"
    environment:
      - ENVIRONMENT=production
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      args:
        - REACT_APP_BACKEND_URL=http://yourdomain.com
    container_name: dravion-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

### Deploy with Docker Compose

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 3. Vercel + Railway

### Deploy Frontend to Vercel

1. Push frontend code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `yarn build`
   - **Output Directory:** `build`
5. Add Environment Variable:
   - `REACT_APP_BACKEND_URL` = `https://your-railway-url.up.railway.app`
6. Deploy

### Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select your repository
4. Configure:
   - **Root Directory:** `backend`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Deploy

---

## 4. DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create App → GitHub
3. Add two components:

**Backend (Web Service):**
- Source: `/backend`
- Run Command: `uvicorn server:app --host 0.0.0.0 --port 8080`
- HTTP Port: 8080

**Frontend (Static Site):**
- Source: `/frontend`
- Build Command: `yarn build`
- Output Directory: `build`
- Environment: `REACT_APP_BACKEND_URL=${backend.PUBLIC_URL}`

---

## 5. AWS Deployment

### Architecture
- **S3** - Static frontend hosting
- **CloudFront** - CDN
- **EC2** or **ECS** - Backend API
- **Route 53** - DNS

### S3 + CloudFront (Frontend)

```bash
# Build frontend
cd frontend
yarn build

# Create S3 bucket
aws s3 mb s3://dravion-website

# Configure for static hosting
aws s3 website s3://dravion-website --index-document index.html --error-document index.html

# Upload build
aws s3 sync build/ s3://dravion-website --delete

# Create CloudFront distribution via AWS Console
# Point to S3 bucket origin
```

### EC2 (Backend)

Follow the VPS deployment steps above, replacing Nginx config to only serve the API.

---

## Post-Deployment Checklist

- [ ] SSL certificate installed and working
- [ ] All pages load correctly
- [ ] API endpoints responding
- [ ] Theme toggle works
- [ ] Mobile responsive
- [ ] Discord links correct
- [ ] Error pages working
- [ ] Performance optimized (Lighthouse score)
