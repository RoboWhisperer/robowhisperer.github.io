# System Requirements

## Minimum Requirements

### Hardware
| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 1 core | 2+ cores |
| RAM | 512 MB | 1 GB+ |
| Storage | 500 MB | 1 GB+ |
| Network | 10 Mbps | 100 Mbps+ |

### Software

#### Required
- **Node.js**: v18.0.0 or higher
- **Python**: 3.9 or higher
- **Yarn**: 1.22.0 or higher (recommended over npm)
- **pip**: Latest version

#### Optional (for production)
- **Nginx**: 1.18+ (reverse proxy)
- **PM2**: Process manager for Node.js
- **Supervisor**: Process manager for Python
- **Docker**: 20.10+ (containerized deployment)
- **Docker Compose**: 2.0+ (multi-container setup)

## Dependency Versions

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "react-router-dom": "^6.x",
    "framer-motion": "^12.x",
    "lucide-react": "^1.x"
  }
}
```

### Backend (requirements.txt)
```
fastapi==0.109.0
uvicorn==0.27.0
python-dotenv==1.0.0
```

## Port Requirements

| Service | Default Port | Configurable |
|---------|-------------|---------------|
| Frontend (dev) | 3000 | Yes |
| Backend API | 8001 | Yes |
| Nginx (prod) | 80/443 | Yes |

## Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## Checking Your System

```bash
# Check Node.js version
node --version
# Should output: v18.x.x or higher

# Check Python version
python3 --version
# Should output: Python 3.9.x or higher

# Check Yarn version
yarn --version
# Should output: 1.22.x or higher

# Check pip version
pip --version
# Should output pip version and Python location
```

## Installing Prerequisites

### Ubuntu/Debian
```bash
# Update package list
sudo apt update

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Yarn
npm install -g yarn

# Install Python 3.9+
sudo apt install -y python3 python3-pip python3-venv
```

### macOS
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@18

# Install Yarn
brew install yarn

# Install Python
brew install python@3.11
```

### Windows
```powershell
# Using Chocolatey
choco install nodejs-lts
choco install yarn
choco install python

# Or download installers from:
# Node.js: https://nodejs.org/
# Python: https://www.python.org/downloads/
# Yarn: https://yarnpkg.com/getting-started/install
```
