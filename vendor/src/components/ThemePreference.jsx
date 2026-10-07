import React, { useEffect, useState } from 'react';
import { ToggleButton } from './Icons';

export const THEME_STORAGE_KEY = 'youshop_theme';
export const THEME_CHANGE_EVENT = 'youshop-theme-change';

const getTheme = () => localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }));
};

const ThemePreference = () => {
  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    const handleThemeChange = (event) => {
      const nextTheme = event.detail || event.newValue;
      if (nextTheme === 'light' || nextTheme === 'dark') setTheme(nextTheme);
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.addEventListener('storage', handleThemeChange);
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <div className="theme-preference-row">
      <div>
        <strong>Appearance: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</strong>
        <span>Use the same theme across vendor, driver, registration, and dashboard pages</span>
      </div>
      <ToggleButton checked={theme === 'dark'} onChange={toggleTheme} />
    </div>
  );
};

export default ThemePreference;