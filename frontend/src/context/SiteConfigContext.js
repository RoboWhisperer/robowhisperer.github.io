import React, { createContext, useContext, useEffect, useState } from 'react';
import defaultConfig from '../config/siteConfigDefault';

const SiteConfigContext = createContext({ config: defaultConfig, loaded: false });

const mergeDeep = (target, source) => {
  if (Array.isArray(target) || Array.isArray(source)) {
    return source;
  }
  if (typeof target !== 'object' || typeof source !== 'object') return source;
  const output = { ...target };
  Object.keys(source).forEach((key) => {
    if (key in target) {
      output[key] = mergeDeep(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  });
  return output;
};

export const SiteConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/site-config.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Site config not available');
        }
        return response.json();
      })
      .then((data) => setConfig((prevConfig) => mergeDeep(prevConfig, data)))
      .catch(() => {
        // Keep default config if fetch fails
      })
      .finally(() => setLoaded(true));
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, loaded }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => useContext(SiteConfigContext);
