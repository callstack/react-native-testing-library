import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default function DetailsScreen({ route }) {
  const item = route.params;

  return (
    <View>
      <Text accessibilityRole="header" style={styles.header}>
        Details for {item.title}
      </Text>
      <Text style={styles.body}>
        The number you have chosen is {item.value}.
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
  body: {
    textAlign: 'center',
  },
});
