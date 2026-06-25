import React, { useState, useEffect } from 'react';
import storageService from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';

export const ThemeContext = React.createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => storageService.get(STORAGE_KEYS.THEME) || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storageService.set(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
