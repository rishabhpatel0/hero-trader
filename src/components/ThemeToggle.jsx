import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <>
          <Moon size={18} className="toggle-icon" />
          <span className="toggle-text">Dark Mode</span>
        </>
      ) : (
        <>
          <Sun size={18} className="toggle-icon" />
          <span className="toggle-text">Light Mode</span>
        </>
      )}
    </button>
  );
}
