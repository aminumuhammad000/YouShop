import React from 'react';

const ThemeToggle = ({ theme, onToggle }) => (
  <button
    type="button"
    className="global-theme-toggle"
    onClick={onToggle}
    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
  >
    <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
    <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
  </button>
);

export default ThemeToggle;