import * as React from 'react';

export type Theme = 'light' | 'dark';
export const ThemeProvider = React.createContext<Theme | undefined>(undefined);

export function useTheme() {
  const theme = React.useContext(ThemeProvider);
  if (theme === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return theme;
}
