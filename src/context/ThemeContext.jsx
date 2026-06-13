import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('portfolio-theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  // Keep html class in sync
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Initialize once if localStorage changed since initialization
  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved && saved !== theme) setTheme(saved);
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('portfolio-theme', newTheme);
    } catch (e) {}
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
