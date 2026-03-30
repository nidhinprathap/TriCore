import { createContext, useContext, useState, useEffect } from 'react';
import { getSettings } from '../api/contentApi.js';
import { fallbackSettings } from '../utils/fallbackContent.js';

const SiteSettingsContext = createContext(null);

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(fallbackSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then((res) => setSettings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, setSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  return ctx;
};
