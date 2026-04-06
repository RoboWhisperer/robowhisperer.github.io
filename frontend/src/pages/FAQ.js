import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, MessageCircle, ExternalLink } from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I add Dravion to my server?',
        a: 'Click the "Add to Discord" button on our website, select your server from the dropdown, and authorize the bot. Make sure you have the "Manage Server" permission on the server you want to add Dravion to.',
      },
      {
        q: 'What permissions does Dravion need?',
        a: 'Dravion requests Administrator permission for full functionality, but you can customize permissions based on which modules you plan to use. At minimum, the bot needs permissions to send messages, embed links, and manage messages.',
      },
      {
        q: 'How do I set up the bot after adding it?',
        a: 'Once added, Dravion works out of the box with default settings. You can customize settings through our dashboard or using configuration commands. Join our support server for help with advanced setup.',
      },
      {
        q: 'Is Dravion free to use?',
        a: 'Yes! Dravion is completely free to use with all 18 modules included. There are no hidden fees or premium paywalls.',
      },
    ],
  },
  {
    category: 'Features & Modules',
    questions: [
      {
        q: 'How many modules does Dravion have?',
        a: 'Dravion has 18 powerful modules: Info, Moderation, Settings, Leveling, Economy, Tickets, Games, Suggestions, Music, Social, Lookup, Integrations, Media, Server Management, Tools, Logging, AutoMod, and Welcome/Leave.',
      },
      {
        q: 'Can I disable modules I don\'t need?',
        a: 'Absolutely! You can enable or disable any module through the settings. This allows you to customize Dravion to fit your server\'s specific needs.',
      },
      {
        q: 'Does Dravion support music playback?',
        a: 'Yes! Dravion has a full-featured music module supporting YouTube, Spotify (metadata), SoundCloud, and more. Features include queue management, playlists, DJ controls, and audio filters.',
      },
      {
        q: 'How does the leveling system work?',
        a: 'Members earn XP by chatting in your server. As they level up, they can receive role rewards, appear on leaderboards, and unlock custom perks you define.',
      },
    ],
  },
  {
    category: 'Moderation & Security',
    questions: [
      {
        q: 'What moderation features does Dravion offer?',
        a: 'Dravion includes comprehensive moderation: ban, kick, mute, warn, lockdown, slowmode, purge, and more. All actions are logged and can include reasons and durations.',
      },
      {
        q: 'How does AutoMod work?',
        a: 'AutoMod uses AI-powered detection to automatically filter spam, inappropriate content, excessive mentions, and potential raids. You can customize sensitivity and whitelist trusted roles.',
      },
      {
        q: 'Can Dravion protect against raids?',
        a: 'Yes! The anti-raid system detects unusual join patterns and can automatically enable protections like verification requirements, slowmode, or lockdown.',
      },
    ],
  },
  {
    category: 'Technical & Support',
    questions: [
      {
        q: 'Is Dravion\'s uptime reliable?',
        a: 'Dravion maintains 99.9%+ uptime with redundant infrastructure. You can check real-time status on our Status page.',
      },
      {
        q: 'How do I get help or report issues?',
        a: 'Join our support server at dsc.gg/dravion for assistance. Our team and community are ready to help with any questions or issues.',
      },
      {
        q: 'Does Dravion store my data?',
        a: 'Dravion only stores necessary data for functionality (server settings, user levels, economy balances, etc.). We never sell or share your data. You can request data deletion at any time.',
      },
      {
        q: 'Can I suggest new features?',
        a: 'We love hearing from users! Join our support server and use the suggestions channel to propose new features. Popular suggestions often get implemented.',
      },
    ],
  },
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', ...FAQ_DATA.map(c => c.category)];

  const filteredFAQ = FAQ_DATA.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      (activeCategory === 'all' || activeCategory === category.category) &&
      (q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
       q.a.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  })).filter(c => c.questions.length > 0);

  return (
    <div className="faq-page" data-testid="faq-page">
      {/* Hero */}
      <section className="faq-hero">
        <div className="container">
          <motion.div
            className="faq-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="section-label">Help Center</span>
            <h1 className="page-title">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="page-subtitle">
              Find answers to common questions about Dravion
            </p>

            {/* Search */}
            <div className="faq-search" data-testid="faq-search">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="faq-categories">
        <div className="container">
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'all' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="faq-content">
        <div className="container">
          {filteredFAQ.length === 0 ? (
            <motion.div
              className="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MessageCircle size={48} />
              <h3>No questions found</h3>
              <p>Try adjusting your search or browse all categories</p>
            </motion.div>
          ) : (
            filteredFAQ.map((category, catIndex) => (
              <motion.div
                key={category.category}
                className="faq-category"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
              >
                {activeCategory === 'all' && (
                  <h2 className="category-title">{category.category}</h2>
                )}
                <div className="faq-list">
                  {category.questions.map((item, i) => {
                    const questionId = `${category.category}-${i}`;
                    const isExpanded = expandedQuestion === questionId;

                    return (
                      <motion.div
                        key={i}
                        className={`faq-item ${isExpanded ? 'expanded' : ''}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <button
                          className="faq-question"
                          onClick={() => setExpandedQuestion(isExpanded ? null : questionId)}
                          data-testid={`faq-question-${catIndex}-${i}`}
                        >
                          <span>{item.q}</span>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={20} />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              className="faq-answer"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <p>{item.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="faq-cta">
        <div className="container">
          <motion.div
            className="faq-cta-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MessageCircle size={48} className="cta-icon" />
            <h2>Still have questions?</h2>
            <p>Can't find what you're looking for? Join our support server for personalized help.</p>
            <a
              href="https://dsc.gg/dravion"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-lg"
              data-testid="faq-support-btn"
            >
              Join Support Server
              <ExternalLink size={18} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
