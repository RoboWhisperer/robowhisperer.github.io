import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Code, Palette, Server, Users, ExternalLink,
  Globe, MessageCircle
} from 'lucide-react';
import Card3D from '../components/Card3D';

const TEAM = [
  {
    name: 'Alex',
    role: 'Founder & Lead Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=0051FF',
    bio: 'Passionate about creating tools that bring communities together.',
    skills: ['Node.js', 'Discord.js', 'System Architecture'],
    social: { twitter: '#', github: '#' },
  },
  {
    name: 'Jordan',
    role: 'Backend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan&backgroundColor=00E5FF',
    bio: 'Database wizard and API architect keeping Dravion running smoothly.',
    skills: ['Python', 'PostgreSQL', 'Redis'],
    social: { twitter: '#', github: '#' },
  },
  {
    name: 'Sam',
    role: 'Frontend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sam&backgroundColor=7C3AED',
    bio: 'Creating beautiful and intuitive interfaces for the dashboard.',
    skills: ['React', 'TypeScript', 'UI/UX'],
    social: { twitter: '#', github: '#' },
  },
  {
    name: 'Taylor',
    role: 'Community Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taylor&backgroundColor=10B981',
    bio: 'Building and nurturing our amazing community of server owners.',
    skills: ['Community Building', 'Support', 'Documentation'],
    social: { twitter: '#' },
  },
];

const VALUES = [
  {
    icon: Heart,
    title: 'Community First',
    description: 'Everything we build is designed with our users in mind. Your feedback shapes our roadmap.',
  },
  {
    icon: Code,
    title: 'Quality Code',
    description: 'We maintain high standards for performance, security, and reliability.',
  },
  {
    icon: Palette,
    title: 'Beautiful Design',
    description: 'From bot responses to our dashboard, we believe in creating delightful experiences.',
  },
  {
    icon: Server,
    title: 'Reliability',
    description: '99.9% uptime is our commitment. Your server deserves a bot that\'s always there.',
  },
];

const STATS = [
  { value: '2024', label: 'Founded' },
  { value: '18', label: 'Modules' },
  { value: '10K+', label: 'Servers' },
  { value: '2M+', label: 'Users' },
];

const Team = () => {
  return (
    <div className="team-page" data-testid="team-page">
      {/* Hero */}
      <section className="team-hero">
        <div className="container">
          <motion.div
            className="team-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="section-label">Meet the Team</span>
            <h1 className="page-title">
              The People Behind <span className="gradient-text">Dravion</span>
            </h1>
            <p className="page-subtitle">
              A passionate team dedicated to building the most advanced Discord bot ever.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="team-mission">
        <div className="container">
          <motion.div
            className="mission-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Our Mission</h2>
            <p>
              We believe every Discord server deserves access to powerful, 
              professional-grade tools without complexity or cost barriers. 
              Dravion was built to democratize server management, bringing 
              enterprise-level features to communities of all sizes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="team-stats">
        <div className="container">
          <div className="stats-row">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="stat-value gradient-text">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="team-members">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">The Team</h2>
            <p className="section-subtitle">
              Meet the talented individuals who make Dravion possible
            </p>
          </motion.div>

          <div className="team-grid">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card3D className="team-card">
                  <div className="team-card-header">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="team-avatar"
                    />
                    <div className="team-info">
                      <h3 className="team-name">{member.name}</h3>
                      <span className="team-role">{member.role}</span>
                    </div>
                  </div>
                  <p className="team-bio">{member.bio}</p>
                  <div className="team-skills">
                    {member.skills.map((skill) => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                  <div className="team-social">
                    {member.social.twitter && (
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                        <MessageCircle size={18} />
                      </a>
                    )}
                    {member.social.github && (
                      <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                        <Globe size={18} />
                      </a>
                    )}
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="team-values">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="values-grid">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                className="value-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="value-icon">
                  <value.icon size={28} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="team-join">
        <div className="container">
          <motion.div
            className="join-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Users size={48} className="join-icon" />
            <h2>Want to Join the Team?</h2>
            <p>
              We're always looking for passionate individuals to help us build 
              the future of Discord bots. Join our community to learn about opportunities.
            </p>
            <a
              href="https://dsc.gg/dravion"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-lg"
              data-testid="team-join-btn"
            >
              Join Our Community
              <ExternalLink size={18} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Team;
