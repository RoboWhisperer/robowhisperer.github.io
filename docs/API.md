# API Documentation

## Base URL

- **Development:** `http://localhost:8001`
- **Production:** `https://api.yourdomain.com`

All endpoints are prefixed with `/api`.

---

## Endpoints

### Health Check

```http
GET /api/health
```

**Description:** Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "service": "dravion-landing"
}
```

**Status Codes:**
- `200 OK` - Service is healthy
- `500 Internal Server Error` - Service issue

---

### Get Statistics

```http
GET /api/stats
```

**Description:** Get bot statistics for display on the website.

**Response:**
```json
{
  "servers": "10,000+",
  "users": "2M+",
  "commands_executed": "50M+",
  "uptime": "99.9%"
}
```

**Status Codes:**
- `200 OK` - Success

---

### Get Service Status

```http
GET /api/status
```

**Description:** Get current status of all bot services.

**Response:**
```json
{
  "overall": "operational",
  "last_updated": "2024-01-15T12:00:00Z",
  "services": [
    {
      "name": "Bot Core",
      "status": "operational",
      "latency": "45ms",
      "uptime": "99.99%"
    },
    {
      "name": "API Gateway",
      "status": "operational",
      "latency": "32ms",
      "uptime": "99.95%"
    },
    {
      "name": "Database Cluster",
      "status": "operational",
      "latency": "12ms",
      "uptime": "99.99%"
    },
    {
      "name": "Music Nodes",
      "status": "operational",
      "latency": "28ms",
      "uptime": "99.90%"
    },
    {
      "name": "WebSocket Gateway",
      "status": "operational",
      "latency": "15ms",
      "uptime": "99.97%"
    },
    {
      "name": "CDN / Assets",
      "status": "operational",
      "latency": "8ms",
      "uptime": "100%"
    }
  ],
  "incidents": []
}
```

**Service Status Values:**
- `operational` - Service is working normally
- `degraded` - Service is experiencing issues but functional
- `partial` - Partial outage
- `major` - Major outage

---

### Get Changelog

```http
GET /api/changelog
```

**Description:** Get version history and release notes.

**Response:**
```json
{
  "releases": [
    {
      "version": "3.5.0",
      "date": "2024-01-15",
      "type": "major",
      "title": "The Integration Update",
      "changes": [
        { "type": "feature", "text": "Added Twitch integration" },
        { "type": "feature", "text": "YouTube notifications" },
        { "type": "improvement", "text": "30% faster responses" }
      ]
    }
  ]
}
```

**Change Types:**
- `feature` - New feature
- `improvement` - Enhancement to existing feature
- `fix` - Bug fix

**Release Types:**
- `major` - Major release (x.0.0)
- `minor` - Minor release (0.x.0)
- `patch` - Patch release (0.0.x)

---

### Get Team

```http
GET /api/team
```

**Description:** Get team member information.

**Response:**
```json
{
  "members": [
    {
      "name": "Alex",
      "role": "Founder & Lead Developer"
    },
    {
      "name": "Jordan",
      "role": "Backend Developer"
    },
    {
      "name": "Sam",
      "role": "Frontend Developer"
    },
    {
      "name": "Taylor",
      "role": "Community Manager"
    }
  ]
}
```

---

## Adding Custom Endpoints

To add new API endpoints, edit `/backend/server.py`:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Define response model
class CustomResponse(BaseModel):
    data: str
    success: bool

# Add new endpoint
@app.get("/api/custom", response_model=CustomResponse)
async def custom_endpoint():
    return {
        "data": "Your custom data",
        "success": True
    }

# POST endpoint example
class ContactForm(BaseModel):
    name: str
    email: str
    message: str

@app.post("/api/contact")
async def submit_contact(form: ContactForm):
    # Process the form
    return {"status": "received"}
```

---

## CORS Configuration

The API includes CORS middleware. Configure allowed origins in `server.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://yourdomain.com",
        "https://www.yourdomain.com",
        "http://localhost:3000",  # Development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

---

## Rate Limiting (Optional)

To add rate limiting, install `slowapi`:

```bash
pip install slowapi
```

Update `server.py`:

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/api/stats")
@limiter.limit("30/minute")
async def get_stats(request: Request):
    return {...}
```

---

## Interactive API Documentation

FastAPI automatically generates interactive documentation:

- **Swagger UI:** `http://localhost:8001/docs`
- **ReDoc:** `http://localhost:8001/redoc`
- **OpenAPI JSON:** `http://localhost:8001/openapi.json`
