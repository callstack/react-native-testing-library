import * as React from 'react';
import { render } from '@testing-library/react-native';
import { User, UserProvider } from './providers/user-provider';
import { Theme, ThemeProvider } from './providers/theme-provider';

interface RenderWithProvidersProps {
  user?: User | null;
  theme?: Theme;
}

export function renderWithProviders<T>(
  ui: React.ReactElement<T>,
  options?: RenderWithProvidersProps,
) {
  return render(
    <UserProvider.Provider value={options?.user ?? null}>
      <ThemeProvider.Provider value={options?.theme ?? 'light'}>{ui}</ThemeProvider.Provider>
    </UserProvider.Provider>,
  );
}
