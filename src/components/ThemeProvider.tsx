import React, { createContext, useContext, useState, ReactNode } from 'react';
import themes, { ThemeMode } from '../theme/theme';

type ThemeContextType = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  colors: typeof themes.dark;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children, initial = 'dark' as ThemeMode }: { children: ReactNode; initial?: ThemeMode }) => {
  const [mode, setMode] = useState<ThemeMode>(initial);

  const value: ThemeContextType = {
    mode,
    setMode,
    colors: themes[mode],
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default ThemeProvider;
