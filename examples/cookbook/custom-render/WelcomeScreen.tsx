import * as React from 'react';
import { View, Text } from 'react-native';
import { useUser } from './providers/user-provider';
import { useTheme } from './providers/theme-provider';

export function WelcomeScreen() {
  const theme = useTheme();
  const user = useUser();

  return (
    <View>
      <Text>{user ? `User: ${user.name}` : 'Not logged in.'}</Text>
      <Text>Theme: {theme}</Text>
    </View>
  );
}
