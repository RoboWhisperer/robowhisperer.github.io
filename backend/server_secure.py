from fastapi import FastAPI, Depends, HTTPException, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from datetime import datetime, timezone, timedelta
from jose import JWTError, jwt
import bcrypt
import os
import json
from pathlib import Path
from dotenv import load_dotenv
import shutil

load_dotenv()

app = FastAPI(title="Dravion Landing API")

# Rate Limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, lambda request, exc: {"error": "Rate limit exceeded"})
app.add_middleware(SlowAPIMiddleware)

# Security Configuration
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here-min-32-chars-long!')
ALGORITHM = os.getenv('ALGORITHM', 'HS256')
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv('ACCESS_TOKEN_EXPIRE_HOURS', 24))
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'dravion-admin')

# Paths
CONFIG_PATH = Path(__file__).parent.parent / "frontend" / "public" / "site-config.json"
BACKUP_DIR = Path(__file__).parent / "config_backups"
AUDIT_LOG_PATH = Path(__file__).parent / "audit.log"
BACKUP_DIR.mkdir(exist_ok=True)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv('ALLOWED_ORIGINS', '*').split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# ============= Utility Functions =============
def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthCredentials) -> dict:
    """Verify JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def log_audit(action: str, details: dict, ip_address: str = "unknown"):
    """Log configuration changes"""
    if os.getenv('ENABLE_AUDIT_LOG', 'true').lower() == 'true':
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "action": action,
            "ip_address": ip_address,
            "details": details
        }
        try:
            with open(AUDIT_LOG_PATH, 'a') as f:
                f.write(json.dumps(log_entry) + '\n')
        except Exception as e:
            print(f"Failed to write audit log: {e}")

def backup_config(original_path: Path, backup_dir: Path):
    """Create backup of current configuration"""
    if os.getenv('ENABLE_CONFIG_BACKUP', 'true').lower() == 'true':
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = backup_dir / f"config_backup_{timestamp}.json"
            if original_path.exists():
                shutil.copy2(original_path, backup_file)
            
            # Clean old backups
            max_versions = int(os.getenv('BACKUP_MAX_VERSIONS', 20))
            backups = sorted(backup_dir.glob("config_backup_*.json"))
            if len(backups) > max_versions:
                for backup in backups[:-max_versions]:
                    backup.unlink()
        except Exception as e:
            print(f"Failed to create backup: {e}")

# ============= Authentication Endpoints =============
@app.post("/api/auth/login")
@limiter.limit("5/minute")
async def login(password: str = Form(...), request = None):
    """Authenticate and get JWT token"""
    if not verify_password(password, hash_password(ADMIN_PASSWORD)):
        # Log failed attempt
        log_audit("AUTH_FAILED", {"reason": "Invalid password"}, getattr(request, "client", {}).host if request else "unknown")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify the password directly if env variable matches
    if password != ADMIN_PASSWORD:
        log_audit("AUTH_FAILED", {"reason": "Invalid password"}, getattr(request, "client", {}).host if request else "unknown")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": "admin"})
    log_audit("AUTH_SUCCESS", {"user": "admin"}, getattr(request, "client", {}).host if request else "unknown")
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/logout")
async def logout(credentials: HTTPAuthCredentials = Depends(security), request = None):
    """Logout (token invalidation would require token blacklist in production)"""
    log_audit("AUTH_LOGOUT", {"user": "admin"}, getattr(request, "client", {}).host if request else "unknown")
    return {"status": "logged out"}

# ============= Configuration Endpoints =============
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

# ============= Admin Config Endpoints =============
@app.get("/api/config")
async def get_config(credentials: HTTPAuthCredentials = Depends(security)):
    """Get the current site configuration (requires auth)"""
    try:
        verify_token(credentials)
        
        if CONFIG_PATH.exists():
            with open(CONFIG_PATH, 'r') as f:
                return json.load(f)
        else:
            return {"error": "Config file not found"}
    except HTTPException:
        raise
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/config")
@limiter.limit("10/minute")
async def update_config(
    config: dict,
    credentials: HTTPAuthCredentials = Depends(security),
    background_tasks: BackgroundTasks = None,
    request = None
):
    """Update the site configuration (requires auth)"""
    try:
        # Verify token
        verify_token(credentials)
        
        # Validate config is not too large (max 1MB)
        config_size = len(json.dumps(config).encode())
        if config_size > 1_000_000:
            raise HTTPException(status_code=413, detail="Configuration too large")
        
        # Create backup before updating
        if background_tasks:
            background_tasks.add_task(backup_config, CONFIG_PATH, BACKUP_DIR)
        else:
            backup_config(CONFIG_PATH, BACKUP_DIR)
        
        # Ensure the config file path exists
        CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
        
        # Write the config with proper formatting
        with open(CONFIG_PATH, 'w') as f:
            json.dump(config, f, indent=2)
        
        # Log the change
        changes_summary = {
            "keys_modified": list(config.keys()),
            "config_size": config_size
        }
        log_audit("CONFIG_UPDATED", changes_summary, getattr(request, "client", {}).host if request else "unknown")
        
        return {"status": "success", "message": "Configuration updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        log_audit("CONFIG_UPDATE_FAILED", {"error": str(e)}, getattr(request, "client", {}).host if request else "unknown")
        return {"status": "error", "message": str(e)}

@app.get("/api/config/backups")
async def list_backups(credentials: HTTPAuthCredentials = Depends(security)):
    """List available configuration backups"""
    try:
        verify_token(credentials)
        
        backups = []
        for backup_file in sorted(BACKUP_DIR.glob("config_backup_*.json"), reverse=True):
            backups.append({
                "filename": backup_file.name,
                "created": datetime.fromtimestamp(backup_file.stat().st_mtime).isoformat(),
                "size": backup_file.stat().st_size
            })
        return {"backups": backups}
    except HTTPException:
        raise
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/config/restore/{backup_name}")
async def restore_config(
    backup_name: str,
    credentials: HTTPAuthCredentials = Depends(security),
    background_tasks: BackgroundTasks = None,
    request = None
):
    """Restore configuration from a backup"""
    try:
        verify_token(credentials)
        
        backup_file = BACKUP_DIR / backup_name
        
        # Security: prevent directory traversal
        if not backup_file.exists() or backup_file.parent != BACKUP_DIR:
            raise HTTPException(status_code=404, detail="Backup not found")
        
        # Backup current config before restoring
        if background_tasks:
            background_tasks.add_task(backup_config, CONFIG_PATH, BACKUP_DIR)
        else:
            backup_config(CONFIG_PATH, BACKUP_DIR)
        
        # Restore from backup
        shutil.copy2(backup_file, CONFIG_PATH)
        
        log_audit("CONFIG_RESTORED", {"from_backup": backup_name}, getattr(request, "client", {}).host if request else "unknown")
        return {"status": "success", "message": f"Configuration restored from {backup_name}"}
    except HTTPException:
        raise
    except Exception as e:
        log_audit("CONFIG_RESTORE_FAILED", {"error": str(e)}, getattr(request, "client", {}).host if request else "unknown")
        return {"status": "error", "message": str(e)}

@app.get("/api/audit-log")
async def get_audit_log(credentials: HTTPAuthCredentials = Depends(security), limit: int = 100):
    """Get audit log entries"""
    try:
        verify_token(credentials)
        
        entries = []
        if AUDIT_LOG_PATH.exists():
            with open(AUDIT_LOG_PATH, 'r') as f:
                lines = f.readlines()
                for line in lines[-limit:]:
                    try:
                        entries.append(json.loads(line))
                    except:
                        pass
        return {"entries": entries}
    except HTTPException:
        raise
    except Exception as e:
        return {"error": str(e)}

# Health check on startup
@app.on_event("startup")
async def startup_event():
    print("Dravion Landing API Started")
    log_audit("SERVER_START", {"version": "1.0"})

@app.on_event("shutdown")
async def shutdown_event():
    log_audit("SERVER_SHUTDOWN", {})
