import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

type Props = {
  user: string;
};

export function Home({ user }: Props) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Welcome {user}!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    alignSelf: 'center',
    fontSize: 24,
    marginTop: 8,
    marginBottom: 40,
  },
});
