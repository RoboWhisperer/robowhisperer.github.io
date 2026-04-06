# Dravion Website - Self-Hosting Guide

Complete documentation for hosting the Dravion Discord Bot website on your own infrastructure.

## 📁 Documentation Index

| Document | Description |
|----------|-------------|
| [REQUIREMENTS.md](./REQUIREMENTS.md) | System requirements and dependencies |
| [INSTALLATION.md](./INSTALLATION.md) | Step-by-step installation guide |
| [CONFIGURATION.md](./CONFIGURATION.md) | Environment variables and configuration |
| [API.md](./API.md) | Backend API documentation |
| [BOT_INTEGRATION.md](./BOT_INTEGRATION.md) | **Connect your bot for real-time stats & status** |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guides |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Common issues and solutions |

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd dravion-website

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
yarn install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development servers
# Terminal 1 - Backend
cd backend && uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Terminal 2 - Frontend
cd frontend && yarn start
```

## 📂 Project Structure

```
dravion-website/
├── backend/
│   ├── server.py           # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend environment variables
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main application
│   │   ├── App.css        # Global styles
│   │   └── index.js       # Entry point
│   ├── package.json       # Node.js dependencies
│   └── .env              # Frontend environment variables
└── docs/                  # Documentation
```

## 🔧 Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **Python 3.9+** - Runtime

### Styling
- **CSS Variables** - Theming system
- **Custom CSS** - No framework dependency

## 📞 Support

For issues with the website, join our Discord: [dsc.gg/dravion](https://dsc.gg/dravion)
