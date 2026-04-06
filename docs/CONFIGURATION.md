# Configuration Guide

## Environment Variables

### Backend (.env)

Create `/backend/.env` with the following variables:

```env
# ===========================================
# BACKEND CONFIGURATION
# ===========================================

# Server Configuration
HOST=0.0.0.0
PORT=8001

# Environment (development | production)
ENVIRONMENT=production

# CORS Origins (comma-separated for multiple)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database (Optional - if you add database features)
# MONGO_URL=mongodb://localhost:27017
# DB_NAME=dravion

# Logging Level (DEBUG | INFO | WARNING | ERROR)
LOG_LEVEL=INFO
```

### Frontend (.env)

Create `/frontend/.env` with the following variables:

```env
# ===========================================
# FRONTEND CONFIGURATION
# ===========================================

# Backend API URL (REQUIRED)
# Development:
REACT_APP_BACKEND_URL=http://localhost:8001

# Production:
# REACT_APP_BACKEND_URL=https://api.yourdomain.com

# Site Metadata (Optional)
REACT_APP_SITE_NAME=Dravion
REACT_APP_SITE_DESCRIPTION=The Most Advanced Discord Bot Ever

# Discord Links (Update with your actual links)
REACT_APP_DISCORD_INVITE=https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
REACT_APP_SUPPORT_SERVER=https://dsc.gg/dravion

# Analytics (Optional)
# REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

---

## Configuration Files

### Customizing the Bot Information

Edit `/frontend/src/pages/Home.js` to update:

```javascript
// Update stats display
const [stats, setStats] = useState({
  servers: '10000',      // Your server count
  users: '2000000',      // Your user count
  commands: '50000000',  // Commands executed
  uptime: '99.9'         // Uptime percentage
});
```

### Customizing Modules

Edit `/frontend/src/pages/Features.js` to update the modules list:

```javascript
const MODULES = [
  {
    id: 'your-module',
    name: 'Module Name',
    icon: IconComponent,
    color: '#HEX_COLOR',
    category: 'Category',
    description: 'Module description',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  // Add more modules...
];
```

### Customizing Team Members

Edit `/frontend/src/pages/Team.js`:

```javascript
const TEAM = [
  {
    name: 'Your Name',
    role: 'Your Role',
    avatar: 'https://your-avatar-url.com/image.png',
    bio: 'Your bio description',
    skills: ['Skill 1', 'Skill 2'],
    social: { twitter: '#', github: '#' },
  },
  // Add more team members...
];
```

### Customizing Changelog

Edit `/frontend/src/pages/Changelog.js`:

```javascript
const CHANGELOG = [
  {
    version: '1.0.0',
    date: '2024-01-15',
    type: 'major',  // major | minor | patch
    title: 'Release Title',
    description: 'Release description',
    changes: [
      { type: 'feature', text: 'New feature added' },
      { type: 'improvement', text: 'Something improved' },
      { type: 'fix', text: 'Bug fixed' },
    ],
  },
  // Add more releases...
];
```

### Customizing FAQ

Edit `/frontend/src/pages/FAQ.js`:

```javascript
const FAQ_DATA = [
  {
    category: 'Category Name',
    questions: [
      {
        q: 'Your question?',
        a: 'Your answer.',
      },
      // Add more Q&As...
    ],
  },
  // Add more categories...
];
```

---

## Theme Customization

Edit `/frontend/src/App.css` to customize colors:

```css
:root {
  /* Dark Theme Colors */
  --bg-primary: #03040B;        /* Main background */
  --bg-secondary: #0A0B14;      /* Card backgrounds */
  --color-primary: #00E5FF;     /* Primary accent (cyan) */
  --color-secondary: #0051FF;   /* Secondary accent (blue) */
  --text-primary: #FFFFFF;      /* Main text */
  --text-secondary: #8A8F98;    /* Muted text */
}

/* Light Theme Colors */
[data-theme="light"] {
  --bg-primary: #F8FAFC;
  --bg-secondary: #FFFFFF;
  --text-primary: #0F172A;
  --text-secondary: #475569;
}
```

---

## Updating Discord Links

### Bot Invite Link

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to OAuth2 → URL Generator
4. Select scopes: `bot`, `applications.commands`
5. Select permissions as needed
6. Copy the generated URL

Update in multiple files:
- `/frontend/src/pages/Home.js` - Hero CTA buttons
- `/frontend/src/pages/Features.js` - Features CTA
- `/frontend/src/components/Navigation.js` - Nav button
- `/frontend/src/components/Footer.js` - Footer button

Or use the environment variable:
```env
REACT_APP_DISCORD_INVITE=https://discord.com/oauth2/authorize?client_id=YOUR_ID...
```

Then reference it in code:
```javascript
<a href={process.env.REACT_APP_DISCORD_INVITE}>Add Bot</a>
```

---

## Connecting to Real Bot Stats

To display real-time statistics from your bot:

### Option 1: Backend Proxy

Update `/backend/server.py`:

```python
import httpx

@app.get("/api/stats")
async def get_stats():
    # Fetch from your bot's API
    async with httpx.AsyncClient() as client:
        response = await client.get("https://your-bot-api.com/stats")
        data = response.json()
    
    return {
        "servers": f"{data['guild_count']:,}+",
        "users": f"{data['user_count']:,}+",
        "commands_executed": f"{data['commands']:,}+",
        "uptime": f"{data['uptime']}%"
    }
```

### Option 2: Direct API Call

Update `/frontend/src/pages/Home.js`:

```javascript
useEffect(() => {
  fetch('https://your-bot-api.com/stats')
    .then(res => res.json())
    .then(data => setStats(data));
}, []);
```
