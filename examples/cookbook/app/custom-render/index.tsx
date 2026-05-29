import * as React from 'react';

import { ThemeProvider } from './providers/theme-provider';
import { UserProvider } from './providers/user-provider';
import WelcomeScreen from './WelcomeScreen';

export default function Example() {
  return (
    <UserProvider.Provider value={null}>
      <ThemeProvider.Provider value={'light'}>
        <WelcomeScreen />
      </ThemeProvider.Provider>
    </UserProvider.Provider>
  );
}
