import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, ChevronDown, ChevronRight, Plus, Trash2, Eye, EyeOff, LogOut, Download, Upload, History, Search, Palette, FileText, Settings, Shield, Zap } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'backups', 'audit', 'templates', 'security'
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Load token from storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      setToken(storedToken);
      loadConfig(storedToken);
      loadBackups(storedToken);
      loadTemplates(storedToken);
    }
  }, []);

  // Load config when token changes
  useEffect(() => {
    if (loaded && config && token) {
      setEditConfig(JSON.parse(JSON.stringify(config)));
    }
  }, [loaded, config, token]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (editConfig && token) {
      const timer = setInterval(() => {
        localStorage.setItem('config_draft', JSON.stringify(editConfig));
      }, 30000);
      return () => clearInterval(timer);
    }
  }, [editConfig, token]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('config_draft');
    if (draft && !editConfig) {
      try {
        setEditConfig(JSON.parse(draft));
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  const loadConfig = async (authToken) => {
    try {
      const response = await fetch('/api/config', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error('Failed to load config');
      }
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

  const loadTemplates = async (authToken) => {
    try {
      const response = await fetch('/api/config/templates', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
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
        if (response.status === 429) {
          setAuthError('Too many login attempts. Please wait before trying again.');
        } else {
          setAuthError('Invalid password');
        }
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

      // Load initial data
      loadBackups(newToken);
      loadTemplates(newToken);

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
    localStorage.removeItem('config_draft');
    setToken(null);
    setEditConfig(null);
    setSaveMessage('');
    setShowAudit(false);
    setValidationErrors([]);
  };

  const validateConfig = (config) => {
    const errors = [];

    // Basic validation rules
    if (!config.brand?.name) errors.push('Brand name is required');
    if (!config.brand?.tagline) errors.push('Brand tagline is required');
    if (!config.hero?.title) errors.push('Hero title is required');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (config.contact?.email && !emailRegex.test(config.contact.email)) {
      errors.push('Invalid contact email format');
    }

    // URL validation
    const urlRegex = /^https?:\/\/.+/;
    if (config.social?.github && !urlRegex.test(config.social.github)) {
      errors.push('Invalid GitHub URL format');
    }
    if (config.social?.discord && !urlRegex.test(config.social.discord)) {
      errors.push('Invalid Discord URL format');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSave = async () => {
    // Validate before saving
    if (!validateConfig(editConfig)) {
      setSaveMessage('✗ Validation failed. Please fix errors before saving.');
      setTimeout(() => setSaveMessage(''), 5000);
      return;
    }

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
        localStorage.removeItem('config_draft'); // Clear draft after successful save
        loadBackups(token);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const error = await response.json();
        if (response.status === 413) {
          setSaveMessage('✗ Configuration too large. Please reduce content size.');
        } else if (response.status === 429) {
          setSaveMessage('✗ Too many requests. Please wait before saving again.');
        } else {
          setSaveMessage('✗ Failed to save: ' + (error.detail || error.message || 'Unknown error'));
        }
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
      localStorage.removeItem('config_draft');
      setValidationErrors([]);
    }
  };

  const handleRestoreBackup = async (backupName) => {
    if (!window.confirm(`Restore from ${backupName}? This will overwrite current configuration.`)) return;

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
        const error = await response.json();
        setSaveMessage('✗ Failed to restore backup: ' + (error.message || 'Unknown error'));
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
    link.download = `site-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (validateConfig(imported)) {
          setEditConfig(imported);
          setSaveMessage('✓ Configuration imported successfully!');
          setTimeout(() => setSaveMessage(''), 3000);
        } else {
          setSaveMessage('✗ Imported configuration has validation errors.');
          setTimeout(() => setSaveMessage(''), 5000);
        }
      } catch (error) {
        setSaveMessage('✗ Invalid JSON file: ' + error.message);
        setTimeout(() => setSaveMessage(''), 5000);
      }
    };
    reader.readAsText(file);
  };

  const applyTemplate = (templateName) => {
    if (!window.confirm(`Apply template "${templateName}"? This will overwrite current configuration.`)) return;

    const template = templates.find(t => t.name === templateName);
    if (template) {
      setEditConfig(JSON.parse(JSON.stringify(template.config)));
      setSaveMessage(`✓ Template "${templateName}" applied!`);
      setTimeout(() => setSaveMessage(''), 3000);
    }
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

    // Re-validate on change
    validateConfig(newConfig);
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
      validateConfig(newConfig);
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
      validateConfig(newConfig);
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
            <small>🔒 Rate limited to 5 attempts per minute</small>
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
          <button
            className="btn-secondary"
            onClick={() => setPreviewMode(!previewMode)}
            title={previewMode ? 'Exit Preview' : 'Preview Changes'}
          >
            <Eye size={18} />
          </button>
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
          <Settings size={16} /> Editor
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
          <Shield size={16} /> Audit Log
        </button>
        <button
          className={`tab-button ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('templates');
            loadTemplates(token);
          }}
        >
          <FileText size={16} /> Templates
        </button>
      </div>

      {activeTab === 'editor' && (
        <>
          <div className="admin-toolbar">
            <div className="search-container">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search configuration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
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
              disabled={isSaving || validationErrors.length > 0}
              style={{ marginLeft: 'auto' }}
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {validationErrors.length > 0 && (
            <div className="validation-errors">
              <h4>⚠️ Validation Errors:</h4>
              <ul>
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="admin-content">
            <ConfigEditor
              config={editConfig}
              updateValue={updateValue}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              searchTerm={searchTerm}
            />
          </div>
        </>
      )}

      {activeTab === 'backups' && (
        <div className="admin-content">
          <h3>Configuration Backups</h3>
          <p style={{ color: 'rgba(226, 232, 240, 0.7)', marginBottom: '1rem' }}>
            Automatic backups are created before each save. Maximum 20 versions kept.
          </p>
          {backups.length === 0 ? (
            <p style={{ color: 'rgba(226, 232, 240, 0.7)' }}>No backups available</p>
          ) : (
            <div className="backup-list">
              {backups.map((backup) => (
                <div key={backup.filename} className="backup-item">
                  <div>
                    <strong>{backup.filename.replace('config_backup_', '').replace('.json', '').replace('_', ' ')}</strong>
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
          <p style={{ color: 'rgba(226, 232, 240, 0.7)', marginBottom: '1rem' }}>
            All configuration changes and authentication events are logged.
          </p>
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

      {activeTab === 'templates' && (
        <div className="admin-content">
          <h3>Configuration Templates</h3>
          <p style={{ color: 'rgba(226, 232, 240, 0.7)', marginBottom: '1rem' }}>
            Apply pre-configured templates to quickly set up your site.
          </p>
          {templates.length === 0 ? (
            <p style={{ color: 'rgba(226, 232, 240, 0.7)' }}>No templates available</p>
          ) : (
            <div className="template-list">
              {templates.map((template) => (
                <div key={template.name} className="template-item">
                  <div>
                    <strong>{template.name}</strong>
                    <br />
                    <small>{template.description}</small>
                  </div>
                  <button
                    className="btn-secondary"
                    onClick={() => applyTemplate(template.name)}
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="admin-footer">
        <small>
          🔒 All changes are backed up and audited • Rate limited • Auto-draft saved •
          Session expires in {Math.floor((new Date(token ? JSON.parse(atob(token.split('.')[1])).exp * 1000 : Date.now()) - Date.now()) / (1000 * 60 * 60))} hours
        </small>
      </div>
    </div>
  );
};

const ConfigEditor = ({ config, updateValue, expandedSections, toggleSection, addArrayItem, removeArrayItem, searchTerm }) => {
  const filteredConfig = React.useMemo(() => {
    if (!searchTerm) return config;

    const filterObject = (obj, term) => {
      const filtered = {};
      for (const [key, value] of Object.entries(obj)) {
        if (key.toLowerCase().includes(term.toLowerCase())) {
          filtered[key] = value;
        } else if (typeof value === 'object' && value !== null) {
          const nested = filterObject(value, term);
          if (Object.keys(nested).length > 0) {
            filtered[key] = nested;
          }
        } else if (typeof value === 'string' && value.toLowerCase().includes(term.toLowerCase())) {
          filtered[key] = value;
        }
      }
      return filtered;
    };

    return filterObject(config, searchTerm);
  }, [config, searchTerm]);

  return (
    <div className="config-editor">
      {Object.entries(filteredConfig).map(([key, value]) => (
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

const ConfigField = ({ fieldKey, value, path, updateValue, expandedSections, toggleSection, addArrayItem, removeArrayItem }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = () => {
    updateValue(path, localValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(value);
    setIsEditing(false);
  };

  const getInputType = (val) => {
    if (typeof val === 'boolean') return 'checkbox';
    if (typeof val === 'number') return 'number';
    if (typeof val === 'string') {
      if (val.startsWith('#') && (val.length === 4 || val.length === 7)) return 'color';
      if (val.includes('\n')) return 'textarea';
      return 'text';
    }
    return 'text';
  };

  const renderValue = (val, currentPath) => {
    if (val === null || val === undefined) {
      return <span className="null-value">null</span>;
    }

    if (Array.isArray(val)) {
      const isExpanded = expandedSections[currentPath];
      return (
        <div className="array-field">
          <div className="array-header" onClick={() => toggleSection(currentPath)}>
            <span className="array-toggle">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
            <span className="array-label">Array ({val.length} items)</span>
            <button
              className="add-item-btn"
              onClick={(e) => {
                e.stopPropagation();
                addArrayItem(currentPath);
              }}
              title="Add item"
            >
              <Plus size={14} />
            </button>
          </div>
          {isExpanded && (
            <div className="array-items">
              {val.map((item, index) => (
                <div key={index} className="array-item">
                  <div className="array-item-header">
                    <span className="array-index">[{index}]</span>
                    <button
                      className="remove-item-btn"
                      onClick={() => removeArrayItem(currentPath, index)}
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="array-item-content">
                    {renderValue(item, `${currentPath}.${index}`)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof val === 'object') {
      const isExpanded = expandedSections[currentPath];
      return (
        <div className="object-field">
          <div className="object-header" onClick={() => toggleSection(currentPath)}>
            <span className="object-toggle">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
            <span className="object-label">Object ({Object.keys(val).length} properties)</span>
          </div>
          {isExpanded && (
            <div className="object-properties">
              {Object.entries(val).map(([key, propValue]) => (
                <ConfigField
                  key={key}
                  fieldKey={key}
                  value={propValue}
                  path={`${currentPath}.${key}`}
                  updateValue={updateValue}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Primitive values
    const inputType = getInputType(val);
    const displayValue = val.toString();

    return (
      <div className="primitive-field">
        {isEditing ? (
          <div className="edit-controls">
            {inputType === 'textarea' ? (
              <textarea
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="edit-input"
                rows={Math.min(10, Math.max(3, displayValue.split('\n').length))}
              />
            ) : inputType === 'checkbox' ? (
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={localValue}
                  onChange={(e) => setLocalValue(e.target.checked)}
                />
                {localValue ? 'true' : 'false'}
              </label>
            ) : (
              <input
                type={inputType}
                value={localValue}
                onChange={(e) => setLocalValue(inputType === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                className="edit-input"
              />
            )}
            <div className="edit-buttons">
              <button className="save-btn" onClick={handleSave}>
                <Save size={14} />
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="display-value" onClick={() => setIsEditing(true)}>
            <span className={`value-${typeof val}`}>{displayValue}</span>
            <span className="edit-hint">Click to edit</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="config-field">
      <div className="field-header">
        <span className="field-key">{fieldKey}</span>
        <span className="field-type">{Array.isArray(value) ? 'array' : typeof value}</span>
      </div>
      <div className="field-value">
        {renderValue(value, path)}
      </div>
    </div>
  );
};

export default AdminDashboard;
