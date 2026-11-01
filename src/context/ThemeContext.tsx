
import React, { createContext, useContext, useEffect } from 'react';

export type Theme = 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.add('dark');
    root.classList.remove('light');

    body.classList.add('dark');
    body.classList.remove('light');

    root.style.colorScheme = 'dark';
    body.style.backgroundColor = '#020817';
    body.style.color = '#f1f5f9';
  }, []);

  const setTheme = (_theme: Theme) => {};
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
