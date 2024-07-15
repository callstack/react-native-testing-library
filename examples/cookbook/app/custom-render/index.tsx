import * as React from 'react';
import { Text, View } from 'react-native';
import { useUser } from './providers/user-provider';
import { useTheme } from './providers/theme-provider';

export default function WelcomeScreen() {
  const theme = useTheme();
  const user = useUser();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Hello {user ? user.name : 'Stranger'}</Text>
      <Text>Theme: {theme}</Text>
    </View>
  );
}
