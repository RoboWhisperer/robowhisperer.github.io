import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ChevronDown, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSiteConfig } from '../context/SiteConfigContext';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { config } = useSiteConfig();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = config.navLinks || [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features', hasDropdown: true },
    { name: 'Status', path: '/status' },
    { name: 'Changelog', path: '/changelog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Team', path: '/team' },
  ];

  const brand = config.brand || {};
  const cta = config.cta || {};

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`nav-container ${scrolled ? 'nav-scrolled' : ''}`}
        data-testid="navigation"
      >
        <div className="nav-inner">
          <Link to="/" className="nav-logo" data-testid="nav-logo-link">
            <img
              src={brand.logo}
              alt={brand.name || 'Logo'}
              className="nav-logo-img"
            />
            <span className="nav-logo-text">{brand.name || 'Brand'}</span>
          </Link>

          <div className="nav-links-desktop">
            {navLinks.map((link) => (
              <div
                key={link.path}
                className="nav-link-wrapper"
                onMouseEnter={() => link.hasDropdown && setFeaturesOpen(true)}
                onMouseLeave={() => link.hasDropdown && setFeaturesOpen(false)}
              >
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  data-testid={`nav-${link.name.toLowerCase()}`}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={14} />}
                </Link>
              </div>
            ))}
          </div>

          <div className="nav-actions">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              data-testid="theme-toggle"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'moon' : 'sun'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>

            <a
              href={cta.supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-support-btn"
              data-testid="nav-support"
            >
              {cta.supportLabel || 'Support'}
            </a>

            <a
              href={cta.addBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary nav-cta"
              data-testid="nav-add-bot"
            >
              {cta.addBotLabel || 'Add Bot'}
            </a>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="mobile-menu-btn"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu"
            data-testid="mobile-menu"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="mobile-menu-link"
              >
                {link.name}
              </Link>
            ))}
            <a
              href={cta.supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-menu-link"
            >
              {cta.supportLabel || 'Support Server'} <ExternalLink size={14} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
