import React from 'react';
import { Sun, CloudMoon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label="Toggle colour theme"
    >
      {isDark
        ? <Sun size={18} strokeWidth={1.8} color="#ffffff" />
        : <CloudMoon size={18} strokeWidth={1.8} />}
    </button>
  );
}

export default ThemeToggle;
