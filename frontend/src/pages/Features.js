import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Zap, BarChart3, Music, Gamepad2, MessageSquare, Sparkles,
  Settings, Info, Ticket, Lightbulb, Users, Search, Link2, Image,
  Server, Wrench, FileText, Bot, ChevronRight, Check
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getIcon } from '../utils/iconMap';
import Card3D from '../components/Card3D';

const MODULES = [
  {
    id: 'info',
    name: 'Info',
    icon: Info,
    color: '#00E5FF',
    category: 'Utility',
    description: 'Essential information commands for your server',
    features: ['Server information', 'User profiles', 'Bot statistics', 'Invite tracking', 'Role information'],
  },
  {
    id: 'moderation',
    name: 'Moderation',
    icon: Shield,
    color: '#FF6B6B',
    category: 'Administration',
    description: 'Complete moderation toolkit for server safety',
    features: ['Ban/Kick/Mute', 'Warning system', 'Timed punishments', 'Moderation logs', 'Mass actions'],
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    color: '#7C3AED',
    category: 'Configuration',
    description: 'Customize every aspect of the bot',
    features: ['Module toggles', 'Permission management', 'Custom prefixes', 'Language settings', 'Advanced configs'],
  },
  {
    id: 'leveling',
    name: 'Leveling',
    icon: Sparkles,
    color: '#FFD700',
    category: 'Engagement',
    description: 'XP system with rewards and leaderboards',
    features: ['XP tracking', 'Level roles', 'Leaderboards', 'Custom rewards', 'XP multipliers'],
  },
  {
    id: 'economy',
    name: 'Economy',
    icon: Zap,
    color: '#10B981',
    category: 'Engagement',
    description: 'Full-featured virtual economy system',
    features: ['Virtual currency', 'Shop system', 'Daily rewards', 'Jobs & work', 'Gambling games'],
  },
  {
    id: 'tickets',
    name: 'Tickets',
    icon: Ticket,
    color: '#F59E0B',
    category: 'Support',
    description: 'Advanced support ticket system',
    features: ['Ticket creation', 'Staff management', 'Ticket transcripts', 'Categories', 'Auto-close'],
  },
  {
    id: 'games',
    name: 'Games',
    icon: Gamepad2,
    color: '#EC4899',
    category: 'Entertainment',
    description: 'Fun interactive games for your community',
    features: ['Trivia games', 'Minigames', 'Multiplayer games', 'Tournaments', 'Prizes & rewards'],
  },
  {
    id: 'suggestions',
    name: 'Suggestions',
    icon: Lightbulb,
    color: '#8B5CF6',
    category: 'Feedback',
    description: 'Community feedback and suggestion system',
    features: ['Suggestion channels', 'Voting system', 'Status updates', 'Implementation tracking', 'User notifications'],
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    color: '#06B6D4',
    category: 'Entertainment',
    description: 'High-quality music streaming',
    features: ['YouTube/Spotify', 'Queue management', 'Playlists', 'DJ controls', 'Filters & effects'],
  },
  {
    id: 'social',
    name: 'Social',
    icon: Users,
    color: '#3B82F6',
    category: 'Community',
    description: 'Social features to connect members',
    features: ['User profiles', 'Reputation system', 'Marriage/relationships', 'Achievements', 'Bio customization'],
  },
  {
    id: 'lookup',
    name: 'Lookup',
    icon: Search,
    color: '#14B8A6',
    category: 'Utility',
    description: 'Search and lookup various information',
    features: ['User lookup', 'Server lookup', 'IP lookup', 'Domain info', 'Social media'],
  },
  {
    id: 'integrations',
    name: 'Integrations',
    icon: Link2,
    color: '#6366F1',
    category: 'Extensions',
    description: 'Connect with external services',
    features: ['Twitch alerts', 'YouTube notifications', 'Reddit feeds', 'Twitter integration', 'Custom webhooks'],
  },
  {
    id: 'media',
    name: 'Media',
    icon: Image,
    color: '#F472B6',
    category: 'Fun',
    description: 'Image manipulation and media tools',
    features: ['Image effects', 'Meme generation', 'Avatar manipulation', 'GIF search', 'Screenshot tools'],
  },
  {
    id: 'server-management',
    name: 'Server Management',
    icon: Server,
    color: '#22C55E',
    category: 'Administration',
    description: 'Powerful server management tools',
    features: ['Role management', 'Channel management', 'Backup system', 'Emoji management', 'Server templates'],
  },
  {
    id: 'tools',
    name: 'Tools',
    icon: Wrench,
    color: '#EAB308',
    category: 'Utility',
    description: 'Useful utility tools',
    features: ['Calculator', 'Reminders', 'Polls', 'Giveaways', 'Timezones'],
  },
  {
    id: 'logging',
    name: 'Logging',
    icon: FileText,
    color: '#64748B',
    category: 'Administration',
    description: 'Comprehensive server logging',
    features: ['Message logs', 'Join/leave logs', 'Moderation logs', 'Voice logs', 'Role changes'],
  },
  {
    id: 'automod',
    name: 'AutoMod',
    icon: Bot,
    color: '#EF4444',
    category: 'Security',
    description: 'AI-powered automatic moderation',
    features: ['Spam detection', 'Anti-raid', 'Word filters', 'Link protection', 'Mention limits'],
  },
  {
    id: 'welcome-leave',
    name: 'Welcome/Leave',
    icon: MessageSquare,
    color: '#84CC16',
    category: 'Engagement',
    description: 'Customizable welcome and leave messages',
    features: ['Welcome messages', 'Leave messages', 'Auto-roles', 'Welcome images', 'DM greetings'],
  },
];

