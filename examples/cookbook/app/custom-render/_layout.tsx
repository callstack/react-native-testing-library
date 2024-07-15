import { Slot } from 'expo-router';
import { UserProvider } from './providers/user-provider';
import { ThemeProvider } from './providers/theme-provider';

export default function CustomRenderLayout() {
  return (
    <UserProvider.Provider value={null}>
      <ThemeProvider.Provider value={'light'}>
        <Slot />
      </ThemeProvider.Provider>
    </UserProvider.Provider>
  );
}
