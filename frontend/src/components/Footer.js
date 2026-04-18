import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Server, Heart, ExternalLink } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

const Footer = () => {
  const { config } = useSiteConfig();
  const brand = config.brand || {};
  const footer = config.footer || {};
  const footerLinks = footer.categories || {
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
  };

  return (
    <footer className="footer" data-testid="footer">
      <div className="footer-glow" />
      
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img
                src={brand.logo}
                alt={brand.name || 'Logo'}
                className="footer-logo-img"
              />
              <span className="footer-logo-text">{brand.name || 'Brand'}</span>
            </Link>
            <p className="footer-tagline">
              {brand.tagline || 'The most advanced Discord bot ever created. Transform your server today.'}
            </p>
            <a
              href={config.cta?.addBotUrl || 'https://discord.com/oauth2/authorize'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary footer-cta"
              data-testid="footer-add-bot"
            >
              {config.cta?.addBotLabel || 'Add to Discord'}
            </a>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="footer-column">
              <h4 className="footer-column-title">{category}</h4>
              <ul className="footer-links">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                      >
                        {link.name}
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <Link to={link.path} className="footer-link">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="footer-massive-text"
        >
          DRAVION
        </motion.div>

        <div className="footer-bottom">
          <p>{footer.copyright || '© 2026 Dravion. All rights reserved.'}</p>
          <p className="footer-made-with">
            {footer.madeWith || 'Made with'} <Heart size={14} className="heart-icon" /> {brand.name || 'Discord communities'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
