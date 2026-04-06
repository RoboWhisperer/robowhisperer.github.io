from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Dravion Landing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "dravion-landing"}

@app.get("/api/stats")
async def get_stats():
    return {
        "servers": "10,000+",
        "users": "2M+",
        "commands_executed": "50M+",
        "uptime": "99.9%"
    }

@app.get("/api/status")
async def get_status():
    return {
        "overall": "operational",
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "services": [
            {"name": "Bot Core", "status": "operational", "latency": "45ms", "uptime": "99.99%"},
            {"name": "API Gateway", "status": "operational", "latency": "32ms", "uptime": "99.95%"},
            {"name": "Database Cluster", "status": "operational", "latency": "12ms", "uptime": "99.99%"},
            {"name": "Music Nodes", "status": "operational", "latency": "28ms", "uptime": "99.90%"},
            {"name": "WebSocket Gateway", "status": "operational", "latency": "15ms", "uptime": "99.97%"},
            {"name": "CDN / Assets", "status": "operational", "latency": "8ms", "uptime": "100%"},
        ],
        "incidents": []
    }

@app.get("/api/changelog")
async def get_changelog():
    return {
        "releases": [
            {
                "version": "3.5.0",
                "date": "2024-01-15",
                "type": "major",
                "title": "The Integration Update",
                "changes": [
                    {"type": "feature", "text": "Added Twitch integration"},
                    {"type": "feature", "text": "YouTube notifications"},
                    {"type": "improvement", "text": "30% faster responses"},
                ]
            }
        ]
    }

@app.get("/api/team")
async def get_team():
    return {
        "members": [
            {"name": "Alex", "role": "Founder & Lead Developer"},
            {"name": "Jordan", "role": "Backend Developer"},
            {"name": "Sam", "role": "Frontend Developer"},
            {"name": "Taylor", "role": "Community Manager"},
        ]
    }
