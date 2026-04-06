import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Bug, Zap, Star, ChevronDown, ChevronRight,
  Calendar, Tag
} from 'lucide-react';

const CHANGELOG = [
  {
    version: '3.5.0',
    date: '2024-01-15',
    type: 'major',
    title: 'The Integration Update',
    description: 'Major update bringing new integrations and improvements across all modules.',
    changes: [
      { type: 'feature', text: 'Added Twitch integration for live stream notifications' },
      { type: 'feature', text: 'New YouTube upload notification system' },
      { type: 'feature', text: 'Reddit feed integration for community servers' },
      { type: 'improvement', text: 'Improved music quality with new audio processing' },
      { type: 'improvement', text: 'Faster command response times (30% improvement)' },
      { type: 'fix', text: 'Fixed economy balance display issues' },
      { type: 'fix', text: 'Resolved ticket transcript formatting' },
    ],
  },
  {
    version: '3.4.2',
    date: '2024-01-08',
    type: 'patch',
    title: 'Bug Fixes & Stability',
    description: 'Important bug fixes and stability improvements.',
    changes: [
      { type: 'fix', text: 'Fixed leveling XP calculation bug' },
      { type: 'fix', text: 'Resolved automod false positives' },
      { type: 'fix', text: 'Fixed welcome message image rendering' },
      { type: 'improvement', text: 'Better error messages for failed commands' },
    ],
  },
  {
    version: '3.4.0',
    date: '2024-01-01',
    type: 'minor',
    title: 'New Year Update',
    description: 'Starting 2024 with exciting new features!',
    changes: [
      { type: 'feature', text: 'New giveaway system with multiple winners support' },
      { type: 'feature', text: 'Advanced poll creation with multiple choice' },
      { type: 'feature', text: 'Custom emoji reactions for suggestions' },
      { type: 'improvement', text: 'Redesigned dashboard interface' },
      { type: 'improvement', text: 'Better mobile experience for bot commands' },
    ],
  },
  {
    version: '3.3.0',
    date: '2023-12-20',
    type: 'minor',
    title: 'Holiday Update',
    description: 'Special holiday features and improvements.',
    changes: [
      { type: 'feature', text: 'Holiday-themed welcome images' },
      { type: 'feature', text: 'Special holiday economy events' },
      { type: 'feature', text: 'New trivia categories added' },
      { type: 'improvement', text: 'Improved moderation logging' },
      { type: 'fix', text: 'Fixed timezone issues in reminders' },
    ],
  },
  {
    version: '3.2.0',
    date: '2023-12-10',
    type: 'minor',
    title: 'AutoMod Overhaul',
    description: 'Complete redesign of the AutoMod system with AI improvements.',
    changes: [
      { type: 'feature', text: 'AI-powered spam detection' },
      { type: 'feature', text: 'Smart link filtering with whitelist/blacklist' },
      { type: 'feature', text: 'Anti-raid protection system' },
      { type: 'improvement', text: 'Reduced false positive rate by 60%' },
      { type: 'improvement', text: 'Faster response to violations' },
    ],
  },
];

const Changelog = () => {
  const [expandedVersion, setExpandedVersion] = useState(CHANGELOG[0].version);
  const [filter, setFilter] = useState('all');

  const getTypeIcon = (type) => {
    switch (type) {
      case 'feature': return <Sparkles size={14} />;
      case 'improvement': return <Zap size={14} />;
      case 'fix': return <Bug size={14} />;
      default: return <Star size={14} />;
    }
  };

  const getVersionBadgeClass = (type) => {
    switch (type) {
      case 'major': return 'badge-major';
      case 'minor': return 'badge-minor';
      case 'patch': return 'badge-patch';
      default: return '';
    }
  };

  const filteredChanges = (changes) => {
    if (filter === 'all') return changes;
    return changes.filter(c => c.type === filter);
  };

  return (
    <div className="changelog-page" data-testid="changelog-page">
      {/* Hero */}
      <section className="changelog-hero">
        <div className="container">
          <motion.div
            className="changelog-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="section-label">What's New</span>
            <h1 className="page-title">
              <span className="gradient-text">Changelog</span>
            </h1>
            <p className="page-subtitle">
              Stay up to date with the latest features, improvements, and bug fixes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="changelog-filters">
        <div className="container">
          <div className="filter-tabs">
            {['all', 'feature', 'improvement', 'fix'].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                data-testid={`filter-${f}`}
              >
                {f === 'all' ? 'All Changes' : (
                  <>
                    {getTypeIcon(f)}
                    {f.charAt(0).toUpperCase() + f.slice(1)}s
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Changelog Timeline */}
      <section className="changelog-timeline">
        <div className="container">
          <div className="timeline">
            {CHANGELOG.map((release, i) => (
              <motion.div
                key={release.version}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="timeline-marker">
                  <div className="timeline-dot" />
                  <div className="timeline-line" />
                </div>

                <div 
                  className={`timeline-card ${expandedVersion === release.version ? 'expanded' : ''}`}
                  onClick={() => setExpandedVersion(
                    expandedVersion === release.version ? null : release.version
                  )}
                >
                  <div className="timeline-header">
                    <div className="timeline-title-row">
                      <h3 className="timeline-version">v{release.version}</h3>
                      <span className={`version-badge ${getVersionBadgeClass(release.type)}`}>
                        {release.type}
                      </span>
                    </div>
                    <div className="timeline-meta">
                      <span className="timeline-date">
                        <Calendar size={14} />
                        {new Date(release.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <button className="expand-btn">
                        {expandedVersion === release.version 
                          ? <ChevronDown size={18} /> 
                          : <ChevronRight size={18} />
                        }
                      </button>
                    </div>
                  </div>

                  <h4 className="timeline-title">{release.title}</h4>
                  <p className="timeline-description">{release.description}</p>

                  <AnimatePresence>
                    {expandedVersion === release.version && (
                      <motion.div
                        className="timeline-changes"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ul className="changes-list">
                          {filteredChanges(release.changes).map((change, j) => (
                            <motion.li
                              key={j}
                              className={`change-item change-${change.type}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.05 }}
                            >
                              <span className="change-icon">{getTypeIcon(change.type)}</span>
                              <span className="change-tag">{change.type}</span>
                              <span className="change-text">{change.text}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stay Updated */}
      <section className="changelog-cta">
        <div className="container">
          <motion.div
            className="changelog-cta-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Never Miss an Update</h2>
            <p>Join our support server to get notified about new features and updates.</p>
            <a
              href="https://dsc.gg/dravion"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-lg"
              data-testid="changelog-cta-btn"
            >
              Join Support Server
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Changelog;
