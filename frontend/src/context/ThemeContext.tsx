import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lock the theme to 'dark' permanently to preserve the cyberpunk/geek design aesthetic
  const theme: Theme = 'dark';
  const resolvedTheme: 'dark' = 'dark';

  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('theme', 'dark');
    root.classList.add('dark');
    // Ensure light mode classes are never applied
    root.classList.remove('light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: () => {}, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
