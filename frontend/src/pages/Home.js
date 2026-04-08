import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot, Zap, Shield, ChevronRight, ExternalLink, Sparkles,
  Server, Users, Terminal, ArrowRight, Star, Activity
} from 'lucide-react';
import Card3D from '../components/Card3D';
import AnimatedCounter from '../components/AnimatedCounter';

const FEATURED_MODULES = [
  { icon: Shield, name: 'AutoMod', desc: 'AI-powered threat detection', color: '#00E5FF' },
  { icon: Zap, name: 'Economy', desc: 'Full currency system', color: '#FFD700' },
  { icon: Sparkles, name: 'Leveling', desc: 'XP & rewards', color: '#FF6B6B' },
  { icon: Terminal, name: 'Moderation', desc: 'Complete mod suite', color: '#7C3AED' },
];

const Home = () => {
  const [stats, setStats] = useState({
    servers: '10000',
    users: '2000000',
    commands: '50000000',
    uptime: '99.9'
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/stats`)
      .then(res => res.json())
      .then(data => {
        setStats({
          servers: data.servers?.replace(/[^0-9]/g, '') || '10000',
          users: data.users?.replace(/[^0-9]/g, '') || '2000000',
          commands: data.commands_executed?.replace(/[^0-9]/g, '') || '50000000',
          uptime: data.uptime?.replace(/[^0-9.]/g, '') || '99.9'
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="home-page" data-testid="home-page">
      {/* Hero Section */}
      <section className="hero-section" data-testid="hero-section">
        <div className="hero-bg-gradient" />
        <div className="hero-grid-pattern" />
        
        <div className="container hero-container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Activity size={14} />
              <span>All Systems Operational</span>
              <Link to="/status" className="hero-badge-link">
                View Status <ChevronRight size={12} />
              </Link>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The Most
              <span className="hero-title-gradient"> Advanced </span>
              Discord Bot Ever
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              18 powerful modules. Infinite possibilities. Transform your Discord server 
              with moderation, economy, music, games, and so much more.
            </motion.p>

            <motion.div
              className="hero-cta-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a
                href="https://discord.com/oauth2/authorize"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-lg hero-primary-btn"
                data-testid="hero-add-bot"
              >
                <Bot size={20} />
                Add to Discord
                <span className="btn-shine" />
              </a>
              <a
                href="https://dsc.gg/dravion"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary btn-lg"
                data-testid="hero-support"
              >
                Support Server
                <ExternalLink size={16} />
              </a>
            </motion.div>

            <motion.div
              className="hero-stats-mini"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="hero-stat-item">
                <Server size={16} />
                <span><AnimatedCounter end={stats.servers} suffix="+" /> Servers</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <Users size={16} />
                <span><AnimatedCounter end={stats.users} suffix="+" /> Users</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <Star size={16} />
                <span>4.9/5 Rating</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="hero-3d-card">
              <div className="hero-bot-preview">
                <img
                  src="https://customer-assets.emergentagent.com/job_explore-bot-1/artifacts/bcncwr7o_Dravion%20Logo.png"
                  alt="Dravion Bot"
                  className="hero-bot-logo"
                />
                <div className="hero-bot-info">
                  <h3>Dravion</h3>
                  <p>Online • 18 Modules Active</p>
                </div>
              </div>
              <div className="hero-modules-preview">
                {FEATURED_MODULES.map((mod, i) => (
                  <motion.div
                    key={mod.name}
                    className="hero-module-chip"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    style={{ '--module-color': mod.color }}
                  >
                    <mod.icon size={14} />
                    <span>{mod.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="hero-glow-orb hero-glow-1" />
            <div className="hero-glow-orb hero-glow-2" />
          </motion.div>
        </div>
      </section>

      {/* Stats Dashboard Section */}
      <section className="stats-section" data-testid="stats-section">
        <div className="container">
          <motion.div
            className="stats-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">Trusted Worldwide</span>
            <h2 className="section-title">
              Numbers That <span className="gradient-text">Speak</span>
            </h2>
          </motion.div>

          <div className="stats-dashboard">
            <Card3D className="stat-card stat-card-large">
              <div className="stat-icon-wrap stat-icon-servers">
                <Server size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  <AnimatedCounter end={stats.servers} suffix="+" />
                </div>
                <div className="stat-label">Active Servers</div>
                <div className="stat-trend positive">
                  <ArrowRight size={14} className="trend-up" />
                  +12% this month
                </div>
              </div>
              <div className="stat-graph">
                <svg viewBox="0 0 100 40" className="stat-sparkline">
                  <path d="M0,35 L10,30 L20,32 L30,25 L40,28 L50,20 L60,22 L70,15 L80,18 L90,10 L100,5" 
                    fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </Card3D>

            <Card3D className="stat-card">
              <div className="stat-icon-wrap stat-icon-users">
                <Users size={28} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  <AnimatedCounter end={stats.users} suffix="+" />
                </div>
                <div className="stat-label">Users Served</div>
              </div>
            </Card3D>

            <Card3D className="stat-card">
              <div className="stat-icon-wrap stat-icon-commands">
                <Terminal size={28} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  <AnimatedCounter end={stats.commands} suffix="+" />
                </div>
                <div className="stat-label">Commands Executed</div>
              </div>
            </Card3D>

            <Card3D className="stat-card">
              <div className="stat-icon-wrap stat-icon-uptime">
                <Activity size={28} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.uptime}%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </Card3D>
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="features-preview-section" data-testid="features-preview">
        <div className="container">
          <motion.div
            className="features-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">18 Powerful Modules</span>
            <h2 className="section-title">
              Everything Your Server <span className="gradient-text">Needs</span>
            </h2>
            <p className="section-subtitle">
              From moderation to entertainment, Dravion has you covered with the most comprehensive feature set available.
            </p>
          </motion.div>

          <div className="features-grid-preview">
            {[
              { icon: Shield, name: 'AutoMod', desc: 'AI-powered automatic moderation' },
              { icon: Terminal, name: 'Moderation', desc: 'Complete moderation toolkit' },
              { icon: Zap, name: 'Economy', desc: 'Full currency & shop system' },
              { icon: Sparkles, name: 'Leveling', desc: 'XP, ranks & leaderboards' },
              { icon: '🎵', name: 'Music', desc: 'High-quality music streaming' },
              { icon: '🎮', name: 'Games', desc: 'Fun games & competitions' },
            ].map((feature, i) => (
              <motion.div
                key={feature.name}
                className="feature-preview-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="feature-icon-wrap">
                  {typeof feature.icon === 'string' ? (
                    <span className="feature-emoji">{feature.icon}</span>
                  ) : (
                    <feature.icon size={24} />
                  )}
                </div>
                <h3>{feature.name}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="features-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/features" className="btn-primary btn-lg" data-testid="view-all-features">
              Explore All 18 Modules
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" data-testid="cta-section">
        <div className="cta-bg-gradient" />
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <motion.img
              src="https://customer-assets.emergentagent.com/job_explore-bot-1/artifacts/bcncwr7o_Dravion%20Logo.png"
              alt="Dravion"
              className="cta-logo"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
            />
            <h2 className="cta-title">
              Ready to <span className="gradient-text">Transform</span> Your Server?
            </h2>
            <p className="cta-subtitle">
              Join thousands of thriving communities powered by Dravion.
            </p>
            <div className="cta-buttons">
              <a
                href="https://discord.com/oauth2/authorize"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-xl"
                data-testid="cta-add-bot"
              >
                <Bot size={24} />
                Add Dravion Now
              </a>
              <a
                href="https://dsc.gg/dravion"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary btn-xl"
                data-testid="cta-support"
              >
                <Users size={24} />
                Join Community
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
