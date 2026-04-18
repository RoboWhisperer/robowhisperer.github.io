import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, CheckCircle, AlertCircle, Clock, Server, 
  Cpu, HardDrive, Wifi, RefreshCw, ExternalLink
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getIcon } from '../utils/iconMap';
import Card3D from '../components/Card3D';

const Status = () => {
  const { config } = useSiteConfig();
  const pageConfig = config.pages?.status || {};
  const defaultStatus = {
    overall: 'operational',
    services: [
      { name: 'Bot Core', status: 'operational', latency: '45ms', uptime: '99.99%' },
      { name: 'API Gateway', status: 'operational', latency: '32ms', uptime: '99.95%' },
      { name: 'Database Cluster', status: 'operational', latency: '12ms', uptime: '99.99%' },
      { name: 'Music Nodes', status: 'operational', latency: '28ms', uptime: '99.90%' },
      { name: 'WebSocket Gateway', status: 'operational', latency: '15ms', uptime: '99.97%' },
      { name: 'CDN / Assets', status: 'operational', latency: '8ms', uptime: '100%' },
    ],
    incidents: [],
    lastUpdated: new Date().toISOString(),
  };

  const [status, setStatus] = useState(pageConfig.initialStatus || defaultStatus);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [uptimeData, setUptimeData] = useState(
    Array.from({ length: 90 }, () => Math.random() > 0.02 ? 'up' : 'partial')
  );

  const refreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
      }));
      setIsRefreshing(false);
    }, 1000);
  };

  const uptimeConfig = pageConfig.uptime || {};
  const metricsConfig = pageConfig.metrics || [
    { icon: 'cpu', value: '23%', label: 'CPU Usage', fill: '23%' },
    { icon: 'harddrive', value: '45%', label: 'Memory Usage', fill: '45%' },
    { icon: 'activity', value: '1.2K/s', label: 'Events/sec', fill: '60%' },
  ];
  const subscribeConfig = pageConfig.subscribe || {
    title: 'Stay Updated',
    description: 'Keep your community informed with the latest status and incident alerts.',
    buttonLabel: 'Subscribe',
    buttonUrl: 'https://dsc.gg/dravion',
  };
  const sections = pageConfig.sections || {
    serviceStatus: 'Service Status',
    systemMetrics: 'System Metrics',
    recentIncidents: 'Recent Incidents',
    noIncidents: 'No Recent Incidents',
    noIncidentsMsg: 'All systems have been operating normally.',
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return '#10B981';
      case 'degraded': return '#F59E0B';
      case 'partial': return '#F59E0B';
      case 'major': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return <CheckCircle size={20} />;
      case 'degraded': return <AlertCircle size={20} />;
      default: return <Activity size={20} />;
    }
  };

  const hero = pageConfig.hero || {};

  return (
    <div className="status-page" data-testid="status-page">
      {/* Hero */}
      <section className="status-hero">
        <div className="container">
          <motion.div
            className="status-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className={`status-badge status-${status.overall}`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              {getStatusIcon(status.overall)}
              <span>
                {status.overall === 'operational'
                  ? hero.badge?.operationalText || 'All Systems Operational'
                  : hero.badge?.degradedText || 'Some Systems Experiencing Issues'}
              </span>
            </motion.div>
            <h1 className="page-title">{hero.title || 'System Status'}</h1>
            <p className="page-subtitle">
              {hero.subtitle || 'Real-time status monitoring for all Dravion services'}
            </p>
            <div className="status-last-updated">
              <Clock size={14} />
              <span>Last updated: {new Date(status.lastUpdated).toLocaleString()}</span>
              <button 
                className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
                onClick={refreshStatus}
                disabled={isRefreshing}
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Uptime Graph */}
      <section className="uptime-section">
        <div className="container">
          <div className="uptime-header">
            <h2>{uptimeConfig.title || '90-Day Uptime History'}</h2>
            <span className="uptime-percentage">{uptimeConfig.percentage || '99.95% uptime'}</span>
          </div>
          <div className="uptime-graph" data-testid="uptime-graph">
            {uptimeData.map((day, i) => (
              <motion.div
                key={i}
                className={`uptime-bar uptime-${day}`}
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ delay: i * 0.01 }}
                title={`Day ${90 - i}: ${day === 'up' ? 'Operational' : 'Partial Outage'}`}
              />
            ))}
          </div>
          <div className="uptime-legend">
            <span><span className="dot dot-up" /> Operational</span>
            <span><span className="dot dot-partial" /> Partial Outage</span>
            <span><span className="dot dot-down" /> Major Outage</span>
          </div>
        </div>
      </section>

      {/* Services Status */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">{sections.serviceStatus}</h2>
          <div className="services-grid">
            {status.services.map((service, i) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card3D className="service-card">
                  <div className="service-header">
                    <div className="service-info">
                      <Server size={20} className="service-icon" />
                      <span className="service-name">{service.name}</span>
                    </div>
                    <div 
                      className="service-status-badge"
                      style={{ '--status-color': getStatusColor(service.status) }}
                    >
                      {getStatusIcon(service.status)}
                      <span>{service.status}</span>
                    </div>
                  </div>
                  <div className="service-metrics">
                    <div className="metric">
                      <Wifi size={14} />
                      <span className="metric-label">Latency</span>
                      <span className="metric-value">{service.latency}</span>
                    </div>
                    <div className="metric">
                      <Activity size={14} />
                      <span className="metric-label">Uptime</span>
                      <span className="metric-value">{service.uptime}</span>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System Metrics */}
      <section className="metrics-section">
        <div className="container">
          <h2 className="section-title">{sections.systemMetrics}</h2>
          <div className="metrics-grid">
            {metricsConfig.map((metric, i) => {
              const Icon = getIcon(metric.icon) || Activity;
              return (
                <Card3D key={metric.label} className="metric-card">
                  <Icon size={24} className="metric-icon" />
                  <div className="metric-content">
                    <span className="metric-value">{metric.value}</span>
                    <span className="metric-label">{metric.label}</span>
                  </div>
                  <div className="metric-bar">
                    <motion.div 
                      className="metric-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: metric.fill || '50%' }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </Card3D>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="incidents-section">
        <div className="container">
          <h2 className="section-title">{sections.recentIncidents}</h2>
          <div className="incidents-list">
            {status.incidents.length === 0 ? (
              <motion.div
                className="no-incidents"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <CheckCircle size={48} />
                <h3>{sections.noIncidents}</h3>
                <p>{sections.noIncidentsMsg}</p>
              </motion.div>
            ) : (
              status.incidents.map((incident, i) => (
                <div key={i} className="incident-card">
                  {/* Incident details would go here */}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="subscribe-section">
        <div className="container">
          <motion.div
            className="subscribe-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3>{subscribeConfig.title}</h3>
            <p>{subscribeConfig.description}</p>
            <a
              href={subscribeConfig.buttonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              data-testid="status-subscribe-btn"
            >
              {subscribeConfig.buttonLabel}
              <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Status;
