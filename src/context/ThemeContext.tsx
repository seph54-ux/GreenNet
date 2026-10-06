import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeId, ThemeOption, THEME_OPTIONS } from '../types/theme';

interface ThemeContextType {
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  themeConfig: ThemeOption;
  themeOptions: ThemeOption[];
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentThemeState] = useState<ThemeId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('greennet_theme') as ThemeId;
      if (saved && THEME_OPTIONS.some((t) => t.id === saved)) {
        return saved;
      }
    }
    return 'botanical-dark';
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  const setTheme = (theme: ThemeId) => {
    setCurrentThemeState(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('greennet_theme', theme);
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentTheme);
      // For light mode, we can also toggle a 'theme-light' class if needed
      if (currentTheme === 'daylight-clean') {
        document.documentElement.classList.add('theme-light');
      } else {
        document.documentElement.classList.remove('theme-light');
      }
    }
  }, [currentTheme]);

  const themeConfig = THEME_OPTIONS.find((t) => t.id === currentTheme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        themeConfig,
        themeOptions: THEME_OPTIONS,
        isThemeModalOpen,
        setIsThemeModalOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
