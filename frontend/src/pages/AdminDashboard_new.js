import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, ChevronDown, ChevronRight, Plus, Trash2, Eye, EyeOff, LogOut, Download, Upload, History } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { config, loaded } = useSiteConfig();
  const [editConfig, setEditConfig] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [authError, setAuthError] = useState('');
  const [backups, setBackups] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [showAudit, setShowAudit] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'backups', 'audit'
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Load token from storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      setToken(storedToken);
      loadConfig(storedToken);
      loadBackups(storedToken);
    }
  }, []);

  // Load config when token changes
  useEffect(() => {
    if (loaded && config && token) {
      setEditConfig(JSON.parse(JSON.stringify(config)));
    }
  }, [loaded, config, token]);

  const loadConfig = async (authToken) => {
    try {
      const response = await fetch('/api/config', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to load config');
      // Config will be loaded via context
    } catch (error) {
      setAuthError('Session expired. Please login again.');
      handleLogout();
    }
  };

  const loadBackups = async (authToken) => {
    try {
      const response = await fetch('/api/config/backups', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBackups(data.backups || []);
      }
    } catch (error) {
      console.error('Failed to load backups:', error);
    }
  };

  const loadAuditLog = async (authToken) => {
    try {
      const response = await fetch('/api/audit-log?limit=50', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.entries || []);
      }
    } catch (error) {
      console.error('Failed to load audit log:', error);
    }
  };

  const handleAuthenticate = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');
    
    try {
      const formData = new FormData();
      formData.append('password', password);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        setAuthError('Invalid password');
        setPassword('');
        setIsLoggingIn(false);
        return;
      }

      const data = await response.json();
      const newToken = data.access_token;
      
      // Store token securely
      localStorage.setItem('admin_token', newToken);
      setToken(newToken);
      setPassword('');
      setSaveMessage('Authenticated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setAuthError('Authentication failed: ' + error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    localStorage.removeItem('admin_token');
    setToken(null);
    setEditConfig(null);
    setSaveMessage('');
    setShowAudit(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editConfig),
      });

      if (response.ok) {
        setSaveMessage('✓ Configuration saved successfully!');
        loadBackups(token);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const error = await response.json();
        setSaveMessage('✗ Failed to save: ' + (error.detail || error.message || 'Unknown error'));
      }
    } catch (error) {
      setSaveMessage('✗ Error saving configuration: ' + error.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure? This will discard all unsaved changes.')) {
      setEditConfig(JSON.parse(JSON.stringify(config)));
    }
  };

  const handleRestoreBackup = async (backupName) => {
    if (!window.confirm(`Restore from ${backupName}?`)) return;

    try {
      const response = await fetch(`/api/config/restore/${backupName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSaveMessage('✓ Configuration restored successfully!');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setSaveMessage('✗ Failed to restore backup');
      }
    } catch (error) {
      setSaveMessage('✗ Error restoring backup: ' + error.message);
    }
  };

  const exportConfig = () => {
    const dataStr = JSON.stringify(editConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `site-config-${new Date().toISOString()}.json`;
    link.click();
  };

  const importConfig = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        setEditConfig(imported);
        setSaveMessage('✓ Configuration imported successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } catch (error) {
        setSaveMessage('✗ Invalid JSON file: ' + error.message);
        setTimeout(() => setSaveMessage(''), 5000);
      }
    };
    reader.readAsText(file);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateValue = (path, value) => {
    const keys = path.split('.');
    const newConfig = JSON.parse(JSON.stringify(editConfig));
    let current = newConfig;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    setEditConfig(newConfig);
  };

  const addArrayItem = (path) => {
    const keys = path.split('.');
    const newConfig = JSON.parse(JSON.stringify(editConfig));
    let current = newConfig;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    const arr = current[keys[keys.length - 1]];
    if (Array.isArray(arr)) {
      if (arr.length > 0 && typeof arr[0] === 'object') {
        arr.push(JSON.parse(JSON.stringify(arr[0])));
      } else {
        arr.push('');
      }
      setEditConfig(newConfig);
    }
  };

  const removeArrayItem = (path, index) => {
    const keys = path.split('.');
    const newConfig = JSON.parse(JSON.stringify(editConfig));
    let current = newConfig;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    const arr = current[keys[keys.length - 1]];
    if (Array.isArray(arr)) {
      arr.splice(index, 1);
      setEditConfig(newConfig);
    }
  };

  // Login UI
  if (!token) {
    return (
      <div className="admin-login">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h1>🔐 Admin Dashboard</h1>
          <p className="subtitle">Secure configuration management</p>
          <form onSubmit={handleAuthenticate}>
            <div className="form-group">
              <label>Admin Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                  disabled={isLoggingIn}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoggingIn}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={isLoggingIn || !password}>
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {authError && <div className="message">{authError}</div>}
          {saveMessage && <div className={`message ${saveMessage.includes('✓') ? 'success' : ''}`}>{saveMessage}</div>}
          <div className="hint">
            <small>Set <code>ADMIN_PASSWORD</code> in backend .env for security</small>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!editConfig) {
    return <div className="admin-loading">Loading configuration...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <motion.div
          className="header-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>🎛️ Configuration Dashboard</h1>
          <p>Manage your site configuration securely</p>
        </motion.div>
        <div className="header-actions">
          {saveMessage && (
            <div className={`message ${saveMessage.includes('✓') ? 'success' : ''}`}>
              {saveMessage}
            </div>
          )}
          <button className="btn-secondary" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveTab('editor')}
        >
          Editor
        </button>
        <button
          className={`tab-button ${activeTab === 'backups' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('backups');
            loadBackups(token);
          }}
        >
          <History size={16} /> Backups
        </button>
        <button
          className={`tab-button ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('audit');
            loadAuditLog(token);
          }}
        >
          Audit Log
        </button>
      </div>

      {activeTab === 'editor' && (
        <>
          <div className="admin-toolbar">
            <button className="btn-secondary" onClick={handleReset} disabled={isSaving}>
              Reset
            </button>
            <label className="btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
              <Upload size={18} style={{ marginRight: '0.5rem' }} />
              Import
              <input type="file" accept=".json" onChange={importConfig} style={{ display: 'none' }} />
            </label>
            <button className="btn-secondary" onClick={exportConfig}>
              <Download size={18} /> Export
            </button>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={isSaving}
              style={{ marginLeft: 'auto' }}
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="admin-content">
            <ConfigEditor
              config={editConfig}
              updateValue={updateValue}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          </div>
        </>
      )}

      {activeTab === 'backups' && (
        <div className="admin-content">
          <h3>Configuration Backups</h3>
          {backups.length === 0 ? (
            <p style={{ color: 'rgba(226, 232, 240, 0.7)' }}>No backups available</p>
          ) : (
            <div className="backup-list">
              {backups.map((backup) => (
                <div key={backup.filename} className="backup-item">
                  <div>
                    <strong>{backup.filename}</strong>
                    <br />
                    <small>Created: {new Date(backup.created).toLocaleString()}</small>
                    <br />
                    <small>Size: {(backup.size / 1024).toFixed(2)} KB</small>
                  </div>
                  <button
                    className="btn-secondary"
                    onClick={() => handleRestoreBackup(backup.filename)}
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="admin-content">
          <h3>Audit Log</h3>
          {auditLogs.length === 0 ? (
            <p style={{ color: 'rgba(226, 232, 240, 0.7)' }}>No audit entries</p>
          ) : (
            <div className="audit-list">
              {auditLogs.reverse().map((entry, idx) => (
                <div key={idx} className="audit-item">
                  <div>
                    <strong>{entry.action}</strong> - {new Date(entry.timestamp).toLocaleString()}
                    <br />
                    <small>IP: {entry.ip_address}</small>
                    <br />
                    <small style={{ color: 'rgba(226, 232, 240, 0.5)' }}>
                      {JSON.stringify(entry.details)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="admin-footer">
        <small>🔒 All changes are backed up and audited. Login sessions expire after 24 hours.</small>
      </div>
    </div>
  );
};

const ConfigEditor = ({ config, updateValue, expandedSections, toggleSection, addArrayItem, removeArrayItem }) => {
  return (
    <div className="config-editor">
      {Object.entries(config).map(([key, value]) => (
        <ConfigField
          key={key}
          fieldKey={key}
          value={value}
          path={key}
          updateValue={updateValue}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
        />
      ))}
    </div>
  );
};

const ConfigField = ({
  fieldKey,
  value,
  path,
  updateValue,
  expandedSections,
  toggleSection,
  addArrayItem,
  removeArrayItem,
}) => {
  if (value === null || value === undefined) {
    return null;
  }

  const isExpanded = expandedSections[path];

  // Object (not array)
  if (typeof value === 'object' && !Array.isArray(value)) {
    return (
      <div className="config-section">
        <button className="section-toggle" onClick={() => toggleSection(path)}>
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <span className="section-title">{formatKey(fieldKey)}</span>
        </button>
        {isExpanded && (
          <div className="section-content">
            <div className="config-editor">
              {Object.entries(value).map(([k, v]) => (
                <ConfigField
                  key={k}
                  fieldKey={k}
                  value={v}
                  path={`${path}.${k}`}
                  updateValue={updateValue}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Array
  if (Array.isArray(value)) {
    return (
      <div className="config-section">
        <button className="section-toggle" onClick={() => toggleSection(path)}>
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <span className="section-title">
            {formatKey(fieldKey)} <span className="array-count">({value.length})</span>
          </span>
        </button>
        {isExpanded && (
          <div className="section-content array-container">
            {value.map((item, index) => {
              const itemPath = `${path}[${index}]`;
              const isObject = typeof item === 'object' && item !== null;

              return (
                <div key={index} className="array-item">
                  <div className="array-item-header">
                    <span>{isObject ? `Item ${index + 1}` : `"${item}"`}</span>
                    <button
                      className="btn-remove"
                      onClick={() => removeArrayItem(path, index)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {isObject ? (
                    <div className="object-fields">
                      {Object.entries(item).map(([k, v]) => (
                        <ConfigField
                          key={k}
                          fieldKey={k}
                          value={v}
                          path={`${itemPath}.${k}`}
                          updateValue={updateValue}
                          expandedSections={expandedSections}
                          toggleSection={toggleSection}
                          addArrayItem={addArrayItem}
                          removeArrayItem={removeArrayItem}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="form-group compact">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const arr = [...value];
                          arr[index] = e.target.value;
                          updateValue(path, arr);
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            <button className="btn-add-item" onClick={() => addArrayItem(path)}>
              <Plus size={16} /> Add Item
            </button>
          </div>
        )}
      </div>
    );
  }

  // Primitive value
  return (
    <div className="form-group">
      <label>{formatKey(fieldKey)}</label>
      <input
        type={typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'checkbox' : 'text'}
        value={typeof value === 'boolean' ? '' : value === null ? '' : value}
        onChange={(e) => {
          let newValue = e.target.value;
          if (typeof value === 'number') newValue = parseInt(newValue) || 0;
          if (typeof value === 'boolean') newValue = e.target.checked;
          updateValue(path, newValue);
        }}
        checked={typeof value === 'boolean' ? value : undefined}
      />
    </div>
  );
};

const formatKey = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/(_|-)/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();
};

export default AdminDashboard;
