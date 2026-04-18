const siteConfigDefault = {
  brand: {
    name: 'DRAVION',
    logo: 'https://customer-assets.emergentagent.com/job_explore-bot-1/artifacts/bcncwr7o_Dravion%20Logo.png',
    tagline: 'The most advanced Discord bot ever created. Transform your server today.',
  },
  navLinks: [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features', hasDropdown: true },
    { name: 'Status', path: '/status' },
    { name: 'Changelog', path: '/changelog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Team', path: '/team' },
  ],
  cta: {
    addBotUrl: 'https://discord.com/oauth2/authorize',
    supportUrl: 'https://dsc.gg/dravion',
    addBotLabel: 'Add Bot',
    supportLabel: 'Support',
  },
  hero: {
    badge: {
      status: 'All Systems Operational',
      linkLabel: 'View Status',
      linkPath: '/status',
    },
    titlePrefix: 'The Most',
    titleHighlight: 'Advanced',
    titleSuffix: 'Discord Bot Ever',
    subtitle: '18 powerful modules. Infinite possibilities. Transform your Discord server with moderation, economy, music, games, and so much more.',
    buttons: [
      {
        label: 'Add to Discord',
        href: 'https://discord.com/oauth2/authorize',
        variant: 'primary',
        icon: 'bot',
      },
      {
        label: 'Support Server',
        href: 'https://dsc.gg/dravion',
        variant: 'secondary',
        icon: 'external',
      },
    ],
    stats: [
      { label: 'Servers', value: '10000', suffix: '+' },
      { label: 'Users', value: '2000000', suffix: '+' },
      { label: 'Rating', value: '4.9/5', suffix: '' },
    ],
    modules: [
      { icon: 'shield', name: 'AutoMod', desc: 'AI-powered threat detection', color: '#00E5FF' },
      { icon: 'zap', name: 'Economy', desc: 'Full currency system', color: '#FFD700' },
      { icon: 'sparkles', name: 'Leveling', desc: 'XP & rewards', color: '#FF6B6B' },
      { icon: 'terminal', name: 'Moderation', desc: 'Complete mod suite', color: '#7C3AED' },
    ],
  },
  statsSection: {
    sectionLabel: 'Trusted Worldwide',
    sectionTitle: 'Numbers That Speak',
    cards: [
      { label: 'Active Servers', value: '10000+', description: '+12% this month', trend: 'positive', icon: 'server' },
      { label: 'Users Served', value: '2000000+', description: '', icon: 'users' },
      { label: 'Commands Executed', value: '50000000+', description: '', icon: 'terminal' },
      { label: 'Uptime', value: '99.9%', description: '', icon: 'activity' },
    ],
  },
  featuresPreview: {
    sectionLabel: '18 Powerful Modules',
    sectionTitle: 'Everything Your Server Needs',
    sectionSubtitle: 'From moderation to entertainment, Dravion has you covered with the most comprehensive feature set available.',
    cards: [
      { icon: 'shield', name: 'AutoMod', desc: 'AI-powered automatic moderation' },
      { icon: 'terminal', name: 'Moderation', desc: 'Complete moderation toolkit' },
      { icon: 'zap', name: 'Economy', desc: 'Full currency & shop system' },
      { icon: 'sparkles', name: 'Leveling', desc: 'XP, ranks & leaderboards' },
      { icon: 'music', name: 'Music', desc: 'High-quality music streaming' },
      { icon: 'games', name: 'Games', desc: 'Fun games & competitions' },
    ],
  },
  ctaSection: {
    title: 'Ready to Transform Your Server?',
    subtitle: 'Join thousands of thriving communities powered by Dravion.',
    logo: 'https://customer-assets.emergentagent.com/job_explore-bot-1/artifacts/bcncwr7o_Dravion%20Logo.png',
    buttons: [
      { label: 'Add Dravion Now', href: 'https://discord.com/oauth2/authorize', variant: 'primary', icon: 'bot' },
      { label: 'Join Community', href: 'https://dsc.gg/dravion', variant: 'secondary', icon: 'users' },
    ],
  },
  footer: {
    categories: {
      Navigation: [
        { name: 'Home', path: '/' },
        { name: 'Features', path: '/features' },
        { name: 'Status', path: '/status' },
        { name: 'Changelog', path: '/changelog' },
      ],
      Resources: [
        { name: 'FAQ', path: '/faq' },
        { name: 'Team', path: '/team' },
        { name: 'Support Server', path: 'https://dsc.gg/dravion', external: true },
      ],
    },
    copyright: '© 2026 Dravion. All rights reserved.',
    madeWith: 'Made with Love for Discord communities',
  },
  pages: {
    features: {
      hero: {
        label: 'Complete Feature Set',
        title: '18 Modules. Unlimited Power.',
        subtitle: 'Every tool you need to build and manage the perfect Discord community, all in one beautifully designed bot.',
      },
      categories: ['All', 'Utility', 'Administration', 'Configuration', 'Engagement', 'Support', 'Entertainment', 'Feedback', 'Community', 'Extensions', 'Fun', 'Security'],
      modules: [],
    },
    status: {
      hero: {
        title: 'System Status',
        subtitle: 'Real-time status monitoring for all Dravion services',
        badge: {
          operationalText: 'All Systems Operational',
          degradedText: 'Some Systems Experiencing Issues',
        },
      },
      uptime: {
        title: '90-Day Uptime History',
        percentage: '99.95% uptime',
      },
      metrics: [
        { icon: 'cpu', value: '23%', label: 'CPU Usage', fill: '23%' },
        { icon: 'harddrive', value: '45%', label: 'Memory Usage', fill: '45%' },
        { icon: 'activity', value: '1.2K/s', label: 'Events/sec', fill: '60%' },
      ],
      subscribe: {
        title: 'Stay Updated',
        description: 'Keep your community informed with the latest status and incident alerts.',
        buttonLabel: 'Subscribe',
        buttonUrl: 'https://dsc.gg/dravion',
      },
      sections: {
        serviceStatus: 'Service Status',
        systemMetrics: 'System Metrics',
        recentIncidents: 'Recent Incidents',
        noIncidents: 'No Recent Incidents',
        noIncidentsMsg: 'All systems have been operating normally.',
      },
    },
    changelog: {
      hero: {
        label: 'What\'s New',
        title: 'Changelog',
        subtitle: 'Stay up to date with the latest features, improvements, and bug fixes.',
      },
      filters: ['all', 'feature', 'improvement', 'fix'],
      releases: [],
      cta: {
        title: 'Never Miss an Update',
        description: 'Join our support server to get notified about new features and updates.',
        buttonLabel: 'Join Support Server',
        buttonUrl: 'https://dsc.gg/dravion',
      },
    },
    faq: {
      hero: {
        label: 'Help Center',
        title: 'Frequently Asked Questions',
        subtitle: 'Find answers to common questions about Dravion',
      },
      categories: [],
      questions: [],
      searchPlaceholder: 'Search questions...',
      categoryLabel: 'All Questions',
      noResults: {
        title: 'No questions found',
        description: 'Try adjusting your search or browse all categories',
      },
      cta: {
        title: 'Still have questions?',
        description: 'Can\'t find what you\'re looking for? Join our support server for personalized help.',
        buttonLabel: 'Join Support Server',
        buttonUrl: 'https://dsc.gg/dravion',
      },
    },
    team: {
      hero: {
        label: 'Meet the Team',
        title: 'The People Behind Dravion',
        subtitle: 'A passionate team dedicated to building the most advanced Discord bot ever.',
      },
      mission: {
        title: 'Our Mission',
        description: 'We believe every Discord server deserves access to powerful, professional-grade tools without complexity or cost barriers. Dravion was built to democratize server management, bringing enterprise-level features to communities of all sizes.',
      },
      stats: [
        { value: '2024', label: 'Founded' },
        { value: '18', label: 'Modules' },
        { value: '10K+', label: 'Servers' },
        { value: '2M+', label: 'Users' },
      ],
      members: [],
      values: [],
      join: {
        title: 'Want to Join the Team?',
        description: 'We\'re always looking for passionate individuals to help us build the future of Discord bots. Join our community to learn about opportunities.',
        buttonLabel: 'Join Our Community',
        buttonUrl: 'https://dsc.gg/dravion',
      },
    },
  },
  theme: {
    default: 'dark',
  },
};

export default siteConfigDefault;
