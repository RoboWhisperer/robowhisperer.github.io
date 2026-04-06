# Bot Integration Guide

Connect your Discord bot to the Dravion website for **real-time statistics** and **live service status monitoring**.

---

## Quick Start

### What You'll Connect

| Website Feature | Data Needed | Bot Source |
|-----------------|-------------|------------|
| **Stats Dashboard** | Server count, User count, Commands, Uptime | Bot memory/database |
| **Status Page** | Service health, Latency, Uptime % | Health check endpoints |

### Quickest Setup (5 minutes)

1. Add an HTTP server to your bot
2. Expose `/stats` and `/status` endpoints
3. Update website backend to fetch from your bot

---

## Table of Contents

**Part 1: Real-Time Stats**
1. [Stats Overview](#part-1-real-time-stats)
2. [Bot-Side: Expose Stats Endpoint](#step-1-bot-side-expose-stats-endpoint)
3. [Website-Side: Fetch Stats](#step-2-website-side-fetch-stats)

**Part 2: Service Status**
4. [Status Overview](#part-2-service-status-monitoring)
5. [Bot-Side: Expose Status Endpoint](#step-1-bot-side-expose-status-endpoint)
6. [Website-Side: Fetch Status](#step-2-website-side-fetch-status)

**Part 3: Advanced Integration**
7. [Database Integration](#part-3-database-integration)
8. [Redis Integration](#part-4-redis-integration)
9. [WebSocket Live Updates](#part-5-websocket-live-updates)
10. [Complete Server Example](#complete-serverpy-with-bot-integration)

---

# Part 1: Real-Time Stats

The home page displays these statistics:
- **Servers** - Number of guilds the bot is in
- **Users** - Total users across all guilds
- **Commands Executed** - Lifetime command count
- **Uptime** - Bot uptime percentage

## Step 1: Bot-Side - Expose Stats Endpoint

### Discord.js Example

```javascript
// bot/api.js - Add this to your bot

const express = require('express');
const app = express();

// Your Discord client
const { client } = require('./index.js'); // Import your bot client

// Track commands (add this to your command handler)
let commandsExecuted = 0;
const botStartTime = Date.now();

// Middleware to verify API key
const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.WEBSITE_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Stats endpoint
app.get('/stats', verifyApiKey, (req, res) => {
    const uptimeMs = Date.now() - botStartTime;
    const uptimePercent = 99.9; // Calculate from your monitoring
    
    res.json({
        guild_count: client.guilds.cache.size,
        user_count: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
        commands_executed: commandsExecuted,
        uptime_percentage: uptimePercent,
        shard_count: client.shard?.count || 1,
        ping: client.ws.ping,
        uptime_ms: uptimeMs
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: client.ws.status === 0 ? 'healthy' : 'degraded',
        ping: client.ws.ping 
    });
});

// Start API server
const PORT = process.env.BOT_API_PORT || 3001;
app.listen(PORT, () => {
    console.log(`Bot API running on port ${PORT}`);
});

// Export for command handler to increment
module.exports = { 
    incrementCommands: () => commandsExecuted++,
    app 
};
```

### Discord.py Example

```python
# bot/api.py - Add this to your bot

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import datetime

app = FastAPI()

# Import your bot instance
from main import bot  # Your bot instance

# Track stats
commands_executed = 0
bot_start_time = datetime.now()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_api_key(x_api_key: str = Header(None)):
    if x_api_key != os.environ.get("WEBSITE_API_KEY"):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

@app.get("/stats")
async def get_stats(authorized: bool = Depends(verify_api_key)):
    guild_count = len(bot.guilds)
    user_count = sum(g.member_count for g in bot.guilds)
    uptime_seconds = (datetime.now() - bot_start_time).total_seconds()
    
    return {
        "guild_count": guild_count,
        "user_count": user_count,
        "commands_executed": commands_executed,
        "uptime_percentage": 99.9,  # Calculate from monitoring
        "shard_count": bot.shard_count or 1,
        "ping": round(bot.latency * 1000),
        "uptime_seconds": uptime_seconds
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy" if bot.is_ready() else "degraded",
        "ping": round(bot.latency * 1000)
    }

# Run with: uvicorn api:app --host 0.0.0.0 --port 3001
```

## Step 2: Website-Side - Fetch Stats

Update `/backend/server.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
BOT_API_URL = os.environ.get("BOT_API_URL", "")  # e.g., http://your-bot-server:3001
BOT_API_KEY = os.environ.get("BOT_API_KEY", "")

# Cache to avoid hammering bot
stats_cache = {"data": None, "timestamp": None}
CACHE_TTL = 60  # Cache for 1 minute

@app.get("/api/stats")
async def get_stats():
    now = datetime.now(timezone.utc)
    
    # Return cached data if fresh
    if stats_cache["data"] and stats_cache["timestamp"]:
        age = (now - stats_cache["timestamp"]).total_seconds()
        if age < CACHE_TTL:
            return stats_cache["data"]
    
    # Fetch from bot API
    if BOT_API_URL:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                headers = {"X-API-Key": BOT_API_KEY} if BOT_API_KEY else {}
                response = await client.get(f"{BOT_API_URL}/stats", headers=headers)
                response.raise_for_status()
                bot_data = response.json()
                
                stats = {
                    "servers": f"{bot_data.get('guild_count', 0):,}+",
                    "users": f"{bot_data.get('user_count', 0):,}+",
                    "commands_executed": f"{bot_data.get('commands_executed', 0):,}+",
                    "uptime": f"{bot_data.get('uptime_percentage', 99.9)}%"
                }
                
                # Update cache
                stats_cache["data"] = stats
                stats_cache["timestamp"] = now
                
                return stats
        except Exception as e:
            print(f"Failed to fetch bot stats: {e}")
    
    # Fallback to cached or default
    if stats_cache["data"]:
        return stats_cache["data"]
    
    return {
        "servers": "10,000+",
        "users": "2M+",
        "commands_executed": "50M+",
        "uptime": "99.9%"
    }

@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "dravion-website"}
```

### Environment Variables

Add to `/backend/.env`:
```env
# Bot API Connection
BOT_API_URL=http://your-bot-server:3001
BOT_API_KEY=your-secret-api-key-here
```

---

# Part 2: Service Status Monitoring

The status page shows health of your bot's services:
- **Bot Core** - Main Discord connection
- **API Gateway** - Your bot's API
- **Database** - MongoDB/PostgreSQL
- **Music Nodes** - Lavalink servers
- **Redis** - Cache layer
- **CDN** - Asset delivery

## Step 1: Bot-Side - Expose Status Endpoint

### Discord.js Complete Example

```javascript
// bot/api.js - Enhanced with status endpoint

const express = require('express');
const app = express();
const mongoose = require('mongoose'); // If using MongoDB
const Redis = require('ioredis');     // If using Redis

const { client } = require('./index.js');

// Initialize connections
const redis = new Redis(process.env.REDIS_URL);

// Service health tracking
const serviceHealth = {
    lastChecks: {},
    history: {} // Store uptime history
};

// Check all services
async function checkServices() {
    const services = [];
    
    // 1. Bot Core
    const botStart = Date.now();
    const botStatus = client.ws.status === 0 ? 'operational' : 'degraded';
    services.push({
        name: 'Bot Core',
        status: botStatus,
        latency: `${client.ws.ping}ms`,
        uptime: '99.99%' // Calculate from history
    });
    
    // 2. Database
    try {
        const dbStart = Date.now();
        await mongoose.connection.db.admin().ping();
        const dbLatency = Date.now() - dbStart;
        services.push({
            name: 'Database Cluster',
            status: 'operational',
            latency: `${dbLatency}ms`,
            uptime: '99.99%'
        });
    } catch (e) {
        services.push({
            name: 'Database Cluster',
            status: 'major',
            latency: '-',
            uptime: '99.99%'
        });
    }
    
    // 3. Redis
    try {
        const redisStart = Date.now();
        await redis.ping();
        const redisLatency = Date.now() - redisStart;
        services.push({
            name: 'Cache Layer',
            status: 'operational',
            latency: `${redisLatency}ms`,
            uptime: '99.97%'
        });
    } catch (e) {
        services.push({
            name: 'Cache Layer',
            status: 'major',
            latency: '-',
            uptime: '99.97%'
        });
    }
    
    // 4. Music Nodes (Lavalink)
    try {
        const lavalinkStart = Date.now();
        // Check your Lavalink connection
        const lavalinkStatus = client.music?.nodes?.get('main')?.connected;
        services.push({
            name: 'Music Nodes',
            status: lavalinkStatus ? 'operational' : 'degraded',
            latency: `${Date.now() - lavalinkStart}ms`,
            uptime: '99.90%'
        });
    } catch (e) {
        services.push({
            name: 'Music Nodes',
            status: 'degraded',
            latency: '-',
            uptime: '99.90%'
        });
    }
    
    // 5. API (this server itself)
    services.push({
        name: 'API Gateway',
        status: 'operational',
        latency: '5ms',
        uptime: '99.95%'
    });
    
    // 6. WebSocket Gateway
    services.push({
        name: 'WebSocket Gateway',
        status: client.ws.status === 0 ? 'operational' : 'degraded',
        latency: `${client.ws.ping}ms`,
        uptime: '99.97%'
    });
    
    return services;
}

// Status endpoint
app.get('/status', verifyApiKey, async (req, res) => {
    try {
        const services = await checkServices();
        
        // Determine overall status
        const statuses = services.map(s => s.status);
        let overall = 'operational';
        if (statuses.some(s => s === 'major')) {
            overall = 'major';
        } else if (statuses.some(s => s === 'degraded')) {
            overall = 'degraded';
        }
        
        res.json({
            overall,
            last_updated: new Date().toISOString(),
            services,
            incidents: [] // Add your incident tracking here
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check services' });
    }
});

// Stats endpoint (from Part 1)
app.get('/stats', verifyApiKey, (req, res) => {
    res.json({
        guild_count: client.guilds.cache.size,
        user_count: client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0),
        commands_executed: commandsExecuted,
        uptime_percentage: 99.9,
        ping: client.ws.ping
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

app.listen(3001, () => console.log('Bot API running on port 3001'));
```

### Discord.py Complete Example

```python
# bot/api.py - Complete with stats and status

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import aiohttp
from datetime import datetime, timezone
import os

app = FastAPI()

# Import your bot
from main import bot

# Your database/redis connections
import motor.motor_asyncio
import aioredis

mongo_client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = mongo_client[os.environ.get("DB_NAME", "dravion")]

redis = None

@app.on_event("startup")
async def startup():
    global redis
    redis = await aioredis.from_url(os.environ.get("REDIS_URL", "redis://localhost"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Stats tracking
commands_executed = 0
bot_start_time = datetime.now(timezone.utc)

def verify_api_key(x_api_key: str = Header(None)):
    if x_api_key != os.environ.get("WEBSITE_API_KEY"):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

# ============ STATS ENDPOINT ============
@app.get("/stats")
async def get_stats(authorized: bool = Depends(verify_api_key)):
    return {
        "guild_count": len(bot.guilds),
        "user_count": sum(g.member_count for g in bot.guilds),
        "commands_executed": commands_executed,
        "uptime_percentage": 99.9,
        "shard_count": bot.shard_count or 1,
        "ping": round(bot.latency * 1000)
    }

# ============ STATUS ENDPOINT ============
@app.get("/status")
async def get_status(authorized: bool = Depends(verify_api_key)):
    services = []
    
    # 1. Bot Core
    bot_status = "operational" if bot.is_ready() else "degraded"
    services.append({
        "name": "Bot Core",
        "status": bot_status,
        "latency": f"{round(bot.latency * 1000)}ms",
        "uptime": "99.99%"
    })
    
    # 2. Database
    try:
        start = datetime.now()
        await db.command("ping")
        latency = (datetime.now() - start).total_seconds() * 1000
        services.append({
            "name": "Database Cluster",
            "status": "operational",
            "latency": f"{latency:.0f}ms",
            "uptime": "99.99%"
        })
    except Exception:
        services.append({
            "name": "Database Cluster",
            "status": "major",
            "latency": "-",
            "uptime": "99.99%"
        })
    
    # 3. Redis/Cache
    try:
        start = datetime.now()
        await redis.ping()
        latency = (datetime.now() - start).total_seconds() * 1000
        services.append({
            "name": "Cache Layer",
            "status": "operational",
            "latency": f"{latency:.0f}ms",
            "uptime": "99.97%"
        })
    except Exception:
        services.append({
            "name": "Cache Layer",
            "status": "degraded",
            "latency": "-",
            "uptime": "99.97%"
        })
    
    # 4. API Gateway (self)
    services.append({
        "name": "API Gateway",
        "status": "operational",
        "latency": "5ms",
        "uptime": "99.95%"
    })
    
    # 5. WebSocket Gateway
    services.append({
        "name": "WebSocket Gateway",
        "status": "operational" if bot.is_ready() else "degraded",
        "latency": f"{round(bot.latency * 1000)}ms",
        "uptime": "99.97%"
    })
    
    # 6. Music Nodes (if applicable)
    # Add your Lavalink/Wavelink health check here
    services.append({
        "name": "Music Nodes",
        "status": "operational",
        "latency": "28ms",
        "uptime": "99.90%"
    })
    
    # Calculate overall status
    statuses = [s["status"] for s in services]
    if all(s == "operational" for s in statuses):
        overall = "operational"
    elif any(s == "major" for s in statuses):
        overall = "major"
    else:
        overall = "degraded"
    
    return {
        "overall": overall,
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "services": services,
        "incidents": []
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "ping": round(bot.latency * 1000)}
```

## Step 2: Website-Side - Fetch Status

Update `/backend/server.py` to include status fetching:

```python
# Add to your existing server.py

# Cache for status
status_cache = {"data": None, "timestamp": None}
STATUS_CACHE_TTL = 30  # 30 seconds

@app.get("/api/status")
async def get_status():
    now = datetime.now(timezone.utc)
    
    # Return cached data if fresh
    if status_cache["data"] and status_cache["timestamp"]:
        age = (now - status_cache["timestamp"]).total_seconds()
        if age < STATUS_CACHE_TTL:
            return status_cache["data"]
    
    # Fetch from bot API
    if BOT_API_URL:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                headers = {"X-API-Key": BOT_API_KEY} if BOT_API_KEY else {}
                response = await client.get(f"{BOT_API_URL}/status", headers=headers)
                response.raise_for_status()
                status_data = response.json()
                
                # Update cache
                status_cache["data"] = status_data
                status_cache["timestamp"] = now
                
                return status_data
        except Exception as e:
            print(f"Failed to fetch bot status: {e}")
    
    # Fallback to cached or default
    if status_cache["data"]:
        return status_cache["data"]
    
    # Default fallback
    return {
        "overall": "operational",
        "last_updated": now.isoformat(),
        "services": [
            {"name": "Bot Core", "status": "operational", "latency": "45ms", "uptime": "99.99%"},
            {"name": "API Gateway", "status": "operational", "latency": "32ms", "uptime": "99.95%"},
            {"name": "Database Cluster", "status": "operational", "latency": "12ms", "uptime": "99.99%"},
            {"name": "Music Nodes", "status": "operational", "latency": "28ms", "uptime": "99.90%"},
            {"name": "WebSocket Gateway", "status": "operational", "latency": "15ms", "uptime": "99.97%"},
            {"name": "Cache Layer", "status": "operational", "latency": "8ms", "uptime": "100%"}
        ],
        "incidents": []
    }
```

---

# Part 3: Database Integration

If you prefer storing stats in a shared database instead of direct API calls:

### Bot writes to database:

```javascript
// discord.js - Write stats to MongoDB every 5 minutes
const mongoose = require('mongoose');

setInterval(async () => {
    await mongoose.connection.db.collection('bot_stats').updateOne(
        { _id: 'current' },
        {
            $set: {
                guild_count: client.guilds.cache.size,
                user_count: client.guilds.cache.reduce((a, g) => a + g.memberCount, 0),
                commands_executed: commandsExecuted,
                uptime_percentage: 99.9,
                ping: client.ws.ping,
                last_updated: new Date()
            }
        },
        { upsert: true }
    );
    
    // Write service status
    const services = await checkServices();
    await mongoose.connection.db.collection('service_status').updateOne(
        { _id: 'current' },
        { $set: { services, last_updated: new Date() } },
        { upsert: true }
    );
}, 5 * 60 * 1000);
```

### Website reads from database:

```python
# server.py - Read from shared database
from motor.motor_asyncio import AsyncIOMotorClient

mongo_client = AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = mongo_client[os.environ.get("DB_NAME", "dravion")]

@app.get("/api/stats")
async def get_stats():
    doc = await db.bot_stats.find_one({"_id": "current"})
    if doc:
        return {
            "servers": f"{doc.get('guild_count', 0):,}+",
            "users": f"{doc.get('user_count', 0):,}+",
            "commands_executed": f"{doc.get('commands_executed', 0):,}+",
            "uptime": f"{doc.get('uptime_percentage', 99.9)}%"
        }
    return {"servers": "10,000+", "users": "2M+", "commands_executed": "50M+", "uptime": "99.9%"}

@app.get("/api/status")
async def get_status():
    doc = await db.service_status.find_one({"_id": "current"})
    if doc:
        return {
            "overall": calculate_overall(doc["services"]),
            "last_updated": doc["last_updated"].isoformat(),
            "services": doc["services"],
            "incidents": []
        }
    return default_status()
```

---

# Part 4: Redis Integration

For real-time, high-frequency updates:

### Bot writes to Redis:

```javascript
// discord.js - Write to Redis every 10 seconds
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

setInterval(async () => {
    // Stats
    await redis.set('bot:stats', JSON.stringify({
        guild_count: client.guilds.cache.size,
        user_count: client.guilds.cache.reduce((a, g) => a + g.memberCount, 0),
        commands_executed: commandsExecuted,
        uptime_percentage: 99.9,
        ping: client.ws.ping,
        timestamp: Date.now()
    }), 'EX', 60); // Expire in 60 seconds
    
    // Status
    const services = await checkServices();
    await redis.set('bot:status', JSON.stringify({
        overall: calculateOverall(services),
        services,
        last_updated: new Date().toISOString()
    }), 'EX', 60);
}, 10000);
```

### Website reads from Redis:

```python
# server.py
import redis
import json

r = redis.from_url(os.environ.get("REDIS_URL"))

@app.get("/api/stats")
async def get_stats():
    data = r.get("bot:stats")
    if data:
        stats = json.loads(data)
        return {
            "servers": f"{stats['guild_count']:,}+",
            "users": f"{stats['user_count']:,}+",
            "commands_executed": f"{stats['commands_executed']:,}+",
            "uptime": f"{stats['uptime_percentage']}%"
        }
    return default_stats()

@app.get("/api/status")
async def get_status():
    data = r.get("bot:status")
    if data:
        return json.loads(data)
    return default_status()
```

---

# Part 5: WebSocket Live Updates

For instant updates without polling:

### Website Backend:

```python
from fastapi import WebSocket, WebSocketDisconnect
from typing import List
import asyncio

class ConnectionManager:
    def __init__(self):
        self.connections: List[WebSocket] = []
    
    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.connections.append(ws)
    
    def disconnect(self, ws: WebSocket):
        self.connections.remove(ws)
    
    async def broadcast(self, data: dict):
        for ws in self.connections:
            try:
                await ws.send_json(data)
            except:
                pass

manager = ConnectionManager()

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Send updates every 30 seconds
            stats = await get_stats()
            status = await get_status()
            await websocket.send_json({
                "type": "update",
                "stats": stats,
                "status": status
            })
            await asyncio.sleep(30)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

### Frontend Hook:

```javascript
// frontend/src/hooks/useLiveUpdates.js
import { useState, useEffect } from 'react';

export const useLiveUpdates = () => {
    const [stats, setStats] = useState(null);
    const [status, setStatus] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const wsUrl = process.env.REACT_APP_BACKEND_URL.replace('http', 'ws');
        const ws = new WebSocket(`${wsUrl}/ws/live`);

        ws.onopen = () => setConnected(true);
        ws.onclose = () => setConnected(false);
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'update') {
                setStats(data.stats);
                setStatus(data.status);
            }
        };

        return () => ws.close();
    }, []);

    return { stats, status, connected };
};
```

---

# Complete server.py with Bot Integration

```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
from typing import List

load_dotenv()

app = FastAPI(title="Dravion Website API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
BOT_API_URL = os.environ.get("BOT_API_URL", "")
BOT_API_KEY = os.environ.get("BOT_API_KEY", "")

# Caches
stats_cache = {"data": None, "timestamp": None}
status_cache = {"data": None, "timestamp": None}
STATS_CACHE_TTL = 60
STATUS_CACHE_TTL = 30

# Default responses
DEFAULT_STATS = {
    "servers": "10,000+",
    "users": "2M+",
    "commands_executed": "50M+",
    "uptime": "99.9%"
}

DEFAULT_STATUS = {
    "overall": "operational",
    "services": [
        {"name": "Bot Core", "status": "operational", "latency": "45ms", "uptime": "99.99%"},
        {"name": "API Gateway", "status": "operational", "latency": "32ms", "uptime": "99.95%"},
        {"name": "Database Cluster", "status": "operational", "latency": "12ms", "uptime": "99.99%"},
        {"name": "Music Nodes", "status": "operational", "latency": "28ms", "uptime": "99.90%"},
        {"name": "WebSocket Gateway", "status": "operational", "latency": "15ms", "uptime": "99.97%"},
        {"name": "Cache Layer", "status": "operational", "latency": "8ms", "uptime": "100%"}
    ],
    "incidents": []
}

async def fetch_from_bot(endpoint: str):
    """Fetch data from bot API"""
    if not BOT_API_URL:
        return None
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            headers = {"X-API-Key": BOT_API_KEY} if BOT_API_KEY else {}
            response = await client.get(f"{BOT_API_URL}/{endpoint}", headers=headers)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Bot API error ({endpoint}): {e}")
        return None

@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "dravion-website"}

@app.get("/api/stats")
async def get_stats():
    now = datetime.now(timezone.utc)
    
    # Check cache
    if stats_cache["data"] and stats_cache["timestamp"]:
        if (now - stats_cache["timestamp"]).total_seconds() < STATS_CACHE_TTL:
            return stats_cache["data"]
    
    # Fetch from bot
    bot_data = await fetch_from_bot("stats")
    if bot_data:
        stats = {
            "servers": f"{bot_data.get('guild_count', 0):,}+",
            "users": f"{bot_data.get('user_count', 0):,}+",
            "commands_executed": f"{bot_data.get('commands_executed', 0):,}+",
            "uptime": f"{bot_data.get('uptime_percentage', 99.9)}%"
        }
        stats_cache["data"] = stats
        stats_cache["timestamp"] = now
        return stats
    
    return stats_cache["data"] or DEFAULT_STATS

@app.get("/api/status")
async def get_status():
    now = datetime.now(timezone.utc)
    
    # Check cache
    if status_cache["data"] and status_cache["timestamp"]:
        if (now - status_cache["timestamp"]).total_seconds() < STATUS_CACHE_TTL:
            return status_cache["data"]
    
    # Fetch from bot
    bot_data = await fetch_from_bot("status")
    if bot_data:
        bot_data["last_updated"] = now.isoformat()
        status_cache["data"] = bot_data
        status_cache["timestamp"] = now
        return bot_data
    
    # Return cached or default
    result = status_cache["data"] or DEFAULT_STATUS.copy()
    result["last_updated"] = now.isoformat()
    return result

@app.get("/api/changelog")
async def get_changelog():
    return {"releases": []}

@app.get("/api/team")
async def get_team():
    return {"members": []}

# WebSocket for live updates
class ConnectionManager:
    def __init__(self):
        self.connections: List[WebSocket] = []
    
    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.connections.append(ws)
    
    def disconnect(self, ws: WebSocket):
        if ws in self.connections:
            self.connections.remove(ws)

manager = ConnectionManager()

@app.websocket("/ws/live")
async def websocket_live(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            stats = await get_stats()
            status = await get_status()
            await websocket.send_json({"stats": stats, "status": status})
            await asyncio.sleep(30)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

---

# Environment Variables Summary

### Backend (`/backend/.env`)
```env
# Bot API Connection
BOT_API_URL=http://your-bot-server:3001
BOT_API_KEY=your-secret-api-key

# Optional: Direct database access
MONGO_URL=mongodb://localhost:27017
DB_NAME=dravion

# Optional: Redis
REDIS_URL=redis://localhost:6379
```

### Bot Side
```env
# Bot's API server
BOT_API_PORT=3001
WEBSITE_API_KEY=your-secret-api-key

# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=dravion

# Redis
REDIS_URL=redis://localhost:6379
```

---

# Testing Your Integration

```bash
# 1. Test bot's stats endpoint
curl -H "X-API-Key: your-key" http://your-bot:3001/stats

# 2. Test bot's status endpoint
curl -H "X-API-Key: your-key" http://your-bot:3001/status

# 3. Test website stats (should fetch from bot)
curl http://localhost:8001/api/stats

# 4. Test website status (should fetch from bot)
curl http://localhost:8001/api/status

# 5. Test WebSocket
npm install -g wscat
wscat -c ws://localhost:8001/ws/live
```

---

# Troubleshooting

| Issue | Solution |
|-------|----------|
| Stats show defaults | Check `BOT_API_URL` is correct and bot API is running |
| 401 Unauthorized | Verify `BOT_API_KEY` matches on both sides |
| Connection timeout | Ensure bot server is accessible from website server |
| Status always "operational" | Bot's `/status` endpoint might not be implemented |
| WebSocket disconnects | Check for firewall/proxy blocking WebSocket upgrades |

---

# Architecture Diagram

```
┌─────────────────┐         ┌─────────────────┐
│   Website       │   HTTP  │   Discord Bot   │
│   Frontend      │◄───────►│   + API Server  │
│   (React)       │         │   (Express)     │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │ /api/*                    │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│   Website       │  HTTP   │   Shared        │
│   Backend       │◄───────►│   Database      │
│   (FastAPI)     │         │   (MongoDB)     │
└─────────────────┘         └─────────────────┘
         │                           ▲
         │                           │
         └───────────────────────────┘
              (Optional direct access)
```
