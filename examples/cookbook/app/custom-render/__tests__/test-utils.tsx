import { render } from '@testing-library/react-native';
import * as React from 'react';

import { Theme, ThemeProvider } from '../../../app/custom-render/providers/theme-provider';
import { User, UserProvider } from '../../../app/custom-render/providers/user-provider';

interface RenderWithProvidersProps {
  user?: User | null;
  theme?: Theme;
}

export async function renderWithProviders<T>(
  ui: React.ReactElement<T>,
  options?: RenderWithProvidersProps,
) {
  return await render(
    <UserProvider.Provider value={options?.user ?? null}>
      <ThemeProvider.Provider value={options?.theme ?? 'light'}>{ui}</ThemeProvider.Provider>
    </UserProvider.Provider>,
  );
}
