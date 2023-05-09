import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <View>
      <Text accessibilityRole="header" style={styles.header}>
        Settings screen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 16,
  },
});
