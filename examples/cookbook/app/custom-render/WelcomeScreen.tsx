import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useUser } from './providers/user-provider';
import { useTheme } from './providers/theme-provider';

export default function WelcomeScreen() {
  const theme = useTheme();
  const user = useUser();

  return (
    <View style={styles.container}>
      <Text>Hello {user ? user.name : 'Stranger'}</Text>
      <Text>Theme: {theme}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
