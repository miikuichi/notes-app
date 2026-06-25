import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/** Convenience hook — throws if used outside <ThemeProvider>. */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