const CATEGORIES = ['All', ...new Set(MODULES.map(m => m.category))];

const Features = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedModule, setSelectedModule] = useState(null);
  const { config } = useSiteConfig();
  const pageConfig = config.pages?.features || {};
  const hero = pageConfig.hero || {};
  const modulesData = (pageConfig.modules && pageConfig.modules.length > 0) ? pageConfig.modules : MODULES;
  const categories = (pageConfig.categories && pageConfig.categories.length > 0)
    ? pageConfig.categories
    : ['All', ...new Set(modulesData.map((m) => m.category))];

  const ctaConfig = pageConfig.cta || {
    title: 'Ready to unlock all 18 modules?',
    description: 'Add Dravion to your server and experience the difference.',
    buttonLabel: 'Add Dravion Now',
    buttonUrl: 'https://discord.com/oauth2/authorize',
    icon: 'bot',
  };
  const CtaIcon = getIcon(ctaConfig.icon);

  const filteredModules = activeCategory === 'All'
    ? modulesData
    : modulesData.filter((m) => m.category === activeCategory);

  return (
    <div className="features-page" data-testid="features-page">
      {/* Hero */}
      <section className="features-hero">
        <div className="features-hero-bg" />
        <div className="container">
          <motion.div
            className="features-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">{hero.label || 'Complete Feature Set'}</span>
            <h1 className="page-title">
              {hero.title ? (
                hero.title.split(/<(.*?)>/).map((segment, idx) =>
                  idx % 2 === 1 ? (
                    <span key={idx} className="gradient-text">{segment}</span>
                  ) : (
                    segment
                  )
                )
              ) : (
                <><span className="gradient-text">18 Modules.</span> Unlimited Power.</>
              )}
            </h1>
            <p className="page-subtitle">
              {hero.subtitle || 'Every tool you need to build and manage the perfect Discord community, all in one beautifully designed bot.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="features-filters">
        <div className="container">
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                data-testid={`category-${cat.toLowerCase()}`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="category-count">
                    {modulesData.filter((m) => m.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="features-grid-section">
        <div className="container">
          <motion.div 
            className="modules-grid"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredModules.map((module, i) => {
                const Icon = typeof module.icon === 'string' ? getIcon(module.icon) : module.icon;

                return (
                  <motion.div
                    key={module.id || module.name}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Card3D
                      className="module-card"
                      onClick={() => setSelectedModule(module)}
                    >
                      <div
                        className="module-icon-wrap"
                        style={{ '--module-color': module.color }}
                      >
                        {Icon ? <Icon size={28} /> : null}
                      </div>
                      <div className="module-content">
                        <div className="module-header">
                          <h3 className="module-name">{module.name}</h3>
                          <span className="module-category">{module.category}</span>
                        </div>
                        <p className="module-desc">{module.description}</p>
                        <ul className="module-features-preview">
                          {module.features.slice(0, 3).map((feature, index) => (
                            <li key={index}>
                              <Check size={12} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <button className="module-expand-btn">
                          View Details <ChevronRight size={14} />
                        </button>
                      </div>
                      <div
                        className="module-glow"
                        style={{ background: `radial-gradient(circle, ${module.color}20, transparent)` }}
                      />
                    </Card3D>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Module Detail Modal */}
      <AnimatePresence>
        {selectedModule && (
          <motion.div
            className="module-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedModule(null)}
            data-testid="module-modal"
          >
            <motion.div
              className="module-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close"
                onClick={() => setSelectedModule(null)}
              >
                ×
              </button>
              
              <div className="modal-header">
                <div 
                  className="modal-icon"
                  style={{ '--module-color': selectedModule.color }}
                >
                  <selectedModule.icon size={40} />
                </div>
                <div>
                  <h2>{selectedModule.name}</h2>
                  <span className="modal-category">{selectedModule.category}</span>
                </div>
              </div>

              <p className="modal-description">{selectedModule.description}</p>

              <div className="modal-features">
                <h4>Key Features</h4>
                <ul>
                  {selectedModule.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Check size={16} style={{ color: selectedModule.color }} />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="modal-actions">
                <a
                  href="https://discord.com/oauth2/authorize"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <Bot size={18} />
                  Add Dravion
                </a>
                <a
                  href="https://dsc.gg/dravion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Get Support
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="features-cta">
        <div className="container">
          <motion.div
            className="features-cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>{ctaConfig.title}</h2>
            <p>{ctaConfig.description}</p>
            <a
              href={ctaConfig.buttonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-xl"
              data-testid="features-cta-btn"
            >
              {CtaIcon ? (
                <span className="btn-icon">
                  <CtaIcon size={24} />
                </span>
              ) : (
                <Bot size={24} />
              )}
              {ctaConfig.buttonLabel}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;
