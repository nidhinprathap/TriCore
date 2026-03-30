import { useEffect, useRef } from 'react';
import { useSiteSettings } from './SiteSettingsContext.jsx';

const ThemeProvider = ({ children }) => {
  const { settings } = useSiteSettings();
  const prevKeys = useRef([]);

  useEffect(() => {
    if (!settings?.theme) return;
    const root = document.documentElement;
    const newKeys = [];

    // Apply colors
    const { colors, fonts } = settings.theme;
    if (colors) {
      Object.entries(colors).forEach(([key, value]) => {
        const prop = `--color-${key}`;
        root.style.setProperty(prop, value);
        newKeys.push(prop);
      });
    }

    // Apply fonts
    if (fonts) {
      if (fonts.heading) {
        root.style.setProperty('--font-heading', `'${fonts.heading}', sans-serif`);
        newKeys.push('--font-heading');
      }
      if (fonts.body) {
        root.style.setProperty('--font-body', `'${fonts.body}', sans-serif`);
        newKeys.push('--font-body');
      }
    }

    // Clean up properties that were set previously but not in current settings
    prevKeys.current.forEach((key) => {
      if (!newKeys.includes(key)) root.style.removeProperty(key);
    });
    prevKeys.current = newKeys;

    return () => {
      newKeys.forEach((key) => root.style.removeProperty(key));
    };
  }, [settings]);

  return children;
};

export default ThemeProvider;
