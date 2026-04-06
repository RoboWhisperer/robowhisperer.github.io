# Dravion Website

<p align="center">
  <img src="https://customer-assets.emergentagent.com/job_explore-bot-1/artifacts/bcncwr7o_Dravion%20Logo.png" alt="Dravion Logo" width="120">
</p>

<h3 align="center">The Most Advanced Discord Bot Ever</h3>

<p align="center">
  A modern, feature-rich website for showcasing your Discord bot.
</p>

---

## ✨ Features

- **6 Pages** - Home, Features, Status, Changelog, FAQ, Team
- **18 Module Showcase** - Detailed feature cards with category filtering
- **Dark/Light Theme** - Toggle between themes with smooth transitions
- **3D Card Effects** - Interactive hover animations
- **Responsive Design** - Works on all devices
- **Real-time Status** - Service monitoring dashboard
- **Animated Stats** - Animated number counters
- **FAQ Search** - Searchable frequently asked questions
- **Timeline Changelog** - Version history with filtering

## 📚 Documentation

Complete documentation is available in the `/docs` folder:

- [Requirements](./docs/REQUIREMENTS.md) - System requirements
- [Installation](./docs/INSTALLATION.md) - Setup guide
- [Configuration](./docs/CONFIGURATION.md) - Environment variables
- [API Documentation](./docs/API.md) - Backend endpoints
- [Deployment](./docs/DEPLOYMENT.md) - Production deployment
- [Bot Integration](./docs/BOT_INTEGRATION.md) - **Connect your bot for live stats**
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+
- Yarn

### Installation

```bash
# Clone the repository
git clone <your-repo>
cd dravion-website

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Frontend setup
cd ../frontend
yarn install
cp .env.example .env
```

### Development

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Terminal 2 - Frontend
cd frontend
yarn start
```

Visit `http://localhost:3000`

### Production Build

```bash
cd frontend
REACT_APP_BACKEND_URL=https://api.yourdomain.com yarn build
```

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router, Framer Motion |
| Backend | FastAPI, Python |
| Styling | CSS Variables, Custom CSS |
| Icons | Lucide React |

## 📁 Project Structure

```
├── backend/
│   ├── server.py           # FastAPI application
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── App.js
│   │   └── App.css
│   ├── package.json
│   ├── .env.example
│   └── .env
└── docs/                   # Documentation
```

## 🌐 Deployment Options

- **VPS** - Nginx + PM2 (recommended)
- **Docker** - Docker Compose
- **Vercel + Railway** - Serverless
- **DigitalOcean App Platform**
- **AWS** - S3 + CloudFront + EC2

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## 🔧 Customization

### Update Bot Information

1. **Stats** - Edit `frontend/src/pages/Home.js`
2. **Modules** - Edit `frontend/src/pages/Features.js`
3. **Team** - Edit `frontend/src/pages/Team.js`
4. **FAQ** - Edit `frontend/src/pages/FAQ.js`
5. **Changelog** - Edit `frontend/src/pages/Changelog.js`

### Update Theme Colors

Edit `frontend/src/App.css`:

```css
:root {
  --color-primary: #00E5FF;    /* Your primary color */
  --color-secondary: #0051FF;  /* Your secondary color */
}
```

## 📞 Support

Join our Discord server: [dsc.gg/dravion](https://dsc.gg/dravion)

## 📄 License

This project is for personal use. Customize and deploy for your own Discord bot.

---

<p align="center">Made with ❤️ for Discord communities</p>
